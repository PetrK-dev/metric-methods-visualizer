import { Box, Typography, TextField } from "@mui/material";
import { BaseMethodContext } from "../../../application/contexts/BaseMethodContext";
import { useEffect, useState } from "react";
import { Point } from "../../../domain/core/models/Point";
import { controlPanel, flexContainer } from "../../../assets/styles/controls/controlsStyles";
import { MIN_COORDINATE, MAX_COORDINATE, COORDINATE_STEP } from "../../../utils/constants";

/** Default X-coordinate for the query point */
const DEFAULT_X = 5;
/** Default Y-coordinate for the query point */
const DEFAULT_Y = 5;

/**
 * Props for the PointEditor component
 */
interface PointEditorProps {
    /** Algorithm context providing access to point editing methods */
    context: BaseMethodContext;
}
  
/**
 * Component for editing the query point.
 * Allows users to change the X and Y coordinates of the query point.
 * Includes input validation and fallback to default values when invalid.
 * 
 * @param {PointEditorProps} props - Props containing the algorithm context
 * @returns {JSX.Element} The point editor component
 */
export const PointEditor: React.FC<PointEditorProps> = ({ context }) => {
    const { queryPoint, setQueryPoint, database } = context;

    /** Local state for X coordinate text field value */
    const [xInputValue, setXInputValue] = useState(queryPoint.x.toString());
    /** Local state for Y coordinate text field value */
    const [yInputValue, setYInputValue] = useState(queryPoint.y.toString());
  
    /**
     * Synchronizes local state with queryPoint when it changes.
     * Updates the text input values when the query point is changed from outside.
     */
    useEffect(() => {
      setXInputValue(queryPoint.x.toString());
      setYInputValue(queryPoint.y.toString());
    }, [queryPoint]);
    
    /**
     * Handles changes to the X coordinate text field.
     * Updates the query point if the value is valid.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
     */
    const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Update text field without restrictions
      setXInputValue(e.target.value);
      
      // If we have a valid number within range, update the point
      const newX = parseFloat(e.target.value);
      if (!isNaN(newX) && newX >= MIN_COORDINATE && newX <= MAX_COORDINATE) {
        database.updatePoint(new Point(queryPoint.id, queryPoint.type, newX, queryPoint.y));
        setQueryPoint(database.getQuery());
      }
    };
    
    /**
     * Handles changes to the Y coordinate text field.
     * Updates the query point if the value is valid.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
     */
    const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Update text field without restrictions
      setYInputValue(e.target.value);
      
      // If we have a valid number within range, update the point
      const newY = parseFloat(e.target.value);
      if (!isNaN(newY) && newY >= MIN_COORDINATE && newY <= MAX_COORDINATE) {
        database.updatePoint(new Point(queryPoint.id, queryPoint.type, queryPoint.x, newY));
        setQueryPoint(database.getQuery());
      }
    };

    /**
     * Handles blur event for the X coordinate text field.
     * Sets the default value if the current value is invalid.
     */
    const handleXBlur = () => {
      if (xInputValue === '' || isNaN(parseFloat(xInputValue)) || parseFloat(xInputValue) < MIN_COORDINATE || parseFloat(xInputValue) > MAX_COORDINATE) {
        // Empty or invalid value - set default
        setXInputValue(DEFAULT_X.toString());
        database.updatePoint(new Point(queryPoint.id, queryPoint.type, DEFAULT_X, queryPoint.y));
        setQueryPoint(database.getQuery());
      }
    };
    
    /**
     * Handles blur event for the Y coordinate text field.
     * Sets the default value if the current value is invalid.
     */
    const handleYBlur = () => {
      if (yInputValue === '' || isNaN(parseFloat(yInputValue)) || parseFloat(yInputValue) < MIN_COORDINATE || parseFloat(yInputValue) > MAX_COORDINATE) {
        // Empty or invalid value - set default
        setYInputValue(DEFAULT_Y.toString());
        database.updatePoint(new Point(queryPoint.id, queryPoint.type, queryPoint.x, DEFAULT_Y));
        setQueryPoint(database.getQuery());
      }
    };
  
    return (
      <>
        <Typography variant="subtitle1" gutterBottom>Úprava dotazovacího bodu</Typography>
        <Box sx={controlPanel}>

          <Box sx={flexContainer}>
            <TextField
              label="X"
              size="small"
              type="number"
              value={xInputValue}
              onChange={handleXChange}
              onBlur={handleXBlur}
              InputProps={{ inputProps: { min: MIN_COORDINATE, max: MAX_COORDINATE, step: COORDINATE_STEP } }}
            />
            <TextField
              label="Y"
              size="small"
              type="number"
              value={yInputValue}
              onChange={handleYChange}
              onBlur={handleYBlur}
              InputProps={{ inputProps: { min: MIN_COORDINATE, max: MAX_COORDINATE, step: COORDINATE_STEP } }}
            />
          </Box>
        </Box>
      </>
    );
};