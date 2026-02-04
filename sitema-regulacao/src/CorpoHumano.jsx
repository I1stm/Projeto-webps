import React from 'react';

const CorpoHumano = ({ aoSelecionar, parteAtiva, vista = 'frente' }) => {

  // Estilo base dinâmico
  const pathStyle = (idParte) => ({
    fill: parteAtiva === idParte ? 'var(--destaque, #1976d2)' : '#e0e0e0', // Cor base cinza claro
    stroke: parteAtiva === idParte ? 'var(--destaque, #1976d2)' : '#90a4ae', // Contorno suave
    strokeWidth: '1.5',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    filter: parteAtiva === idParte ? 'drop-shadow(0 0 5px rgba(25, 118, 210, 0.5))' : 'none',
    outline: 'none'
  });

  // Eventos de Mouse (Hover Effect simples via JS ou CSS)
  const handleMouseEnter = (e) => {
    if (parteAtiva !== e.target.getAttribute('data-id-banco')) {
      e.target.style.fill = '#b0bec5'; // Um cinza um pouco mais escuro no hover
    }
  };

  const handleMouseLeave = (e) => {
    const idBanco = e.target.getAttribute('data-id-banco');
    if (parteAtiva !== idBanco) {
      e.target.style.fill = '#e0e0e0'; // Volta para a cor base
    } else {
      e.target.style.fill = 'var(--destaque, #1976d2)'; // Mantém destaque
    }
  };

  // Componente Helper para cada parte do corpo
  const Part = ({ d, idBanco }) => (
    <path 
      d={d}
      data-id-banco={idBanco}
      onClick={(e) => {
        e.stopPropagation();
        aoSelecionar(idBanco);
      }}
      style={pathStyle(idBanco)}
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    />
  );

  // --- DEFINIÇÃO DOS DESENHOS (SVG PATHS ORGÂNICOS) ---
  
  const pathsFrente = (
    <g transform="translate(10, 10)">
      {/* CABEÇA E PESCOÇO */}
      <Part idBanco="cabeca" d="M190,50 C165,50 155,75 155,100 C155,135 170,150 190,150 C210,150 225,135 225,100 C225,75 215,50 190,50 Z" />
      <Part idBanco="pescoco" d="M175,145 Q190,155 205,145 L205,165 Q190,170 175,165 Z" />

      {/* TRONCO */}
      <Part idBanco="peito" d="M155,165 Q190,175 225,165 L230,240 Q190,250 150,240 Z" />
      <Part idBanco="abdomen" d="M150,240 Q190,250 230,240 L225,310 Q190,320 155,310 Z" />
      <Part idBanco="pelvis" d="M155,310 Q190,320 225,310 L235,360 Q190,380 145,360 Z" />

      {/* BRAÇO DIREITO (Visão do observador: Esquerda) */}
      <Part idBanco="ombro-direito" d="M155,165 Q130,165 120,200 L145,210 Z" /> {/* Ombro separado visualmente ou unido */}
      <Part idBanco="braco-direito" d="M155,165 Q130,165 120,200 L115,260 Q135,265 145,260 L150,240 Z" />
      <Part idBanco="mao-direita" d="M115,260 Q105,300 100,330 Q90,350 110,350 Q125,340 120,320 L130,265 Z" />

      {/* BRAÇO ESQUERDO (Visão do observador: Direita) */}
      <Part idBanco="braco-esquerdo" d="M225,165 Q250,165 260,200 L265,260 Q245,265 235,260 L230,240 Z" />
      <Part idBanco="mao-esquerda" d="M265,260 Q275,300 280,330 Q290,350 270,350 Q255,340 260,320 L250,265 Z" />

      {/* PERNA DIREITA */}
      <Part idBanco="perna-direita" d="M145,360 Q135,450 140,500 L175,500 Q180,450 185,370 Z" />
      {/* Separando Canela se desejar, ou usando o mesmo ID */}
      <Part idBanco="perna-direita" d="M140,500 L145,620 L170,620 L175,500 Z" /> 
      <Part idBanco="pe-direito" d="M145,620 L125,640 L160,640 L170,620 Z" />

      {/* PERNA ESQUERDA */}
      <Part idBanco="perna-esquerda" d="M235,360 Q245,450 240,500 L205,500 Q200,450 195,370 Z" />
      <Part idBanco="perna-esquerda" d="M240,500 L235,620 L210,620 L205,500 Z" />
      <Part idBanco="pe-esquerdo" d="M235,620 L255,640 L220,640 L210,620 Z" />
    </g>
  );

  const pathsCostas = (
    <g transform="translate(10, 10)">
      {/* CABEÇA */}
      <Part idBanco="cabeca" d="M190,50 C165,50 155,75 155,100 C155,135 170,150 190,150 C210,150 225,135 225,100 C225,75 215,50 190,50 Z" />
      
      {/* COLUNA (Representação estilizada no centro) */}
      <Part idBanco="coluna-cervical" d="M180,150 L200,150 L200,180 L180,180 Z" />
      <Part idBanco="coluna-toracica" d="M182,185 L198,185 L198,265 L182,265 Z" />
      <Part idBanco="coluna-lombar" d="M180,270 L200,270 L200,310 L180,310 Z" />

      {/* OMBROS E COSTAS */}
      <Part idBanco="ombro-direito" d="M190,150 L155,160 L145,230 L180,230 Z" />
      <Part idBanco="ombro-esquerdo" d="M190,150 L225,160 L235,230 L200,230 Z" />
      
      {/* GLÚTEOS */}
      <Part idBanco="gluteos" d="M150,310 Q190,320 230,310 Q240,360 190,370 Q140,360 150,310 Z" />

      {/* MEMBROS POSTERIORES (Reutilizando lógica visual mas com IDs de costas se necessário) */}
      {/* Braços Costas */}
      <Part idBanco="braco-direito" d="M155,160 Q130,165 120,200 L115,260 Q135,265 145,260 L145,230 Z" />
      <Part idBanco="mao-direita" d="M115,260 Q105,300 100,330 Q90,350 110,350 Q125,340 120,320 L130,265 Z" />
      
      <Part idBanco="braco-esquerdo" d="M225,160 Q250,165 260,200 L265,260 Q245,265 235,260 L235,230 Z" />
      <Part idBanco="mao-esquerda" d="M265,260 Q275,300 280,330 Q290,350 270,350 Q255,340 260,320 L250,265 Z" />

      {/* Pernas Costas */}
      <Part idBanco="perna-direita" d="M155,360 Q140,450 145,500 L180,500 Q185,450 190,370 Z" />
      <Part idBanco="perna-direita" d="M145,500 L150,620 L175,620 L180,500 Z" />
      <Part idBanco="pe-direito" d="M150,620 L130,640 L165,640 L175,620 Z" />

      <Part idBanco="perna-esquerda" d="M225,360 Q240,450 235,500 L200,500 Q195,450 190,370 Z" />
      <Part idBanco="perna-esquerda" d="M235,500 L230,620 L205,620 L200,500 Z" />
      <Part idBanco="pe-esquerdo" d="M230,620 L250,640 L215,640 L205,620 Z" />
    </g>
  );

  return (
    <svg 
      viewBox="0 0 400 800" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ 
        width: '100%', 
        height: '100%', 
        maxHeight: '700px', // Aumentei um pouco para caber o novo desenho
        display: 'block',
        margin: '0 auto',
        filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))' 
      }}
    >
      <defs>
        {/* Mantive seu gradiente, mas ajustei para o novo SVG */}
        <linearGradient id="gradBody" x1="0%" y1="0%" x2="100%" y2="0%">
           <stop offset="0%" style={{stopColor:'var(--texto-primario, #333)', stopOpacity:0.05}} />
           <stop offset="50%" style={{stopColor:'var(--texto-primario, #333)', stopOpacity:0}} />
           <stop offset="100%" style={{stopColor:'var(--texto-primario, #333)', stopOpacity:0.05}} />
        </linearGradient>
      </defs>

      {vista === 'frente' ? pathsFrente : pathsCostas}
      
    </svg>
  );
};

export default CorpoHumano;