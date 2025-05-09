// Základní kontejner pro všechny komponenty zobrazující kód a data
export const codeViewerContainer = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%'
  };
  
  // Nadpisy sekcí
  export const sectionTitle = {
    mb: 1
  };
  
  // Oddělovač pod nadpisem
  export const sectionDivider = {
    borderColor: '#555',
    mb: 1
  };
  
  // Kontejner pro obsah s přetékáním
  export const contentContainer = {
    flex: 1,
    overflow: 'auto',
    backgroundColor: '#f8f8f8',
    borderRadius: '4px',
    p: 1
  };
  
  // Specifické styly pro PseudoCode
  
  // Box pro kód bez paddingu
  export const codeContainer = {
    ...contentContainer,
    p: 0, // Bez paddingu pro kód, budou mít padding jednotlivé řádky
    '& .keyword': {
      color: '#ff6666',
      fontWeight: 'bold'
    }
  };
  
  // Styly pro prvek <pre>
  export const preElement = {
    margin: 0,
    fontFamily: 'monospace',
    fontSize: '0.9rem',
    lineHeight: 1.2
  };
  
  // Styly pro řádek kódu
  export const codeLine = (isActive: boolean | null | undefined) => ({
    backgroundColor: isActive === true ? 'rgba(144, 202, 249, 0.3)' : 'transparent',
    padding: '1px 8px',
    borderRadius: '4px'
  });
  
  // Specifické styly pro VariableViewer
  
  // Styly pro tabulku
  export const variablesTable = {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    lineHeight: 1.3
  };
  
  // Styly pro řádek tabulky
  export const tableRow = (isEven: boolean) => ({
    backgroundColor: isEven ? 'rgba(0,0,0,0.02)' : 'transparent',
    borderBottom: '1px solid rgba(0,0,0,0.05)'
  });
  
  // Styly pro buňku s názvem proměnné
  export const labelCell = {
    padding: '6px 8px',
    fontWeight: 'bold',
    color: '#555',
    verticalAlign: 'top',
    width: '35%'
  };
  
  // Styly pro buňku s hodnotou proměnné
  export const valueCell = {
    padding: '6px 8px',
    wordBreak: 'break-word', // Dlouhý text se zalomí
    color: '#333'
  };

  // Styly pro HTML tabulkové elementy
export const variablesTableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'monospace',
  fontSize: '0.85rem',
  lineHeight: 1.3
};

export const tableRowStyle = (isEven: boolean): React.CSSProperties => ({
  backgroundColor: isEven ? 'rgba(0,0,0,0.02)' : 'transparent',
  borderBottom: '1px solid rgba(0,0,0,0.05)'
});

export const labelCellStyle: React.CSSProperties = {
  padding: '6px 8px',
  fontWeight: 'bold',
  color: '#555',
  verticalAlign: 'top',
  width: '35%'
};

export const valueCellStyle: React.CSSProperties = {
  padding: '6px 8px',
  wordBreak: 'break-word',
  color: '#333'
};

export const SVG_STYLES = {
  container: {
    height: '100%', 
    overflow: 'hidden'
  },
  svg: {
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'UI.BORDER.LIGHT', // Odkaz na hodnotu z COLORS, který se rozhodne při použití
    preserveAspectRatio: 'xMidYMid meet',
  }
};