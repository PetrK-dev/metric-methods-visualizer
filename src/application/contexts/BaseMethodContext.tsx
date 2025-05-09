import { Database } from "../../domain/core/database/Database";
import { IDataStructure } from "../../domain/core/data-structures/IDataStructure";
import { AlgorithmType } from "../../domain/core/enums/AlgorithmType";
import { MethodType } from "../../domain/core/enums/MethodType";
import { Point } from "../../domain/core/models/Point";
import { AlgorithmStep } from "../../domain/core/models/interfaces/AlgorithmStep";

/**
 * Base interface for all algorithm contexts.
 * Provides properties and methods for controlling algorithm execution
 * and accessing data structures needed for metric method visualization.
 */
export interface BaseMethodContext {
  // Basic properties
  /** Metric method type (AESA, LAESA, MTREE) */
  methodType: MethodType;
  /** Currently selected algorithm type (kNN, Range Query, Dynamic Insert) */
  algorithm: AlgorithmType;
  /** Implemented algorithms available for this method */
  availableAlgorithms: AlgorithmType[];
  /** Point database for the algorithm */
  database: Database;
  /** Current query point */
  queryPoint: Point;
  /** Number of points in the database */
  pointCount: number;
  /** Data structure used by the method (e.g., DistanceMatrix, Tree) */
  dataStructure: IDataStructure<any>;
  
  // Algorithm-specific parameters
  /** k-value for kNN algorithm - number of nearest neighbors */
  kValue: number;
  /** Radius for Range Search algorithm */
  rangeRadius: number;
  
  // Execution control
  /** Indicates whether the algorithm is running (either automatically or paused) */
  isRunning: boolean;
  /** Indicates whether the algorithm is running in automatic mode */
  isAutoPlaying: boolean;
  /** Indicates whether the algorithm has completed its execution */
  isFinished: boolean;
  /** Current algorithm step, null if the algorithm hasn't been started */
  currentAlgorithmStep: AlgorithmStep | null;
  /** Algorithm step for display (can be currentAlgorithmStep or default step) */
  displayStep: AlgorithmStep;
  /** Algorithm playback speed (multiplier) */
  speed: number;
  
  // Setters
  /** Sets the algorithm type */
  setAlgorithm: (type: AlgorithmType) => void;
  /** Sets the query point */
  setQueryPoint: (point: Point) => void;
  /** Sets the k-value for kNN algorithm */
  setKValue: (value: number) => void;
  /** Sets the radius for Range Search algorithm */
  setRangeRadius: (value: number) => void;
  /** Sets the number of points in the database */
  setPointCount: (count: number) => void;
  
  // Control methods
  /** Starts algorithm playback */
  onPlay: () => Promise<void>;
  /** Pauses algorithm execution */
  onPause: () => void;
  /** Performs one step of the algorithm */
  onStep: () => Promise<void>;
  /** Resets the algorithm to its initial state */
  onReset: () => void;
  /** Sets the algorithm playback speed */
  setSpeed: (speed: number) => void;
}