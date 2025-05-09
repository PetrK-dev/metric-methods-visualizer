import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, Box, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { AlgorithmTypeRegistry } from '../../../application/services/AlgorithmTypeRegistry';
import { BaseMethodContext } from '../../../application/contexts/BaseMethodContext';
import { AlgorithmType } from '../../../domain/core/enums/AlgorithmType';
import { controlPanel } from '../../../assets/styles/controls/controlsStyles';

/**
 * Props for the AlgorithmSelector component
 */
interface AlgorithmSelectorProps {
  /** Algorithm context providing access to the current algorithm and metric method */
  context: BaseMethodContext;
}

/**
 * Component for algorithm selection.
 * Allows users to select an algorithm type (INSERT, KNN, RANGE) from a dropdown menu.
 * The list of available algorithms is filtered based on the currently selected metric method.
 * 
 * @param {AlgorithmSelectorProps} props - Props containing the algorithm context
 * @returns {JSX.Element} React component
 */
export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({ context }) => {
  const { algorithm, setAlgorithm, availableAlgorithms} = context;

  // Get available algorithms for the current method from the registry
  const availableAlgsData = AlgorithmTypeRegistry.getAlgorithmsData(availableAlgorithms);

  /**
   * Handles changes to the selected algorithm.
   * 
   * @param {SelectChangeEvent} event - Change event from the dropdown menu
   */
  const handleAlgorithmChange = (event: SelectChangeEvent) => {
    setAlgorithm(event.target.value as AlgorithmType);
  };

  return (
    <>
        <Typography variant="subtitle1" gutterBottom>Výběr algoritmu</Typography>
          <Box sx={controlPanel}>
            <FormControl fullWidth>
            <InputLabel id="algorithm-select-label">Algoritmus</InputLabel>
            <Select
              labelId="algorithm-select-label"
              value={algorithm}
              onChange={handleAlgorithmChange}
              label="Vyberte algoritmus"
            >
            {availableAlgsData.map((metadata) => (
              <MenuItem key={metadata.type} value={metadata.type}>
                {metadata.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </>
  );
};