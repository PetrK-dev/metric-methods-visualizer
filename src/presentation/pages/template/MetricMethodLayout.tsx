import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Divider, IconButton, useMediaQuery, useTheme, Grid, Tabs, Tab, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CodeIcon from '@mui/icons-material/Code';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import Header from '../../../common/Header';
import { BaseMethodContext } from '../../../application/contexts/BaseMethodContext';
import { PlaybackControls } from '../../components/controls/PlaybackControls';
import { SettingsPanel } from '../../components/controls/SettingsPannel';
import { PseudoCodeComponent } from '../../components/pseudocode/PseudoCodeComponent';
import { Visualization } from '../../components/visualisation/Visualization';
import { DataStructureVisualization } from '../../components/visualisation/visualizers/DataStructureVisualisation';
import { algorithmPlayback } from '../../../application/services/AlgorithmPlayback';

/**
 * Props for the MetricMethodLayout component
 */
interface MetricMethodLayoutProps {
  /** Algorithm context providing access to the current algorithm state */
  context: BaseMethodContext;
  /** Page title displayed in the header */
  pageTitle: string;
}

/**
 * Main layout component for metric method pages (AESA, LAESA, M-Tree).
 * 
 * This component implements a responsive page layout for visualizing
 * metric methods that adapts to different screen sizes:
 * - On mobile devices, it displays individual panels as tabs
 * - On desktop devices, it uses a multi-column layout with collapsible panels
 * 
 * The component contains these main elements:
 * - Settings panel (algorithm configuration)
 * - 2D visualization of the method and points
 * - Data structure visualization (distance matrix or tree)
 * - Pseudocode panel with current step visualization
 * - Controls for running/pausing/stepping through the algorithm
 * 
 * The layout provides a consistent interface across different metric methods
 * while allowing for responsive design and user customization of the view.
 * 
 * @param {MetricMethodLayoutProps} props - Props containing the algorithm context and page title
 * @returns {JSX.Element} Responsive layout for metric method pages
 */
