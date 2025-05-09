import { AesaRangeAlgorithm } from "../../../../../domain/algorithms/AESA/AesaRangeAlgorithm";
import { DistanceMatrix } from "../../../../../domain/core/data-structures/DistanceMatrix";
import { Database } from "../../../../../domain/core/database/Database";
import { PointType } from "../../../../../domain/core/enums/PointType";
import { Point } from "../../../../../domain/core/models/Point";


describe('AesaRangeAlgorithm', () => {
  let database: Database;
  let distanceMatrix: DistanceMatrix;
  let queryPoint: Point;

  // Mocková vzdálenostní funkce - euklidovská vzdálenost
  const mockDistance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  beforeEach(() => {
    // Příprava databáze s body v definovaných pozicích pro opakovatelné testování
    database = new Database();
    database.addPoint(new Point(0, PointType.OBJECT, 0, 0));   // Vzdálenost od queryPoint: 5.66
    database.addPoint(new Point(1, PointType.OBJECT, 3, 0));   // Vzdálenost od queryPoint: 4.24
    database.addPoint(new Point(2, PointType.OBJECT, 0, 4));   // Vzdálenost od queryPoint: 2.83
    database.addPoint(new Point(3, PointType.OBJECT, 3, 4));   // Vzdálenost od queryPoint: 1.41
    database.addPoint(new Point(4, PointType.OBJECT, 7, 7));   // Vzdálenost od queryPoint: 5.66
    database.addPoint(new Point(5, PointType.OBJECT, 2, 2));   // Vzdálenost od queryPoint: 2.83

    // Příprava distanční matice
    distanceMatrix = new DistanceMatrix(mockDistance);
    distanceMatrix.initializeBase(database);

    // Dotazovací bod v konkrétní pozici pro opakovatelné testování
    queryPoint = new Point(-1, PointType.QUERY, 4, 3);
  });

  test('execute finds all points within the radius', async () => {
    const radius = 3.0;
    
    // Manuální výpočet bodů v poloměru
    const pointsInRange = database.getDataPoints().filter(p => 
      mockDistance(queryPoint, p) <= radius
    );
    const expectedPointIds = pointsInRange.map(p => p.id).sort();
    
    // Spuštění algoritmu
    const iterator = AesaRangeAlgorithm.execute(database, distanceMatrix, queryPoint, radius);
    
    // Projdeme všechny kroky algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Poslední krok by měl obsahovat výsledné body
    const lastStep = steps[steps.length - 1];
    const resultIds = lastStep.resultPoints.map(p => p.id).sort();
    
    // Ověření, že algoritmus našel správné body
    expect(resultIds).toEqual(expectedPointIds);
  });

  test('execute eliminates points outside the radius', async () => {
    const radius = 3.0;
    
    // Manuální výpočet bodů mimo poloměr
    const pointsOutsideRange = database.getDataPoints().filter(p => 
      mockDistance(queryPoint, p) > radius
    );
    const expectedEliminatedIds = pointsOutsideRange.map(p => p.id).sort();
    
    // Spuštění algoritmu
    const iterator = AesaRangeAlgorithm.execute(database, distanceMatrix, queryPoint, radius);
    
    // Projdeme všechny kroky algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Poslední krok by měl obsahovat eliminované body
    const lastStep = steps[steps.length - 1];
    const eliminatedIds = lastStep.eliminatedPoints.map(p => p.id).sort();
    const resultIds = lastStep.resultPoints.map(p => p.id).sort();
    
    // Ověření, že algoritmus eliminoval správné body
    expect(eliminatedIds).toEqual(expectedEliminatedIds);
    
    // Ověření, že eliminované body nejsou ve výsledku
    for (const id of eliminatedIds) {
      expect(resultIds).not.toContain(id);
    }
  });

  test('execute with zero radius finds no points', async () => {
    const radius = 0.0;
    
    // Spuštění algoritmu
    const iterator = AesaRangeAlgorithm.execute(database, distanceMatrix, queryPoint, radius);
    
    // Projdeme všechny kroky algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Poslední krok by měl obsahovat prázdný výsledek
    const lastStep = steps[steps.length - 1];
    
    // Ověření, že algoritmus nenašel žádné body
    expect(lastStep.resultPoints.length).toBe(0);
    
    // Ověření, že všechny body byly eliminovány
    expect(lastStep.eliminatedPoints.length).toBe(database.getDataPoints().length);
  });

  test('execute with large radius finds all points', async () => {
    // Poloměr dostatečně velký, aby obsahoval všechny body
    const radius = 10.0;
    
    // Spuštění algoritmu
    const iterator = AesaRangeAlgorithm.execute(database, distanceMatrix, queryPoint, radius);
    
    // Projdeme všechny kroky algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Poslední krok by měl obsahovat všechny body
    const lastStep = steps[steps.length - 1];
    
    // Ověření, že algoritmus našel všechny body
    expect(lastStep.resultPoints.length).toBe(database.getDataPoints().length);
    
    // Ověření, že žádné body nebyly eliminovány
    expect(lastStep.eliminatedPoints.length).toBe(0);
  });
});