import React from 'react';

// Konstanty pro barvy
const COLORS = {
  QUERY_POINT: '#0000ff',
  RESULT_POINT: '#55FFF5',
  ELIMINATED_POINT: '#888888',
  NORMAL_POINT: '#000000',
  RANGE_QUERY: '#FF9800',
  KNN_LINE: '#4caf50',
};

// Komponenta pro Range query diagram
export const RangeQueryDiagram = () => {
  // Data bodů
  const points = [
    { id: 'Q', x: 50, y: 50, type: 'query' },
    { id: '1', x: 65, y: 35, type: 'result' },
    { id: '2', x: 40, y: 35, type: 'result' },
    { id: '3', x: 60, y: 70, type: 'result' },
    { id: '4', x: 30, y: 20, type: 'eliminated' },
    { id: '5', x: 80, y: 20, type: 'eliminated' },
    { id: '6', x: 25, y: 35, type: 'result' }
  ];
  
  const rangeRadius = 35;

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      {/* Mřížka pozadí */}
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#eee" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#grid)" />
      
      {/* Kruh označující dosah dotazu */}
      <circle 
        cx={points[0].x} 
        cy={points[0].y} 
        r={rangeRadius} 
        fill="none" 
        stroke={COLORS.RANGE_QUERY} 
        strokeWidth="0.5" 
        opacity="0.75"
      />
      
      {/* Vykreslení bodů */}
      {points.map((point) => {
        let color;
        let size = 1.5;
        
        if (point.type === 'query') {
          color = COLORS.QUERY_POINT;
          size = 2;
        } else if (point.type === 'result') {
          color = COLORS.RESULT_POINT;
        } else if (point.type === 'eliminated') {
          color = COLORS.ELIMINATED_POINT;
        } else {
          color = COLORS.NORMAL_POINT;
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
              x={point.x}
              y={point.y - 2}
              textAnchor="middle"
              fill="#555"
              fontSize="2.8"
              fontFamily="Arial, sans-serif"
            >
              {point.id === 'Q' ? 'Q' : (
                <>
                  O
                  <tspan baselineShift="sub" fontSize="1.8">{point.id}</tspan>
                </>
              )}
            </text>
          </g>
        );
      })}
      
      {/* Popis diagramu */}
      <text x="5" y="95" fontSize="3" fill="#555">
        Rozsahový dotaz: všechny body uvnitř kružnice jsou ve výsledku
      </text>
    </svg>
  );
};

// Komponenta pro kNN diagram
export const KnnQueryDiagram = () => {
  const points = [
    { id: 'Q', x: 50, y: 50, type: 'query' },
    { id: '1', x: 65, y: 35, type: 'result' },
    { id: '2', x: 40, y: 35, type: 'result' },
    { id: '3', x: 60, y: 70, type: 'result' },
    { id: '4', x: 30, y: 20, type: 'normal' },
    { id: '5', x: 80, y: 20, type: 'normal' },
    { id: '6', x: 25, y: 35, type: 'normal' }
  ];

  const resultPoints = points.filter(p => p.type === 'result');
  const queryPoint = { id: 'Q', x: 50, y: 50, type: 'query' };

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      {/* Mřížka pozadí */}
      <defs>
        <pattern id="grid-knn" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#eee" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#grid-knn)" />
      
      {/* Spojnice k-NN */}
      {resultPoints.map((point) => (
        <line
          key={`line-${point.id}`}
          x1={queryPoint.x}
          y1={queryPoint.y}
          x2={point.x}
          y2={point.y}
          stroke={COLORS.KNN_LINE}
          strokeWidth="0.5"
          opacity="0.75"
        />
      ))}
      
      {/* Vykreslení bodů */}
      {points.map((point) => {
        let color;
        let size = 1.5;
        
        if (point.type === 'query') {
          color = COLORS.QUERY_POINT;
          size = 2;
        } else if (point.type === 'result') {
          color = COLORS.RESULT_POINT;
        } else if (point.type === 'eliminated') {
          color = COLORS.ELIMINATED_POINT;
        } else {
          color = COLORS.NORMAL_POINT;
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
              x={point.x}
              y={point.y - 2}
              textAnchor="middle"
              fill="#555"
              fontSize="2.8"
              fontFamily="Arial, sans-serif"
            >
              {point.id === 'Q' ? 'Q' : (
                <>
                  O
                  <tspan baselineShift="sub" fontSize="1.8">{point.id}</tspan>
                </>
              )}
            </text>
          </g>
        );
      })}
      
      {/* Popis diagramu */}
      <text x="5" y="95" fontSize="3" fill="#555">
        k-NN dotaz: zelené čáry spojují dotazovací bod s k nejbližšími objekty (k=3)
      </text>
    </svg>
  );
};

// Komponenta pro použití v teorii - upravena aby se vešla do placeholderu
const MetricQueriesDiagrams = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <KnnQueryDiagram />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <RangeQueryDiagram />
      </div>
    </div>
  );
};

export default MetricQueriesDiagrams;