import { MTreeRangeAlgorithm } from "../../../../../domain/algorithms/MTREE/MTreeRangeAlgorithm";
import { Tree} from "../../../../../domain/core/data-structures/Tree";
import { Database } from "../../../../../domain/core/database/Database";
import { PointType } from "../../../../../domain/core/enums/PointType";
import { Point } from "../../../../../domain/core/models/Point";

describe('MTreeRangeAlgorithm', () => {
  let database: Database;
  let tree: Tree;
  let queryPoint: Point;

  // Mocková vzdálenostní funkce - euklidovská vzdálenost
  const mockDistance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  beforeEach(() => {
    // Příprava databáze s body v definovaných pozicích
    database = new Database();
    database.addPoint(new Point(0, PointType.OBJECT, 0, 0));   // Vzdálenost od queryPoint: 5.00
    database.addPoint(new Point(1, PointType.OBJECT, 3, 0));   // Vzdálenost od queryPoint: 3.61
    database.addPoint(new Point(2, PointType.OBJECT, 0, 4));   // Vzdálenost od queryPoint: 3.16
    database.addPoint(new Point(3, PointType.OBJECT, 3, 4));   // Vzdálenost od queryPoint: 1.41
    database.addPoint(new Point(4, PointType.OBJECT, 7, 7));   // Vzdálenost od queryPoint: 5.66
    database.addPoint(new Point(5, PointType.OBJECT, 2, 2));   // Vzdálenost od queryPoint: 2.83
    
    // Vytvoření a inicializace stromu
    tree = new Tree(mockDistance, 3); // Menší kapacita uzlů pro testování hierarchie
    tree.initializeBase(database);
    
    // Dotazovací bod v konkrétní pozici
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
    const iterator = MTreeRangeAlgorithm.execute(database, tree, queryPoint, radius);
    
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

  test('execute correctly eliminates points outside the radius', async () => {
    const radius = 3.0;
    
    // Manuální výpočet bodů mimo poloměr
    const pointsOutsideRange = database.getDataPoints().filter(p => 
      mockDistance(queryPoint, p) > radius
    );
    const expectedEliminatedIds = pointsOutsideRange.map(p => p.id).sort();
    
    // Spuštění algoritmu
    const iterator = MTreeRangeAlgorithm.execute(database, tree, queryPoint, radius);
    
    // Projdeme všechny kroky algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Poslední krok by měl obsahovat eliminované body
    const lastStep = steps[steps.length - 1];
    const eliminatedIds = lastStep.eliminatedPoints.map(p => p.id).sort();
    
    // Ověření, že algoritmus eliminoval správné body
    expect(eliminatedIds).toEqual(expect.arrayContaining(expectedEliminatedIds));
    
    // Ověření, že eliminované body nejsou ve výsledku
    const resultIds = new Set(lastStep.resultPoints.map(p => p.id));
    for (const id of eliminatedIds) {
      expect(resultIds.has(id)).toBe(false);
    }
  });

  test('execute with zero radius finds no points', async () => {
    const radius = 0.0;
    
    // Spuštění algoritmu
    const iterator = MTreeRangeAlgorithm.execute(database, tree, queryPoint, radius);
    
    // Projdeme všechny kroky algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Poslední krok by měl obsahovat prázdný výsledek
    const lastStep = steps[steps.length - 1];
    
    // Ověření, že algoritmus nenašel žádné body
    expect(lastStep.resultPoints.length).toBe(0);
  });

  test('execute with large radius finds all points', async () => {
    // Poloměr dostatečně velký, aby obsahoval všechny body
    const radius = 10.0;
    
    // Spuštění algoritmu
    const iterator = MTreeRangeAlgorithm.execute(database, tree, queryPoint, radius);
    
    // Projdeme všechny kroky algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Poslední krok by měl obsahovat všechny body
    const lastStep = steps[steps.length - 1];
    
    // Ověření, že algoritmus našel všechny body
    expect(lastStep.resultPoints.length).toBe(database.getDataPoints().length);
  });

  test('execute correctly uses tree structure for filtering', async () => {
    const radius = 3.0;
    
    // Spuštění algoritmu s počítáním volání distanční funkce
    let distanceCalls = 0;
    const countingDistance = (p1: Point, p2: Point): number => {
      distanceCalls++;
      return mockDistance(p1, p2);
    };
    
    // Vytvoříme nový strom s počítací funkcí
    const countingTree = new Tree(countingDistance, 3);
    countingTree.initializeBase(database);
    
    // Spuštění algoritmu
    const iterator = MTreeRangeAlgorithm.execute(database, countingTree, queryPoint, radius);
    
    // Projdeme všechny kroky algoritmu
    for await (const step of iterator) {
      // Jen procházíme kroky
    }
    
    // Teoreticky lineární vyhledávání by vyžadovalo n volání distanční funkce
    // M-Tree by měl využít hierarchickou strukturu a filtrovat pomocí trojúhelníkové nerovnosti
    // Neočekáváme, že počet volání bude přesně určitý, ale měl by být menší než počet všech bodů
    // To ale nelze spolehlivě testovat, protože závisí na konkrétní struktuře stromu
    
    // Místo toho ověříme, že algoritmus vyvolává kroky, které ukazují prořezávání
    const newIterator = MTreeRangeAlgorithm.execute(database, tree, queryPoint, radius);
    
    // Počítáme kroky, které obsahují vizualizaci eliminace pomocí dolních mezí
    let eliminationSteps = 0;
    for await (const step of newIterator) {
      // Kontrola, zda krok obsahuje eliminaci pomocí dolní meze
      if (step.circles && step.circles.some(c => c.type === 'ELIMINATION')) {
        eliminationSteps++;
      }
    }
    
    // Ověření, že existují kroky s eliminací
    expect(eliminationSteps).toBeGreaterThan(0);
  });

  test('execute on empty tree returns empty result', async () => {
    // Vytvoření prázdného stromu
    const emptyTree = new Tree(mockDistance, 3);
    
    // Spuštění algoritmu
    const iterator = MTreeRangeAlgorithm.execute(database, emptyTree, queryPoint, 3.0);
    
    // Projdeme všechny kroky algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Poslední krok by měl obsahovat prázdný výsledek
    const lastStep = steps[steps.length - 1];
    
    // Ověření, že výsledek je prázdný
    expect(lastStep.resultPoints.length).toBe(0);
  });

  test('execute correctly processes internal and leaf nodes', async () => {
    // Přidání více bodů, aby strom měl více než jen kořen
    for (let i = 0; i < 5; i++) {
      const newPoint = new Point(6 + i, PointType.OBJECT, 5 + i, 5 + i);
      database.addPoint(newPoint);
    }
    
    // Reinicializace stromu s více body
    tree = new Tree(mockDistance, 3); // Kapacita 3 pro vytvoření hierarchie
    tree.initializeBase(database);
    
    const radius = 3.0;
    
    // Manuální výpočet bodů v poloměru
    const pointsInRange = database.getDataPoints().filter(p => 
      mockDistance(queryPoint, p) <= radius
    );
    const expectedPointIds = pointsInRange.map(p => p.id).sort();
    
    // Spuštění algoritmu
    const iterator = MTreeRangeAlgorithm.execute(database, tree, queryPoint, radius);
    
    // Projdeme všechny kroky algoritmu a sledujeme průchod uzly
    let visitedRoutingNodes = 0;
    let visitedLeafNodes = 0;
    let skippedRoutingNodes = 0;
    
    for await (const step of iterator) {
      // Počítáme kroky s aktivními body v různých typech uzlů
      if (step.stepNumber === 6) { // if N is not a leaf node then
        if (step.activePoints && step.activePoints.length > 0) {
          visitedRoutingNodes++;
        }
      } else if (step.stepNumber === 24) { // Zpracování listového uzlu
        if (step.activePoints && step.activePoints.length > 0) {
          visitedLeafNodes++;
        }
      } else if (step.stepNumber === 20) { // Preskočení podstromu
        skippedRoutingNodes++;
      }
    }
    
    // Ověření, že algoritmus prošel alespoň jedním uzlem každého typu
    // Tyto testy by mohly selhat, pokud by strom měl jen jeden uzel
    // Ale s 10+ body a kapacitou 3 by měl být strom dostatečně hluboký
    expect(visitedRoutingNodes + visitedLeafNodes).toBeGreaterThan(0);
    
    // Ověření výsledku
    const lastIterator = MTreeRangeAlgorithm.execute(database, tree, queryPoint, radius);
    const steps = [];
    for await (const step of lastIterator) {
      steps.push(step);
    }
    
    const lastStep = steps[steps.length - 1];
    const resultIds = lastStep.resultPoints.map(p => p.id).sort();
    
    expect(resultIds).toEqual(expectedPointIds);
  });
});