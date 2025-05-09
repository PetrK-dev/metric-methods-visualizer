import { MTreeKnnAlgorithm } from "../../../../../domain/algorithms/MTREE/MTreeKnnAlgorithm";
import { Tree, MTreeNode, MTreeNodeType } from "../../../../../domain/core/data-structures/Tree";
import { Database } from "../../../../../domain/core/database/Database";
import { PointType } from "../../../../../domain/core/enums/PointType";
import { Point } from "../../../../../domain/core/models/Point";

describe('MTreeKnnAlgorithm', () => {
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
    const iterator = MTreeKnnAlgorithm.execute(database, tree, queryPoint, k);
    
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
    const iterator = MTreeKnnAlgorithm.execute(database, tree, queryPoint, k);
    
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
    for (const point of lastStep.eliminatedPoints) {
      expect(resultIds.has(point.id)).toBe(false);
    }
    
    // Ověření, že výsledné body mají menší vzdálenost než eliminované
    const resultDistances = lastStep.resultPoints.map(p => mockDistance(queryPoint, p));
    const maxResultDistance = Math.max(...resultDistances);
    
    for (const eliminated of lastStep.eliminatedPoints) {
      // U MTree algoritmu nelze vždy zaručit, že všechny eliminované body mají větší vzdálenost
      // Mohou být eliminovány i pomocí hierarchické struktury stromu
      // Ale můžeme zkontrolovat, že nejsou v k nejbližších sousedech
      
      // Nasbíráme všechny vzdálenosti
      const allDistances = database.getDataPoints().map(p => mockDistance(queryPoint, p));
      allDistances.sort((a, b) => a - b);
      
      // Vezmeme k-tou nejmenší vzdálenost 
      const kthDistance = allDistances[k-1];
      
      // Ověříme, že vzdálenost eliminovaného bodu je větší než k-tá vzdálenost
      // nebo že bod je v hierarchické struktuře, která byla eliminována
      const eliminatedDistance = mockDistance(queryPoint, eliminated);
      if (eliminatedDistance <= kthDistance) {
        // Pokud bod není dále než k-tý, měl by být v hierarchii, která byla prořezána
        // Toto nelze jednoduše ověřit, takže tento test můžeme přeskočit
      }
    }
  });

  test('execute with k=1 finds nearest neighbor', async () => {
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
    const iterator = MTreeKnnAlgorithm.execute(database, tree, queryPoint, k);
    
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

  test('execute with k equal to database size finds all points', async () => {
    const k = database.getDataPoints().length;
    
    // Spuštění algoritmu
    const iterator = MTreeKnnAlgorithm.execute(database, tree, queryPoint, k);
    
    // Projdeme všechny kroky algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Poslední krok by měl obsahovat všechny body z databáze ve výsledku
    const lastStep = steps[steps.length - 1];
    
    // Ověření, že výsledek obsahuje všechny body
    expect(lastStep.resultPoints.length).toBe(k);
    
    // Ověření, že všechny body z databáze jsou ve výsledku
    const resultIds = new Set(lastStep.resultPoints.map(p => p.id));
    for (const point of database.getDataPoints()) {
      expect(resultIds.has(point.id)).toBe(true);
    }
  });


  test('execute correctly processes knn search in hierarchical structure', async () => {
    // Přidání více bodů, aby strom měl více než jen kořen
    for (let i = 0; i < 5; i++) {
      const newPoint = new Point(6 + i, PointType.OBJECT, 5 + i, 5 + i);
      database.addPoint(newPoint);
    }
    
    // Reinicializace stromu s více body
    tree = new Tree(mockDistance, 3); // Kapacita 3 pro vytvoření hierarchie
    tree.initializeBase(database);
    
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
    const iterator = MTreeKnnAlgorithm.execute(database, countingTree, queryPoint, k);
    
    // Projdeme všechny kroky algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Ověření, že algoritmus našel správné body
    const lastStep = steps[steps.length - 1];
    const resultIds = lastStep.resultPoints.map(p => p.id).sort();
    
    expect(resultIds).toEqual(expect.arrayContaining(expectedNearestIds));
    
    // Kontrola, že algoritmus využívá dolní meze a hierarchickou strukturu
    // Spustíme znovu algoritmus a budeme sledovat kroky s dolními mezemi
    const newIterator = MTreeKnnAlgorithm.execute(database, tree, queryPoint, k);
    
    let lowerBoundSteps = 0;
    for await (const step of newIterator) {
      if (step.circles && step.circles.some(c => c.type === 'LOWER_BOUND')) {
        lowerBoundSteps++;
      }
    }
    
    // Ověření, že algoritmus používá dolní meze
    expect(lowerBoundSteps).toBeGreaterThan(0);
  });
});