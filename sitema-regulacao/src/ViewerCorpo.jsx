import React from 'react';

const CorpoHumano = ({ aoSelecionar, parteAtiva, vista = 'frente' }) => {

  // --- CORES (Mantendo a lógica visual, mas com formas simples) ---
  const colors = {
    fill: 'transparent',      // Fundo transparente (ou branco se preferir)
    stroke: '#cbd5e1',        // Cinza claro para o contorno (Slate-300)
    strokeHover: '#94a3b8',   // Cinza mais escuro no hover
    fillSelected: '#3b82f6',  // Azul preenchido quando selecionado
    strokeSelected: '#1d4ed8' // Borda azul escura
  };

  const getStyle = (id) => {
    const isSelected = parteAtiva === id;
    return {
      fill: isSelected ? colors.fillSelected : colors.fill,
      stroke: isSelected ? colors.strokeSelected : colors.stroke,
      strokeWidth: isSelected ? '3' : '2',
      cursor: 'pointer',
      transition: 'all 0.2s',
      vectorEffect: 'non-scaling-stroke' // Garante linhas nítidas no zoom
    };
  };

  // Componente Helper para polígonos (Formas Retas)
  const Part = ({ id, points }) => (
    <polygon
      id={id}
      points={points}
      style={getStyle(id)}
      onClick={(e) => {
        e.stopPropagation();
        if (aoSelecionar) aoSelecionar(id);
      }}
      onMouseEnter={(e) => {
        if (parteAtiva !== id) e.target.style.stroke = colors.strokeHover;
        if (parteAtiva !== id) e.target.style.strokeWidth = '3';
      }}
      onMouseLeave={(e) => {
        if (parteAtiva !== id) e.target.style.stroke = colors.stroke;
        if (parteAtiva !== id) e.target.style.strokeWidth = '2';
        else e.target.style.stroke = colors.strokeSelected;
      }}
    />
  );

  // Helper para Círculo (Cabeça)
  const Head = ({ id, cx, cy, r }) => (
    <circle
      id={id}
      cx={cx} cy={cy} r={r}
      style={getStyle(id)}
      onClick={(e) => {
        e.stopPropagation();
        if (aoSelecionar) aoSelecionar(id);
      }}
    />
  );

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <svg 
        viewBox="0 0 300 600" 
        style={{ height: '500px', width: 'auto', maxWidth: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {vista === 'frente' ? (
          <g>
            {/* CABEÇA */}
            <Head id="cabeca" cx="150" cy="50" r="30" />
            
            {/* PESCOÇO (Retângulo simples) */}
            <Part id="pescoco" points="135,80 165,80 165,95 135,95" />

            {/* TRONCO (Trapézios Geométricos) */}
            <Part id="torax" points="110,95 190,95 180,170 120,170" />
            <Part id="abdomen" points="120,175 180,175 175,230 125,230" />
            <Part id="pelvis" points="125,235 175,235 190,280 110,280" />

            {/* BRAÇO ESQUERDO (Segmentado Reto) */}
            <Part id="ombro-esq" points="195,100 230,120 220,150 185,130" />
            <Part id="braco-esq" points="222,155 240,210 215,220 198,165" />
            <Part id="antebra-esq" points="242,215 260,270 235,280 218,225" />

            {/* BRAÇO DIREITO (Segmentado Reto) */}
            <Part id="ombro-dir" points="105,100 70,120 80,150 115,130" />
            <Part id="braco-dir" points="78,155 60,210 85,220 102,165" />
            <Part id="antebra-dir" points="58,215 40,270 65,280 82,225" />

            {/* PERNAS (Retângulos) */}
            <Part id="coxa-esq" points="155,285 185,285 180,380 150,380" />
            <Part id="canela-esq" points="152,385 178,385 175,480 155,480" />
            <Part id="pe-esq" points="155,480 185,480 195,500 150,500" />

            <Part id="coxa-dir" points="115,285 145,285 150,380 120,380" />
            <Part id="canela-dir" points="122,385 148,385 145,480 125,480" />
            <Part id="pe-dir" points="115,480 145,480 150,500 105,500" />
          </g>
        ) : (
          <g>
            {/* COSTAS - Mesma geometria, só mudando IDs para salvar correto no banco */}
            <Head id="cabeca-costas" cx="150" cy="50" r="30" />
            <Part id="pescoco-costas" points="135,80 165,80 165,95 135,95" />
            
            {/* Coluna Vertebral Simbolizada */}
            <Part id="costas-sup" points="110,95 190,95 180,170 120,170" />
            <Part id="lombar" points="120,175 180,175 175,230 125,230" />
            <Part id="gluteos" points="125,235 175,235 190,280 110,280" />

            {/* Membros Costas */}
            <Part id="ombro-esq-costas" points="195,100 230,120 220,150 185,130" />
            <Part id="braco-esq-costas" points="222,155 240,210 215,220 198,165" />
            
            <Part id="ombro-dir-costas" points="105,100 70,120 80,150 115,130" />
            <Part id="braco-dir-costas" points="78,155 60,210 85,220 102,165" />

            <Part id="coxa-esq-costas" points="155,285 185,285 180,380 150,380" />
            <Part id="canela-esq-costas" points="152,385 178,385 175,480 155,480" />
            
            <Part id="coxa-dir-costas" points="115,285 145,285 150,380 120,380" />
            <Part id="canela-dir-costas" points="122,385 148,385 145,480 125,480" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default CorpoHumano;