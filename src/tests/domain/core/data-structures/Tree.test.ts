// test/Tree.test.ts

import { MTreeNode, MTreeNodeType, Tree } from "../../../../domain/core/data-structures/Tree";
import { Database } from "../../../../domain/core/database/Database";
import { PointType } from "../../../../domain/core/enums/PointType";
import { Point } from "../../../../domain/core/models/Point";

describe('MTreeNode', () => {
  test('constructor creates node with correct parameters', () => {
    const node = new MTreeNode(MTreeNodeType.LEAF, 4);
    
    expect(node.type).toBe(MTreeNodeType.LEAF);
    expect(node.capacity).toBe(4);
    expect(node.records).toEqual([]);
  });
  
  test('isFull returns correct value', () => {
    const node = new MTreeNode(MTreeNodeType.LEAF, 2);
    
    // Prázdný uzel
    expect(node.isFull()).toBe(false);
    
    // Přidáme jeden záznam
    node.addRecord({
      point: new Point(1, PointType.OBJECT, 0, 0),
      id: 1,
      parentDistance: 0
    });
    
    expect(node.isFull()).toBe(false);
    
    // Přidáme druhý záznam, uzel by měl být plný
    node.addRecord({
      point: new Point(2, PointType.OBJECT, 1, 1),
      id: 2,
      parentDistance: 0
    });
    
    expect(node.isFull()).toBe(true);
  });
  
  test('isLeaf returns correct value', () => {
    const leafNode = new MTreeNode(MTreeNodeType.LEAF, 4);
    const routingNode = new MTreeNode(MTreeNodeType.ROUTING, 4);
    
    expect(leafNode.isLeaf()).toBe(true);
    expect(routingNode.isLeaf()).toBe(false);
  });
  
  test('getPoints returns all points in node', () => {
    const node = new MTreeNode(MTreeNodeType.LEAF, 4);
    const point1 = new Point(1, PointType.OBJECT, 0, 0);
    const point2 = new Point(2, PointType.OBJECT, 1, 1);
    
    node.addRecord({
      point: point1,
      id: 1,
      parentDistance: 0
    });
    
    node.addRecord({
      point: point2,
      id: 2,
      parentDistance: 0
    });
    
    const points = node.getPoints();
    expect(points.length).toBe(2);
    expect(points).toContainEqual(point1);
    expect(points).toContainEqual(point2);
  });
  
  test('addRecord adds record when not full', () => {
    const node = new MTreeNode(MTreeNodeType.LEAF, 2);
    const record = {
      point: new Point(1, PointType.OBJECT, 0, 0),
      id: 1,
      parentDistance: 0
    };
    
    const result = node.addRecord(record);
    
    expect(result).toBe(true);
    expect(node.records.length).toBe(1);
    expect(node.records[0]).toBe(record);
  });
  
  test('addRecord returns false when node is full', () => {
    const node = new MTreeNode(MTreeNodeType.LEAF, 1);
    
    // Přidáme první záznam
    node.addRecord({
      point: new Point(1, PointType.OBJECT, 0, 0),
      id: 1,
      parentDistance: 0
    });
    
    // Pokus o přidání dalšího záznamu
    const result = node.addRecord({
      point: new Point(2, PointType.OBJECT, 1, 1),
      id: 2,
      parentDistance: 0
    });
    
    expect(result).toBe(false);
    expect(node.records.length).toBe(1);
  });
});

