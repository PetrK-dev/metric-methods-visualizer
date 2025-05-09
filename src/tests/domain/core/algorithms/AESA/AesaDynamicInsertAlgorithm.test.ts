// test/AesaDynamicInsertAlgorithm.test.ts

import { AesaDynamicInsertAlgorithm } from "../../../../../domain/algorithms/AESA/AesaDynamicInsertAlgorithm";
import { DistanceMatrix } from "../../../../../domain/core/data-structures/DistanceMatrix";
import { Database } from "../../../../../domain/core/database/Database";
import { PointType } from "../../../../../domain/core/enums/PointType";
import { VisualType } from "../../../../../domain/core/enums/VisualType";
import { AlgorithmStep } from "../../../../../domain/core/models/interfaces/AlgorithmStep";
import { Point } from "../../../../../domain/core/models/Point";


describe('AesaDynamicInsertAlgorithm', () => {
  let database: Database;
  let distanceMatrix: DistanceMatrix;
  let queryPoint: Point;

  // Mockovaná vzdálenostní funkce pro testy
  const mockDistance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  beforeEach(() => {
    // Příprava databáze s několika body
    database = new Database();

    database.addPoint(new Point(0, PointType.OBJECT, 0, 0));
    database.addPoint(new Point(1, PointType.OBJECT, 3, 0));
    database.addPoint(new Point(2, PointType.OBJECT, 0, 4));

    // Příprava distanční matice
    distanceMatrix = new DistanceMatrix(mockDistance);
    distanceMatrix.initializeBase(database);

    // Dotazovací bod (bude vložen)
    queryPoint = new Point(3, PointType.QUERY, 2, 2);
  });

  test('execute computes distances between new point and all existing points', async () => {
    // Spuštění algoritmu
    const iterator = AesaDynamicInsertAlgorithm.execute(database, distanceMatrix, queryPoint);

    // Projdeme všechny kroky algoritmu
    let lastStep = null;
    for await (const step of iterator) {
      lastStep = step;
    }

    // Po dokončení algoritmu by měly být vzdálenosti uloženy v matici
    expect(distanceMatrix.hasDistance(0, 3)).toBe(true);
    expect(distanceMatrix.hasDistance(1, 3)).toBe(true);
    expect(distanceMatrix.hasDistance(2, 3)).toBe(true);

    // Kontrola konkrétních vzdáleností
    expect(distanceMatrix.getDistance(0, 3)).toBeCloseTo(2.83, 1); // sqrt(8) ~= 2.83
    expect(distanceMatrix.getDistance(1, 3)).toBeCloseTo(2.24, 1); // sqrt(5) ~= 2.24
    expect(distanceMatrix.getDistance(2, 3)).toBeCloseTo(2.83, 1); // sqrt(8) ~= 2.83
  });

  test('execute changes point type from QUERY to OBJECT', async () => {
    // Kontrola počátečního typu
    expect(queryPoint.type).toBe(PointType.QUERY);

    // Spuštění algoritmu
    const iterator = AesaDynamicInsertAlgorithm.execute(database, distanceMatrix, queryPoint);

    // Projdeme všechny kroky algoritmu
    for await (const step of iterator) {
      // Jen procházíme kroky
    }

    // Po dokončení algoritmu by měl být typ bodu změněn
    expect(queryPoint.type).toBe(PointType.OBJECT);
  });

  test('execute adds point to result set', async () => {
    // Spuštění algoritmu
    const iterator = AesaDynamicInsertAlgorithm.execute(database, distanceMatrix, queryPoint);
  
    // Projdeme všechny kroky algoritmu
    const steps: AlgorithmStep[] = [];
    for await (const step of iterator) {
      steps.push(step);
    }
  
    // Kontrola, že algoritmus vygeneroval alespoň jeden krok
    expect(steps.length).toBeGreaterThan(0);
    
    // Bezpečný přístup k poslednímu kroku
    const lastStep = steps[steps.length - 1];
    expect(lastStep.resultPoints).toContainEqual(queryPoint);
  });

  test('algorithm steps follow expected flow', async () => {
    // Spuštění algoritmu
    const iterator = AesaDynamicInsertAlgorithm.execute(database, distanceMatrix, queryPoint);
    
    const steps: AlgorithmStep[] = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Ověření počtu kroků (2 základní + 3 body × 3 kroky na bod + 2 závěrečné)
    // Očekáváme: krok 0, krok 1, 3×(aktivace+příprava+zobrazení), krok 3, krok 4, krok 5
    expect(steps.length).toBe(14);
    
    // 1. Krok 0: Inicializace
    expect(steps[0].stepNumber).toBe(0);
    
    // 2. Krok 1: Příprava pro výpočty
    expect(steps[1].stepNumber).toBe(1);
    
    // 3. Kroky pro každý bod v databázi (3 body)
    const dbPoints = database.getDataPoints();
    for (let i = 0; i < dbPoints.length; i++) {
      const baseIndex = 2 + i * 3; // Posunutí na začátek kroků pro aktuální bod
      
      // Aktivace bodu
      const activationStep = steps[baseIndex];
      expect(activationStep.stepNumber).toBe(1); // Oprava: správné číslo kroku je 1
      expect(activationStep.activePoints.length).toBe(2);
      
      // Příprava na výpočet
      const preparationStep = steps[baseIndex + 1];
      expect(preparationStep.stepNumber).toBe(2);
      expect(preparationStep.distances.length).toBe(1);
      expect(preparationStep.distances[0].type).toBe(VisualType.UNKNOWN_DISTANCE);
      
      // Zobrazení vypočtené vzdálenosti
      const computationStep = steps[baseIndex + 2];
      expect(computationStep.stepNumber).toBe(2);
      expect(computationStep.distances.length).toBe(1);
      expect(computationStep.distances[0].type).toBe(VisualType.KNOWN_DISTANCE);
    }
    
    // 4. Krok 3: Dokončení výpočtu vzdáleností
    const step3Index = 2 + dbPoints.length * 3;
    expect(steps[step3Index].stepNumber).toBe(3);
    
    // 5. Krok 4: Zvýraznění vloženého bodu
    expect(steps[step3Index + 1].stepNumber).toBe(4);
    expect(steps[step3Index + 1].activePoints).toContainEqual(queryPoint);
    
    // 6. Krok 5: Finální výsledek
    expect(steps[step3Index + 2].stepNumber).toBe(5);
    expect(steps[step3Index + 2].resultPoints).toContainEqual(queryPoint);
  });

  test('final algorithm step contains queryPoint in resultPoints', async () => {
    // Spuštění algoritmu
    const iterator = AesaDynamicInsertAlgorithm.execute(database, distanceMatrix, queryPoint);
  
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
    expect(resultPoint?.type).toBe(PointType.OBJECT); // Typ by měl být změněn na OBJECT
  });
});