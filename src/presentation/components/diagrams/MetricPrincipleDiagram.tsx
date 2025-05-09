import React from 'react';

// Konstanty pro barvy
const COLORS = {
  QUERY_POINT: '#0000ff',      // Modrá pro dotazovací bod
  RESULT_POINT: '#00ff00',     // Zelená pro výsledné body
  ELIMINATED_POINT: '#888888', // Šedá pro eliminované body
  PIVOT_POINT: '#ff00ff',      // Fialová pro pivot
  RANGE_QUERY: '#FF9800',      // Oranžová pro rozsahový dotaz
  DISTANCE_LINE: '#555555',    // Šedá pro vzdálenosti
  LOWER_BOUND: '#2196F3',      // Modrá pro dolní mez
};

// Komponenta pro diagram principu metrického vyhledávání
const MetricPrinciplesDiagram = () => {
  // Definice bodů
  const points = [
    { id: 'Q', x: 30, y: 50, type: 'query' },      // Dotazovací bod
    { id: 'P', x: 75, y: 30, type: 'pivot' },      // Pivot
    { id: 'O', x: 60, y: 70, type: 'result' },     // Výsledný bod (zelený)
  ];
  
  // Získání specifických bodů
  const queryPoint = points[0];
  const pivotPoint = points[1];
  const objectPoint = points[2];
  
  // Vzdálenosti (jen pro vizualizaci)
  const distQP = 4.8;  // Vzdálenost dotaz-pivot
  const distPO = 4.2;  // Vzdálenost pivot-objekt
  const distQO = 3.5;  // Vzdálenost dotaz-objekt
  const lowerBound = Math.abs(distQP - distPO); // Dolní mez |d(Q,P) - d(P,O)|
  
  // Poloměr pro rozsahový dotaz a lower bound
  const queryRadius = 4.0;
  
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      {/* Mřížka pozadí */}
      <defs>
        <pattern id="grid-principle" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#eee" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#grid-principle)" />
      
      {/* Kružnice pro dotaz - range */}
      <circle
        cx={queryPoint.x}
        cy={queryPoint.y}
        r={queryRadius * 10} // Škálování pro SVG
        fill="none"
        stroke={COLORS.RANGE_QUERY}
        strokeWidth="0.5"
      />
      <text 
        x={queryPoint.x - 20} 
        y={queryPoint.y - 20} 
        fontSize="3" 
        fill={COLORS.RANGE_QUERY}
      >
        range
      </text>
      
      {/* Dolní mez - kružnice */}
      <circle
        cx={queryPoint.x}
        cy={queryPoint.y}
        r={lowerBound * 10} // Škálování pro SVG
        fill="none"
        stroke={COLORS.LOWER_BOUND}
        strokeWidth="0.5"
        strokeDasharray="3,1"
      />
      <text 
        x={queryPoint.x} 
        y={queryPoint.y + 10} 
        fontSize="3" 
        fill={COLORS.LOWER_BOUND}
      >
        lower bound
      </text>
      
      {/* Vzdálenosti - čáry */}
      {/* Vzdálenost Q-P (dotazovací bod - pivot) */}
      <line
        x1={queryPoint.x}
        y1={queryPoint.y}
        x2={pivotPoint.x}
        y2={pivotPoint.y}
        stroke={COLORS.DISTANCE_LINE}
        strokeWidth="0.7"
      />
      <text 
        x={(queryPoint.x + pivotPoint.x) / 2 + 5} 
        y={(queryPoint.y + pivotPoint.y) / 2 - 2} 
        textAnchor="middle" 
        fontSize="3" 
        fill="#333"
      >
        d(Q, P) = {distQP}
      </text>
      
      {/* Vzdálenost P-O (pivot - objekt) */}
      <line
        x1={pivotPoint.x}
        y1={pivotPoint.y}
        x2={objectPoint.x}
        y2={objectPoint.y}
        stroke={COLORS.DISTANCE_LINE}
        strokeWidth="0.7"
      />
      <text 
        x={(pivotPoint.x + objectPoint.x) / 2 + 7} 
        y={(pivotPoint.y + objectPoint.y) / 2 + 5} 
        textAnchor="middle" 
        fontSize="3" 
        fill="#333"
      >
        d(P, O) = {distPO}
      </text>
      
      {/* Vzdálenost Q-O */}
      <line
        x1={queryPoint.x}
        y1={queryPoint.y}
        x2={objectPoint.x}
        y2={objectPoint.y}
        stroke={COLORS.DISTANCE_LINE}
        strokeWidth="0.7"
        strokeDasharray="none"
      />
      <text 
        x={(queryPoint.x + objectPoint.x) / 2 - 2} 
        y={(queryPoint.y + objectPoint.y) / 2 + 2} 
        textAnchor="middle" 
        fontSize="3" 
        fill="#333"
      >
        d(Q, O) = {distQO}
      </text>
      
      {/* Vykreslení bodů */}
      {points.map((point) => {
        let color;
        let size = 2.5;
        
        if (point.type === 'query') {
          color = COLORS.QUERY_POINT;
        } else if (point.type === 'pivot') {
          color = COLORS.PIVOT_POINT;
        } else if (point.type === 'result') {
          color = COLORS.RESULT_POINT;
        } else {
          color = COLORS.ELIMINATED_POINT;
        }
        
        return (
          <g key={point.id}>
            <circle
              cx={point.x}
              cy={point.y}
              r={size}
              fill={color}
              stroke="white"
              strokeWidth="0.4"
            />
            <text
              x={point.x + (point.id === 'P' ? 2 : -2)}
              y={point.y - 2}
              textAnchor="middle"
              fill="#555"
              fontSize="3.5"
              fontFamily="Arial, sans-serif"
            >
              {point.id}
            </text>
          </g>
        );
      })}
      
      {/* Vysvětlení principu - popisky pod diagramem */}
      <text x="5" y="88" fontSize="3" fill="#333">
        |b - r| = |d(Q,P) - d(P,O)| = |{distQP} - {distPO}| = {lowerBound.toFixed(1)}
      </text>
      <text x="5" y="93" fontSize="3" fill="#333">
        Bod O nelze eliminovat, protože dolní mez {lowerBound.toFixed(1)} {'<'} {queryRadius.toFixed(1)} (poloměr dotazu)
      </text>
      <text x="5" y="98" fontSize="3" fill="#333">
        Musíme vypočítat skutečnou vzdálenost d(Q,O) = {distQO}, která je {'<'} {queryRadius.toFixed(1)}, takže bod je ve výsledku.
      </text>
    </svg>
  );
};

export default MetricPrinciplesDiagram;