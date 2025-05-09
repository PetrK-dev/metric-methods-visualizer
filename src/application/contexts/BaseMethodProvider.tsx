import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { BaseMethodContext } from './BaseMethodContext';
import { PlaybackState, algorithmPlayback } from '../services/AlgorithmPlayback';
import { IDataStructure } from '../../domain/core/data-structures/IDataStructure';
import { Database } from '../../domain/core/database/Database';
import { AlgorithmType } from '../../domain/core/enums/AlgorithmType';
import { MethodType } from '../../domain/core/enums/MethodType';
import { VisualType } from '../../domain/core/enums/VisualType';
import { AlgorithmStep } from '../../domain/core/models/interfaces/AlgorithmStep';
import { Point } from '../../domain/core/models/Point';
import { DEFAULT_K_VALUE, DEFAULT_POINT_COUNT, DEFAULT_RANGE_RADIUS, DEFAULT_SPEED } from '../../utils/constants';

/**
 * Factory function to create a base context provider for metric methods.
 * Provides core functionality for algorithm control, state management, and visualization.
 * 
 * @template T Type of context extending BaseMethodContext
 * @param {MethodType} methodType - Type of metric method (AESA, LAESA, M-Tree)
 * @param {AlgorithmType[]} availableAlgorithms - Array of supported algorithms
 * @param {Function} initializeDatabase - Function for database initialization
 * @param {Function} createDataStructure - Function for data structure creation
 * @param {Function} initializeDataStructure - Function for data structure initialization
 * @returns {Function} React provider component with configured context
 */
