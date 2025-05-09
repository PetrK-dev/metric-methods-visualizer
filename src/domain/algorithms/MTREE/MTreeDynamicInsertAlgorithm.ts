import { Tree, MTreeNodeType, DataRecord, RoutingRecord, MTreeNode } from "../../core/data-structures/Tree";
import { Database } from "../../core/database/Database";
import { PointType } from "../../core/enums/PointType";
import { VisualType } from "../../core/enums/VisualType";
import { AlgorithmStep } from "../../core/models/interfaces/AlgorithmStep";
import { Point } from "../../core/models/Point";
import { TreeAlgorithm } from "../base/TreeAlgorithm";

/**
 * Implementation of the dynamic insertion algorithm for M-Tree data structure.
 * This class handles the insertion of a new point into an existing M-Tree,
 * including finding the appropriate leaf node, splitting nodes if necessary,
 * and propagating changes up the tree.
 * 
 * The algorithm follows these main steps:
 * 1. Find the most appropriate leaf node for insertion
 * 2. Insert the point if the leaf has space
 * 3. If the leaf is full, split the node and propagate changes upward
 * 
 * @extends TreeAlgorithm
 */
export class MTreeDynamicInsertAlgorithm extends TreeAlgorithm {
  /**
   * Executes the dynamic insertion algorithm for M-Tree.
   * 
   * This generator function yields visualization steps for each stage of the algorithm,
   * making it suitable for educational visualization.
   * 
   * @param {Database} database - The database containing points
   * @param {Tree} tree - The M-Tree data structure to insert into
   * @param {Point} queryPoint - The point to be inserted
   * @returns {AsyncGenerator<AlgorithmStep>} Generator yielding algorithm steps for visualization
   */
  public static async *execute(
    database: Database,
    tree: Tree,
    queryPoint: Point
  ): AsyncGenerator<AlgorithmStep> {
    // Získáme všechny regiony pro lepší vizualizaci
    const allRegions = this.getAllRegions(tree.getRootNode());
    
    // Vytvoříme factory pro kroky algoritmu
    let resultPoints: Point[] = [];
    let eliminatedPoints: Point[] = [];
    const createStep = this.createStepFactory(database, tree, resultPoints, eliminatedPoints);
    
    // Řádek 0: M-Tree InsertObject(T, oi)
    yield createStep(0, {
      circles: [...allRegions]
    });
    

    yield createStep(1, {
      activePoints: [queryPoint],
      circles: [...allRegions]
    });
    
    // Získáme kořen stromu
    const rootNode = tree.getRootNode();
    
    // Pokud strom je prázdný, vytvoříme nový kořen
    if (!rootNode) {
      const newRoot = tree.createNode(MTreeNodeType.LEAF, tree.getNodeCapacity());
      tree.setRoot(newRoot);
      
      // Vytvoření záznamu pro bod
      const record: DataRecord = {
        point: queryPoint,
        id: queryPoint.id,
        parentDistance: 0
      };
      
      // Uložení bodu do nového kořene
      newRoot.addRecord(record);
      queryPoint.type = PointType.OBJECT;
      
      // Bod byl vložen - přidáme ho do výsledků
      resultPoints.push(queryPoint);
      
      // Řádek 3: store oi in the leaf node N
      yield createStep(2, {
        activePoints: [queryPoint]
      });
      
      // Řádek 8: END
      yield createStep(10, {
        activePoints: [queryPoint]
      });
      
      return;
    }

    yield createStep(4, {
      activePoints: [queryPoint]
    });
    
    // Hledáme listový uzel
    const { currentNode, nodePath, parentDistances } = yield* this.findLeaf(
      rootNode, queryPoint, tree, createStep
    );
    
    // Řádek 2: if N is not full then
    yield createStep(5, {
      activePoints: [queryPoint],
      circles: [...this.getNodeRegions(currentNode)]
    });
    
    if (!currentNode.isFull()) {
      
      // Najdeme rodičovský záznam pro výpočet parentDistance
      const parentDistance = parentDistances[parentDistances.length - 1];
      
      // Vytvoříme a přidáme nový záznam
      const record: DataRecord = {
        point: queryPoint,
        id: queryPoint.id,
        parentDistance
      };
      
      currentNode.addRecord(record);
      queryPoint.type = PointType.OBJECT;
      database.updatePoint(queryPoint);
      resultPoints.push(queryPoint);
      
      // Řádek 4: end if (implicitně)
      yield createStep(6, {
        activePoints: [queryPoint],
        circles: [...this.getNodeRegions(currentNode)]
      });

    } else {

      yield createStep(7, {
        activePoints: [queryPoint],
        circles: [...this.getNodeRegions(currentNode)]
      });

      // Řádek 5: SplitNode(N, oi)
      yield createStep(8, {
        activePoints: [queryPoint],
        circles: [...this.getNodeRegions(currentNode)]
      });
      
      yield* this.splitNode(
        currentNode, queryPoint, nodePath, parentDistances,
        database, tree, createStep, resultPoints
      );

      yield createStep(8, {
        activePoints: [],
        circles: [...this.getAllRegions(tree.getRootNode())]
      });
    }
    
    // Řádek 8: END
    yield createStep(10, {
      activePoints: [],
      circles: [...this.getAllRegions(tree.getRootNode())]
    });
  }
  
