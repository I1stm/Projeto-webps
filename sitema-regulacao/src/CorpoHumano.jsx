import React from 'react';

const CorpoHumano = ({ aoSelecionar, parteAtiva, vista = 'frente' }) => {

  // --- CORES & ESTILO (Tema Médico Clean) ---
  const colors = {
    baseFill: '#f1f5f9',      // Cinza bem claro (Slate-100)
    strokeDefault: '#94a3b8', // Cinza médio (Slate-400)
    selectedFill: '#3b82f6',  // Azul (Blue-500)
    selectedStroke: '#1d4ed8',// Azul Escuro (Blue-700)
    hoverFill: '#dbeafe',     // Azul Bebê (Blue-100)
  };

  // Estilo dinâmico para cada parte
  const getStyle = (targetId) => {
    const isSelected = parteAtiva === targetId;
    return {
      fill: isSelected ? colors.selectedFill : colors.baseFill,
      stroke: isSelected ? colors.selectedStroke : colors.strokeDefault,
      strokeWidth: isSelected ? '2' : '1.5',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      filter: isSelected ? 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.5))' : 'none',
    };
  };

  // Componente interno para reutilizar lógica do path
  const Part = ({ id, d }) => (
    <path
      id={id}
      d={d}
      style={getStyle(id)}
      onClick={(e) => {
        e.stopPropagation();
        if (aoSelecionar) aoSelecionar(id);
      }}
      onMouseEnter={(e) => {
        if (parteAtiva !== id) e.target.style.fill = colors.hoverFill;
      }}
      onMouseLeave={(e) => {
        if (parteAtiva !== id) e.target.style.fill = colors.baseFill;
        else e.target.style.fill = colors.selectedFill;
      }}
    />
  );

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <svg 
        viewBox="0 0 300 650" 
        style={{ height: '500px', width: 'auto', maxWidth: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {vista === 'frente' ? (
          <g>
            {/* CABEÇA - Redonda e suave */}
            <Part id="cabeca" d="M150,30 C130,30 125,50 125,80 C125,110 135,125 150,125 C165,125 175,110 175,80 C175,50 170,30 150,30 Z" />
            
            {/* TRONCO - Com curvas (peito e cintura) */}
            <Part id="torax" d="M128,130 Q150,140 172,130 L180,200 Q150,210 120,200 Z" />
            <Part id="abdomen" d="M120,205 Q150,215 180,205 L175,260 Q150,270 125,260 Z" />
            <Part id="pelvis" d="M125,265 Q150,275 175,265 L185,310 Q150,330 115,310 Z" />

            {/* BRAÇOS - Arredondados nas juntas */}
            <Part id="braco-dir" d="M128,130 Q100,135 90,170 L110,180 L125,140 Z" />
            <Part id="antebra-dir" d="M90,170 L85,220 Q100,225 110,220 L110,180 Z" />
            
            <Part id="braco-esq" d="M172,130 Q200,135 210,170 L190,180 L175,140 Z" />
            <Part id="antebra-esq" d="M210,170 L215,220 Q200,225 190,220 L190,180 Z" />

            {/* PERNAS - Coxas e Canelas */}
            <Part id="coxa-dir" d="M115,310 Q110,380 115,430 L145,430 Q150,380 148,310 Z" />
            <Part id="canela-dir" d="M115,430 L118,520 L142,520 L145,430 Z" />

            <Part id="coxa-esq" d="M185,310 Q190,380 185,430 L155,430 Q150,380 152,310 Z" />
            <Part id="canela-esq" d="M185,430 L182,520 L158,520 L155,430 Z" />
          </g>
        ) : (
          <g>
             {/* VERSÃO COSTAS (Simplificada para manter coerência) */}
             <Part id="cabeca-costas" d="M150,30 C130,30 125,50 125,80 C125,110 135,125 150,125 C165,125 175,110 175,80 C175,50 170,30 150,30 Z" />
             
             {/* Coluna e Costas */}
             <Part id="costas-sup" d="M125,130 L175,130 L180,220 L120,220 Z" />
             <Part id="lombar" d="M120,225 L180,225 L175,280 L125,280 Z" />
             <Part id="gluteos" d="M125,285 L175,285 L185,330 L115,330 Z" />
             
             {/* Membros Costas (Ids diferentes para registrar no banco se precisar) */}
             <Part id="braco-dir-costas" d="M125,135 L90,170 L110,180 L125,145 Z" />
             <Part id="braco-esq-costas" d="M175,135 L210,170 L190,180 L175,145 Z" />
             
             <Part id="perna-dir-costas" d="M118,330 L115,430 L145,430 L148,330 Z" />
             <Part id="perna-esq-costas" d="M182,330 L185,430 L155,430 L152,330 Z" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default CorpoHumano;