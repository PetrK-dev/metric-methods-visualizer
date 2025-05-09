import { MTreeDynamicInsertAlgorithm } from "../../../../../domain/algorithms/MTREE/MTreeDynamicInsertAlgorithm";
import { Tree, MTreeNode, MTreeNodeType } from "../../../../../domain/core/data-structures/Tree";
import { Database } from "../../../../../domain/core/database/Database";
import { PointType } from "../../../../../domain/core/enums/PointType";
import { Point } from "../../../../../domain/core/models/Point";

describe('MTreeDynamicInsertAlgorithm', () => {
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
    
    // Příprava stromu s menší kapacitou uzlů pro testování rozdělení
    tree = new Tree(mockDistance, 3); // Kapacita uzlu = 3 (pro snadné testování rozdělení)
  });

  test('execute inserts point into empty tree', async () => {
    // Vytvoříme nový prázdný strom
    tree = new Tree(mockDistance, 3);
    
    // Bod k vložení
    queryPoint = new Point(-1, PointType.QUERY, 4, 4);
    
    // Spuštění algoritmu
    const iterator = MTreeDynamicInsertAlgorithm.execute(database, tree, queryPoint);
    
    // Projdeme všechny kroky algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Ověříme, že strom již není prázdný a má kořen
    expect(tree.getRootNode()).not.toBeNull();
    
    // Kořen by měl být listový uzel
    const root = tree.getRootNode();
    expect(root?.type).toBe(MTreeNodeType.LEAF);
    
    // Kořen by měl obsahovat vložený bod
    const pointIds = root?.records.map(r => r.point.id) || [];
    expect(pointIds).toContain(queryPoint.id);
    
    // Ověříme, že vložený bod je ve výsledcích
    const lastStep = steps[steps.length - 1];
    expect(lastStep.resultPoints).toContainEqual(expect.objectContaining({ id: queryPoint.id }));
  });

  test('execute inserts point into non-full node', async () => {
    // Nejprve vložíme několik bodů do stromu, ale ne dost na naplnění uzlu
    const firstPoint = new Point(0, PointType.OBJECT, 1, 1);
    const secondPoint = new Point(1, PointType.OBJECT, 2, 2);
    
    // Vložíme body manuálně pro přípravu testu
    database.addPoint(firstPoint);
    database.addPoint(secondPoint);
    
    // Inicializujeme strom s existujícími body
    tree.initializeBase(database);
    
    // Ověříme výchozí stav stromu
    expect(tree.getRootNode()).not.toBeNull();
    const initialRoot = tree.getRootNode();
    const initialPointCount = initialRoot?.records.length || 0;
    
    // Bod k vložení
    queryPoint = new Point(-1, PointType.QUERY, 3, 3);
    
    // Spuštění algoritmu
    const iterator = MTreeDynamicInsertAlgorithm.execute(database, tree, queryPoint);
    
    // Projdeme všechny kroky algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Ověříme, že strom má stále stejný kořen (nedošlo k rozdělení)
    expect(tree.getRootNode()).toBe(initialRoot);
    
    // A že obsahuje o jeden bod více
    expect(tree.getRootNode()?.records.length).toBe(initialPointCount + 1);
    
    // Ověříme, že vložený bod je ve výsledcích
    const lastStep = steps[steps.length - 1];
    expect(lastStep.resultPoints).toContainEqual(expect.objectContaining({ id: queryPoint.id }));
  });

  test('execute performs split when node is full', async () => {
    // Naplníme strom přesně k kapacitě, abychom otestovali rozdělení
    for (let i = 0; i < 3; i++) { // Kapacita uzlu je 3
      const point = new Point(i, PointType.OBJECT, i + 1, i + 1);
      database.addPoint(point);
    }
    
    // Inicializujeme strom s existujícími body
    tree.initializeBase(database);
    
    // Ověříme výchozí stav stromu - měl by mít jeden plný uzel
    const initialRoot = tree.getRootNode();
    expect(initialRoot?.records.length).toBe(3); // Plný uzel
    
    // Bod k vložení, který způsobí rozdělení
    queryPoint = new Point(-1, PointType.QUERY, 5, 5);
    
    // Spuštění algoritmu
    const iterator = MTreeDynamicInsertAlgorithm.execute(database, tree, queryPoint);
    
    // Projdeme všechny kroky algoritmu
    const steps = [];
    for await (const step of iterator) {
      steps.push(step);
    }
    
    // Nyní ověříme, že došlo k rozdělení - kořen by měl být nyní směrovací uzel
    const newRoot = tree.getRootNode();
    expect(newRoot?.type).toBe(MTreeNodeType.ROUTING);
    
    // Kořen by měl mít dva záznamy (dva směrovací záznamy na podstromy)
    expect(newRoot?.records.length).toBe(2);
    
    // Ověříme, že vložený bod je ve výsledcích
    const lastStep = steps[steps.length - 1];
    expect(lastStep.resultPoints).toContainEqual(expect.objectContaining({ id: queryPoint.id }));
  });

 
  test('execute updates radius correctly', async () => {
    // Připravíme strom s několika body
    for (let i = 0; i < 2; i++) {
      const point = new Point(i, PointType.OBJECT, i + 1, i + 1);
      database.addPoint(point);
    }
    
    // Inicializujeme strom
    tree.initializeBase(database);
    
    // Bod k vložení, který je daleko od existujících bodů
    queryPoint = new Point(-1, PointType.QUERY, 10, 10);
    
    // Spuštění algoritmu
    const iterator = MTreeDynamicInsertAlgorithm.execute(database, tree, queryPoint);
    
    // Projdeme všechny kroky algoritmu
    for await (const step of iterator) {
      // Jen procházíme kroky
    }
    
    // Ověříme, že poloměry pokrývají všechny body v podstromech
    function validateRadius(node: MTreeNode | null): void {
      if (!node || node.type !== MTreeNodeType.ROUTING) return;
      
      for (const record of node.records) {
        const routingRecord = record as any; // Použijeme any kvůli typům
        const childNode = routingRecord.childNode;
        const pivot = record.point;
        const radius = routingRecord.radius;
        
        // Ověříme, že všechny body v podstromu jsou v rámci poloměru
        function collectPoints(node: MTreeNode): Point[] {
          if (node.type === MTreeNodeType.LEAF) {
            return node.records.map(r => r.point);
          } else {
            return node.records.flatMap(r => {
              const routRec = r as any;
              return collectPoints(routRec.childNode);
            });
          }
        }
        
        const allPointsInSubtree = collectPoints(childNode);
        for (const point of allPointsInSubtree) {
          const distance = mockDistance(pivot, point);
          expect(distance).toBeLessThanOrEqual(radius + 1e-5); // Tolerance pro plovoucí čárku
        }
        
        // Rekurzivně ověříme podstrom
        validateRadius(childNode);
      }
    }
    
    // Validace z kořene
    validateRadius(tree.getRootNode());
  });

  test('execute correctly handles repeated insertions', async () => {
    // Vložíme více bodů postupně a ověříme stav stromu
    const points = [
      new Point(0, PointType.OBJECT, 1, 1),
      new Point(1, PointType.OBJECT, 2, 2),
      new Point(2, PointType.OBJECT, 3, 3),
      new Point(3, PointType.OBJECT, 4, 4),
      new Point(4, PointType.OBJECT, 5, 5),
      new Point(5, PointType.OBJECT, 6, 6)
    ];
    
    // Postupně vkládáme body
    for (let i = 0; i < points.length; i++) {
      queryPoint = points[i];
      queryPoint.type = PointType.QUERY; // Nastavíme jako dotazovací bod pro vložení
      
      // Spuštění algoritmu
      const iterator = MTreeDynamicInsertAlgorithm.execute(database, tree, queryPoint);
      
      // Projdeme všechny kroky algoritmu
      for await (const step of iterator) {
        // Jen procházíme kroky
      }
    }
    
    // Ověříme, že strom obsahuje všechny vložené body
    function countPoints(node: MTreeNode | null): number {
      if (!node) return 0;
      
      if (node.type === MTreeNodeType.LEAF) {
        return node.records.length;
      } else {
        let count = 0;
        for (const record of node.records) {
          const routingRecord = record as any;
          count += countPoints(routingRecord.childNode);
        }
        return count;
      }
    }
    
    const totalPoints = countPoints(tree.getRootNode());
    expect(totalPoints).toBe(points.length);
    
    // Ověříme, že strom má očekávanou strukturu - více než jeden uzel, protože došlo k rozdělení
    function countNodes(node: MTreeNode | null): number {
      if (!node) return 0;
      
      if (node.type === MTreeNodeType.LEAF) {
        return 1;
      } else {
        let count = 1; // Počítáme aktuální uzel
        for (const record of node.records) {
          const routingRecord = record as any;
          count += countNodes(routingRecord.childNode);
        }
        return count;
      }
    }
    
    const totalNodes = countNodes(tree.getRootNode());
    expect(totalNodes).toBeGreaterThan(1); // Očekáváme, že strom má více než jeden uzel
  });
});