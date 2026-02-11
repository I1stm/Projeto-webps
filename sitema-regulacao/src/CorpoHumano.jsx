import React from 'react';

// Adicionamos 'mapaDeNomes' (o cérebro) nas props
const CorpoHumano = ({ aoSelecionar, parteAtiva, vista = 'frente', mapaDeNomes = {} }) => {

  // --- CORES & ESTILO ---
  const colors = {
    fill: '#f8fafc',          
    stroke: '#64748b',        
    fillSelected: '#3b82f6',  
    strokeSelected: '#1d4ed8',
    hover: '#e2e8f0',
    // Cor Especial para a Pele/Geral (um tom de laranja/pele suave)
    skinStroke: '#ffccbc',    
    skinSelected: '#ff5722'   
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
  const resolverAcao = (e, sqlIdOriginal) => {
    e.stopPropagation();
    const valorFinal = mapaDeNomes[sqlIdOriginal] ? mapaDeNomes[sqlIdOriginal] : sqlIdOriginal;
    if (aoSelecionar) aoSelecionar(valorFinal);
  };

  const getNomeLegivel = (id) => {
    return mapaDeNomes[id]?.label || id;
  };

  // --- COMPONENTES BÁSICOS ---
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
      <title>{getNomeLegivel(sqlId)}</title>
    </rect>
  );

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

  // --- NOVO: A CAMADA DE "PELE / GERAL" (O CONTORNO) ---
  const Contorno = ({ d }) => {
    const isSelected = parteAtiva === 'pele-geral' || (parteAtiva && parteAtiva.id === 'pele-geral');
    
    return (
      <path
        d={d}
        style={{
          fill: isSelected ? 'rgba(255, 87, 34, 0.1)' : 'transparent', // Leve preenchimento se selecionado
          stroke: isSelected ? colors.skinSelected : colors.skinStroke,
          strokeWidth: isSelected ? '6' : '15', // Borda grossa para ser fácil de clicar
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          opacity: 0.6
        }}
        onClick={(e) => resolverAcao(e, 'pele-geral')}
        onMouseEnter={(e) => { 
            if (!isSelected) {
                e.target.style.stroke = '#ffab91'; // Laranja mais forte no hover
                e.target.style.opacity = '1';
            }
        }}
        onMouseLeave={(e) => {
            if (!isSelected) {
                e.target.style.stroke = colors.skinStroke;
                e.target.style.opacity = '0.6';
            } else {
                e.target.style.stroke = colors.skinSelected;
            }
        }}
      >
        <title>{getNomeLegivel('pele-geral')}</title>
      </path>
    );
  };

  // Coordenadas do contorno (Silhueta baseada nos blocos)
  const pathFrente = "M150,10 C120,10 110,40 110,60 L100,90 L60,110 L50,160 L65,280 L90,300 L90,480 L130,480 L130,350 L170,350 L170,480 L210,480 L210,300 L235,280 L250,160 L240,110 L200,90 L190,60 C190,40 180,10 150,10 Z";
  
  // Costas é muito parecido, ajustando levemente
  const pathCostas = pathFrente; 

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <svg 
        viewBox="0 0 300 650" 
        style={{ height: '550px', width: 'auto', maxWidth: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {vista === 'frente' ? (
          <g transform="translate(0, 20)">
            
            {/* 1. CAMADA DE FUNDO (PELE/GERAL) */}
            {/* Desenha uma silhueta grossa atrás de tudo */}
            <Contorno d={pathFrente} />

            {/* 2. CAMADA DO CORPO (Os blocos que já fizemos) */}
            <Round sqlId="cabeca" cx="150" cy="50" r="35" />
            <Block sqlId="pescoco" x="135" y="90" w="30" h="20" radius={4} />

            <Block sqlId="peito" x="110" y="115" w="80" h="65" />
            <Block sqlId="abdomen" x="115" y="185" w="70" h="60" />
            <Block sqlId="pelvis" x="115" y="250" w="70" h="40" />

            <Block sqlId="ombro-esquerdo" x="200" y="115" w="35" h="40" />
            <Block sqlId="biceps-esquerdo" x="205" y="160" w="25" h="55" />
            <Block sqlId="antebraco-esquerdo" x="205" y="220" w="25" h="55" />
            <Round sqlId="mao-esquerda" cx="217" cy="295" r="15" /> 

            <Block sqlId="ombro-direito" x="65" y="115" w="35" h="40" />
            <Block sqlId="biceps-direito" x="70" y="160" w="25" h="55" />
            <Block sqlId="antebraco-direito" x="70" y="220" w="25" h="55" />
            <Round sqlId="mao-direita" cx="82" cy="295" r="15" /> 

            <Block sqlId="coxa-esquerda" x="155" y="300" w="35" h="90" />
            <Block sqlId="canela-esquerda" x="155" y="395" w="35" h="90" />
            <Block sqlId="pe-esquerdo" x="155" y="490" w="45" h="20" radius={4} />

            <Block sqlId="coxa-direita" x="110" y="300" w="35" h="90" />
            <Block sqlId="canela-direita" x="110" y="395" w="35" h="90" />
            <Block sqlId="pe-direito" x="100" y="490" w="45" h="20" radius={4} />
          </g>
        ) : (
          <g transform="translate(0, 20)">
            
            {/* 1. CAMADA DE FUNDO (PELE/GERAL) */}
            <Contorno d={pathCostas} />

            {/* 2. CAMADA DO CORPO COSTAS */}
            <Round sqlId="cabeca" cx="150" cy="50" r="35" />
            <Block sqlId="pescoco" x="135" y="90" w="30" h="20" radius={4} />

            <Block sqlId="coluna-cervical" x="135" y="115" w="30" h="40" radius={2} />
            <Block sqlId="coluna-toracica" x="135" y="160" w="30" h="65" radius={2} />
            <Block sqlId="coluna-lombar" x="135" y="230" w="30" h="40" radius={2} />

            <Block sqlId="ombro-direito" x="170" y="115" w="65" h="40" /> 
            <Block sqlId="ombro-esquerdo" x="65" y="115" w="65" h="40" />
            
            <Block sqlId="gluteos" x="110" y="275" w="80" h="20" />

            <Block sqlId="biceps-direito" x="205" y="160" w="25" h="55" />
            <Block sqlId="antebraco-direito" x="205" y="220" w="25" h="55" />
            <Round sqlId="mao-direita" cx="217" cy="295" r="15" />

            <Block sqlId="biceps-esquerdo" x="70" y="160" w="25" h="55" />
            <Block sqlId="antebraco-esquerdo" x="70" y="220" w="25" h="55" />
            <Round sqlId="mao-esquerda" cx="82" cy="295" r="15" />

            <Block sqlId="coxa-direita" x="155" y="305" w="35" h="90" />
            <Block sqlId="canela-direita" x="155" y="400" w="35" h="90" />
            <Block sqlId="pe-direito" x="155" y="495" w="35" h="20" radius={4} />

            <Block sqlId="coxa-esquerda" x="110" y="305" w="35" h="90" />
            <Block sqlId="canela-esquerda" x="110" y="400" w="35" h="90" />
            <Block sqlId="pe-esquerdo" x="110" y="495" w="35" h="20" radius={4} />
          </g>
        )}
      </svg>
    </div>
  );
};

export default CorpoHumano;