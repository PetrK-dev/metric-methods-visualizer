import { AlgorithmType } from "../../domain/core/enums/AlgorithmType";

/**
 * Interface for algorithm metadata.
 * Contains information about the algorithm, its description, and supported methods.
 */
interface AlgorithmTypeMetadata {
  /** Algorithm type (INSERT, KNN, RANGE) */
  type: AlgorithmType;
  /** Display name of the algorithm */
  label: string;
  /** Algorithm description */
  description: string;
}

/**
 * Class for the algorithm type registry.
 * Provides information about available algorithms, their
 * descriptions, and supported metric methods.
 */
class AlgorithmRegistryTypeClass {
  /** Array of registered algorithms */
  private algorithms: AlgorithmTypeMetadata[] = [];

  /**
   * Creates a new instance of the registry and initializes basic algorithms
   */
  constructor() {
    // Initialize with basic algorithms
    this.registerAlgorithm({
      type: AlgorithmType.INSERT,
      label: 'Dynamic Insert',
      description: 'Algorithm for dynamically inserting points into metric space',
    });

    this.registerAlgorithm({
      type: AlgorithmType.KNN,
      label: 'kNN Query',
      description: 'Finding k nearest neighbors to the query point',
    });

    this.registerAlgorithm({
      type: AlgorithmType.RANGE,
      label: 'Range Query',
      description: 'Finding all points within a specified range from the query point',
    });
  }

  /**
   * Registers a new algorithm or updates an existing one.
   * 
   * @param {AlgorithmTypeMetadata} metadata - Algorithm metadata
   */
  public registerAlgorithm(metadata: AlgorithmTypeMetadata): void {
    // Check if it already exists
    const existingIndex = this.algorithms.findIndex(alg => alg.type === metadata.type);
    if (existingIndex >= 0) {
      // Update existing
      this.algorithms[existingIndex] = metadata;
    } else {
      // Add new
      this.algorithms.push(metadata);
    }
  }

  /**
   * Gets metadata for all registered algorithms.
   * 
   * @returns {AlgorithmTypeMetadata[]} Array of algorithm metadata
   */
  public getAllAlgorithms(): AlgorithmTypeMetadata[] {
    return [...this.algorithms];
  }

  /**
   * Gets metadata for algorithms supported by a given list of algorithm types.
   * 
   * @param {AlgorithmType[]} algs - Array of algorithm types
   * @returns {AlgorithmTypeMetadata[]} Array of algorithm metadata
   */
  public getAlgorithmsData(algs: AlgorithmType[]): AlgorithmTypeMetadata[] {
    return this.algorithms.filter(alg => algs.includes(alg.type));
  }
}

/**
 * Singleton instance of the algorithm type registry.
 * Used throughout the application to access algorithm metadata.
 */
export const AlgorithmTypeRegistry = new AlgorithmRegistryTypeClass();