const MetricMethodLayout: React.FC<MetricMethodLayoutProps> = ({ context, pageTitle }) => {
  // Use themes and responsive breakpoints from Material-UI
  const theme = useTheme();
  const {isRunning} = context;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  /**
   * State variables for controlling panel visibility
   */
  // Settings panel (enabled by default)
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(true);
  // Pseudocode panel (enabled by default)
  const [pseudoCodePanelOpen, setPseudoCodePanelOpen] = useState(true);
  
  /**
   * State variables for mobile view
   */
  // Active tab in mobile view (0 = settings, 1 = visualization, 2 = pseudocode)
  const [activeTab, setActiveTab] = useState(0);
  
  /**
   * Handles tab change in mobile view
   * 
   * @param {any} event - Tab change event
   * @param {React.SetStateAction<number>} newValue - Index of the newly selected tab
   */
  const handleTabChange = (event: any, newValue: React.SetStateAction<number>) => {
    setActiveTab(newValue);
  };


  useEffect(() => {
    // Cleanup function that is called when the component unmounts
    return () => {
      // Reset algorithm when component unmounts
      if (context) {
        context.onReset();
        algorithmPlayback.reset();
      }
    };
  }, []);

  /**
   * Effect for automatically closing the settings panel when algorithm starts running
   */
  useEffect(() => {
    setSettingsPanelOpen(!isRunning);
  }, [isRunning]);
  
  /**
   * Mobile view - tabbed interface
   */
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Header with page title */}
        <Header pageTitle={pageTitle} />

        {/* Tabs for switching between panels */}
        <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            indicatorColor="secondary"
            textColor="inherit"
          >
            <Tab label="Nastavení" />
            <Tab label="Vizualizace" />
            <Tab label="Pseudokód" />
          </Tabs>
        
        {/* Algorithm control panel (always visible) */}
        <Paper sx={{ p: 1, m: 1 }}>
          <PlaybackControls context={context} />
        </Paper>
        
        {/* Content based on active tab */}
        <Box sx={{ flex: 1, p: 1, overflow: 'auto' }}>
          {/* Settings tab */}
          {activeTab === 0 && (
            <Paper sx={{ p: 2, height: '100%' }}>
              <SettingsPanel context={context} />
            </Paper>
          )}
          
          {/* Visualization tab */}
          {activeTab === 1 && (
            <Grid container spacing={2} sx={{ height: '100%' }}>
              {/* 2D visualization */}
              <Grid item xs={12} sx={{ height: '50%' }}>
                <Paper sx={{ p: 1, height: '100%' }}>
                  <Typography variant="subtitle1">2D Vizualizace</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ height: 'calc(100% - 40px)' }}>
                    <Visualization context={context} />
                  </Box>
                </Paper>
              </Grid>
              {/* Data structure visualization */}
              <Grid item xs={12} sx={{ height: '50%' }}>
                <Paper sx={{ p: 1, height: '100%' }}>
                  <Typography variant="subtitle1">Datová struktura</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ height: 'calc(100% - 40px)' }}>
                    <DataStructureVisualization context={context} />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
          
          {/* Pseudocode tab */}
          {activeTab === 2 && (
            <Paper sx={{ p: 2, height: '100%' }}>
              <PseudoCodeComponent context={context} />
            </Paper>
          )}
        </Box>
      </Box>
    );
  }
  
  /**
   * Desktop view - multi-column layout
   */
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header with page title */}
      <Header pageTitle={pageTitle} />
      
      {/* Control panel with algorithm buttons and panel toggles */}
      <Paper sx={{ p: 1, m: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Algorithm controls */}
        <Box>
          <PlaybackControls context={context} />
        </Box>
        
        {/* Buttons for toggling panel visibility */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Settings panel toggle button */}
          <IconButton 
            color={settingsPanelOpen ? "primary" : "default"}
            onClick={() => setSettingsPanelOpen(!settingsPanelOpen)}
            sx={{ 
              bgcolor: settingsPanelOpen ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
              '&:hover': {
                bgcolor: settingsPanelOpen ? 'rgba(25, 118, 210, 0.2)' : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <SettingsIcon />
          </IconButton>
          
          {/* Pseudocode panel toggle button */}
          <IconButton 
            color={pseudoCodePanelOpen ? "primary" : "default"}
            onClick={() => setPseudoCodePanelOpen(!pseudoCodePanelOpen)}
            sx={{ 
              bgcolor: pseudoCodePanelOpen ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
              '&:hover': {
                bgcolor: pseudoCodePanelOpen ? 'rgba(25, 118, 210, 0.2)' : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <CodeIcon />
          </IconButton>
        </Box>
      </Paper>
      
      {/* Main content - flexible panel layout */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Settings panel (optionally displayed) */}
        {settingsPanelOpen && (
          <Paper 
            sx={{ 
              maxWidth: '20%', 
              m: 1, 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Settings panel header */}
            <Box sx={{ 
              p: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              bgcolor: theme.palette.primary.main,
              color: 'white'
            }}>
              <Typography variant="subtitle1">Nastavení</Typography>
              <IconButton 
                size="small"
                onClick={() => setSettingsPanelOpen(false)}
                sx={{ color: 'white' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Divider />
            {/* Settings panel content */}
            <Box sx={{ flex: 1, p: 1, overflow: 'auto' }}>
              <SettingsPanel context={context} />
            </Box>
          </Paper>
        )}
        
        {/* Visualization panels (middle section) */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: isLargeScreen ? 'row' : 'column',
          gap: 1,
          m: 1,
          overflow: 'hidden'
        }}>
          {/* 2D visualization panel */}
          <Paper sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: isLargeScreen ? '100%' : '45%'
          }}>
            {/* 2D visualization header */}
            <Box sx={{ 
              p: 1, 
              bgcolor: theme.palette.primary.main,
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="subtitle1">2D Vizualizace</Typography>
            </Box>
            {/* 2D visualization content */}
            <Box sx={{ flex: 1, p: 1, overflow: 'hidden' }}>
              <Visualization context={context} />
              <Tooltip title="Modrý bod (Q): Dotazovací bod, Fialový bod (P): Pivot, atd...">
                <IconButton size="small" sx={{ color: 'white' }}>
                 <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
          
          {/* Data structure visualization panel */}
          <Paper sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: isLargeScreen ? '100%' : '45%'
          }}>
            {/* Data structure visualization header */}
            <Box sx={{ 
              p: 1, 
              bgcolor: theme.palette.primary.main,
              color: 'white'
            }}>
              <Typography variant="subtitle1">Datová struktura</Typography>
            </Box>
            {/* Data structure visualization content */}
            <Box sx={{ flex: 1, p: 1, overflow: 'hidden' }}>
              <DataStructureVisualization context={context} />
            </Box>
          </Paper>
        </Box>
        
        {/* Pseudocode panel (optionally displayed) */}
        {pseudoCodePanelOpen && (
          <Paper 
            sx={{ 
              maxWidth: '30%', 
              m: 1, 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Pseudocode panel header */}
            <Box sx={{ 
              p: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              bgcolor: theme.palette.secondary.main,
              color: 'white'
            }}>
              <IconButton 
                size="small"
                onClick={() => setPseudoCodePanelOpen(false)}
                sx={{ color: 'white' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              <Typography variant="subtitle1">Pseudokód</Typography>
            </Box>
            <Divider />
            {/* Pseudocode panel content */}
            <Box sx={{ flex: 1, p: 1, overflow: 'hidden' }}>
              <PseudoCodeComponent context={context} />
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default MetricMethodLayout;