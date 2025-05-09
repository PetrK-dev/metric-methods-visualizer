import React from 'react';

export const VisualElementsExplanationDiagram = () => {
  return (
    <svg width="600" height="400" viewBox="0 0 600 400">
      <rect width="600" height="400" fill="#fff" />
      
      {/* Nadpis */}
      <text x="300" y="30" fontSize="18" fontWeight="bold" textAnchor="middle">
        Vysvětlení vizuálních prvků v aplikaci
      </text>
      
      {/* Levá polovina - typy bodů */}
      <text x="150" y="70" fontSize="16" fontWeight="bold" textAnchor="middle">
        Typy bodů
      </text>
      
      {/* Dotazovací bod */}
      <circle cx="80" cy="100" r="8" fill="#0000ff" />
      <text x="100" y="105" fontSize="14">Dotazovací bod (Q)</text>
      
      {/* Pivotní bod */}
      <circle cx="80" cy="130" r="8" fill="#ff00ff" />
      <text x="100" y="135" fontSize="14">Pivotní bod (P)</text>
      
      {/* Standardní objekt */}
      <circle cx="80" cy="160" r="8" fill="#000000" />
      <text x="100" y="165" fontSize="14">Standardní objekt (O)</text>
      
      {/* Aktivní bod */}
      <circle cx="80" cy="190" r="8" fill="#00ff00" />
      <text x="100" y="195" fontSize="14">Aktivní bod</text>
      
      {/* Eliminovaný bod */}
      <circle cx="80" cy="220" r="8" fill="#888888" />
      <text x="100" y="225" fontSize="14">Eliminovaný bod</text>
      
      {/* Výsledný bod */}
      <circle cx="80" cy="250" r="8" fill="#55FFF5" />
      <text x="100" y="255" fontSize="14">Výsledný bod</text>
      
      {/* Pravá polovina - typy čar a kružnic */}
      <text x="450" y="70" fontSize="16" fontWeight="bold" textAnchor="middle">
        Čáry a kružnice
      </text>
      
      {/* Plná čára - vzdálenost */}
      <line x1="350" y1="100" x2="420" y2="100" stroke="#555" strokeWidth="2" />
      <text x="430" y="105" fontSize="14">Vypočtená vzdálenost</text>
      
      {/* Přerušovaná čára */}
      <line x1="350" y1="130" x2="420" y2="130" stroke="#555" strokeWidth="2" 
            strokeDasharray="5,3" />
      <text x="430" y="135" fontSize="14">Odhad/mez vzdálenosti</text>
      
      {/* Pozitivní výsledek */}
      <line x1="350" y1="160" x2="420" y2="160" stroke="#4caf50" strokeWidth="2" />
      <text x="430" y="165" fontSize="14">Pozitivní výsledek</text>
      
      {/* Negativní výsledek */}
      <line x1="350" y1="190" x2="420" y2="190" stroke="#f44336" strokeWidth="2" />
      <text x="430" y="195" fontSize="14">Negativní výsledek</text>
      
      {/* Kružnice dotazu */}
      <circle cx="380" cy="230" r="20" fill="none" stroke="#FF9800" strokeWidth="2" 
              strokeDasharray="5,3" />
      <text x="430" y="235" fontSize="14">Rozsah dotazu</text>
      
      {/* Dolní mez */}
      <circle cx="380" cy="270" r="20" fill="none" stroke="#2196f3" strokeWidth="2" 
              strokeDasharray="5,3" />
      <text x="430" y="275" fontSize="14">Dolní mez</text>
      
      {/* Ukázka algoritmu */}
      <rect x="50" y="290" width="500" height="100" fill="#f5f5f5" stroke="#ccc" 
            strokeWidth="1" rx="5" />
      <text x="300" y="310" fontSize="16" fontWeight="bold" textAnchor="middle">
        Ukázka průběhu algoritmu
      </text>
      
      {/* Malá ukázka scény */}
      <circle cx="150" cy="340" r="6" fill="#0000ff" />
      <circle cx="200" cy="330" r="6" fill="#ff00ff" />
      <circle cx="250" cy="350" r="6" fill="#000000" />
      <circle cx="300" cy="360" r="6" fill="#888888" />
      <circle cx="350" cy="330" r="6" fill="#55FFF5" />
      
      <line x1="150" y1="340" x2="200" y2="330" stroke="#555" strokeWidth="1.5" />
      <line x1="200" y1="330" x2="250" y2="350" stroke="#4caf50" strokeWidth="1.5" />
      <line x1="200" y1="330" x2="300" y2="360" stroke="#f44336" strokeWidth="1.5" 
            strokeDasharray="3,2" />
      
      <circle cx="150" cy="340" r="30" fill="none" stroke="#FF9800" strokeWidth="1.5" 
              strokeDasharray="3,2" />
    </svg>
  );
};