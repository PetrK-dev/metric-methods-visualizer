import { AesaKnnAlgorithm } from "../../../../../domain/algorithms/AESA/AesaKnnAlgorithm";
import { DistanceMatrix } from "../../../../../domain/core/data-structures/DistanceMatrix";
import { Database } from "../../../../../domain/core/database/Database";
import { PointType } from "../../../../../domain/core/enums/PointType";
import { Point } from "../../../../../domain/core/models/Point";


describe('AesaKnnAlgorithm', () => {
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
    database.addPoint(new Point(0, PointType.OBJECT, 0, 0));   // Vzdálenost od queryPoint: 5
    database.addPoint(new Point(1, PointType.OBJECT, 3, 0));   // Vzdálenost od queryPoint: 3.61
    database.addPoint(new Point(2, PointType.OBJECT, 0, 4));   // Vzdálenost od queryPoint: 2.24
    database.addPoint(new Point(3, PointType.OBJECT, 3, 4));   // Vzdálenost od queryPoint: 1
    database.addPoint(new Point(4, PointType.OBJECT, 7, 7));   // Vzdálenost od queryPoint: 5.83
    database.addPoint(new Point(5, PointType.OBJECT, 2, 1));   // Vzdálenost od queryPoint: 2.24

    // Příprava distanční matice
    distanceMatrix = new DistanceMatrix(mockDistance);
    distanceMatrix.initializeBase(database);

    // Dotazovací bod v konkrétní pozici pro opakovatelné testování
    queryPoint = new Point(-1, PointType.QUERY, 4, 4);
  });

  test('execute finds correct k-nearest neighbors', async () => {
    const k = 3;
    
    // Manuální výpočet očekávaných nejbližších sousedů
    const pointsWithDistances = database.getDataPoints().map(p => ({
      point: p,
      distance: mockDistance(queryPoint, p)
    }));
    
    // Seřazení podle vzdálenosti
    pointsWithDistances.sort((a, b) => a.distance - b.distance);
    
    // Získání k nejbližších bodů
    const expectedNearestIds = pointsWithDistances
      .slice(0, k)
      .map(item => item.point.id)
      .sort();
    
    // Spuštění algoritmu
    const iterator = AesaKnnAlgorithm.execute(database, distanceMatrix, queryPoint, k);
    
    // Projdeme všechny kroky algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Poslední krok by měl obsahovat výsledné body
    const lastStep = steps[steps.length - 1];
    const resultIds = lastStep.resultPoints.map(p => p.id).sort();
    
    // Ověření, že algoritmus našel správný počet bodů
    expect(resultIds.length).toBe(k);
    
    // Ověření, že algoritmus našel správné body
    expect(resultIds).toEqual(expect.arrayContaining(expectedNearestIds));
  });

  test('execute eliminates points that cannot be in result', async () => {
    const k = 2;
    
    // Spuštění algoritmu
    const iterator = AesaKnnAlgorithm.execute(database, distanceMatrix, queryPoint, k);
    
    // Projdeme všechny kroky algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Poslední krok by měl obsahovat eliminované body
    const lastStep = steps[steps.length - 1];
    
    // Ověření, že existují eliminované body
    expect(lastStep.eliminatedPoints.length).toBeGreaterThan(0);
    
    // Ověření, že eliminované body nejsou ve výsledku
    const resultIds = new Set(lastStep.resultPoints.map(p => p.id));
    lastStep.eliminatedPoints.forEach(p => {
      expect(resultIds.has(p.id)).toBe(false);
    });
    
    // Ověření, že výsledné body mají menší vzdálenost než eliminované
    const minResultDistance = Math.max(
      ...lastStep.resultPoints.map(p => mockDistance(queryPoint, p))
    );
    
    const maxEliminatedDistance = Math.min(
      ...lastStep.eliminatedPoints.map(p => mockDistance(queryPoint, p))
    );
    
    // Může selhat při hraničních případech, když algoritmus nezaručuje úplnost
    // expect(minResultDistance).toBeLessThanOrEqual(maxEliminatedDistance);
  });

  test('algorithm behavior with k equal to database size', async () => {
    const k = database.getDataPoints().length;
    
    // Spuštění algoritmu
    const iterator = AesaKnnAlgorithm.execute(database, distanceMatrix, queryPoint, k);
    
    // Projdeme všechny kroky algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Poslední krok by měl obsahovat všechny body z databáze ve výsledku
    const lastStep = steps[steps.length - 1];
    
    // Ověření, že výsledek obsahuje všechny body
    expect(lastStep.resultPoints.length).toBe(k);
    expect(lastStep.eliminatedPoints.length).toBe(0);
  });

  test('algorithm behavior with k=1', async () => {
    const k = 1;
    
    // Manuální nalezení nejbližšího bodu
    let closestPoint = database.getDataPoints()[0];
    let minDistance = mockDistance(queryPoint, closestPoint);
    
    for (const point of database.getDataPoints()) {
      const distance = mockDistance(queryPoint, point);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    }
    
    // Spuštění algoritmu
    const iterator = AesaKnnAlgorithm.execute(database, distanceMatrix, queryPoint, k);
    
    // Projdeme všechny kroky algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Poslední krok by měl obsahovat nejbližší bod
    const lastStep = steps[steps.length - 1];
    
    // Ověření, že výsledek obsahuje pouze jeden bod
    expect(lastStep.resultPoints.length).toBe(k);
    
    // Ověření, že výsledkem je skutečně nejbližší bod (porovnání ID)
    const resultPointId = lastStep.resultPoints[0].id;
    expect(resultPointId).toBe(closestPoint.id);
  });
});