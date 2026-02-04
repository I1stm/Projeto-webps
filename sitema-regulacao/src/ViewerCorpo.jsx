import React, { useState } from 'react';
import CorpoHumano from './CorpoHumano'; // Importando o arquivo novo

export default function ViewerCorpo() {
  const [parte, setParte] = useState(null); // Qual parte foi clicada
  const [lado, setLado] = useState('frente'); // Controle da rotação

  return (
    <div className="painel-visualizacao">
      {/* Controles */}
      <div style={{ marginBottom: '10px', textAlign: 'center' }}>
        <button onClick={() => setLado('frente')} disabled={lado === 'frente'}>Frente</button>
        <button onClick={() => setLado('costas')} disabled={lado === 'costas'}>Costas</button>
      </div>

      {/* O Boneco Novo */}
      <CorpoHumano 
        vista={lado} 
        parteAtiva={parte} 
        aoSelecionar={(id) => {
            console.log("Parte clicada:", id);
            setParte(id);
        }} 
      />
      
      <p style={{textAlign: 'center', marginTop: '10px'}}>
        Selecionado: <strong>{parte || 'Nada'}</strong>
      </p>
    </div>
  )
}