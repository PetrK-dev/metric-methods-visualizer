import React from 'react';
import { Box, Button, ButtonGroup, Slider, Tooltip, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { BaseMethodContext } from '../../../application/contexts/BaseMethodContext';
import { controlsFlexContainer, controlButtonGroup } from '../../../assets/styles/controls/controlsStyles';
import { MIN_SPEED, MAX_SPEED, SPEED_STEP } from '../../../utils/constants';

/**
 * Props for the PlaybackControls component
 */
interface PlaybackControlsProps {
    /** Algorithm context providing access to control methods and states */
    context: BaseMethodContext;
}
  
/**
 * Component for controlling algorithm execution.
 * Provides buttons for starting, pausing, stepping and restarting the algorithm,
 * as well as a slider for adjusting playback speed.
 * 
 * @param {PlaybackControlsProps} props - Props containing the algorithm context
 * @returns {JSX.Element} The playback control component
 */
export const PlaybackControls: React.FC<PlaybackControlsProps> = ({ context }) => {
    const { isRunning, isAutoPlaying, isFinished, speed, onPlay, onPause, onStep, onReset, setSpeed } = context;

    /**
     * Handles changes to the speed slider position.
     * 
     * @param {Event} _event - Change event (not used)
     * @param {number | number[]} newValue - New speed value
     */
    const handleSpeedChange = (_event: Event, newValue: number | number[]) => {
      setSpeed(newValue as number);
    };
  
    return (
      <>
        <Box sx={controlsFlexContainer}>
              <ButtonGroup variant="contained" size="small" sx={controlButtonGroup}>
            <Tooltip title="Restart">
              <Button onClick={onReset} disabled={!isRunning}>
                <RestartAltIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Pauza">
              <Button onClick={onPause} disabled={isFinished}>
                <PauseIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Přehrát">
              <Button onClick={onPlay} disabled={isFinished || isAutoPlaying}>
                <PlayArrowIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Krok vpřed">
              <Button onClick={onStep} disabled={isAutoPlaying || isFinished}>
                <ArrowForwardIosIcon fontSize="small" />
              </Button>
            </Tooltip>
          </ButtonGroup>
        
            
        <Typography variant="body2" sx={{ mr: 1 }}>Rychlost:</Typography>
              <Slider
                value={speed}
                onChange={handleSpeedChange}
                min={MIN_SPEED}
                max={MAX_SPEED}
                step={SPEED_STEP}
                sx={{ width: 100, m: 1, mr: 2 }}
              />
              <Typography variant="body2">{speed.toFixed(1)}x</Typography>
            </Box>
      </>
    );
};