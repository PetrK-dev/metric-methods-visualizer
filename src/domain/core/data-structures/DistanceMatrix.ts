import { Database } from "../database/Database";
import { VisualType } from "../enums/VisualType";
import { AlgorithmStep } from "../models/interfaces/AlgorithmStep";
import { Point } from "../models/Point";
import { IDataStructure, DataStructureType } from "./IDataStructure";

/**
 * Class representing a distance matrix between points in a metric space.
 * Implements the IDataStructure interface and provides an efficient way
 * to store and access pre-computed distances between points.
 * Used primarily in AESA and LAESA algorithms.
 */
export class DistanceMatrix implements IDataStructure<DistanceMatrix> {
    /** Type identifier for polymorphic operations */
    readonly structureType: DataStructureType = DataStructureType.DISTANCE_MATRIX;
    
    /** Map for storing distances, where the key is a string in the format "id1:id2" */
    private matrix: Map<string, number> = new Map();
    
    /** Function for calculating distance between two points */
    private distanceFunction: (p1: Point, p2: Point) => number;
  
    /**
     * Creates a new instance of the distance matrix.
     * 
     * @param {Function} distanceFunction - Function to calculate distance between points
     */
    constructor(distanceFunction: (p1: Point, p2: Point) => number) {
      this.distanceFunction = distanceFunction;
    }
  
    /**
     * Generates a standardized key for storing the distance between two points.
     * Ensures that the distance between points A and B is stored under the same key
     * regardless of point order (due to metric symmetry).
     * 
     * @param {number} id1 - ID of the first point
     * @param {number} id2 - ID of the second point
     * @returns {string} Key in the format "smaller_id:larger_id"
     * @private
     */
    private getMatrixKey(id1: number, id2: number): string {
      return id1 <= id2 ? `${id1}:${id2}` : `${id2}:${id1}`;
    }
  
    /**
     * Calculates and stores the distance between two points.
     * 
     * @param {Point} point1 - First point
     * @param {Point} point2 - Second point
     * @returns {number} Calculated distance between points
     */
    public addDistance(point1: Point, point2: Point): number {
      // Calculate distance using the provided function
      const distance = this.distanceFunction(point1, point2);
      const key = this.getMatrixKey(point1.id, point2.id);
      
      // Store the distance in the matrix
      this.matrix.set(key, distance);
      
      return distance;
    }
  
    /**
     * Returns the stored distance between two points by their IDs.
     * 
     * @param {number} pointId1 - ID of the first point
     * @param {number} pointId2 - ID of the second point
     * @returns {number} Distance between points, or -1 if distance is not stored
     */
    public getDistance(pointId1: number, pointId2: number): number {
      const key = this.getMatrixKey(pointId1, pointId2);
      const distance = this.matrix.get(key);
      
      if (distance !== undefined) {
        return distance;
      }
      
      return -1; // Indication that the distance is not stored
    }
  
    /**
     * Checks if the distance between two points is stored in the matrix.
     * 
     * @param {number} pointId1 - ID of the first point
     * @param {number} pointId2 - ID of the second point
     * @returns {boolean} True if the distance exists, otherwise false
     */
    public hasDistance(pointId1: number, pointId2: number): boolean {
      const key = this.getMatrixKey(pointId1, pointId2);
      return this.matrix.has(key);
    }

    /**
     * Returns all stored distances from a source point to target points.
     * 
     * @param {number} sourceId - ID of the source point
     * @param {Point[]} targetPoints - Array of target points
     * @returns {Array<{targetPoint: Point, distance: number}>} Array of objects containing point and its distance
     */
    public getDistancesForPoints(sourceId: number, targetPoints: Point[]): Array<{ targetPoint: Point, distance: number }> {
      const result: Array<{ targetPoint: Point, distance: number }> = [];
      
      for (const point of targetPoints) {
        if (point.id === sourceId) continue; // Skip itself
        
        const distance = this.getDistance(sourceId, point.id);
        if (distance >= 0) { // Distance exists (not -1)
          result.push({ targetPoint: point, distance });
        }
      }
      
      return result;
    }

    /**
     * Clears all stored distances from the matrix.
     */
    public clear(): void {
      this.matrix.clear();
    }
  
    /**
     * Initializes the distance matrix for offline visualization mode.
     * Calculates and stores all relevant distances including the query point.
     * 
     * @param {Database} database - Database of points
     */
    initializeFull(database: Database): void {
      this.clear();
      const points = database.getDataWithQuery();
      console.log("Points: ", points);
      // Get pivots (if they exist)
      const pivots = database.getPivots();
      console.log("Pivots: ", pivots);
      if (pivots.length === 0) {
        // We're in mode without pivots (AESA) - calculate all distances
        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) {
            this.addDistance(points[i], points[j]);
          }
        }
      } else {
        // We're in pivot mode (LAESA) - calculate only distances to pivots
        for (const pivot of pivots) {
          for (const point of points) {
            if (pivot.id !== point.id) {
              this.addDistance(pivot, point);
            }
          }
        }
      }
    }

    /**
     * Initializes the distance matrix for algorithms.
     * Calculates and stores all basic distances without the query point.
     * 
     * @param {Database} database - Database of points
     */
    initializeBase(database: Database): void {
      this.clear();
      const points = database.getDataPoints();
      
      // Get pivots (if they exist)
      const pivots = database.getPivots();
      
      if (pivots.length === 0) {
        // We're in mode without pivots (AESA) - calculate all distances
        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) {
            this.addDistance(points[i], points[j]);
          }
        }
      } else {
        // We're in LAESA mode - calculate only distances from pivots to other points
        for (const pivot of pivots) {
          for (const point of points) {
            if (pivot.id !== point.id) {
              this.addDistance(pivot, point);
            }
          }
        }
      }
    }

    /**
     * Implementation of the method from IDataStructure.
     * Returns itself as the structure for data access.
     * 
     * @returns {DistanceMatrix} Instance of this distance matrix
     */
    getStructure(): DistanceMatrix {
      return this;
    }

    /**
     * Creates a deep copy of the distance matrix.
     * 
     * @returns {IDataStructure<DistanceMatrix>} New instance with copied data
     */
    clone(): IDataStructure<DistanceMatrix> {
        const clone = new DistanceMatrix(this.distanceFunction);
        this.matrix.forEach((value, key) => {
          clone.matrix.set(key, value);
        });
      return clone;
    }

    /**
     * Returns visualization data for the initial state of the structure.
     * For the distance matrix, returns empty arrays as initial visualization.
     * 
     * @returns {Object} Object containing empty arrays for distances and circles
     */
    getInitialVisualization(): { distances: any[], circles: any[] } {
      return {
        distances: [], // Empty array - no distances to display
        circles: []    // No circles to display
      };
    }
}