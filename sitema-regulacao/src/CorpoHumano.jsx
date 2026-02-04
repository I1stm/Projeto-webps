import React from 'react';

const CorpoHumano = ({ aoSelecionar, parteAtiva, vista = 'frente' }) => {

  // --- CORES & ESTILO (Tema Médico Moderno) ---
  const colors = {
    baseFill: '#f8fafc',      // Branco Gelo (Fundo do osso/músculo)
    strokeDefault: '#64748b', // Cinza Chumbo (Contorno nítido)
    selectedFill: '#0ea5e9',  // Azul Celeste (Seleção)
    selectedStroke: '#0369a1',// Azul Escuro (Borda Seleção)
    hoverFill: '#e0f2fe',     // Azul Clarinho (Hover)
  };

  // Função de Estilo
  const getStyle = (targetId) => {
    const isSelected = parteAtiva === targetId;
    return {
      fill: isSelected ? colors.selectedFill : colors.baseFill,
      stroke: isSelected ? colors.selectedStroke : colors.strokeDefault,
      strokeWidth: isSelected ? '2.5' : '1.5',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      filter: isSelected ? 'drop-shadow(0 0 6px rgba(14, 165, 233, 0.5))' : 'none',
      vectorEffect: 'non-scaling-stroke', // Mantém a borda nítida mesmo escalando
    };
  };

  const handleClick = (e, targetId) => {
    e.stopPropagation();
    if (aoSelecionar) aoSelecionar(targetId);
  };

  // Componente de Parte (com a correção do dbId que fizemos antes)
  const BodyPart = ({ id, dbId, d }) => {
    const finalId = dbId || id;
    return (
      <path
        id={id}
        data-part={finalId}
        d={d}
        onClick={(e) => handleClick(e, finalId)}
        style={getStyle(finalId)}
        onMouseEnter={(e) => {
          if (parteAtiva !== finalId) e.target.style.fill = colors.hoverFill;
        }}
        onMouseLeave={(e) => {
          if (parteAtiva !== finalId) e.target.style.fill = colors.baseFill;
          else e.target.style.fill = colors.selectedFill;
        }}
      />
    );
  };

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <svg 
        viewBox="0 0 300 700" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ 
          height: '600px', 
          width: 'auto',
          maxWidth: '100%',
          filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.15))' // Sombra 3D no boneco inteiro
        }}
      >
        {/* --- FRENTE (Anatomia Realista) --- */}
        {vista === 'frente' && (
          <g transform="translate(0, 10)">
            
            {/* CABEÇA (Formato Ovoide Humano) */}
            <BodyPart id="cabeca" d="M150,20 C130,20 120,45 120,75 C120,115 135,130 150,130 C165,130 180,115 180,75 C180,45 170,20 150,20 Z" />
            <BodyPart id="pescoco" d="M138,125 Q150,135 162,125 L162,145 Q150,150 138,145 Z" />

            {/* TRONCO (Peitoral definido + Cintura) */}
            <BodyPart id="peito" d="M125,145 Q150,155 175,145 L180,210 Q150,220 120,210 Z" />
            <BodyPart id="abdomen" d="M120,210 Q150,220 180,210 L175,270 Q150,280 125,270 Z" />
            <BodyPart id="pelvis" d="M125,270 Q150,280 175,270 L185,310 Q150,330 115,310 Z" />

            {/* BRAÇO DIREITO (Ombro + Bíceps + Antebraço) */}
            <BodyPart id="ombro-direito" d="M125,145 Q100,150 95,175 L115,185 L125,145 Z" />
            <BodyPart id="braco-direito" d="M95,175 L90,230 Q105,235 115,230 L115,185 Z" />
            <BodyPart id="mao-direita" d="M90,230 L85,275 Q100,285 110,275 L110,230 Z" />

            {/* BRAÇO ESQUERDO */}
            <BodyPart id="ombro-esquerdo" d="M175,145 Q200,150 205,175 L185,185 L175,145 Z" />
            <BodyPart id="braco-esquerdo" d="M205,175 L210,230 Q195,235 185,230 L185,185 Z" />
            <BodyPart id="mao-esquerda" d="M210,230 L215,275 Q200,285 190,275 L190,230 Z" />

            {/* PERNA DIREITA (Coxa Muscular + Panturrilha) */}
            <BodyPart id="perna-direita-coxa" dbId="perna-direita" d="M115,310 Q110,380 115,430 L145,430 Q150,380 148,310 Z" />
            <BodyPart id="perna-direita-canela" dbId="perna-direita" d="M115,430 L118,530 L142,530 L145,430 Z" />
            <BodyPart id="pe-direito" d="M118,530 L105,550 L140,550 L142,530 Z" />

            {/* PERNA ESQUERDA */}
            <BodyPart id="perna-esquerda-coxa" dbId="perna-esquerda" d="M185,310 Q190,380 185,430 L155,430 Q150,380 152,310 Z" />
            <BodyPart id="perna-esquerda-canela" dbId="perna-esquerda" d="M185,430 L182,530 L158,530 L155,430 Z" />
            <BodyPart id="pe-esquerdo" d="M182,530 L195,550 L160,550 L158,530 Z" />
          </g>
        )}

        {/* --- COSTAS (Coluna Vertebral + Omoplatas) --- */}
        {vista === 'costas' && (
          <g transform="translate(0, 10)">
             {/* Cabeça Costas */}
            <BodyPart id="cabeca" d="M150,20 C130,20 120,45 120,75 C120,115 135,130 150,130 C165,130 180,115 180,75 C180,45 170,20 150,20 Z" />
            
            {/* Coluna Vertebral (Visualização em gomos) */}
            <path d="M145,130 L155,130 L155,310 L145,310 Z" fill="#e2e8f0" stroke="none" /> {/* Fundo da coluna não clicável */}
            <BodyPart id="coluna-cervical" d="M142,130 L158,130 L158,160 L142,160 Z" />
            <BodyPart id="coluna-toracica" d="M142,162 L158,162 L158,240 L142,240 Z" />
            <BodyPart id="coluna-lombar" d="M142,242 L158,242 L158,280 L142,280 Z" />
            
            {/* Costas Laterais */}
            <BodyPart id="ombro-direito" d="M142,145 L125,150 L120,220 L142,220 Z" />
            <BodyPart id="ombro-esquerdo" d="M158,145 L175,150 L180,220 L158,220 Z" />
            <BodyPart id="gluteos" d="M120,280 Q150,290 180,280 Q190,330 150,340 Q110,330 120,280 Z" />

            {/* Membros Costas (Igual frente mas ids de banco) */}
            <BodyPart id="braco-direito-costas" dbId="braco-direito" d="M120,150 L95,175 L90,230 Q105,235 115,230 L120,185 Z" />
            <BodyPart id="mao-direita-costas" dbId="mao-direita" d="M90,230 L85,275 Q100,285 110,275 L110,230 Z" />

            <BodyPart id="braco-esquerdo-costas" dbId="braco-esquerdo" d="M180,150 L205,175 L210,230 Q195,235 185,230 L180,185 Z" />
            <BodyPart id="mao-esquerda-costas" dbId="mao-esquerda" d="M210,230 L215,275 Q200,285 190,275 L190,230 Z" />

            <BodyPart id="perna-direita-costas" dbId="perna-direita" d="M125,340 Q120,410 125,430 L145,430 L148,340 Z" />
            <BodyPart id="perna-direita-canela-costas" dbId="perna-direita" d="M125,430 L128,530 L142,530 L145,430 Z" />
            <BodyPart id="pe-direito-costas" dbId="pe-direito" d="M128,530 L115,550 L145,550 L142,530 Z" />

            <BodyPart id="perna-esquerda-costas" dbId="perna-esquerda" d="M175,340 Q180,410 175,430 L155,430 L152,340 Z" />
            <BodyPart id="perna-esquerda-canela-costas" dbId="perna-esquerda" d="M175,430 L172,530 L158,530 L155,430 Z" />
            <BodyPart id="pe-esquerdo-costas" dbId="pe-esquerdo" d="M172,530 L185,550 L155,550 L158,530 Z" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default CorpoHumano;