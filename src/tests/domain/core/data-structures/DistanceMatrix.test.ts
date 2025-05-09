// test/DistanceMatrix.test.ts

import { DistanceMatrix } from "../../../../domain/core/data-structures/DistanceMatrix";
import { Database } from "../../../../domain/core/database/Database";
import { PointType } from "../../../../domain/core/enums/PointType";
import { Point } from "../../../../domain/core/models/Point";

describe('DistanceMatrix', () => {
  let distanceMatrix: DistanceMatrix;
  let database: Database;
  
  // Jednoduchá vzdálenostní funkce pro testy
  const mockDistance = (p1: Point, p2: Point): number => {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y); // Manhattan distance
  };
  
  beforeEach(() => {
    // Vytvoříme novou matici vzdáleností pro každý test
    distanceMatrix = new DistanceMatrix(mockDistance);
    
    // Vytvoříme a inicializujeme databázi
    database = new Database();
    
    // Přidáme body s definovanými souřadnicemi pro předvídatelné testy

    database.addPoint(new Point(0, PointType.OBJECT, 0, 0));
    database.addPoint(new Point(1, PointType.OBJECT, 3, 0));
    database.addPoint(new Point(2, PointType.OBJECT, 0, 4));
    database.addPoint(new Point(3, PointType.OBJECT, 2, 2));
  });
  
  test('addDistance correctly calculates and stores distance', () => {
    const p1 = new Point(0, PointType.OBJECT, 0, 0);
    const p2 = new Point(1, PointType.OBJECT, 3, 0);
    
    // Přidáme vzdálenost a ověříme, že je správně vypočítána
    const distance = distanceMatrix.addDistance(p1, p2);
    expect(distance).toBe(3); // manhattanDistance(0,0, 3,0) = 3
    
    // Ověříme, že vzdálenost je skutečně uložena
    expect(distanceMatrix.getDistance(0, 1)).toBe(3);
  });
  
  test('getDistance returns -1 for non-existent distance', () => {
    // Bez inicializace by neměly existovat žádné vzdálenosti
    expect(distanceMatrix.getDistance(0, 1)).toBe(-1);
  });
  
  test('hasDistance correctly checks distance existence', () => {
    // Před přidáním vzdálenost neexistuje
    expect(distanceMatrix.hasDistance(0, 1)).toBe(false);
    
    // Přidáme vzdálenost
    const p1 = new Point(0, PointType.OBJECT, 0, 0);
    const p2 = new Point(1, PointType.OBJECT, 3, 0);
    distanceMatrix.addDistance(p1, p2);
    
    // Po přidání by měla existovat
    expect(distanceMatrix.hasDistance(0, 1)).toBe(true);
    expect(distanceMatrix.hasDistance(1, 0)).toBe(true); // Test symetrie
  });
  
  test('getDistance respects symmetry property', () => {
    const p1 = new Point(0, PointType.OBJECT, 0, 0);
    const p2 = new Point(1, PointType.OBJECT, 3, 0);
    
    // Přidáme vzdálenost v jednom směru
    distanceMatrix.addDistance(p1, p2);
    
    // Testujeme, že vzdálenost lze získat v obou směrech
    expect(distanceMatrix.getDistance(0, 1)).toBe(3);
    expect(distanceMatrix.getDistance(1, 0)).toBe(3);
  });
  
  test('clear removes all distances', () => {
    // Přidáme několik vzdáleností
    const p1 = new Point(0, PointType.OBJECT, 0, 0);
    const p2 = new Point(1, PointType.OBJECT, 3, 0);
    const p3 = new Point(2, PointType.OBJECT, 0, 4);
    
    distanceMatrix.addDistance(p1, p2);
    distanceMatrix.addDistance(p1, p3);
    distanceMatrix.addDistance(p2, p3);
    
    // Ověříme, že vzdálenosti existují
    expect(distanceMatrix.hasDistance(0, 1)).toBe(true);
    expect(distanceMatrix.hasDistance(0, 2)).toBe(true);
    
    // Vymažeme matici
    distanceMatrix.clear();
    
    // Ověříme, že vzdálenosti již neexistují
    expect(distanceMatrix.hasDistance(0, 1)).toBe(false);
    expect(distanceMatrix.hasDistance(0, 2)).toBe(false);
  });
  
  test('initializeBase computes all distances for AESA mode', () => {
    // AESA režim - všechny body jsou v matici
    distanceMatrix.initializeBase(database);
    
    // Zkontrolujeme, že všechny páry mají vypočítanou vzdálenost
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        expect(distanceMatrix.hasDistance(i, j)).toBe(true);
      }
    }
    
    // Ověříme několik konkrétních vzdáleností
    expect(distanceMatrix.getDistance(0, 1)).toBe(3); // (0,0) -> (3,0) = 3
    expect(distanceMatrix.getDistance(0, 2)).toBe(4); // (0,0) -> (0,4) = 4
    expect(distanceMatrix.getDistance(1, 3)).toBe(3); // (3,0) -> (2,2) = 3
  });
  
  test('initializeBase computes only pivot distances for LAESA mode', () => {
    // Nastavíme bod 0 jako pivot
    database.setPivots([0]);
    
    // Inicializujeme matici v LAESA režimu
    distanceMatrix.initializeBase(database);
    
    // Vzdálenosti od pivotu by měly existovat
    expect(distanceMatrix.hasDistance(0, 1)).toBe(true);
    expect(distanceMatrix.hasDistance(0, 2)).toBe(true);
    expect(distanceMatrix.hasDistance(0, 3)).toBe(true);
    
    // Vzdálenosti mezi nepivotními body by neměly existovat
    expect(distanceMatrix.hasDistance(1, 2)).toBe(false);
    expect(distanceMatrix.hasDistance(2, 3)).toBe(false);
  });
  
  test('getDistancesForPoints returns correct distances', () => {
    // Přidáme několik vzdáleností
    const p0 = new Point(0, PointType.OBJECT, 0, 0);
    const p1 = new Point(1, PointType.OBJECT, 3, 0);
    const p2 = new Point(2, PointType.OBJECT, 0, 4);
    
    distanceMatrix.addDistance(p0, p1);
    distanceMatrix.addDistance(p0, p2);
    
    // Získáme všechny vzdálenosti pro bod 0
    const distances = distanceMatrix.getDistancesForPoints(0, [p0, p1, p2]);
    
    // Měly by být vráceny 2 vzdálenosti (ne pro bod 0 samotný)
    expect(distances.length).toBe(2);
    
    // Zkontrolujeme konkrétní hodnoty
    expect(distances.find(d => d.targetPoint.id === 1)?.distance).toBe(3);
    expect(distances.find(d => d.targetPoint.id === 2)?.distance).toBe(4);
  });
  
  test('clone creates independent copy with same distances', () => {
    // Inicializujeme původní matici
    distanceMatrix.initializeBase(database);
    
    // Vytvoříme klon
    const clonedMatrix = distanceMatrix.clone() as DistanceMatrix;
    
    // Ověříme, že klon má stejné vzdálenosti
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        expect(clonedMatrix.getDistance(i, j)).toBe(distanceMatrix.getDistance(i, j));
      }
    }
    
    // Přidáme novou vzdálenost do původní matice
    const newPoint = new Point(4, PointType.OBJECT, 5, 5);
    distanceMatrix.addDistance(database.getDataPoints()[0], newPoint);
    
    // Klon by neměl mít tuto novou vzdálenost
    expect(distanceMatrix.hasDistance(0, 4)).toBe(true);
    expect(clonedMatrix.hasDistance(0, 4)).toBe(false);
  });
});