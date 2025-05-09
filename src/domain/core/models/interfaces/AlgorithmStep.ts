import { IDataStructure } from "../../data-structures/IDataStructure";
import { Database } from "../../database/Database";
import { VisualType } from "../../enums/VisualType";
import { Point } from "../Point";

/**
 * Interface representing a single step of an algorithm during execution.
 * Contains all information needed for visualizing the current state of the algorithm.
 */
export interface AlgorithmStep {
    /** Sequential step number within the algorithm */
    stepNumber: number;
    
    /** Current state of the point database */
    database: Database;
    
    /** Current state of the data structure */
    dataStructure: IDataStructure<any>;
    
    /** List of points that are active (being processed) in the current step */
    activePoints: Point[];
    
    /** List of points that have been excluded from the result by the algorithm */
    eliminatedPoints: Point[];
    
    /** List of points that have been included in the result by the algorithm */
    resultPoints: Point[];
    
    /** 
     * List of lines representing distances between points.
     * Each line is defined by a start point, end point, and type.
     */
    distances: { 
      /** Starting point of the line */
      from: Point,
      /** Ending point of the line */
      to: Point,
      /** Line type determining its visual representation */
      type?: VisualType,
    }[];
    
    /**
     * List of circles for visualization.
     * Circles are used to display query radii, lower bounds, and regions.
     */
    circles: { 
      /** Center of the circle */
      center: Point,
      /** Radius of the circle */
      radius: number,
      /** Circle type determining its visual representation */
      type?: VisualType,
    }[];
}