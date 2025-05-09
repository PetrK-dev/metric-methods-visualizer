import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { BaseMethodContext } from '../../../application/contexts/BaseMethodContext';
import { PseudoCodeRegistry } from '../../../application/services/PseudoCodeRegistry';
import { codeViewerContainer, sectionTitle, sectionDivider, codeContainer, preElement, codeLine } from '../../../assets/styles/code/codeAndData';
import { PSEUDOCODE_CONSTANTS } from '../../../utils/constants';

/**
 * Props interface for the PseudoCodeComponent
 */
interface PseudoCodeProps {
  /** Algorithm context providing access to algorithm type, method, and current step */
  context: BaseMethodContext;
}

/**
 * Component for displaying the pseudocode of the currently selected algorithm.
 * 
 * PseudoCodeComponent displays the pseudocode of the selected algorithm with the following features:
 * - Syntax highlighting (keywords like for, if, while, end...)
 * - Highlighting of the current line corresponding to the algorithm step
 * - Automatic scrolling to the current line during algorithm stepping
 * - Automatic switching of pseudocode when changing algorithm or method
 * 
 * The component retrieves pseudocode from the central PseudoCodeRegistry
 * based on the currently selected metric method and algorithm type.
 * 
 * @param {PseudoCodeProps} props - Props containing the algorithm context
 * @returns {JSX.Element} React component
 */
export const PseudoCodeComponent: React.FC<PseudoCodeProps> = ({ context }) => {
  // Get necessary values from context
  const { algorithm, methodType, displayStep } = context;
  const [pseudoCode, setPseudoCode] = useState<string[]>([]);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const keywords = PSEUDOCODE_CONSTANTS.KEYWORDS;
  
  /**
   * Effect for loading pseudocode when algorithm or method changes
   */
  useEffect(() => {
    setPseudoCode(PseudoCodeRegistry.getPseudoCode(methodType, algorithm));
  }, [methodType, algorithm]);

  /**
   * Effect for scrolling to the current line during algorithm stepping
   */
  useEffect(() => {
    if (activeLineRef.current && codeContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [displayStep]);

  /**
   * Highlights keywords in pseudocode
   * 
   * @param {string} line - Line of pseudocode
   * @returns {string} HTML with highlighted keywords
   */
  const highlightKeywords = (line: string): string => {
    let replaced = line;
    // Replace all keywords with HTML tags
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      replaced = replaced.replace(
        regex,
        match => `<span class="keyword">${match}</span>`
      );
    });

    return replaced;
  };

  return (
    <Box sx={codeViewerContainer}>
      <Typography variant="subtitle1" sx={sectionTitle}>
        Pseudokód
      </Typography>
      <Divider sx={sectionDivider} />
      
      {/* Code container - occupies all remaining space */}
      <Box sx={codeContainer}>
        <pre style={preElement}>
          {pseudoCode.map((line, index) => {
            const isActive = displayStep && index === displayStep.stepNumber;
            
            return (
              <div
                key={index}
                style={codeLine(isActive)}
                dangerouslySetInnerHTML={{ 
                  __html: highlightKeywords(line) 
                }}
              />
            );
          })}
        </pre>
      </Box>
    </Box>
  );
};