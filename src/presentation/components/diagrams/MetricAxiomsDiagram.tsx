import React from 'react';

// Axiom 1: Nezápornost
const NonNegativityAxiom = () => (
  <div className="axiom-container">
    <svg 
      width="100%" 
      height="200" 
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffcdd2" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffcdd2" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      
      <rect width="200" height="200" fill="transparent"/>
      
      {/* Číselná osa */}
      <line x1="30" y1="120" x2="170" y2="120" stroke="#333" strokeWidth="2" />
      <line x1="170" y1="120" x2="160" y2="115" stroke="#333" strokeWidth="2" />
      <line x1="170" y1="120" x2="160" y2="125" stroke="#333" strokeWidth="2" />

      {/* Značky na ose */}
      <line x1="100" y1="115" x2="100" y2="125" stroke="#333" strokeWidth="2" />
      <text x="100" y="140" textAnchor="middle" fontSize="14">0</text>
      
      <line x1="150" y1="115" x2="150" y2="125" stroke="#333" strokeWidth="2" />
      <text x="150" y="140" textAnchor="middle" fontSize="14">+</text>
      
      {/* Body x a y */}
      <circle cx="60" cy="80" r="6" fill="#e57373" />
      <text x="60" y="65" textAnchor="middle" fontSize="14">x</text>
      
      <circle cx="140" cy="80" r="6" fill="#e57373" />
      <text x="140" y="65" textAnchor="middle" fontSize="14">y</text>
      
      {/* Vzdálenost */}
      <line x1="60" y1="90" x2="140" y2="90" stroke="#e57373" strokeWidth="2" strokeDasharray="5,2" />
      <text x="100" y="85" textAnchor="middle" fontSize="14">d(x,y)</text>
      
      {/* Šipka ke kladné části osy */}
      <path d="M 100,90 Q 120,105 130,120" fill="none" stroke="#e57373" strokeWidth="2" markerEnd="url(#arrowhead)" />
      
      <text x="100" y="180" textAnchor="middle" fontSize="14" fontWeight="bold">d(x,y) ≥ 0</text>
      
      {/* Název axiomu */}
      <text x="100" y="30" textAnchor="middle" fontSize="16" fontWeight="bold">1. Nezápornost</text>
    </svg>
  </div>
);

// Axiom 2: Identita
const IdentityAxiom = () => (
  <div className="axiom-container">
    <svg 
      width="100%" 
      height="200" 
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bbdefb" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#bbdefb" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      
      <rect width="200" height="200" fill="transparent"/>
      
      {/* Rovnost bodů */}
      <g transform="translate(60, 100)">
        <circle cx="0" cy="0" r="6" fill="#64b5f6" />
        <text x="0" y="-15" textAnchor="middle" fontSize="14">x</text>
        
        <circle cx="0" cy="0" r="10" fill="none" stroke="#64b5f6" strokeWidth="1" strokeDasharray="3,2" />
        <text x="0" y="30" textAnchor="middle" fontSize="14" fill="#64b5f6">d(x,x) = 0</text>
      </g>
      
      {/* Různé body */}
      <g transform="translate(140, 100)">
        <circle cx="-15" cy="0" r="6" fill="#64b5f6" />
        <text x="-15" y="-15" textAnchor="middle" fontSize="14">x</text>
        
        <circle cx="15" cy="0" r="6" fill="#64b5f6" />
        <text x="15" y="-15" textAnchor="middle" fontSize="14">y</text>
        
        <line x1="-15" y1="0" x2="15" y2="0" stroke="#64b5f6" strokeWidth="2" />
        <text x="0" y="30" textAnchor="middle" fontSize="14" fill="#64b5f6">d(x,y) {'>'} 0</text>
      </g>
      
      <text x="100" y="180" textAnchor="middle" fontSize="14" fontWeight="bold">d(x,y) = 0 ⟺ x = y</text>
      
      {/* Název axiomu */}
      <text x="100" y="30" textAnchor="middle" fontSize="16" fontWeight="bold">2. Identita</text>
    </svg>
  </div>
);

