/**
 * File containing pseudocodes for LAESA algorithms in a readable format.
 * These pseudocodes serve as the foundation for algorithm implementations
 * and as a reference for visualization of individual steps in the UI.
 * 
 * LAESA (Linear AESA) is a variant of AESA that uses a subset of pivot points
 * to reduce memory complexity from O(n²) to O(kn), where k is the number of pivots
 * and n is the number of objects in the database.
 */

/**
 * Pseudocode for the dynamic insertion algorithm in the LAESA method.
 * 
 * This algorithm calculates distances between the newly inserted point and all pivot points,
 * storing these distances in the distance matrix, and then adds the point to the database.
 * 
 * The memory overhead is linear (O(k)) where k is the number of pivots, as opposed to
 * the quadratic overhead (O(n)) of the original AESA method where n is the total number of points.
 */
export const PSEUDOCODE_LAESA_DYNAMIC_INSERT = [
  'LAESA_Dynamic_Insert(DB, q):',
  '  for each p ∈ DB do',
  '    count distance(p, q)',
  '  end for',
  '  DB = DB ∪ {q}',
  'END',
];

/**
 * Pseudocode for the k-nearest neighbors algorithm in the LAESA method.
 * 
 * This algorithm finds the k points in the database that are closest to the query point.
 * It consists of three main phases:
 * 
 * 1. Process pivots and calculate distances to them
 * 2. Compute lower bounds for all points using pivots and triangle inequality
 * 3. Process points sorted by lower bounds, with early termination when possible
 * 
 * The key optimization in LAESA KNN is the ability to terminate processing early
 * when the lower bound of remaining points exceeds the distance to the current
 * k-th nearest neighbor, thus avoiding unnecessary distance calculations.
 */
export const PSEUDOCODE_LAESA_KNN = [
  'LAESA_KNN(DB, q, k):',
  '  PQ = ∅',                                      // Initialize empty priority queue
  '  for each p_j ∈ P do',                         // Phase 1: Process pivots
  '    compute d(q, p_j)',                         // Calculate distance to pivot
  '    if |PQ| < k then',                          // If we don't have k neighbors yet
  '      add p_j with d(q, p_j) to PQ',           // Add pivot to results
  '    else',                                      // Otherwise
  '      if d(q, p_j) < d(q, o_k) then',          // If pivot is closer than k-th nearest neighbor
  '        add p_j with d(q, p_j) to PQ',         // Replace k-th nearest point with pivot
  '      end if',
  '    end if',
  '  end for',
  '  for each o_i ∈ DB do',                       // Phase 2: Compute lower bounds
  '    lb = max_{p_j ∈ P} |d(q, p_j) - d(o_i, p_j)|', // Calculate lower bound using triangle inequality
  '  end for',
  '  for each o_i ∈ DB sorted by lb do',          // Phase 3: Process points sorted by lower bounds
  '    if |PQ| < k then',                          // If we don't have k neighbors yet
  '      compute d(q, o_i)',                       // Calculate distance
  '      add o_i with d(q, o_i) to PQ',           // Add point to results
  '    else',                                      // Otherwise
  '      if d(q, o_k) <= lb o_i then',            // Optimization: If k-th neighbor is closer than lower bound
  '        break',                                 // We can terminate the search
  '      end if',
  '      compute d(q, o_i)',                       // Calculate distance
  '      if d(q, o_i) < d(q, o_k) then',          // If point is closer than k-th nearest neighbor
  '        add o_i with d(q, o_i) to PQ',         // Replace k-th nearest point
  '      end if',
  '    end if',
  '  end for',
  'return PQ'                                     // Return result - k nearest neighbors
];

/**
 * Pseudocode for the range search algorithm in the LAESA method.
 * 
 * This algorithm returns all points that lie within a specified radius from the query point.
 * It consists of two main phases:
 * 
 * 1. Process pivots and add those within range to the result set
 * 2. Filter other points using lower bounds and add those within range
 * 
 * The key optimization is the use of triangle inequality to compute lower bounds
 * of distances between the query point and database objects. If the lower bound
 * exceeds the range radius, the point can be eliminated without calculating its
 * actual distance, significantly reducing the number of distance calculations.
 */
export const PSEUDOCODE_LAESA_RANGE = [
  'LAESA_Range(DB, q, r):',
  '  R = ∅',                                      // Initialize empty result set
  '  for each p_j ∈ P do',                         // Phase 1: Process pivots
  '    compute d(q, p_j)',                         // Calculate distance to pivot
  '    if d(q, p_j) ≤ r then',                     // If pivot is within range
  '        add p_j to R',                          // Add pivot to results
  '    end if',
  '  end for',
  '  for each o_i ∈ DB do',                       // Phase 2: Process other points
  '    lb = max_{p_j ∈ P} |d(q, p_j) - d(o_i, p_j)|', // Calculate lower bound using triangle inequality
  '    if lb ≤ r then',                            // If lower bound is less than range
  '      compute d(q, o_i)',                       // Calculate actual distance
  '      if d(q, o_i) ≤ r then',                   // If point is within range
  '        add o_i to R',                          // Add point to results
  '      end if',
  '    end if',
  '  end for',
  'return R'                                      // Return result - points within range
];