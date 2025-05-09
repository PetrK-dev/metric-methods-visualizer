import { AlgorithmParams } from "../../domain/core/models/interfaces/AlgorithmParams";
import { AlgorithmStep } from "../../domain/core/models/interfaces/AlgorithmStep";
import { AlgorithmRegistry } from "./AlgorithmRegistry";

/**
 * Algorithm playback states.
 * Represents possible states in which an algorithm can be.
 */
export enum PlaybackState {
  /** Algorithm is not running - default state */
  IDLE,
  /** Algorithm is running automatically */
  PLAYING,
  /** Algorithm is paused but initialized */
  PAUSED,
  /** Algorithm has completed its execution */
  FINISHED
}

/**
 * Class for controlling algorithm playback.
 * Provides an interface for starting, pausing, and stepping through algorithms,
 * tracking state changes, and sending notifications about changes.
 */
export class AlgorithmPlayback {
  /** Current state of the playback */
  private state: PlaybackState = PlaybackState.IDLE;
  /** Registry for accessing algorithms */
  private registry: AlgorithmRegistry;
  /** Controller for interrupting asynchronous algorithm execution */
  private abortController: AbortController | null = null;
  /** Playback speed (multiplier) */
  private speed: number = 1;
  /** Callback for algorithm step changes */
  private onStepChange: ((step: AlgorithmStep | null) => void) | null = null;
  /** Callback for playback state changes */
  private onStateChange: ((state: PlaybackState) => void) | null = null;
  
  /**
   * Creates a new instance of algorithm playback controller
   */
  constructor() {
    this.registry = new AlgorithmRegistry();
  }
  
  /**
   * Sets the callback for algorithm step changes.
   * This callback is called on each step change during algorithm execution.
   * 
   * @param {Function} callback - Function called when the step changes
   */
  public setStepCallback(callback: (step: AlgorithmStep | null) => void): void {
    this.onStepChange = callback;
  }
  
  /**
   * Sets the callback for playback state changes.
   * This callback is called on each state change (IDLE, PLAYING, PAUSED, FINISHED).
   * 
   * @param {Function} callback - Function called when the state changes
   */
  public setStateCallback(callback: (state: PlaybackState) => void): void {
    this.onStateChange = callback;
  }
  
  /**
   * Starts the algorithm (initializes or resumes automatic playback).
   * If the algorithm was not started, initializes it with the given parameters.
   * If it was paused, resumes playback.
   * 
   * @param {AlgorithmParams} params - Algorithm parameters
   * @returns {Promise<void>}
   */
  public async play(params?: AlgorithmParams): Promise<void> {
    // If the state is FINISHED, we cannot continue
    if (this.state === PlaybackState.FINISHED) return;
    
    // If the algorithm is already running, do nothing
    if (this.state === PlaybackState.PLAYING) return;
    
    // If we don't have an initialized algorithm, initialize it
    if (this.state === PlaybackState.IDLE && params) {
      await this.registry.start(params);
    }
    
    this.setState(PlaybackState.PLAYING);
    this.abortController = new AbortController();
    
    // Start automatic playback
    this.runLoop(this.abortController.signal);
  }
  
  /**
   * Pauses algorithm playback.
   * If the algorithm is not in the PLAYING state, this method does nothing.
   */
  public pause(): void {
    if (this.state !== PlaybackState.PLAYING) return;
    
    this.setState(PlaybackState.PAUSED);
    this.registry.pause();
    
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
  
  /**
   * Performs a single step of the algorithm.
   * If the algorithm was not started, initializes it with the given parameters.
   * 
   * @param {AlgorithmParams} params - Algorithm parameters
   * @returns {Promise<void>}
   */
  public async step(params?: AlgorithmParams): Promise<void> {
    // If the algorithm is finished, no further steps can be performed
    if (this.state === PlaybackState.FINISHED) return;
    
    // If the algorithm is running, it doesn't make sense to do a manual step
    if (this.state === PlaybackState.PLAYING) return;
    
    // If we don't have an initialized algorithm, initialize it
    if (this.state === PlaybackState.IDLE && params) {
      await this.registry.start(params);
      this.setState(PlaybackState.PAUSED);
    }
    
    const step = await this.registry.step();
    
    if (step === null) {
      this.setState(PlaybackState.FINISHED);
    } else if (this.onStepChange) {
      this.onStepChange(step);
    }
  }
  
  /**
   * Resets the algorithm to its initial state.
   * Cancels all ongoing operations and sets the state to IDLE.
   */
  public reset(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    
    this.registry.reset();
    this.setState(PlaybackState.IDLE);
    
    if (this.onStepChange) {
      this.onStepChange(null);
    }
  }
  
  /**
   * Sets the algorithm playback speed.
   * 
   * @param {number} speed - Speed multiplier (1 = normal speed)
   */
  public setSpeed(speed: number): void {
    this.speed = speed;
  }
  
  /**
   * Gets the current playback state.
   * 
   * @returns {PlaybackState} Current state
   */
  public getState(): PlaybackState {
    return this.state;
  }
  
  /**
   * Sets the internal state and triggers the callback if it exists.
   * 
   * @param {PlaybackState} state - New state
   * @private
   */
  private setState(state: PlaybackState): void {
    this.state = state;
    
    if (this.onStateChange) {
      this.onStateChange(state);
    }
  }
  
  /**
   * Implementation of automatic algorithm playback in a loop.
   * The loop continues as long as the state is PLAYING and no interruption is signaled.
   * 
   * @param {AbortSignal} signal - Signal for interrupting the loop
   * @returns {Promise<void>}
   * @private
   */
  private async runLoop(signal: AbortSignal): Promise<void> {
    while (this.state === PlaybackState.PLAYING && !signal.aborted) {
      const step = await this.registry.step();
      
      if (step === null) {
        this.setState(PlaybackState.FINISHED);
        break;
      }
      
      if (this.onStepChange) {
        this.onStepChange(step);
      }
      
      if (signal.aborted) break;
      
      // Pause before the next step based on speed
      await new Promise(resolve => setTimeout(resolve, 1000 / this.speed));
    }
  }
}

/**
 * Singleton instance of the algorithm playback controller.
 * Used throughout the application to control algorithm playback.
 */
export const algorithmPlayback = new AlgorithmPlayback();