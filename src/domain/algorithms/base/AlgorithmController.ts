import { AlgorithmStep } from "../../core/models/interfaces/AlgorithmStep";

/**
 * Control component for algorithm execution.
 * Provides an interface for starting, stepping, and pausing
 * algorithms during visualization. Maintains the execution state
 * and ensures access to individual steps.
 */
export class AlgorithmController {
    /** Iterator providing algorithm steps */
    private iterator: AsyncGenerator<AlgorithmStep> | null = null;
    /** Indicator whether the algorithm is paused */
    private isPaused: boolean = false;
    /** Indicator whether the algorithm is currently running */
    private isRunning: boolean = false;
    
    /**
     * Initializes the algorithm with the given step iterator.
     * Sets the default algorithm state.
     * 
     * @param {AsyncGenerator<AlgorithmStep>} iterator - Generator of algorithm steps
     * @returns {Promise<void>}
     */
    public async start(iterator: AsyncGenerator<AlgorithmStep>): Promise<void> {
      this.iterator = iterator;
      this.isPaused = false;
      this.isRunning = false;
    }
  
    /**
     * Performs one step of the algorithm.
     * If the algorithm has reached the end, sets isRunning to false
     * and returns null.
     * 
     * @returns {Promise<AlgorithmStep | null>} Next algorithm step or null
     */
    public async step(): Promise<AlgorithmStep | null> {
      if (!this.iterator) return null;
      
      const result = await this.iterator.next();
      if (!result.done) {
        return result.value;
      }
      this.isRunning = false;
      return null;
    }
  
    /**
     * Pauses the algorithm execution.
     * Sets the isPaused flag to true and isRunning to false.
     */
    public pause(): void {
      this.isPaused = true;
      this.isRunning = false;
    }
  
    /**
     * Resumes the algorithm execution.
     * Sets the isPaused flag to false and isRunning to true.
     */
    public resume(): void {
      this.isPaused = false;
      this.isRunning = true;
    }
  
    /**
     * Resets the algorithm to its initial state.
     * Removes the iterator and sets flags to false.
     */
    public reset(): void {
      this.iterator = null;
      this.isPaused = false;
      this.isRunning = false;
    }

    /**
     * Returns the current state of the algorithm.
     * 
     * @returns {{ isPaused: boolean; isRunning: boolean }} Object with algorithm state
     */
    public getState(): { isPaused: boolean; isRunning: boolean } {
      return {
        isPaused: this.isPaused,
        isRunning: this.isRunning
      };
    }
}