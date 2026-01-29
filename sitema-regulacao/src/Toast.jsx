import React, { useEffect } from 'react';

export default function Toast({ mensagem, tipo, onClose }) {
  // tipo pode ser 'sucesso' (verde) ou 'erro' (vermelho)
  
  // Fecha sozinho depois de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: tipo === 'erro' ? '#ff5252' : '#00e676', // Vermelho ou Verde Neon
      color: '#fff',
      padding: '15px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      animation: 'slideIn 0.3s ease-out',
      fontWeight: 'bold',
      fontSize: '14px'
    }}>
      <span>{tipo === 'erro' ? '❌' : '✅'}</span>
      {mensagem}
    </div>
  );
}