import { PSEUDOCODE_AESA_DYNAMIC_INSERT, PSEUDOCODE_AESA_KNN, PSEUDOCODE_AESA_RANGE } from "../../domain/algorithms/AESA/aesa-pseudocodes";
import { PSEUDOCODE_DEFAULT } from "../../domain/algorithms/base/DefaultAlgorithm";
import { PSEUDOCODE_LAESA_DYNAMIC_INSERT, PSEUDOCODE_LAESA_KNN, PSEUDOCODE_LAESA_RANGE } from "../../domain/algorithms/LAESA/laesa-pseudocodes";
import { PSEUDOCODE_MTREE_DYNAMIC_INSERT, PSEUDOCODE_MTREE_KNN, PSEUDOCODE_MTREE_RANGE } from "../../domain/algorithms/MTREE/mtree-pseudocodes";
import { AlgorithmType } from "../../domain/core/enums/AlgorithmType";
import { MethodType } from "../../domain/core/enums/MethodType";

/**
 * Class for the pseudocode registry of metric methods.
 * Provides access to pseudocodes for various metric methods and algorithm types.
 */
class PseudoCodeRegistryClass {
  /**
   * Gets the pseudocode for a given method and algorithm.
   * 
   * @param {MethodType} method - Metric method type (AESA, LAESA, MTREE)
   * @param {AlgorithmType} algorithm - Algorithm type (INSERT, KNN, RANGE)
   * @returns {string[]} Array of pseudocode lines
   */
  public getPseudoCode(method: MethodType, algorithm: AlgorithmType): string[] {
    switch (method) {
        case (MethodType.DEFAULT):
          switch (algorithm) {
            case AlgorithmType.DEFAULT:
                return PSEUDOCODE_DEFAULT;
              default:
            return [`Pseudocode not defined - algorithm: ${algorithm} method: ${method}`];
          }
        case (MethodType.AESA):
          switch (algorithm) {
            case AlgorithmType.INSERT:
                return PSEUDOCODE_AESA_DYNAMIC_INSERT;
            case AlgorithmType.KNN:
                return PSEUDOCODE_AESA_KNN;
            case AlgorithmType.RANGE:
              return PSEUDOCODE_AESA_RANGE;
              default:
                return [`Pseudocode not defined - algorithm: ${algorithm} method: ${method}`];
          }
        case (MethodType.LAESA):
          switch (algorithm) {
            case AlgorithmType.INSERT:
                return PSEUDOCODE_LAESA_DYNAMIC_INSERT;
            case AlgorithmType.KNN:
                return PSEUDOCODE_LAESA_KNN;
            case AlgorithmType.RANGE:
              return PSEUDOCODE_LAESA_RANGE;
            default:
              return [`Pseudocode not defined - algorithm: ${algorithm} method: ${method}`];
        }
        case (MethodType.MTREE):
          switch (algorithm) {
            case AlgorithmType.INSERT:
                return PSEUDOCODE_MTREE_DYNAMIC_INSERT;
            case AlgorithmType.KNN:
                return PSEUDOCODE_MTREE_KNN;
            case AlgorithmType.RANGE:
              return PSEUDOCODE_MTREE_RANGE;
            default:
              return [`Pseudocode not defined - algorithm: ${algorithm} method: ${method}`];
        }
        default:
          return [`Method ${method} is not found in the pseudocode registry`];
      }
  }
}

/**
 * Singleton instance of the pseudocode registry.
 * Used throughout the application to access algorithm pseudocodes.
 */
export const PseudoCodeRegistry = new PseudoCodeRegistryClass();