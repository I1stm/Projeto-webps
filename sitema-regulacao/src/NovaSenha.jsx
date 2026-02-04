import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function NovaSenha({ aoFinalizar }) {
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: senha });

    if (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro: ' + error.message });
      setLoading(false);
    } else {
      setMensagem({ tipo: 'sucesso', texto: 'Senha alterada com sucesso!' });
      // Aguarda 1.5s para o usuário ler a mensagem antes de fechar
      setTimeout(() => {
        aoFinalizar();
      }, 1500);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px',
        width: '90%', maxWidth: '350px', border: '1px solid var(--destaque)',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{ color: 'var(--destaque)', marginTop: 0, textAlign: 'center' }}>Nova Senha</h2>
        <p style={{ fontSize:'14px', color:'var(--texto-secundario)', textAlign: 'center', marginBottom: '20px' }}>
          Digite sua nova senha abaixo para recuperar o acesso.
        </p>
        
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="password" 
            placeholder="Nova senha (min. 6 caracteres)"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
            minLength={6}
            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid var(--borda)', background: 'var(--input-bg)', color: 'var(--texto-primario)' }}
          />
          
          {mensagem && (
            <div style={{ 
              color: mensagem.tipo === 'erro' ? '#ff5252' : '#00e676', 
              fontSize: '13px', textAlign: 'center', padding: '8px', 
              backgroundColor: mensagem.tipo === 'erro' ? 'rgba(255, 82, 82, 0.1)' : 'rgba(0, 230, 118, 0.1)', 
              borderRadius: '4px' 
            }}>
              {mensagem.texto}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              width:'100%', padding:'12px', background:'var(--destaque)', color:'#fff', 
              border:'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' 
            }}>
            {loading ? 'Salvando...' : 'Salvar Nova Senha'}
          </button>
        </form>
      </div>
    </div>
  );
}