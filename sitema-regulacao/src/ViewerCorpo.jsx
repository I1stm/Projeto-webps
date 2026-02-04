import React from 'react';

const CorpoHumano = ({ aoSelecionar, parteAtiva, vista = 'frente' }) => {

  // --- CORES & ESTILO ---
  const colors = {
    fill: '#f1f5f9',          // Slate-100 (Fundo suave)
    stroke: '#94a3b8',        // Slate-400 (Contorno neutro)
    fillSelected: '#3b82f6',  // Blue-500 (Selecionado)
    strokeSelected: '#1d4ed8',// Blue-700 (Borda forte)
    hover: '#cbd5e1'          // Slate-300 (Hover)
  };

  // Função que decide a cor baseada no ID selecionado
  const getStyle = (targetId) => {
    // Verifica se a parte ativa bate com o ID deste elemento
    const isSelected = parteAtiva === targetId;
    
    return {
      fill: isSelected ? colors.fillSelected : colors.fill,
      stroke: isSelected ? colors.strokeSelected : colors.stroke,
      strokeWidth: '2',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      vectorEffect: 'non-scaling-stroke', // Mantém a borda bonita no zoom
    };
  };

  // Componente auxiliar para desenhar uma parte do corpo
  // sqlId = O ID exato que está no seu banco de dados
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
            {/* --- FRENTE --- */}

            {/* Cabeça & Pescoço */}
            <BodyPart sqlId="cabeca" d="M150,20 C130,20 125,45 125,75 C125,105 135,120 150,120 C165,120 175,105 175,75 C175,45 170,20 150,20 Z" />
            <BodyPart sqlId="pescoco" d="M135,115 L165,115 L165,135 Q150,140 135,135 Z" />

            {/* Tronco (Dividido conforme SQL) */}
            <BodyPart sqlId="peito" d="M125,140 Q150,145 175,140 L180,200 Q150,210 120,200 Z" />
            <BodyPart sqlId="abdomen" d="M120,205 Q150,215 180,205 L175,260 Q150,270 125,260 Z" />
            <BodyPart sqlId="pelvis" d="M125,265 Q150,275 175,265 L185,300 L115,300 L125,265 Z" />

            {/* Braços (Agrupados: clique no antebraço ou bíceps manda o mesmo ID) */}
            {/* Esquerdo */}
            <BodyPart sqlId="ombro-esquerdo" d="M180,140 L210,150 L200,180 L178,170 Z" />
            <BodyPart sqlId="braco-esquerdo" d="M212,155 L220,200 L200,205 L195,160 Z" /> {/* Bíceps */}
            <BodyPart sqlId="braco-esquerdo" d="M220,205 L225,260 L205,265 L200,210 Z" /> {/* Antebraço */}
            <BodyPart sqlId="mao-esquerda" d="M225,265 L235,300 L210,305 L205,270 Z" />

            {/* Direito */}
            <BodyPart sqlId="ombro-direito" d="M120,140 L90,150 L100,180 L122,170 Z" />
            <BodyPart sqlId="braco-direito" d="M88,155 L80,200 L100,205 L105,160 Z" /> {/* Bíceps */}
            <BodyPart sqlId="braco-direito" d="M80,205 L75,260 L95,265 L100,210 Z" /> {/* Antebraço */}
            <BodyPart sqlId="mao-direita" d="M75,265 L65,300 L90,305 L95,270 Z" />

            {/* Pernas (Agrupados: Coxa e Canela enviam o mesmo ID) */}
            {/* Esquerda */}
            <BodyPart sqlId="perna-esquerda" d="M155,305 L180,305 L175,400 L150,400 Z" /> {/* Coxa */}
            <BodyPart sqlId="perna-esquerda" d="M152,405 L173,405 L170,500 L155,500 Z" /> {/* Canela */}
            <BodyPart sqlId="pe-esquerdo" d="M155,505 L170,505 L180,530 L150,530 Z" />

            {/* Direita */}
            <BodyPart sqlId="perna-direita" d="M145,305 L120,305 L125,400 L150,400 Z" /> {/* Coxa */}
            <BodyPart sqlId="perna-direita" d="M148,405 L127,405 L130,500 L145,500 Z" /> {/* Canela */}
            <BodyPart sqlId="pe-direito" d="M145,505 L130,505 L120,530 L150,530 Z" />
          </g>
        ) : (
          <g transform="translate(0, 20)">
            {/* --- COSTAS --- */}
            
            {/* Cabeça Costas */}
            <BodyPart sqlId="cabeca" d="M150,20 C130,20 125,45 125,75 C125,105 135,120 150,120 C165,120 175,105 175,75 C175,45 170,20 150,20 Z" />
            <BodyPart sqlId="pescoco" d="M135,115 L165,115 L165,135 Q150,140 135,135 Z" />

            {/* Coluna Vertebral (Dividida conforme SQL) */}
            <BodyPart sqlId="coluna-cervical" d="M140,135 L160,135 L160,165 L140,165 Z" />
            <BodyPart sqlId="coluna-toracica" d="M140,168 L160,168 L160,230 L140,230 Z" />
            <BodyPart sqlId="coluna-lombar" d="M140,233 L160,233 L160,270 L140,270 Z" />

            {/* Área das costas (fundo) - Não clicável ou parte do ombro */}
            {/* Decidi mapear as laterais das costas para 'Ombro' ou deixar visual. 
                Pelo seu SQL, não tem "Costas Superior". Vou expandir os ombros para preencher as costas. */}
            
            <BodyPart sqlId="ombro-esquerdo" d="M162,135 L210,150 L200,230 L162,230 Z" />
            <BodyPart sqlId="ombro-direito" d="M138,135 L90,150 L100,230 L138,230 Z" />

            {/* Glúteos */}
            <BodyPart sqlId="gluteos" d="M120,275 L180,275 L185,320 L115,320 Z" />

            {/* Membros Costas (Mesma lógica da frente) */}
            {/* Braço Esquerdo Costas */}
            <BodyPart sqlId="braco-esquerdo" d="M212,155 L220,200 L200,205 L195,160 Z" />
            <BodyPart sqlId="braco-esquerdo" d="M220,205 L225,260 L205,265 L200,210 Z" />
            <BodyPart sqlId="mao-esquerda" d="M225,265 L235,300 L210,305 L205,270 Z" />

            {/* Braço Direito Costas */}
            <BodyPart sqlId="braco-direito" d="M88,155 L80,200 L100,205 L105,160 Z" />
            <BodyPart sqlId="braco-direito" d="M80,205 L75,260 L95,265 L100,210 Z" />
            <BodyPart sqlId="mao-direita" d="M75,265 L65,300 L90,305 L95,270 Z" />

            {/* Perna Esquerda Costas */}
            <BodyPart sqlId="perna-esquerda" d="M155,325 L180,325 L175,400 L150,400 Z" />
            <BodyPart sqlId="perna-esquerda" d="M152,405 L173,405 L170,500 L155,500 Z" />
            <BodyPart sqlId="pe-esquerdo" d="M155,505 L170,505 L180,530 L150,530 Z" />

            {/* Perna Direita Costas */}
            <BodyPart sqlId="perna-direita" d="M145,325 L120,325 L125,400 L150,400 Z" />
            <BodyPart sqlId="perna-direita" d="M148,405 L127,405 L130,500 L145,500 Z" />
            <BodyPart sqlId="pe-direito" d="M145,505 L130,505 L120,530 L150,530 Z" />

          </g>
        )}
      </svg>
    </div>
  );
};

export default CorpoHumano;