// Axiom 3: Symetrie
const SymmetryAxiom = () => (
  <div className="axiom-container">
    <svg 
      width="100%" 
      height="200" 
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c8e6c9" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#c8e6c9" stopOpacity="0.3" />
        </linearGradient>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
                markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#66bb6a"/>
        </marker>
      </defs>
      
      <rect width="200" height="200" fill="transparent"/>
      
      {/* Body x a y */}
      <circle cx="60" cy="100" r="6" fill="#66bb6a" />
      <text x="60" y="85" textAnchor="middle" fontSize="14">x</text>
      
      <circle cx="140" cy="100" r="6" fill="#66bb6a" />
      <text x="140" y="85" textAnchor="middle" fontSize="14">y</text>
      
      {/* Obousměrná šipka */}
      <line x1="67" y1="100" x2="133" y2="100" stroke="#66bb6a" strokeWidth="2" markerEnd="url(#arrow)" />
      <line x1="133" y1="100" x2="67" y2="100" stroke="#66bb6a" strokeWidth="2" markerEnd="url(#arrow)" />
      
      {/* Popisy vzdáleností */}
      <text x="100" y="120" textAnchor="middle" fontSize="14" fill="#66bb6a">d(x,y)</text>
      <text x="100" y="140" textAnchor="middle" fontSize="14" fill="#66bb6a">d(y,x)</text>
      
      <text x="100" y="180" textAnchor="middle" fontSize="14" fontWeight="bold">d(x,y) = d(y,x)</text>
      
      {/* Název axiomu */}
      <text x="100" y="30" textAnchor="middle" fontSize="16" fontWeight="bold">3. Symetrie</text>
    </svg>
  </div>
);

// Axiom 4: Trojúhelníková nerovnost
const TriangleInequalityAxiom = () => (
  <div className="axiom-container">
    <svg 
      width="100%" 
      height="200" 
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="bg4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e6d9ff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#e6d9ff" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      
      <rect width="200" height="200" fill="transparent"/>
      
      {/* Trojúhelník */}
      <polygon points="60,130 140,130 100,70" fill="#e6d9ff" stroke="#9966ff" strokeWidth="2" />
      
      {/* Body x, y, z */}
      <circle cx="60" cy="130" r="6" fill="#9966ff" />
      <text x="55" y="145" textAnchor="middle" fontSize="14">x</text>
      
      <circle cx="140" cy="130" r="6" fill="#9966ff" />
      <text x="145" y="145" textAnchor="middle" fontSize="14">z</text>
      
      <circle cx="100" cy="70" r="6" fill="#9966ff" />
      <text x="100" y="55" textAnchor="middle" fontSize="14">y</text>
      
      {/* Popisy vzdáleností */}
      <text x="100" y="140" textAnchor="middle" fontSize="12" fill="#9966ff">d(x,z)</text>
      <text x="72" y="95" textAnchor="middle" fontSize="12" fill="#9966ff">d(x,y)</text>
      <text x="128" y="95" textAnchor="middle" fontSize="12" fill="#9966ff">d(y,z)</text>
      
      <text x="100" y="180" textAnchor="middle" fontSize="14" fontWeight="bold">d(x,z) ≤ d(x,y) + d(y,z)</text>
      
      {/* Název axiomu */}
      <text x="100" y="30" textAnchor="middle" fontSize="16" fontWeight="bold">4. Trojúhelníková nerovnost</text>
    </svg>
  </div>
);

// Hlavní komponenta spojující všechny axiomy
const MetricAxiomsDiagram = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ textAlign: 'center' }}>
        <p>Axiomy metriky (d) v metrických prostorech</p>
      </div>
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row'}}>
      <div style={{ flex: 1, minHeight: 0, padding: '0 10px' }}>
              <NonNegativityAxiom />
          </div>
          <div style={{ flex: 1, minHeight: 0, padding: '0 10px' }}>
              <IdentityAxiom />
          </div>
          <div style={{ flex: 1, minHeight: 0, padding: '0 10px' }}>
              <SymmetryAxiom />
          </div>
          <div style={{ flex: 1, minHeight: 0, padding: '0 10px' }}>
              <TriangleInequalityAxiom />
          </div>
      </div>
    </div>
  );
};

export default MetricAxiomsDiagram;