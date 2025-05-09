/**
 * Enumeration defining supported metric methods.
 * Each method uses a specific data structure and algorithms for metric-based searching.
 */
export enum MethodType {
  /** Default method */
  DEFAULT = 'DEFAULT',
  /** Approximating Eliminating Search Algorithm - precomputes all distances between objects */
  AESA = 'AESA',
  /** Linear AESA - precomputes distances only to pivot points */
  LAESA = 'LAESA',
  /** Metric Tree - hierarchical structure for indexing points in metric space */
  MTREE = 'MTREE'
}