export const createBaseProvider = <T extends BaseMethodContext>(
    methodType: MethodType,
    availableAlgorithms: AlgorithmType[],
    initializeDatabase: (db: Database) => void,
    createDataStructure: () => IDataStructure<any>,
    initializeDataStructure: (ds: IDataStructure<any>, db: Database) => void
  ) => {
    /**
     * Provider component for the given metric method
     * 
     * @param {Object} props - Component properties
     * @param {React.ReactNode} props.children - Nested components
     * @param {any} props.additionalProps - Optional additional properties
     * @returns {Object} Object with context and other properties for use in specific providers
     */
    return ({ children, additionalProps }: { children: React.ReactNode, additionalProps?: any }) => {
      // Basic states
      /** Currently selected algorithm */
      const [algorithm, setAlgorithm] = useState<AlgorithmType>(availableAlgorithms ? availableAlgorithms[0] : AlgorithmType.DEFAULT);
      /** Number of points in the database */
      const [pointCount, setPointCount] = useState<number>(DEFAULT_POINT_COUNT);
      /** Instance of the point database */
      const [database] = useState(new Database());
      
      /** Query point for algorithms */
      const [queryPoint, setQueryPoint] = useState<Point>(database.getQuery());
      /** Data structure specific to the given metric method */
      const [dataStructure] = useState<IDataStructure<any>>(createDataStructure());
      
      // Algorithm parameters
      /** k-value for kNN algorithm */
      const [kValue, setKValue] = useState<number>(DEFAULT_K_VALUE);
      /** Radius for Range Query algorithm */
      const [rangeRadius, setRangeRadius] = useState<number>(DEFAULT_RANGE_RADIUS);

      /** Current algorithm playback state */
      const [playbackState, setPlaybackState] = useState<PlaybackState>(algorithmPlayback.getState());
      /** Algorithm playback speed */
      const [speed, setSpeedState] = useState<number>(DEFAULT_SPEED);
      
      /** Current algorithm step */
      const [currentAlgorithmStep, setCurrentAlgorithmStep] = useState<AlgorithmStep | null>(null);
  
      /**
       * Database and data structure initialization when the provider is created
       */
      useEffect(() => {
          initializeDatabase(database);
          initializeDataStructure(dataStructure, database);
        }, [dataStructure, database]);
      
      /**
       * Point generation and reinitialization when the point count changes
       */
      useEffect(() => {
          database.generatePoints(pointCount);
          initializeDatabase(database);
          initializeDataStructure(dataStructure, database);
          setQueryPoint(database.getQuery());
        }, [pointCount, database, dataStructure]);

      /**
       * Setting callbacks for the AlgorithmPlayback service
       */
      useEffect(() => {
          algorithmPlayback.setStepCallback(setCurrentAlgorithmStep);
          algorithmPlayback.setStateCallback(setPlaybackState);
        }, []);
  
      /**
       * Creating a default algorithm step for display
       * when the algorithm hasn't been started yet or has been reset
       */
      const offlineStep = useMemo(() => {
        // Basic step for visualization
        const step: AlgorithmStep = {
          stepNumber: -1,
          database: database,
          activePoints: [],
          eliminatedPoints: [],
          resultPoints: [],
          distances: [],
          circles: [],
          dataStructure: dataStructure
        };
  
        // Get visualization elements from the data structure
        const visualization = dataStructure.getInitialVisualization();
        step.distances = visualization.distances;
        step.circles = visualization.circles;

        // For Range Query, we show the query circle even in offline mode
        if (algorithm === AlgorithmType.RANGE) {
          step.circles.push({ center: queryPoint, radius: rangeRadius, type: VisualType.RANGE_QUERY });
        }
  
        return step
      }, [algorithm, dataStructure, database, queryPoint, rangeRadius]);
  
      /** Algorithm step for current display (current or default) */
      const displayStep = currentAlgorithmStep || offlineStep;
  
      /**
       * Starts algorithm playback
       * @returns {Promise<void>}
       */
      const handlePlay = useCallback(async () => {
        return algorithmPlayback.play({
          method: methodType,
          algorithm,
          database,
          dataStructure,
          queryPoint,
          kValue,
          rangeRadius
        });
      }, [algorithm, database, dataStructure, queryPoint, kValue, rangeRadius]);
      
      /**
       * Performs one step of the algorithm
       * @returns {Promise<void>}
       */
      const handleStep = useCallback(async () => {
        return algorithmPlayback.step({
          method: methodType,
          algorithm,
          database,
          dataStructure,
          queryPoint,
          kValue,
          rangeRadius
        });
      }, [algorithm, database, dataStructure, queryPoint, kValue, rangeRadius]);
      
      /**
       * Pauses algorithm playback
       */
      const handlePause = useCallback(() => {
        algorithmPlayback.pause();
      }, []);
      
      /**
       * Resets the algorithm to its initial state
       */
      const handleReset = useCallback(() => {
        algorithmPlayback.reset();
      }, []);
      
      /**
       * Sets the algorithm playback speed
       * @param {number} newSpeed - New speed (multiplier)
       */
      const handleSetSpeed = useCallback((newSpeed: number) => {
        setSpeedState(newSpeed);
        algorithmPlayback.setSpeed(newSpeed);
      }, []);
  
      /**
       * Base context with values and methods for algorithm control
       * This object will be extended in specific providers
       */
      const baseContextValue: BaseMethodContext = {
        algorithm,
        availableAlgorithms,
        queryPoint,
        pointCount,
        database,
        dataStructure,
        isRunning: playbackState !== PlaybackState.IDLE,
        isAutoPlaying: playbackState === PlaybackState.PLAYING,
        isFinished: playbackState === PlaybackState.FINISHED,
        speed,
        currentAlgorithmStep,
        displayStep,
        methodType: methodType,
  
        kValue,
        rangeRadius,
        
        setAlgorithm,
        setQueryPoint,
        setPointCount,
        setKValue,
        setRangeRadius,
        
        onPlay: handlePlay,
        onPause: handlePause,
        onStep: handleStep,
        onReset: handleReset,
        setSpeed: handleSetSpeed
      };
  
      /**
       * Return object for creating specific providers
       * Contains the base context, data, and methods needed for extension
       */
      return {
        children,
        baseContextValue,
        database,
        dataStructure
      };
    };
  };