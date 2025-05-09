import { DistanceMatrix } from "../../core/data-structures/DistanceMatrix";
import { Database } from "../../core/database/Database";
import { VisualType } from "../../core/enums/VisualType";
import { AlgorithmStep } from "../../core/models/interfaces/AlgorithmStep";
import { Point } from "../../core/models/Point";
import { DistanceMatrixAlgorithm } from "../base/DistanceMatrixAlgorithm";
import { NearestNeighbors } from "../base/NearestNeighbors";

/**
 * Implementation of the k-Nearest Neighbors (k-NN) algorithm for AESA.
 * 
 * AESA (Approximating Eliminating Search Algorithm) is a method that efficiently finds
 * the k closest points to a query point by leveraging pre-computed distances and lower
 * bounds derived from the triangle inequality. This implementation focuses on minimizing
 * the number of distance calculations needed to find the k-NN result.
 * 
 * The algorithm uses the following key optimizations:
 * - Pivot-based search strategy to explore the metric space efficiently
 * - Triangle inequality to establish lower bounds on distances without calculation
 * - Early elimination of points that cannot be among the k nearest neighbors
 * - Adaptive pivot selection that minimizes the expected number of distance calculations
 * 
 * @extends DistanceMatrixAlgorithm
 */
export class AesaKnnAlgorithm extends DistanceMatrixAlgorithm {
  /**
   * Executes the k-NN algorithm for AESA structure.
   * 
   * This method implements the AESA k-NN search algorithm that finds the k nearest neighbors
   * to a query point. It uses a priority queue to maintain the current k nearest points and
   * applies the triangle inequality to eliminate points without calculating their actual distances.
   * 
   * @param {Database} database - The database containing all points
   * @param {DistanceMatrix} distanceMatrix - The distance matrix storing pre-computed distances between points
   * @param {Point} queryPoint - The query point for which to find nearest neighbors
   * @param {number} k - The number of nearest neighbors to find
   * @returns {AsyncGenerator<AlgorithmStep>} A generator yielding algorithm steps for visualization
   */
  public static async *execute(database: Database, distanceMatrix: DistanceMatrix, queryPoint: Point, k: number): AsyncGenerator<AlgorithmStep> {
    /** Points eliminated during the algorithm */
    let eliminatedPoints: Point[] = [];
    /** Points selected as the result of the algorithm */
    let resultPoints: Point[] = [];
    /** Radius currently covering the k nearest neighbors */
    let kRadius = Infinity;
    
    const createStep = this.createStepFactory(database, distanceMatrix, resultPoints, eliminatedPoints);
    const points = database.getDataPoints();

    // Step 0: Algorithm initialization
    yield createStep(0);

    // Step 1: Initialize empty priority queue for k nearest neighbors
    const neighbors = new NearestNeighbors(k);
      
    // Step 2: Initialize set of all points in database
    const remainingPoints = new Set(points);

    yield createStep(1);
    
    // Step 3: Random selection of first pivot
    let nextPivot = Array.from(remainingPoints)[Math.floor(Math.random() * remainingPoints.size)];

    yield createStep(2, {
      activePoints: [nextPivot]
    });
    
    yield createStep(3, {
      activePoints: [nextPivot]
    });

    // Step 4: Main loop - while there are points to process
    while (remainingPoints.size > 0) {
      // Step 5: Set current pivot
      const currentPivot = nextPivot;

      yield createStep(4, {
        activePoints: [currentPivot],
        circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY}]
      });
      
      // Visualization before distance calculation
      yield createStep(5, {
        activePoints: [currentPivot, queryPoint],
        distances: [{ from: queryPoint, to: currentPivot, type: VisualType.UNKNOWN_DISTANCE}],
        circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
      });

      // Step 6: Calculate distance between query and pivot
      const distance = distanceMatrix.addDistance(queryPoint, currentPivot);

      // Visualization after distance calculation
      yield createStep(5, {
        activePoints: [currentPivot, queryPoint],
        distances: [{ from: queryPoint, to: currentPivot, type: VisualType.KNOWN_DISTANCE}],
        circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
      });
      
      // Step 7: Remove pivot from candidate set
      remainingPoints.delete(currentPivot);

      yield createStep(6, {
        activePoints: [currentPivot],
        circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
      });

      yield createStep(7, {
        activePoints: [currentPivot],
        circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
      });
      
