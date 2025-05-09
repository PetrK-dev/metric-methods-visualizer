import { DistanceMatrix } from "../../core/data-structures/DistanceMatrix";
import { Database } from "../../core/database/Database";
import { PointType } from "../../core/enums/PointType";
import { VisualType } from "../../core/enums/VisualType";
import { AlgorithmStep } from "../../core/models/interfaces/AlgorithmStep";
import { Point } from "../../core/models/Point";
import { DistanceMatrixAlgorithm } from "../base/DistanceMatrixAlgorithm";

/**
 * Implementation of the dynamic insertion algorithm for the LAESA method.
 * LAESA (Linear AESA) uses pivot points to optimize metric searching while
 * reducing memory complexity compared to AESA from O(n²) to O(kn), where
 * k is the number of pivots and n is the number of objects in the database.
 * 
 * This algorithm calculates distances between the inserted point and all pivot points
 * to maintain the distance matrix structure used by the LAESA method.
 */
export class LaesaDynamicInsertAlgorithm extends DistanceMatrixAlgorithm {
  /**
   * Executes the dynamic insertion algorithm for the LAESA method.
   * 
   * The algorithm performs the following steps:
   * 1. Initialize the data structures
   * 2. For each pivot point, calculate the distance to the query point
   * 3. Store these distances in the distance matrix
   * 4. Change the query point type to an object and update it in the database
   * 
   * @param {Database} database - The database containing points and pivots
   * @param {DistanceMatrix} distanceMatrix - The distance matrix to store calculated distances
   * @param {Point} queryPoint - The point to be inserted into the structure
   * @returns {AsyncGenerator<AlgorithmStep>} A generator of algorithm steps for visualization
   */
  public static async *execute(
    database: Database, 
    distanceMatrix: DistanceMatrix, 
    queryPoint: Point
  ): AsyncGenerator<AlgorithmStep> {
    // Initialize the array for result points
    let resultPoints: Point[] = [];
    // Create a factory for generating visualization steps
    const createStep = this.createStepFactory(database, distanceMatrix, resultPoints);
    // Get pivot points from the database
    const pivots = database.getPivots();
    
    // Step 0: Initialize the algorithm
    yield createStep(0);
    
    // Step 1: Prepare to calculate distances to pivots
    yield createStep(1);
    
    // Calculate distances to all pivots
    for (const pivot of pivots) {
      // Highlight the current pivot and query point
      yield createStep(1, {
        activePoints: [pivot, queryPoint],
      });
      
      // Visualize preparing to calculate the distance (unknown distance)
      yield createStep(2, {
        activePoints: [pivot, queryPoint],
        distances: [{ from: pivot, to: queryPoint, type: VisualType.UNKNOWN_DISTANCE}]
      });
      
      // Calculate the distance and store it in the matrix
      distanceMatrix.addDistance(pivot, queryPoint);
      
      // Visualize the calculated distance (known distance)
      yield createStep(2, {
        activePoints: [pivot, queryPoint],
        distances: [{ from: pivot, to: queryPoint, type: VisualType.KNOWN_DISTANCE}]
      });
    }
    
    // Step 3: Complete the calculation of all distances
    yield createStep(3);
    
    // Change the point type to an object and update it in the database
    queryPoint.type = PointType.OBJECT;
    database.updatePoint(queryPoint);
    
    // Step 4: Highlight the point after insertion
    yield createStep(4, {
      activePoints: [queryPoint]
    });
    
    // Add the point to the result and complete the algorithm
    resultPoints.push(queryPoint);
    yield createStep(5);
  }
}