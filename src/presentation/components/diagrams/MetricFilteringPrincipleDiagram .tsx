import React from 'react';

export const MetricFilteringPrincipleDiagram = () => {
  return (
    <svg width="600" height="350" viewBox="0 0 600 350">
      {/* Pozadí s mřížkou */}
      <defs>
        <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f8f8f8" strokeWidth="0.5"/>
        </pattern>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="url(#smallGrid)"/>
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="600" height="350" fill="url(#grid)" />
      
      {/* Hlavní nápis */}
      <text x="50" y="40" fontSize="18" fontWeight="bold">
        Princip eliminace objektů v metrickém prostoru
      </text>
      
      {/* Dotazovací bod */}
      <circle cx="200" cy="180" r="10" fill="#2196f3" />
      <text x="170" y="160" fontSize="16">Dotaz (q)</text>
      
      {/* Pivotní bod */}
      <circle cx="350" cy="120" r="10" fill="#ff00ff" />
      <text x="360" y="110" fontSize="16">Pivot (p)</text>
      
      {/* Objekt (potenciálně eliminovaný) */}
      <circle cx="450" cy="220" r="8" fill="#888888" />
      <text x="460" y="220" fontSize="16">Objekt (o)</text>
      
      {/* Rozsah dotazu */}
      <circle cx="200" cy="180" r="80" fill="none" stroke="#2196f3" 
              strokeWidth="2" strokeDasharray="5,3" />
      <text x="200" y="260" fontSize="14">Rozsah dotazu (r)</text>
      
      {/* Vzdálenosti */}
      <line x1="200" y1="180" x2="350" y2="120" stroke="#333" strokeWidth="2" />
      <text x="260" y="130" fontSize="14">d(q,p) = 160</text>
      
      <line x1="350" y1="120" x2="450" y2="220" stroke="#333" strokeWidth="2" />
      <text x="380" y="180" fontSize="14">d(p,o) = 130</text>
      
      <line x1="200" y1="180" x2="450" y2="220" stroke="#ff5252" strokeWidth="2" 
            strokeDasharray="5,3" />
      <text x="310" y="220" fontSize="14">d(q,o) ≥ |d(q,p) - d(p,o)| = 30</text>
      
      {/* Vysvětlení */}
      <rect x="50" y="290" width="500" height="50" fill="rgba(255,255,255,0.8)" 
            stroke="#ccc" strokeWidth="1" rx="5" />
      <text x="60" y="310" fontSize="14">
        Princip eliminace: Pokud |d(q,p) - d(p,o)| {'>'} r, pak d(q,o) {'>'} r
      </text>
      <text x="60" y="330" fontSize="14">
        a objekt o nemůže být ve výsledku dotazu (lze ho eliminovat).
      </text>
    </svg>
  );
};