      // Step 8: Decide whether to add pivot to results
      if (neighbors.getSize() < k) {
        // Step 9: If we don't have enough neighbors, add pivot regardless of distance
        neighbors.add(currentPivot, distance);
        resultPoints.length = 0;
        resultPoints.push(...neighbors.getPoints());
        kRadius = neighbors.getFurthestDistance();

        yield createStep(8, {
          activePoints: [nextPivot],
          distances: [{ from: queryPoint, to: currentPivot, type: VisualType.INCLUSION }],
          circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
        });
        
        // Step 10: Select next random pivot if points remain
        if (remainingPoints.size > 0) {
          nextPivot = Array.from(remainingPoints)[Math.floor(Math.random() * remainingPoints.size)];
          yield createStep(9, {
            activePoints: [nextPivot],
            circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
          });
        } else {
          yield createStep(9, {
            circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
          });
        }
      } else {
        // If we already have k neighbors, compare with the furthest
        yield createStep(10, {
          activePoints: [currentPivot],
          circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
        });

        kRadius = neighbors.getFurthestDistance();

        yield createStep(11, {
          activePoints: [queryPoint, currentPivot],
          distances: [{ from: queryPoint, to: currentPivot, type: distance < kRadius ? VisualType.INCLUSION : VisualType.ELIMINATION }],
          circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
        });

        // Step 11: If pivot is closer than furthest neighbor, replace it
        if (distance < kRadius) {
          // The furthest neighbor is now eliminated and replaced by current pivot
          eliminatedPoints.push(neighbors.getLastPoint());
          neighbors.add(currentPivot, distance);
          resultPoints.length = 0;
          resultPoints.push(...neighbors.getPoints());
          kRadius = neighbors.getFurthestDistance();

          yield createStep(12, {
            activePoints: [currentPivot],
            distances: [{ from: queryPoint, to: currentPivot, type: VisualType.INCLUSION }],
            circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
          });
        } else {
          // Pivot is too far, eliminate it
          eliminatedPoints.push(currentPivot);
        }
        
        // Step 12: Initialize for finding next pivot
        let minLowerBound = Infinity;
        let foundNextPivot = false;
        
        // Step 13: Create copy of candidate set for safe iteration
        const pointsToCheck = Array.from(remainingPoints);
        
        yield createStep(14, {
          activePoints: [currentPivot],
          circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
        });

        // Process remaining points to find suitable next pivot
        for (const point of pointsToCheck) {
          // Visualization of current processing point
          yield createStep(14, {
            activePoints: [currentPivot, point],
            circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
          });

          // Step 14: Calculate lower bound distance using triangle inequality
          const precomputedDistance = distanceMatrix.getDistance(point.id, currentPivot.id);
          const lowerBound = Math.abs(distance - precomputedDistance);

          // Visualization of lower bound
          yield createStep(15, {
            activePoints: [currentPivot, point, queryPoint],
            distances: [
              { from: currentPivot, to: queryPoint, type: VisualType.KNOWN_DISTANCE },
              { from: currentPivot, to: point,      type: VisualType.KNOWN_DISTANCE },
              { from: queryPoint,   to: point,      type: VisualType.UNKNOWN_DISTANCE }
            ],
            circles: [
              { center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY },
              { center: queryPoint, radius: lowerBound, type: VisualType.LOWER_BOUND  },
            ]
          });

          // Visualization of comparing lower bound with k-NN radius
          yield createStep(16, {
            activePoints: [currentPivot, point, queryPoint],
            distances: [
              { from: currentPivot, to: queryPoint, type: VisualType.KNOWN_DISTANCE },
              { from: currentPivot, to: point, type: VisualType.KNOWN_DISTANCE },
              { from: queryPoint, to: point, type: VisualType.UNKNOWN_DISTANCE }
            ],
            circles: [
              { center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY },
              { center: queryPoint, radius: lowerBound, type: lowerBound > kRadius ?  VisualType.ELIMINATION : VisualType.INCLUSION }
            ]
          });
          
          // Step 15: If lower bound is greater than distance of kth neighbor, we can eliminate the point
          if (lowerBound > kRadius) {
            remainingPoints.delete(point);
            eliminatedPoints.push(point);

            // Visualization of point elimination
            yield createStep(17, {
              activePoints: [queryPoint, currentPivot],
              distances: [
                { from: currentPivot, to: queryPoint, type: VisualType.KNOWN_DISTANCE },
                { from: currentPivot, to: point, type: VisualType.KNOWN_DISTANCE },
                { from: queryPoint, to: point, type: VisualType.UNKNOWN_DISTANCE }
              ],
              circles: [
                { center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY },
                { center: queryPoint, radius: lowerBound, type: VisualType.ELIMINATION }
              ]
            });
          } 
          // Step 16: Otherwise update minimum lower bound and set new pivot
          else {
            // Visualization of comparing lower bounds
            yield createStep(18, {
              activePoints: [queryPoint, point, ...(nextPivot.id !== currentPivot.id ? [nextPivot] : [])],
              circles: [
                { center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY },
                { center: queryPoint, radius: lowerBound, type: lowerBound < minLowerBound ? VisualType.INCLUSION : VisualType.ELIMINATION },
                { center: queryPoint, radius: minLowerBound, type: VisualType.LOWER_BOUND}
              ]
            });

            // Update minimum lower bound and select new pivot
            if (lowerBound < minLowerBound) {
              minLowerBound = lowerBound;

              // Visualization of minimum lower bound update
              yield createStep(19, {
                activePoints: [...(nextPivot.id !== currentPivot.id ? [nextPivot] : [])],
                circles: [
                  { center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY},
                  { center: queryPoint, radius: minLowerBound, type: VisualType.LOWER_BOUND}
                ]
              });

              // Set new pivot
              nextPivot = point;
              foundNextPivot = true;

              // Visualization of new pivot
              yield createStep(20, {
                activePoints: [nextPivot],
                circles: [
                  { center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY},
                  { center: queryPoint, radius: minLowerBound, type: VisualType.LOWER_BOUND}
                ]
              });
            }
          }
        }

        // Visualization after processing all remaining points
        yield createStep(22, {
          circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
        });
        
        // Step 17: If no new pivot found, randomly select from remaining points
        if (!foundNextPivot && remainingPoints.size > 0) {
          nextPivot = Array.from(remainingPoints)[Math.floor(Math.random() * remainingPoints.size)];
        }
      }
    }

    // Visualization after completing main loop
    yield createStep(24, {
      circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
    });
      
    // Final visualization with result
    yield createStep(25, {
      circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
    });
  }
}