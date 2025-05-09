import { Tree, MTreeNode, MTreeNodeType, RoutingRecord, DataRecord } from "../../core/data-structures/Tree";
import { Database } from "../../core/database/Database";
import { VisualType } from "../../core/enums/VisualType";
import { AlgorithmStep } from "../../core/models/interfaces/AlgorithmStep";
import { Point } from "../../core/models/Point";
import { NearestNeighbors } from "../base/NearestNeighbors";
import { TreeAlgorithm } from "../base/TreeAlgorithm";


export class MTreeKnnAlgorithm extends TreeAlgorithm {
  public static async *execute(
    database: Database,
    tree: Tree,
    queryPoint: Point,
    k: number
  ): AsyncGenerator<AlgorithmStep> {
    let resultPoints: Point[] = [];
    let eliminatedPoints: Point[] = [];
    
    const createStep = this.createStepFactory(database, tree, resultPoints, eliminatedPoints);
    
    // Získání všech regionů pro vizualizaci
    const allRegions = tree.getInitialVisualization().circles;
    
    // Řádek 0: kNNQuery(T, q, k):
    yield createStep(0, {
      circles: [...allRegions]
    });
    
    // Získáme kořen stromu
    const rootNode = tree.getRootNode();
    if (!rootNode) {
      return; // Strom je prázdný, končíme
    }
    
    // Řádek 1: Insert [T, -] into PR;
    // Inicializace prioritní fronty PR - obsahuje uzly s jejich minimální vzdáleností
    const pr: Array<{node: MTreeNode, dmin: number}> = [{node: rootNode, dmin: 0}];
    yield createStep(1, {
      circles: [...allRegions]
    });
    
    // Řádek 2: r = ∞;
    // Inicializace poloměru r = ∞ (nejhorší dosud nalezený k-tý nejbližší soused)
    let r = Infinity;
    yield createStep(2, {
      circles: [...allRegions]
    });
    
    // Řádek 3-5: Inicializace kolekce nejbližších sousedů
    const nearestNeighbors = new NearestNeighbors(k);
    
    yield createStep(3, {
      circles: [...allRegions]
    });
    
    // Řádek 5: end for
    yield createStep(4, {
      activePoints: [queryPoint],
      circles: [...allRegions]
    });
    
    // Hlavní cyklus algoritmu
    while (pr.length > 0) {
      // Řádek 6: While PR ≠ ∅ d
      
      // Implementace ChooseNode - vybere uzel s nejmenší dmin
      pr.sort((a, b) => a.dmin - b.dmin);
      
      yield createStep(5, {
        circles: [
          ...allRegions,
          { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
        ]
      });
      
      const nextNode = pr.shift();
      
      yield createStep(6, {
        circles: [
          ...allRegions,
          { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
        ]
      });
      
      if (!nextNode) break;
      
      // Řádek 8: kNNSearchNode(nextnode, q, k, NN, PR, r);
      yield createStep(7, {
        circles: [
          ...allRegions,
          { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
        ]
      });
      
      // Volání funkce kNNSearchNode a aktualizace poloměru r
      const newRadius = yield* this.kNNSearchNode(
        nextNode.node,
        queryPoint,
        k,
        nearestNeighbors,
        pr,
        r,
        null, // parentObject
        null, // parentDistance
        resultPoints,
        eliminatedPoints,
        tree,
        database,
        createStep
      );
      
      // DŮLEŽITÉ: Aktualizace poloměru r po návratu z kNNSearchNode
      r = newRadius;
      
      // Aktualizujeme resultPoints podle aktuálního stavu nejbližších sousedů
      resultPoints.length = 0;
      resultPoints.push(...nearestNeighbors.getPoints());
      
      yield createStep(8, {
        circles: [
          ...allRegions,
          { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
        ]
      });
      
      // Kontrola a odstranění uzlů z PR, které nemohou obsahovat lepší výsledky
      // Tuto operaci děláme i zde, pro případ že se r aktualizoval v kNNSearchNode
      for (let i = pr.length - 1; i >= 0; i--) {
        if (pr[i].dmin > r) {
          // Důležité: Před odstraněním uzlu označíme všechny jeho body jako eliminované
          const pointsInNode = this.getAllPointsInSubtree(pr[i].node);
          eliminatedPoints.push(...pointsInNode);
          pr.splice(i, 1);
        }
      }

      yield createStep(9, {
        circles: [
          ...allRegions,
          { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
        ]
      });
    }
    
    // Řádek 12: end While
    yield createStep(10, {
      circles: [
        ...allRegions,
        { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
      ]
    });
    
    // Závěrečná aktualizace resultPoints
    resultPoints.length = 0;
    resultPoints.push(...nearestNeighbors.getPoints());
    
    yield createStep(11, {
      circles: [
        ...allRegions,
        { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
      ]
    });
  }
  
  private static async *kNNSearchNode(
    node: MTreeNode,
    queryPoint: Point,
    k: number,
    nearestNeighbors: NearestNeighbors,
    pr: Array<{node: MTreeNode, dmin: number}>,
    r: number,
    parentObject: Point | null,
    parentDistance: number | null,
    resultPoints: Point[],
    eliminatedPoints: Point[],
    tree: Tree,
    database: Database,
    createStep: (
      stepNumber: number,
      options?: {
        activePoints?: Point[];
        distances?: { from: Point, to: Point, type?: VisualType }[];
        circles?: { center: Point, radius: number, type?: VisualType }[];
      }
    ) => AlgorithmStep
  ): AsyncGenerator<AlgorithmStep, number> {
    // Získání všech regionů pro tento uzel
    const nodeRegions = this.getNodeRegions(node, VisualType.TREE_REGION_LVL_1);
    
    // Řádek 19: kNNSearchNode(N, q, k, NN, PR, r):
    yield createStep(13, {
      activePoints: node.getPoints(),
      circles: [
        ...nodeRegions,
        { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
      ]
    });

    yield createStep(14, {
      activePoints: node.getPoints(),
      circles: [
        ...nodeRegions,
        { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
      ]
    });

    yield createStep(15, {
      activePoints: node.getPoints(),
      circles: [
        ...nodeRegions,
        { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
      ]
    });
    
    // Je uzel listový nebo vnitřní?
    if (node.type === MTreeNodeType.ROUTING) {
      // VNITŘNÍ UZEL (ROUTING)

      yield createStep(16, {
        activePoints: node.getPoints(),
        circles: [
          ...nodeRegions,
          { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
        ]
      });

      // Procházíme všechny směrovací záznamy v uzlu
      for (const record of node.records) {
        const routingRecord = record as RoutingRecord;
        const routingObject = routingRecord.point;
        const routingRadius = routingRecord.radius;
        
        // Kružnice reprezentující region aktuálního záznamu
        const regionCircle = { 
          center: routingObject, 
          radius: routingRadius, 
          type: VisualType.TREE_REGION_LVL_1 
        };
        
        let eliminated = false;
        // Aktivace záznamu pro aktuální iteraci
        yield createStep(17, {
          activePoints: [routingObject],
          circles: [
            ...nodeRegions.filter(r => r.center.id !== routingObject.id),
            { ...regionCircle },
            { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
          ]
        });

        yield createStep(18, {
          activePoints: [routingObject],
          circles: [
            ...nodeRegions.filter(r => r.center.id !== routingObject.id),
            { ...regionCircle },
            { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
          ]
        });
        
        
        
        // Kontrola první podmínky (trojúhelníková nerovnost)
        if (parentObject && parentDistance !== null) {
          const lb = Math.abs(parentDistance - routingRecord.parentDistance);
          
          
          yield createStep(19, {
            activePoints: [routingObject, parentObject, queryPoint],
            distances: [
              { from: parentObject, to: queryPoint, type: VisualType.KNOWN_DISTANCE },
              { from: parentObject, to: routingObject, type: VisualType.KNOWN_DISTANCE },
              { from: queryPoint, to: routingObject, type: VisualType.UNKNOWN_DISTANCE }
            ],
            circles: [
              ...nodeRegions.filter(r => r.center.id !== routingObject.id),
              { ...regionCircle },
              { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
              { center: queryPoint, radius: lb, type: VisualType.LOWER_BOUND }
            ]
          });

          const sumRadii = r + routingRadius;

          yield createStep(20, {
            activePoints: [routingObject, parentObject, queryPoint],
            distances: [
              { from: parentObject, to: queryPoint, type: VisualType.KNOWN_DISTANCE },
              { from: parentObject, to: routingObject, type: VisualType.KNOWN_DISTANCE },
              { from: queryPoint, to: routingObject, type: VisualType.UNKNOWN_DISTANCE }
            ],
            circles: [
              ...nodeRegions.filter(r => r.center.id !== routingObject.id),
              { ...regionCircle },
              { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
              { center: routingObject, radius: routingRadius, type: VisualType.KNN_BOUNDARY },
              { center: queryPoint, radius: sumRadii, type: VisualType.LOWER_BOUND }
            ]
          });
          
          yield createStep(21, {
            activePoints: [queryPoint, routingObject],
            distances: [
              { from: queryPoint, to: routingObject, type: VisualType.UNKNOWN_DISTANCE },
              { from: parentObject, to: queryPoint, type: VisualType.KNOWN_DISTANCE },
              { from: parentObject, to: routingObject, type: VisualType.KNOWN_DISTANCE },
            ],
            circles: [
              ...nodeRegions.filter(r => r.center.id !== routingObject.id),
              { ...regionCircle },
              { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
              { center: queryPoint, radius: sumRadii, type: lb > sumRadii ? VisualType.ELIMINATION : VisualType.INCLUSION },
              { center: queryPoint, radius: lb, type: VisualType.LOWER_BOUND },
            ]
          });
          
          if (lb > sumRadii) {
            eliminated = true;
            
            // DŮLEŽITÉ: Eliminace všech bodů v podstromu
            eliminatedPoints.push(routingObject);
            const pointsInSubtree = this.getAllPointsInSubtree(routingRecord.childNode);
            eliminatedPoints.push(...pointsInSubtree);
            
            yield createStep(22, {
              activePoints: [queryPoint, routingObject],
              distances: [
                { from: queryPoint, to: routingObject, type: VisualType.UNKNOWN_DISTANCE },
                { from: parentObject, to: queryPoint, type: VisualType.KNOWN_DISTANCE },
                { from: parentObject, to: routingObject, type: VisualType.KNOWN_DISTANCE },
              ],
              circles: [
                ...nodeRegions.filter(r => r.center.id !== routingObject.id),
                { ...regionCircle },
                { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
                { center: queryPoint, radius: sumRadii, type: VisualType.ELIMINATION },
                { center: queryPoint, radius: lb, type: VisualType.LOWER_BOUND },
              ]
            });
          }
        }

        yield createStep(25, {
          activePoints: [routingObject],
          circles: [
            ...nodeRegions.filter(r => r.center.id !== routingObject.id),
            { ...regionCircle },
            { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
          ]
        });
        
        if (!eliminated) {

          yield createStep(26, {
            activePoints: [queryPoint, routingObject],
            distances: [{ from: queryPoint, to: routingObject, type: VisualType.UNKNOWN_DISTANCE }],
            circles: [
              ...nodeRegions.filter(r => r.center.id !== routingObject.id),
              { ...regionCircle },
              { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
            ]
          });
          // Výpočet vzdálenosti k pivotu
          const distance = tree.distanceFunction(routingObject, queryPoint);
          
          yield createStep(26, {
            activePoints: [queryPoint, routingObject],
            distances: [{ from: queryPoint, to: routingObject, type: VisualType.KNOWN_DISTANCE }],
            circles: [
              ...nodeRegions.filter(r => r.center.id !== routingObject.id),
              { ...regionCircle },
              { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
            ]
          });
          
          // Výpočet minimální a maximální vzdálenosti k podstromu
          const dmin = Math.max(0, distance - routingRadius);

          yield createStep(27, {
            activePoints: [queryPoint, routingObject],
            distances: [{ from: queryPoint, to: routingObject, type:
              (distance - routingRadius < 0)? VisualType.ELIMINATION : VisualType.INCLUSION }],
            circles: [
              ...nodeRegions.filter(r => r.center.id !== routingObject.id),
              { ...regionCircle },
              { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
              { center: routingObject, radius: distance, type: VisualType.KNOWN_DISTANCE },
              { center: routingObject, radius: routingRadius, type: VisualType.RANGE_QUERY },
              { center: routingObject, radius: dmin, type: VisualType.INCLUSION }
            ]
          });

          const dmax = distance + routingRadius;

          yield createStep(28, {
            activePoints: [queryPoint, routingObject],
            distances: [{ from: queryPoint, to: routingObject, type: VisualType.KNOWN_DISTANCE }],
            circles: [
              ...nodeRegions.filter(r => r.center.id !== routingObject.id),
              { ...regionCircle },
              { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
              { center: routingObject, radius: distance, type: VisualType.KNOWN_DISTANCE },
              { center: routingObject, radius: routingRadius, type: VisualType.RANGE_QUERY },
              { center: routingObject, radius: dmax, type: VisualType.INCLUSION }
            ]
          });

          yield createStep(29, {
            activePoints: [queryPoint, routingObject],
            distances: [{ from: queryPoint, to: routingObject, type: VisualType.KNOWN_DISTANCE }],
            circles: [
              ...nodeRegions.filter(r => r.center.id !== routingObject.id),
              { ...regionCircle },
              { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
              { center: queryPoint, radius: dmin, type: dmin <= r ? VisualType.INCLUSION : VisualType.ELIMINATION}
            ]
          });
          
          // Kontrola dmin <= r pro přidání uzlu do PR
          if (dmin <= r) {
            pr.push({ node: routingRecord.childNode, dmin });
            
            yield createStep(30, {
              activePoints: [routingObject],
              distances: [{ from: queryPoint, to: routingObject, type: VisualType.KNOWN_DISTANCE }],
              circles: [
                ...nodeRegions.filter(r => r.center.id !== routingObject.id),
                { ...regionCircle },
                { center: queryPoint, radius: dmin, type: VisualType.INCLUSION}
              ]
            });
          } else {
            // DŮLEŽITÉ: Eliminace všech bodů v podstromu když dmin > r
            eliminatedPoints.push(routingObject);
            const pointsInSubtree = this.getAllPointsInSubtree(routingRecord.childNode);
            eliminatedPoints.push(...pointsInSubtree);
          }

          yield createStep(32, {
            activePoints: [queryPoint, routingObject],
            distances: [{ from: queryPoint, to: routingObject, type: VisualType.KNOWN_DISTANCE }],
            circles: [
              ...nodeRegions.filter(r => r.center.id !== routingObject.id),
              { ...regionCircle },
              { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
              { center: queryPoint, radius: dmax, type: dmax <= r ? VisualType.INCLUSION : VisualType.ELIMINATION}
            ]
          });
          
          // Kontrola dmax <= r pro aktualizaci NN
          if (dmax <= r) {
            // Aktualizace pomocí třídy MTreeNearestNeighbors
            const wasUpdated = nearestNeighbors.addWithCheck(routingObject, dmax);
            if (wasUpdated) {
              // DŮLEŽITÉ: Aktualizace poloměru r ihned po změně nearestNeighbors
              const oldRadius = r;
              r = nearestNeighbors.getFurthestDistance();
              
              // Aktualizace výsledků pro vizualizaci
              resultPoints.length = 0;
              resultPoints.push(...nearestNeighbors.getPoints());

              yield createStep(33, {
                activePoints: [routingObject],
                circles: [
                  ...nodeRegions.filter(r => r.center.id !== routingObject.id),
                  { ...regionCircle },
                  { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
                ]
              });
              
              // Odstranění uzlů z PR, které již nemohou obsahovat lepší výsledky
              if (r < oldRadius) {
                for (let i = pr.length - 1; i >= 0; i--) {
                  if (pr[i].dmin > r) {
                    // DŮLEŽITÉ: Eliminace všech bodů v podstromu
                    const pointsInNode = this.getAllPointsInSubtree(pr[i].node);
                    eliminatedPoints.push(...pointsInNode);
                    pr.splice(i, 1);
                  }
                }
              }

              yield createStep(34, {
                activePoints: [routingObject],
                circles: [
                  ...nodeRegions.filter(r => r.center.id !== routingObject.id),
                  { ...regionCircle },
                  { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
                ]
              });
            }
          }
        }
      }

      yield createStep(37, {
        circles: [
          { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
        ]
      });
      
    } else {
      // LISTOVÝ UZEL (LEAF)

      yield createStep(38, {
        circles: [
          { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
        ]
      });

      yield createStep(39, {
        circles: [
          { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
        ]
      });
      
      // Projdeme všechny datové záznamy v listu
      for (const record of node.records) {
        const dataRecord = record as DataRecord;
        const dataObject = dataRecord.point;
        
        // Aktivace objektu pro aktuální iteraci
        yield createStep(39, {
          activePoints: [dataObject],
          circles: [
            ...nodeRegions,
            { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
          ]
        });
        
        let eliminated = false;

        yield createStep(40, {
          activePoints: [dataObject],
          circles: [
            ...nodeRegions,
            { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
          ]
        });

        yield createStep(41, {
          activePoints: [dataObject],
          circles: [
            ...nodeRegions,
            { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
          ]
        });
        
        // Kontrola trojúhelníkové nerovnosti s rodičovským objektem
        if (parentObject && parentDistance !== null) {
          const lb = Math.abs(parentDistance - dataRecord.parentDistance);
          
          yield createStep(42, {
            activePoints: [...(parentObject ? [parentObject] : [])],
            distances: [
              { from: parentObject, to: queryPoint, type: VisualType.KNOWN_DISTANCE },
              { from: parentObject, to: dataObject, type: VisualType.KNOWN_DISTANCE },
              { from: queryPoint, to: dataObject, type: VisualType.UNKNOWN_DISTANCE }
            ],
            circles: [
              ...nodeRegions,
              { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
              { center: queryPoint, radius: lb, type: VisualType.LOWER_BOUND }
            ]
          });

          yield createStep(43, {
            activePoints: [...(parentObject ? [parentObject] : [])],
            distances: [
              { from: parentObject, to: queryPoint, type: VisualType.KNOWN_DISTANCE },
              { from: parentObject, to: dataObject, type: VisualType.KNOWN_DISTANCE },
              { from: queryPoint, to: dataObject, type: VisualType.UNKNOWN_DISTANCE }
            ],
            circles: [
              ...nodeRegions,
              { center: queryPoint, radius: r, type: lb > r ? VisualType.ELIMINATION : VisualType.INCLUSION },
              { center: queryPoint, radius: lb, type: VisualType.LOWER_BOUND }
            ]
          });
          
          if (lb > r) {
            eliminated = true;
            eliminatedPoints.push(dataObject);
            
            yield createStep(44, {
              activePoints: [dataObject],
              distances: [
                { from: parentObject, to: queryPoint, type: VisualType.KNOWN_DISTANCE },
                { from: parentObject, to: dataObject, type: VisualType.KNOWN_DISTANCE },
                { from: queryPoint, to: dataObject, type: VisualType.UNKNOWN_DISTANCE }
              ],
              circles: [
                ...nodeRegions,
                { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
                { center: queryPoint, radius: lb, type: VisualType.ELIMINATION }
              ]
            });
          }
        }

        yield createStep(47, {
          activePoints: [dataObject],
          circles: [
            ...nodeRegions,
            { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
          ]
        });
        
        if (!eliminated) {
          // Výpočet vzdálenosti k dotazu
          yield createStep(48, {
            activePoints: [queryPoint, dataObject],
            distances: [{ from: queryPoint, to: dataObject, type: VisualType.UNKNOWN_DISTANCE }],
            circles: [
              ...nodeRegions,
              { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
            ]
          });

          const distance = tree.distanceFunction(dataObject, queryPoint);
          
          yield createStep(48, {
            activePoints: [queryPoint, dataObject],
            distances: [{ from: queryPoint, to: dataObject, type: VisualType.KNOWN_DISTANCE }],
            circles: [
              ...nodeRegions,
              { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
            ]
          });

          yield createStep(48, {
            activePoints: [queryPoint, dataObject],
            distances: [{ from: queryPoint, to: dataObject, type: distance <= r ? VisualType.INCLUSION : VisualType.ELIMINATION }],
            circles: [
              ...nodeRegions,
              { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
            ]
          });
          
          // Kontrola d(oi, q) <= r pro přidání do výsledků
          if (distance <= r) {
            // Aktualizace kolekce nejbližších sousedů
            const oldRadius = r;
            const wasUpdated = nearestNeighbors.addWithCheck(dataObject, distance);
            
            // DŮLEŽITÉ: Aktualizace poloměru r ihned po změně nearestNeighbors
            r = nearestNeighbors.getFurthestDistance();

            yield createStep(49, {
              activePoints: [queryPoint, dataObject],
              distances: [{ from: queryPoint, to: dataObject, type: VisualType.INCLUSION }],
              circles: [
                ...nodeRegions,
                { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
              ]
            });
            
            // Aktualizace resultPoints pro vizualizaci
            if (wasUpdated) {
              resultPoints.length = 0;
              resultPoints.push(...nearestNeighbors.getPoints());
              
              // Odstranění uzlů z PR, které již nemohou obsahovat lepší výsledky
              if (r < oldRadius) {
                for (let i = pr.length - 1; i >= 0; i--) {
                  if (pr[i].dmin > r) {
                    // DŮLEŽITÉ: Eliminace všech bodů v podstromu
                    const pointsInNode = this.getAllPointsInSubtree(pr[i].node);
                    eliminatedPoints.push(...pointsInNode);
                    pr.splice(i, 1);
                  }
                }
              }

              yield createStep(50, {
                activePoints: [dataObject],
                circles: [
                  { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY },
                ]
              });
            }
          } else {
            eliminatedPoints.push(dataObject);
          }
        }
      }

      yield createStep(53, {
        circles: [
          { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
        ]
      });
    }
    
    yield createStep(55, {
      circles: [
        { center: queryPoint, radius: r, type: VisualType.KNN_BOUNDARY }
      ]
    });
    // DŮLEŽITÉ: Vrátíme aktuální hodnotu poloměru r zpět do volající funkce
    return r;
  }

}