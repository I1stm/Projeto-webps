import React, { useState, useEffect } from 'react';
import CorpoHumano from './CorpoHumano';
import { supabase } from './supabaseClient';
import Login from './Login';
import ModalForm from './ModalForm';
import Toast from './Toast';
import './App.css'; 

function App() {
  // --- ESTADOS GERAIS ---
  const [darkMode, setDarkMode] = useState(true);
  const [parteSelecionada, setParteSelecionada] = useState(null);
  const [subAreaSelecionada, setSubAreaSelecionada] = useState(null);
  const [vista, setVista] = useState('frente');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // DADOS
  const [subMenus, setSubMenus] = useState([]);
  const [listaProtocolos, setListaProtocolos] = useState([]);
  
  // INTERFACE
  const [modalAberto, setModalAberto] = useState(false);
  const [itemEmEdicao, setItemEmEdicao] = useState(null);
  const [toast, setToast] = useState(null);

  // BUSCA E LOGIN
  const [termoBusca, setTermoBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [sessao, setSessao] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);

  // --- EFEITOS ---
  useEffect(() => {
    if (darkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [darkMode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessao(session);
      if (session) checarAdmin(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessao(session);
      if (session) {
        checarAdmin(session.user.id);
        setMostrarLogin(false);
      } else {
        setIsAdmin(false);
        setModoEdicao(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function checarAdmin(userId) {
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
    setIsAdmin(data?.role === 'admin');
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


  // --- FUNÇÕES DE CRUD (SUB-MENUS) --- NOVA FUNÇÃO AQUI
  const criarSubMenu = async () => {
    if (!parteSelecionada || !isAdmin) return;
    
    const nome = prompt(`Nova Categoria para ${parteSelecionada.replace(/-/g, ' ')}:`);
    if (!nome) return;

    const { error } = await supabase
      .from('sub_areas')
      .insert([{ body_part_id: parteSelecionada, name: nome }]);

    if (error) {
      setToast({ mensagem: 'Erro ao criar categoria.', tipo: 'erro' });
    } else {
      setToast({ mensagem: 'Categoria criada!', tipo: 'sucesso' });
      carregarDadosDaParte(parteSelecionada); // Recarrega para aparecer o botão novo
    }
  };

  const apagarSubMenu = async (idSub) => {
    if (!window.confirm("Isso apagará a categoria e deixará os itens dela 'soltos'. Continuar?")) return;
    
    const { error } = await supabase.from('sub_areas').delete().eq('id', idSub);
    if (error) setToast({ mensagem: 'Erro ao apagar.', tipo: 'erro' });
    else {
      setSubAreaSelecionada(null);
      carregarDadosDaParte(parteSelecionada);
    }
  };

  // --- FUNÇÕES DE CRUD (PROTOCOLOS) ---

  const abrirModalCriar = () => {
    if (!parteSelecionada || !isAdmin) return;
    setItemEmEdicao(null);
    setModalAberto(true);
  };

  const abrirModalEditar = (item) => {
    if (!isAdmin) return;
    setItemEmEdicao(item);
    setModalAberto(true);
  };

  const salvarDadosDoModal = async (dadosDoFormulario) => {
    setModalAberto(false);
    try {
      if (itemEmEdicao) {
        const { error } = await supabase.from('protocols').update({ 
            problema: dadosDoFormulario.problema, 
            locais: dadosDoFormulario.locais, 
            exame: dadosDoFormulario.exame 
          }).eq('id', itemEmEdicao.id);
        if (error) throw error;
        setToast({ mensagem: 'Atualizado com sucesso!', tipo: 'sucesso' });
      } else {
        const novoItem = {
          body_part_id: parteSelecionada,
          sub_area_id: subAreaSelecionada, 
          problema: dadosDoFormulario.problema,
          locais: dadosDoFormulario.locais,
          exame: dadosDoFormulario.exame || "Consulta"
        };
        const { error } = await supabase.from('protocols').insert([novoItem]);
        if (error) throw error;
        setToast({ mensagem: 'Adicionado com sucesso!', tipo: 'sucesso' });
      }
      if (parteSelecionada) carregarDadosDaParte(parteSelecionada);
      if (termoBusca) realizarBusca(termoBusca);
    } catch (error) {
      console.error(error);
      setToast({ mensagem: 'Erro ao salvar.', tipo: 'erro' });
    }
  };

  const remover = async (id, origem = 'lista') => {
    if (!isAdmin || !window.confirm("Tem certeza que deseja apagar?")) return;
    const { error } = await supabase.from('protocols').delete().eq('id', id);
    if (error) {
      setToast({ mensagem: 'Erro ao apagar.', tipo: 'erro' });
    } else {
      setToast({ mensagem: 'Item removido.', tipo: 'sucesso' });
      if (origem === 'busca') setResultadosBusca(prev => prev.filter(item => item.id !== id));
      else carregarDadosDaParte(parteSelecionada);
    }
  };

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
    const { data } = await supabase.from('protocols').select('*, body_parts(display_name)')
      .or(`problema.ilike.%${texto}%, locais.ilike.%${texto}%, exame.ilike.%${texto}%`)
      .limit(20);
    setResultadosBusca(data || []);
    setBuscando(false);
  }

  // --- RENDERIZAÇÃO ---
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {mostrarLogin && <Login aoFechar={() => setMostrarLogin(false)} />}
      <ModalForm isOpen={modalAberto} onClose={() => setModalAberto(false)} onSave={salvarDadosDoModal} itemEdicao={itemEmEdicao} />
      {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} onClose={() => setToast(null)} />}

      <header style={{ height: '70px', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--borda)', flexShrink: 0 }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--destaque)' }}>SISREG<span style={{ fontSize: '10px', opacity: 0.7 }}>PRO</span></div>
        <div style={{ flex: 1, maxWidth: '400px', margin: '0 20px', position: 'relative' }}>
          <span style={{position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)'}}>🔍</span>
          <input type="text" placeholder="Pesquisar..." value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)}
            style={{ width: '100%', padding: '8px 15px 8px 35px', borderRadius: '20px', border: '1px solid var(--borda)', background: 'var(--input-bg)', color: 'var(--texto-primario)', outline: 'none' }} />
          {termoBusca && <button onClick={() => setTermoBusca('')} style={{position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', border:'none', background:'transparent', cursor:'pointer', color:'var(--texto-secundario)'}}>✖</button>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {sessao?.user?.email && <div style={{ textAlign: 'right', fontSize: '12px' }}><span style={{ color: 'var(--texto-secundario)' }}>Olá, </span><span style={{ color: 'var(--destaque)', fontWeight: 'bold' }}>{sessao.user.email}</span></div>}
          <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>{darkMode ? '☀️' : '🌙'}</button>
          {!sessao ? (
            <button onClick={() => setMostrarLogin(true)} style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid var(--destaque)', color: 'var(--destaque)', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>Entrar</button>
          ) : (
            <>
              {isAdmin && <button onClick={() => setModoEdicao(!modoEdicao)} style={{ padding: '6px 12px', borderRadius: '20px', border: `1px solid ${modoEdicao ? '#ff5252' : 'var(--borda)'}`, color: modoEdicao ? '#ff5252' : 'var(--texto-secundario)', background: 'transparent', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>{modoEdicao ? '🔓 EDITANDO' : '🔒 ADMIN'}</button>}
              <button onClick={() => supabase.auth.signOut()} style={{ fontSize: '12px', color: 'var(--texto-secundario)', background:'none', border:'none', cursor:'pointer', textDecoration: 'underline' }}>Sair</button>
            </>
          )}
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
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
                   {resultadosBusca.map((item) => (
                     <CardProtocolo key={item.id} item={item} isAdmin={isAdmin} modoEdicao={modoEdicao} onEdit={abrirModalEditar} onRemove={(id) => remover(id, 'busca')} showTag={true} />
                   ))}
                 </div>
              ) : <p>Nada encontrado.</p>}
            </div>
          ) : (
            parteSelecionada ? (
              <div style={{ animation: 'fadeIn 0.3s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ color: 'var(--destaque)', margin: 0, textTransform: 'capitalize' }}>{parteSelecionada.replace(/-/g, ' ')}</h2>
                  {modoEdicao && isAdmin && <button onClick={abrirModalCriar} style={{ background: 'var(--destaque)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>+ Novo Protocolo</button>}
                </div>

                {/* --- ÁREA DE SUB-MENUS ATUALIZADA --- */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '20px 0', alignItems: 'center' }}>
                    <button onClick={() => setSubAreaSelecionada(null)} style={{ padding: '6px 12px', borderRadius: '15px', border: '1px solid var(--destaque)', cursor: 'pointer', fontSize: '13px', background: subAreaSelecionada === null ? 'var(--destaque)' : 'transparent', color: subAreaSelecionada === null ? '#fff' : 'var(--destaque)' }}>Todos</button>
                    
                    {subMenus.map(sub => (
                      <div key={sub.id} style={{ position: 'relative', display: 'flex' }}>
                        <button onClick={() => setSubAreaSelecionada(sub.id)} style={{ padding: '6px 12px', borderRadius: '15px', border: '1px solid var(--destaque)', cursor: 'pointer', fontSize: '13px', background: subAreaSelecionada === sub.id ? 'var(--destaque)' : 'transparent', color: subAreaSelecionada === sub.id ? '#fff' : 'var(--destaque)' }}>{sub.name}</button>
                        
                        {/* Botãozinho para apagar Sub-menu (Só no modo edição e se estiver selecionado) */}
                        {modoEdicao && isAdmin && subAreaSelecionada === sub.id && (
                          <button onClick={(e) => { e.stopPropagation(); apagarSubMenu(sub.id); }} style={{ marginLeft: '-10px', marginTop: '-10px', background: '#ff5252', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', border: 'none', cursor: 'pointer', fontSize: '10px', zIndex: 2 }}>x</button>
                        )}
                      </div>
                    ))}
                    
                    {/* Botão CRIAR Categoria (Só no modo edição) */}
                    {modoEdicao && isAdmin && (
                      <button onClick={criarSubMenu} style={{ padding: '6px 12px', borderRadius: '15px', border: '1px dashed var(--texto-secundario)', cursor: 'pointer', fontSize: '13px', background: 'transparent', color: 'var(--texto-secundario)' }}>+ Categoria</button>
                    )}
                </div>
                
                <hr style={{ borderColor: 'var(--borda)', opacity: 0.3, margin: '20px 0' }} />
                
                {loading && <p>Carregando...</p>}
                {!loading && protocolsVisiveis.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {protocolosVisiveis.map((item) => (
                      <CardProtocolo key={item.id} item={item} isAdmin={isAdmin} modoEdicao={modoEdicao} onEdit={abrirModalEditar} onRemove={remover} />
                    ))}
                  </div>
                ) : (
                  !loading && <div style={{textAlign:'center', color:'var(--texto-secundario)', padding:'20px', border:'2px dashed var(--borda)', borderRadius:'10px'}}>
                    <p>Nenhum protocolo nesta seção.</p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                <span style={{ fontSize: '40px' }}>👈</span><h3>Selecione uma área</h3>
              </div>
            )
          )}
        </section>
      </main>
    </div>
  );
}

const CardProtocolo = ({ item, isAdmin, modoEdicao, onEdit, onRemove, showTag }) => {
  const renderLocais = (textoLocais) => {
    if (!textoLocais) return null;
    const partes = textoLocais.split('/');
    return partes.map((parte, index) => (
      <span key={index}>
        {parte.trim()}
        {index < partes.length - 1 && <span style={{ color: 'var(--destaque)', fontWeight: 'bold', margin: '0 6px' }}>/</span>}
      </span>
    ));
  };
  return (
    <div style={{ padding: '15px', borderRadius: '8px', backgroundColor: 'var(--bg-pagina)', borderLeft: '4px solid var(--destaque)', position: 'relative', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
      {showTag && item.body_parts && <span style={{ fontSize:'10px', textTransform:'uppercase', background:'var(--destaque)', color:'#fff', padding:'2px 6px', borderRadius:'4px', marginBottom:'5px', display:'inline-block' }}>{item.body_parts.display_name}</span>}
      <h4 style={{ margin: '0 0 8px 0', color: 'var(--texto-primario)', fontSize: '16px' }}>{item.problema}</h4>
      <div style={{ fontSize: '13px', color: 'var(--texto-secundario)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div>🏥 <strong style={{color:'var(--texto-primario)'}}>Local:</strong> {renderLocais(item.locais)}</div>
        <div>📋 <strong style={{color:'var(--texto-primario)'}}>Exame:</strong> {item.exame}</div>
      </div>
      {modoEdicao && isAdmin && (
        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: '5px' }}>
          <button onClick={() => onEdit(item)} style={{ border: '1px solid var(--destaque)', color: 'var(--destaque)', background: 'transparent', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', padding: '2px 8px', fontWeight: 'bold' }}>Editar</button>
          <button onClick={() => onRemove(item.id)} style={{ border: '1px solid #ff5252', color: '#ff5252', background: 'transparent', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', padding: '2px 8px' }}>X</button>
        </div>
      )}
    </div>
  );
};

export default App;