import { Database } from "../database/Database";
import { VisualType } from "../enums/VisualType";
import { Point } from "../models/Point";
import { IDataStructure, DataStructureType } from "./IDataStructure";

/**
 * Default data structure implementation for metric space.
 * Implements the IDataStructure interface.
 * Serves as a fallback/default structure when no specific structure is needed.
 */
export class DefaultDataStructure implements IDataStructure<any> {
  
  /**
   * Initializes the data structure for algorithms.
   * Performs basic initialization without any specific operations.
   * 
   * @param {Database} database - The database containing points
   */
  public initializeBase(database: Database): void {
    // Basic initialization
    console.log("Default data structure initialized");
  }
  
  /**
   * Creates a deep copy of the data structure.
   * 
   * @returns {IDataStructure<any>} A new instance with copied data
   */
  public clone(): IDataStructure<any> {
    return new DefaultDataStructure();
  }
  
  /**
   * Implementation of the method from IDataStructure.
   * Returns itself as the underlying structure for data access.
   * 
   * @returns {any} Instance of this data structure
   */
  public getStructure() {
    return this;
  }
  
  /** Type identifier for polymorphic operations */
  get structureType(): DataStructureType {
    return DataStructureType.DEFAULT;
  }

  /**
   * Returns visualization data for initial state of the structure.
   * For the default structure, returns empty arrays as there's nothing to visualize.
   * 
   * @returns {Object} Object containing empty arrays for distances and circles
   */
  getInitialVisualization(): { 
    distances: Array<{ from: Point; to: Point; type: VisualType; }>; 
    circles: Array<{ center: Point; radius: number; type: VisualType; }>; 
  } {
    return {
      distances: [], // Empty array - no distances to display
      circles: []    // No circles to display
    };
  }
}