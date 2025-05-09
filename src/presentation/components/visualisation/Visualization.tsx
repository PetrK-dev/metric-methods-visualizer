import React from 'react';
import { BaseMethodContext } from '../../../application/contexts/BaseMethodContext';
import { Box } from '@mui/material';
import { PointType } from '../../../domain/core/enums/PointType';
import { VisualType } from '../../../domain/core/enums/VisualType';
import { Point } from '../../../domain/core/models/Point';
import { COLORS, DOMAIN_SIZE, OPACITY, PADDING_PERCENT, VISUALIZATION } from '../../../utils/constants';
import { SVG_STYLES } from '../../../assets/styles/code/codeAndData';


/**
 * Props interface for the Visualization component
 */
interface VisualizationProps {
  /** Context providing access to the current algorithm state */
  context: BaseMethodContext;
}

/**
 * Component for 2D visualization of points and metric relationships.
 * 
 * Visualization is a key component of the application that displays points in metric space
 * and visualizes the execution of metric methods algorithms. The component renders an SVG canvas
 * with the following elements:
 * 
 * - Points in metric space (objects, pivots, query point)
 * - Calculated distances between points represented by lines
 * - Circles representing range queries or lower bounds of distances
 * - Various visual indicators of point status (active, eliminated, result)
 * 
 * The component dynamically responds to changes in the algorithm context and displays the current
 * state of the algorithm execution, including highlighting of currently processed points,
 * calculated distances, and query results.
 * 
 * @param {VisualizationProps} props - Props containing the algorithm context
 * @returns {JSX.Element} Component for visualizing points and relationships in metric space
 */
