import React from 'react';

const CorpoHumano = ({ aoSelecionar, parteAtiva, vista = 'frente' }) => {

  // --- ESTILO: Clean e Arredondado ---
  const colors = {
    fill: '#f8fafc',          // Fundo quase branco (Slate-50)
    stroke: '#64748b',        // Borda Cinza (Slate-500)
    fillSelected: '#3b82f6',  // Azul (Blue-500)
    strokeSelected: '#1d4ed8',// Azul Escuro
    hoverFill: '#e2e8f0'      // Hover suave
  };

  const getStyle = (id) => {
    const isSelected = parteAtiva === id;
    return {
      fill: isSelected ? colors.fillSelected : colors.fill,
      stroke: isSelected ? colors.strokeSelected : colors.stroke,
      strokeWidth: isSelected ? '2.5' : '2',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      rx: '10', // ARREDONDAMENTO PADRÃO DOS CANTOS
      ry: '10'
    };
  };

  // Componente para criar os "blocos" do corpo (Retângulos Arredondados)
  const Part = ({ id, x, y, width, height, customRx }) => (
    <rect
      id={id}
      x={x} y={y} width={width} height={height}
      rx={customRx || 8} // Cantos arredondados
      ry={customRx || 8}
      style={getStyle(id)}
      onClick={(e) => {
        e.stopPropagation();
        if (aoSelecionar) aoSelecionar(id);
      }}
      onMouseEnter={(e) => {
        if (parteAtiva !== id) e.target.style.fill = colors.hoverFill;
      }}
      onMouseLeave={(e) => {
        if (parteAtiva !== id) e.target.style.fill = colors.fill;
        else e.target.style.fill = colors.fillSelected;
      }}
    />
  );

  // Cabeça (Círculo)
  const Head = ({ id }) => (
    <circle
      id={id}
      cx="150" cy="50" r="35"
      style={{...getStyle(id), rx: undefined, ry: undefined}} // Remove rx/ry do style pois é circle
      onClick={(e) => { e.stopPropagation(); if (aoSelecionar) aoSelecionar(id); }}
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
            <Head id="cabeca" />
            
            {/* PESCOÇO */}
            <Part id="pescoco" x="135" y="90" width="30" height="20" customRx={5} />

            {/* TRONCO (Dividido em blocos arredondados) */}
            <Part id="torax" x="110" y="115" width="80" height="70" customRx={15} />
            <Part id="abdomen" x="115" y="190" width="70" height="60" />
            <Part id="pelvis" x="115" y="255" width="70" height="40" />

            {/* BRAÇOS (Cápsulas) */}
            {/* Esquerdo */}
            <Part id="ombro-esq" x="200" y="120" width="30" height="40" />
            <Part id="braco-esq" x="205" y="165" width="25" height="60" />
            <Part id="antebra-esq" x="205" y="230" width="25" height="60" />
            
            {/* Direito */}
            <Part id="ombro-dir" x="70" y="120" width="30" height="40" />
            <Part id="braco-dir" x="70" y="165" width="25" height="60" />
            <Part id="antebra-dir" x="70" y="230" width="25" height="60" />

            {/* PERNAS (Cápsulas Longas) */}
            {/* Esquerda */}
            <Part id="coxa-esq" x="155" y="300" width="35" height="90" />
            <Part id="canela-esq" x="155" y="395" width="35" height="90" />
            <Part id="pe-esq" x="155" y="490" width="45" height="20" customRx={5} />

            {/* Direita */}
            <Part id="coxa-dir" x="110" y="300" width="35" height="90" />
            <Part id="canela-dir" x="110" y="395" width="35" height="90" />
            <Part id="pe-dir" x="100" y="490" width="45" height="20" customRx={5} />
          </g>
        ) : (
          <g>
            {/* COSTAS - Mesma estrutura visual, IDs de costas */}
            <Head id="cabeca-costas" />
            <Part id="pescoco-costas" x="135" y="90" width="30" height="20" customRx={5} />

            {/* Coluna/Costas */}
            <Part id="costas-sup" x="110" y="115" width="80" height="70" customRx={15} />
            <Part id="lombar" x="115" y="190" width="70" height="60" />
            <Part id="gluteos" x="115" y="255" width="70" height="40" />

            {/* Membros Costas */}
            <Part id="ombro-esq-costas" x="200" y="120" width="30" height="40" />
            <Part id="braco-esq-costas" x="205" y="165" width="25" height="60" />
            
            <Part id="ombro-dir-costas" x="70" y="120" width="30" height="40" />
            <Part id="braco-dir-costas" x="70" y="165" width="25" height="60" />

            <Part id="coxa-esq-costas" x="155" y="300" width="35" height="90" />
            <Part id="canela-esq-costas" x="155" y="395" width="35" height="90" />
            
            <Part id="coxa-dir-costas" x="110" y="300" width="35" height="90" />
            <Part id="canela-dir-costas" x="110" y="395" width="35" height="90" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default CorpoHumano;