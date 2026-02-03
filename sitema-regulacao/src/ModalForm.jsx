import React, { useState, useEffect } from 'react';

export default function ModalForm({ isOpen, onClose, onSave, itemEdicao }) {
  // Estados do formulário
  const [problema, setProblema] = useState('');
  const [locais, setLocais] = useState('');
  const [informacoes, setInformacoes] = useState(''); // Novo campo
  const [exame, setExame] = useState('');

  // Quando o modal abre, preenche os dados se for edição
  useEffect(() => {
    if (isOpen) {
      if (itemEdicao) {
        setProblema(itemEdicao.problema || '');
        setLocais(itemEdicao.locais || '');
        setInformacoes(itemEdicao.informacoes || ''); // Carrega info existente
        setExame(itemEdicao.exame || '');
      } else {
        // Limpa se for criar novo
        setProblema('');
        setLocais('');
        setInformacoes('');
        setExame('');
      }
    }
  }, [isOpen, itemEdicao]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envia o objeto completo de volta para o App.jsx
    onSave({ 
      problema, 
      locais, 
      informacoes, // Envia a nova info
      exame 
    });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)', padding: '25px', borderRadius: '12px',
        width: '90%', maxWidth: '500px', position: 'relative',
        border: '1px solid var(--borda)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ marginTop: 0, color: 'var(--destaque)' }}>
          {itemEdicao ? 'Editar Protocolo' : 'Novo Protocolo'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* PROBLEMA */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--texto-secundario)', marginBottom: '5px' }}>Problema / Doença</label>
            <input 
              type="text" 
              required
              value={problema} 
              onChange={(e) => setProblema(e.target.value)} 
              placeholder="Ex: Fratura exposta"
              style={inputStyle} 
            />
          </div>

          {/* LOCAIS DE ATENDIMENTO */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--texto-secundario)', marginBottom: '5px' }}>Locais de Atendimento (separe por /)</label>
            <input 
              type="text" 
              required
              value={locais} 
              onChange={(e) => setLocais(e.target.value)} 
              placeholder="Ex: UPA / Hospital Municipal"
              style={inputStyle} 
            />
          </div>

          {/* NOVO CAMPO: INFORMAÇÕES */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--texto-secundario)', marginBottom: '5px' }}>ℹ️ Informações Adicionais</label>
            <textarea 
              rows="3"
              value={informacoes} 
              onChange={(e) => setInformacoes(e.target.value)} 
              placeholder="Ex: Paciente precisa estar em jejum; Levar documento original..."
              style={{ ...inputStyle, resize: 'vertical' }} 
            />
          </div>

          {/* EXAME / PROCEDIMENTO */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--texto-secundario)', marginBottom: '5px' }}>Exame ou Procedimento</label>
            <input 
              type="text" 
              value={exame} 
              onChange={(e) => setExame(e.target.value)} 
              placeholder="Ex: Raio-X de Tórax"
              style={inputStyle} 
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--borda)', background: 'transparent', color: 'var(--texto-primario)', cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--destaque)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', 
  padding: '10px', 
  borderRadius: '6px', 
  border: '1px solid var(--borda)', 
  background: 'var(--input-bg)', 
  color: 'var(--texto-primario)', 
  outline: 'none',
  fontFamily: 'inherit'
};