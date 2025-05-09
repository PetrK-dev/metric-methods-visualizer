import { createContext, useContext } from "react";
import { BaseMethodContext } from "./BaseMethodContext";
import { createBaseProvider } from "./BaseMethodProvider";
import { DistanceMatrix } from "../../domain/core/data-structures/DistanceMatrix";
import { IDataStructure } from "../../domain/core/data-structures/IDataStructure";
import { Database } from "../../domain/core/database/Database";
import { AlgorithmType } from "../../domain/core/enums/AlgorithmType";
import { MethodType } from "../../domain/core/enums/MethodType";
import { euclideanDistance } from "../../domain/core/functions/distanceFunctions";

/**
 * Extension of the base context with AESA-specific properties and methods.
 * In the current implementation, no special properties are added.
 * AESA (Approximating Eliminating Search Algorithm) is an efficient method
 * that precomputes distances between all objects in the database.
 */
export interface AesaContextType extends BaseMethodContext {}

/**
 * React context for the AESA method.
 */
export const AesaContext = createContext<AesaContextType | undefined>(undefined);

/**
 * Provider component for the AESA method.
 * Initializes the data structure and sets up the context.
 * 
 * AESA uses a distance matrix to store precomputed distances between all objects
 * which enables efficient filtering during similarity searches.
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Nested components
 * @returns {React.ReactElement} Provider component
 */
export const AesaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Configuration for AESA method
  const baseProvider = createBaseProvider<AesaContextType>(
    // Metric method type
    MethodType.AESA,

    // Supported algorithms
    [AlgorithmType.INSERT, AlgorithmType.KNN, AlgorithmType.RANGE],

    // Database initialization (AESA doesn't need special initialization)
    (db: Database) => {},

    // Data structure creation
    () => new DistanceMatrix(euclideanDistance),

    // Data structure initialization
    (ds: IDataStructure<any>, db: Database) => {
      const distanceMatrix = ds as DistanceMatrix;
      distanceMatrix.initializeBase(db);
    }
  )({ children });
  
  // Extend the context with AESA-specific values
  const contextValue: AesaContextType = {
    ...baseProvider.baseContextValue
  };

  return (
    <AesaContext.Provider value={contextValue}>
      {baseProvider.children}
    </AesaContext.Provider>
  );
};

/**
 * Hook for accessing the AESA context.
 * Must be used within a component wrapped in AesaProvider.
 * 
 * @returns {AesaContextType} Context with AESA functionality
 * @throws {Error} If used outside an AesaProvider
 */
export const useAesa = (): AesaContextType => {
  const context = useContext(AesaContext);
  if (!context) {
    throw new Error('useAesa must be used within AesaProvider');
  }
  return context;
};