/**
 * Global application constants for the metric methods visualization.
 * Contains settings for domain space, default values, input boundaries, 
 * colors, visualization styles, and other configuration parameters.
 */

/**
 * The size of the domain space (0-10 coordinate range)
 */
export const DOMAIN_SIZE = 10;
/**
 * Padding percentage for SVG viewport to ensure elements at edges are visible
 */
export const PADDING_PERCENT = 2.5;

/**
 * Default constants for visualizations and algorithm parameters
 */
/** Default ID value for newly created points */
export const DEFAULT_POINT_ID = -1;
/** Default number of points in the database */
export const DEFAULT_POINT_COUNT = 15;
/** Default X-coordinate for query point (center of the domain) */
export const DEFAULT_QUERY_X = DOMAIN_SIZE/2;
/** Default Y-coordinate for query point (center of the domain) */
export const DEFAULT_QUERY_Y = DOMAIN_SIZE/2;
/** Default K value for k-nearest neighbors algorithm */
export const DEFAULT_K_VALUE = 3;
/** Default radius for range query algorithm */
export const DEFAULT_RANGE_RADIUS = 2;

/**
 * Boundary values and step sizes for user inputs
 */
/** Minimum allowed number of points in the database */
export const MIN_POINT_COUNT = 5;
/** Maximum allowed number of points in the database */
export const MAX_POINT_COUNT = 20;
/** Minimum allowed coordinate value */
export const MIN_COORDINATE = 0;
/** Maximum allowed coordinate value */
export const MAX_COORDINATE = DOMAIN_SIZE;
/** Step size for coordinate input controls */
export const COORDINATE_STEP = 0.1;
/** Minimum allowed K value for k-nearest neighbors algorithm */
export const MIN_K_VALUE = 1;
/** Minimum allowed radius for range query algorithm */
export const MIN_RANGE_RADIUS = 0.5;
/** Step size for radius input control */
export const RADIUS_STEP = 0.1;
/** Minimum allowed playback speed */
export const MIN_SPEED = 0.5;
/** Maximum allowed playback speed */
export const MAX_SPEED = 3;
/** Step size for speed control */
export const SPEED_STEP = 0.1;
/** Default playback speed */
export const DEFAULT_SPEED = 1;

/**
 * Color constants for visualization elements
 */
export const COLORS = {
  /** Colors for different point types in the visualization */
  POINT: {
    /** Default color for standard points (black) */
    DEFAULT: '#000000',
    /** Color for query point (blue) */
    QUERY: '#0000ff',
    /** Color for pivot points (purple) */
    PIVOT: '#ff00ff',
    /** Color for currently active points (green) */
    ACTIVE: '#00ff00',
    /** Color for eliminated points (gray) */
    ELIMINATED: '#888888',
    /** Color for result points (turquoise) */
    RESULT: '#55FFF5',
    /** Stroke color for point outlines (white) */
    STROKE: '#ffffff',
  },
  
  /** Colors for various visual elements like lines and regions */
  VISUAL: {
    /** Color for calculated distances (dark gray) */
    KNOWN_DISTANCE: '#555555',
    /** Color for estimated/unknown distances (dark gray) */
    UNKNOWN_DISTANCE: '#555555',
    /** Color for elimination visuals (red) */
    ELIMINATION: '#f44336',
    /** Color for inclusion visuals (green) */
    INCLUSION: '#4caf50',
    /** Color for range query circle (orange) */
    RANGE_QUERY: '#FF9800',
    /** Color for kNN boundary (orange) */
    KNN_BOUNDARY: '#FF9800',
    /** Color for lower bound visualization (blue) */
    LOWER_BOUND: '#2196F3',
    /** Default color for visual elements (medium gray) */
    DEFAULT: '#757575',
    /** Color for tree region (medium gray) */
    TREE_REGION: '#757575',
    /** Color for first level tree regions (very dark gray) */
    TREE_REGION_LVL_1: '#222222',
    /** Color for second level tree regions (medium gray) */
    TREE_REGION_LVL_2: '#666666',
    /** Color for third level and deeper tree regions (light gray) */
    TREE_REGION_LVL_3: '#BBBBBB',
  },
  
  /** Colors for UI elements */
  UI: {
    /** Background colors */
    BACKGROUND: {
      /** Light background color */
      LIGHT: '#f8f8f8',
      /** Medium light background color */
      MEDIUM: '#f5f5f5',
      /** Grid line color */
      GRID: '#eee',
    },
    /** Border colors */
    BORDER: {
      /** Light border color */
      LIGHT: '#ccc',
      /** Medium border color */
      MEDIUM: '#e0e0e0',
      /** Color for dashed borders */
      DASHED: '#ccc',
    },
    /** Text colors */
    TEXT: {
      /** Primary text color */
      PRIMARY: '#333',
      /** Secondary text color */
      SECONDARY: '#555',
      /** Light text color */
      LIGHT: '#757575',
      /** Color for keywords in pseudocode */
      KEYWORD: '#ff6666',
    },
    /** Highlight colors */
    HIGHLIGHT: {
      /** Background color for active table row */
      ACTIVE_ROW: 'rgba(33, 150, 243, 0.3)',
      /** Background color for active code line */
      ACTIVE_CODE: 'rgba(144, 202, 249, 0.3)'
    }
  }
};

/**
 * Opacity values for various visual elements
 */
export const OPACITY = {
  /** Opacity for range query circles */
  RANGE_QUERY: 0.75,
  /** Opacity for kNN boundary circles */
  KNN_BOUNDARY: 0.75,
  /** Opacity for lower bound circles */
  LOWER_BOUND: 0.75,
  /** Opacity for elimination visuals */
  ELIMINATION: 0.75,
  /** Opacity for inclusion visuals */
  INCLUSION: 0.75,
  /** Opacity for known distance lines */
  KNOWN_DISTANCE: 0.75,
  /** Opacity for unknown distance lines */
  UNKNOWN_DISTANCE: 0.75,
  /** Default opacity for visual elements */
  DEFAULT: 0.6,
  /** Opacity for active element highlights */
  ACTIVE_HIGHLIGHT: 0.5,
};

/**
 * Size and style constants for visualization elements
 */
export const VISUALIZATION = {
  /** Point-related size constants */
  POINT: {
    /** Default size for standard points */
    DEFAULT_SIZE: 1,
    /** Size for emphasized points (query, active) */
    EMPHASIS_SIZE: 1.5,
    /** Radius for highlight circle around active points */
    HIGHLIGHT_RADIUS: 2.5,
    /** Width of point stroke/outline */
    STROKE_WIDTH: 0.4,
  },
  /** Line style constants */
  LINE: {
    /** Dash pattern for dashed lines */
    DASHED: '4 2',
    /** Pattern for solid lines (empty string) */
    SOLID: '',
    /** Line width for all lines */
    WIDTH: 0.4,
  },
  /** Grid style constants */
  GRID: {
    /** Width of grid lines */
    WIDTH: 0.3,
  },
  /** Text style constants */
  TEXT: {
    /** Primary text size */
    SIZE: 2.8,
    /** Size for subscript and smaller text */
    SUB_SIZE: 1.8,
    /** Font family for all text */
    FONT_FAMILY: 'Arial, sans-serif',
  }
};

/**
 * Constants related to pseudocode display
 */
export const PSEUDOCODE_CONSTANTS = {
  /** Keywords to highlight in pseudocode */
  KEYWORDS: [
    'for', 'if', 'while', 'end', 'return', 'else', 
    'procedure', 'function', 'do', 'then'
  ]
};