import React from 'react';

const CorpoHumano = ({ aoSelecionar, parteAtiva, vista = 'frente' }) => {
  
  // Estilo base para todas as partes do corpo
  const pathStyle = (idParte) => ({
    fill: parteAtiva === idParte ? 'var(--destaque)' : 'transparent', 
    stroke: parteAtiva === idParte ? 'var(--destaque)' : 'var(--texto-primario)',
    strokeWidth: '1.5',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    opacity: parteAtiva && parteAtiva !== idParte ? 0.4 : 1, 
    // Suaviza as bordas do SVG
    strokeLinejoin: 'round',
    strokeLinecap: 'round'
  });

  const handleMouseEnter = (e) => {
    // Apenas ilumina se não estiver selecionado
    if (parteAtiva !== e.target.getAttribute('data-id-banco')) {
      e.target.style.fill = 'rgba(var(--destaque-rgb), 0.2)';
    }
  };

  const handleMouseLeave = (e) => {
    // Volta ao normal (transparente ou cor de seleção)
    const idBanco = e.target.getAttribute('data-id-banco');
    if (parteAtiva !== idBanco) {
      e.target.style.fill = 'transparent';
    } else {
      e.target.style.fill = 'var(--destaque)';
    }
  };

  // Helper para criar paths mais limpos
  const Part = ({ d, idBanco, idVisual }) => (
    <path 
      id={idVisual}
      data-id-banco={idBanco} // Usamos isso para saber qual ID enviar
      d={d}
      onClick={() => aoSelecionar(idBanco)}
      style={pathStyle(idBanco)}
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    />
  );

  const pathsFrente = (
    <g>
      {/* CABEÇA */}
      <Part idBanco="cabeca" idVisual="head" d="M100,25 Q118,25 122,45 Q125,65 115,78 Q100,88 85,78 Q75,65 78,45 Q82,25 100,25 Z" />
      
      {/* PESCOÇO */}
      <Part idBanco="pescoco" idVisual="neck" d="M85,78 Q100,85 115,78 L115,88 Q100,95 85,88 Z" />

      {/* PEITO (TORAX) */}
      <Part idBanco="peito" idVisual="chest" d="M85,88 Q100,95 115,88 L135,100 L125,145 Q100,150 75,145 L65,100 Z" />

      {/* ABDÔMEN */}
      <Part idBanco="abdomen" idVisual="abs" d="M75,145 Q100,150 125,145 L120,180 Q100,190 80,180 Z" />

      {/* PELVIS */}
      <Part idBanco="pelvis" idVisual="pelvis" d="M80,180 Q100,190 120,180 L115,200 Q100,215 85,200 Z" />

      {/* --- LADO DIREITO DO PACIENTE (Esquerda da Tela) --- */}
      
      {/* OMBRO DIREITO */}
      <Part idBanco="ombro-direito" idVisual="r_shoulder" d="M65,100 L45,110 L50,135 L68,125 Z" />
      
      {/* BRAÇO DIREITO */}
      <Part idBanco="braco-direito" idVisual="r_arm" d="M45,110 L30,155 L45,160 L50,135 Z" />
      
      {/* MÃO DIREITA (Simplificada com punho) */}
      <Part idBanco="mao-direita" idVisual="r_hand" d="M30,155 L20,195 L35,200 L45,160 Z" />

      {/* PERNA DIREITA (Dividida visualmente em Coxa e Perna, mas mesmo ID) */}
      {/* Coxa */}
      <Part idBanco="perna-direita" idVisual="r_thigh" d="M85,200 Q90,210 95,215 L90,270 Q80,275 70,270 L65,210 Z" />
      {/* Canela */}
      <Part idBanco="perna-direita" idVisual="r_shin" d="M70,270 Q80,275 90,270 L85,330 L65,330 Z" />
      
      {/* PÉ DIREITO */}
      <Part idBanco="pe-direito" idVisual="r_foot" d="M65,330 L55,350 L85,350 L85,330 Z" />


      {/* --- LADO ESQUERDO DO PACIENTE (Direita da Tela) --- */}

      {/* OMBRO ESQUERDO */}
      <Part idBanco="ombro-esquerdo" idVisual="l_shoulder" d="M135,100 L155,110 L150,135 L132,125 Z" />

      {/* BRAÇO ESQUERDO */}
      <Part idBanco="braco-esquerdo" idVisual="l_arm" d="M155,110 L170,155 L155,160 L150,135 Z" />

      {/* MÃO ESQUERDA */}
      <Part idBanco="mao-esquerda" idVisual="l_hand" d="M170,155 L180,195 L165,200 L155,160 Z" />

      {/* PERNA ESQUERDA (Coxa + Canela) */}
      <Part idBanco="perna-esquerda" idVisual="l_thigh" d="M115,200 Q110,210 105,215 L110,270 Q120,275 130,270 L135,210 Z" />
      <Part idBanco="perna-esquerda" idVisual="l_shin" d="M130,270 Q120,275 110,270 L115,330 L135,330 Z" />

      {/* PÉ ESQUERDO */}
      <Part idBanco="pe-esquerdo" idVisual="l_foot" d="M135,330 L145,350 L115,350 L115,330 Z" />

    </g>
  );

  const pathsCostas = (
    <g>
      {/* CABEÇA (Nuca) - Mantemos cabeça ou Nuca? SQL tem Nuca. Vamos usar Cabeça que é mais amplo visualmente */}
      <Part idBanco="cabeca" idVisual="head_back" d="M100,25 Q118,25 122,45 Q125,65 115,78 Q100,88 85,78 Q75,65 78,45 Q82,25 100,25 Z" />
      
      {/* COLUNA CERVICAL (Pescoço e Nuca) */}
      <Part idBanco="coluna-cervical" idVisual="cervical" d="M85,78 Q100,85 115,78 L115,95 Q100,100 85,95 Z" />

      {/* COLUNA TORÁCICA (Meio das costas) */}
      <Part idBanco="coluna-toracica" idVisual="toracica" d="M85,95 Q100,100 115,95 L120,145 Q100,150 80,145 Z" />

      {/* COLUNA LOMBAR (Fundo das costas) */}
      <Part idBanco="coluna-lombar" idVisual="lombar" d="M80,145 Q100,150 120,145 L115,180 Q100,190 85,180 Z" />

      {/* GLÚTEOS */}
      <Part idBanco="gluteos" idVisual="gluteos" d="M85,180 Q100,190 115,180 L115,210 Q100,225 85,210 Z" />

      {/* MEMBROS POSTERIORES (IDênticos aos da frente, mas visualmente espelhados se precisasse, aqui simplificado) */}
      
      {/* Lado Direito Paciente (Esq Tela) */}
      <Part idBanco="ombro-direito" idVisual="r_sh_back" d="M65,100 L45,110 L50,135 L68,125 Z" />
      <Part idBanco="braco-direito" idVisual="r_arm_back" d="M45,110 L30,155 L45,160 L50,135 Z" />
      <Part idBanco="mao-direita" idVisual="r_hand_back" d="M30,155 L20,195 L35,200 L45,160 Z" />
      <Part idBanco="perna-direita" idVisual="r_leg_back" d="M85,210 Q90,220 95,225 L90,280 Q80,285 70,280 L65,220 Z" /> 
      <Part idBanco="perna-direita" idVisual="r_shin_back" d="M70,280 Q80,285 90,280 L85,340 L65,340 Z" />
      <Part idBanco="pe-direito" idVisual="r_foot_back" d="M65,340 L55,360 L85,360 L85,340 Z" />

      {/* Lado Esquerdo Paciente (Dir Tela) */}
      <Part idBanco="ombro-esquerdo" idVisual="l_sh_back" d="M135,100 L155,110 L150,135 L132,125 Z" />
      <Part idBanco="braco-esquerdo" idVisual="l_arm_back" d="M155,110 L170,155 L155,160 L150,135 Z" />
      <Part idBanco="mao-esquerda" idVisual="l_hand_back" d="M170,155 L180,195 L165,200 L155,160 Z" />
      <Part idBanco="perna-esquerda" idVisual="l_leg_back" d="M115,210 Q110,220 105,225 L110,280 Q120,285 130,280 L135,220 Z" />
      <Part idBanco="perna-esquerda" idVisual="l_shin_back" d="M130,280 Q120,285 110,280 L115,340 L135,340 Z" />
      <Part idBanco="pe-esquerdo" idVisual="l_foot_back" d="M135,340 L145,360 L115,360 L115,340 Z" />

    </g>
  );

  return (
    <svg 
      viewBox="0 0 200 380" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ width: '100%', height: '100%', maxHeight: '650px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}
    >
      <defs>
        {/* Gradiente para dar volume (efeito 3D sutil) */}
        <linearGradient id="gradBody" x1="0%" y1="0%" x2="100%" y2="0%">
           <stop offset="0%" style={{stopColor:'var(--texto-primario)', stopOpacity:0.05}} />
           <stop offset="50%" style={{stopColor:'var(--texto-primario)', stopOpacity:0}} />
           <stop offset="100%" style={{stopColor:'var(--texto-primario)', stopOpacity:0.05}} />
        </linearGradient>
      </defs>

      {vista === 'frente' ? pathsFrente : pathsCostas}
      
    </svg>
  );
};

export default CorpoHumano;