import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Login({ aoFechar }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErro(error.message === 'Invalid login credentials' 
        ? 'E-mail ou senha incorretos.' 
        : 'Erro ao entrar: ' + error.message);
      setLoading(false);
    } else {
      // O App.jsx vai detectar a mudança de sessão automaticamente
      aoFechar(); 
    }
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
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        border: '1px solid var(--borda)'
      }}>
        {/* Botão Fechar */}
        <button 
          onClick={aoFechar}
          style={{
            position: 'absolute', top: '10px', right: '10px',
            background: 'transparent', border: 'none',
            color: 'var(--texto-secundario)', cursor: 'pointer', fontSize: '16px'
          }}
        >
          ✕
        </button>

        <h2 style={{ color: 'var(--destaque)', textAlign: 'center', marginTop: 0 }}>Acessar Sistema</h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--texto-secundario)', marginBottom: '5px' }}>E-mail</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--borda)', background: 'var(--input-bg)', color: 'var(--texto-primario)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--texto-secundario)', marginBottom: '5px' }}>Senha</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--borda)', background: 'var(--input-bg)', color: 'var(--texto-primario)', outline: 'none' }}
            />
          </div>

          {erro && <div style={{ color: '#ff5252', fontSize: '13px', textAlign: 'center', padding: '5px', backgroundColor: 'rgba(255, 82, 82, 0.1)', borderRadius: '4px' }}>{erro}</div>}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: '12px', marginTop: '10px',
              backgroundColor: 'var(--destaque)', color: '#fff',
              border: 'none', borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold', fontSize: '15px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '12px', textAlign: 'center', color: 'var(--texto-secundario)', borderTop: '1px solid var(--borda)', paddingTop: '15px' }}>
          <p style={{ margin: 0 }}>Não tem acesso?</p>
          <p style={{ margin: '5px 0 0 0' }}>Fale com o administrador para solicitar seu cadastro.</p>
        </div>
      </div>
    </div>
  );
}