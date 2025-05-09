export const controlPanel = {
    bgcolor: '#f5f5f5', 
    p: 1, 
    borderRadius: 1, 
    mb: 2
  };
  
  // Varianta pro DatabaseSettings s větším horizontálním paddingem
  export const controlPanelWide = {
    ...controlPanel,
    px: 3
  };
  
  // Flex kontejner pro PointEditor a PlaybackControls
  export const flexContainer = {
    display: 'flex', 
    gap: 1,
    mt: 0.5
  };
  
  // Varianta flex kontejneru pro PlaybackControls
  export const controlsFlexContainer = {
    display: 'flex', 
    alignItems: 'center'
  };
  
  // Styly pro disabled stav v SettingsPanel
  export const disableablePanel = (isRunning: boolean) => ({
    opacity: isRunning ? 0.6 : 1,
    pointerEvents: isRunning ? 'none' : 'auto',
    transition: 'opacity 0.3s ease'
  });
  
  // Alert v SettingsPanel
  export const settingsAlert = {
    mt: 2, 
    mb: 2
  };
  
  // Styly pro slider v PlaybackControls
  export const speedSlider = {
    width: 100, 
    m: 1, 
    mr: 2
  };
  
  // Styly pro button group v PlaybackControls
  export const controlButtonGroup = {
    mr: 2
  };