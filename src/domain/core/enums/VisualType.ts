/**
 * Enumeration defining visual representation of elements in algorithm visualizations.
 * Determines the appearance of lines, circles, and other elements based on their purpose.
 */
export enum VisualType {
  /** Default type without specific visual representation */
  DEFAULT = 'DEFAULT',               

  // Line types
  /** Known, calculated distance (solid line, dark gray color) */
  KNOWN_DISTANCE = 'KNOWN_DISTANCE',
  /** Estimated or unknown distance (dashed line, dark gray color) */
  UNKNOWN_DISTANCE = 'UNKNOWN_DISTANCE',
  
  // Status types (applicable to both lines and circles)
  /** Visualization of elimination criteria (solid line/circle, red color) */
  ELIMINATION = 'ELIMINATION',
  /** Visualization of inclusion criteria (solid line/circle, green color) */
  INCLUSION = 'INCLUSION',
  
  // Circle types
  /** Circle representing the radius of a range query (solid, orange color) */
  RANGE_QUERY = 'RANGE_QUERY',
  /** Circle representing the distance to the k-th nearest neighbor (solid, orange color) */
  KNN_BOUNDARY = 'KNN_BOUNDARY',
  /** Circle representing the lower bound distance for point filtering (blue color) */
  LOWER_BOUND = 'LOWER_BOUND',
  
  /** Region in a tree structure (used for M-Tree visualization) */
  TREE_REGION = 'TREE_REGION',
  
  /** Level 1 region in a tree structure (primary level) */
  TREE_REGION_LVL_1 = 'TREE_REGION_LVL_1',
  
  /** Level 2 region in a tree structure (secondary level) */
  TREE_REGION_LVL_2 = 'TREE_REGION_LVL_2',
  
  /** Level 3 region in a tree structure (tertiary level and deeper) */
  TREE_REGION_LVL_3 = 'TREE_REGION_LVL_3',
  
  /** General tree structure visualization elements */
  TREE_STRUCTURE = "TREE_STRUCTURE",
}