import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import { BaseMethodContext } from '../../../../application/contexts/BaseMethodContext';
import { MIN_RANGE_RADIUS, RADIUS_STEP } from '../../../../utils/constants';

/** Default radius value for range query */
const DEFAULT_RADIUS = 2;

/**
 * Props for the RangeParams component
 */
interface RangeParamsProps {
  /** Algorithm context providing access to parameters and their setter methods */
  context: BaseMethodContext;
}

/**
 * Component for setting parameters of the range query algorithm.
 * Allows users to input the search radius value.
 * Includes validation and fallback to default values when invalid input is provided.
 * 
 * @param {RangeParamsProps} props - Props containing the algorithm context
 * @returns {JSX.Element} React component
 */
export const RangeParams: React.FC<RangeParamsProps> = ({ context }) => {
  const { rangeRadius, setRangeRadius } = context;
  const [inputValue, setInputValue] = useState(rangeRadius.toString());
  
  /**
   * Handles changes to the text field value.
   * Updates the local state and sets the radius if valid.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update text field without restrictions
    setInputValue(e.target.value);
    
    // If we have a valid number, set it as radius
    const newRadius = parseFloat(e.target.value);
    if (!isNaN(newRadius) && newRadius > 0) {
      setRangeRadius(newRadius);
    }
  };

  /**
   * Handles blur event of the text field.
   * Sets the default value if the current value is invalid.
   */
  const handleBlur = () => {
    if (inputValue === '' || isNaN(parseFloat(inputValue)) || parseFloat(inputValue) <= 0) {
      // Empty or invalid value - set default
      setInputValue(DEFAULT_RADIUS.toString());
      setRangeRadius(DEFAULT_RADIUS);
    }
  };

  return (
    <>
      <Typography variant="body2">Poloměr vyhledávání</Typography>
      <TextField
        fullWidth
        size="small"
        type="number"
        value={inputValue}
        onChange={handleRadiusChange}
        onBlur={handleBlur}
        InputProps={{ inputProps: { min: MIN_RANGE_RADIUS, step: RADIUS_STEP } }}
        sx={{ mt: 0.5 }}
      />
    </>
  );
};