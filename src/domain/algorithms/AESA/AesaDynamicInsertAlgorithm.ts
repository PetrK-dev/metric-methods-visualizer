import { DistanceMatrix } from "../../core/data-structures/DistanceMatrix";
import { Database } from "../../core/database/Database";
import { PointType } from "../../core/enums/PointType";
import { VisualType } from "../../core/enums/VisualType";
import { AlgorithmStep } from "../../core/models/interfaces/AlgorithmStep";
import { Point } from "../../core/models/Point";
import { DistanceMatrixAlgorithm } from "../base/DistanceMatrixAlgorithm";

/**
 * Implementation of the dynamic insertion algorithm for AESA (Approximating Eliminating Search Algorithm) structure.
 * 
 * AESA requires calculating distances between the newly inserted point and all existing points
 * in the database to maintain a complete distance matrix. This matrix is the core of AESA's
 * efficiency during search operations, as it enables the use of pre-computed distances.
 * 
 * The algorithm performs the following steps:
 * 1. Initialize the process
 * 2. For each point in the database, calculate the distance to the query point
 * 3. Add all calculated distances to the distance matrix
 * 4. Convert the query point type to a regular object type
 * 5. Add the point to the database
 * 
 * @extends DistanceMatrixAlgorithm
 */
export class AesaDynamicInsertAlgorithm extends DistanceMatrixAlgorithm {
  /**
   * Executes the dynamic insertion algorithm for AESA structure.
   * 
   * This method generates a sequence of algorithm steps that demonstrate how a new point
   * is inserted into an AESA structure. For each existing point in the database, it calculates
   * the distance to the new point and adds it to the distance matrix. Finally, it adds the new
   * point to the database.
   * 
   * The implementation follows the pseudocode:
   * ```
   * AESA_Dynamic_Insert(DB, q):
   *   for each o_i ∈ DB do
   *     count distance(o, q)
   *   end for
   *   DB = DB ∪ {q}
   * ```
   * 
   * @param {Database} database - The database containing all existing points
   * @param {DistanceMatrix} distanceMatrix - The distance matrix storing pre-computed distances between points
   * @param {Point} queryPoint - The new point to be inserted into the database
   * @returns {AsyncGenerator<AlgorithmStep>} A generator yielding algorithm steps for visualization
   */
  public static async *execute(database: Database, distanceMatrix: DistanceMatrix, queryPoint: Point): AsyncGenerator<AlgorithmStep> {
    // Create a step factory for the algorithm - only needed once at the beginning
    let resultPoints: Point[] = [];
    const createStep = this.createStepFactory(database, distanceMatrix, resultPoints);
    const points = database.getDataPoints();

    // Step 0: Algorithm initialization
    yield createStep(0);

    // Step 1: Basic state - prepare for distance calculations
    yield createStep(1);
    
    // Iterate through all points in the database and calculate distances
    for (const point of points) {
      // Step 1 (repeated for each point) - activate the point before calculating the distance
      yield createStep(1, {
        activePoints: [point, queryPoint],
      });

      // Prepare to calculate the distance - highlight the distance that will be calculated
      yield createStep(2, {
        activePoints: [point, queryPoint],
        distances: [{ from: point, to: queryPoint, type: VisualType.UNKNOWN_DISTANCE }]
      });

      // Calculate the distance and add it to the distance matrix
      distanceMatrix.addDistance(point, queryPoint);

      // Step 2: Display the calculated distance
      yield createStep(2, {
        activePoints: [point, queryPoint],
        distances: [{ from: point, to: queryPoint, type: VisualType.KNOWN_DISTANCE }]
      });
    }

    // Step 3: Complete the calculation of all distances
    yield createStep(3);

    // Change the point type from query to object and update it in the database
    queryPoint.type = PointType.OBJECT;
    database.updatePoint(queryPoint);
    
    // Step 4: Highlight the point after insertion
    yield createStep(4, {
      activePoints: [queryPoint]
    });

    // Step 5: Final result - add the point to the result set
    resultPoints.push(queryPoint);
    yield createStep(5);
  }
}