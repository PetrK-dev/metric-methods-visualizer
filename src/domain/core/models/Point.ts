import { PointType } from "../enums/PointType";

/**
 * Class representing a point in metric space.
 * A point is defined by an identifier, type, and coordinates in 2D space.
 */
export class Point {
    /**
     * Creates a new point instance.
     * 
     * @param {number} id - Unique identifier of the point
     * @param {PointType} type - Type of point (OBJECT, PIVOT, QUERY)
     * @param {number} x - X-coordinate of the point
     * @param {number} y - Y-coordinate of the point
     */
    constructor(
      public id: number,
      public type: PointType,
      public x: number,
      public y: number
    ) {}
    
    /**
     * Returns a single character label for the point based on its type.
     * Used when rendering points in visualizations.
     * 
     * @returns {string} Point label (Q for query, P for pivot, O for object)
     */
    get label(): string {
      switch(this.type) {
        case PointType.QUERY: return 'Q';
        case PointType.PIVOT: return 'P';
        default: return 'O';
      }
    }
    
    /**
     * Creates a deep copy of the point.
     * 
     * @returns {Point} A new point instance with the same values
     */
    clone(): Point {
      return new Point(this.id, this.type, this.x, this.y);
    }
  }