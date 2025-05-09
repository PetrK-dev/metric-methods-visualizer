// DefaultMethodContext.tsx
import { createContext, useContext } from "react";
import { BaseMethodContext } from "./BaseMethodContext";
import { createBaseProvider } from "./BaseMethodProvider";
import { DefaultDataStructure } from "../../domain/core/data-structures/DefaultDataStructure";
import { IDataStructure } from "../../domain/core/data-structures/IDataStructure";
import { Database } from "../../domain/core/database/Database";
import { MethodType } from "../../domain/core/enums/MethodType";
import { AlgorithmType } from "../../domain/core/enums/AlgorithmType";

/**
 * Extension of the base context with default method-specific properties.
 * Used as a simple implementation for testing and demonstration purposes.
 */
export interface DefaultMethodContextType extends BaseMethodContext {}

/**
 * React context for the default method.
 */
export const DefaultMethodContext = createContext<DefaultMethodContextType | undefined>(undefined);

/**
 * Provider component for the default method.
 * Initializes a basic data structure and sets up the context.
 * This provider serves as a simplified implementation for testing
 * and as a template for other metric methods.
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Nested components
 * @returns {React.ReactElement} Provider component
 */
export const DefaultMethodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const baseProvider = createBaseProvider<DefaultMethodContextType>(
    // Metric method type
    MethodType.DEFAULT,

    // Supported algorithms
    [AlgorithmType.DEFAULT],

    // Database initialization (empty implementation)
    (db: Database) => {},

    // Data structure creation
    () => new DefaultDataStructure(),

    // Data structure initialization (empty implementation)
    (ds: IDataStructure<any>, db: Database) => {}

  )({ children });
  
  // Create context value
  const contextValue: DefaultMethodContextType = {
    ...baseProvider.baseContextValue
  };

  return (
    <DefaultMethodContext.Provider value={contextValue}>
      {baseProvider.children}
    </DefaultMethodContext.Provider>
  );
};

/**
 * Hook for accessing the default method context.
 * Must be used within a component wrapped in DefaultMethodProvider.
 * 
 * @returns {DefaultMethodContextType} Context with default method functionality
 * @throws {Error} If used outside a DefaultMethodProvider
 */
export const useDefaultMethod = (): DefaultMethodContextType => {
  const context = useContext(DefaultMethodContext);
  if (!context) {
    throw new Error('useDefaultMethod must be used within DefaultMethodProvider');
  }
  return context;
};