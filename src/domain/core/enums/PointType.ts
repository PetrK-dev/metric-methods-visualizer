/**
 * Enumeration defining types of points in metric space.
 * Distinguishes between regular objects, pivot points, and query points.
 */
export enum PointType {
  /** Regular data object in space */
  OBJECT = 'O',
  /** Pivot point used in LAESA method for lower bound calculations */
  PIVOT = 'P',
  /** Query point for which we search nearest neighbors or surrounding points */
  QUERY = 'Q'
}