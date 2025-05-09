import React from 'react';
import MetricMethodLayout from '../template/MetricMethodLayout';
import { DefaultMethodProvider, useDefaultMethod } from '../../../application/contexts/DefaultContext';

/**
 * Inner content component for the Default Method page.
 * Consumes the context from DefaultMethodProvider and passes it to the shared layout.
 * 
 * @returns {JSX.Element} Default method page content with visualization and control elements
 */
const DefaultMethodPageContent: React.FC = () => {
  const defaultContext = useDefaultMethod();
  
  return (
    <MetricMethodLayout
      context={defaultContext} 
      pageTitle="Defaultní metoda" 
    />
  );
};

/**
 * Template page component for developing new metric methods.
 * 
 * This component serves as a starting point for implementing new metric methods
 * in the application. Developers can use this template by simply changing the
 * names and context to match their new method.
 * 
 * The component follows the same provider pattern used by other method pages,
 * maintaining consistency throughout the application.
 * 
 * @returns {JSX.Element} Template page with basic visualization structure for new metric methods
 */
const DefaultMethodPage: React.FC = () => {
  return (
    <DefaultMethodProvider>
      <DefaultMethodPageContent />
    </DefaultMethodProvider>
  );
};

export default DefaultMethodPage;