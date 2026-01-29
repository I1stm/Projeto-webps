import React from 'react';

const CorpoHumano = ({ aoSelecionar, parteAtiva, vista = 'frente' }) => {

  // Estilo Base Atualizado
  const estilo = (id) => ({
    // Se ativo: Verde Destaque. Se inativo: Cinza Base
    fill: parteAtiva === id ? 'var(--destaque)' : 'var(--boneco-base)',
    stroke: parteAtiva === id ? 'var(--destaque)' : '#546e7a',
    strokeWidth: '2px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    filter: parteAtiva === id 
      ? 'drop-shadow(0 0 10px var(--destaque))'
      : 'none'
  });

  const tratarClique = (e, id) => {
    e.stopPropagation();
    console.log("Selecionado:", id); // Debug para você ver o nome correto
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

          {/* Braços (Corrigido para CamelCase) */}
          <rect id="bracoDireito" x="20" y="120" width="25" height="100" rx="10" style={estilo('bracoDireito')} onClick={(e) => tratarClique(e, 'bracoDireito')} />
          <rect id="bracoEsquerdo" x="155" y="120" width="25" height="100" rx="10" style={estilo('bracoEsquerdo')} onClick={(e) => tratarClique(e, 'bracoEsquerdo')} />
          <circle id="maoDireita" cx="32" cy="235" r="15" style={estilo('maoDireita')} onClick={(e) => tratarClique(e, 'maoDireita')} />
          <circle id="maoEsquerda" cx="168" cy="235" r="15" style={estilo('maoEsquerda')} onClick={(e) => tratarClique(e, 'maoEsquerda')} />

          {/* Pernas e Pés (Corrigido para CamelCase) */}
          <rect id="pernaDireita" x="70" y="320" width="28" height="150" rx="5" style={estilo('pernaDireita')} onClick={(e) => tratarClique(e, 'pernaDireita')} />
          <rect id="pernaEsquerda" x="102" y="320" width="28" height="150" rx="5" style={estilo('pernaEsquerda')} onClick={(e) => tratarClique(e, 'pernaEsquerda')} />
          <path id="peDireito" d="M70,470 L98,470 L98,490 L60,490 Z" style={estilo('peDireito')} onClick={(e) => tratarClique(e, 'peDireito')} />
          <path id="peEsquerdo" d="M102,470 L130,470 L140,490 L102,490 Z" style={estilo('peEsquerdo')} onClick={(e) => tratarClique(e, 'peEsquerdo')} />
        </g>
      )}

      {/* --- VISTA COSTAS --- */}
      {vista === 'costas' && (
        <g transform="translate(100, 50)">
          <path id="nuca" d="M100,0 C70,0 50,30 50,60 C50,90 60,100 100,100 C140,100 150,90 150,60 C150,30 130,0 100,0 Z" style={estilo('nuca')} onClick={(e) => tratarClique(e, 'nuca')} />
          
          {/* Coluna (Corrigido para CamelCase) */}
          <rect id="colunaCervical" x="90" y="100" width="20" height="30" style={estilo('colunaCervical')} onClick={(e) => tratarClique(e, 'colunaCervical')} />
          <rect id="colunaToracica" x="90" y="130" width="20" height="90" style={estilo('colunaToracica')} onClick={(e) => tratarClique(e, 'colunaToracica')} />
          <rect id="colunaLombar" x="90" y="220" width="20" height="60" style={estilo('colunaLombar')} onClick={(e) => tratarClique(e, 'colunaLombar')} />
          
          {/* Ombros e Glúteos (Corrigido para CamelCase) */}
          <path id="ombroDireito" d="M50,120 L90,120 L90,220 L60,200 Z" style={estilo('ombroDireito')} onClick={(e) => tratarClique(e, 'ombroDireito')} />
          <path id="ombroEsquerdo" d="M150,120 L110,120 L110,220 L140,200 Z" style={estilo('ombroEsquerdo')} onClick={(e) => tratarClique(e, 'ombroEsquerdo')} />
          <path id="gluteos" d="M60,280 L140,280 L130,330 L70,330 Z" style={estilo('gluteos')} onClick={(e) => tratarClique(e, 'gluteos')} />
          
          {/* Membros Costas (Reaproveita os mesmos IDs da frente ou cria específicos se precisar) */}
          {/* Nota: Mantive os mesmos nomes para simplificar o banco de dados */}
          <rect id="bracoDireito-costas" x="20" y="120" width="25" height="100" rx="10" style={estilo('bracoDireito')} onClick={(e) => tratarClique(e, 'bracoDireito')} />
          <rect id="bracoEsquerdo-costas" x="155" y="120" width="25" height="100" rx="10" style={estilo('bracoEsquerdo')} onClick={(e) => tratarClique(e, 'bracoEsquerdo')} />
          
          <rect id="pernaDireita-costas" x="70" y="330" width="28" height="140" rx="5" style={estilo('pernaDireita')} onClick={(e) => tratarClique(e, 'pernaDireita')} />
          <rect id="pernaEsquerda-costas" x="102" y="330" width="28" height="140" rx="5" style={estilo('pernaEsquerda')} onClick={(e) => tratarClique(e, 'pernaEsquerda')} />
          
          <path id="peDireito-costas" d="M70,470 L98,470 L98,490 L70,490 Z" style={estilo('peDireito')} onClick={(e) => tratarClique(e, 'peDireito')} />
          <path id="peEsquerdo-costas" d="M102,470 L130,470 L130,490 L102,490 Z" style={estilo('peEsquerdo')} onClick={(e) => tratarClique(e, 'peEsquerdo')} />
        </g>
      )}
    </svg>
  );
};

export default CorpoHumano;