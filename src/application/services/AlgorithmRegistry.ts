import { AesaDynamicInsertAlgorithm } from "../../domain/algorithms/AESA/AesaDynamicInsertAlgorithm";
import { AesaKnnAlgorithm } from "../../domain/algorithms/AESA/AesaKnnAlgorithm";
import { AesaRangeAlgorithm } from "../../domain/algorithms/AESA/AesaRangeAlgorithm";
import { AlgorithmController } from "../../domain/algorithms/base/AlgorithmController";
import { DefaultAlgorithm } from "../../domain/algorithms/base/DefaultAlgorithm";
import { LaesaDynamicInsertAlgorithm } from "../../domain/algorithms/LAESA/LaesaDynamicInsertAlgorithm";
import { LaesaKnnAlgorithm } from "../../domain/algorithms/LAESA/LaesaKnnAlgorithm";
import { LaesaRangeAlgorithm } from "../../domain/algorithms/LAESA/LaesaRangeAlgorithm";
import { MTreeDynamicInsertAlgorithm } from "../../domain/algorithms/MTREE/MTreeDynamicInsertAlgorithm";
import { MTreeKnnAlgorithm } from "../../domain/algorithms/MTREE/MTreeKnnAlgorithm";
import { MTreeRangeAlgorithm } from "../../domain/algorithms/MTREE/MTreeRangeAlgorithm";
import { AlgorithmType } from "../../domain/core/enums/AlgorithmType";
import { MethodType } from "../../domain/core/enums/MethodType";
import { AlgorithmParams } from "../../domain/core/models/interfaces/AlgorithmParams";
import { AlgorithmStep } from "../../domain/core/models/interfaces/AlgorithmStep";

/**
 * Registry of algorithms for metric methods.
 * Provides an interface for selecting and executing a specific algorithm
 * based on the method type and algorithm type.
 */
export class AlgorithmRegistry {
  /** Controller for managing algorithm execution */
  private controller: AlgorithmController;
  /** Iterator of the currently running algorithm */
  private algorithmIterator: AsyncGenerator<AlgorithmStep> | null = null;

  /**
   * Creates a new instance of the algorithm registry
   */
  constructor() {
    this.controller = new AlgorithmController();
  }

  /**
   * Starts an algorithm according to the provided parameters.
   * Creates copies of input data and selects the correct algorithm implementation.
   * 
   * @param {AlgorithmParams} params - Parameters for selecting and starting the algorithm
   * @returns {Promise<void>}
   */
  public async start(params: AlgorithmParams): Promise<void> {
    let iterator: AsyncGenerator<AlgorithmStep>;
    const {algorithm, method, database, dataStructure} = params;
    
    // Create copies to isolate algorithm execution
    const dbCopy = database.clone(); 
    const dsCopy = dataStructure.clone();
    const queryCopy = params.queryPoint.clone();

    // Select the correct algorithm implementation based on method and algorithm type
    switch (method) {
        case (MethodType.DEFAULT):
            switch (algorithm) {
                case AlgorithmType.DEFAULT:
                    iterator = DefaultAlgorithm.execute(dbCopy, dsCopy.getStructure(), queryCopy); 
                    break;
                default: 
                    throw new Error(`Unsupported algorithm type: ${algorithm} for method ${method}`);
            }
            break;
        case (MethodType.AESA):
            switch (algorithm) {
                case AlgorithmType.INSERT:
                    iterator = AesaDynamicInsertAlgorithm.execute(dbCopy, dsCopy.getStructure(), queryCopy); 
                    break;
                case AlgorithmType.KNN:
                    iterator = AesaKnnAlgorithm.execute(dbCopy, dsCopy.getStructure(), queryCopy, params.kValue); 
                    break;
                case AlgorithmType.RANGE:
                    iterator = AesaRangeAlgorithm.execute(dbCopy, dsCopy.getStructure(), queryCopy, params.rangeRadius); 
                    break;  
                default: 
                    throw new Error(`Unsupported algorithm type: ${algorithm} for method ${method}`);
            } 
            break;
        case (MethodType.LAESA):
            switch (algorithm) {
                case AlgorithmType.INSERT:
                    iterator = LaesaDynamicInsertAlgorithm.execute(dbCopy, dsCopy.getStructure(), queryCopy); 
                    break;
                case AlgorithmType.KNN:
                    iterator = LaesaKnnAlgorithm.execute(dbCopy, dsCopy.getStructure(), queryCopy, params.kValue); 
                    break;
                case AlgorithmType.RANGE:
                    iterator = LaesaRangeAlgorithm.execute(dbCopy, dsCopy.getStructure(), queryCopy, params.rangeRadius); 
                    break;
                default: 
                    throw new Error(`Unsupported algorithm type: ${algorithm} for method ${method}`);
            } 
            break;
        case (MethodType.MTREE):
            switch (algorithm) {
                case AlgorithmType.INSERT:
                    iterator = MTreeDynamicInsertAlgorithm.execute(dbCopy, dsCopy.getStructure(), queryCopy); 
                    break;
                case AlgorithmType.KNN:
                    iterator = MTreeKnnAlgorithm.execute(dbCopy, dsCopy.getStructure(), queryCopy, params.kValue); 
                    break;
                case AlgorithmType.RANGE:
                    iterator = MTreeRangeAlgorithm.execute(dbCopy, dsCopy.getStructure(), queryCopy, params.rangeRadius); 
                    break;
                default: 
                    throw new Error(`Unsupported algorithm type: ${algorithm} for method ${method}`);
            } 
            break;
        default:
            throw new Error(`Unsupported method: ${method}`);
    }

    this.algorithmIterator = iterator;
    await this.controller.start(iterator);
  }

  /**
   * Gets the current algorithm iterator
   * 
   * @returns {AsyncGenerator<AlgorithmStep> | null} Iterator or null
   */
  public getIterator(): AsyncGenerator<AlgorithmStep> | null {
    return this.algorithmIterator;
  }

  /**
   * Performs one step of the algorithm
   * 
   * @returns {Promise<AlgorithmStep | null>} Next algorithm step or null
   */
  public step = () => this.controller.step();
  
  /**
   * Pauses algorithm execution
   */
  public pause = () => this.controller.pause();
  
  /**
   * Resumes algorithm execution
   */
  public resume = () => this.controller.resume();
  
  /**
   * Resets algorithm state
   */
  public reset = () => this.controller.reset();
  
  /**
   * Gets the current algorithm controller state
   * 
   * @returns {Object} Algorithm state (isPaused, isRunning)
   */
  public getState = () => this.controller.getState();
}