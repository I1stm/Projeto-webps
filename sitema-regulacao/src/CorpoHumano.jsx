import React from 'react';

const CorpoHumano = ({ aoSelecionar, parteAtiva, vista = 'frente' }) => {

  // --- ESTILO: Blocos Arredondados (Modular) ---
  const colors = {
    fill: '#f8fafc',          // Fundo quase branco
    stroke: '#64748b',        // Borda cinza
    fillSelected: '#3b82f6',  // Azul seleção
    strokeSelected: '#1d4ed8',// Azul borda
    hover: '#e2e8f0'          // Hover
  };

  const getStyle = (targetId) => {
    const isSelected = parteAtiva === targetId;
    return {
      fill: isSelected ? colors.fillSelected : colors.fill,
      stroke: isSelected ? colors.strokeSelected : colors.stroke,
      strokeWidth: isSelected ? '2.5' : '2',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      vectorEffect: 'non-scaling-stroke',
    };
  };

  // Componente para RETÂNGULOS (Tronco, membros, pescoço)
  const Block = ({ sqlId, x, y, w, h, radius = 6 }) => (
    <rect
      x={x} y={y} width={w} height={h} rx={radius} ry={radius}
      style={getStyle(sqlId)}
      onClick={(e) => { e.stopPropagation(); if (aoSelecionar) aoSelecionar(sqlId); }}
      onMouseEnter={(e) => { if (parteAtiva !== sqlId) e.target.style.fill = colors.hover; }}
      onMouseLeave={(e) => {
        if (parteAtiva !== sqlId) e.target.style.fill = colors.fill;
        else e.target.style.fill = colors.fillSelected;
      }}
    />
  );

  // Componente para CÍRCULOS (Cabeça, Mãos)
  const Round = ({ sqlId, cx, cy, r }) => (
    <circle
      cx={cx} cy={cy} r={r}
      style={getStyle(sqlId)}
      onClick={(e) => { e.stopPropagation(); if (aoSelecionar) aoSelecionar(sqlId); }}
      onMouseEnter={(e) => { if (parteAtiva !== sqlId) e.target.style.fill = colors.hover; }}
      onMouseLeave={(e) => {
        if (parteAtiva !== sqlId) e.target.style.fill = colors.fill;
        else e.target.style.fill = colors.fillSelected;
      }}
    />
  );

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <svg 
        viewBox="0 0 300 650" 
        style={{ height: '550px', width: 'auto', maxWidth: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {vista === 'frente' ? (
          <g transform="translate(0, 20)">
            {/* --- FRENTE --- */}
            
            {/* CABEÇA (Redonda) e PESCOÇO (Reto) */}
            <Round sqlId="cabeca" cx="150" cy="50" r="35" />
            <Block sqlId="pescoco" x="135" y="90" w="30" h="20" radius={4} />

            {/* TRONCO (Blocos Retangulares) */}
            <Block sqlId="peito" x="110" y="115" w="80" h="65" />
            <Block sqlId="abdomen" x="115" y="185" w="70" h="60" />
            <Block sqlId="pelvis" x="115" y="250" w="70" h="40" />

            {/* MEMBROS ESQUERDOS */}
            <Block sqlId="ombro-esquerdo" x="200" y="115" w="35" h="40" />
            <Block sqlId="braco-esquerdo" x="205" y="160" w="25" h="55" /> {/* Bíceps */}
            <Block sqlId="braco-esquerdo" x="205" y="220" w="25" h="55" /> {/* Antebraço */}
            <Round sqlId="mao-esquerda" cx="217" cy="295" r="15" /> {/* Mão Redonda */}

            {/* MEMBROS DIREITOS */}
            <Block sqlId="ombro-direito" x="65" y="115" w="35" h="40" />
            <Block sqlId="braco-direito" x="70" y="160" w="25" h="55" /> {/* Bíceps */}
            <Block sqlId="braco-direito" x="70" y="220" w="25" h="55" /> {/* Antebraço */}
            <Round sqlId="mao-direita" cx="82" cy="295" r="15" /> {/* Mão Redonda */}

            {/* PERNAS (Blocos Longos) */}
            {/* Esquerda */}
            <Block sqlId="perna-esquerda" x="155" y="300" w="35" h="90" /> {/* Coxa */}
            <Block sqlId="perna-esquerda" x="155" y="395" w="35" h="90" /> {/* Canela */}
            <Block sqlId="pe-esquerdo" x="155" y="490" w="45" h="20" radius={4} />

            {/* Direita */}
            <Block sqlId="perna-direita" x="110" y="300" w="35" h="90" /> {/* Coxa */}
            <Block sqlId="perna-direita" x="110" y="395" w="35" h="90" /> {/* Canela */}
            <Block sqlId="pe-direito" x="100" y="490" w="45" h="20" radius={4} />
          </g>
        ) : (
          <g transform="translate(0, 20)">
            {/* --- COSTAS --- */}
            <Round sqlId="cabeca" cx="150" cy="50" r="35" />
            <Block sqlId="pescoco" x="135" y="90" w="30" h="20" radius={4} />

            {/* COLUNA (Blocos Centrais) */}
            <Block sqlId="coluna-cervical" x="135" y="115" w="30" h="40" radius={2} />
            <Block sqlId="coluna-toracica" x="135" y="160" w="30" h="65" radius={2} />
            <Block sqlId="coluna-lombar" x="135" y="230" w="30" h="40" radius={2} />

            {/* OMBROS E COSTAS (Laterais da coluna) */}
            <Block sqlId="ombro-esquerdo" x="170" y="115" w="30" h="110" />
            <Block sqlId="ombro-direito" x="100" y="115" w="30" h="110" />
            
            {/* GLÚTEOS */}
            <Block sqlId="gluteos" x="110" y="275" w="80" h="20" />

            {/* MEMBROS COSTAS (Repete estrutura frente) */}
            <Block sqlId="braco-esquerdo" x="205" y="160" w="25" h="55" />
            <Block sqlId="braco-esquerdo" x="205" y="220" w="25" h="55" />
            <Round sqlId="mao-esquerda" cx="217" cy="295" r="15" />

            <Block sqlId="braco-direito" x="70" y="160" w="25" h="55" />
            <Block sqlId="braco-direito" x="70" y="220" w="25" h="55" />
            <Round sqlId="mao-direita" cx="82" cy="295" r="15" />

            <Block sqlId="perna-esquerda" x="155" y="305" w="35" h="90" />
            <Block sqlId="perna-esquerda" x="155" y="400" w="35" h="90" />
            <Block sqlId="pe-esquerdo" x="155" y="495" w="45" h="20" radius={4} />

            <Block sqlId="perna-direita" x="110" y="305" w="35" h="90" />
            <Block sqlId="perna-direita" x="110" y="400" w="35" h="90" />
            <Block sqlId="pe-direito" x="100" y="495" w="45" h="20" radius={4} />
          </g>
        )}
      </svg>
    </div>
  );
};

export default CorpoHumano;