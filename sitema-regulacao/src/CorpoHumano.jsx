import React from 'react';

const CorpoHumano = ({ aoSelecionar, parteAtiva, vista = 'frente' }) => {

  // --- ESTILO: Geométrico e Reto ---
  const colors = {
    fill: '#f1f5f9',          // Fundo claro
    stroke: '#64748b',        // Linhas cinza chumbo
    fillSelected: '#3b82f6',  // Azul preenchimento
    strokeSelected: '#1d4ed8',// Azul borda forte
    hover: '#cbd5e1'          // Hover
  };

  const getStyle = (targetId) => {
    const isSelected = parteAtiva === targetId;
    return {
      fill: isSelected ? colors.fillSelected : colors.fill,
      stroke: isSelected ? colors.strokeSelected : colors.stroke,
      strokeWidth: isSelected ? '2.5' : '2', // Borda um pouco mais grossa para destacar as retas
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      vectorEffect: 'non-scaling-stroke',
      strokeLinejoin: 'miter', // Cantos vivos (retos)
    };
  };

  // Mantemos o componente auxiliar inteligente
  const BodyPart = ({ sqlId, d }) => (
    <path
      d={d}
      style={getStyle(sqlId)}
      onClick={(e) => {
        e.stopPropagation();
        if (aoSelecionar) aoSelecionar(sqlId);
      }}
      onMouseEnter={(e) => {
        if (parteAtiva !== sqlId) e.target.style.fill = colors.hover;
      }}
      onMouseLeave={(e) => {
        if (parteAtiva !== sqlId) e.target.style.fill = colors.fill;
        else e.target.style.fill = colors.fillSelected;
      }}
    />
  );

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <svg 
        viewBox="0 0 300 700" 
        style={{ height: '550px', width: 'auto', maxWidth: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {vista === 'frente' ? (
          <g transform="translate(0, 20)">
            {/* --- FRENTE RETO --- */}
            
            {/* Cabeça (Octógono simples) e Pescoço */}
            <BodyPart sqlId="cabeca" d="M130,30 L170,30 L180,50 L180,90 L170,110 L130,110 L120,90 L120,50 Z" />
            <BodyPart sqlId="pescoco" d="M135,110 L165,110 L165,130 L135,130 Z" />

            {/* Tronco (Trapézios Retos) */}
            <BodyPart sqlId="peito" d="M120,130 L180,130 L170,190 L130,190 Z" />
            <BodyPart sqlId="abdomen" d="M130,190 L170,190 L170,250 L130,250 Z" />
            <BodyPart sqlId="pelvis" d="M130,250 L170,250 L185,290 L115,290 Z" />

            {/* Braço Esquerdo (Segmentos Retos) */}
            <BodyPart sqlId="ombro-esquerdo" d="M180,130 L220,145 L210,175 L170,160 Z" />
            <BodyPart sqlId="braco-esquerdo" d="M210,175 L230,230 L210,235 L190,180 Z" /> {/* Bíceps */}
            <BodyPart sqlId="braco-esquerdo" d="M210,235 L220,290 L200,295 L190,240 Z" /> {/* Antebraço */}
            <BodyPart sqlId="mao-esquerda" d="M200,295 L210,325 L190,330 L180,300 Z" />

            {/* Braço Direito (Segmentos Retos) */}
            <BodyPart sqlId="ombro-direito" d="M120,130 L80,145 L90,175 L130,160 Z" />
            <BodyPart sqlId="braco-direito" d="M90,175 L70,230 L90,235 L110,180 Z" /> {/* Bíceps */}
            <BodyPart sqlId="braco-direito" d="M90,235 L80,290 L100,295 L110,240 Z" /> {/* Antebraço */}
            <BodyPart sqlId="mao-direita" d="M100,295 L90,325 L110,330 L120,300 Z" />

            {/* Perna Esquerda (Retas) */}
            <BodyPart sqlId="perna-esquerda" d="M155,290 L185,290 L175,390 L145,390 Z" /> {/* Coxa */}
            <BodyPart sqlId="perna-esquerda" d="M145,390 L175,390 L165,490 L135,490 Z" /> {/* Canela */}
            <BodyPart sqlId="pe-esquerdo" d="M135,490 L165,490 L175,515 L130,515 Z" />

            {/* Perna Direita (Retas) */}
            <BodyPart sqlId="perna-direita" d="M145,290 L115,290 L125,390 L155,390 Z" /> {/* Coxa */}
            <BodyPart sqlId="perna-direita" d="M155,390 L125,390 L135,490 L165,490 Z" /> {/* Canela */}
            <BodyPart sqlId="pe-direito" d="M165,490 L135,490 L125,515 L170,515 Z" />
          </g>
        ) : (
          <g transform="translate(0, 20)">
            {/* --- COSTAS RETO --- */}
            <BodyPart sqlId="cabeca" d="M130,30 L170,30 L180,50 L180,90 L170,110 L130,110 L120,90 L120,50 Z" />
            <BodyPart sqlId="pescoco" d="M135,110 L165,110 L165,130 L135,130 Z" />

            {/* Coluna Reta */}
            <BodyPart sqlId="coluna-cervical" d="M140,130 L160,130 L160,160 L140,160 Z" />
            <BodyPart sqlId="coluna-toracica" d="M140,160 L160,160 L160,220 L140,220 Z" />
            <BodyPart sqlId="coluna-lombar" d="M140,220 L160,220 L160,260 L140,260 Z" />

            {/* Ombros/Costas Fundo */}
            <BodyPart sqlId="ombro-esquerdo" d="M160,130 L220,145 L210,220 L160,220 Z" />
            <BodyPart sqlId="ombro-direito" d="M140,130 L80,145 L90,220 L140,220 Z" />
            <BodyPart sqlId="gluteos" d="M120,260 L180,260 L185,310 L115,310 Z" />

            {/* Membros Costas (Mesma geometria da frente) */}
            <BodyPart sqlId="braco-esquerdo" d="M210,175 L230,230 L210,235 L190,180 Z" />
            <BodyPart sqlId="braco-esquerdo" d="M210,235 L220,290 L200,295 L190,240 Z" />
            <BodyPart sqlId="mao-esquerda" d="M200,295 L210,325 L190,330 L180,300 Z" />

            <BodyPart sqlId="braco-direito" d="M90,175 L70,230 L90,235 L110,180 Z" />
            <BodyPart sqlId="braco-direito" d="M90,235 L80,290 L100,295 L110,240 Z" />
            <BodyPart sqlId="mao-direita" d="M100,295 L90,325 L110,330 L120,300 Z" />

            <BodyPart sqlId="perna-esquerda" d="M155,310 L185,310 L175,410 L145,410 Z" />
            <BodyPart sqlId="perna-esquerda" d="M145,410 L175,410 L165,510 L135,510 Z" />
            <BodyPart sqlId="pe-esquerdo" d="M135,510 L165,510 L175,535 L130,535 Z" />

            <BodyPart sqlId="perna-direita" d="M145,310 L115,310 L125,410 L155,410 Z" />
            <BodyPart sqlId="perna-direita" d="M155,410 L125,410 L135,510 L165,510 Z" />
            <BodyPart sqlId="pe-direito" d="M165,510 L135,510 L125,535 L170,535 Z" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default CorpoHumano;