export const Visualization: React.FC<VisualizationProps> = ({ context }) => {
  // Get current algorithm step from context
  const { displayStep } = context;
  
  // Get data needed for visualization
  const points = displayStep.database.getDataWithQuery();
  const { activePoints, eliminatedPoints, resultPoints, distances, circles } = displayStep;
  
  /**
   * Transforms point coordinates from domain space (0-10) to SVG space (0-100%)
   * with Y-axis inversion for proper display (SVG has origin at top-left)
   * 
   * @param {Point} point - Point to transform
   * @returns {Object} Transformed coordinates in {x, y} format
   */
  const transformCoords = (point: Point) => {
    return {
      x: (point.x / DOMAIN_SIZE) * 100,
      y: 100 - (point.y / DOMAIN_SIZE) * 100 // Invert Y-axis
    };
  };

  /**
   * Transforms radius value from domain space to SVG space
   * 
   * @param {number} radius - Radius in domain space
   * @returns {number} Radius transformed to SVG space
   */
  const transformRadius = (radius: number) => {
    return (radius / DOMAIN_SIZE) * 100;
  };

  /**
   * Determines point color based on its type and state in the current algorithm step
   * 
   * @param {Point} point - Point for which to determine color
   * @returns {string} Point color in HEX format
   */
  const getPointColor = (point: Point) => {
    if (activePoints.some(p => p.id === point.id)) return COLORS.POINT.ACTIVE;
    if (eliminatedPoints.some(p => p.id === point.id)) return COLORS.POINT.ELIMINATED;
    if (resultPoints.some(p => p.id === point.id)) return COLORS.POINT.RESULT;
    if (point.type === PointType.QUERY) return COLORS.POINT.QUERY;
    if (point.type === PointType.PIVOT) return COLORS.POINT.PIVOT;
    return COLORS.POINT.DEFAULT;
  };

  /**
   * Determines point size based on its type and state
   * 
   * @param {Point} point - Point for which to determine size
   * @returns {number} Point size in percentage
   */
  const getPointSize = (point: Point) => {
    if (point.type === PointType.QUERY) return VISUALIZATION.POINT.EMPHASIS_SIZE;
    if (activePoints.some(p => p.id === point.id)) return VISUALIZATION.POINT.EMPHASIS_SIZE;
    return VISUALIZATION.POINT.DEFAULT_SIZE;
  };

  /**
   * Determines line style (solid or dashed) based on visual element type
   * 
   * @param {VisualType} element - Type of visual element
   * @returns {string} SVG dasharray parameter
   */
  const getLineStyle = (element: VisualType = VisualType.DEFAULT) => {
    switch (element) {
      case VisualType.UNKNOWN_DISTANCE:
      case VisualType.LOWER_BOUND:
        return VISUALIZATION.LINE.DASHED;
      default:
        return VISUALIZATION.LINE.SOLID;
    }
  };

  /**
   * Determines the color of a visual element (line, circle) based on its type
   * 
   * @param {VisualType} element - Type of visual element
   * @returns {string} Element color in HEX format
   */
  const getElementColor = (element: VisualType = VisualType.DEFAULT) => {
    switch (element) {
      case VisualType.KNOWN_DISTANCE:
      case VisualType.UNKNOWN_DISTANCE:
        return COLORS.VISUAL.KNOWN_DISTANCE;
      case VisualType.ELIMINATION:
        return COLORS.VISUAL.ELIMINATION;
      case VisualType.INCLUSION:
        return COLORS.VISUAL.INCLUSION;
      case VisualType.RANGE_QUERY:
      case VisualType.KNN_BOUNDARY:
        return COLORS.VISUAL.RANGE_QUERY;
      case VisualType.LOWER_BOUND:
        return COLORS.VISUAL.LOWER_BOUND;
      case VisualType.TREE_REGION:
        return COLORS.VISUAL.TREE_REGION;
      case VisualType.TREE_REGION_LVL_1:
        return COLORS.VISUAL.TREE_REGION_LVL_1;
      case VisualType.TREE_REGION_LVL_2:
        return COLORS.VISUAL.TREE_REGION_LVL_2;
      case VisualType.TREE_REGION_LVL_3:
        return COLORS.VISUAL.TREE_REGION_LVL_3;
      default:
        return COLORS.VISUAL.DEFAULT;
    }
  };

  /**
   * Determines the opacity of a visual element based on its type
   * 
   * @param {VisualType} element - Type of visual element
   * @returns {number} Opacity value (0.0 - 1.0)
   */
  const getStatusOpacity = (element: VisualType = VisualType.DEFAULT) => {
    switch (element) {
      case VisualType.RANGE_QUERY:
        return OPACITY.RANGE_QUERY;
      case VisualType.KNN_BOUNDARY:
        return OPACITY.KNN_BOUNDARY;
      case VisualType.LOWER_BOUND:
        return OPACITY.LOWER_BOUND;
      case VisualType.ELIMINATION:
      case VisualType.INCLUSION:
        return OPACITY.ELIMINATION;
      case VisualType.KNOWN_DISTANCE:
      case VisualType.UNKNOWN_DISTANCE:
        return OPACITY.KNOWN_DISTANCE;
      default:
        return OPACITY.DEFAULT;
    }
  };

  /**
   * Sorts circles by their visual type to ensure proper rendering order
   * Regions will be rendered in order of their depth level, with higher level regions
   * appearing on top of lower level regions
   */
  const sortedCircles = [...circles].sort((a, b) => {
    /**
     * Helper function to determine rendering priority based on visual type
     * 
     * @param {VisualType | undefined} type - Visual type to determine priority for
     * @returns {number} Priority value (lower values are rendered first/bottom)
     */
    const getDepthPriority = (type: VisualType | undefined) => {
      if (type === undefined) return 0; // Default priority if type is not defined
      
      switch(type) {
        case VisualType.TREE_REGION_LVL_3: return 1; // Render first (bottom layer)
        case VisualType.TREE_REGION_LVL_2: return 2;
        case VisualType.TREE_REGION_LVL_1: return 3; // Render last (top layer)
        default: return 0; // Other circles
      }
    };
    
    return getDepthPriority(a.type) - getDepthPriority(b.type);
  });
  
  return (
    <Box sx={SVG_STYLES.container}>
      {/* SVG canvas for visualization with viewBox and borders */}
      <Box
        component="svg"
        sx={{
          ...SVG_STYLES.svg,
          borderColor: COLORS.UI.BORDER.LIGHT,
        }}
        viewBox={`-${PADDING_PERCENT} -${PADDING_PERCENT} ${100 + 2*PADDING_PERCENT} ${100 + 2*PADDING_PERCENT}`}
      >
        {/* Render background grid */}
        {Array.from({ length: DOMAIN_SIZE + 1 }, (_, i) => {
          const pos = (i / DOMAIN_SIZE) * 100; // Position in percentage
          return (
            <React.Fragment key={i}>
              {/* Horizontal grid line */}
              <line
                x1={0}
                y1={pos}
                x2={100}
                y2={pos}
                stroke={COLORS.UI.BACKGROUND.GRID}
                strokeWidth={VISUALIZATION.GRID.WIDTH}
              />
              {/* Vertical grid line */}
              <line
                x1={pos}
                y1={0}
                x2={pos}
                y2={100}
                stroke={COLORS.UI.BACKGROUND.GRID}
                strokeWidth={VISUALIZATION.GRID.WIDTH}
              />
            </React.Fragment>
          );
        })}

        {/* Render circles for range queries, lower bounds, etc. */}
        {sortedCircles.map((circle, index) => {
          const center = transformCoords(circle.center);
          const radius = transformRadius(circle.radius);
          const strokeDasharray = getLineStyle(circle.type);
          const strokeColor = getElementColor(circle.type);
          const opacity = getStatusOpacity(circle.type);
          
          return (
            <circle
              key={`circle-${index}`}
              cx={center.x}
              cy={center.y}
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth={VISUALIZATION.LINE.WIDTH}
              strokeDasharray={strokeDasharray}
              opacity={opacity}
            />
          );
        })}

        {/* Render distance lines between points */}
        {distances.map((distance, index) => {
          const start = transformCoords(distance.from);
          const end = transformCoords(distance.to);
          const strokeDasharray = getLineStyle(distance.type);
          const strokeColor = getElementColor(distance.type);
          const opacity = getStatusOpacity(distance.type);
          
          return (
            <line
              key={`line-${index}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={strokeColor}
              strokeWidth={VISUALIZATION.LINE.WIDTH}
              strokeDasharray={strokeDasharray}
              opacity={opacity}
            />
          );
        })}

        {/* Render points with their labels */}
        {points.map((point) => {
          const coords = transformCoords(point);
          const color = getPointColor(point);
          const size = getPointSize(point);
          
          return (
            <g key={point.id}>
              {/* Highlight circle around active point */}
              {activePoints.some(p => p.id === point.id) && (
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={VISUALIZATION.POINT.HIGHLIGHT_RADIUS}
                  fill="none"
                  stroke={color}
                  strokeWidth={VISUALIZATION.GRID.WIDTH}
                  opacity={OPACITY.ACTIVE_HIGHLIGHT}
                />
              )}
              
              {/* The point itself (circle) */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={size}
                fill={color}
                stroke={COLORS.POINT.STROKE}
                strokeWidth={VISUALIZATION.POINT.STROKE_WIDTH}
              />
              
              {/* Text label for the point */}
              <text
                x={coords.x}
                y={coords.y - 2}  // Reduced from -3
                textAnchor="middle"
                fill={COLORS.UI.TEXT.SECONDARY}
                fontSize={VISUALIZATION.TEXT.SIZE}
                fontFamily={VISUALIZATION.TEXT.FONT_FAMILY}
              >
                {/* Display point label (Q, P, O) */}
                {point.label}
                {/* For points other than query point, show ID as subscript */}
                {point.label !== 'Q' && (
                  <tspan baselineShift="sub" fontSize={VISUALIZATION.TEXT.SUB_SIZE}>{point.id}</tspan>
                )}
              </text>
            </g>
          );
        })}
      </Box>
    </Box>
  );
};