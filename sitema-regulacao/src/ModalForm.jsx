import React, { useState, useEffect } from 'react';

export default function ModalForm({ isOpen, onClose, onSave, itemEdicao }) {
  const [problema, setProblema] = useState('');
  const [exame, setExame] = useState('');
  
  // Locais agora é uma lista real no visual
  const [locais, setLocais] = useState(['']); 

  // Quando abre, verifica se é Edição ou Novo
  useEffect(() => {
    if (isOpen) {
      if (itemEdicao) {
        // MODO EDIÇÃO: Preenche os campos
        setProblema(itemEdicao.problema);
        setExame(itemEdicao.exame);
        // Transforma a string "Local A / Local B" em array ['Local A', 'Local B']
        setLocais(itemEdicao.locais ? itemEdicao.locais.split(' / ') : ['']);
      } else {
        // MODO NOVO: Limpa tudo
        setProblema('');
        setExame('');
        setLocais(['']);
      }
    }
  }, [isOpen, itemEdicao]);

  if (!isOpen) return null;

  // Funções para gerenciar a lista de locais
  const mudarLocal = (index, valor) => {
    const novaLista = [...locais];
    novaLista[index] = valor;
    setLocais(novaLista);
  };

  const adicionarCampoLocal = () => {
    setLocais([...locais, '']);
  };

  const removerCampoLocal = (index) => {
    const novaLista = locais.filter((_, i) => i !== index);
    setLocais(novaLista.length ? novaLista : ['']); // Mantém pelo menos 1
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Junta os locais de volta numa string com barra
    const locaisFormatados = locais.filter(l => l.trim() !== '').join(' / ');
    
    onSave({
      problema,
      exame,
      locais: locaisFormatados || "A definir"
    });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
    }}>
      <div style={{
        background: 'var(--bg-card)', padding: '25px', borderRadius: '12px',
        width: '400px', maxWidth: '90%', border: '1px solid var(--borda)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)', color: 'var(--texto-primario)'
      }}>
        <h2 style={{ marginTop: 0, color: 'var(--destaque)' }}>
          {itemEdicao ? 'Editar Protocolo' : 'Novo Protocolo'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* PROBLEMA */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--texto-secundario)' }}>DOENÇA / PROBLEMA</label>
            <input 
              required
              value={problema} onChange={e => setProblema(e.target.value)}
              placeholder="Ex: Catarata"
              style={estiloInput}
            />
          </div>

          {/* LOCAIS DINÂMICOS */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--texto-secundario)' }}>LOCAIS DE ATENDIMENTO</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '5px' }}>
              {locais.map((local, index) => (
                <div key={index} style={{ display: 'flex', gap: '5px' }}>
                  <input 
                    value={local} 
                    onChange={e => mudarLocal(index, e.target.value)}
                    placeholder="Ex: Hospital de Olhos"
                    style={estiloInput}
                  />
                  {locais.length > 1 && (
                    <button type="button" onClick={() => removerCampoLocal(index)} style={btnRemove}>×</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={adicionarCampoLocal} style={btnAdd}>+ Adicionar outro local</button>
            </div>
          </div>

          {/* EXAME */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--texto-secundario)' }}>EXAME / PROCEDIMENTO</label>
            <input 
              value={exame} onChange={e => setExame(e.target.value)}
              placeholder="Ex: Consulta Especializada"
              style={estiloInput}
            />
          </div>

          {/* BOTÕES */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={btnCancelar}>Cancelar</button>
            <button type="submit" style={btnSalvar}>Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Estilos rápidos para o Modal
const estiloInput = {
  width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--borda)',
  background: 'var(--input-bg)', color: 'var(--texto-primario)', outline: 'none', marginTop: '5px', boxSizing: 'border-box'
};
const btnRemove = { border: '1px solid #ff5252', color: '#ff5252', background: 'transparent', borderRadius: '6px', cursor: 'pointer', padding: '0 10px', fontSize: '18px' };
const btnAdd = { background: 'transparent', border: '1px dashed var(--destaque)', color: 'var(--destaque)', padding: '5px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', marginTop: '5px' };
const btnCancelar = { padding: '10px 20px', border: 'none', background: 'transparent', color: 'var(--texto-secundario)', cursor: 'pointer' };
const btnSalvar = { padding: '10px 20px', border: 'none', borderRadius: '6px', background: 'var(--destaque)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' };