import React from 'react';

// Komponenta pro L1 (Manhattanská) metriku
const L1Metric = () => (
  <div className="metric-container">
    <svg 
      width="100%" 
      height="200" 
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid meet"
      className="metric-svg"
    >
      <defs>
        <linearGradient id="l1Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      
      <pattern id="grid1" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f5f5f5" strokeWidth="1"/>
      </pattern>
      <rect width="200" height="200" fill="url(#grid1)" />
      
      <g transform="translate(100, 80)">
        <polygon points="0,-60 -60,0 0,60 60,0" fill="url(#l1Gradient)" stroke="#ff6b6b" strokeWidth="2" />
        <text x="0" y="0" textAnchor="middle" fontSize="16" fontWeight="bold">L₁</text>
        <line x1="0" y1="-60" x2="0" y2="60" stroke="#ccc" strokeWidth="1" strokeDasharray="4,2" />
        <line x1="-60" y1="0" x2="60" y2="0" stroke="#ccc" strokeWidth="1" strokeDasharray="4,2" />
      </g>
      
      <text x="100" y="160" textAnchor="middle" fontSize="14">Manhattanská</text>
      
      <rect x="10" y="170" width="180" height="25" rx="5" fill="#f8f9fa" stroke="#ddd" strokeWidth="1" />
      <text x="20" y="187" textAnchor="start" fontSize="12" fill="#ff6b6b" fontWeight="bold">L₁:</text>
      <text x="40" y="187" textAnchor="start" fontSize="12">|x₁-y₁| + |x₂-y₂| + ... + |xₙ-yₙ|</text>
    </svg>
  </div>
);

// Komponenta pro L2 (Euklidovská) metriku
const L2Metric = () => (
  <div className="metric-container">
    <svg 
      width="100%" 
      height="200" 
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid meet"
      className="metric-svg"
    >
      <defs>
        <linearGradient id="l2Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4d96ff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#4d96ff" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      
      <pattern id="grid2" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f5f5f5" strokeWidth="1"/>
      </pattern>
      <rect width="200" height="200" fill="url(#grid2)" />
      
      <g transform="translate(100, 80)">
        <circle cx="0" cy="0" r="60" fill="url(#l2Gradient)" stroke="#4d96ff" strokeWidth="2" />
        <text x="0" y="0" textAnchor="middle" fontSize="16" fontWeight="bold">L₂</text>
        <line x1="0" y1="-60" x2="0" y2="60" stroke="#ccc" strokeWidth="1" strokeDasharray="4,2" />
        <line x1="-60" y1="0" x2="60" y2="0" stroke="#ccc" strokeWidth="1" strokeDasharray="4,2" />
      </g>
      
      <text x="100" y="160" textAnchor="middle" fontSize="14">Euklidovská</text>
      
      <rect x="10" y="170" width="180" height="25" rx="5" fill="#f8f9fa" stroke="#ddd" strokeWidth="1" />
      <text x="20" y="187" textAnchor="start" fontSize="12" fill="#4d96ff" fontWeight="bold">L₂:</text>
      <text x="40" y="187" textAnchor="start" fontSize="12">√((x₁-y₁)² + (x₂-y₂)² + ...)</text>
    </svg>
  </div>
);

// Komponenta pro L3 (Minkowského) metriku
const L3Metric = () => (
  <div className="metric-container">
    <svg 
      width="100%" 
      height="200" 
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid meet"
      className="metric-svg"
    >
      <defs>
        <linearGradient id="l3Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5cb85c" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#5cb85c" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      
      <pattern id="grid3" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f5f5f5" strokeWidth="1"/>
      </pattern>
      <rect width="200" height="200" fill="url(#grid3)" />
      
      <g transform="translate(100, 80)">
        <path d="M 0,-60 C 30,-60 50,-50 60,-30 C 70,-10 70,10 60,30 C 50,50 30,60 0,60 C -30,60 -50,50 -60,30 C -70,10 -70,-10 -60,-30 C -50,-50 -30,-60 0,-60 Z" 
              fill="url(#l3Gradient)" stroke="#5cb85c" strokeWidth="2" />
        <text x="0" y="0" textAnchor="middle" fontSize="16" fontWeight="bold">L₃</text>
        <line x1="0" y1="-60" x2="0" y2="60" stroke="#ccc" strokeWidth="1" strokeDasharray="4,2" />
        <line x1="-60" y1="0" x2="60" y2="0" stroke="#ccc" strokeWidth="1" strokeDasharray="4,2" />
      </g>
      
      <text x="100" y="160" textAnchor="middle" fontSize="14">Minkowského</text>
      
      <rect x="10" y="170" width="180" height="25" rx="5" fill="#f8f9fa" stroke="#ddd" strokeWidth="1" />
      <text x="20" y="187" textAnchor="start" fontSize="12" fill="#5cb85c" fontWeight="bold">L₃:</text>
      <text x="40" y="187" textAnchor="start" fontSize="12">(|x₁-y₁|³ + |x₂-y₂|³ + ...)^(1/3)</text>
    </svg>
  </div>
);

// Komponenta pro L∞ (Čebyševova) metriku
const LInfMetric = () => (
  <div className="metric-container">
    <svg 
      width="100%" 
      height="200" 
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid meet"
      className="metric-svg"
    >
      <defs>
        <linearGradient id="linfGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9966ff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#9966ff" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      
      <pattern id="grid4" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f5f5f5" strokeWidth="1"/>
      </pattern>
      <rect width="200" height="200" fill="url(#grid4)" />
      
      <g transform="translate(100, 80)">
        <rect x="-60" y="-60" width="120" height="120" fill="url(#linfGradient)" stroke="#9966ff" strokeWidth="2" />
        <text x="0" y="0" textAnchor="middle" fontSize="16" fontWeight="bold">L∞</text>
        <line x1="0" y1="-60" x2="0" y2="60" stroke="#ccc" strokeWidth="1" strokeDasharray="4,2" />
        <line x1="-60" y1="0" x2="60" y2="0" stroke="#ccc" strokeWidth="1" strokeDasharray="4,2" />
      </g>
      
      <text x="100" y="160" textAnchor="middle" fontSize="14">maximální</text>
      
      <rect x="10" y="170" width="180" height="25" rx="5" fill="#f8f9fa" stroke="#ddd" strokeWidth="1" />
      <text x="20" y="187" textAnchor="start" fontSize="12" fill="#9966ff" fontWeight="bold">L∞:</text>
      <text x="40" y="187" textAnchor="start" fontSize="12">max(|x₁-y₁|, |x₂-y₂|, ...)</text>
    </svg>
  </div>
);

// Hlavní komponenta, která spojuje všechny metriky do flexboxu
const MetricDiagrams = () => {
  return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center' }}>
            <p>Tvary reprezentují množinu bodů se vzdáleností 1 od středu podle dané metriky v 2D prostoru</p>
        </div>
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, minHeight: 0 }}>
                <L1Metric />
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <L2Metric />
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <L3Metric />
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <LInfMetric />
            </div>
        </div>
      </div>
    );
};

export default MetricDiagrams;