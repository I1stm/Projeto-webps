import React, { useState, useEffect } from 'react';
import CorpoHumano from './CorpoHumano';
import { supabase } from './supabaseClient';
import Login from './Login';
import ModalForm from './ModalForm';
import Toast from './Toast';
import './App.css'; 
import HeaderSecao from './HeaderSecao';

function App() {
  // --- ESTADOS GERAIS ---
  const [darkMode, setDarkMode] = useState(true);
  const [parteSelecionada, setParteSelecionada] = useState(null);
  const [subAreaSelecionada, setSubAreaSelecionada] = useState(null);
  const [vista, setVista] = useState('frente');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // DADOS DO BANCO & CÉREBRO (MAPA)
  const [subMenus, setSubMenus] = useState([]);
  const [listaProtocolos, setListaProtocolos] = useState([]);
  const [mapaPartes, setMapaPartes] = useState({}); // Dicionário de nomes

  // MODAL E NOTIFICAÇÕES
  const [modalAberto, setModalAberto] = useState(false);
  const [itemEmEdicao, setItemEmEdicao] = useState(null);
  const [toast, setToast] = useState(null);

  // BUSCA E LOGIN
  const [termoBusca, setTermoBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [sessao, setSessao] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  
  // --- PERMISSÕES E ONLINE CHECKER ---
  const [isAdmin, setIsAdmin] = useState(false);         
  const [isSuperAdmin, setIsSuperAdmin] = useState(false); 
  const [meuPerfil, setMeuPerfil] = useState(null);
  const [usuariosOnline, setUsuariosOnline] = useState([]);
  const [mostrarListaOnline, setMostrarListaOnline] = useState(false);
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
      if (session) carregarPerfilUsuario(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessao(session);
      if (session) {
        carregarPerfilUsuario(session.user.id);
        setMostrarLogin(false);
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setMeuPerfil(null);
        setModoEdicao(false);
        setParteSelecionada(null);
        setUsuariosOnline([]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // --- CARREGA O MAPA DE NOMES (CÉREBRO) ---
  useEffect(() => {
    async function fetchBodyParts() {
      const { data } = await supabase.from('body_parts').select('id, display_name');
      if (data) {
        const mapa = {};
        data.forEach(part => {
          mapa[part.id] = { label: part.display_name, id: part.id };
        });
        setMapaPartes(mapa);
      }
    }
    fetchBodyParts();
  }, []);

  async function carregarPerfilUsuario(userId) {
    const { data } = await supabase.from('profiles').select('role, nickname').eq('id', userId).single();
    if (data) {
      setMeuPerfil(data);
      const ehSuper = data.role === 'super_admin';
      setIsAdmin(data.role === 'admin' || ehSuper);
      setIsSuperAdmin(ehSuper);
    }
  }

  // --- ONLINE CHECKER ---
  useEffect(() => {
    if (!sessao?.user || !meuPerfil) return;
    const channel = supabase.channel('sala-global', { config: { presence: { key: sessao.user.id } } });
    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const listaTemporaria = [];
        for (let key in newState) {
          const usuario = newState[key][0];
          if (usuario) listaTemporaria.push(usuario);
        }
        const unicos = listaTemporaria.filter((v,i,a)=>a.findIndex(v2=>(v2.userId===v.userId))===i);
        setUsuariosOnline(unicos);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            userId: sessao.user.id,
            label: meuPerfil.nickname || sessao.user.email,
            entrou_em: new Date().toISOString()
          });
        }
      });
    return () => { supabase.removeChannel(channel); };
  }, [sessao, meuPerfil]);

  // --- CARREGAMENTO DE DADOS DA PARTE ---
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
    if (subs && subs.length > 0) setSubAreaSelecionada(subs[0].id);
    else setSubAreaSelecionada(null);

    const { data: protos } = await supabase.from('protocols').select('*').eq('body_part_id', idParte).order('created_at', { ascending: false });
    setListaProtocolos(protos || []);
    setLoading(false);
  }

  const protocolosVisiveis = subAreaSelecionada ? listaProtocolos.filter(p => p.sub_area_id === subAreaSelecionada) : []; 

  // --- FUNÇÕES DE RENOMEAR (LIVE EDIT) ---
  const renomearParte = async (novoNome) => {
    if (!isAdmin || !parteSelecionada) return;
    const { error } = await supabase.from('body_parts').update({ display_name: novoNome }).eq('id', parteSelecionada);
    if (!error) {
      setToast({ mensagem: 'Nome atualizado!', tipo: 'sucesso' });
      // Atualiza o mapa localmente
      setMapaPartes(prev => ({
        ...prev,
        [parteSelecionada]: { ...prev[parteSelecionada], label: novoNome }
      }));
    } else {
      setToast({ mensagem: 'Erro ao renomear.', tipo: 'erro' });
    }
  };

  const renomearSubArea = async (idSub, nomeAtual) => {
    if (!isAdmin || !modoEdicao) return;
    const novoNome = window.prompt("Novo nome para a categoria:", nomeAtual);
    if (novoNome && novoNome !== nomeAtual) {
      const { error } = await supabase.from('sub_areas').update({ name: novoNome }).eq('id', idSub);
      if (!error) {
        setToast({ mensagem: 'Categoria renomeada!', tipo: 'sucesso' });
        carregarDadosDaParte(parteSelecionada);
      }
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
    const { data, error } = await supabase.from('protocols').select('*, body_parts(display_name)')
      .or(`problema.ilike.%${texto}%,locais.ilike.%${texto}%,exame.ilike.%${texto}%,informacoes.ilike.%${texto}%`).limit(20);
    
    if (error) {
       const { data: dataBackup } = await supabase.from('protocols').select('*')
        .or(`problema.ilike.%${texto}%,locais.ilike.%${texto}%,exame.ilike.%${texto}%`).limit(20);
       setResultadosBusca(dataBackup || []);
    } else {
      setResultadosBusca(data || []);
    }
    setBuscando(false);
  }

  // --- CRUD GERAL ---
  const abrirModalCriar = () => { 
    if (!parteSelecionada || !isAdmin) return;
    if (!subAreaSelecionada) { alert("⚠️ Crie uma sub-categoria antes."); return; }
    setItemEmEdicao(null); setModalAberto(true); 
  };
  
  const abrirModalEditar = (item) => { if (!isAdmin) return; setItemEmEdicao(item); setModalAberto(true); };

  const salvarDadosDoModal = async (dados) => {
    setModalAberto(false);
    try {
      if (itemEmEdicao) {
        const { error } = await supabase.from('protocols').update({ problema: dados.problema, locais: dados.locais, informacoes: dados.informacoes, exame: dados.exame }).eq('id', itemEmEdicao.id);
        if (error) throw error;
        setToast({ mensagem: 'Atualizado!', tipo: 'sucesso' });
      } else {
        const { error } = await supabase.from('protocols').insert([{ body_part_id: parteSelecionada, sub_area_id: subAreaSelecionada, problema: dados.problema, locais: dados.locais, informacoes: dados.informacoes, exame: dados.exame || "Consulta" }]);
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

  // --- SUPER ADMIN ---
  const abrirModalUsuarios = async () => {
    if (!isSuperAdmin) return;
    setModalUsuariosAberto(true);
    const { data } = await supabase.from('profiles').select('*').order('email');
    setListaUsuarios(data || []);
  };

  const alterarCargo = async (idUsuario, novoCargo) => {
    if (!window.confirm(`Mudar cargo para ${novoCargo.toUpperCase()}?`)) return;
    const { error } = await supabase.from('profiles').update({ role: novoCargo }).eq('id', idUsuario);
    if (!error) {
      setToast({ mensagem: 'Cargo atualizado!', tipo: 'sucesso' });
      const { data } = await supabase.from('profiles').select('*').order('email');
      setListaUsuarios(data || []);
    }
  };

  const editarNickname = async (idUsuario, nicknameAtual) => {
    const novoNick = window.prompt("Digite o novo Nickname (deixe vazio para usar o email):", nicknameAtual || "");
    if (novoNick === null) return; 

    const { error } = await supabase.from('profiles').update({ nickname: novoNick || null }).eq('id', idUsuario);
    if (!error) {
      setToast({ mensagem: 'Nickname atualizado!', tipo: 'sucesso' });
      if (idUsuario === sessao.user.id) setMeuPerfil(prev => ({ ...prev, nickname: novoNick || null }));
      const { data } = await supabase.from('profiles').select('*').order('email');
      setListaUsuarios(data || []);
    } else {
      alert("Erro ao mudar nickname.");
    }
  };

  // --- RENDERIZAÇÃO ---
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {mostrarLogin && <Login aoFechar={() => setMostrarLogin(false)} />}
      <ModalForm isOpen={modalAberto} onClose={() => setModalAberto(false)} onSave={salvarDadosDoModal} itemEdicao={itemEmEdicao} />
      {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} onClose={() => setToast(null)} />}

      {/* LISTA ONLINE */}
      {mostrarListaOnline && (
        <div style={{
          position: 'absolute', top: '70px', right: '100px', width: '250px', backgroundColor: 'var(--bg-card)', 
          border: '1px solid var(--destaque)', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', zIndex: 3000, padding: '10px'
        }}>
          <div style={{fontSize:'12px', fontWeight:'bold', color:'var(--texto-secundario)', marginBottom:'8px', display:'flex', justifyContent:'space-between'}}>
            <span>USUÁRIOS ONLINE ({usuariosOnline.length})</span>
            <span style={{cursor:'pointer'}} onClick={()=>setMostrarListaOnline(false)}>✖</span>
          </div>
          <div style={{maxHeight:'200px', overflowY:'auto'}}>
            {usuariosOnline.map((user, idx) => (
               <div key={idx} style={{display:'flex', alignItems:'center', gap:'8px', padding:'5px 0', borderBottom:'1px solid var(--borda)'}}>
                 <div style={{width:'8px', height:'8px', borderRadius:'50%', background:'#00e676', boxShadow:'0 0 5px #00e676'}}></div>
                 <span style={{fontSize:'12px', color:'var(--texto-primario)'}}>
                   {user.userId === sessao?.user?.id ? 'Você' : (user.label.includes('@') ? user.label.split('@')[0] : user.label)}
                 </span>
               </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL GESTÃO EQUIPE */}
      {modalUsuariosAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', width: '90%', maxWidth: '700px', maxHeight: '80vh', overflowY: 'auto', border: '1px solid var(--destaque)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <h2 style={{ margin: 0, color: 'var(--destaque)' }}>Gestão da Equipe</h2>
              <button onClick={() => setModalUsuariosAberto(false)} style={{ background: 'none', border: 'none', color: 'var(--texto-primario)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--texto-primario)' }}>
              <thead><tr style={{ borderBottom: '1px solid var(--borda)', textAlign: 'left' }}><th style={{ padding: '10px' }}>Usuário / Nickname</th><th style={{ padding: '10px' }}>Cargo</th><th style={{ padding: '10px', textAlign: 'right' }}>Ação</th></tr></thead>
              <tbody>
                {listaUsuarios.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--borda)' }}>
                    <td style={{ padding: '10px', fontSize:'14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div>
                           <div style={{ fontWeight: 'bold' }}>{u.nickname || u.email} {u.role === 'super_admin' && '👑'}</div>
                           {u.nickname && <div style={{ fontSize: '10px', color: 'var(--texto-secundario)' }}>{u.email}</div>}
                        </div>
                        <button onClick={() => editarNickname(u.id, u.nickname)} title="Editar Apelido" style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px' }}>✏️</button>
                      </div>
                    </td>
                    <td style={{ padding: '10px' }}><span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', backgroundColor: u.role === 'admin' || u.role === 'super_admin' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(128, 128, 128, 0.1)', color: u.role === 'admin' || u.role === 'super_admin' ? 'var(--destaque)' : 'var(--texto-secundario)' }}>{u.role ? u.role.toUpperCase() : 'USER'}</span></td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      {u.role !== 'super_admin' && (u.role === 'admin' ? 
                        <button onClick={() => alterarCargo(u.id, 'user')} style={{ padding: '4px 8px', fontSize: '12px', background: '#ff5252', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Rebaixar</button> : 
                        <button onClick={() => alterarCargo(u.id, 'admin')} style={{ padding: '4px 8px', fontSize: '12px', background: 'var(--destaque)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Promover</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <header style={{ height: '70px', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--borda)', flexShrink: 0 }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--destaque)' }}>SISREG<span style={{ fontSize: '10px', opacity: 0.7 }}>PRO</span></div>
        
        {sessao && (
          <div style={{ flex: 1, maxWidth: '400px', margin: '0 20px', position: 'relative' }}>
            <span style={{position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)'}}>🔍</span>
            <input type="text" placeholder="Pesquisar..." value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} style={{ width: '100%', padding: '8px 15px 8px 35px', borderRadius: '20px', border: '1px solid var(--borda)', background: 'var(--input-bg)', color: 'var(--texto-primario)', outline: 'none' }} />
            {termoBusca && <button onClick={() => setTermoBusca('')} style={{position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', border:'none', background:'transparent', cursor:'pointer', color:'var(--texto-secundario)'}}>✖</button>}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {sessao && (
            <button onClick={() => setMostrarListaOnline(!mostrarListaOnline)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', border: '1px solid #00e676', backgroundColor: 'rgba(0, 230, 118, 0.1)', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', color: '#00e676' }}>
              <div style={{width:'8px', height:'8px', borderRadius:'50%', background:'#00e676', boxShadow:'0 0 5px #00e676'}}></div>
              {usuariosOnline.length} ON
            </button>
          )}

          {sessao?.user?.email && (
            <div style={{ textAlign: 'right', fontSize: '12px' }}>
              <span style={{ color: 'var(--texto-secundario)' }}>Olá, </span>
              <span style={{ color: isSuperAdmin ? '#FFD700' : 'var(--destaque)', fontWeight: 'bold' }}>{meuPerfil?.nickname || sessao.user.email} {isSuperAdmin && '👑'}</span>
            </div>
          )}

          <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>{darkMode ? '☀️' : '🌙'}</button>
          {!sessao ? (
            <button onClick={() => setMostrarLogin(true)} style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid var(--destaque)', color: 'var(--destaque)', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>Entrar</button>
          ) : (
            <>
              {isSuperAdmin && <button onClick={abrirModalUsuarios} style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid #FFD700', color: '#FFD700', background: 'transparent', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}>👥 Equipe</button>}
              {isAdmin && <button onClick={() => setModoEdicao(!modoEdicao)} style={{ padding: '6px 12px', borderRadius: '20px', border: `1px solid ${modoEdicao ? '#ff5252' : 'var(--borda)'}`, color: modoEdicao ? '#ff5252' : 'var(--texto-secundario)', background: 'transparent', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>{modoEdicao ? '🔓 EDITANDO' : '🔒 ADMIN'}</button>}
              <button onClick={() => supabase.auth.signOut()} style={{ fontSize: '12px', color: 'var(--texto-secundario)', background:'none', border:'none', cursor:'pointer', textDecoration: 'underline' }}>Sair</button>
            </>
          )}
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
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
            {/* PAINEL ESQUERDO: BONECO */}
            <section style={{ flex: 1, position: 'relative', borderRight: '1px solid var(--borda)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <button onClick={() => { setVista(v => v === 'frente' ? 'costas' : 'frente'); setParteSelecionada(null); }} style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, padding: '8px', borderRadius: '8px', border: '1px solid var(--borda)', background: 'var(--bg-card)', color: 'var(--texto-primario)', cursor: 'pointer' }}>🔄 {vista.toUpperCase()}</button>
              <div style={{ height: '90%', width: '100%', maxWidth: '350px' }}>
                 <CorpoHumano 
                   aoSelecionar={(info) => setParteSelecionada(info.id || info)} 
                   parteAtiva={parteSelecionada} 
                   vista={vista}
                   mapaDeNomes={mapaPartes} 
                 />
              </div>
            </section>
            
            {/* PAINEL DIREITO: CONTEÚDO */}
            <section style={{ flex: 1.3, padding: '30px', backgroundColor: 'var(--bg-card)', overflowY: 'auto' }}>
              {termoBusca.length > 0 ? (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                  <h2 style={{ color: 'var(--destaque)', margin: 0 }}>Busca Global</h2>
                  <hr style={{ borderColor: 'var(--borda)', opacity: 0.3, margin: '20px 0' }} />
                  {!buscando && resultadosBusca.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>{resultadosBusca.map((item) => <CardProtocolo key={item.id} item={item} isAdmin={isAdmin} modoEdicao={modoEdicao} onEdit={abrirModalEditar} onRemove={(id) => remover(id, 'busca')} showTag={true} />)}</div>
                  ) : <p>Nada encontrado.</p>}
                </div>
              ) : (
                parteSelecionada ? (
                  <div style={{ animation: 'fadeIn 0.3s' }}>
                    
                    {/* HEADER SEÇÃO COM RENAME */}
                    <HeaderSecao 
                      parteSelecionada={parteSelecionada}
                      nomeAtual={mapaPartes[parteSelecionada]?.label || parteSelecionada} 
                      isAdmin={isAdmin} 
                      modoEdicao={modoEdicao} 
                      aoAbrirModalProtocolo={abrirModalCriar} 
                      aoAtualizar={() => carregarDadosDaParte(parteSelecionada)}
                      onRename={renomearParte} 
                    />

                    {/* SUB-MENUS */}
                    {subMenus.length > 0 ? (
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', margin: '20px 0', alignItems: 'flex-start' }}>
                        {subMenus.map(sub => (
                          <div key={sub.id} style={{ position: 'relative' }}>
                            <button onClick={() => setSubAreaSelecionada(sub.id)} style={{ padding: '6px 12px', borderRadius: '15px', border: '1px solid var(--destaque)', cursor: 'pointer', fontSize: '13px', background: subAreaSelecionada === sub.id ? 'var(--destaque)' : 'transparent', color: subAreaSelecionada === sub.id ? '#fff' : 'var(--destaque)' }}>{sub.name}</button>
                            {modoEdicao && isAdmin && (
                              <>
                                <button onClick={(e) => { e.stopPropagation(); apagarSubMenu(sub.id, sub.name); }} style={{ position: 'absolute', top: '-8px', right: '-8px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#ff5252', color: 'white', border: 'none', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', zIndex: 5 }}>X</button>
                                <button onClick={(e) => { e.stopPropagation(); renomearSubArea(sub.id, sub.name); }} style={{ position: 'absolute', top: '-8px', right: '15px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#2196F3', color: 'white', border: 'none', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', zIndex: 5 }} title="Renomear">✎</button>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: '15px', background: 'rgba(255, 165, 0, 0.1)', borderRadius: '8px', margin: '20px 0', color: 'orange', fontSize: '13px' }}>⚠️ Crie uma categoria clicando no <strong>+</strong> acima.</div>
                    )}
                    <hr style={{ borderColor: 'var(--borda)', opacity: 0.3, margin: '20px 0' }} />
                    {loading && <p>Carregando...</p>}
                    {!loading && protocolosVisiveis.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>{protocolosVisiveis.map((item) => <CardProtocolo key={item.id} item={item} isAdmin={isAdmin} modoEdicao={modoEdicao} onEdit={abrirModalEditar} onRemove={remover} />)}</div>
                    ) : (
                      !loading && subMenus.length > 0 && <div style={{textAlign:'center', color:'var(--texto-secundario)', padding:'20px', border:'2px dashed var(--borda)', borderRadius:'10px'}}><p>Nenhum protocolo nesta seção.</p></div>
                    )}
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
      <div style={{ fontSize: '13px', color: 'var(--texto-secundario)', display:'flex', flexDirection:'column', gap:'8px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}><span style={{ fontSize: '14px', lineHeight: '1.2' }}>🏥</span><div style={{ flex: 1 }}><strong style={{color:'var(--texto-primario)'}}>Local:</strong> {renderLocais(item.locais)}</div></div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}><span style={{ fontSize: '14px', lineHeight: '1.2' }}>📋</span><div style={{ flex: 1 }}><strong style={{color:'var(--texto-primario)'}}>Exame:</strong> {item.exame}</div></div>
        {item.informacoes && <div style={{ marginTop: '5px', background: 'rgba(128,128,128,0.1)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid var(--texto-secundario)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}><span style={{ fontSize: '14px', lineHeight: '1.4' }}>ℹ️</span><span style={{ flex: 1, color: 'var(--texto-primario)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.4' }}><strong>Info:</strong> {item.informacoes}</span></div>}
      </div>
      {modoEdicao && isAdmin && <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: '5px' }}><button onClick={() => onEdit(item)} style={{ border: '1px solid var(--destaque)', color: 'var(--destaque)', background: 'transparent', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', padding: '2px 8px', fontWeight: 'bold' }}>Editar</button><button onClick={() => onRemove(item.id)} style={{ border: '1px solid #ff5252', color: '#ff5252', background: 'transparent', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', padding: '2px 8px' }}>X</button></div>}
    </div>
  );
};

export default App;