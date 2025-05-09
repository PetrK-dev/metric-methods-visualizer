import { IDataStructure } from "../../core/data-structures/IDataStructure";
import { Database } from "../../core/database/Database";
import { VisualType } from "../../core/enums/VisualType";
import { AlgorithmStep } from "../../core/models/interfaces/AlgorithmStep";
import { Point } from "../../core/models/Point";

/**
 * Base class for all metric method algorithms.
 * Provides common methods for creating algorithm steps
 * that are used for visualization.
 */
export class BaseAlgorithm {
  /**
   * Creates an algorithm step - original method for backward compatibility.
   * 
   * @param {number} stepNumber - Step number in the algorithm
   * @param {Database} database - Database of points
   * @param {IDataStructure<any>} dataStructure - Algorithm data structure
   * @param {Object} options - Optional parameters for visualization
   * @param {Point[]} options.activePoints - Active points in this step
   * @param {Point[]} options.eliminatedPoints - Eliminated points
   * @param {Point[]} options.resultPoints - Result points of the algorithm
   * @param {Array} options.distances - Distances between points for visualization
   * @param {Array} options.circles - Circles for visualization
   * @returns {AlgorithmStep} Algorithm step for visualization
   */
  protected static createStep(
    stepNumber: number,
    database: Database, 
    dataStructure: IDataStructure<any>,
    options: {
      activePoints?: Point[];
      eliminatedPoints?: Point[];
      resultPoints?: Point[];
      distances?: { 
        from: Point, 
        to: Point,
        type?: VisualType,
      }[];
      circles?: { 
        center: Point, 
        radius: number,
        type?: VisualType,
      }[];
    } = {}
  ): AlgorithmStep {
    return {
      stepNumber,
      database: database,
      activePoints: options.activePoints || [],
      eliminatedPoints: options.eliminatedPoints || [],
      resultPoints: options.resultPoints || [],
      distances: options.distances || [],
      circles: options.circles || [],
      dataStructure
    };
  }

  /**
   * Factory method for creating algorithm steps with optimization for usage.
   * Closes over (closures) the database and data structure, which simplifies
   * creating steps in algorithm implementations.
   * 
   * @param {Database} database - Database of points
   * @param {IDataStructure<any>} dataStructure - Algorithm data structure
   * @param {Point[]} resultPoints - Reference to the array of result points
   * @param {Point[]} eliminatedPoints - Reference to the array of eliminated points
   * @returns {Function} Function for creating algorithm steps
   */
  protected static createStepFactory(database: Database, dataStructure: IDataStructure<any>, resultPoints: Point[], eliminatedPoints: Point[] = []) {
    /**
     * Creates an algorithm step with predefined database and data structure.
     * 
     * @param {number} stepNumber - Step number in the algorithm
     * @param {Object} options - Optional parameters for visualization
     * @param {Point[]} options.activePoints - Active points in this step
     * @param {Array} options.distances - Distances between points for visualization
     * @param {Array} options.circles - Circles for visualization
     * @returns {AlgorithmStep} Algorithm step for visualization
     */
    return (
      stepNumber: number,
      options: {
        activePoints?: Point[];
        distances?: { 
          from: Point, 
          to: Point,
          type?: VisualType,
        }[];
        circles?: { 
          center: Point, 
          radius: number,
          type?: VisualType,
        }[];
      } = {}
    ): AlgorithmStep => {
      return {
        stepNumber,
        database: database,
        dataStructure,
        activePoints: options.activePoints || [],
        eliminatedPoints: eliminatedPoints,
        resultPoints: resultPoints,
        distances: options.distances || [],
        circles: options.circles || []
      };
    };
  }
}