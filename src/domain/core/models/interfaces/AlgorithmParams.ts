import { IDataStructure } from "../../data-structures/IDataStructure";
import { Database } from "../../database/Database";
import { AlgorithmType } from "../../enums/AlgorithmType";
import { MethodType } from "../../enums/MethodType";
import { Point } from "../Point";

/**
 * Interface defining parameters for executing metric method algorithms.
 * Contains all necessary data for initializing and running algorithms.
 */
export interface AlgorithmParams {
    /** Type of metric method (AESA, LAESA, MTREE) */
    method: MethodType;
    
    /** Type of algorithm to be executed (INSERT, KNN, RANGE) */
    algorithm: AlgorithmType;
    
    /** Database instance containing points in metric space */
    database: Database;
    
    /** Data structure instance for the given metric method */
    dataStructure: IDataStructure<any>;
    
    /** Query point for which the algorithm is executed */
    queryPoint: Point;
    
    /** K value for the k-nearest neighbors algorithm */
    kValue: number;
    
    /** Radius for the range query algorithm */
    rangeRadius: number;
}