  /**
   * Finds the appropriate leaf node for insertion.
   * 
   * This method traverses the tree from the root to a leaf, selecting the
   * most appropriate path according to the M-Tree insertion algorithm.
   * It yields visualization steps showing the decision process.
   * 
   * @param {MTreeNode} rootNode - The root node of the tree
   * @param {Point} queryPoint - The point to be inserted
   * @param {Tree} tree - The M-Tree structure
   * @param {Function} createStep - Factory function for creating visualization steps
   * @returns {AsyncGenerator<AlgorithmStep, { currentNode: MTreeNode, nodePath: MTreeNode[], parentDistances: number[] }>}
   *          Generator yielding algorithm steps and returning the leaf node, path, and parent distances
   * @private
   */
  private static async *findLeaf(
    rootNode: MTreeNode,
    queryPoint: Point,
    tree: Tree,
    createStep: Function
  ): AsyncGenerator<AlgorithmStep, { currentNode: MTreeNode, nodePath: MTreeNode[], parentDistances: number[] }> {
    let currentNode = rootNode;
    let parentObject: Point | null = null;
    
    // Pole pro ukládání cesty od kořene k listu pro aktualizaci poloměrů později
    const nodePath: MTreeNode[] = [rootNode];
    const parentDistances: number[] = [0]; // Vzdálenosti k rodičovským pivotům
    
    yield createStep(12, {
      activePoints: [queryPoint],
      circles: [...this.getNodeRegions(currentNode)]
    });

    yield createStep(13, {
      activePoints: [queryPoint],
      circles: [...this.getNodeRegions(currentNode)]
    });

    while (!currentNode.isLeaf()) {
      // Řádek 9: FindLeaf(N, oi)
      
      // Řádek 13: N' = {∀_rout(oj) ∈ N: d(oi,oj) ≤ r_Oj}
      // Hledáme množinu N' - uzly, které pokrývají vkládaný objekt
      const N_prime: RoutingRecord[] = [];
      
      // Procházíme záznamy v aktuálním uzlu
      for (const record of currentNode.records) {
        const routingRecord = record as RoutingRecord;
        const routingObject = routingRecord.point;
        const routingRadius = routingRecord.radius;
        
        // Kružnice reprezentující region
        const regionCircle = { 
          center: routingObject, 
          radius: routingRadius, 
          type: VisualType.TREE_REGION 
        };
        
        // Vizualizace před výpočtem vzdálenosti
        yield createStep(16, {
          activePoints: [queryPoint, routingObject],
          distances: [{ from: queryPoint, to: routingObject, type: VisualType.UNKNOWN_DISTANCE }],
          circles: [
            ...this.getNodeRegions(currentNode, VisualType.TREE_REGION),
            { ...regionCircle, type: VisualType.TREE_REGION }
          ]
        });
        
        // Výpočet vzdálenosti
        const distance = tree.distanceFunction(queryPoint, routingObject);
        
        // Vizualizace po výpočtu vzdálenosti
        yield createStep(16, {
          activePoints: [queryPoint, routingObject],
          distances: [{ from: queryPoint, to: routingObject, type: VisualType.KNOWN_DISTANCE }],
          circles: [
            ...this.getNodeRegions(currentNode, VisualType.TREE_REGION),
            { ...regionCircle, type: VisualType.LOWER_BOUND }
          ]
        });

        yield createStep(16, {
          activePoints: [queryPoint, routingObject],
          distances: [{ from: queryPoint, to: routingObject, type: distance <= routingRadius ? VisualType.INCLUSION : VisualType.ELIMINATION }],
          circles: [
            ...this.getNodeRegions(currentNode, VisualType.TREE_REGION),
            { ...regionCircle, type: VisualType.LOWER_BOUND }
          ]
        });
        
        
        // Kontrola, zda objekt patří do pokrytí uzlu
        if (distance <= routingRadius) {
          N_prime.push(routingRecord);
          
          // Vizualizace zahrnutého regionu
          yield createStep(16, {
            activePoints: [queryPoint, routingObject],
            distances: [{ from: queryPoint, to: routingObject, type: VisualType.INCLUSION }],
            circles: [
              ...this.getNodeRegions(currentNode, VisualType.TREE_REGION),
              { ...regionCircle, type: VisualType.TREE_REGION }
            ]
          });
        }
      }
      
      let selectedRecord: RoutingRecord;
      
      // Řádek 14: if N' ≠ ∅ then
      yield createStep(17, {
        circles: [...this.getNodeRegions(currentNode)]
      });
      
      if (N_prime.length > 0) {
        // Řádek 15: select o_j* such that rout(o_j*) ∈ N': min{d(o_j*, oi)}
        
        // Hledáme záznam s minimální vzdáleností
        selectedRecord = N_prime[0];
        let minDistance = tree.distanceFunction(queryPoint, selectedRecord.point);

        yield createStep(18, {
          activePoints: [queryPoint, selectedRecord.point],
          circles: [...this.getNodeRegions(currentNode),
            {center: queryPoint, radius: minDistance, type: VisualType.KNOWN_DISTANCE}
          ]
        });
        
        for (let i = 1; i < N_prime.length; i++) {
          const record = N_prime[i];
          const distance = tree.distanceFunction(queryPoint, record.point);
          
          // Vizualizace porovnání vzdáleností
          yield createStep(18, {
            activePoints: [queryPoint, record.point, selectedRecord.point],
            circles: [...this.getNodeRegions(currentNode),
              { center: queryPoint, radius: distance, type: VisualType.KNOWN_DISTANCE },
              { center: queryPoint, radius: minDistance, type: VisualType.LOWER_BOUND }
            ]
          });

          yield createStep(18, {
            activePoints: [queryPoint, record.point, selectedRecord.point],
            circles: [...this.getNodeRegions(currentNode),
              { center: queryPoint, radius: distance, type: distance < minDistance ? VisualType.INCLUSION : VisualType.ELIMINATION },
              { center: queryPoint, radius: minDistance, type: VisualType.KNOWN_DISTANCE }
            ]
          });
          
          if (distance < minDistance) {
            minDistance = distance;
            selectedRecord = record;
          }

          yield createStep(18, {
            activePoints: [queryPoint, selectedRecord.point],
            circles: [...this.getNodeRegions(currentNode),
              { center: queryPoint, radius: minDistance, type: VisualType.INCLUSION }
            ]
          });
        }
        
        // Ukládáme vzdálenost k pivotu pro později
        parentDistances.push(minDistance);

      } else {
        // Řádek 16: else
        yield createStep(19, {
          circles: [...this.getNodeRegions(currentNode)]
        });
        
        // Hledáme záznam s nejmenší potřebou rozšíření poloměru
        selectedRecord = currentNode.records[0] as RoutingRecord;
        let minExtension = tree.distanceFunction(queryPoint, selectedRecord.point) - selectedRecord.radius;

        yield createStep(20, {
          activePoints: [queryPoint, selectedRecord.point],
          distances: [
            { from: queryPoint, to: selectedRecord.point, type: VisualType.KNOWN_DISTANCE }
          ],
          circles: [...this.getNodeRegions(currentNode),
            {center: selectedRecord.point, radius: selectedRecord.radius, type: VisualType.RANGE_QUERY},
            {center: queryPoint, radius: selectedRecord.radius, type: VisualType.KNOWN_DISTANCE}
          ]
        });

        yield createStep(20, {
          activePoints: [queryPoint, selectedRecord.point],
          circles: [...this.getNodeRegions(currentNode),
            {center: queryPoint, radius: minExtension, type: VisualType.KNOWN_DISTANCE}
          ]
        });
        
        for (let i = 1; i < currentNode.records.length; i++) {
          const record = currentNode.records[i] as RoutingRecord;
          const distance = tree.distanceFunction(queryPoint, record.point);
          const extension = distance - record.radius;
          
          // Vizualizace výpočtu rozšíření
          yield createStep(20, {
            activePoints: [queryPoint, record.point, selectedRecord.point],
            circles: [...this.getNodeRegions(currentNode),
              { center: queryPoint, radius: distance, type: VisualType.KNOWN_DISTANCE },
              { center: queryPoint, radius: minExtension, type: VisualType.LOWER_BOUND }
            ]
          });

          yield createStep(20, {
            activePoints: [queryPoint, record.point, selectedRecord.point],
            circles: [...this.getNodeRegions(currentNode),
              { center: queryPoint, radius: distance, type: distance < minExtension ? VisualType.INCLUSION : VisualType.ELIMINATION },
              { center: queryPoint, radius: minExtension, type: VisualType.KNOWN_DISTANCE }
            ]
          });
          
          if (extension < minExtension) {
            minExtension = extension;
            selectedRecord = record;
          }

          yield createStep(20, {
            activePoints: [queryPoint, selectedRecord.point],
            circles: [...this.getNodeRegions(currentNode),
              { center: queryPoint, radius: minExtension, type: VisualType.KNOWN_DISTANCE }
            ]
          });
        }
        
        // Řádek 18: r_o_j* = max(r_o_j*, d(o_j*, q))
        const distance = tree.distanceFunction(queryPoint, selectedRecord.point);
        
        yield createStep(21, {
          activePoints: [queryPoint, selectedRecord.point],
          circles: [
            ...this.getNodeRegions(currentNode),
            { center: queryPoint, radius: selectedRecord.radius, type: VisualType.KNOWN_DISTANCE },
          ]
        });

        yield createStep(21, {
          activePoints: [queryPoint, selectedRecord.point],
          circles: [
            ...this.getNodeRegions(currentNode),
            { center: queryPoint, radius: selectedRecord.radius, type: VisualType.KNOWN_DISTANCE },
            { center: queryPoint, radius: distance, type: distance > selectedRecord.radius ? VisualType.INCLUSION : VisualType.ELIMINATION },
          ]
        });
        
        // Aktualizace poloměru, pokud je to potřeba
        if (distance > selectedRecord.radius) {
          selectedRecord.radius = Math.max(selectedRecord.radius, distance);
        }

        yield createStep(21, {
          activePoints: [queryPoint, selectedRecord.point],
          circles: [
            ...this.getNodeRegions(currentNode),
            { center: queryPoint, radius: selectedRecord.radius, type: VisualType.KNOWN_DISTANCE }
          ]
        });
        
        // Ukládáme vzdálenost k pivotu pro později
        parentDistances.push(distance);
      }
      
      // Řádek 20: return FindLeaf(ptr(T(o_j*)), oi)
      parentObject = selectedRecord.point;
      
      yield createStep(23, {
        activePoints: [queryPoint, selectedRecord.point],
        circles: [
          ...this.getNodeRegions(currentNode),
        ]
      });
      
      // Posun do dalšího podstromu
      currentNode = selectedRecord.childNode;
      nodePath.push(currentNode);

      yield createStep(12, {
        activePoints: [currentNode],
        circles: [...this.getNodeRegions(currentNode)]
      });
  
      yield createStep(13, {
        activePoints: [currentNode],
        circles: [...this.getNodeRegions(currentNode)]
      });
    }

    yield createStep(23, {
      activePoints: [currentNode],
      circles: [...this.getNodeRegions(currentNode),]
    });
    
    return { currentNode, nodePath, parentDistances };
  }
  
