import React from 'react';
import { useAesa, AesaProvider } from '../../../application/contexts/AesaContext';
import MetricMethodLayout from '../template/MetricMethodLayout';

/**
 * Inner content component for the AESA page.
 * Consumes the context from AesaProvider and passes it to the shared layout.
 * 
 * This component acts as a bridge between the context provider and the layout,
 * allowing for proper context consumption and dependency injection.
 * 
 * @returns {JSX.Element} AESA page content with visualization and control elements
 */
const AesaPageContent: React.FC = () => {
  const aesaContext = useAesa();
  
  return (
    <MetricMethodLayout
      context={aesaContext} 
      pageTitle="AESA Metoda" 
    />
  );
};


/**
 * Page component for visualization and demonstration of the AESA method.
 * 
 * AESA (Approximating Eliminating Search Algorithm) is one of the most efficient
 * metric methods in terms of distance computation count. This page provides
 * an interactive visualization of the algorithm including its distance matrix and
 * allows users to observe each step of kNN, range query, and dynamic insertion algorithms.
 * 
 * The component follows the provider pattern, where AesaProvider supplies the context
 * that contains all necessary state and functionality for the visualization.
 * 
 * @returns {JSX.Element} Page with interactive visualization of the AESA method
 */
const AesaPage: React.FC = () => {
  return (
    <AesaProvider>
      <AesaPageContent />
    </AesaProvider>
  );
};

export default AesaPage;