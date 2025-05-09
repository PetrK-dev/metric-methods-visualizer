import { DistanceMatrix } from "../../core/data-structures/DistanceMatrix";
import { Database } from "../../core/database/Database";
import { VisualType } from "../../core/enums/VisualType";
import { AlgorithmStep } from "../../core/models/interfaces/AlgorithmStep";
import { Point } from "../../core/models/Point";
import { DistanceMatrixAlgorithm } from "../base/DistanceMatrixAlgorithm";

/**
 * Implementation of the range search algorithm for the LAESA method.
 * 
 * LAESA (Linear AESA) is a memory-optimized variant of AESA that uses a subset of pivot points
 * to reduce memory complexity from O(n²) to O(kn), where k is the number of pivots and
 * n is the number of objects in the database.
 * 
 * This algorithm finds all points within a given radius from the query point,
 * using pre-computed distances to pivots for efficient filtering of candidates
 * through the triangle inequality property.
 */
export class LaesaRangeAlgorithm extends DistanceMatrixAlgorithm {
  /**
   * Executes a range query for the LAESA method.
   * 
   * Algorithm steps:
   * 1. Initialize an empty result set
   * 2. Process all pivot points:
   *    - Calculate distance to the query point
   *    - If within range, add to results
   * 3. Process all non-pivot points:
   *    - Calculate lower bound using triangle inequality with all pivots
   *    - If lower bound > radius, eliminate the point
   *    - Otherwise, calculate actual distance and check if within range
   * 
   * @param {Database} database - The database containing points and pivots
   * @param {DistanceMatrix} distanceMatrix - The distance matrix for stored distances
   * @param {Point} queryPoint - The query point around which we search
   * @param {number} radius - The search radius
   * @returns {AsyncGenerator<AlgorithmStep>} A generator of algorithm steps for visualization
   */
  public static async *execute(
    database: Database, 
    distanceMatrix: DistanceMatrix, 
    queryPoint: Point,
    radius: number
  ): AsyncGenerator<AlgorithmStep> {
    // Collections for tracking eliminated and result points
    let eliminatedPoints: Point[] = [];
    let resultPoints: Point[] = [];
    
    // Create factory for generating visualization steps
    const createStep = this.createStepFactory(database, distanceMatrix, resultPoints, eliminatedPoints);
    // Get all points and pivots from the database
    const points = database.getDataPoints();
    const pivots = database.getPivots();
    
    /**
     * Phase 0: Algorithm initialization
     * Display the query point and search range
     */
    // Step 0: LAESA_Range(DB, q, r)
    yield createStep(0, {
      circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY}]
    });

    /**
     * Phase 1: Initialize empty result set
     */
    // Step 1: R = ∅
    yield createStep(1, {
      circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY}]
    });
    
    /**
     * Phase 2: Process pivot points
     * For each pivot, calculate distance to query point
     * and add to results if within range.
     */
    // Step 2: for each p_j ∈ P do
    yield createStep(2, {
      circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY}]
    });
    
    // Process all pivots
    for (const pivot of pivots) {
      // Visualize pivot activation
      yield createStep(2, {
        activePoints: [pivot],
        circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY}]
      });

      // Step 3: compute d(q, p_j) - prepare to calculate distance
      yield createStep(3, {
        activePoints: [queryPoint, pivot],
        distances: [{ from: queryPoint, to: pivot, type: VisualType.UNKNOWN_DISTANCE}],
        circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY}]
      });
      
      // Calculate distance between query point and pivot
      const distance = distanceMatrix.addDistance(queryPoint, pivot);

      // Visualize the calculated distance
      yield createStep(3, {
        activePoints: [queryPoint, pivot],
        distances: [{ from: queryPoint, to: pivot, type: VisualType.KNOWN_DISTANCE}],
        circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY}]
      });
      
      // Step 4: if d(q, p_j) ≤ r then - check if pivot is within range
      yield createStep(4, {
        activePoints: [queryPoint, pivot],
        distances: [{ from: queryPoint, to: pivot, type: distance <= radius ? VisualType.INCLUSION : VisualType.ELIMINATION}],
        circles: [{ center: queryPoint, radius, type : VisualType.RANGE_QUERY }]
      });

      // If pivot is within range, add to results
      if (distance <= radius) {
        resultPoints.push(pivot);

        // Step 5: add p_j to R - add pivot to results
        yield createStep(5, {
          activePoints: [queryPoint, pivot],
          circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY}]
        });
      } else {
        // Pivot is not within range, mark as eliminated
        eliminatedPoints.push(pivot);
      }
    }
    
    // Step 7: end for - end of pivot processing
    yield createStep(7, {
      circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY}]
    });
    
    /**
     * Phase 3: Process non-pivot points
     * For each non-pivot point, calculate lower bound of its distance from query.
     * If lower bound > radius, we can eliminate the point without actual distance calculation.
     * Otherwise, calculate actual distance and check if within range.
     */
    // Step 8: for each o_i ∈ DB do - start processing non-pivot points
    yield createStep(8, {
      circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY}]
    });
    
    // Get all non-pivot points
    const nonPivotPoints = points.filter(point => !pivots.some(p => p.id === point.id));
    
    // Process all non-pivot points
    for (const point of nonPivotPoints) {
      // Initialize maximum lower bound for this point
      let maxLowerBound = 0;
      
      // Visualize the point being processed
      yield createStep(8, {
        activePoints:[queryPoint, point],
        circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY}]
      });
      
      /**
       * Calculate lower bound using all pivots
       * For each pivot p_j, calculate lower bound |d(q, p_j) - d(o_i, p_j)|
       * and use maximum of these values as final lower bound.
       */
      // Step 9: lb = max_{p_j ∈ P} |d(q, p_j) - d(o_i, p_j)|
      for (const pivot of pivots) {
        // Visualize current pivot for lower bound calculation
        yield createStep(9, {
          activePoints: [queryPoint, point, pivot],
          circles: [{ center: queryPoint, radius: radius, type: VisualType.RANGE_QUERY }]
        });

        // Get pre-computed distances from distance matrix
        const distQueryToPivot = distanceMatrix.getDistance(queryPoint.id, pivot.id);
        const distPointToPivot = distanceMatrix.getDistance(point.id, pivot.id);

        // Calculate lower bound using triangle inequality: |d(q,p) - d(o,p)| ≤ d(q,o)
        const currentLowerBound = Math.abs(distQueryToPivot - distPointToPivot);

        // Visualize lower bound calculation
        yield createStep(9, {
          activePoints: [point, pivot, queryPoint],
          distances: [
            { from: pivot, to: queryPoint, type: VisualType.KNOWN_DISTANCE },
            { from: pivot, to: point, type: VisualType.KNOWN_DISTANCE },
            { from: queryPoint, to: point, type: VisualType.UNKNOWN_DISTANCE }
          ],
          circles: [
            { center: queryPoint, radius: radius, type: VisualType.RANGE_QUERY },
            { center: queryPoint, radius: currentLowerBound, type: VisualType.LOWER_BOUND }
          ]
        });

        // Visualize comparison of current lower bound with maximum lower bound
        yield createStep(9, {
          activePoints: [queryPoint, point, pivot],
          circles: [
            { center: queryPoint, radius: radius, type: VisualType.RANGE_QUERY},
            { center: queryPoint, radius: currentLowerBound, type: currentLowerBound > maxLowerBound ? VisualType.ELIMINATION : VisualType.INCLUSION },
            { center: queryPoint, radius: maxLowerBound, type: VisualType.LOWER_BOUND}
          ]
        });

        // Update maximum lower bound for this point
        if (currentLowerBound > maxLowerBound) {
          maxLowerBound = currentLowerBound;
          
          // Visualize maximum lower bound update
          yield createStep(9, {
            activePoints: [point],
            circles: [
              { center: queryPoint, radius: radius, type: VisualType.RANGE_QUERY },
              { center: queryPoint, radius: maxLowerBound, type: VisualType.LOWER_BOUND }
            ]
          });
        }
      }
      
      /**
       * Compare lower bound with search radius
       * If lower bound > radius, we can eliminate point without calculating actual distance.
       * Otherwise, we must calculate actual distance and check if point is within range.
       */
      // Step 10: if lb ≤ r then - check lower bound
      yield createStep(10, {
        activePoints: [queryPoint, point],
        circles: [
          { center: queryPoint, radius, type: VisualType.RANGE_QUERY},
          { center: queryPoint, radius: maxLowerBound, type: maxLowerBound <= radius ? VisualType.INCLUSION : VisualType.ELIMINATION }
        ]
      });
      
      // If lower bound is less than or equal to radius, we must check actual distance
      if (maxLowerBound <= radius) {
        // Step 11: compute d(q, o_i) - calculate actual distance
        yield createStep(11, {
          activePoints: [queryPoint, point],
          distances: [{ from: queryPoint, to: point, type: VisualType.UNKNOWN_DISTANCE}],
          circles: [ { center: queryPoint, radius, type: VisualType.RANGE_QUERY}]
        });

        // Calculate actual distance between query point and current point
        const actualDistance = distanceMatrix.addDistance(queryPoint, point);

        // Visualize calculated distance
        yield createStep(11, {
          activePoints: [queryPoint, point],
          distances: [{ from: queryPoint, to: point, type: VisualType.KNOWN_DISTANCE}],
          circles: [ { center: queryPoint, radius, type: VisualType.RANGE_QUERY}]
        });
        
        // Step 12: if d(q, o_i) ≤ r then - check if point is within range
        yield createStep(12, {
          activePoints: [queryPoint, point],
          distances: [{ from: queryPoint, to: point, type: actualDistance <= radius ? VisualType.INCLUSION : VisualType.ELIMINATION}],
          circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY}]
        });
        
        // If point is within range, add to results
        if (actualDistance <= radius) {
          // Step 13: add o_i to R - add point to results
          resultPoints.push(point);

          yield createStep(13, {
            activePoints: [point],
            circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY}]
          });
        } else {
          // Point is not within range, mark as eliminated
          eliminatedPoints.push(point);
        }
      } else {
        // Lower bound is greater than radius, eliminate point without calculating actual distance
        eliminatedPoints.push(point);
      }
    }
    
    // Step 16: end for - end of non-pivot points processing
    yield createStep(16, {
      circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY}]
    });
    
    /**
     * Phase 4: Return results
     * The algorithm returns the set of all points within the given radius from the query point.
     */
    // Step 17: return R - return results
    yield createStep(17, {
      circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY}]
    });
  }
}