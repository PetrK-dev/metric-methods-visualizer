import { Typography } from "@mui/material";

/**
 * Component displaying parameters for the dynamic insertion algorithm.
 * Since this algorithm doesn't have any parameters, the component
 * only displays an informational text.
 * 
 * @returns {JSX.Element} React component
 */
export const DynamicInsertParams: React.FC = () => {
  return (<Typography variant="body2">Bez parametrů</Typography>);
};