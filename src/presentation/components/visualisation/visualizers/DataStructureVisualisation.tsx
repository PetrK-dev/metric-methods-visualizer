import { BaseMethodContext } from "../../../../application/contexts/BaseMethodContext";
import { DataStructureType } from "../../../../domain/core/data-structures/IDataStructure";
import { DefaultVisualizer } from "./DefaultVisualizer";
import { DistanceMatrixVisualizer } from "./DistanceMatrixVisualizer";
import { TreeVisualizer } from "./TreeVisualizer";

/**
 * Props interface for the DataStructureVisualization component
 */
interface DataStructureVisualizationProps {
  /** Algorithm context providing access to the current step and data structure */
  context: BaseMethodContext;
}

/**
 * Component for dynamic selection and display of the appropriate data structure visualizer.
 * 
 * This component acts as a switch between different data structure visualizers
 * based on the structure type available in the current algorithm step.
 * It supports various data structure types, such as distance matrices or M-tree structures.
 * 
 * The component automatically selects and renders the appropriate visualizer for the current
 * data structure type, allowing users to monitor the state of the data structure
 * during algorithm stepping without the need for manual switching.
 * 
 * @param {DataStructureVisualizationProps} props - Props containing the algorithm context
 * @returns {JSX.Element} Component of the appropriate visualizer for the current data structure
 */
export const DataStructureVisualization: React.FC<DataStructureVisualizationProps> = ({ context }) => {
  // Get current step and data structure from context
  const { displayStep } = context;
  const { dataStructure } = displayStep;
  const dataStructureType = dataStructure.structureType;
  
  /**
   * Dynamic selection of visualizer based on data structure type
   * Each supported data structure type has its specialized visualizer
   * For unsupported types, DefaultVisualizer is used to display basic information
   */
  switch (dataStructureType) {
    case DataStructureType.DISTANCE_MATRIX:
      return <DistanceMatrixVisualizer context={context} />;
    case DataStructureType.TREE:
      return <TreeVisualizer context={context}/>;
    default:
      return <DefaultVisualizer context={context} />;
  }
};