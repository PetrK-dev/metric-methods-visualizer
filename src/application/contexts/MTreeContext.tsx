import React, { createContext, useContext } from 'react';
import { AesaContextType } from './AesaContext';
import { BaseMethodContext } from './BaseMethodContext';
import { createBaseProvider } from './BaseMethodProvider';
import { IDataStructure } from '../../domain/core/data-structures/IDataStructure';
import { Tree } from '../../domain/core/data-structures/Tree';
import { Database } from '../../domain/core/database/Database';
import { AlgorithmType } from '../../domain/core/enums/AlgorithmType';
import { MethodType } from '../../domain/core/enums/MethodType';
import { euclideanDistance } from '../../domain/core/functions/distanceFunctions';

/**
 * Extension of the base context with M-Tree specific properties and methods.
 * M-Tree is a hierarchical tree structure for metric spaces that enables
 * efficient indexing and searching for similar objects.
 */
export interface MTreeContextType extends BaseMethodContext {}

/**
 * React context for the M-Tree method.
 */
export const MTreeContext = createContext<MTreeContextType | undefined>(undefined);

/**
 * Provider component for the M-Tree method.
 * Initializes the tree data structure and sets up the context.
 * 
 * M-Tree is a dynamic indexing structure that organizes metric space
 * into a tree hierarchy and supports efficient similarity search and dynamic operations.
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Nested components
 * @returns {React.ReactElement} Provider component
 */
export const MTreeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const baseProvider = createBaseProvider<AesaContextType>(
      // Metric method type
      MethodType.MTREE,
  
      // Supported algorithms
      [AlgorithmType.INSERT, AlgorithmType.KNN, AlgorithmType.RANGE],
  
      /**
       * Database initialization for M-Tree
       * M-Tree doesn't need special database preparation
       * @param {Database} db - Point database
       */
      (db: Database) => {},
  
      /**
       * Creation of data structure for M-Tree
       * M-Tree uses a tree structure instead of a distance matrix
       * @returns {Tree} New instance of M-Tree structure
       */
      () => new Tree(euclideanDistance),
  
      /**
       * Initialization of data structure for M-Tree
       * Creates an initial tree from all points in the database
       * @param {IDataStructure<any>} ds - Data structure (Tree)
       * @param {Database} db - Point database
       */
      (ds: IDataStructure<any>, db: Database) => {
        const dataStructure = ds as Tree;
        dataStructure.initializeBase(db);
      }
    )({ children });
  
  // Extend the base context with M-Tree specific values
  const contextValue: MTreeContextType = {
    ...baseProvider.baseContextValue,
  };

  return (
    <MTreeContext.Provider value={contextValue}>
      {baseProvider.children}
    </MTreeContext.Provider>
  );
};

/**
 * Hook for accessing the M-Tree context.
 * Must be used within a component wrapped in MTreeProvider.
 * 
 * @returns {MTreeContextType} Context with M-Tree functionality
 * @throws {Error} If used outside an MTreeProvider
 */
export const useMTree = (): MTreeContextType => {
  const context = useContext(MTreeContext);
  if (!context) {
    throw new Error('useMTree must be used within MTreeProvider');
  }
  return context;
};