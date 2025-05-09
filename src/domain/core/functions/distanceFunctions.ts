import { Point } from "../models/Point";

/**
 * Defines a function type for calculating distance between two points in metric space.
 * This function must satisfy metric axioms (non-negativity, identity, symmetry, and triangle inequality).
 */
export type DistanceFunction = (point1: Point, point2: Point) => number;

/**
 * Implementation of Euclidean distance in 2D space.
 * Calculates the direct distance between two points as the square root of the sum of squared coordinate differences.
 * 
 * @param {Point} point1 - First point
 * @param {Point} point2 - Second point
 * @returns {number} Distance between the two points
 */
export const euclideanDistance: DistanceFunction = (point1, point2) => {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
};