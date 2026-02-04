import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Login({ aoFechar }) {
  const [modoRecuperacao, setModoRecuperacao] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null); // Objeto { tipo: 'erro'|'sucesso', texto: '' }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMensagem({ 
        tipo: 'erro', 
        texto: error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message 
      });
      setLoading(false);
    } else {
      aoFechar();
    }
  };

  const handleRecuperacao = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    // Envia o link mágico para o e-mail
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin, // Garante que volta para a URL correta (Localhost ou Vercel)
    });

    if (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao enviar: ' + error.message });
    } else {
      setMensagem({ tipo: 'sucesso', texto: 'Verifique seu e-mail (inclusive Spam) para redefinir a senha!' });
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px',
        width: '90%', maxWidth: '350px', position: 'relative',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)', border: '1px solid var(--borda)'
      }}>
        <button 
          onClick={aoFechar}
          style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: 'var(--texto-secundario)', cursor: 'pointer', fontSize: '16px' }}>
          ✕
        </button>

        <h2 style={{ color: 'var(--destaque)', textAlign: 'center', marginTop: 0 }}>
          {modoRecuperacao ? 'Recuperar Senha' : 'Acessar Sistema'}
        </h2>
        
        <form onSubmit={modoRecuperacao ? handleRecuperacao : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--texto-secundario)', marginBottom: '5px' }}>E-mail</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="seu@email.com"
              style={inputStyle}
            />
          </div>

          {!modoRecuperacao && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--texto-secundario)', marginBottom: '5px' }}>Senha</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                placeholder="******"
                style={inputStyle}
              />
            </div>
          )}

          {mensagem && (
            <div style={{ 
              color: mensagem.tipo === 'erro' ? '#ff5252' : '#00e676', 
              fontSize: '13px', textAlign: 'center', padding: '10px', 
              backgroundColor: mensagem.tipo === 'erro' ? 'rgba(255, 82, 82, 0.1)' : 'rgba(0, 230, 118, 0.1)', 
              borderRadius: '6px', border: `1px solid ${mensagem.tipo === 'erro' ? '#ff5252' : '#00e676'}`
            }}>
              {mensagem.texto}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: '12px', marginTop: '10px',
              backgroundColor: 'var(--destaque)', color: '#fff',
              border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold', fontSize: '15px', opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Processando...' : (modoRecuperacao ? 'Enviar Link' : 'Entrar')}
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '12px', textAlign: 'center', color: 'var(--texto-secundario)', borderTop: '1px solid var(--borda)', paddingTop: '15px' }}>
          {modoRecuperacao ? (
            <p>Lembrou a senha? <span onClick={() => {setModoRecuperacao(false); setMensagem(null)}} style={{color: 'var(--destaque)', cursor: 'pointer', fontWeight: 'bold'}}>Voltar ao login</span></p>
          ) : (
             <p>Esqueceu a senha? <span onClick={() => {setModoRecuperacao(true); setMensagem(null)}} style={{color: 'var(--destaque)', cursor: 'pointer', fontWeight: 'bold'}}>Recuperar agora</span></p>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--borda)', background: 'var(--input-bg)', color: 'var(--texto-primario)', outline: 'none' };