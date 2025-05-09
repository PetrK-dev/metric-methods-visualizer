import { IDataStructure } from "../../core/data-structures/IDataStructure";
import { Database } from "../../core/database/Database";
import { AlgorithmStep } from "../../core/models/interfaces/AlgorithmStep";
import { Point } from "../../core/models/Point";
import { BaseAlgorithm } from "./BaseAlgorithm";

/**
 * Default algorithm that is used as a baseline implementation
 * when a specific algorithm implementation is not available.
 * This algorithm serves as a foundation for developing new metric methods.
 */
export class DefaultAlgorithm extends BaseAlgorithm {

    /**
   * Executes the default algorithm.
   * Sequentially goes through the pseudocode lines.
   * 
   * @param {Database} database - Database of points
   * @param {IDataStructure<any>} dataStructure - Data structure
   * @param {Point} queryPoint - The query point
   * @returns {AsyncGenerator<AlgorithmStep>} Generator of algorithm steps
   */
    public static async* execute(
      database: Database,
      dataStructure: IDataStructure<any>,
      queryPoint: Point
    ): AsyncGenerator<AlgorithmStep> {
      const resultPoints: Point[] = [];
      const eliminatedPoints: Point[] = [];
      const createStep = this.createStepFactory(database, dataStructure, resultPoints, eliminatedPoints);
      
      // Simple implementation - just one step
      for(let i = 0; i < 4; i++) {
        yield createStep(i, {
            activePoints: [queryPoint]
          });
      }
    }
  }


  /**
   * Default pseudocode for a method under development.
   * Displayed when the current method doesn't have a full implementation yet
   * and uses the default demonstration algorithm.
   */
  export const PSEUDOCODE_DEFAULT = [
    '// Default pseudocode for a method in development',
    '// ------------------------------------',
    '// This pseudocode is displayed because the current',
    '// method doesnt have a full implementation yet and uses',
    '// the default demonstration algorithm.',
    ];