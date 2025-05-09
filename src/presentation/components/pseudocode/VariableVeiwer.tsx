import React from 'react';
import { Box, Typography, Divider, Paper } from '@mui/material';
import { BaseMethodContext } from '../../../application/contexts/BaseMethodContext';
import { AlgorithmType } from '../../../domain/core/enums/AlgorithmType';
import { codeViewerContainer, sectionTitle, sectionDivider, contentContainer, labelCellStyle, tableRowStyle, valueCellStyle, variablesTableStyle } from '../../../assets/styles/code/codeAndData';

/**
 * Props interface for the VariablesViewer component
 */
interface VariablesViewerProps {
  /** Algorithm context providing access to the current algorithm state */
  context: BaseMethodContext;
}

/**
 * Component for displaying current variable values during algorithm execution.
 * 
 * VariablesViewer displays a clear table with all important variables and their
 * current values during algorithm stepping. Displayed variables include:
 * - Basic information about the algorithm (algorithm type, query point)
 * - Parameters specific to the algorithm type (k for kNN, radius for range query)
 * - Current algorithm state (step number, active points, eliminated points, results)
 * 
 * The component dynamically adjusts the displayed variables according to the algorithm type
 * and current stepping state.
 * 
 * @param {VariablesViewerProps} props - Props containing the algorithm context
 * @returns {JSX.Element} React component
 */
export const VariablesViewer: React.FC<VariablesViewerProps> = ({ context }) => {
  // Get necessary values from context
  const { algorithm, queryPoint, displayStep } = context;
  
  /**
   * Formats a point into a readable string for display
   * 
   * @param {Point} point - Point to format
   * @returns {string} Formatted string representing the point
   */
  const formatPoint = (point: any) => {
    if (!point) return "undefined";
    return `${point.label}${point.label !== 'Q' ? point.id : ""} (${point.x.toFixed(1)}, ${point.y.toFixed(1)})`;
  };

  /**
   * Create structured data for display in the table
   * Different variables are dynamically added based on algorithm type
   */
  const variables = [
    { label: "Algoritmus", value: algorithm },
    { label: "Dotaz (q)", value: formatPoint(queryPoint) },
    // Conditional addition of variables specific to kNN
    ...(algorithm === AlgorithmType.KNN ? [
      { label: "Počet sousedů (k)", value: context.kValue }
    ] : []),
    // Conditional addition of variables specific to range query
    ...(algorithm === AlgorithmType.RANGE ? [
      { label: "Poloměr dotazu", value: context.rangeRadius.toFixed(1) }
    ] : []),
    // Addition of variables related to the current algorithm step
    ...(displayStep ? [
      { label: "Krok algoritmu", value: displayStep.stepNumber },
      // Other variables specific to the current step...
    ] : [])
  ];

  return (
    <Box sx={codeViewerContainer}>
      <Typography variant="subtitle1" sx={sectionTitle}>
        Proměnné
      </Typography>
      <Divider sx={sectionDivider} />
      
      <Box sx={contentContainer}>
        <table style={variablesTableStyle}>
          <tbody>
            {variables.map((variable, index) => (
              <tr key={index} style={tableRowStyle(index % 2 === 0)}>
                <td style={labelCellStyle}>
                  {variable.label}:
                </td>
                <td style={valueCellStyle}>
                  {variable.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};