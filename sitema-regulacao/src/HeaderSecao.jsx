import React from 'react';
import { supabase } from './supabaseClient'; 

const HeaderSecao = ({ 
  parteSelecionada, 
  isAdmin, 
  modoEdicao, 
  aoAbrirModalProtocolo, 
  aoAtualizar 
}) => {

  const handleCriarSubmenu = async () => {
    // Validação de segurança
    if (!parteSelecionada) return;

    const nome = prompt(`Nome da nova Categoria para ${parteSelecionada}:`);
    if (!nome) return;

    const { error } = await supabase
      .from('sub_areas')
      .insert([{ body_part_id: parteSelecionada, name: nome }]);

    if (error) {
      console.error(error);
      // Tratamento específico para o erro de chave estrangeira
      if (error.code === '23503') {
        alert(`ERRO CRÍTICO: O ID "${parteSelecionada}" não existe na tabela 'body_parts' do Supabase.\n\nPor favor, vá no banco de dados e cadastre esta parte do corpo primeiro.`);
      } else {
        alert(`Erro ao criar: ${error.message}`);
      }
    } else {
      alert('Categoria criada com sucesso!');
      if (aoAtualizar) aoAtualizar();
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      
      <h2 style={{ color: 'var(--destaque)', margin: 0, textTransform: 'capitalize', fontSize: '24px' }}>
        {parteSelecionada ? parteSelecionada.replace(/-/g, ' ') : 'Selecione...'}
      </h2>

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