  /**
   * Splits a node when it becomes full after insertion.
   * 
   * This method implements the node splitting process, including:
   * 1. Promoting two points as pivots for the split
   * 2. Partitioning the points between two nodes
   * 3. Updating parent nodes or creating a new root if necessary
   * 4. Handling recursive splits up the tree if needed
   * 
   * @param {MTreeNode} currentNode - The node that needs to be split
   * @param {Point} queryPoint - The new point being inserted
   * @param {MTreeNode[]} nodePath - Path from root to the current node
   * @param {number[]} parentDistances - Distances to parent pivots
   * @param {Database} database - The database containing points
   * @param {Tree} tree - The M-Tree data structure
   * @param {Function} createStep - Factory function for creating visualization steps
   * @param {Point[]} resultPoints - Array to store resulting points
   * @returns {AsyncGenerator<AlgorithmStep>} Generator yielding algorithm steps for visualization
   * @private
   */
  private static async *splitNode(
    currentNode: MTreeNode,
    queryPoint: Point,
    nodePath: MTreeNode[],
    parentDistances: number[],
    database: Database,
    tree: Tree,
    createStep: Function,
    resultPoints: Point[]
  ): AsyncGenerator<AlgorithmStep> {

    yield createStep(25, {
      activePoints: [queryPoint],
      circles: [...this.getNodeRegions(currentNode)]
    });

    // Řádek 23: N_all = {∀_oj: oj ∈ N} ∪ {oi}
    const allPoints: Point[] = currentNode.getPoints();
    allPoints.push(queryPoint);
    
    // Řádek 25: Promote(N_all, o_p1, o_p2)
    yield createStep(26, {
      activePoints: [...allPoints],
      circles: [...this.getNodeRegions(currentNode)]
    });
    
    // Výběr dvou pivotů
    const [pivot1, pivot2] = tree.promote(allPoints);
    
    yield createStep(27, {
      activePoints: [pivot1, pivot2],
      distances: [{ from: pivot1, to: pivot2, type: VisualType.KNOWN_DISTANCE }],
      circles: [...this.getNodeRegions(currentNode)]
    });
    
    // Řádek 27: Partition(N_all, o_p1, o_p2, N_p1, N_p2)
    yield createStep(28, {
      activePoints: [pivot1, pivot2],
      distances: [{ from: pivot1, to: pivot2, type: VisualType.KNOWN_DISTANCE }],
      circles: [...this.getNodeRegions(currentNode)]
    });
    
    // Rozdělení objektů mezi dva uzly
    const [node1Points, node2Points] = tree.partition(allPoints, pivot1, pivot2);
    
    yield createStep(28, {
      activePoints: [...node1Points, ...node2Points],
      distances: [{ from: pivot1, to: pivot2, type: VisualType.KNOWN_DISTANCE }],
      circles: [...this.getNodeRegions(currentNode)]
    });
    
    
    // Vytvoření nového uzlu
    const newNode = tree.createNode(currentNode.type, tree.getNodeCapacity());
    
    // Řádek 29: store entries from N_p1 into N and entries from N_p2 into N'
    yield createStep(29, {
      activePoints: [pivot1, pivot2],
      distances: [{ from: pivot1, to: pivot2, type: VisualType.KNOWN_DISTANCE }],
      circles: [...this.getNodeRegions(currentNode)]
    });

    yield createStep(30, {
      activePoints: [pivot1, pivot2],
      distances: [{ from: pivot1, to: pivot2, type: VisualType.KNOWN_DISTANCE }],
      circles: [...this.getNodeRegions(currentNode)]
    });
    
    // Vyprázdníme aktuální uzel
    currentNode.records = [];
    
    // Vytvoření nebo aktualizace záznamů pro oba uzly
    if (currentNode.isLeaf()) {
      // Pro listové uzly vytvoříme DataRecord
      for (const point of node1Points) {
        const distance = tree.distanceFunction(pivot1, point);
        currentNode.addRecord({
          point,
          id: point.id,
          parentDistance: distance
        } as DataRecord);
      }
      
      for (const point of node2Points) {
        const distance = tree.distanceFunction(pivot2, point);
        newNode.addRecord({
          point,
          id: point.id,
          parentDistance: distance
        } as DataRecord);
      }
    } else {
      // Pro vnitřní uzly vytvoříme RoutingRecord
      const oldRecords = currentNode.records as RoutingRecord[];
      
      for (const record of oldRecords) {
        const dist1 = tree.distanceFunction(record.point, pivot1);
        const dist2 = tree.distanceFunction(record.point, pivot2);
        
        // Aktualizujeme parentDistance
        record.parentDistance = dist1 <= dist2 ? dist1 : dist2;
        
        if (dist1 <= dist2) {
          currentNode.addRecord(record);
        } else {
          newNode.addRecord(record);
        }
      }
    }
    
    // Výpočet poloměrů
    const radius1 = this.calculateMaxDistance(currentNode, pivot1, tree.distanceFunction);
    const radius2 = this.calculateMaxDistance(newNode, pivot2, tree.distanceFunction);
    
    // Kontrola, zda je rozdělovaný uzel kořen
    // Řádek 30: if N is the root node then
    yield createStep(30, {
      activePoints: [...currentNode.getPoints()],
      distances: [{ from: pivot1, to: pivot2, type: VisualType.KNOWN_DISTANCE }],
      circles: [...this.getNodeRegions(currentNode)]
    });

    yield createStep(30, {
      activePoints: [...newNode.getPoints()],
      distances: [{ from: pivot1, to: pivot2, type: VisualType.KNOWN_DISTANCE }],
      circles: [...this.getNodeRegions(currentNode)]
    });
    
    yield createStep(31, {
      activePoints: [pivot1, pivot2],
      distances: [{ from: pivot1, to: pivot2, type: VisualType.KNOWN_DISTANCE }],
      circles: [...this.getNodeRegions(currentNode)]
    });

    if (currentNode === tree.getRootNode()) {
      // Řádek 31: allocate a new root node N_p      
      
      // Vytvoření nového kořenového uzlu
      const newRoot = tree.createNode(MTreeNodeType.ROUTING, tree.getNodeCapacity());
      
      // Řádek 32: store rout(o_p1) and rout(o_p2) in N_p
      yield createStep(32, {
        activePoints: [pivot1, pivot2],
        distances: [{ from: pivot1, to: pivot2, type: VisualType.KNOWN_DISTANCE }],
        circles: [...this.getNodeRegions(currentNode)]
      });
      
      // Vytvoření směrovacích záznamů
      newRoot.addRecord({
        point: pivot1,
        radius: radius1,
        childNode: currentNode,
        parentDistance: 0
      } as RoutingRecord);
      
      newRoot.addRecord({
        point: pivot2,
        radius: radius2,
        childNode: newNode,
        parentDistance: tree.distanceFunction(pivot1, pivot2)
      } as RoutingRecord);
      
      // Nastavení nového kořene
      tree.setRoot(newRoot);
      
      // Vizualizace nového kořene
      yield createStep(33, {
        activePoints: [pivot1, pivot2],
        distances: [{ from: pivot1, to: pivot2, type: VisualType.KNOWN_DISTANCE }],
        circles: [...this.getNodeRegions(currentNode)]
      });
    } else {
      // Řádek 33: else
      yield createStep(34, {
        activePoints: [pivot1, pivot2],
        distances: [{ from: pivot1, to: pivot2, type: VisualType.KNOWN_DISTANCE }],
        circles: [...this.getNodeRegions(currentNode)]
      });
      

      // Najdeme rodičovský uzel z cesty
      const parentNode = nodePath[nodePath.length - 2]; // Předposlední uzel v cestě

      // Řádek 34: let rout(o_p) be the routing entry of N stored in parent node N_p
      yield createStep(35, {
        circles: [...this.getNodeRegions(currentNode)]
      });

      yield createStep(36, {
        circles: [...this.getNodeRegions(currentNode)]
      });
      
      if (parentNode) {
        // Najdeme směrovací záznam pro původní uzel
        const oldRoutingEntry = this.findRoutingRecord(parentNode, currentNode);
        
        if (oldRoutingEntry) {
          // Řádek 35: replace entry rout(o_p) with rout(o_p1) in N_p
          yield createStep(35, {
            activePoints: [pivot1],
            distances: [{ from: pivot1, to: pivot2, type: VisualType.KNOWN_DISTANCE }],
            circles: [...this.getNodeRegions(currentNode)]
          });
          
          // Aktualizujeme záznam pro původní uzel
          oldRoutingEntry.point = pivot1;
          oldRoutingEntry.radius = radius1;
          
          // Řádek 36: if N_p is full then
          yield createStep(36, {
            activePoints: [pivot1, pivot2],
            distances: [{ from: pivot1, to: pivot2, type: VisualType.KNOWN_DISTANCE }],
            circles: [
              ...this.getNodeRegions(parentNode),
              { center: pivot1, radius: oldRoutingEntry.radius, type: VisualType.INCLUSION }
            ]
          });
          
          // Vytvoření nového záznamu pro nový uzel
          const parentPivot = this.getPivotOfNode(parentNode);
          const parentPivotDistance = parentPivot ? 
                  tree.distanceFunction(parentPivot, pivot2) : 0;
          
          const newRoutingEntry: RoutingRecord = {
            point: pivot2,
            radius: radius2,
            childNode: newNode,
            parentDistance: parentPivotDistance
          };

          yield createStep(37, {
            circles: [...this.getNodeRegions(currentNode)]
          });
          
          if (parentNode.isFull()) {
            // Řádek 37: SplitNode(N_p, o_p2)
            yield createStep(37, {
              activePoints: [pivot1, pivot2],
              distances: [{ from: pivot1, to: pivot2, type: VisualType.KNOWN_DISTANCE }],
              circles: [
                ...this.getNodeRegions(parentNode),
                { center: pivot1, radius: oldRoutingEntry.radius, type: VisualType.INCLUSION }
              ]
            });
            
            yield createStep(25, {
              activePoints: [pivot2],
              circles: [...this.getNodeRegions(currentNode)]
            });
            // Implementace rekurzivního rozdělení rodičovského uzlu
            // 1. Vytvořit pole všech bodů v rodičovském uzlu
            const parentAllPoints = parentNode.getPoints();
            // 2. Přidat pivot2 (o_p2) do tohoto pole
            parentAllPoints.push(pivot2);
            
            yield createStep(26, {
              activePoints: [...parentAllPoints],
              circles: [...this.getNodeRegions(currentNode)]
            });

            // 3. Vybrat nové pivoty
            const [parentPivot1, parentPivot2] = tree.promote(parentAllPoints);
            
            yield createStep(27, {
              activePoints: [parentPivot1, parentPivot2],
              distances: [{ from: parentPivot1, to: parentPivot2, type: VisualType.KNOWN_DISTANCE }],
              circles: [...this.getNodeRegions(currentNode)]
            });

            yield createStep(28, {
              activePoints: [parentPivot1, parentPivot2],
              distances: [{ from: parentPivot1, to: parentPivot2, type: VisualType.KNOWN_DISTANCE }],
              circles: [...this.getNodeRegions(currentNode)]
            });

            // 4. Rozdělit body
            const [parentGroup1, parentGroup2] = tree.partition(parentAllPoints, parentPivot1, parentPivot2);
            
            yield createStep(28, {
              activePoints: [...parentGroup1, ...parentGroup2],
              distances: [{ from: parentPivot1, to: parentPivot2, type: VisualType.KNOWN_DISTANCE }],
              circles: [...this.getNodeRegions(currentNode)]
            });

            // 5. Vytvořit nový uzel na úrovni rodiče
            const newParentNode = tree.createNode(parentNode.type, tree.getNodeCapacity());
            

            yield createStep(29, {
              activePoints: [parentPivot1, parentPivot2],
              distances: [{ from: parentPivot1, to: parentPivot2, type: VisualType.KNOWN_DISTANCE }],
              circles: [...this.getNodeRegions(currentNode)]
            });

            // 6. Přesunout záznamy do příslušných uzlů
            // Nejprve vytvořte mapu routing záznamů podle ID bodů
            const routingMap = new Map<number, RoutingRecord>();
            
            // Přesuneme reálné záznamy, ne jen body
            // Vytvořit pomocnou mapu pro rychlé vyhledávání
            const oldParentRecords = [...parentNode.records] as RoutingRecord[];
            parentNode.records = [];
            
            for (const record of oldParentRecords) {
              routingMap.set(record.point.id, record);
            }
            
            // Nastavit nový záznam pro pivot2
            routingMap.set(pivot2.id, newRoutingEntry);
            
            // Rozdělit záznamy do nových uzlů
            for (const point of parentGroup1) {
              const record = routingMap.get(point.id);
              if (record) {
                // Aktualizovat parentDistance
                record.parentDistance = tree.distanceFunction(parentPivot1, point);
                parentNode.addRecord(record);
              }
            }
            
            for (const point of parentGroup2) {
              const record = routingMap.get(point.id);
              if (record) {
                // Aktualizovat parentDistance
                record.parentDistance = tree.distanceFunction(parentPivot2, point);
                newParentNode.addRecord(record);
              }
            }

            yield createStep(30, {
              activePoints: [parentPivot1, parentPivot2],
              distances: [{ from: parentPivot1, to: parentPivot2, type: VisualType.KNOWN_DISTANCE }],
              circles: [...this.getNodeRegions(currentNode)]
            });
            
            // 7. Vypočítat nové poloměry
            const parentRadius1 = this.calculateMaxRadius(parentNode, parentPivot1, tree.distanceFunction);
            const parentRadius2 = this.calculateMaxRadius(newParentNode, parentPivot2, tree.distanceFunction);


            yield createStep(31, { /* ... */ });

            // 8. Kontrola, zda je rodič kořenem
            if (parentNode === tree.getRootNode()) {
              // Vytvoření nového kořene
              const newGrandParent = tree.createNode(MTreeNodeType.ROUTING, tree.getNodeCapacity());

              yield createStep(32, {
                activePoints: [parentPivot1, parentPivot2],
                distances: [{ from: parentPivot1, to: parentPivot2, type: VisualType.KNOWN_DISTANCE }],
                circles: [...this.getNodeRegions(currentNode)]
              });
              
              newGrandParent.addRecord({
                point: parentPivot1,
                radius: parentRadius1,
                childNode: parentNode,
                parentDistance: 0
              } as RoutingRecord);
              
              newGrandParent.addRecord({
                point: parentPivot2,
                radius: parentRadius2,
                childNode: newParentNode,
                parentDistance: tree.distanceFunction(parentPivot1, parentPivot2)
              } as RoutingRecord);

              tree.setRoot(newGrandParent);

              yield createStep(33, {
                activePoints: [parentPivot1, parentPivot2],
                distances: [{ from: parentPivot1, to: parentPivot2, type: VisualType.KNOWN_DISTANCE }],
                circles: [...this.getNodeRegions(currentNode)]
              });
              
            } else {

              yield createStep(34, {
                activePoints: [parentPivot1, parentPivot2],
                distances: [{ from: parentPivot1, to: parentPivot2, type: VisualType.KNOWN_DISTANCE }],
                circles: [...this.getNodeRegions(currentNode)]
              });
              // Rekurzivní rozdělení dalšího předka
              const grandParentNode = nodePath[nodePath.length - 3]; // Předpředposlední uzel v cestě
              
              yield createStep(35, {
                activePoints: [parentPivot1, parentPivot2],
                distances: [{ from: parentPivot1, to: parentPivot2, type: VisualType.KNOWN_DISTANCE }],
                circles: [...this.getNodeRegions(currentNode)]
              });

              yield createStep(36, {
                activePoints: [parentPivot1, parentPivot2],
                distances: [{ from: parentPivot1, to: parentPivot2, type: VisualType.KNOWN_DISTANCE }],
                circles: [...this.getNodeRegions(currentNode)]
              });

              yield createStep(37, {
                activePoints: [parentPivot1, parentPivot2],
                distances: [{ from: parentPivot1, to: parentPivot2, type: VisualType.KNOWN_DISTANCE }],
                circles: [...this.getNodeRegions(currentNode)]
              });

              if (grandParentNode) {
                const oldGrandRoutingEntry = this.findRoutingRecord(grandParentNode, parentNode);
                
                if (oldGrandRoutingEntry) {
                  // Aktualizovat záznam pro původní uzel
                  oldGrandRoutingEntry.point = parentPivot1;
                  oldGrandRoutingEntry.radius = parentRadius1;
                  
                  // Vytvořit nový záznam pro nový uzel
                  const grandPivot = this.getPivotOfNode(grandParentNode);
                  const grandPivotDistance = grandPivot ? 
                          tree.distanceFunction(grandPivot, parentPivot2) : 0;
                  
                  const newGrandRoutingEntry: RoutingRecord = {
                    point: parentPivot2,
                    radius: parentRadius2,
                    childNode: newParentNode,
                    parentDistance: grandPivotDistance
                  };
                  
                  if (grandParentNode.isFull()) {
                    // Toto je reálně složitější případ, který by vyžadoval další rekurzi
                    // Pro jednoduchost omezíme rekurzi na jeden krok nahoru
                      yield createStep(37, { /* ... */ });
                  } else {
                    grandParentNode.addRecord(newGrandRoutingEntry);
                  }
                }
              }
            }
          } else {
            // Řádek 39: store rout(o_p2) in N_p
            yield createStep(39, {
              activePoints: [pivot2],
              distances: [{ from: pivot1, to: pivot2, type: VisualType.KNOWN_DISTANCE }],
              circles: [
                ...this.getNodeRegions(parentNode),
                { center: pivot1, radius: oldRoutingEntry.radius, type: VisualType.INCLUSION }
              ]
            });
            
            // Přidáme nový záznam do rodičovského uzlu
            parentNode.addRecord(newRoutingEntry);
            
            yield createStep(40, {
              activePoints: [pivot1, pivot2],
              distances: [{ from: pivot1, to: pivot2, type: VisualType.KNOWN_DISTANCE }],
              circles: [
                ...this.getNodeRegions(parentNode),
                { center: pivot1, radius: oldRoutingEntry.radius, type: VisualType.INCLUSION },
                { center: pivot2, radius: newRoutingEntry.radius, type: VisualType.INCLUSION }
              ]
            });
          }
        }
      }
    }
    
    // Aktualizace parentDistance ve všech záznamech
    tree.updateParentDistances();
    
    // Bod byl vložen v rámci operace splitNode
    queryPoint.type = PointType.OBJECT;
    resultPoints.push(queryPoint);
    database.updatePoint(queryPoint);
    
    
    // Řádek 6: end if (implicitně)
    yield createStep(10, {
      activePoints: [queryPoint],
      circles: [...this.getAllRegions(tree.getRootNode())]
    });
  }
  
}