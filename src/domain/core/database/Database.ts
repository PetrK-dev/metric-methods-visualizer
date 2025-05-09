import { DEFAULT_POINT_ID, DEFAULT_QUERY_X, DEFAULT_QUERY_Y, DOMAIN_SIZE } from "../../../utils/constants";
import { PointType } from "../enums/PointType";
import { Point } from "../models/Point";

/**
 * Class representing a database of points for metric algorithms.
 * Manages a collection of points of different types (objects, pivots, query points)
 * and provides methods for their manipulation and access.
 */
export class Database {
  /** Map storing all points, where the key is the point ID */
  private points: Map<number, Point> = new Map();
  /** Counter for generating unique point IDs */
  private nextId: number = 0;

  /**
   * Generates a specified number of random points and one query point.
   * Clears the database before generation.
   * 
   * @param {number} count - Number of points to generate (default: 8)
   */
  public generatePoints(count: number = 8): void {
    this.clear();
    
    // Generate random points with type OBJECT
    for (let i = 0; i < count; i++) {
      const coords = [Math.random() * DOMAIN_SIZE, Math.random() * DOMAIN_SIZE];
      this.createPoint(PointType.OBJECT, coords[0], coords[1]);
    }

    // Create a query point in the center of the space
    this.createPoint(PointType.QUERY, DEFAULT_QUERY_X, DEFAULT_QUERY_Y);
  }
    
  /**
   * Generates a new unique ID for a point.
   * Ensures that the returned ID is not already used by another point.
   * 
   * @returns {number} New unique ID
   */
  public getNewID(): number {
    while (this.points.has(this.nextId)) {
      this.nextId++;
    }
    return this.nextId++;
  }

  /**
   * Creates a new point with the given parameters and adds it to the database.
   * 
   * @param {PointType} type - Point type (OBJECT, PIVOT, QUERY)
   * @param {number} x - X-coordinate of the point
   * @param {number} y - Y-coordinate of the point
   * @returns {Point} Created point
   */
  public createPoint(type: PointType, x: number, y: number): Point {
    const point = new Point(this.getNewID(), type, x, y);
    this.addPoint(point);
    return point;
  }
  
  /**
   * Adds an existing point to the database.
   * If the point has a default ID or its ID is already occupied,
   * assigns it a new unique ID.
   * 
   * @param {Point} point - Point to add to the database
   */
  public addPoint(point: Point): void {
    if (point.id === DEFAULT_POINT_ID || this.points.has(point.id)) {
      point.id = this.getNewID();
    }
    this.points.set(point.id, point);
  }

  /**
   * Updates an existing point in the database.
   * If a point with the given ID doesn't exist, outputs a warning.
   * 
   * @param {Point} point - Point with updated values
   */
  public updatePoint(point: Point): void {
    if (this.points.has(point.id)) {
      this.points.set(point.id, point);
    } else {
      console.warn(`Point with ID ${point.id} does not exist in the database.`);
    }
  }
  
  /**
   * Returns an array of all points except the query point.
   * 
   * @returns {Point[]} Array of points of type OBJECT and PIVOT
   */
  public getDataPoints(): Point[] {
    return Array.from(this.points.values()).filter(point => point.type !== PointType.QUERY);
  }

  /**
   * Returns an array of all points including the query point.
   * 
   * @returns {Point[]} Array of all points in the database
   */
  public getDataWithQuery(): Point[] {
    return Array.from(this.points.values());
  }
  
  /**
   * Filters points by the specified type.
   * 
   * @param {PointType} type - Type of points to get
   * @returns {Point[]} Array of points of the given type
   */
  public getPointsByType(type: PointType): Point[] {
    return Array.from(this.points.values()).filter(point => point.type === type);
  }
  
  /**
   * Returns all regular objects (points that are not pivots or query points).
   * 
   * @returns {Point[]} Array of points of type OBJECT
   */
  public getObjects(): Point[] {
    return this.getPointsByType(PointType.OBJECT);
  }
  
  /**
   * Returns all pivot points.
   * 
   * @returns {Point[]} Array of points of type PIVOT
   */
  public getPivots(): Point[] {
    return this.getPointsByType(PointType.PIVOT);
  }
  
  /**
   * Returns the query point. If it doesn't exist, creates a new one.
   * 
   * @returns {Point} Query point of type QUERY
   */
  public getQuery(): Point {
    let queryPoint = this.getPointsByType(PointType.QUERY)[0];
    if (!queryPoint) {
      queryPoint = this.createPoint(PointType.QUERY, DEFAULT_QUERY_X, DEFAULT_QUERY_Y);
    }
    return queryPoint;
  }
  
  /**
   * Sets the point with the given ID as a pivot.
   * 
   * @param {number} pointId - ID of the point to be set as a pivot
   */
  public setAsPivot(pointId: number): void {
    const point = this.points.get(pointId);
    if (point) {
      point.type = PointType.PIVOT;
    }
  }
  
  /**
   * Sets multiple points as pivots.
   * First resets all existing pivots to type OBJECT,
   * then sets the specified points as pivots.
   * 
   * @param {number[]} pointIds - Array of IDs of points to be set as pivots
   */
  public setPivots(pointIds: number[]): void {
    // Reset previous pivots
    this.points.forEach(point => {
      if (point.type === PointType.PIVOT){
        point.type = PointType.OBJECT;
      }
    });
    
    // Set new pivots
    pointIds.forEach(id => this.setAsPivot(id));
  }
  
  /**
   * Clears all points from the database and resets the ID counter.
   */
  public clear(): void {
    this.points.clear();
    this.nextId = 0;
  }
  
  /**
   * Creates a deep copy of the database including all points.
   * 
   * @returns {Database} New database instance with a copy of all points
   */
  public clone(): Database {
    const db = new Database();
    db.nextId = this.nextId;
    
    this.points.forEach((point, id) => {
      db.points.set(id, point.clone());
    });
    
    return db;
  }
}