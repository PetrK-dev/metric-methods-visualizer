import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AboutPage from './presentation/pages/about/AboutPage';
import HomePage from './presentation/pages/home/HomePage';
import AesaPage from './presentation/pages/methods/AesaPage';
import LaesaPage from './presentation/pages/methods/LaesaPage';
import MTreePage from './presentation/pages/methods/MTreePage';
import BasicTheoryPage from './presentation/pages/theory/BasicTheoryPage';
import KeyPrinciplesPage from './presentation/pages/theory/KeyPinciplesPage';
import MetricSpacePage from './presentation/pages/theory/MetricSpacePage';
import TheoryPage from './presentation/pages/theory/TheoryPage';




const App: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/theory" element={<TheoryPage />} />
        <Route path="/theory/basics" element={<BasicTheoryPage />} />
        <Route path="/theory/metric-space" element={<MetricSpacePage />} />
        <Route path="/theory/key-principles" element={<KeyPrinciplesPage />} />
        <Route path="/aesa" element={<AesaPage />} />
        <Route path="/laesa" element={<LaesaPage />} />
        <Route path="/mtree" element={<MTreePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  );
};

export default App;