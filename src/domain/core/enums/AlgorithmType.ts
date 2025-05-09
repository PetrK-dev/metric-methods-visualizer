/**
 * Enumeration defining supported algorithm types.
 * Used to determine the type of algorithmic query to be performed.
 */
export enum AlgorithmType {
  /** Default algorithm */
  DEFAULT = 'DEFAULT',
  /** Algorithm for dynamic insertion of a new point into an existing structure */
  INSERT = 'INSERT',
  /** k-Nearest Neighbors algorithm (finds k closest points to query point) */
  KNN = 'KNN',
  /** Range query algorithm (returns points within specified radius) */
  RANGE = 'RANGE'
}