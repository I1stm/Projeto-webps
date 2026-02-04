import React, { useState } from 'react';

const ViewerCorpo = ({ children }) => {
  const [zoom, setZoom] = useState(1);

  const aumentar = () => setZoom(prev => Math.min(prev + 0.2, 3.0));
  const diminuir = () => setZoom(prev => Math.max(prev - 0.2, 0.6));

  return (
    <div style={styles.containerFrame}>
      
      {/* Barra de Ferramentas */}
      <div style={styles.toolbar}>
        <span style={{ fontSize: '12px', color: '#546e7a', fontWeight: 'bold', textTransform: 'uppercase' }}>
          Visualizador Anatômico
        </span>
        <div style={styles.botoesArea}>
          <button onClick={diminuir} style={styles.botaoZoom}>−</button>
          <span style={{ width: '40px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#333' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={aumentar} style={styles.botaoZoom}>+</button>
        </div>
      </div>

      {/* Área do Boneco */}
      <div style={styles.viewport}>
        {/* Este div interno centraliza e aplica o zoom */}
        <div style={{ 
            ...styles.conteudoTransform, 
            transform: `scale(${zoom})`
        }}>
          {children}
        </div>
      </div>

    </div>
  );
};

const styles = {
  containerFrame: {
    width: '100%',
    height: '100%', // Ocupa a altura definida no pai
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #cfd8dc',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)'
  },
  toolbar: {
    padding: '8px 15px',
    borderBottom: '1px solid #eee',
    backgroundColor: '#f1f3f4',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0 // Garante que a barra não encolha
  },
  botoesArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  botaoZoom: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#eceff1',
    color: '#37474f',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'background 0.2s'
  },
  viewport: {
    flex: 1, // Ocupa o resto do espaço
    overflow: 'auto', // Barras de rolagem se der muito zoom
    display: 'flex', // FLEXBOX PARA CENTRALIZAR
    justifyContent: 'center', // Centraliza Horizontalmente
    alignItems: 'center',     // Centraliza Verticalmente
    backgroundColor: '#fafafa',
    padding: '40px' // Um respiro nas bordas
  },
  conteudoTransform: {
    transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Zoom suave
    transformOrigin: 'center center', // Zoom a partir do meio
    display: 'flex',
    justifyContent: 'center'
  }
};

export default ViewerCorpo;