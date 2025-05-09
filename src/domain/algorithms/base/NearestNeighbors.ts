import { Point } from "../../core/models/Point";

/**
 * Helper class for managing a set of k-nearest neighbors.
 * Maintains a sorted collection of points by their distance
 * and ensures that the collection size does not exceed k.
 */
export class NearestNeighbors {
  /** Array of records with points and their distances */
  private items: Array<{ point: Point; distance: number }>;
  /** Number of nearest neighbors to maintain */
  private k: number;

  /**
   * Creates a new instance for managing k-nearest neighbors
   * @param {number} k - Number of nearest neighbors
   */
  constructor(k: number) {
    this.items = [];
    this.k = k;
  }

  /**
   * Adds a point to the set of nearest neighbors.
   * If there are already k points in the collection, adds the point only if it's closer
   * than the furthest neighbor, and ensures sorting.
   * 
   * @param {Point} point - Point to add
   * @param {number} distance - Distance of the point from the query
   */
  add(point: Point, distance: number) {
    this.items.push({ point, distance });
    this.items.sort((a, b) => a.distance - b.distance);
    if (this.items.length > this.k) {
      this.items.length = this.k;
    }
  }

  /**
   * Adds a point to the set of nearest neighbors with additional checks.
   * Checks if the point should be added based on the current collection,
   * updates existing point if a better distance is found.
   * 
   * @param {Point} point - Point to add
   * @param {number} distance - Distance of the point from the query
   * @returns {boolean} True if the point was added or updated, false otherwise
   */
  addWithCheck(point: Point, distance: number): boolean {
    // Check if the point should be added given the current collection
    if (this.items.length >= this.k && distance >= this.getFurthestDistance()) {
      return false; // Point would not be added because it's further than the current k-th point
    }
    
    // Check if the point is already in the collection
    const existingIdx = this.items.findIndex(item => item.point.id === point.id);
    if (existingIdx >= 0) {
      if (this.items[existingIdx].distance <= distance) {
        return false; // We already have a better distance for this point
      }
      this.items.splice(existingIdx, 1); // Remove existing record
    }
    
    // Add new point and sort
    this.items.push({ point, distance });
    this.items.sort((a, b) => a.distance - b.distance);
    
    // Remove excess records
    if (this.items.length > this.k) {
      this.items.length = this.k;
    }
    
    return true; // Point was added or updated
  }

  /**
   * Gets the distance to the furthest neighbor.
   * If the set contains fewer than k points, returns infinity.
   * 
   * @returns {number} Distance to the k-th nearest neighbor or Infinity
   */
  getFurthestDistance(): number {
    return this.items.length === this.k ? this.items[this.items.length - 1].distance : Infinity;
  }

  /**
   * Gets the furthest point in the set of nearest neighbors.
   * 
   * @returns {Point} The furthest point
   */
  getLastPoint(): Point {
    return this.items[this.items.length-1].point;
  }

  /**
   * Returns the current number of points in the set of nearest neighbors.
   * 
   * @returns {number} Number of points in the collection
   */
  getSize(): number {
    return this.items.length;
  }

  /**
   * Gets an array of all points in the set of nearest neighbors.
   * 
   * @returns {Point[]} Array of points
   */
  getPoints(): Point[] {
    return this.items.map(item => item.point);
  }

  /**
   * Gets an array of all records in the set of nearest neighbors.
   * 
   * @returns {Array<{ point: Point; distance: number }>} Array of records
   */
  getNeighbors(): Array<{ point: Point; distance: number }> {
    return [...this.items];
  }
}