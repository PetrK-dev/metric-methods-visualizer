import { LaesaDynamicInsertAlgorithm } from "../../../../../domain/algorithms/LAESA/LaesaDynamicInsertAlgorithm";
import { DistanceMatrix } from "../../../../../domain/core/data-structures/DistanceMatrix";
import { Database } from "../../../../../domain/core/database/Database";
import { PointType } from "../../../../../domain/core/enums/PointType";
import { Point } from "../../../../../domain/core/models/Point";

describe('LaesaDynamicInsertAlgorithm', () => {
  let database: Database;
  let distanceMatrix: DistanceMatrix;
  let queryPoint: Point;

  // Mocková vzdálenostní funkce
  const mockDistance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  beforeEach(() => {
    // Příprava databáze s několika body
    database = new Database();
    database.addPoint(new Point(0, PointType.OBJECT, 0, 0));
    database.addPoint(new Point(1, PointType.OBJECT, 3, 0));
    database.addPoint(new Point(2, PointType.OBJECT, 0, 4));
    database.addPoint(new Point(3, PointType.OBJECT, 3, 4));
    database.addPoint(new Point(4, PointType.OBJECT, 5, 5));

    // Nastavení pivotů pro LAESA
    database.setPivots([0, 2]); // body 0 a 2 jsou pivoty

    // Příprava distanční matice
    distanceMatrix = new DistanceMatrix(mockDistance);
    distanceMatrix.initializeBase(database);

    // Dotazovací bod (bude vložen)
    queryPoint = new Point(5, PointType.QUERY, 2, 2);
  });

  test('execute computes distances only between new point and pivots', async () => {
    // Pivoty v databázi
    const pivots = database.getPivots();
    expect(pivots.length).toBeGreaterThan(0);

    // Spuštění algoritmu
    const iterator = LaesaDynamicInsertAlgorithm.execute(database, distanceMatrix, queryPoint);
    
    // Projdeme všechny kroky algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Po dokončení algoritmu by měly být vzdálenosti k pivotům uloženy v matici
    for (const pivot of pivots) {
      expect(distanceMatrix.hasDistance(pivot.id, queryPoint.id)).toBe(true);
    }
    
    // Ale ke zbytku bodů by neměly být vzdálenosti vypočteny
    const nonPivotIds = database.getDataPoints()
      .filter(p => !pivots.some(pivot => pivot.id === p.id))
      .map(p => p.id);
    
    for (const id of nonPivotIds) {
      expect(distanceMatrix.hasDistance(id, queryPoint.id)).toBe(false);
    }
  });

  test('execute changes point type from QUERY to OBJECT', async () => {
    // Kontrola počátečního typu
    expect(queryPoint.type).toBe(PointType.QUERY);

    // Spuštění algoritmu
    const iterator = LaesaDynamicInsertAlgorithm.execute(database, distanceMatrix, queryPoint);

    // Projdeme všechny kroky algoritmu
    for await (const step of iterator) {
      // Jen procházíme kroky
    }

    // Po dokončení algoritmu by měl být typ bodu změněn
    expect(queryPoint.type).toBe(PointType.OBJECT);
  });

  test('final algorithm step contains queryPoint in resultPoints', async () => {
    // Spuštění algoritmu
    const iterator = LaesaDynamicInsertAlgorithm.execute(database, distanceMatrix, queryPoint);

    // Zachytíme všechny kroky algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }

    // Ověříme, že alespoň jeden krok existuje
    expect(steps.length).toBeGreaterThan(0);
    
    // Poslední krok by měl mít vložený bod v resultPoints
    const lastStep = steps[steps.length - 1];
    
    // Ověříme, že resultPoints obsahuje alespoň jeden bod
    expect(lastStep.resultPoints.length).toBeGreaterThan(0);
    
    // Najdeme bod se stejným ID jako queryPoint
    const resultPoint = lastStep.resultPoints.find(p => p.id === queryPoint.id);
    
    // Ověříme, že bod byl nalezen
    expect(resultPoint).toBeDefined();
    
    // Ověříme, že má správné souřadnice a typ
    expect(resultPoint?.x).toBe(queryPoint.x);
    expect(resultPoint?.y).toBe(queryPoint.y);
    expect(resultPoint?.type).toBe(PointType.OBJECT);
  });

  test('execute generates expected number of steps proportional to number of pivots', async () => {
    // Spuštění algoritmu
    const iterator = LaesaDynamicInsertAlgorithm.execute(database, distanceMatrix, queryPoint);
    
    // Počítání kroků algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Očekávaný počet kroků:
    // 2 kroky inicializace + (2 kroky pro každý pivot) + 3 kroky dokončení
    const pivotCount = database.getPivots().length;
    const expectedSteps = 2 + (pivotCount * 3) + 3;
    
    // Počet kroků by měl odpovídat očekávanému počtu
    expect(steps.length).toBe(expectedSteps);
  });

  test('algorithm progresses through all expected step numbers', async () => {
    // Spuštění algoritmu
    const iterator = LaesaDynamicInsertAlgorithm.execute(database, distanceMatrix, queryPoint);
    
    const stepNumbers = new Set<number>();
    for await (const step of iterator) {
      stepNumbers.add(step.stepNumber);
    }
    
    // Algoritmus by měl obsahovat kroky 0, 1, 2, 3, 4, 5
    expect(stepNumbers.has(0)).toBe(true);
    expect(stepNumbers.has(1)).toBe(true);
    expect(stepNumbers.has(2)).toBe(true);
    expect(stepNumbers.has(3)).toBe(true);
    expect(stepNumbers.has(4)).toBe(true);
    expect(stepNumbers.has(5)).toBe(true);
    expect(stepNumbers.size).toBe(6); // Celkem 6 různých čísel kroků
  });

  test('with no pivots should not compute any distances', async () => {
    // Vytvořme novou databázi bez pivotů
    const dbWithoutPivots = new Database();
    dbWithoutPivots.addPoint(new Point(0, PointType.OBJECT, 0, 0));
    dbWithoutPivots.addPoint(new Point(1, PointType.OBJECT, 3, 0));
    
    // Příprava nové matice
    const newMatrix = new DistanceMatrix(mockDistance);
    newMatrix.initializeBase(dbWithoutPivots);
    
    // Spuštění algoritmu
    const iterator = LaesaDynamicInsertAlgorithm.execute(dbWithoutPivots, newMatrix, queryPoint);
    
    // Projdeme všechny kroky algoritmu
    for await (const step of iterator) {
      // Jen procházíme kroky
    }
    
    // Po dokončení algoritmu by neměly existovat žádné vzdálenosti k queryPoint
    for (const point of dbWithoutPivots.getDataPoints()) {
      expect(newMatrix.hasDistance(point.id, queryPoint.id)).toBe(false);
    }
  });
});