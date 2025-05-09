import { DistanceMatrix } from "../../core/data-structures/DistanceMatrix";
import { Database } from "../../core/database/Database";
import { VisualType } from "../../core/enums/VisualType";
import { AlgorithmStep } from "../../core/models/interfaces/AlgorithmStep";
import { Point } from "../../core/models/Point";
import { DistanceMatrixAlgorithm } from "../base/DistanceMatrixAlgorithm";
import { NearestNeighbors } from "../base/NearestNeighbors";

/**
 * Implementation of the k-nearest neighbors (kNN) algorithm for the LAESA method.
 * 
 * LAESA (Linear AESA) is a memory-optimized variant of AESA that uses a subset of pivot points
 * to reduce memory complexity from O(n²) to O(kn), where k is the number of pivots and
 * n is the number of objects in the database.
 * 
 * This algorithm finds the k points that are closest to the query point using pre-computed
 * distances to pivot points and the triangle inequality property for efficient filtering of candidates.
 * The key optimization of LAESA kNN is the ability to stop processing when the lower bound
 * of the remaining points exceeds the distance to the current k-th nearest neighbor.
 */
export class LaesaKnnAlgorithm extends DistanceMatrixAlgorithm {
  /**
   * Executes the kNN algorithm for the LAESA method.
   * 
   * Algorithm overview:
   * 1. First process all pivot points and add them to the result set if they qualify
   * 2. Compute lower bounds for all non-pivot points using triangle inequality
   * 3. Sort non-pivot points by their lower bounds and process them in ascending order
   * 4. Stop early when the lower bound of the remaining points exceeds the distance to the k-th nearest neighbor
   * 
   * @param {Database} database - The database containing points and pivots
   * @param {DistanceMatrix} distanceMatrix - The distance matrix with pre-computed distances
   * @param {Point} queryPoint - The query point for which to find nearest neighbors
   * @param {number} k - The number of nearest neighbors to find
   * @returns {AsyncGenerator<AlgorithmStep>} A generator of algorithm steps for visualization
   */
  public static async *execute(
    database: Database, 
    distanceMatrix: DistanceMatrix, 
    queryPoint: Point, 
    k: number
  ): AsyncGenerator<AlgorithmStep> {
    // Collections for tracking eliminated and result points
    let eliminatedPoints: Point[] = [];
    let resultPoints: Point[] = [];
    
    // Create factory for generating visualization steps
    const createStep = this.createStepFactory(database, distanceMatrix, resultPoints, eliminatedPoints);
    // Get all points and pivots from the database
    const points = database.getDataPoints();
    const pivots = database.getPivots();
    
    // Step 0: Algorithm initialization
    yield createStep(0);
          
    // Step 1: Initialize empty priority queue for k-nearest neighbors
    const neighbors = new NearestNeighbors(k);
    // Current radius determining the boundary for k-nearest neighbors
    let kRadius = Infinity;

    yield createStep(1);
    
    // Step 2: Start processing pivot points
    yield createStep(2);

    /**
     * Phase 1: Processing pivots
     * In this phase, we calculate distances from the query point to all pivots
     * and add them to the candidate set of k-nearest neighbors.
     */
    for (const pivot of pivots) {
      // Visualize pivot activation
      yield createStep(2, {
        activePoints: [queryPoint, pivot],
        circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
      });

      // Visualize preparing to calculate distance to pivot
      yield createStep(3, {
        activePoints: [queryPoint, pivot],
        distances: [{ from: queryPoint, to: pivot, type: VisualType.UNKNOWN_DISTANCE}],
        circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
      });

      // Calculate distance between query point and pivot
      const distance = distanceMatrix.addDistance(queryPoint, pivot);
      
      // Visualize calculated distance
      yield createStep(3, {
        activePoints: [queryPoint, pivot],
        distances: [{ from: queryPoint, to: pivot, type: VisualType.KNOWN_DISTANCE }],
        circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
      });

      // Step 4: Check adding pivot to k-nn set
      yield createStep(4, {
        activePoints: [pivot],
        circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
      });

      // If we don't have enough neighbors yet, add pivot without further checks
      if (neighbors.getSize() < k) {
        // Add pivot to collection and results
        neighbors.add(pivot, distance);
        resultPoints.length = 0;
        resultPoints.push(...neighbors.getPoints());
        // Update k-nn radius
        kRadius = neighbors.getFurthestDistance();
        
        // Visualize adding pivot
        yield createStep(5, {
          activePoints: [pivot],
          distances: [{ from: queryPoint, to: pivot, type: VisualType.INCLUSION }],
          circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
        });
      } else {
        // We already have k neighbors, check if pivot is better than any of them
        yield createStep(6, {
          activePoints: [pivot],
          circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
        });

        // Update k-nn radius for current neighbor set
        kRadius = neighbors.getFurthestDistance();
        
        // Visualize comparing pivot distance with current radius
        yield createStep(7, {
          activePoints: [queryPoint, pivot],
          distances: [{ from: queryPoint, to: pivot, type: distance < kRadius ? VisualType.INCLUSION : VisualType.ELIMINATION }],
          circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
        });

        // If pivot is closer than current k-th nearest neighbor, replace it
        if (distance < kRadius) {
          // Remove furthest point from results and mark as eliminated
          eliminatedPoints.push(neighbors.getLastPoint());
          // Add pivot to collection and results
          neighbors.add(pivot, distance);
          resultPoints.length = 0;
          resultPoints.push(...neighbors.getPoints());
          // Update k-nn radius
          kRadius = neighbors.getFurthestDistance();
          
          // Visualize adding pivot to results
          yield createStep(8, {
            activePoints: [pivot],
            distances: [{ from: queryPoint, to: pivot, type: VisualType.INCLUSION }],
            circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
          });
        } else {
          // Pivot is too far, mark as eliminated
          eliminatedPoints.push(pivot);
        }
      }
    }

    // Step 11: Complete pivot processing
    yield createStep(11, {
      circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
    });
    
    /**
     * Phase 2: Computing lower bounds for non-pivot points
     * For each non-pivot point, calculate a lower bound of its distance from the query
     * using triangle inequality and pre-computed distances to pivots.
     * This is a key optimization in LAESA that allows eliminating points without
     * calculating their actual distances.
     */
    // Step 12: Prepare lower bounds calculation
    const nonPivotPoints = points.filter(p => !pivots.some(pivot => pivot.id === p.id));
    const lowerBounds = new Map<number, number>();
    
    yield createStep(12, {
      circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
    });

    // Calculate lower bounds for each non-pivot point
    for (const point of nonPivotPoints) {
      // Initialize maximum lower bound for this point
      let maxLowerBound = 0;

      // Visualize processing point
      yield createStep(12, {
        activePoints: [queryPoint, point],
        circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
      });

      // Calculate lower bound using each pivot
      for (const pivot of pivots) {
        // Visualize current pivot for lower bound calculation
        yield createStep(13, {
          activePoints: [queryPoint, point, pivot],
          circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
        });

        // Get distances from distance matrix
        const distQueryToPivot = distanceMatrix.getDistance(queryPoint.id, pivot.id);
        const distPointToPivot = distanceMatrix.getDistance(point.id, pivot.id);
        
        // Calculate lower bound using triangle inequality
        // |d(q,p) - d(o,p)| ≤ d(q,o)
        const currentLowerBound = Math.abs(distQueryToPivot - distPointToPivot);
        
        // Visualize lower bound calculation
        yield createStep(13, {
          activePoints: [point, pivot, queryPoint],
          distances: [
            { from: pivot, to: queryPoint, type: VisualType.KNOWN_DISTANCE },
            { from: pivot, to: point, type: VisualType.KNOWN_DISTANCE },
            { from: queryPoint, to: point, type: VisualType.UNKNOWN_DISTANCE }
          ],
          circles: [
            { center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY },
            { center: queryPoint, radius: currentLowerBound, type: VisualType.LOWER_BOUND }
          ]
        });

        // Visualize comparing current lower bound with maximum lower bound
        yield createStep(13, {
          activePoints: [queryPoint, point, pivot],
          circles: [
            { center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY },
            { center: queryPoint, radius: currentLowerBound, type: currentLowerBound > maxLowerBound ? VisualType.ELIMINATION : VisualType.INCLUSION },
            { center: queryPoint, radius: maxLowerBound, type: VisualType.LOWER_BOUND}
          ]
        });

        // Update maximum lower bound for this point
        if (currentLowerBound > maxLowerBound) {
          maxLowerBound = currentLowerBound;
          
          // Visualize updating maximum lower bound
          yield createStep(13, {
            activePoints: [point],
            circles: [
              { center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY },
              { center: queryPoint, radius: maxLowerBound, type: VisualType.LOWER_BOUND }
            ]
          });
        }
      }
      
      // Store final lower bound for this point
      lowerBounds.set(point.id, maxLowerBound);
    }

    // Step 14: Complete lower bounds calculation
    yield createStep(14, {
      circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
    });
    
    /**
     * Phase 3: Processing non-pivot points sorted by lower bounds
     * Points are sorted in ascending order by their lower bounds, which allows
     * optimizing processing and more efficiently terminating the search.
     * This is a critical optimization in LAESA that reduces the number of distance calculations.
     */
    // Sort points by lower bounds (from smallest to largest)
    const sortedPoints = [...nonPivotPoints].sort((a, b) => {
      const lbA = lowerBounds.get(a.id) || 0;
      const lbB = lowerBounds.get(b.id) || 0;
      return lbA - lbB;
    });
    
    // Step 15: Start processing sorted points
    yield createStep(15, {
      circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
    });

    // Process all points sorted by lower bounds
    for (const point of sortedPoints) {
      const lb = lowerBounds.get(point.id) || 0;
      
      // Visualize processing point and its lower bound
      yield createStep(15, {
        activePoints: [point],
        circles: [
          { center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY },
          { center: queryPoint, radius: lb, type: VisualType.LOWER_BOUND }
        ]
      });
      
      // Step 16: Check if we have enough neighbors
      yield createStep(16, {
        activePoints: [point],
        circles: [
          { center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY },
          { center: queryPoint, radius: lb, type: VisualType.LOWER_BOUND}
        ]
      });
      
      // If we don't have k neighbors yet, add current point without further checks
      if (neighbors.getSize() < k) {
        // Visualize preparing to calculate actual distance
        yield createStep(17, {
          activePoints: [queryPoint, point],
          distances: [{ from: queryPoint, to: point, type: VisualType.UNKNOWN_DISTANCE }],
          circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
        });
        
        // Calculate actual distance
        const distance = distanceMatrix.addDistance(queryPoint, point);

        // Visualize calculated distance
        yield createStep(17, {
          activePoints: [queryPoint, point],
          distances: [{ from: queryPoint, to: point, type: VisualType.KNOWN_DISTANCE }],
          circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
        });
        
        // Add point to k-nn collection and results
        neighbors.add(point, distance);
        resultPoints.length = 0;
        resultPoints.push(...neighbors.getPoints());
        // Update k-nn radius
        kRadius = neighbors.getFurthestDistance();
        
        // Visualize adding point to results
        yield createStep(18, {
          activePoints: [point],
          distances: [{ from: queryPoint, to: point, type: VisualType.INCLUSION }],
          circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
        });
      }
      // Otherwise check if we can terminate the search or need to test the point
      else {
        // Step 19: Get distance to furthest neighbor
        yield createStep(19, {
          activePoints: [point],
          circles: [
            { center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY },
            { center: queryPoint, radius: lb, type: VisualType.LOWER_BOUND}
          ]
        });
        
        // Update k-nn radius for current neighbor set
        kRadius = neighbors.getFurthestDistance();
        
        // Step 20: Check if we can terminate the search
        yield createStep(20, {
          activePoints: [queryPoint, point],
          circles: [
            { center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY},
            { center: queryPoint, radius: lb, type: kRadius <= lb ? VisualType.ELIMINATION : VisualType.INCLUSION }
          ]
        });
        
        /**
         * Optimization: If k-th nearest neighbor is closer than the lower bound
         * for all remaining points, we can terminate the search.
         * This is a key optimization in the LAESA algorithm.
         */
        if (kRadius <= lb) {
          // Mark remaining points as eliminated (optimization)
          eliminatedPoints.push(point);
          for (const p of sortedPoints) {
            if (p.id !== point.id && !resultPoints.includes(p) && !eliminatedPoints.includes(p)) {
              eliminatedPoints.push(p);
            }
          }
          
          // Visualize terminating the search
          yield createStep(21, {
            circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
          });
          
          break; // End loop - we cannot find better points
        }

        // Need to calculate actual distance and check it
        // Step 23: Prepare actual distance calculation
        yield createStep(23, {
          activePoints: [queryPoint, point],
          distances: [{ from: queryPoint, to: point, type: VisualType.UNKNOWN_DISTANCE}],
          circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
        });
        
        // Calculate actual distance
        const distance = distanceMatrix.addDistance(queryPoint, point);
        
        // Visualize calculated distance
        yield createStep(23, {
          activePoints: [queryPoint, point],
          distances: [{ from: queryPoint, to: point, type: VisualType.KNOWN_DISTANCE}],
          circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
        });
        
        // Update k-nn radius
        kRadius = neighbors.getFurthestDistance();

        // Step 24: Check if point is better than current k-th nearest neighbor
        yield createStep(24, {
          activePoints: [queryPoint, point],
          distances: [{ from: queryPoint, to: point, type: distance < kRadius ? VisualType.INCLUSION : VisualType.ELIMINATION }],
          circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
        });
        
        // If point is closer than k-th nearest neighbor, replace it
        if (distance < kRadius) {
          // Remove furthest point from results and mark as eliminated
          eliminatedPoints.push(neighbors.getLastPoint());
          // Add point to collection and results
          neighbors.add(point, distance);
          resultPoints.length = 0;
          resultPoints.push(...neighbors.getPoints());
          // Update k-nn radius
          kRadius = neighbors.getFurthestDistance();
          
          // Visualize adding point to results
          yield createStep(25, {
            activePoints: [point],
            distances: [{ from: queryPoint, to: point, type: VisualType.INCLUSION }],
            circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
          });
        } else {
          // Point is too far, mark as eliminated
          eliminatedPoints.push(point);
        }
      }
    }

    // Step 28: End point processing
    yield createStep(28, {
      circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
    });

    // Step 29: Return results - k nearest neighbors
    yield createStep(29, {
      circles: [{ center: queryPoint, radius: kRadius, type: VisualType.KNN_BOUNDARY }]
    });
  }
}