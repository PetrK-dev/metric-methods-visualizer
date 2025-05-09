import { Box, Typography, Slider} from "@mui/material";
import { BaseMethodContext } from "../../../application/contexts/BaseMethodContext";
import { controlPanel } from "../../../assets/styles/controls/controlsStyles";
import { MIN_POINT_COUNT, MAX_POINT_COUNT } from "../../../utils/constants";

/**
 * Props for the DatabaseSettings component
 */
interface DatabaseSettingsProps {
    /** Algorithm context providing access to database settings */
    context: BaseMethodContext;
}
  
/**
 * Component for database parameter settings.
 * Allows users to change the number of points in the database using a slider.
 * Changing the point count triggers database regeneration with the new number of points.
 * 
 * @param {DatabaseSettingsProps} props - Props containing the algorithm context
 * @returns {JSX.Element} React component
 */
export const DatabaseSettings: React.FC<DatabaseSettingsProps> = ({ context }) => {
  const { pointCount, setPointCount } = context;
  
  /**
   * Handles changes to the point count slider value.
   * 
   * @param {Event} _event - Change event (not used)
   * @param {number | number[]} newValue - New point count value
   */
  const handlePointCountChange = (_event: Event, newValue: number | number[]) => {
    setPointCount(newValue as number);
  };
  
  return (
    <>
      <Typography variant="subtitle1" gutterBottom>Databáze</Typography>
      <Box sx={controlPanel}>

        <Typography variant="body2" gutterBottom>
            Počet bodů v databázi: {pointCount}
        </Typography>
        <Slider
          value={pointCount}
          onChange={handlePointCountChange}
          min={MIN_POINT_COUNT}
          max={MAX_POINT_COUNT}
          step={1}
          valueLabelDisplay="auto"
          sx={{ flexGrow: 1 }}
        />
      </Box>
    </>
  );
};