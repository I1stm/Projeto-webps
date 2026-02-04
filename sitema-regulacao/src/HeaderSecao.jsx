import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; 

const HeaderSecao = ({ 
  parteSelecionada, 
  nomeAtual,        // <--- Novo: Recebe o nome bonito do banco
  isAdmin, 
  modoEdicao, 
  aoAbrirModalProtocolo, 
  aoAtualizar,
  onRename          // <--- Novo: Função para salvar a renomeação
}) => {
  
  // --- Lógica de Renomear Título ---
  const [editando, setEditando] = useState(false);
  const [novoNome, setNovoNome] = useState('');

  // Sincroniza quando muda a parte selecionada
  useEffect(() => {
    setNovoNome(nomeAtual || '');
  }, [nomeAtual]);

  const handleSalvarNome = async () => {
    if (novoNome.trim() !== '' && novoNome !== nomeAtual) {
      await onRename(novoNome);
    }
    setEditando(false);
  };

  const handleCancelarEdicao = () => {
    setNovoNome(nomeAtual || '');
    setEditando(false);
  };

  // --- Lógica Original de Criar Submenu ---
  const handleCriarSubmenu = async () => {
    if (!parteSelecionada) return;

    const nome = prompt(`Nome da nova Categoria para ${nomeAtual || parteSelecionada}:`);
    if (!nome) return;

    const { error } = await supabase
      .from('sub_areas')
      .insert([{ body_part_id: parteSelecionada, name: nome }]);

    if (error) {
      console.error(error);
      if (error.code === '23503') {
        alert(`ERRO CRÍTICO: O ID "${parteSelecionada}" não existe na tabela 'body_parts'.`);
      } else {
        alert(`Erro ao criar: ${error.message}`);
      }
    } else {
      if (aoAtualizar) aoAtualizar();
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
      
      {/* TÍTULO EDITÁVEL */}
      <div style={{ flex: 1 }}>
        {editando ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input 
              autoFocus
              type="text" 
              value={novoNome} 
              onChange={(e) => setNovoNome(e.target.value)}
              style={{ 
                fontSize: '24px', fontWeight: 'bold', color: 'var(--destaque)', 
                background: 'transparent', border: 'none', borderBottom: '2px solid var(--destaque)',
                outline: 'none', width: '100%', maxWidth: '300px'
              }}
            />
            <button onClick={handleSalvarNome} style={{ cursor: 'pointer', background: '#00e676', border: 'none', borderRadius: '4px', color: '#fff', padding: '5px 10px', fontWeight: 'bold' }}>✓</button>
            <button onClick={handleCancelarEdicao} style={{ cursor: 'pointer', background: '#ff5252', border: 'none', borderRadius: '4px', color: '#fff', padding: '5px 10px', fontWeight: 'bold' }}>✕</button>
          </div>
        ) : (
          <h2 style={{ color: 'var(--destaque)', margin: 0, textTransform: 'capitalize', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {nomeAtual || (parteSelecionada ? parteSelecionada.replace(/-/g, ' ') : 'Selecione...')}
            
            {/* Lápis de Edição */}
            {modoEdicao && isAdmin && parteSelecionada && (
              <button 
                onClick={() => setEditando(true)}
                title="Renomear Parte"
                style={{ 
                  background: 'transparent', border: '1px solid var(--destaque)', borderRadius: '50%', 
                  width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--destaque)', fontSize: '12px'
                }}
              >
                ✎
              </button>
            )}
          </h2>
        )}
      </div>

      {/* BOTÕES DE AÇÃO (Só Admins) */}
      {modoEdicao && isAdmin && (
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Botão AZUL - Submenu */}
          <button 
            onClick={handleCriarSubmenu} 
            style={{ 
              background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 16px', 
              borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              display: 'flex', alignItems: 'center', gap: '5px'
            }}
          >
            <span>+</span> Criar Submenu
          </button>

          {/* Botão VERDE - Protocolo */}
          <button 
            onClick={aoAbrirModalProtocolo} 
            style={{ 
              background: 'var(--destaque)', color: '#fff', border: 'none', padding: '8px 16px', 
              borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)' 
            }}
          >
            + Novo Protocolo
          </button>
        </div>
      )}
    </div>
  );
};

export default HeaderSecao;