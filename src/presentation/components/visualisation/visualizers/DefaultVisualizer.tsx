import { Box, Typography } from "@mui/material";
import { BaseMethodContext } from "../../../../application/contexts/BaseMethodContext";

/**
 * Default visualizer for unsupported or unknown data structure types.
 * 
 * This component is displayed when the system doesn't have a specialized
 * visualizer implemented for a specific data structure type. Instead of
 * showing an empty screen or error, it provides the user with an informative
 * message about the missing visualization.
 * 
 * DefaultVisualizer displays a simple container with an information message
 * that no visualization is available for the given data structure. It serves
 * as a fallback mechanism to ensure a consistent user interface.
 * 
 * @param {DefaultVisualizerProps} props - Props containing the algorithm context
 * @returns {JSX.Element} Component informing about the unsupported visualization
 */
interface DefaultVisualizerProps {
  /** Algorithm context providing access to the current step and data structure */
  context: BaseMethodContext;
}
  
export const DefaultVisualizer: React.FC<DefaultVisualizerProps> = ({ context }) => {
  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      {/* Section title */}
      <Typography variant="subtitle1" gutterBottom>Defaultní vizualizace</Typography>
      
      {/* Container with dashed border and centered text */}
      <Box sx={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        border: '1px dashed #ccc',
        borderRadius: '4px',
        p: 2
      }}>
        {/* Information message for the user */}
        <Typography variant="body2" color="text.secondary">
           Datová struktura nemá implementovanou vizualizaci.
        </Typography>
      </Box>
    </Box>
  );
};