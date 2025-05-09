import React, { createContext, useContext } from 'react';
import { AesaContextType } from './AesaContext';
import { BaseMethodContext } from './BaseMethodContext';
import { createBaseProvider } from './BaseMethodProvider';
import { DistanceMatrix } from '../../domain/core/data-structures/DistanceMatrix';
import { IDataStructure } from '../../domain/core/data-structures/IDataStructure';
import { Database } from '../../domain/core/database/Database';
import { AlgorithmType } from '../../domain/core/enums/AlgorithmType';
import { MethodType } from '../../domain/core/enums/MethodType';
import { euclideanDistance } from '../../domain/core/functions/distanceFunctions';

/**
 * Extension of the base context with LAESA-specific properties and methods.
 * LAESA (Linear AESA) is a variant of AESA that optimizes memory complexity
 * by precomputing distances only to selected pivot points.
 */
export interface LaesaContextType extends BaseMethodContext {}

/**
 * React context for the LAESA method.
 */
export const LaesaContext = createContext<LaesaContextType | undefined>(undefined);

/**
 * Provider component for the LAESA method.
 * Initializes the data structure with pivots and sets up the context.
 * 
 * LAESA (Linear AESA) reduces memory complexity from O(n²) to O(k·n),
 * where k is the number of pivots and n is the number of objects in the database.
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Nested components
 * @returns {React.ReactElement} Provider component
 */
export const LaesaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // Use the base provider
  const baseProvider = createBaseProvider<AesaContextType>(
      // Metric method type
      MethodType.LAESA,
  
      // Supported algorithms
      [AlgorithmType.INSERT, AlgorithmType.KNN, AlgorithmType.RANGE],
  
      /**
       * Database initialization for LAESA - setting up pivots
       * LAESA uses selected pivots to reduce the number of precomputed distances
       * @param {Database} db - Point database
       */
      (db: Database) => {
        // Set the first two points as pivots
        db.setPivots([0,1]);
      },
  
      /**
       * Creation of data structure for LAESA
       * LAESA uses a distance matrix just like AESA
       * @returns {DistanceMatrix} New instance of the distance matrix
       */
      () => new DistanceMatrix(euclideanDistance),
  
      /**
       * Initialization of data structure for LAESA
       * Precomputes distances between pivots and other points
       * @param {IDataStructure<any>} ds - Data structure (DistanceMatrix)
       * @param {Database} db - Point database
       */
      (ds: IDataStructure<any>, db: Database) => {
        const distanceMatrix = ds as DistanceMatrix;
        distanceMatrix.initializeBase(db);
      }
    )({ children });
  
  // Extend the base context with LAESA-specific values
  const contextValue: LaesaContextType = {
    ...baseProvider.baseContextValue,
  };

  return (
    <LaesaContext.Provider value={contextValue}>
      {baseProvider.children}
    </LaesaContext.Provider>
  );
};

/**
 * Hook for accessing the LAESA context.
 * Must be used within a component wrapped in LaesaProvider.
 * 
 * @returns {LaesaContextType} Context with LAESA functionality
 * @throws {Error} If used outside a LaesaProvider
 */
export const useLaesa = (): LaesaContextType => {
  const context = useContext(LaesaContext);
  if (!context) {
    throw new Error('useLaesa must be used within LaesaProvider');
  }
  return context;
};