import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Login({ aoFechar }) {
  const [modo, setModo] = useState('login'); // 'login' ou 'cadastro'
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' }); // tipo: 'erro' ou 'sucesso'

  const lidarComEnvio = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ texto: '', tipo: '' });

    try {
      if (modo === 'login') {
        // --- LOGICA DE ENTRAR ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });
        if (error) throw error;
        // Se der certo, o App.jsx vai detectar a mudança de sessão e fechar o modal sozinho
        
      } else {
        // --- LOGICA DE CRIAR CONTA ---
        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
        });
        if (error) throw error;
        setMensagem({ texto: 'Conta criada! Você já está logado.', tipo: 'sucesso' });
      }
    } catch (error) {
      setMensagem({ texto: error.message, tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
    }}>
      <div style={{
        background: 'var(--bg-card)', padding: '30px', borderRadius: '12px',
        width: '350px', border: '1px solid var(--borda)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
      }}>
        
        {/* Título e Alternador */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
          <button 
            onClick={() => setModo('login')}
            style={{
              background: 'none', border: 'none', 
              color: modo === 'login' ? 'var(--destaque)' : 'var(--texto-secundario)',
              fontWeight: 'bold', fontSize: '18px', cursor: 'pointer',
              borderBottom: modo === 'login' ? '2px solid var(--destaque)' : 'none'
            }}
          >
            Entrar
          </button>
          <button 
            onClick={() => setModo('cadastro')}
            style={{
              background: 'none', border: 'none', 
              color: modo === 'cadastro' ? 'var(--destaque)' : 'var(--texto-secundario)',
              fontWeight: 'bold', fontSize: '18px', cursor: 'pointer',
              borderBottom: modo === 'cadastro' ? '2px solid var(--destaque)' : 'none'
            }}
          >
            Criar Conta
          </button>
        </div>

        <form onSubmit={lidarComEnvio}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--texto-secundario)', fontSize: '12px' }}>E-MAIL</label>
            <input
              type="email"
              placeholder="exemplo@saude.gov.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px',
                border: '1px solid var(--borda)', background: 'var(--input-bg)',
                color: 'var(--texto-primario)', outline: 'none', boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--texto-secundario)', fontSize: '12px' }}>SENHA</label>
            <input
              type="password"
              placeholder="******"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px',
                border: '1px solid var(--borda)', background: 'var(--input-bg)',
                color: 'var(--texto-primario)', outline: 'none', boxSizing: 'border-box'
              }}
              required
              minLength={6}
            />
          </div>

          {mensagem.texto && (
            <div style={{ 
              padding: '10px', marginBottom: '15px', borderRadius: '6px', fontSize: '13px',
              backgroundColor: mensagem.tipo === 'erro' ? 'rgba(255, 82, 82, 0.1)' : 'rgba(0, 230, 118, 0.1)',
              color: mensagem.tipo === 'erro' ? '#ff5252' : '#00e676', border: `1px solid ${mensagem.tipo === 'erro' ? '#ff5252' : '#00e676'}`
            }}>
              {mensagem.texto}
            </div>
          )}

          <button 
            disabled={loading}
            style={{
              width: '100%', padding: '12px', background: 'var(--destaque)',
              color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 'bold', fontSize: '16px', transition: 'opacity 0.2s'
            }}
          >
            {loading ? 'Processando...' : (modo === 'login' ? 'Acessar Sistema' : 'Cadastrar Usuário')}
          </button>
        </form>

        <button 
          onClick={aoFechar}
          style={{
            marginTop: '15px', width: '100%', background: 'transparent', border: 'none',
            color: 'var(--texto-secundario)', cursor: 'pointer', fontSize: '13px'
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}