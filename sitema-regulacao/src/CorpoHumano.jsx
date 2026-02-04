import React from 'react';

const CorpoHumano = ({ aoSelecionar, parteAtiva, vista = 'frente' }) => {

  // --- CONFIGURAÇÕES VISUAIS ---
  const colors = {
    base: '#eceff1',        // Cinza muito claro
    stroke: '#b0bec5',      // Contorno sutil
    selected: '#0ea5e9',    // Azul Celeste vibrante
    hover: '#e0f2fe',       // Azul bem clarinho para hover
  };

  // Função de Estilo Dinâmico
  const getStyle = (targetId) => {
    const isSelected = parteAtiva === targetId;
    return {
      fill: isSelected ? 'url(#gradSelected)' : 'url(#gradBody)', 
      stroke: isSelected ? '#0284c7' : colors.stroke,
      strokeWidth: isSelected ? '2' : '1',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
      filter: isSelected ? 'drop-shadow(0 0 8px rgba(14, 165, 233, 0.6))' : 'none',
      opacity: (parteAtiva && !isSelected) ? 0.6 : 1, 
      outline: 'none'
    };
  };

  // Lógica de Clique
  const handleClick = (e, targetId) => {
    e.stopPropagation();
    if (aoSelecionar) aoSelecionar(targetId);
  };

  // Componente de Parte Reutilizável
  // id = ID único para o DOM (evita conflitos no React)
  // dbId = ID lógico para o seu Banco de Dados (opcional, se não passar usa o id)
  const BodyPart = ({ id, dbId, d }) => {
    const finalId = dbId || id; // Usa o dbId se existir, senão usa o id normal
    
    return (
      <path
        id={id}
        data-part={finalId}
        d={d}
        onClick={(e) => handleClick(e, finalId)}
        style={getStyle(finalId)}
        onMouseEnter={(e) => {
          if (parteAtiva !== finalId) e.target.style.opacity = 0.8; 
        }}
        onMouseLeave={(e) => {
          if (parteAtiva !== finalId) e.target.style.opacity = (parteAtiva ? 0.6 : 1);
        }}
      />
    );
  };

  return (
    <svg 
      viewBox="0 0 400 800" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ 
        width: '100%', 
        height: '100%', 
        maxHeight: '750px',
        margin: '0 auto',
        display: 'block',
        filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))'
      }}
    >
      <defs>
        {/* GRADIENTE DE VOLUME (Corpo Normal) */}
        <linearGradient id="gradBody" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#cfd8dc" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cfd8dc" />
        </linearGradient>

        {/* GRADIENTE DE SELEÇÃO (Azul Brilhante) */}
        <linearGradient id="gradSelected" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {/* --- VISTA FRONTAL --- */}
      {vista === 'frente' && (
        <g transform="translate(10, 10)">
          {/* Cabeça */}
          <BodyPart id="cabeca" d="M190,40 C160,40 150,70 150,100 C150,140 170,155 190,155 C210,155 230,140 230,100 C230,70 220,40 190,40 Z" />
          <BodyPart id="pescoco" d="M175,150 Q190,160 205,150 L205,170 Q190,175 175,170 Z" />

          {/* Tronco */}
          <BodyPart id="peito" d="M155,170 Q190,180 225,170 L230,240 Q190,250 150,240 Z" />
          <BodyPart id="abdomen" d="M150,240 Q190,250 230,240 L225,310 Q190,320 155,310 Z" />
          <BodyPart id="pelvis" d="M155,310 Q190,320 225,310 L235,360 Q190,380 145,360 Z" />

          {/* Membros Superiores */}
          <BodyPart id="ombro-direito" d="M155,170 Q130,170 120,200 L145,210 L155,170 Z" />
          <BodyPart id="braco-direito" d="M120,200 L115,260 Q130,265 145,260 L145,210 Z" />
          <BodyPart id="mao-direita" d="M115,260 Q105,300 100,330 Q90,350 110,350 Q125,340 120,320 L130,265 Z" />

          <BodyPart id="ombro-esquerdo" d="M225,170 Q250,170 260,200 L235,210 L225,170 Z" />
          <BodyPart id="braco-esquerdo" d="M260,200 L265,260 Q250,265 235,260 L235,210 Z" />
          <BodyPart id="mao-esquerda" d="M265,260 Q275,300 280,330 Q290,350 270,350 Q255,340 260,320 L250,265 Z" />

          {/* Membros Inferiores */}
          {/* dbId garante que clicar na coxa ou na canela selecione a "perna" inteira no seu sistema */}
          <BodyPart id="perna-direita-coxa" dbId="perna-direita" d="M145,360 Q135,450 140,500 L175,500 Q180,450 185,370 Z" />
          <BodyPart id="perna-direita-canela" dbId="perna-direita" d="M140,500 L145,620 L170,620 L175,500 Z" />
          <BodyPart id="pe-direito" d="M145,620 L125,640 L160,640 L170,620 Z" />

          <BodyPart id="perna-esquerda-coxa" dbId="perna-esquerda" d="M235,360 Q245,450 240,500 L205,500 Q200,450 195,370 Z" />
          <BodyPart id="perna-esquerda-canela" dbId="perna-esquerda" d="M240,500 L235,620 L210,620 L205,500 Z" />
          <BodyPart id="pe-esquerdo" d="M235,620 L255,640 L220,640 L210,620 Z" />
        </g>
      )}

      {/* --- VISTA COSTAS --- */}
      {vista === 'costas' && (
        <g transform="translate(10, 10)">
          <BodyPart id="cabeca-costas" dbId="cabeca" d="M190,40 C160,40 150,70 150,100 C150,140 170,155 190,155 C210,155 230,140 230,100 C230,70 220,40 190,40 Z" />
          
          {/* Coluna */}
          <BodyPart id="coluna-cervical" d="M180,150 L200,150 L200,180 L180,180 Z" />
          <BodyPart id="coluna-toracica" d="M182,185 L198,185 L198,265 L182,265 Z" />
          <BodyPart id="coluna-lombar" d="M180,270 L200,270 L200,310 L180,310 Z" />

          {/* Omoplatas/Costas */}
          <BodyPart id="ombro-direito-costas" dbId="ombro-direito" d="M180,150 L145,160 L140,230 L182,230 Z" />
          <BodyPart id="ombro-esquerdo-costas" dbId="ombro-esquerdo" d="M200,150 L235,160 L240,230 L198,230 Z" />
          
          <BodyPart id="gluteos" d="M150,310 Q190,320 230,310 Q240,360 190,370 Q140,360 150,310 Z" />

          {/* Membros Costas */}
          <BodyPart id="braco-direito-costas" dbId="braco-direito" d="M140,230 L120,200 L115,260 Q130,265 145,260 L140,230 Z" />
          <BodyPart id="mao-direita-costas" dbId="mao-direita" d="M115,260 Q105,300 100,330 Q90,350 110,350 Q125,340 120,320 L130,265 Z" />
          
          <BodyPart id="braco-esquerdo-costas" dbId="braco-esquerdo" d="M240,230 L260,200 L265,260 Q250,265 235,260 L240,230 Z" />
          <BodyPart id="mao-esquerda-costas" dbId="mao-esquerda" d="M265,260 Q275,300 280,330 Q290,350 270,350 Q255,340 260,320 L250,265 Z" />

          <BodyPart id="perna-direita-coxa-costas" dbId="perna-direita" d="M150,360 Q135,450 145,500 L180,500 Q185,450 190,370 Z" />
          <BodyPart id="perna-direita-canela-costas" dbId="perna-direita" d="M145,500 L150,620 L175,620 L180,500 Z" />
          <BodyPart id="pe-direito-costas" dbId="pe-direito" d="M150,620 L130,640 L165,640 L175,620 Z" />

          <BodyPart id="perna-esquerda-coxa-costas" dbId="perna-esquerda" d="M230,360 Q245,450 235,500 L200,500 Q195,450 190,370 Z" />
          <BodyPart id="perna-esquerda-canela-costas" dbId="perna-esquerda" d="M235,500 L230,620 L205,620 L200,500 Z" />
          <BodyPart id="pe-esquerdo-costas" dbId="pe-esquerdo" d="M230,620 L250,640 L215,640 L205,620 Z" />
        </g>
      )}
    </svg>
  );
};

export default CorpoHumano;