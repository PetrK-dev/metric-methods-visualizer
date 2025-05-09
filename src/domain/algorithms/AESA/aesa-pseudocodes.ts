/**
 * Pseudocode for the AESA dynamic insertion algorithm.
 * 
 * The AESA (Approximating Eliminating Search Algorithm) dynamic insertion process
 * maintains a complete distance matrix by calculating distances between a new point
 * and all existing points in the database before adding the point.
 * 
 * This simple algorithm:
 * 1. Computes the distance from the new point to every existing point in the database
 * 2. Adds the new point to the database
 * 
 * The time complexity is O(n) where n is the number of existing points in the database,
 * as it requires exactly one distance calculation per existing point.
 * 
 * @type {string[]} Array of pseudocode lines for the dynamic insertion algorithm
 */
export const PSEUDOCODE_AESA_DYNAMIC_INSERT = [
  'AESA_Dynamic_Insert(DB, q):',
  '  for each o_i ∈ DB do',
  '    count distance(o, q)',
  '  end for',
  '  DB = DB ∪ {q}',
  'END',
];

/**
 * Pseudocode for the AESA k-NN (k-Nearest Neighbors) algorithm.
 * 
 * This algorithm efficiently finds the k closest points to a query point by using
 * pre-computed distances stored in a distance matrix. It employs the triangle inequality
 * to establish lower bounds on distances, allowing many points to be eliminated without
 * explicitly calculating their distances to the query point.
 * 
 * Key optimization principles:
 * - Uses a pivot-based approach to explore the metric space
 * - Eliminates points that cannot be in the k-NN result using lower bounds
 * - Dynamically selects the next pivot to minimize expected calculations
 * 
 * The algorithm maintains a priority queue of the current k nearest neighbors and
 * progressively refines this set while pruning the search space.
 * 
 * Best-case complexity is O(k), and average case is significantly better than the
 * naive O(n) algorithm, especially in low-dimensionality metric spaces.
 * 
 * @type {string[]} Array of pseudocode lines for the k-NN algorithm
 */
export const PSEUDOCODE_AESA_KNN = [
  'AESA_kNN(DB, q, k):',
  '  PQ = ∅, S = DB',                            // Initialize empty priority queue and set of all points
  '  p_next = random point from S',              // Random selection of first pivot
  '  while not S.isEmpty() do',                  // While there are points to process
  '    p = p_next',                              // Set current pivot
  '    compute d(q, p)',                         // Calculate distance between query and pivot
  '    S = S - {p}',                             // Remove pivot from candidate set
  '    if |PQ| < k then',                        // If we don't have enough neighbors
  '      add p with d(q,p) to PQ',               // Add pivot to result set
  '      p_next = random point from S',          // Random selection of next pivot
  '    else',                                    // If we already have k neighbors
  '      if d(q,p) < d(q,o_k) then',             // If pivot is closer than kth nearest
  '        add p with d(q,p) to PQ',             // Add pivot to result set
  '      end if',
  '      for each o_i in S do',                  // For each remaining point
  '        lb = |d(q,p) - d(o_i,p)|',            // Calculate lower bound using triangle inequality
  '        if lb > d(q,o_k) then',               // If lower bound is greater than distance of kth point
  '          S = S - {o_i}',                     // Eliminate point (cannot be in k-NN)
  '        else if lb < lb_min then',            // If we found a better lower bound
  '          lb_min = lb',                       // Update minimum lower bound
  '          p_next = o_i',                      // Select this point as next pivot
  '        end if',
  '      end for',
  '    end if',
  '  end while',
  '  return PQ',                                 // Return k nearest points
  'END'
];

/**
 * Pseudocode for the AESA range query algorithm.
 * 
 * This algorithm efficiently finds all points within a specified radius r from a query point.
 * Similar to the k-NN algorithm, it uses pre-computed distances and the triangle inequality
 * to eliminate points without explicitly calculating their distances to the query point.
 * 
 * Key features:
 * - Uses pivot selection to minimize the number of distance calculations
 * - Applies the triangle inequality to establish lower bounds on distances
 * - Eliminates points that cannot be within the search radius
 * - Maintains an adaptive search strategy that selects the most promising pivot
 * 
 * The algorithm is particularly efficient in low to medium dimensional spaces where
 * the triangle inequality provides tight bounds, significantly reducing the number
 * of distance calculations compared to a linear scan.
 * 
 * The best-case scenario requires just O(log n) distance calculations, while the
 * worst-case remains O(n), but with average performance substantially better than linear.
 * 
 * @type {string[]} Array of pseudocode lines for the range query algorithm
 */
export const PSEUDOCODE_AESA_RANGE = [
  'AESA_Range(DB, q, r):',
  '  R = ∅, S = DB',                             // Initialize empty result set and set of all points
  '  p_next = random point from S',              // Random selection of first pivot
  '  while S.isEmpty()! do',                     // While there are points to process
  '    p = p_next',                              // Set current pivot
  '    compute d(q, p)',                         // Calculate distance between query and pivot
  '    S = S - {p}',                             // Remove pivot from candidate set
  '    if d(q, p) ≤ r then',                     // If pivot is within range
  '      add p to R',                            // Add pivot to result set
  '    end if',
  '    for each o_i in S do',                    // For each remaining point
  '      lb = |d(q, p) - d(o_i, p)|',            // Calculate lower bound using triangle inequality
  '      if lb > r then',                        // If lower bound is greater than radius
  '        S = S - {o_i}',                       // Eliminate point (cannot be in result)
  '      else if lb < lb_min then',              // If we found a better lower bound
  '        lb_min = lb',                         // Update minimum lower bound
  '        p_next = o_i',                        // Select this point as next pivot
  '      end if',
  '    end for',
  '  end while',
  'return R',                                    // Return all points within range
];