import React from 'react';

// Adicionamos 'mapaDeNomes' (o cérebro) nas props
const CorpoHumano = ({ aoSelecionar, parteAtiva, vista = 'frente', mapaDeNomes = {} }) => {

  // --- CORES & ESTILO (Tema Modular Clean) ---
  const colors = {
    fill: '#f8fafc',          // Fundo quase branco
    stroke: '#64748b',        // Borda cinza
    fillSelected: '#3b82f6',  // Azul seleção
    strokeSelected: '#1d4ed8',// Azul borda forte
    hover: '#e2e8f0'          // Hover suave
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

  // --- A MÁGICA DA TRADUÇÃO ---
  // Quando clica, ele olha no mapa se esse ID tem um nome especial no banco
  const resolverAcao = (e, sqlIdOriginal) => {
    e.stopPropagation();
    
    // Tenta achar o objeto no dicionário (ex: { label: 'Coxa', id: 'coxa-dir' })
    // Se não achar, usa o ID original mesmo.
    const valorFinal = mapaDeNomes[sqlIdOriginal] ? mapaDeNomes[sqlIdOriginal] : sqlIdOriginal;
    
    if (aoSelecionar) aoSelecionar(valorFinal);
  };

  // Função auxiliar para pegar o nome legível (para o tooltip do mouse)
  const getNomeLegivel = (id) => {
    return mapaDeNomes[id]?.label || id;
  };

  // Componente Genérico para RETÂNGULOS (Tronco, membros)
  const Block = ({ sqlId, x, y, w, h, radius = 6 }) => (
    <rect
      x={x} y={y} width={w} height={h} rx={radius} ry={radius}
      style={getStyle(sqlId)}
      onClick={(e) => resolverAcao(e, sqlId)}
      onMouseEnter={(e) => { if (parteAtiva !== sqlId) e.target.style.fill = colors.hover; }}
      onMouseLeave={(e) => {
        if (parteAtiva !== sqlId) e.target.style.fill = colors.fill;
        else e.target.style.fill = colors.fillSelected;
      }}
    >
      {/* Mostra o nome real do banco quando para o mouse em cima */}
      <title>{getNomeLegivel(sqlId)}</title>
    </rect>
  );

  // Componente Genérico para CÍRCULOS (Cabeça, Mãos)
  const Round = ({ sqlId, cx, cy, r }) => (
    <circle
      cx={cx} cy={cy} r={r}
      style={getStyle(sqlId)}
      onClick={(e) => resolverAcao(e, sqlId)}
      onMouseEnter={(e) => { if (parteAtiva !== sqlId) e.target.style.fill = colors.hover; }}
      onMouseLeave={(e) => {
        if (parteAtiva !== sqlId) e.target.style.fill = colors.fill;
        else e.target.style.fill = colors.fillSelected;
      }}
    >
      <title>{getNomeLegivel(sqlId)}</title>
    </circle>
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
            
            <Round sqlId="cabeca" cx="150" cy="50" r="35" />
            <Block sqlId="pescoco" x="135" y="90" w="30" h="20" radius={4} />

            <Block sqlId="peito" x="110" y="115" w="80" h="65" />
            <Block sqlId="abdomen" x="115" y="185" w="70" h="60" />
            <Block sqlId="pelvis" x="115" y="250" w="70" h="40" />

            {/* MEMBROS ESQUERDOS */}
            <Block sqlId="ombro-esquerdo" x="200" y="115" w="35" h="40" />
            <Block sqlId="biceps-esquerdo" x="205" y="160" w="25" h="55" />
            <Block sqlId="antebraco-esquerdo" x="205" y="220" w="25" h="55" />
            <Round sqlId="mao-esquerda" cx="217" cy="295" r="15" /> 

            {/* MEMBROS DIREITOS */}
            <Block sqlId="ombro-direito" x="65" y="115" w="35" h="40" />
            <Block sqlId="biceps-direito" x="70" y="160" w="25" h="55" />
            <Block sqlId="antebraco-direito" x="70" y="220" w="25" h="55" />
            <Round sqlId="mao-direita" cx="82" cy="295" r="15" /> 

            {/* PERNAS FRENTE */}
            <Block sqlId="coxa-esquerda" x="155" y="300" w="35" h="90" />
            <Block sqlId="canela-esquerda" x="155" y="395" w="35" h="90" />
            <Block sqlId="pe-esquerdo" x="155" y="490" w="45" h="20" radius={4} />

            <Block sqlId="coxa-direita" x="110" y="300" w="35" h="90" />
            <Block sqlId="canela-direita" x="110" y="395" w="35" h="90" />
            <Block sqlId="pe-direito" x="100" y="490" w="45" h="20" radius={4} />
          </g>
        ) : (
          <g transform="translate(0, 20)">
            {/* --- COSTAS --- */}
            <Round sqlId="cabeca" cx="150" cy="50" r="35" />
            <Block sqlId="pescoco" x="135" y="90" w="30" h="20" radius={4} />

            <Block sqlId="coluna-cervical" x="135" y="115" w="30" h="40" radius={2} />
            <Block sqlId="coluna-toracica" x="135" y="160" w="30" h="65" radius={2} />
            <Block sqlId="coluna-lombar" x="135" y="230" w="30" h="40" radius={2} />

            {/* OMBROS (Ajustados para preencher costas) */}
            <Block sqlId="ombro-esquerdo" x="170" y="115" w="65" h="40" /> 
            <Block sqlId="ombro-direito" x="65" y="115" w="65" h="40" />
            <Block sqlId="gluteos" x="110" y="275" w="80" h="20" />

            {/* MEMBROS COSTAS */}
            <Block sqlId="biceps-esquerdo" x="205" y="160" w="25" h="55" />
            <Block sqlId="antebraco-esquerdo" x="205" y="220" w="25" h="55" />
            <Round sqlId="mao-esquerda" cx="217" cy="295" r="15" />

            <Block sqlId="biceps-direito" x="70" y="160" w="25" h="55" />
            <Block sqlId="antebraco-direito" x="70" y="220" w="25" h="55" />
            <Round sqlId="mao-direita" cx="82" cy="295" r="15" />

            {/* PERNAS COSTAS */}
            <Block sqlId="coxa-esquerda" x="155" y="305" w="35" h="90" />
            <Block sqlId="canela-esquerda" x="155" y="400" w="35" h="90" />
            <Block sqlId="pe-esquerdo" x="155" y="495" w="35" h="20" radius={4} />

            <Block sqlId="coxa-direita" x="110" y="305" w="35" h="90" />
            <Block sqlId="canela-direita" x="110" y="400" w="35" h="90" />
            <Block sqlId="pe-direito" x="110" y="495" w="35" h="20" radius={4} />
          </g>
        )}
      </svg>
    </div>
  );
};

export default CorpoHumano;