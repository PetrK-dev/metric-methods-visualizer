import { Box, Typography, Paper, IconButton, Collapse } from "@mui/material";
import React from "react";
import { BaseMethodContext } from "../../../../application/contexts/BaseMethodContext";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { MTreeNode, MTreeNodeType, RoutingRecord, DataRecord } from "../../../../domain/core/data-structures/Tree";
import { Point } from "../../../../domain/core/models/Point";

/**
 * Props interface for the TreeVisualizer component
 */
interface TreeVisualizerProps {
  /** Algorithm context providing access to the current algorithm state */
  context: BaseMethodContext;
}

/**
 * Component for visualizing M-Tree structure.
 * 
 * This component renders a hierarchical view of an M-Tree, displaying both routing and leaf nodes.
 * It uses a recursive approach to render the tree structure with collapsible sections.
 * The visualization highlights active, eliminated, and result points based on the current algorithm step.
 * 
 * @param {TreeVisualizerProps} props - The component props containing the algorithm context
 * @returns {JSX.Element} The rendered tree visualization or an empty tree message
 */
export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ context }) => {
  const { displayStep } = context;
  const tree = displayStep.dataStructure.getStructure();
  const rootNode = tree.getRootNode();

  if (!rootNode) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1">Prázdný strom</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, overflow: 'auto', height: '100%' }}>
      <Typography variant="h6" gutterBottom>M-tree struktura</Typography>
      <Paper sx={{ p: 1, bgcolor: 'background.default' }}>
        <NodeRenderer node={rootNode} displayStep={displayStep} level={0} />
      </Paper>
    </Box>
  );
};

/**
 * Props interface for the NodeRenderer component
 */
interface NodeRendererProps {
  /** The M-Tree node to render */
  node: MTreeNode;
  /** Current algorithm step data */
  displayStep: any;
  /** Nesting level of the node in the tree (used for indentation) */
  level: number;
  /** Parent pivot point (optional, used for displaying distance from parent) */
  parentPivot?: Point;
}

/**
 * Component for recursively rendering a single M-Tree node and its children.
 * 
 * This component visualizes a node in the M-Tree, showing:
 * - Node type (routing or leaf)
 * - Node capacity and usage
 * - For routing nodes: routing points with their radius and child nodes
 * - For leaf nodes: data points
 * 
 * The component applies visual highlighting to active, eliminated, or result points
 * based on the current algorithm step. It also supports collapsing/expanding of nodes
 * for better navigation of large trees.
 * 
 * @param {NodeRendererProps} props - The component props
 * @returns {JSX.Element} The rendered node and its children
 */
const NodeRenderer: React.FC<NodeRendererProps> = ({ node, displayStep, level, parentPivot }) => {
  // Automatically expand first two levels of the tree
  const [expanded, setExpanded] = React.useState(level < 2);

  /**
   * Toggles the expanded state of the node
   */
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Box sx={{ ml: level > 0 ? 2 : 0, borderLeft: level > 0 ? '1px dashed rgba(0,0,0,0.2)' : 'none', pl: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {node.records.length > 0 && (
          <IconButton size="small" onClick={toggleExpanded}>
            {expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 'bold', 
            color: node.type === MTreeNodeType.ROUTING ? 'primary.main' : 'secondary.main' 
          }}
        >
          {node.type === MTreeNodeType.ROUTING ? 'Směrovací uzel' : 'Listový uzel'} ({node.records.length}/{node.capacity})
        </Typography>
      </Box>

      <Collapse in={expanded}>
        {node.records.map((record, index) => {
          // Determine the point's status in the algorithm (active, eliminated, result)
          const isActive = displayStep.activePoints.some((p: any) => p.id === record.point.id);
          const isEliminated = displayStep.eliminatedPoints.some((p: any) => p.id === record.point.id);
          const isResult = displayStep.resultPoints.some((p: any) => p.id === record.point.id);
          
          // Set background color based on point status
          let bgColor = 'transparent';
          if (isActive) bgColor = 'rgba(33, 150, 243, 0.2)';
          if (isEliminated) bgColor = 'rgba(244, 67, 54, 0.2)';
          if (isResult) bgColor = 'rgba(76, 175, 80, 0.2)';

          if (node.type === MTreeNodeType.ROUTING) {
            // Render routing node record
            const routingRecord = record as RoutingRecord;
            return (
              <Box key={index} sx={{ mt: 1 }}>
                <Paper sx={{ p: 1, bgcolor: bgColor, borderRadius: 1 }}>
                  <Typography variant="body2">
                    <strong>Uzlový bod {record.point.id}</strong> [x: {record.point.x.toFixed(1)}, y: {record.point.y.toFixed(1)}]
                  </Typography>
                  <Typography variant="body2">
                    Poloměr: {routingRecord.radius.toFixed(2)}
                  </Typography>
                  {parentPivot && (
                    <Typography variant="body2">
                      Vzdálenost od rodiče: {record.parentDistance.toFixed(2)}
                    </Typography>
                  )}
                  {/* Recursively render child node */}
                  <NodeRenderer 
                    node={routingRecord.childNode} 
                    displayStep={displayStep} 
                    level={level + 1} 
                    parentPivot={record.point} 
                  />
                </Paper>
              </Box>
            );
          } else {
            // Render leaf node record (data point)
            const dataRecord = record as DataRecord;
            return (
              <Box key={index} sx={{ mt: 0.5, ml: 4 }}>
                <Paper sx={{ p: 0.5, bgcolor: bgColor, borderRadius: 1 }}>
                  <Typography variant="body2">
                    <strong>Bod {dataRecord.point.id}</strong> [x: {dataRecord.point.x.toFixed(1)}, y: {dataRecord.point.y.toFixed(1)}]
                    {parentPivot && `, vzdálenost: ${dataRecord.parentDistance.toFixed(2)}`}
                  </Typography>
                </Paper>
              </Box>
            );
          }
        })}
      </Collapse>
    </Box>
  );
};