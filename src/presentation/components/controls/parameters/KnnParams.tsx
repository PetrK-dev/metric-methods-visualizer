import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import { BaseMethodContext } from '../../../../application/contexts/BaseMethodContext';
import { MIN_K_VALUE } from '../../../../utils/constants';

/** Default value for the number of nearest neighbors */
const DEFAULT_K_VALUE = 3;

/**
 * Props for the KnnParams component
 */
interface KnnParamsProps {
  /** Algorithm context providing access to parameters and their setter methods */
  context: BaseMethodContext;
}

/**
 * Component for setting parameters of the k-nearest neighbors algorithm.
 * Allows users to input the k value (number of neighbors to search for).
 * Includes validation and fallback to default values when invalid input is provided.
 * 
 * @param {KnnParamsProps} props - Props containing the algorithm context
 * @returns {JSX.Element} React component
 */
export const KnnParams: React.FC<KnnParamsProps> = ({ context }) => {
  const { kValue, setKValue } = context;
  const [inputValue, setInputValue] = useState(kValue.toString());

  /**
   * Handles changes to the text field value.
   * Updates the local state and sets the k value if valid.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleKChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update text field without restrictions
    setInputValue(e.target.value);
    
    // If we have a valid number, set it as K
    const newK = parseInt(e.target.value, 10);
    if (!isNaN(newK) && newK > 0) {
      setKValue(newK);
    }
  };

  /**
   * Handles blur event of the text field.
   * Sets the default value if the current value is invalid.
   */
  const handleBlur = () => {
    if (inputValue === '' || isNaN(parseInt(inputValue, 10)) || parseInt(inputValue, 10) <= 0) {
      // Empty or invalid value - set default
      setInputValue(DEFAULT_K_VALUE.toString());
      setKValue(DEFAULT_K_VALUE);
    }
  };

  return (
    <>
        <Typography variant="body2">Počet sousedů (k)</Typography>
        <TextField
          fullWidth
          size="small"
          type="number"
          value={inputValue}
          onChange={handleKChange}
          onBlur={handleBlur}
          InputProps={{ inputProps: { min: MIN_K_VALUE, step: 1 } }}
          sx={{ mt: 0.5 }}
        />
    </>
  );
};