import { Tree, MTreeNode, MTreeNodeType, RoutingRecord, DataRecord } from "../../core/data-structures/Tree";
import { Database } from "../../core/database/Database";
import { VisualType } from "../../core/enums/VisualType";
import { AlgorithmStep } from "../../core/models/interfaces/AlgorithmStep";
import { Point } from "../../core/models/Point";
import { TreeAlgorithm } from "../base/TreeAlgorithm";

/**
 * Implementation of the Range Search algorithm for M-Tree structures.
 * This algorithm finds all objects within a specified distance from the query point.
 * It visualizes the step-by-step execution of range query processing in an M-Tree.
 * 
 * The algorithm traverses the M-Tree structure recursively and uses the triangle inequality
 * to efficiently prune branches that cannot contain objects within the query range.
 */
export class MTreeRangeAlgorithm extends TreeAlgorithm {
  /**
   * Executes the Range Search algorithm on an M-Tree.
   * 
   * @param database - The database containing points
   * @param tree - The M-Tree data structure to search in
   * @param queryPoint - The query point to search around
   * @param radius - The search radius around the query point
   * @returns An async generator yielding algorithm steps for visualization
   */
  public static async *execute(
    database: Database,
    tree: Tree,
    queryPoint: Point,
    radius: number
  ): AsyncGenerator<AlgorithmStep> {
    let eliminatedPoints: Point[] = [];
    let resultPoints: Point[] = [];
    
    const createStep = this.createStepFactory(database, tree, resultPoints, eliminatedPoints);
    
    // Get all regions for visualization
    const allRegions = tree.getInitialVisualization().circles;
    
    // Line 0: MTree_Range(T, q, r)
    yield createStep(0, {
      circles: [
        ...allRegions,
        { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
      ]
    });
    
    // Line 1: S = ∅
    yield createStep(1, {
      circles: [
        ...allRegions,
        { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
      ]
    });
    
    // Line 2: RangeQueryIter(T.root, q, r, S, null, null)
    yield createStep(2, {
      circles: [
        ...allRegions,
        { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
      ]
    });

    // Get root node
    const rootNode = tree.getRootNode();
    if (rootNode) {
      // Start recursive search
      yield* this.rangeSearchRecursive(
        rootNode,
        queryPoint,
        radius,
        null, // parentObject
        null, // parentDistance
        resultPoints,
        eliminatedPoints,
        tree,
        database,
        createStep
      );
    }

    // Line 3: return S
    yield createStep(3, {
      circles: [{ center: queryPoint, radius, type: VisualType.RANGE_QUERY }]
    });
  }

  /**
   * Recursively searches a node in the M-Tree structure.
   * This method implements the RangeQueryIter algorithm from the M-Tree paper.
   * 
   * The method uses the triangle inequality property to prune branches:
   * - For routing nodes, it checks if the distance from query to routing object plus
   *   the radius of the routing region overlaps with the query radius
   * - For leaf nodes, it checks if the distance from query to data object is within
   *   the query radius
   * 
   * @param node - The current M-Tree node being processed
   * @param queryPoint - The query point
   * @param radius - The search radius
   * @param parentObject - The parent object (pivot) used for distance calculations
   * @param parentDistance - The distance from query to parent object
   * @param resultPoints - Array to collect matching points
   * @param eliminatedPoints - Array to collect eliminated points
   * @param tree - The M-Tree structure
   * @param database - The database containing points
   * @param createStep - Function to create algorithm steps for visualization
   * @returns An async generator yielding algorithm steps for visualization
   * @private
   */
  private static async *rangeSearchRecursive(
    node: MTreeNode,
    queryPoint: Point,
    radius: number,
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
        circles?: { center: Point, radius: number, type?: VisualType}[];
      }
    ) => AlgorithmStep
  ): AsyncGenerator<AlgorithmStep> {
    // Get all regions for this node and its children
    const nodeRegions = this.getNodeRegions(node, VisualType.TREE_REGION_LVL_1);
    
    // Line 5: RangeQueryIter(N, q, r, S, o_p, d_parent)
    yield createStep(5, {
      activePoints: node.getPoints(), // Active points are all points in current node
      circles: [
        ...nodeRegions,
        { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
      ]
    });

    // Line 6: if N is not a leaf node then
    yield createStep(6, {
      activePoints: node.getPoints(),
      circles: [
        ...nodeRegions,
        { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
      ]
    });

    if (node.type === MTreeNodeType.ROUTING) {
      // ROUTING NODE (INTERNAL)
      
      // Line 7: for each routing(o_j) ∈ N do
      yield createStep(7, {
        activePoints: node.getPoints(),
        circles: [
          ...nodeRegions,
          { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
        ]
      });

      for (const record of node.records) {
        const routingRecord = record as RoutingRecord;
        const routingObject = routingRecord.point;
        const routingRadius = routingRecord.radius;
        
        // Circle representing the region of current record
        const regionCircle = { 
          center: routingObject, 
          radius: routingRadius, 
          type: VisualType.TREE_REGION_LVL_1 
        };

        // Activate record for current iteration
        yield createStep(7, {
          activePoints: [routingObject],
          circles: [
            ...nodeRegions.filter(r => r.center.id !== routingObject.id),
            { ...regionCircle},
            { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
          ]
        });

        // Line 8: eliminated = false
        let eliminated = false;
        yield createStep(8, {
          activePoints: [routingObject],
          circles: [
            ...nodeRegions.filter(r => r.center.id !== routingObject.id),
            { ...regionCircle},
            { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
          ]
        });

        // Line 9: if o_p is not null then
        yield createStep(9, {
          activePoints: [...(parentObject ? [parentObject] : [])],
          circles: [
            ...nodeRegions.filter(r => r.center.id !== routingObject.id),
            { ...regionCircle},
            { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
          ]
        });

        if (parentObject && parentDistance !== null) {
          // Line 10: lb = |d_parent - d(o_j, o_p)|
          const lb = Math.abs(parentDistance - routingRecord.parentDistance);
          
          yield createStep(10, {
            activePoints: [routingObject, parentObject, queryPoint],
            distances: [
              { from: parentObject, to: queryPoint, type: VisualType.KNOWN_DISTANCE },
              { from: parentObject, to: routingObject, type: VisualType.KNOWN_DISTANCE },
              { from: queryPoint, to: routingObject, type: VisualType.UNKNOWN_DISTANCE }
            ],
            circles: [
              ...nodeRegions.filter(r => r.center.id !== routingObject.id),
              { ...regionCircle},
              { center: queryPoint, radius, type: VisualType.RANGE_QUERY },
              { center: queryPoint, radius: lb, type: VisualType.LOWER_BOUND }
            ]
          });
          
          // Line 11: if lb > r + r_o_j then
          const sumRadii = radius + routingRadius;

          yield createStep(11, {
            activePoints: [queryPoint, routingObject],
            circles: [
              ...nodeRegions.filter(r => r.center.id !== routingObject.id),
              { ...regionCircle},
              { center: queryPoint, radius, type: VisualType.RANGE_QUERY },
              { center: routingObject, radius: routingRadius, type: VisualType.RANGE_QUERY },
            ]
          });

          yield createStep(11, {
            activePoints: [queryPoint, routingObject],
            circles: [
              ...nodeRegions.filter(r => r.center.id !== routingObject.id),
              { ...regionCircle},
              { center: queryPoint, radius, type: VisualType.RANGE_QUERY },
              { center: queryPoint, radius: sumRadii, type: VisualType.LOWER_BOUND },
            ]
          });

          yield createStep(12, {
            activePoints: [queryPoint, routingObject],
            distances: [
              { from: queryPoint, to: routingObject, type: VisualType.UNKNOWN_DISTANCE },
              { from: parentObject, to: queryPoint, type: VisualType.KNOWN_DISTANCE },
              { from: parentObject, to: routingObject, type: VisualType.KNOWN_DISTANCE },

            ],
            circles: [
              ...nodeRegions.filter(r => r.center.id !== routingObject.id),
              { ...regionCircle},
              { center: queryPoint, radius, type: VisualType.RANGE_QUERY },
              { center: queryPoint, radius: sumRadii, type: lb <= sumRadii ? VisualType.INCLUSION : VisualType.ELIMINATION },
              { center: queryPoint, radius: lb, type: VisualType.LOWER_BOUND },
            ]
          });
          
          if (lb > sumRadii) {
            // Line 12: eliminated = true
            eliminated = true;
            eliminatedPoints.push(routingObject);

            yield createStep(13, {
              activePoints: [queryPoint, routingObject],
              distances: [
                { from: queryPoint, to: routingObject, type: VisualType.UNKNOWN_DISTANCE },
                { from: parentObject, to: queryPoint, type: VisualType.KNOWN_DISTANCE },
                { from: parentObject, to: routingObject, type: VisualType.KNOWN_DISTANCE },
  
              ],
              circles: [
                ...nodeRegions.filter(r => r.center.id !== routingObject.id),
                { ...regionCircle},
                { center: queryPoint, radius, type: VisualType.RANGE_QUERY },
                { center: queryPoint, radius: sumRadii, type: VisualType.ELIMINATION },
                { center: queryPoint, radius: lb, type: VisualType.LOWER_BOUND },
              ]
            });
          }
        }

        // Line 15: if not eliminated then
        yield createStep(16, {
          activePoints: [routingObject],
          circles: [
            ...nodeRegions.filter(r => r.center.id !== routingObject.id),
            { 
              ...regionCircle, 
              type: eliminated ? VisualType.ELIMINATION : VisualType.KNOWN_DISTANCE 
            },
            { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
          ]
        });

        if (!eliminated) {
          // Line 16: compute d(o_j, q)
          yield createStep(17, {
            activePoints: [queryPoint, routingObject],
            distances: [{ from: queryPoint, to: routingObject, type: VisualType.UNKNOWN_DISTANCE }],
            circles: [
              ...nodeRegions.filter(r => r.center.id !== routingObject.id),
              { ...regionCircle},
              { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
            ]
          });
          
          const distance = tree.distanceFunction(routingObject, queryPoint);
          
          yield createStep(17, {
            activePoints: [queryPoint, routingObject],
            distances: [{ from: queryPoint, to: routingObject, type: VisualType.KNOWN_DISTANCE }],
            circles: [
              ...nodeRegions.filter(r => r.center.id !== routingObject.id),
              { ...regionCircle},
              { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
            ]
          });

          // Line 17: r + r_o_j then
          const sumRadii = radius + routingRadius;

          yield createStep(18, {
            activePoints: [queryPoint, routingObject],
            circles: [
              ...nodeRegions.filter(r => r.center.id !== routingObject.id),
              { ...regionCircle},
              { center: queryPoint, radius, type: VisualType.RANGE_QUERY },
              { center: routingObject, radius: routingRadius, type: VisualType.RANGE_QUERY },
            ]
          });

          yield createStep(18, {
            activePoints: [queryPoint, routingObject],
            circles: [
              ...nodeRegions.filter(r => r.center.id !== routingObject.id),
              { ...regionCircle},
              { center: queryPoint, radius, type: VisualType.RANGE_QUERY },
              { center: queryPoint, radius: sumRadii, type: VisualType.LOWER_BOUND },
            ]
          });
          
          yield createStep(19, {
            activePoints: [queryPoint, routingObject],
            distances: [{ from: queryPoint, to: routingObject, type: VisualType.KNOWN_DISTANCE }],
            circles: [
              ...nodeRegions.filter(r => r.center.id !== routingObject.id),
              { ...regionCircle},
              { center: queryPoint, radius, type: VisualType.RANGE_QUERY },
              { center: queryPoint, radius: distance, type: distance <= sumRadii ? VisualType.INCLUSION : VisualType.ELIMINATION },
              { center: queryPoint, radius: sumRadii, type: VisualType.LOWER_BOUND },
            ]
          });

          if (distance <= sumRadii) {
            // Line 18: RangeQueryIter(o_j.childNode, q, r, S, o_j, d(o_j, q))

            yield createStep(20, {
              activePoints: [routingObject],
              distances: [{ 
                from: queryPoint, 
                to: routingObject, 
                type: VisualType.KNOWN_DISTANCE 
              }],
              circles: [
                ...nodeRegions.filter(r => r.center.id !== routingObject.id),
                { center: queryPoint, radius, type: VisualType.RANGE_QUERY },
              ],
            });

            // Recursive traversal of subtree
            yield* this.rangeSearchRecursive(
              routingRecord.childNode,
              queryPoint,
              radius,
              routingObject,
              distance,
              resultPoints,
              eliminatedPoints,
              tree,
              database,
              createStep
            );
          } else {
            // Region doesn't overlap with query - skip subtree
            eliminatedPoints.push(routingObject);
            const pointsInSubtree = this.getAllPointsInSubtree(routingRecord.childNode);
            eliminatedPoints.push(...pointsInSubtree);
          }
        }
      }

      // Line 22: end for (end of loop for routing node)
      yield createStep(23, {
        circles: [
          ...nodeRegions,
          { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
        ]
      });
    } else {
      // LEAF NODE
      
      yield createStep(24, {
        circles: [
          ...nodeRegions,
          { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
        ]
      });

      // Line 23: for each data(o_i) ∈ N do
      yield createStep(25, {
        circles: [
          ...nodeRegions,
          { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
        ]
      });

      for (const record of node.records) {
        const dataRecord = record as DataRecord;
        const dataObject = dataRecord.point;

        // Activate object for current iteration
        yield createStep(25, {
          activePoints: [dataObject],
          circles: [
            ...nodeRegions,
            { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
          ]
        });

        // Line 24: eliminated = false
        let eliminated = false;
        yield createStep(26, {
          activePoints: [dataObject],
          circles: [
            ...nodeRegions,
            { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
          ]
        });

        // Line 25: if o_p is not null then          
        yield createStep(27, {
          activePoints: [dataObject],
          circles: [
            ...nodeRegions,
            { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
          ]
        });

        if (parentObject && parentDistance !== null) {
          // Line 26: lb = |d_parent - d(o_i, o_p)|
          const lb = Math.abs(parentDistance - dataRecord.parentDistance);
          
          yield createStep(28, {
            activePoints: [...(parentObject ? [parentObject] : [])],
            distances: [
              { from: parentObject, to: queryPoint, type: VisualType.KNOWN_DISTANCE },
              { from: parentObject, to: dataObject, type: VisualType.KNOWN_DISTANCE },
              { from: queryPoint, to: dataObject, type: VisualType.UNKNOWN_DISTANCE }
            ],
            circles: [
              ...nodeRegions,
              { center: queryPoint, radius, type: VisualType.RANGE_QUERY },
              { center: queryPoint, radius: lb, type: VisualType.LOWER_BOUND }
            ]
          });
          
          // Line 27: if lb > r then
          yield createStep(29, {
            activePoints: [...(parentObject ? [parentObject] : [])],
            distances: [
              { from: parentObject, to: queryPoint, type: VisualType.KNOWN_DISTANCE },
              { from: parentObject, to: dataObject, type: VisualType.KNOWN_DISTANCE },
              { from: queryPoint, to: dataObject, type: VisualType.UNKNOWN_DISTANCE }
            ],
            circles: [
              ...nodeRegions,
              { center: queryPoint, radius, type: VisualType.RANGE_QUERY },
              { center: queryPoint, radius: lb, type: lb <= radius ? VisualType.INCLUSION : VisualType.ELIMINATION },
            ]
          });
          
          if (lb > radius) {
            // Line 28: eliminated = true
            eliminated = true;
            eliminatedPoints.push(dataObject);
            
            yield createStep(30, {
              activePoints: [dataObject],
              distances: [
                { from: parentObject, to: queryPoint, type: VisualType.KNOWN_DISTANCE },
                { from: parentObject, to: dataObject, type: VisualType.KNOWN_DISTANCE },
              ],
              circles: [
                ...nodeRegions,
                { center: queryPoint, radius, type: VisualType.RANGE_QUERY },
                { center: queryPoint, radius: lb, type: VisualType.ELIMINATION }
              ]
            });
          }
        }

        // Line 31: if not eliminated then
        yield createStep(33, {
          activePoints: [dataObject],
          circles: [
            ...nodeRegions,
            { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
          ]
        });

        if (!eliminated) {
          // Line 32: compute d(o_i, q)
          yield createStep(34, {
            activePoints: [queryPoint, dataObject],
            distances: [{ from: queryPoint, to: dataObject, type: VisualType.UNKNOWN_DISTANCE }],
            circles: [
              ...nodeRegions,
              { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
            ]
          });
          
          const distance = tree.distanceFunction(dataObject, queryPoint);
          
          yield createStep(34, {
            activePoints: [queryPoint, dataObject],
            distances: [{ from: queryPoint, to: dataObject, type: VisualType.KNOWN_DISTANCE }],
            circles: [
              ...nodeRegions,
              { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
            ]
          });

          // Line 33: if d(o_i, q) ≤ r then
          yield createStep(35, {
            activePoints: [queryPoint, dataObject],
            distances: [{ from: queryPoint, to: dataObject, type: distance <= radius ? VisualType.INCLUSION : VisualType.ELIMINATION  }],
            circles: [
              ...nodeRegions,
              { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
            ]
          });

          if (distance <= radius) {
            // Line 34: add o_i to S
            resultPoints.push(dataObject);
            
            yield createStep(36, {
              activePoints: [dataObject],
              distances: [{ 
                from: queryPoint, 
                to: dataObject, 
                type: VisualType.INCLUSION 
              }],
              circles: [
                ...nodeRegions,
                { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
              ]
            });
          } else {
            eliminatedPoints.push(dataObject);
          }
        }
      }

      // Line 38: end for (end of loop for leaf node)
      yield createStep(40, {
        circles: [
          ...nodeRegions,
          { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
        ]
      });
    }

    // Line 41: return S
    yield createStep(43, {
      circles: [
        ...nodeRegions,
        { center: queryPoint, radius, type: VisualType.RANGE_QUERY }
      ]
    });
  }
}