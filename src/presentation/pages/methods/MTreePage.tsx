import React from 'react';
import MetricMethodLayout from '../template/MetricMethodLayout';
import { useMTree, MTreeProvider } from '../../../application/contexts/MTreeContext';

/**
 * Inner content component for the M-Tree page.
 * Consumes the context from MTreeProvider and passes it to the shared layout.
 * 
 * This component acts as a bridge between the context provider and the layout,
 * allowing for proper context consumption and dependency injection.
 * 
 * @returns {JSX.Element} M-Tree page content with visualization and control elements
 */
const MTreePageContent: React.FC = () => {
    const mtreeContext = useMTree();
    
    return (
      <MetricMethodLayout
        context={mtreeContext} 
        pageTitle="M-Tree" 
      />
    );
  };
  
/**
 * Page component for visualization and demonstration of the M-Tree method.
 * 
 * M-Tree is a dynamic tree structure optimized for metric spaces.
 * It organizes data hierarchically, which enables efficient pruning during search operations.
 * Unlike AESA and LAESA, it supports efficient dynamic operations. This page
 * provides an interactive visualization of the tree structure and its algorithms.
 * 
 * The component follows the provider pattern, where MTreeProvider supplies the context
 * that contains all necessary state and functionality for the visualization.
 * 
 * @returns {JSX.Element} Page with interactive visualization of the M-Tree method
 */
const MTreePage: React.FC = () => {
    return (
      <MTreeProvider>
        <MTreePageContent />
      </MTreeProvider>
    );
  };
  
  export default MTreePage;