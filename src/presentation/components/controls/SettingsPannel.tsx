import React from 'react';
import { Box, Alert } from '@mui/material';
import { AlgorithmParameters } from './AlgorithmParameters';
import { AlgorithmSelector } from './AlgorithmSelector';
import { BaseMethodContext } from '../../../application/contexts/BaseMethodContext';
import { PointEditor } from './PointEditor';
import { DatabaseSettings } from './DatabaseSettings';
import { disableablePanel, settingsAlert } from '../../../assets/styles/controls/controlsStyles';

/**
 * Props for the SettingsPanel component
 */
interface SettingPanelProps {
  /** Algorithm context providing access to methods and states */
  context: BaseMethodContext;
}

/**
 * Component containing all settings for the algorithms.
 * Integrates components for algorithm selection, database configuration,
 * query point editing, and algorithm-specific parameters.
 * 
 * When the algorithm is running, this component displays an information message
 * and disables settings changes until the algorithm is reset.
 * 
 * @param {SettingPanelProps} props - Props containing the algorithm context
 * @returns {JSX.Element} The settings panel component
 */
export const SettingsPanel: React.FC<SettingPanelProps> = ({ context }) => {
  const { isRunning } = context;
    
  return (
    <Box>      
      {/* Display information message when algorithm is running */}
      {isRunning && (
        <Alert severity="info" sx={settingsAlert}>
          Pro změnu nastavení je nutné restartovat algoritmus.
        </Alert>
      )}
      
      {/* Settings wrapped in a Box with conditional styling */}
      <Box 
        sx={disableablePanel(isRunning)}
      >
        <AlgorithmSelector context={context} />
        <DatabaseSettings context={context} />
        <PointEditor context={context} />
        <AlgorithmParameters context={context} />
      </Box>
    </Box>
  );
};