import React from 'react';

const CorpoHumano = ({ aoSelecionar, parteAtiva, vista = 'frente', mapaDeNomes = {} }) => {

  // --- CORES ---
  const colors = {
    // Camada da Frente (Normal)
    fill: '#f8fafc',          
    stroke: '#64748b',        
    fillSelected: '#3b82f6',  
    strokeSelected: '#1d4ed8',
    hover: '#e2e8f0',
    
    // Camada de Trás (Pele/Geral) - Tom pêssego/pele
    skinBase: '#ffccbc',      // Cor normal da "aura" de pele
    skinSelected: '#ff7043',  // Cor quando a pele geral está selecionada
  };

  // --- FUNÇÕES AUXILIARES ---

  // Resolve o nome bonito baseado no ID
  const getNomeLegivel = (id) => mapaDeNomes[id]?.label || id;

  // Lida com o clique. Se for layer de pele, força o ID 'pele-geral'
  const handleAction = (e, sqlId, isSkinLayer) => {
    e.stopPropagation();
    const targetId = isSkinLayer ? 'pele-geral' : sqlId;
    
    const valorFinal = mapaDeNomes[targetId] ? mapaDeNomes[targetId] : targetId;
    if (aoSelecionar) aoSelecionar(valorFinal);
  };

  // --- GERADOR DE ESTILOS (O SEGREDO ESTÁ AQUI) ---
  const getStyle = (targetId, isSkinLayer) => {
    // --> ESTILO DA CAMADA DE PELE (FUNDO)
    if (isSkinLayer) {
      const isSkinActive = parteAtiva === 'pele-geral' || (parteAtiva && parteAtiva.id === 'pele-geral');
      const color = isSkinActive ? colors.skinSelected : colors.skinBase;
      
      return {
        fill: color,           // Preenchimento sólido
        stroke: color,         // Borda da MESMA cor
        strokeWidth: '12',     // Borda GROSSA para criar a "aura" externa
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        strokeLinejoin: 'round', // Cantos arredondados na junção
        strokeLinecap: 'round',
        opacity: isSkinActive ? 1 : 0.6 // Um pouco transparente se não selecionado
      };
    }

    // --> ESTILO DA CAMADA NORMAL (FRENTE)
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


  // --- COMPONENTES DE FORMA (Reutilizáveis para as duas camadas) ---
  
  const Block = ({ sqlId, x, y, w, h, radius = 6, isSkinLayer = false }) => (
    <rect
      x={x} y={y} width={w} height={h} rx={radius} ry={radius}
      style={getStyle(sqlId, isSkinLayer)}
      onClick={(e) => handleAction(e, sqlId, isSkinLayer)}
      // Hover só aplica na camada da frente para não bugar a de trás
      onMouseEnter={!isSkinLayer ? (e) => { if (parteAtiva !== sqlId) e.target.style.fill = colors.hover; } : undefined}
      onMouseLeave={!isSkinLayer ? (e) => { if (parteAtiva !== sqlId) e.target.style.fill = colors.fill; else e.target.style.fill = colors.fillSelected; } : undefined}
    >
      <title>{getNomeLegivel(isSkinLayer ? 'pele-geral' : sqlId)}</title>
    </rect>
  );

  const Round = ({ sqlId, cx, cy, r, isSkinLayer = false }) => (
    <circle
      cx={cx} cy={cy} r={r}
      style={getStyle(sqlId, isSkinLayer)}
      onClick={(e) => handleAction(e, sqlId, isSkinLayer)}
      onMouseEnter={!isSkinLayer ? (e) => { if (parteAtiva !== sqlId) e.target.style.fill = colors.hover; } : undefined}
      onMouseLeave={!isSkinLayer ? (e) => { if (parteAtiva !== sqlId) e.target.style.fill = colors.fill; else e.target.style.fill = colors.fillSelected; } : undefined}
    >
      <title>{getNomeLegivel(isSkinLayer ? 'pele-geral' : sqlId)}</title>
    </circle>
  );

  // --- DEFINIÇÃO DA ESTRUTURA DO CORPO (Para não repetir código) ---
  const renderBodyStructure = (isSkinLayer) => (
    <>
      <Round sqlId="cabeca" cx="150" cy="50" r="35" isSkinLayer={isSkinLayer} />
      <Block sqlId="pescoco" x="135" y="90" w="30" h="20" radius={4} isSkinLayer={isSkinLayer} />

      {vista === 'frente' ? (
        <>
           {/* TRONCO FRENTE */}
           <Block sqlId="peito" x="110" y="115" w="80" h="65" isSkinLayer={isSkinLayer} />
           <Block sqlId="abdomen" x="115" y="185" w="70" h="60" isSkinLayer={isSkinLayer} />
           <Block sqlId="pelvis" x="115" y="250" w="70" h="40" isSkinLayer={isSkinLayer} />
           {/* BRAÇOS FRENTE */}
           <Block sqlId="ombro-esquerdo" x="200" y="115" w="35" h="40" isSkinLayer={isSkinLayer} />
           <Block sqlId="biceps-esquerdo" x="205" y="160" w="25" h="55" isSkinLayer={isSkinLayer} />
           <Block sqlId="antebraco-esquerdo" x="205" y="220" w="25" h="55" isSkinLayer={isSkinLayer} />
           <Round sqlId="mao-esquerda" cx="217" cy="295" r="15" isSkinLayer={isSkinLayer} /> 
           <Block sqlId="ombro-direito" x="65" y="115" w="35" h="40" isSkinLayer={isSkinLayer} />
           <Block sqlId="biceps-direito" x="70" y="160" w="25" h="55" isSkinLayer={isSkinLayer} />
           <Block sqlId="antebraco-direito" x="70" y="220" w="25" h="55" isSkinLayer={isSkinLayer} />
           <Round sqlId="mao-direita" cx="82" cy="295" r="15" isSkinLayer={isSkinLayer} /> 
           {/* PERNAS FRENTE */}
           <Block sqlId="coxa-esquerda" x="155" y="300" w="35" h="90" isSkinLayer={isSkinLayer} />
           <Block sqlId="canela-esquerda" x="155" y="395" w="35" h="90" isSkinLayer={isSkinLayer} />
           <Block sqlId="pe-esquerdo" x="155" y="490" w="45" h="20" radius={4} isSkinLayer={isSkinLayer} />
           <Block sqlId="coxa-direita" x="110" y="300" w="35" h="90" isSkinLayer={isSkinLayer} />
           <Block sqlId="canela-direita" x="110" y="395" w="35" h="90" isSkinLayer={isSkinLayer} />
           <Block sqlId="pe-direito" x="100" y="490" w="45" h="20" radius={4} isSkinLayer={isSkinLayer} />
        </>
      ) : (
        <>
          {/* COSTAS ESTRUTURA */}
          <Block sqlId="coluna-cervical" x="135" y="115" w="30" h="40" radius={2} isSkinLayer={isSkinLayer} />
          <Block sqlId="coluna-toracica" x="135" y="160" w="30" h="65" radius={2} isSkinLayer={isSkinLayer} />
          <Block sqlId="coluna-lombar" x="135" y="230" w="30" h="40" radius={2} isSkinLayer={isSkinLayer} />
          <Block sqlId="ombro-direito" x="170" y="115" w="65" h="40" isSkinLayer={isSkinLayer} /> 
          <Block sqlId="ombro-esquerdo" x="65" y="115" w="65" h="40" isSkinLayer={isSkinLayer} />
          <Block sqlId="gluteos" x="110" y="275" w="80" h="20" isSkinLayer={isSkinLayer} />
          {/* BRAÇOS COSTAS */}
          <Block sqlId="biceps-direito" x="205" y="160" w="25" h="55" isSkinLayer={isSkinLayer} />
          <Block sqlId="antebraco-direito" x="205" y="220" w="25" h="55" isSkinLayer={isSkinLayer} />
          <Round sqlId="mao-direita" cx="217" cy="295" r="15" isSkinLayer={isSkinLayer} />
          <Block sqlId="biceps-esquerdo" x="70" y="160" w="25" h="55" isSkinLayer={isSkinLayer} />
          <Block sqlId="antebraco-esquerdo" x="70" y="220" w="25" h="55" isSkinLayer={isSkinLayer} />
          <Round sqlId="mao-esquerda" cx="82" cy="295" r="15" isSkinLayer={isSkinLayer} />
          {/* PERNAS COSTAS */}
          <Block sqlId="coxa-direita" x="155" y="305" w="35" h="90" isSkinLayer={isSkinLayer} />
          <Block sqlId="canela-direita" x="155" y="400" w="35" h="90" isSkinLayer={isSkinLayer} />
          <Block sqlId="pe-direito" x="155" y="495" w="35" h="20" radius={4} isSkinLayer={isSkinLayer} />
          <Block sqlId="coxa-esquerda" x="110" y="305" w="35" h="90" isSkinLayer={isSkinLayer} />
          <Block sqlId="canela-esquerda" x="110" y="400" w="35" h="90" isSkinLayer={isSkinLayer} />
          <Block sqlId="pe-esquerdo" x="110" y="495" w="35" h="20" radius={4} isSkinLayer={isSkinLayer} />
        </>
      )}
    </>
  );

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <svg 
        viewBox="0 0 300 650" 
        style={{ height: '550px', width: 'auto', maxWidth: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(0, 20)">
          
          {/* --- CAMADA 1: SILHUETA / PELE (FUNDO) --- */}
          {/* Desenhamos o corpo inteiro com borda grossa e cor de pele. 
              Como eles se sobrepõem e têm a mesma cor, viram uma silhueta única. */}
          <g id="camada-pele-silhueta">
             {renderBodyStructure(true)}
          </g>

          {/* --- CAMADA 2: PARTES DO CORPO (FRENTE) --- */}
          {/* Desenhamos o corpo normal por cima */}
          <g id="camada-corpo-normal">
             {renderBodyStructure(false)}
          </g>

        </g>
      </svg>
    </div>
  );
};

export default CorpoHumano;