describe('Tree', () => {
  let tree: Tree;
  let database: Database;
  
  // Jednoduchá vzdálenostní funkce pro testy
  const mockDistance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };
  
  beforeEach(() => {
    tree = new Tree(mockDistance, 4);
    
    database = new Database();
    database.addPoint(new Point(0, PointType.OBJECT, 0, 0));
    database.addPoint(new Point(1, PointType.OBJECT, 3, 0));
    database.addPoint(new Point(2, PointType.OBJECT, 0, 4));
    database.addPoint(new Point(3, PointType.OBJECT, 5, 5));
    database.addPoint(new Point(4, PointType.OBJECT, 2, 2));
    database.addPoint(new Point(5, PointType.OBJECT, 7, 1));
    database.addPoint(new Point(6, PointType.OBJECT, 6, 6));
    database.addPoint(new Point(7, PointType.OBJECT, 1, 7));
  });
  
  test('constructor creates tree with correct parameters', () => {
    expect(tree.getDistanceFunction()).toBe(mockDistance);
    expect(tree.getNodeCapacity()).toBe(4);
    expect(tree.isEmpty()).toBe(true);
  });
  
  test('initializeBase loads database points into tree', () => {
    tree.initializeBase(database);
    
    expect(tree.isEmpty()).toBe(false);
    expect(tree.countPoints()).toBe(database.getDataPoints().length);
    expect(tree.getSize()).toBe(database.getDataPoints().length);
  });
  
  test('initializeFull includes query point', () => {
    // Přidáme dotazovací bod do databáze
    const queryPoint = new Point(-1, PointType.QUERY, 5, 5);
    database.updatePoint(queryPoint);
    
    tree.initializeFull(database);
    
    // Velikost by měla být o 1 větší než počet bodů (kvůli query pointu)
    expect(tree.countPoints()).toBe(database.getDataPoints().length);
    expect(tree.getSize()).toBe(database.getDataPoints().length);
  });
  
  test('clear removes all nodes', () => {
    tree.initializeBase(database);
    expect(tree.isEmpty()).toBe(false);
    
    tree.clear();
    expect(tree.isEmpty()).toBe(true);
    expect(tree.countPoints()).toBe(0);
    expect(tree.getSize()).toBe(0);
  });
  
  test('validate tree confirms consistency', () => {
    tree.initializeBase(database);
    
    const validation = tree.validateTree();
    expect(validation.valid).toBe(true);
    expect(validation.errors.length).toBe(0);
  });
  
  test('getTreeStatistics returns correct statistics', () => {
    tree.initializeBase(database);
    
    const stats = tree.getTreeStatistics();
    
    expect(stats.totalPoints).toBe(database.getDataPoints().length);
    expect(stats.totalNodes).toBeGreaterThan(0);
    expect(stats.treeHeight).toBeGreaterThan(0);
    expect(typeof stats.averageLeafFill).toBe('number');
  });
  
  test('getRootNode returns null for empty tree', () => {
    expect(tree.getRootNode()).toBeNull();
  });
  
  test('getRootNode returns root node for initialized tree', () => {
    tree.initializeBase(database);
    
    const root = tree.getRootNode();
    expect(root).not.toBeNull();
  });
  
  test('clone creates independent copy', () => {
    tree.initializeBase(database);
    const originalSize = tree.getSize();
    
    const clone = tree.clone() as Tree;
    
    // Klon by měl mít stejnou velikost
    expect(clone.getSize()).toBe(originalSize);
    expect(clone.countPoints()).toBe(originalSize);
    
    // Změna originálu by neměla ovlivnit klon
    tree.clear();
    expect(tree.getSize()).toBe(0);
    expect(clone.getSize()).toBe(originalSize);
  });
  
  test('rangeSearch finds points within radius', () => {
    tree.initializeBase(database);
    
    const queryPoint = new Point(-1, PointType.QUERY, 2, 2);
    const radius = 3.0;
    
    const results = tree.rangeSearch(queryPoint, radius);
    
    // Zkontrolujeme, že všechny nalezené body jsou v daném poloměru
    for (const point of results) {
      expect(mockDistance(queryPoint, point)).toBeLessThanOrEqual(radius);
    }
    
    // Zkontrolujeme, že jsme našli všechny body v poloměru
    const manualResults = database.getDataPoints().filter(
      p => mockDistance(queryPoint, p) <= radius
    );
    
    expect(results.length).toBe(manualResults.length);
  });
  
  test('bulkLoad creates valid tree from points', () => {
    const points = database.getDataPoints();
    
    tree.bulkLoad(points);
    
    expect(tree.isEmpty()).toBe(false);
    expect(tree.countPoints()).toBe(points.length);
    
    // Kontrola, že strom je validní
    const validation = tree.validateTree();
    expect(validation.valid).toBe(true);
  });
  
  test('promote selects pivots with maximum distance', () => {
    const points = database.getDataPoints();
    
    const [pivot1, pivot2] = tree.promote(points);
    
    // Pivoty by měly být různé body
    expect(pivot1.id).not.toBe(pivot2.id);
    
    // Kontrola, že vybrané pivoty jsou skutečně z bodů
    expect(points.some(p => p.id === pivot1.id)).toBe(true);
    expect(points.some(p => p.id === pivot2.id)).toBe(true);
  });
  
  test('partition distributes points between pivots', () => {
    const points = database.getDataPoints();
    
    // Vytvoříme dva pivoty pro rozdělení
    const pivot1 = new Point(100, PointType.OBJECT, 0, 0);
    const pivot2 = new Point(101, PointType.OBJECT, 10, 10);
    
    const [set1, set2] = tree.partition(points, pivot1, pivot2);
    
    // Každá množina by měla obsahovat alespoň jeden bod
    expect(set1.length).toBeGreaterThan(0);
    expect(set2.length).toBeGreaterThan(0);
    
    // Součet bodů v obou množinách by měl být roven počtu vstupních bodů
    expect(set1.length + set2.length).toBe(points.length);
    
    // Body v množině 1 by měly být blíže k pivotu 1
    for (const point of set1) {
      const dist1 = mockDistance(point, pivot1);
      const dist2 = mockDistance(point, pivot2);
      expect(dist1).toBeLessThanOrEqual(dist2);
    }
    
    // Body v množině 2 by měly být blíže k pivotu 2
    for (const point of set2) {
      const dist1 = mockDistance(point, pivot1);
      const dist2 = mockDistance(point, pivot2);
      expect(dist2).toBeLessThan(dist1);
    }
  });
  
  test('manual tree construction', () => {
    // Vytvoříme strom ručně pro testování
    const rootNode = tree.createNode(MTreeNodeType.ROUTING, 2);
    
    const child1 = tree.createNode(MTreeNodeType.LEAF, 2);
    const child2 = tree.createNode(MTreeNodeType.LEAF, 2);
    
    const point1 = new Point(1, PointType.OBJECT, 0, 0);
    const point2 = new Point(2, PointType.OBJECT, 1, 1);
    const point3 = new Point(3, PointType.OBJECT, 5, 5);
    const point4 = new Point(4, PointType.OBJECT, 6, 6);
    
    // Přidáme body do listových uzlů
    child1.addRecord({
      point: point1,
      id: 1,
      parentDistance: 0
    });
    
    child1.addRecord({
      point: point2,
      id: 2,
      parentDistance: mockDistance(point1, point2)
    });
    
    child2.addRecord({
      point: point3,
      id: 3,
      parentDistance: 0
    });
    
    child2.addRecord({
      point: point4,
      id: 4,
      parentDistance: mockDistance(point3, point4)
    });
    
    // Přidáme směrovací záznamy do kořene
    rootNode.addRecord({
      point: point1,
      radius: tree.calculateMaxDistance(child1, point1),
      childNode: child1,
      parentDistance: 0
    });
    
    rootNode.addRecord({
      point: point3,
      radius: tree.calculateMaxDistance(child2, point3),
      childNode: child2,
      parentDistance: mockDistance(point1, point3)
    });
    
    tree.setRoot(rootNode);
    
    // Ověříme strukturu stromu
    expect(tree.countPoints()).toBe(4);
    expect(tree.isEmpty()).toBe(false);
    
    // Aktualizujeme parentDistance
    tree.updateParentDistances();
    
    // Ověříme, že strom je konzistentní
    const validation = tree.validateTree();
    expect(validation.valid).toBe(true);
    
    // Test findParentNode
    const foundParent = tree.findParentNode(rootNode, child1);
    expect(foundParent).toBe(rootNode);
    
    // Test findRoutingRecord
    const routingRecord = tree.findRoutingRecord(rootNode, child1);
    expect(routingRecord).not.toBeNull();
    expect(routingRecord?.point).toBe(point1);
  });
});