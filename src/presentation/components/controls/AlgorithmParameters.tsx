import React from 'react';
import { KnnParams } from './parameters/KnnParams';
import { RangeParams } from './parameters/RangeParams';
import { DynamicInsertParams } from './parameters/DynamicInsertParams';
import { BaseMethodContext } from '../../../application/contexts/BaseMethodContext';
import { Typography, Box } from '@mui/material';
import { AlgorithmType } from '../../../domain/core/enums/AlgorithmType';
import { controlPanel } from '../../../assets/styles/controls/controlsStyles';

/**
 * Props for the AlgorithmParameters component
 */
interface AlgorithmParametersProps {
  /** Algorithm context providing access to the currently selected algorithm */
  context: BaseMethodContext;
}

/**
 * Component for displaying parameters specific to the selected algorithm.
 * Dynamically switches between parameter components based on the algorithm type.
 * 
 * Supports three algorithm types:
 * - INSERT (dynamic insertion) - no parameters
 * - KNN (k-nearest neighbors) - k parameter
 * - RANGE (range query) - radius parameter
 * 
 * @param {AlgorithmParametersProps} props - Props containing the algorithm context
 * @returns {JSX.Element} React component
 */
export const AlgorithmParameters: React.FC<AlgorithmParametersProps> = ({ context }) => {
  const { algorithm } = context;
  
  return (
    <>
      <Typography variant="subtitle1" gutterBottom>Parametry algoritmu</Typography>
      <Box sx={controlPanel}>
        {algorithm === AlgorithmType.INSERT && <DynamicInsertParams/>}
        {algorithm === AlgorithmType.KNN && <KnnParams context={context} />}
        {algorithm === AlgorithmType.RANGE && <RangeParams context={context} />}
      </Box>
    </>
  );
};