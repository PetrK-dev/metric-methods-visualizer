import React, { useEffect, useState, useRef } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { BaseMethodContext } from '../../../../application/contexts/BaseMethodContext';

/**
 * Props interface for the DistanceMatrixVisualizer component
 */
interface DistanceMatrixVisualizerProps {
  /** Algorithm context providing access to the current step and distance matrix */
  context: BaseMethodContext;
}

/**
 * Visualizer for the distance matrix used in AESA and LAESA methods.
 * 
 * This component displays an interactive table of all calculated distances
 * between points in metric space. The visualizer dynamically responds to changes
 * in the algorithm state and highlights actively calculated or used distances
 * during algorithm stepping.
 * 
 * Key features:
 * - Display of all calculated distances in a matrix format
 * - Dynamic highlighting of currently used distances in the algorithm
 * - Responsive design with automatic size and layout adjustment
 * - Optimizations for large matrices (sticky headers, scrolling)
 * - Value formatting for better readability
 * 
 * The matrix displays all points in the dataset including the query point,
 * allowing observation of the entire calculation process and development
 * of the metric data structure.
 * 
 * @param {DistanceMatrixVisualizerProps} props - Props containing the algorithm context
 * @returns {JSX.Element} Component visualizing the distance matrix
 */
export const DistanceMatrixVisualizer: React.FC<DistanceMatrixVisualizerProps> = ({ context }) => {
  // Get data from the current algorithm step
  const { displayStep } = context;
  const { dataStructure, database, distances } = displayStep;
  
  // Reference to container for optimal size calculation
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for dynamic font size and padding adjustment
  const [fontSize, setFontSize] = useState(0.65);
  const [cellPadding, setCellPadding] = useState(3);
  
  // Get the specific instance of DistanceMatrix
  const distanceMatrix = dataStructure.getStructure();

  // Get points from database including the query point
  const points = database.getDataWithQuery();
  
  // Get pivots for LAESA (or all objects for AESA)
  let pivots = database.getPivots();
  if(!pivots) {
    pivots = database.getObjects();
  }

  /**
   * Safely retrieves the distance between two points
   * Returns a value from the distance matrix if available, otherwise null
   * 
   * @param {number} pointId1 - ID of the first point
   * @param {number} pointId2 - ID of the second point
   * @returns {number|null} Distance between points or null if not available
   */
  const getDistance = (pointId1: number, pointId2: number): number | null => {
    try {
      const distance = distanceMatrix.getDistance(pointId1, pointId2);
      return distance >= 0 ? distance : null;
    } catch (error) {
      console.warn(`Error getting distance between points ${pointId1} and ${pointId2}:`, error);
      return null;
    }
  };

  /**
   * Formats distance value for display in a table cell
   * 
   * @param {number|null|undefined} value - Distance value
   * @returns {string} Formatted value for display
   */
  const formatCell = (value: number | null | undefined) => {
    if (value === null || value === undefined || value < 0) return "—"; // Distance is not available
    return value.toFixed(1);  // Round to 1 decimal place
  };

  /**
   * Determines if a cell should be highlighted based on the current algorithm step
   * 
   * @param {number} i - ID of the first point
   * @param {number} j - ID of the second point
   * @returns {boolean} True if the cell should be highlighted
   */
  const isHighlighted = (i: number, j: number) => {
    // Check if any distance in the current step corresponds to this cell
    return distances.some(
      dist => (dist.from.id === i && dist.to.id === j) || (dist.from.id === j && dist.to.id === i)
    );
  };

  /**
   * Effect for dynamic adjustment of font size and cell padding
   * based on the number of points and container size
   */
  useEffect(() => {
    // Function to calculate optimal size
    const adjustSize = () => {
      if (!containerRef.current) return;
      
      const pointCount = points.length;
      
      // Calculate optimal font size and padding
      const baseFontSize = Math.min(
        0.7,  // Maximum size
        Math.max(0.4, 8 / pointCount)  // Size decreases with point count
      );
      
      const baseCellPadding = Math.min(
        4,  // Maximum padding
        Math.max(1, 20 / pointCount)  // Padding decreases with point count
      );
      
      setFontSize(baseFontSize);
      setCellPadding(baseCellPadding);
    };
    
    // Initialize size on load
    adjustSize();
    
    // Adjust on window resize
    window.addEventListener('resize', adjustSize);
    return () => window.removeEventListener('resize', adjustSize);
  }, [points.length]);

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    > 
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',  // Auto overflow enables scrolling only when needed
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}>
        <TableContainer 
          component={Paper} 
          sx={{ 
            maxHeight: '100%',
            maxWidth: '100%',
            overflow: 'auto',
            border: '1px solid #e0e0e0',
            boxShadow: 'none'
          }}
        >
          <Table 
            size="small" 
            sx={{
              tableLayout: 'fixed', // Fixed table layout helps with performance
              '& .MuiTableCell-root': {
                padding: `${cellPadding}px ${cellPadding * 1.5}px`,
                fontSize: `${fontSize}rem`,
                lineHeight: 1.1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              },
              '& .MuiTableCell-head, & .MuiTableCell-stickyHeader': {
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                position: 'sticky',
                top: 0,
                zIndex: 2
              }
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell 
                  align="center"
                  sx={{ 
                    fontWeight: 'bold',
                    backgroundColor: '#f0f0f0', 
                    position: 'sticky', 
                    left: 0,
                    zIndex: 3 // Higher than other sticky elements
                  }}
                >
                  ID
                </TableCell>
                {points.map((point) => (
                  <TableCell key={`header-${point.id}`} align="center">
                    {point.label}{point.label !== 'Q' ? point.id : ''}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {points.map((point) => (
                <TableRow key={`row-${point.id}`}>
                  <TableCell 
                    component="th" 
                    scope="row" 
                    align="center"
                    sx={{ 
                      fontWeight: 'bold',
                      backgroundColor: '#f5f5f5',
                      position: 'sticky',
                      left: 0,
                      zIndex: 1
                    }}
                  >
                    {point.label}{point.label !== 'Q' ? point.id : ''}
                  </TableCell>
                  {points.map((colPoint) => (
                    <TableCell 
                      key={`cell-${point.id}-${colPoint.id}`} 
                      align="center"
                      sx={{
                        backgroundColor: isHighlighted(point.id, colPoint.id) 
                          ? 'rgba(33, 150, 243, 0.3)' 
                          : point.id === colPoint.id 
                            ? 'rgba(0, 0, 0, 0.04)' 
                            : 'inherit',
                        fontWeight: isHighlighted(point.id, colPoint.id) ? 'bold' : 'normal',
                      }}
                    >
                      {point.id === colPoint.id 
                        ? "0" 
                        : formatCell(getDistance(point.id, colPoint.id))}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};