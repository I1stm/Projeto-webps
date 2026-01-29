import React from 'react';

const Layout = ({ children }) => {
  return (
    <div style={styles.containerPrincipal}>
      {/* --- CABEÇALHO (NAVBAR) --- */}
      <header style={styles.cabecalho}>
        <div style={styles.logoArea}>
          <span style={styles.iconeMedico}>✚</span>
          <h1 style={styles.tituloSistema}>SisReg Saúde</h1>
        </div>
        <div style={styles.usuario}>
          <span>Olá, Regulador</span>
          <div style={styles.avatar}>R</div>
        </div>
      </header>

      {/* --- CONTEÚDO (AQUI ENTRA O BONECO E O PAINEL) --- */}
      <main style={styles.conteudo}>
        <div style={styles.cardBranco}>
          {children} 
        </div>
      </main>

      {/* --- RODAPÉ --- */}
      <footer style={styles.rodape}>
        <p>Sistema de Apoio à Regulação - Versão 1.0 Alpha</p>
      </footer>
    </div>
  );
};

// Estilos CSS dentro do JavaScript (CSS-in-JS)
const styles = {
  containerPrincipal: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f0f2f5', // Fundo cinza claro padrão de sistemas
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  cabecalho: {
    backgroundColor: '#0277bd', // Azul "Hospital"
    color: 'white',
    padding: '0 20px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  iconeMedico: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  tituloSistema: {
    fontSize: '18px',
    margin: 0,
    fontWeight: 500
  },
  usuario: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px'
  },
  avatar: {
    width: '32px',
    height: '32px',
    backgroundColor: 'white',
    color: '#0277bd',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  conteudo: {
    flex: 1, // Ocupa todo o espaço sobrando
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  cardBranco: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: '1200px', // Limita a largura para não ficar esticado em monitores gigantes
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden', // Garante que nada saia do card
    display: 'flex', // Para o layout interno funcionar
    flexDirection: 'row' // Garante lado a lado
  },
  rodape: {
    textAlign: 'center',
    padding: '10px',
    fontSize: '12px',
    color: '#666',
    borderTop: '1px solid #ddd'
  }
};

export default Layout;