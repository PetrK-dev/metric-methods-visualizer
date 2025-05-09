import { Database } from "../database/Database";
import { VisualType } from "../enums/VisualType";
import { euclideanDistance } from "../functions/distanceFunctions";
import { Point } from "../models/Point";
import { DistanceMatrix } from "./DistanceMatrix";
import { Tree } from "./Tree";

/**
 * Enumeration defining supported data structure types.
 * Used for polymorphic identification of different IDataStructure implementations.
 */
export enum DataStructureType {
    /** Default structure */
    DEFAULT = "DEFAULT",
    /** Distance matrix used in AESA and LAESA algorithms */
    DISTANCE_MATRIX = 'DISTANCE_MATRIX',
    /** Tree structure used in the M-Tree algorithm */
    TREE = 'TREE',
}

/**
 * Factory class for creating data structure instances.
 * Provides a unified interface for obtaining structures of different types.
 */
export class DataStructureFactory {
    /**
     * Creates a new instance of the requested data structure type.
     * 
     * @param {DataStructureType} type - The type of data structure to create
     * @returns {IDataStructure<any>} Instance of the requested data structure
     * @throws {Error} If an unsupported type is requested
     */
    static createInstance(type: DataStructureType): IDataStructure<any> {
        switch (type) {
        case DataStructureType.DISTANCE_MATRIX:
            return new DistanceMatrix(euclideanDistance);
        case DataStructureType.TREE:
            return new Tree(euclideanDistance);
        default:
            throw new Error(`Unsupported data structure type: ${type}`);
        }
    }
}

/**
 * Basic interface for all data structures used in metric methods.
 * Defines common operations that each structure must support.
 * 
 * @template T The specific type of the implementing structure
 */
export interface IDataStructure<T> {
    /** Identifier of the data structure type */
    structureType: DataStructureType;
  
    /**
     * Initializes the structure with basic data for algorithms (without query point).
     * 
     * @param {Database} database - The database containing points
     */
    initializeBase(database: Database): void;
    
    /**
     * Returns direct access to the internal implementation of the structure.
     * 
     * @returns {T} Instance of the specific data structure
     */
    getStructure(): T;
    
    /**
     * Creates a deep copy of the data structure.
     * 
     * @returns {IDataStructure<T>} A new instance with copied data
     */
    clone(): IDataStructure<T>;

    /**
     * Returns visualization data for the initial state of the structure.
     * Provides information about distances and regions to be displayed in the visualization.
     * 
     * @returns {Object} Object containing arrays of distances and circles for visualization
     */
    getInitialVisualization(): {
        distances: Array<{ from: Point, to: Point, type: VisualType }>,
        circles: Array<{ center: Point, radius: number, type: VisualType }>
    };
}