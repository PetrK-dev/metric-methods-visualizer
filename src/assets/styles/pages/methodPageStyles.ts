// ========== STYLES ==========
// Hlavní kontejner stránky
export const pageLayout = {
    display: 'flex', 
    flexDirection: 'column', 
    height: '100vh'
  };
  
  // Ovládací panel s tlačítky
  export const controlPanel = {
    p: 1, 
    m: 1, 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  };
  
  // Boční panel (nastavení, pseudokód)
  export const sidePanel = {
    maxWidth: '25%', 
    m: 1, 
    display: 'flex', 
    flexDirection: 'column',
    overflow: 'hidden'
  };
  
  // Obsah bočního panelu
  export const panelContent = {
    flex: 1, 
    p: 1, 
    overflow: 'auto'
  };
  
  // Vizualizace - hlavní kontejner
  export const visualizationContainer = (isLargeScreen: boolean) => ({
    flex: 1, 
    display: 'flex', 
    flexDirection: isLargeScreen ? 'row' : 'column',
    gap: 1,
    m: 1,
    overflow: 'hidden'
  });
  
  // Panel vizualizace
  export const visualizationPanel = (isLargeScreen: boolean) => ({
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column',
    overflow: 'hidden',
    minHeight: isLargeScreen ? '100%' : '45%'
  });
  
  // Hlavička vizualizačního panelu
  export const visualizationHeader = {
    p: 1, 
    bgcolor: 'primary.main',
    color: 'white'
  };
  
  // Obsah vizualizačního panelu
  export const visualizationContent = {
    flex: 1, 
    p: 1, 
    overflow: 'hidden'
  };
  
  // Styl pro tlačítka přepínání panelů
  export const toggleButtonStyle = (isActive: boolean) => ({
    bgcolor: isActive ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
    '&:hover': {
      bgcolor: isActive ? 'rgba(25, 118, 210, 0.2)' : 'rgba(0, 0, 0, 0.04)'
    }
  });
  
  // Styl pro hlavičku panelu
  export const panelHeaderStyle = (color: any) => ({
    p: 1, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    bgcolor: color,
    color: 'white'
  });
  
  // Mobilní styly
  export const mobileContainer = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
  };
  
  export const mobileControlPanel = {
    p: 1, 
    m: 1
  };
  
  export const mobileContentContainer = {
    flex: 1,
    p: 1,
    overflow: 'auto'
  };
  
  export const mobileTabPanel = {
    p: 2,
    height: '100%'
  };
  
  export const mobileVisualizationGrid = {
    height: '100%'
  };
  
  export const mobileVisualizationItem = {
    height: '50%'
  };