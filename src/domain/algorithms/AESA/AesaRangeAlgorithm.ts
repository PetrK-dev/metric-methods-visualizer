import { DistanceMatrix } from "../../core/data-structures/DistanceMatrix";
import { Database } from "../../core/database/Database";
import { VisualType } from "../../core/enums/VisualType";
import { AlgorithmStep } from "../../core/models/interfaces/AlgorithmStep";
import { Point } from "../../core/models/Point";
import { DistanceMatrixAlgorithm } from "../base/DistanceMatrixAlgorithm";

/**
 * Implementation of the range query algorithm for AESA.
 * 
 * AESA (Approximating Eliminating Search Algorithm) efficiently finds all points within
 * a specified radius r from a query point. This implementation utilizes pre-computed
 * distances and lower bounds derived from the triangle inequality to minimize the number
 * of distance calculations required to complete the range search.
 * 
 * The algorithm employs the following key techniques:
 * - Pivot-based exploration of the metric space
 * - Triangle inequality to establish lower bounds on distances
 * - Early elimination of points that cannot be in the result set
 * - Adaptive pivot selection to minimize expected distance calculations
 * 
 * @extends DistanceMatrixAlgorithm
 */
export class AesaRangeAlgorithm extends DistanceMatrixAlgorithm {
  /**
   * Executes the range query algorithm for AESA structure.
   * 
   * This method implements the AESA range search algorithm that finds all points within
   * a specified radius from a query point. It employs the triangle inequality to eliminate
   * points without calculating their actual distances when they are guaranteed to be outside
   * the search radius.
   * 
   * @param {Database} database - The database containing all points
   * @param {DistanceMatrix} distanceMatrix - The distance matrix storing pre-computed distances between points
   * @param {Point} queryPoint - The query point for which to find points within the specified radius
   * @param {number} radius - The search radius defining the range query
   * @returns {AsyncGenerator<AlgorithmStep>} A generator yielding algorithm steps for visualization
   */
  public static async *execute(database: Database, distanceMatrix: DistanceMatrix, queryPoint: Point, radius: number): AsyncGenerator<AlgorithmStep> {
    /** Points eliminated during the algorithm */
    let eliminatedPoints: Point[] = [];
    /** Points selected as the result of the algorithm */
    let resultPoints: Point[] = [];
    
    const createStep = this.createStepFactory(database, distanceMatrix, resultPoints, eliminatedPoints);
    const points = database.getDataPoints();
    
    // Step 0: Algorithm initialization with query circle visualization
    yield createStep(0, {
      circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY }]
    });

    // Step 1: Initialize empty result set (already created at the beginning)
    // Step 2: Initialize set of all points in database
    let remainingPoints = new Set(points);

    yield createStep(1, {
      circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY }]
    });
    
    // Step 3: Random selection of first pivot
    let nextPivot = Array.from(remainingPoints)[Math.floor(Math.random() * remainingPoints.size)];

    yield createStep(2, {
      activePoints: [nextPivot],
      circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY }]
    });
    
    yield createStep(3, {
      activePoints: [nextPivot],
      circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY }]
    });

    // Step 4: Main loop - while there are points to process
    while (remainingPoints.size > 0) {
      // Step 5: Set current pivot
      const currentPivot = nextPivot;

      yield createStep(4, {
        activePoints: [currentPivot],
        circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY }]
      });

      // Visualization before distance calculation
      yield createStep(5, {
        activePoints: [currentPivot, queryPoint],
        distances: [{ from: queryPoint, to: currentPivot, type: VisualType.UNKNOWN_DISTANCE}],
        circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY }]
      });
      
      // Step 6: Calculate distance between query and pivot
      const distance = distanceMatrix.addDistance(queryPoint, currentPivot);

      // Visualization after distance calculation
      yield createStep(5, {
        activePoints: [currentPivot, queryPoint],
        distances: [{ from: queryPoint, to: currentPivot, type: VisualType.KNOWN_DISTANCE}],
        circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY }]
      });

      // Remove current pivot from candidate set
      remainingPoints.delete(currentPivot);
      
      yield createStep(6, {
        activePoints: [currentPivot],
        circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY }]
      });

      // Step 7: Visualization of comparing distance with query radius
      yield createStep(7, {
        activePoints: [currentPivot, queryPoint],
        distances: [{ from: queryPoint, to: currentPivot, type: distance <= radius ? VisualType.INCLUSION : VisualType.ELIMINATION}],
        circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY }]
      });

      // Step 8: If distance is less than or equal to radius, add pivot to results
      if (distance <= radius) {
        resultPoints.push(currentPivot);

        yield createStep(8, {
          activePoints: [currentPivot],
          circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY }]
        });
      } else {
        // Pivot is not in result, add to eliminated points
        eliminatedPoints.push(currentPivot);
      }

      // Step 9: Initialize for finding next pivot
      let minLowerBound = Infinity;
      let foundNextPivot = false;
      
      // Step 10: Create copy of candidate set for safe iteration
      const pointsToCheck = Array.from(remainingPoints);
      
      yield createStep(10, {
        activePoints: [currentPivot],
        circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY }]
      });

      // Process remaining points to find suitable next pivot
      for (const point of pointsToCheck) {
        // Visualization of current processing point
        yield createStep(10, {
          activePoints: [currentPivot, point],
          circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY }]
        });

        // Step 11: Calculate lower bound distance using triangle inequality
        const distPointToPivot = distanceMatrix.getDistance(point.id, currentPivot.id);
        const lowerBound = Math.abs(distance - distPointToPivot);

        // Visualization of lower bound
        yield createStep(11, {
          activePoints: [currentPivot, point, queryPoint],
          distances: [
            { from: currentPivot, to: queryPoint, type: VisualType.KNOWN_DISTANCE},
            { from: currentPivot, to: point,      type: VisualType.KNOWN_DISTANCE },
            { from: queryPoint,   to: point,      type: VisualType.UNKNOWN_DISTANCE }
          ],
          circles: [
            { center: queryPoint, radius: lowerBound, type: VisualType.LOWER_BOUND },
            { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
          ]
        });
        
        // Step 12: Visualization of comparing lower bound with query radius
        yield createStep(12, {
          activePoints: [currentPivot, point, queryPoint],
          distances: [
            { from: currentPivot, to: queryPoint, type: VisualType.KNOWN_DISTANCE},
            { from: currentPivot, to: point,      type: VisualType.KNOWN_DISTANCE },
            { from: queryPoint,   to: point,      type: VisualType.UNKNOWN_DISTANCE }
          ],
          circles: [
            { center: queryPoint, radius: lowerBound, type: lowerBound > radius ?  VisualType.ELIMINATION : VisualType.INCLUSION },
            { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
          ]
        });

        // Step 13: If lower bound is greater than radius, eliminate the point
        if (lowerBound > radius) {
          remainingPoints.delete(point);
          eliminatedPoints.push(point);

          // Visualization of point elimination
          yield createStep(13, {
            activePoints: [currentPivot, queryPoint],
            distances: [
              { from: currentPivot, to: queryPoint, type: VisualType.KNOWN_DISTANCE},
              { from: currentPivot, to: point,      type: VisualType.KNOWN_DISTANCE },
              { from: queryPoint,   to: point,      type: VisualType.UNKNOWN_DISTANCE }
            ],
            circles: [
              { center: queryPoint, radius: lowerBound, type: VisualType.ELIMINATION },
              { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
            ]
          });
        } else {
          // Step 14: Visualization of comparing lower bounds
          yield createStep(14, {
            activePoints: [queryPoint, point, ...(nextPivot.id !== currentPivot.id ? [nextPivot] : [])],
            circles: [
              { center: queryPoint, radius: radius, type: VisualType.RANGE_QUERY },
              { center: queryPoint, radius: lowerBound, type: lowerBound < minLowerBound ? VisualType.INCLUSION : VisualType.ELIMINATION },
              { center: queryPoint, radius: minLowerBound, type: VisualType.LOWER_BOUND}
            ]
          });

          // Step 15: Update minimum lower bound and select new pivot
          if (lowerBound < minLowerBound) {
            minLowerBound = lowerBound;

            // Visualization of minimum lower bound update
            yield createStep(15, {
              activePoints: [...(nextPivot.id !== currentPivot.id ? [nextPivot] : [])],
              circles: [
                { center: queryPoint, radius: radius, type: VisualType.RANGE_QUERY},
                { center: queryPoint, radius: minLowerBound, type: VisualType.LOWER_BOUND}
              ]
            });

            // Set new pivot
            nextPivot = point;
            foundNextPivot = true;

            // Visualization of new pivot
            yield createStep(16, {
              activePoints: [nextPivot],
              circles: [
                { center: queryPoint, radius: radius, type: VisualType.RANGE_QUERY},
                { center: queryPoint, radius: minLowerBound, type: VisualType.LOWER_BOUND}
              ]
            });   
          }
        }
      }

      // Visualization after processing all remaining points
      yield createStep(18, {
        circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY }]
      });
      
      // Step 16: If no new pivot found, randomly select from remaining points
      if (!foundNextPivot && remainingPoints.size > 0) {
        nextPivot = Array.from(remainingPoints)[Math.floor(Math.random() * remainingPoints.size)];
      }
    }

    // Visualization after completing main loop
    yield createStep(19, {
      circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY }]
    });
    
    // Step 17: Final visualization with result
    yield createStep(20, {
      circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY }]
    });
  }
}