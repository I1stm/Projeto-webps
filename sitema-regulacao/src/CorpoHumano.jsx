import React from 'react';

const CorpoHumano = ({ aoSelecionar, parteAtiva, vista = 'frente' }) => {

  // Estilo Base Atualizado
  const estilo = (id) => ({
    // Se ativo: Verde Destaque. Se inativo: Cinza Base
    fill: parteAtiva === id ? 'var(--destaque)' : 'var(--boneco-base)',
    stroke: parteAtiva === id ? 'var(--destaque)' : '#546e7a', // Borda também muda
    strokeWidth: '2px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Animação mais fluida
    filter: parteAtiva === id 
      ? 'drop-shadow(0 0 10px var(--destaque))' // Brilho verde ao clicar
      : 'none'
  });

  const tratarClique = (e, id) => {
    e.stopPropagation();
    aoSelecionar(id);
  };

  return (
    <svg viewBox="0 0 400 800" style={{ width: '100%', height: '100%', display: 'block' }}>
      
      {/* --- VISTA FRENTE --- */}
      {vista === 'frente' && (
        <g transform="translate(100, 50)">
          {/* Cabeça e Pescoço */}
          <path id="cabeca" d="M100,0 C70,0 50,30 50,60 C50,80 60,100 100,100 C140,100 150,80 150,60 C150,30 130,0 100,0 Z" style={estilo('cabeca')} onClick={(e) => tratarClique(e, 'cabeca')} />
          <rect id="pescoco" x="85" y="100" width="30" height="20" style={estilo('pescoco')} onClick={(e) => tratarClique(e, 'pescoco')} />

          {/* Tronco */}
          <path id="peito" d="M50,120 L150,120 L140,200 L60,200 Z" style={estilo('peito')} onClick={(e) => tratarClique(e, 'peito')} />
          <path id="abdomen" d="M60,200 L140,200 L135,280 L65,280 Z" style={estilo('abdomen')} onClick={(e) => tratarClique(e, 'abdomen')} />
          <path id="pelvis" d="M65,280 L135,280 L130,320 L70,320 Z" style={estilo('pelvis')} onClick={(e) => tratarClique(e, 'pelvis')} />

          {/* Braços */}
          <rect id="braco-direito" x="20" y="120" width="25" height="100" rx="10" style={estilo('braco-direito')} onClick={(e) => tratarClique(e, 'braco-direito')} />
          <rect id="braco-esquerdo" x="155" y="120" width="25" height="100" rx="10" style={estilo('braco-esquerdo')} onClick={(e) => tratarClique(e, 'braco-esquerdo')} />
          <circle id="mao-direita" cx="32" cy="235" r="15" style={estilo('mao-direita')} onClick={(e) => tratarClique(e, 'mao-direita')} />
          <circle id="mao-esquerda" cx="168" cy="235" r="15" style={estilo('mao-esquerda')} onClick={(e) => tratarClique(e, 'mao-esquerda')} />

          {/* Pernas e Pés */}
          <rect id="perna-direita" x="70" y="320" width="28" height="150" rx="5" style={estilo('perna-direita')} onClick={(e) => tratarClique(e, 'perna-direita')} />
          <rect id="perna-esquerda" x="102" y="320" width="28" height="150" rx="5" style={estilo('perna-esquerda')} onClick={(e) => tratarClique(e, 'perna-esquerda')} />
          <path id="pe-direito" d="M70,470 L98,470 L98,490 L60,490 Z" style={estilo('pe-direito')} onClick={(e) => tratarClique(e, 'pe-direito')} />
          <path id="pe-esquerdo" d="M102,470 L130,470 L140,490 L102,490 Z" style={estilo('pe-esquerdo')} onClick={(e) => tratarClique(e, 'pe-esquerdo')} />
        </g>
      )}

      {/* --- VISTA COSTAS --- */}
      {vista === 'costas' && (
        <g transform="translate(100, 50)">
          <path id="nuca" d="M100,0 C70,0 50,30 50,60 C50,90 60,100 100,100 C140,100 150,90 150,60 C150,30 130,0 100,0 Z" style={estilo('nuca')} onClick={(e) => tratarClique(e, 'nuca')} />
          
          {/* Coluna */}
          <rect id="coluna-cervical" x="90" y="100" width="20" height="30" style={estilo('coluna-cervical')} onClick={(e) => tratarClique(e, 'coluna-cervical')} />
          <rect id="coluna-toracica" x="90" y="130" width="20" height="90" style={estilo('coluna-toracica')} onClick={(e) => tratarClique(e, 'coluna-toracica')} />
          <rect id="coluna-lombar" x="90" y="220" width="20" height="60" style={estilo('coluna-lombar')} onClick={(e) => tratarClique(e, 'coluna-lombar')} />
          
          <path id="ombro-direito" d="M50,120 L90,120 L90,220 L60,200 Z" style={estilo('ombro-direito')} onClick={(e) => tratarClique(e, 'ombro-direito')} />
          <path id="ombro-esquerdo" d="M150,120 L110,120 L110,220 L140,200 Z" style={estilo('ombro-esquerdo')} onClick={(e) => tratarClique(e, 'ombro-esquerdo')} />
          <path id="gluteos" d="M60,280 L140,280 L130,330 L70,330 Z" style={estilo('gluteos')} onClick={(e) => tratarClique(e, 'gluteos')} />
          
          {/* Membros Costas */}
          <rect id="braco-direito-costas" x="20" y="120" width="25" height="100" rx="10" style={estilo('braco-direito')} onClick={(e) => tratarClique(e, 'braco-direito')} />
          <rect id="braco-esquerdo-costas" x="155" y="120" width="25" height="100" rx="10" style={estilo('braco-esquerdo')} onClick={(e) => tratarClique(e, 'braco-esquerdo')} />
          <rect id="perna-direita-costas" x="70" y="330" width="28" height="140" rx="5" style={estilo('perna-direita')} onClick={(e) => tratarClique(e, 'perna-direita')} />
          <rect id="perna-esquerda-costas" x="102" y="330" width="28" height="140" rx="5" style={estilo('perna-esquerda')} onClick={(e) => tratarClique(e, 'perna-esquerda')} />
          <path id="pe-direito-costas" d="M70,470 L98,470 L98,490 L70,490 Z" style={estilo('pe-direito')} onClick={(e) => tratarClique(e, 'pe-direito')} />
          <path id="pe-esquerdo-costas" d="M102,470 L130,470 L130,490 L102,490 Z" style={estilo('pe-esquerdo')} onClick={(e) => tratarClique(e, 'pe-esquerdo')} />
        </g>
      )}
    </svg>
  );
};

export default CorpoHumano;