import React from 'react';
import MetricMethodLayout from '../template/MetricMethodLayout';
import { useLaesa, LaesaProvider } from '../../../application/contexts/LaesaContext';

/**
 * Inner content component for the LAESA page.
 * Consumes the context from LaesaProvider and passes it to the shared layout.
 * 
 * This component acts as a bridge between the context provider and the layout,
 * allowing for proper context consumption and dependency injection.
 * 
 * @returns {JSX.Element} LAESA page content with visualization and control elements
 */
const LaesaPageContent: React.FC = () => {
  const laesaContext = useLaesa();
  
  return (
    <MetricMethodLayout
      context={laesaContext} 
      pageTitle="LAESA" 
    />
  );
};

/**
 * Page component for visualization and demonstration of the LAESA method.
 * 
 * LAESA (Linear AESA) is an optimized version of AESA that reduces memory 
 * complexity to O(kn), where k is the number of pivots. Instead of precomputing
 * all distances, it only stores distances to selected pivot points. This page
 * provides an interactive visualization of this method and its algorithms.
 * 
 * The component follows the provider pattern, where LaesaProvider supplies the context
 * that contains all necessary state and functionality for the visualization.
 * 
 * @returns {JSX.Element} Page with interactive visualization of the LAESA method
 */
const LaesaPage: React.FC = () => {
  return (
    <LaesaProvider>
      <LaesaPageContent />
    </LaesaProvider>
  );
};

export default LaesaPage;