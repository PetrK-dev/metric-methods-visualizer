import React from 'react';

const MetricSpaceBasicDiagram = () => {
  return (
    <svg 
      width="100%" 
      height="300" 
      viewBox="0 0 500 300"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Nadpis */}
      <text x="250" y="30" textAnchor="middle" fontSize="18" fontWeight="bold">
        Metrický prostor
      </text>
      
      {/* Ohraničení prostoru */}
      <ellipse cx="250" cy="150" rx="200" ry="100" 
               fill="rgba(240,240,250,0.3)" stroke="#aabbcc" strokeWidth="2" strokeDasharray="5,3" />
      <text x="70" y="80" fontSize="16" fontStyle="italic">Množina X</text>
      
      {/* Objekty v prostoru */}
      {/* Bod 1 - kruh */}
      <circle cx="150" cy="120" r="15" fill="#ff6b6b" />
      <text x="150" y="100" textAnchor="middle" fontSize="14">x₁</text>
      
      {/* Bod 2 - čtverec */}
      <rect x="270" y="100" width="30" height="30" fill="#4d96ff" />
      <text x="285" y="90" textAnchor="middle" fontSize="14">x₂</text>
      
      {/* Bod 3 - trojúhelník */}
      <polygon points="180,200 210,200 195,170" fill="#5cb85c" />
      <text x="195" y="220" textAnchor="middle" fontSize="14">x₃</text>
      
      {/* Bod 4 - hvězda */}
      <polygon points="320,180 330,160 340,180 360,170 345,190 360,210 340,200 330,220 320,200 300,210 315,190 300,170" 
              fill="#9966ff" />
      <text x="330" y="150" textAnchor="middle" fontSize="14">x₄</text>
      
      {/* Vzdálenosti */}
      <line x1="150" y1="120" x2="285" y2="115" stroke="#333" strokeWidth="1.5" strokeDasharray="4,2" />
      <text x="210" y="105" textAnchor="middle" fontSize="14" fill="#333">d(x₁,x₂)</text>
      
      <line x1="285" y1="115" x2="195" y2="190" stroke="#333" strokeWidth="1.5" strokeDasharray="4,2" />
      <text x="250" y="165" textAnchor="middle" fontSize="14" fill="#333">d(x₂,x₃)</text>
      
      <line x1="195" y1="190" x2="330" y2="190" stroke="#333" strokeWidth="1.5" strokeDasharray="4,2" />
      <text x="260" y="205" textAnchor="middle" fontSize="14" fill="#333">d(x₃,x₄)</text>
      
      {/* Vysvětlující text */}
      <rect x="50" y="240" width="400" height="50" rx="10" fill="rgba(240,240,250,0.5)" stroke="#aabbcc" strokeWidth="1" />
      <text x="250" y="260" textAnchor="middle" fontSize="14">
        Metrický prostor (X,d) je množina X s metrickou funkcí d,
      </text>
      <text x="250" y="280" textAnchor="middle" fontSize="14">
        která definuje vzdálenosti mezi libovolnými dvěma prvky x,y ∈ X
      </text>
    </svg>
  );
};

export default MetricSpaceBasicDiagram;