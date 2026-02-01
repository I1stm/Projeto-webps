import React, { useState, useEffect } from 'react';
import CorpoHumano from './CorpoHumano';
import { supabase } from './supabaseClient';
import Login from './Login';
import ModalForm from './ModalForm';
import Toast from './Toast';
import './App.css'; 
import HeaderSecao from './HeaderSecao';

// Versão nova Super Admin
function App() {
  // --- ESTADOS GERAIS ---
  const [darkMode, setDarkMode] = useState(true);
  const [parteSelecionada, setParteSelecionada] = useState(null);
  const [subAreaSelecionada, setSubAreaSelecionada] = useState(null);
  const [vista, setVista] = useState('frente');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // DADOS DO BANCO
  const [subMenus, setSubMenus] = useState([]);
  const [listaProtocolos, setListaProtocolos] = useState([]);
  
  // MODAL E NOTIFICAÇÕES
  const [modalAberto, setModalAberto] = useState(false);
  const [itemEmEdicao, setItemEmEdicao] = useState(null);
  const [toast, setToast] = useState(null);

  // BUSCA E LOGIN
  const [termoBusca, setTermoBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [sessao, setSessao] = useState(null);
  
  // --- PERMISSÕES E GESTÃO DE EQUIPE ---
  const [isAdmin, setIsAdmin] = useState(false);         
  const [isSuperAdmin, setIsSuperAdmin] = useState(false); 
  const [mostrarLogin, setMostrarLogin] = useState(false);
  
  // Modal de Gestão de Usuários
  const [modalUsuariosAberto, setModalUsuariosAberto] = useState(false);
  const [listaUsuarios, setListaUsuarios] = useState([]);

  // --- EFEITOS (Dark Mode e Auth) ---
  useEffect(() => {
    if (darkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [darkMode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessao(session);
      if (session) checarPermissoes(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessao(session);
      if (session) {
        checarPermissoes(session.user.id);
        setMostrarLogin(false);
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setModoEdicao(false);
        setParteSelecionada(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function checarPermissoes(userId) {
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
    if (data) {
      // Admin normal OU Super Admin podem editar protocolos
      setIsAdmin(data.role === 'admin' || data.role === 'super_admin');
      // Apenas Super Admin pode gerenciar equipe
      setIsSuperAdmin(data.role === 'super_admin');
    }
  }

  // --- CARREGAMENTO DE DADOS ---
  useEffect(() => {
    if (parteSelecionada) {
      setTermoBusca('');
      setSubAreaSelecionada(null); 
      carregarDadosDaParte(parteSelecionada);
    }
  }, [parteSelecionada]);

  async function carregarDadosDaParte(idParte) {
    setLoading(true);
    const { data: subs } = await supabase.from('sub_areas').select('*').eq('body_part_id', idParte).order('name');
    setSubMenus(subs || []);

    const { data: protos } = await supabase.from('protocols').select('*').eq('body_part_id', idParte).order('created_at', { ascending: false });
    setListaProtocolos(protos || []);
    setLoading(false);
  }

  const protocolosVisiveis = subAreaSelecionada
    ? listaProtocolos.filter(p => p.sub_area_id === subAreaSelecionada)
    : listaProtocolos;

  // --- BUSCA GLOBAL ---
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (termoBusca.length > 2) realizarBusca(termoBusca);
      else setResultadosBusca([]);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [termoBusca]);

  async function realizarBusca(texto) {
    setBuscando(true);
    setParteSelecionada(null);
    const { data, error } = await supabase.from('protocols').select('*, body_parts(display_name)')
      .or(`problema.ilike.%${texto}%,locais.ilike.%${texto}%,exame.ilike.%${texto}%`).limit(20);
    
    if (error) {
       // Fallback se der erro no join
       const { data: dataBackup } = await supabase.from('protocols').select('*')
        .or(`problema.ilike.%${texto}%,locais.ilike.%${texto}%,exame.ilike.%${texto}%`).limit(20);
       setResultadosBusca(dataBackup || []);
    } else {
      setResultadosBusca(data || []);
    }
    setBuscando(false);
  }

  // --- FUNÇÕES DE PROTOCOLOS (CRUD) ---
  const abrirModalCriar = () => { if (parteSelecionada && isAdmin) { setItemEmEdicao(null); setModalAberto(true); } };
  const abrirModalEditar = (item) => { if (isAdmin) { setItemEmEdicao(item); setModalAberto(true); } };

  const salvarDadosDoModal = async (dados) => {
    setModalAberto(false);
    try {
      if (itemEmEdicao) {
        const { error } = await supabase.from('protocols').update({ problema: dados.problema, locais: dados.locais, exame: dados.exame }).eq('id', itemEmEdicao.id);
        if (error) throw error;
        setToast({ mensagem: 'Atualizado!', tipo: 'sucesso' });
      } else {
        const { error } = await supabase.from('protocols').insert([{ body_part_id: parteSelecionada, sub_area_id: subAreaSelecionada, problema: dados.problema, locais: dados.locais, exame: dados.exame || "Consulta" }]);
        if (error) throw error;
        setToast({ mensagem: 'Adicionado!', tipo: 'sucesso' });
      }
      if (parteSelecionada) carregarDadosDaParte(parteSelecionada);
      if (termoBusca) realizarBusca(termoBusca);
    } catch (e) { setToast({ mensagem: 'Erro ao salvar.', tipo: 'erro' }); }
  };

  const remover = async (id, origem = 'lista') => {
    if (!isAdmin || !window.confirm("Apagar item?")) return;
    const { error } = await supabase.from('protocols').delete().eq('id', id);
    if (!error) {
      setToast({ mensagem: 'Removido.', tipo: 'sucesso' });
      if (origem === 'busca') setResultadosBusca(prev => prev.filter(item => item.id !== id));
      else carregarDadosDaParte(parteSelecionada);
    }
  };

  const apagarSubMenu = async (idSub, nomeSub) => {
    if (!isAdmin || !modoEdicao) return;
    if (window.confirm(`Excluir categoria "${nomeSub}"?`)) {
      const { error } = await supabase.from('sub_areas').delete().eq('id', idSub);
      if (!error) { if (subAreaSelecionada === idSub) setSubAreaSelecionada(null); carregarDadosDaParte(parteSelecionada); }
    }
  };

  // --- FUNÇÕES DE SUPER ADMIN (GESTÃO DE EQUIPE) ---
  const abrirModalUsuarios = async () => {
    if (!isSuperAdmin) return;
    setModalUsuariosAberto(true);
    const { data } = await supabase.from('profiles').select('*').order('email');
    setListaUsuarios(data || []);
  };

  const alterarCargo = async (idUsuario, novoCargo) => {
    if (!window.confirm(`Tem certeza que deseja mudar o cargo para: ${novoCargo}?`)) return;
    
    const { error } = await supabase.from('profiles').update({ role: novoCargo }).eq('id', idUsuario);
    
    if (error) {
      alert('Erro ao alterar cargo: ' + error.message);
    } else {
      setToast({ mensagem: 'Cargo alterado com sucesso!', tipo: 'sucesso' });
      // Recarrega a lista
      const { data } = await supabase.from('profiles').select('*').order('email');
      setListaUsuarios(data || []);
    }
  };

  // --- RENDERIZAÇÃO ---
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {mostrarLogin && <Login aoFechar={() => setMostrarLogin(false)} />}
      <ModalForm isOpen={modalAberto} onClose={() => setModalAberto(false)} onSave={salvarDadosDoModal} itemEdicao={itemEmEdicao} />
      {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} onClose={() => setToast(null)} />}

      {/* MODAL DE USUÁRIOS (SUPER ADMIN) */}
      {modalUsuariosAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', border: '1px solid var(--destaque)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <h2 style={{ margin: 0, color: 'var(--destaque)' }}>Gestão da Equipe</h2>
              <button onClick={() => setModalUsuariosAberto(false)} style={{ background: 'none', border: 'none', color: 'var(--texto-primario)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--texto-primario)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--borda)', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Email</th>
                  <th style={{ padding: '10px' }}>Cargo Atual</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {listaUsuarios.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--borda)' }}>
                    <td style={{ padding: '10px', fontSize:'14px' }}>
                      {u.email} 
                      {u.role === 'super_admin' && <span style={{marginLeft:'5px'}}>👑</span>}
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ 
                        padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                        backgroundColor: u.role === 'admin' || u.role === 'super_admin' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(128, 128, 128, 0.1)',
                        color: u.role === 'admin' || u.role === 'super_admin' ? 'var(--destaque)' : 'var(--texto-secundario)'
                      }}>
                        {u.role ? u.role.toUpperCase() : 'USER'}
                      </span>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      {u.role !== 'super_admin' && ( // Não pode rebaixar outro super admin por aqui
                        <>
                          {u.role === 'admin' ? (
                            <button onClick={() => alterarCargo(u.id, 'user')} style={{ padding: '4px 8px', fontSize: '12px', background: '#ff5252', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                              Rebaixar para User
                            </button>
                          ) : (
                            <button onClick={() => alterarCargo(u.id, 'admin')} style={{ padding: '4px 8px', fontSize: '12px', background: 'var(--destaque)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                              Promover a Admin
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header style={{ height: '70px', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--borda)', flexShrink: 0 }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--destaque)' }}>SISREG<span style={{ fontSize: '10px', opacity: 0.7 }}>PRO</span></div>
        
        {/* BUSCA */}
        {sessao && (
          <div style={{ flex: 1, maxWidth: '400px', margin: '0 20px', position: 'relative' }}>
            <span style={{position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)'}}>🔍</span>
            <input type="text" placeholder="Pesquisar..." value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)}
              style={{ width: '100%', padding: '8px 15px 8px 35px', borderRadius: '20px', border: '1px solid var(--borda)', background: 'var(--input-bg)', color: 'var(--texto-primario)', outline: 'none' }} />
            {termoBusca && <button onClick={() => setTermoBusca('')} style={{position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', border:'none', background:'transparent', cursor:'pointer', color:'var(--texto-secundario)'}}>✖</button>}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {sessao?.user?.email && (
            <div style={{ textAlign: 'right', fontSize: '12px' }}>
              <span style={{ color: 'var(--texto-secundario)' }}>Olá, </span>
              <span style={{ color: isSuperAdmin ? '#FFD700' : 'var(--destaque)', fontWeight: 'bold' }}>{sessao.user.email}</span>
            </div>
          )}
          
          <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>{darkMode ? '☀️' : '🌙'}</button>
          
          {!sessao ? (
            <button onClick={() => setMostrarLogin(true)} style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid var(--destaque)', color: 'var(--destaque)', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>Entrar</button>
          ) : (
            <>
              {/* BOTÃO EXCLUSIVO SUPER ADMIN: GESTÃO DE EQUIPE */}
              {isSuperAdmin && (
                <button 
                  onClick={abrirModalUsuarios} 
                  style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid #FFD700', color: '#FFD700', background: 'transparent', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  👥 Equipe
                </button>
              )}

              {isAdmin && (
                <button 
                  onClick={() => setModoEdicao(!modoEdicao)} 
                  style={{ 
                    padding: '6px 12px', borderRadius: '20px', 
                    border: `1px solid ${modoEdicao ? '#ff5252' : 'var(--borda)'}`, 
                    color: modoEdicao ? '#ff5252' : 'var(--texto-secundario)', 
                    background: 'transparent', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' 
                  }}
                >
                  {modoEdicao ? '🔓 EDITANDO' : '🔒 ADMIN'}
                </button>
              )}
              <button onClick={() => supabase.auth.signOut()} style={{ fontSize: '12px', color: 'var(--texto-secundario)', background:'none', border:'none', cursor:'pointer', textDecoration: 'underline' }}>Sair</button>
            </>
          )}
        </div>
      </header>

      {/* CONTEÚDO */}
      <main style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {!sessao ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-pagina)', color: 'var(--texto-primario)', textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔒</div>
            <h1 style={{ color: 'var(--destaque)' }}>Acesso Restrito</h1>
            <p style={{ maxWidth: '400px', lineHeight: '1.6', color: 'var(--texto-secundario)', marginBottom: '30px' }}>Faça login para acessar o sistema.</p>
            <button onClick={() => setMostrarLogin(true)} style={{ padding: '12px 30px', fontSize: '16px', backgroundColor: 'var(--destaque)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Fazer Login</button>
          </div>
        ) : (
          <>
            <section style={{ flex: 1, position: 'relative', borderRight: '1px solid var(--borda)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <button onClick={() => { setVista(v => v === 'frente' ? 'costas' : 'frente'); setParteSelecionada(null); }} style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, padding: '8px', borderRadius: '8px', border: '1px solid var(--borda)', background: 'var(--bg-card)', color: 'var(--texto-primario)', cursor: 'pointer' }}>🔄 {vista.toUpperCase()}</button>
              <div style={{ height: '90%', width: '100%', maxWidth: '350px' }}>
                <CorpoHumano aoSelecionar={setParteSelecionada} parteAtiva={parteSelecionada} vista={vista} />
              </div>
            </section>
            <section style={{ flex: 1.3, padding: '30px', backgroundColor: 'var(--bg-card)', overflowY: 'auto' }}>
              {termoBusca.length > 0 ? (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                  <h2 style={{ color: 'var(--destaque)', margin: 0 }}>Busca Global</h2>
                  <hr style={{ borderColor: 'var(--borda)', opacity: 0.3, margin: '20px 0' }} />
                  {!buscando && resultadosBusca.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {resultadosBusca.map((item) => <CardProtocolo key={item.id} item={item} isAdmin={isAdmin} modoEdicao={modoEdicao} onEdit={abrirModalEditar} onRemove={(id) => remover(id, 'busca')} showTag={true} />)}
                    </div>
                  ) : <p>Nada encontrado.</p>}
                </div>
              ) : (
                parteSelecionada ? (
                  <div style={{ animation: 'fadeIn 0.3s' }}>
                    <HeaderSecao parteSelecionada={parteSelecionada} isAdmin={isAdmin} modoEdicao={modoEdicao} aoAbrirModalProtocolo={abrirModalCriar} aoAtualizar={() => carregarDadosDaParte(parteSelecionada)} />
                    {subMenus.length > 0 && (
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', margin: '20px 0', alignItems: 'flex-start' }}>
                        <button onClick={() => setSubAreaSelecionada(null)} style={{ padding: '6px 12px', borderRadius: '15px', border: '1px solid var(--destaque)', cursor: 'pointer', fontSize: '13px', background: subAreaSelecionada === null ? 'var(--destaque)' : 'transparent', color: subAreaSelecionada === null ? '#fff' : 'var(--destaque)' }}>Todos</button>
                        {subMenus.map(sub => (
                          <div key={sub.id} style={{ position: 'relative' }}>
                            <button onClick={() => setSubAreaSelecionada(sub.id)} style={{ padding: '6px 12px', borderRadius: '15px', border: '1px solid var(--destaque)', cursor: 'pointer', fontSize: '13px', background: subAreaSelecionada === sub.id ? 'var(--destaque)' : 'transparent', color: subAreaSelecionada === sub.id ? '#fff' : 'var(--destaque)' }}>{sub.name}</button>
                            {modoEdicao && isAdmin && <button onClick={(e) => { e.stopPropagation(); apagarSubMenu(sub.id, sub.name); }} style={{ position: 'absolute', top: '-8px', right: '-8px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#ff5252', color: 'white', border: 'none', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', zIndex: 5 }}>X</button>}
                          </div>
                        ))}
                      </div>
                    )}
                    <hr style={{ borderColor: 'var(--borda)', opacity: 0.3, margin: '20px 0' }} />
                    {loading && <p>Carregando...</p>}
                    {!loading && protocolosVisiveis.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {protocolosVisiveis.map((item) => <CardProtocolo key={item.id} item={item} isAdmin={isAdmin} modoEdicao={modoEdicao} onEdit={abrirModalEditar} onRemove={remover} />)}
                      </div>
                    ) : (!loading && <div style={{textAlign:'center', color:'var(--texto-secundario)', padding:'20px', border:'2px dashed var(--borda)', borderRadius:'10px'}}><p>Nenhum protocolo nesta seção.</p></div>)}
                  </div>
                ) : <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}><span style={{ fontSize: '40px' }}>👈</span><h3>Selecione uma área</h3></div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

const CardProtocolo = ({ item, isAdmin, modoEdicao, onEdit, onRemove, showTag }) => {
  const renderLocais = (texto) => texto ? texto.split('/').map((p, i, a) => <span key={i}>{p.trim()}{i < a.length - 1 && <span style={{ color: 'var(--destaque)', fontWeight: 'bold', margin: '0 6px' }}>/</span>}</span>) : null;
  return (
    <div style={{ padding: '15px', borderRadius: '8px', backgroundColor: 'var(--bg-pagina)', borderLeft: '4px solid var(--destaque)', position: 'relative', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
      {showTag && item.body_parts && <span style={{ fontSize:'10px', textTransform:'uppercase', background:'var(--destaque)', color:'#fff', padding:'2px 6px', borderRadius:'4px', marginBottom:'5px', display:'inline-block' }}>{item.body_parts.display_name}</span>}
      <h4 style={{ margin: '0 0 8px 0', color: 'var(--texto-primario)', fontSize: '16px' }}>{item.problema}</h4>
      <div style={{ fontSize: '13px', color: 'var(--texto-secundario)' }}><div>🏥 <strong style={{color:'var(--texto-primario)'}}>Local:</strong> {renderLocais(item.locais)}</div><div>📋 <strong style={{color:'var(--texto-primario)'}}>Exame:</strong> {item.exame}</div></div>
      {modoEdicao && isAdmin && <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: '5px' }}><button onClick={() => onEdit(item)} style={{ border: '1px solid var(--destaque)', color: 'var(--destaque)', background: 'transparent', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', padding: '2px 8px', fontWeight: 'bold' }}>Editar</button><button onClick={() => onRemove(item.id)} style={{ border: '1px solid #ff5252', color: '#ff5252', background: 'transparent', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', padding: '2px 8px' }}>X</button></div>}
    </div>
  );
};

export default App;