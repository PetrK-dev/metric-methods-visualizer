import { Database } from "../database/Database";
import { VisualType } from "../enums/VisualType";
import { Point } from "../models/Point";
import { IDataStructure, DataStructureType } from "./IDataStructure";


/**
 * Enumeration defining the types of nodes in the M-Tree.
 */
export enum MTreeNodeType {
  ROUTING = 'ROUTING',  // Internal node (contains routing objects)
  LEAF = 'LEAF'         // Leaf node (contains data objects)
}

/**
 * Interface for a general record in an M-Tree node.
 * Common properties shared by both routing and data records.
 */
interface MTreeRecord {
  point: Point;            // The point (center or data point)
  parentDistance: number;  // Distance from the parent's pivot
}

/**
 * Interface for routing records in internal nodes.
 * Contains additional properties needed for navigation in the tree.
 */
export interface RoutingRecord extends MTreeRecord {
  radius: number;          // Covering radius of the region
  childNode: MTreeNode;    // Reference to subtree
}

/**
 * Interface for data records in leaf nodes.
 * Contains additional properties for identifying data objects.
 */
export interface DataRecord extends MTreeRecord {
  id: number;              // Object/point identifier
}

/**
 * Class representing a node in the M-Tree structure.
 * Can be either a routing node (internal) or a leaf node.
 */
export class MTreeNode {
  type: MTreeNodeType;
  records: (RoutingRecord | DataRecord)[];
  capacity: number;
  pivot: any;
  
  /**
   * Creates a new M-Tree node.
   * 
   * @param {MTreeNodeType} type - Type of the node (ROUTING or LEAF)
   * @param {number} capacity - Maximum number of records the node can hold
   */
  constructor(type: MTreeNodeType, capacity: number) {
    this.type = type;
    this.records = [];
    this.capacity = capacity;
  }
  
  /**
   * Checks if the node is full (has reached its capacity).
   * 
   * @returns {boolean} True if the node is full, false otherwise
   */
  isFull(): boolean {
    return this.records.length >= this.capacity;
  }
  
  /**
   * Checks if the node is a leaf node.
   * 
   * @returns {boolean} True if the node is a leaf node, false if it's a routing node
   */
  isLeaf(): boolean {
    return this.type === MTreeNodeType.LEAF;
  }
  
  /**
   * Gets all points contained in this node.
   * 
   * @returns {Point[]} Array of points in the node
   */
  getPoints(): Point[] {
    return this.records.map(record => record.point);
  }
  
  /**
   * Adds a record to the node if the node is not full.
   * 
   * @param {RoutingRecord | DataRecord} record - Record to add to the node
   * @returns {boolean} True if the record was added successfully, false if the node is full
   */
  addRecord(record: RoutingRecord | DataRecord): boolean {
    if (this.isFull()) {
      return false;
    }
    this.records.push(record);
    return true;
  }
}

/**
 * Implementation of the M-Tree data structure.
 * M-Tree is a metric access method that organizes objects in a hierarchical structure
 * for efficient similarity searching.
 */
export class Tree implements IDataStructure<Tree> {
  readonly structureType: DataStructureType = DataStructureType.TREE;
  private root: MTreeNode | null = null;
  private nodeCapacity: number = 4; // Default node capacity
  public distanceFunction: (p1: Point, p2: Point) => number;
  private size: number = 0; // Number of points in the tree
  
  /**
   * Creates a new M-Tree instance.
   * 
   * @param {function} distanceFunction - Function to calculate distance between points
   * @param {number} nodeCapacity - Maximum number of entries in each node (default: 4)
   */
  constructor(distanceFunction: (p1: Point, p2: Point) => number, nodeCapacity: number = 4) {
    this.distanceFunction = distanceFunction;
    if (nodeCapacity) this.nodeCapacity = nodeCapacity;
  }
  
  /**
   * Initializes the tree with all points from the database (including query point).
   * Implementation of IDataStructure interface.
   * 
   * @param {Database} database - Database containing points to insert
   */
  initializeFull(database: Database): void {
    // Create tree from points in database
    this.clear();
    const points = database.getDataWithQuery();
    this.bulkLoad(points);
  }
  
  /**
   * Initializes the tree with data points from the database (excluding query point).
   * Implementation of IDataStructure interface.
   * 
   * @param {Database} database - Database containing points to insert
   */
  initializeBase(database: Database): void {
    this.clear();
    const points = database.getDataPoints();
    this.bulkLoad(points);
    console.log(`Points in tree: ${this.countPoints()}`);
    console.log(`Expected points: ${points.length}`);

    // Detailed tree statistics
    console.log('Tree statistics:', JSON.stringify(this.getTreeStatistics(), null, 2));

    // Tree consistency validation
    const validation = this.validateTree();
    if (!validation.valid) {
      console.error('Tree is inconsistent:', validation.errors);
    } else {
      console.log('Tree is consistent');
    }
  }

  /**
   * Counts the total number of points stored in the tree.
   * 
   * @returns {number} The number of points in the tree
   */
  countPoints(): number {
    if (!this.root) return 0;
    return this.countPointsInNode(this.root);
  }
  
  /**
   * Recursively counts points in a node and its subtrees.
   * 
   * @param {MTreeNode} node - The node to count points in
   * @returns {number} The number of points in the node and its subtrees
   * @private
   */
  private countPointsInNode(node: MTreeNode): number {
    if (node.isLeaf()) {
      // For leaf nodes, count data records
      return node.records.length;
    } else {
      // For routing nodes, recursively count points in subtrees
      let count = 0;
      for (const record of node.records) {
        const routingRecord = record as RoutingRecord;
        count += this.countPointsInNode(routingRecord.childNode);
      }
      return count;
    }
  }
  
  /**
   * Gets detailed statistics about the tree structure for diagnostics.
   * 
   * @returns {Object} Object containing information about the tree structure
   */
  getTreeStatistics(): {
    totalPoints: number;
    totalNodes: number;
    leafNodes: number;
    routingNodes: number;
    treeHeight: number;
    averageLeafFill: number;
    averageNodeFill: number;
    nodeDistribution: {[depth: number]: number};
    pointDistribution: {[depth: number]: number};
  } {
    const stats = {
      totalPoints: 0,
      totalNodes: 0,
      leafNodes: 0,
      routingNodes: 0,
      treeHeight: 0,
      averageLeafFill: 0,
      averageNodeFill: 0,
      nodeDistribution: {} as {[depth: number]: number},
      pointDistribution: {} as {[depth: number]: number}
    };
    
    if (!this.root) return stats;
    
    // Recursively traverse the tree and collect statistics
    this.collectNodeStatistics(this.root, 0, stats);
    
    // Calculate average fill rates
    if (stats.leafNodes > 0) {
      stats.averageLeafFill = stats.totalPoints / stats.leafNodes / this.nodeCapacity;
    }
    
    if (stats.totalNodes > 0) {
      stats.averageNodeFill = stats.routingNodes > 0 ? 
        (stats.routingNodes * this.nodeCapacity + stats.totalPoints) / stats.totalNodes / this.nodeCapacity :
        stats.totalPoints / stats.totalNodes / this.nodeCapacity;
    }
    
    return stats;
  }
  
  /**
   * Helper method for collecting statistics about nodes.
   * 
   * @param {MTreeNode} node - The node to collect statistics from
   * @param {number} depth - Current depth in the tree
   * @param {Object} stats - Statistics object to update
   * @private
   */
  private collectNodeStatistics(
    node: MTreeNode, 
    depth: number, 
    stats: any
  ): void {
    // Update basic counts
    stats.totalNodes++;
    stats.treeHeight = Math.max(stats.treeHeight, depth + 1);
    
    // Add to depth distribution
    stats.nodeDistribution[depth] = (stats.nodeDistribution[depth] || 0) + 1;
    
    if (node.isLeaf()) {
      // Leaf node
      stats.leafNodes++;
      stats.totalPoints += node.records.length;
      stats.pointDistribution[depth] = (stats.pointDistribution[depth] || 0) + node.records.length;
    } else {
      // Routing node
      stats.routingNodes++;
      
      // Recursively process subtrees
      for (const record of node.records) {
        const routingRecord = record as RoutingRecord;
        this.collectNodeStatistics(routingRecord.childNode, depth + 1, stats);
      }
    }
  }
  
  /**
   * Validates the consistency of the tree structure.
   * 
   * @returns {Object} Object containing validation result and any error messages
   */
  validateTree(): {valid: boolean, errors: string[]} {
    const errors: string[] = [];
    
    if (!this.root) {
      return {valid: true, errors};
    }
    
    this.validateNode(this.root, null, errors);
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Validates a single node and its subtrees.
   * 
   * @param {MTreeNode} node - The node to validate
   * @param {Point | null} parentPivot - The parent pivot point, or null for the root
   * @param {string[]} errors - Array to collect error messages
   * @returns {Set<number>} Set of point IDs in this node and its subtrees
   * @private
   */
  private validateNode(node: MTreeNode, parentPivot: Point | null, errors: string[]): Set<number> {
    const pointIds = new Set<number>();
    
    // Check node type
    if (node.type !== MTreeNodeType.ROUTING && node.type !== MTreeNodeType.LEAF) {
      errors.push(`Invalid node type: ${node.type}`);
    }
    
    // Check capacity
    if (node.records.length > node.capacity) {
      errors.push(`Node exceeds capacity: ${node.records.length} > ${node.capacity}`);
    }
    
    for (const record of node.records) {
      // Check parentDistance
      if (parentPivot && Math.abs(record.parentDistance - this.distanceFunction(parentPivot, record.point)) > 0.001) {
        errors.push(`Invalid parentDistance for point ${record.point.id}`);
      }
      
      if (node.isLeaf()) {
        // Leaf node - check for duplicates
        const dataRecord = record as DataRecord;
        if (pointIds.has(dataRecord.point.id)) {
          errors.push(`Duplicate point in leaf: ${dataRecord.point.id}`);
        }
        pointIds.add(dataRecord.point.id);
      } else {
        // Routing node - recursive validation
        const routingRecord = record as RoutingRecord;
        
        // Check radius
        let maxDist = 0;
        const childPointIds = this.validateNode(routingRecord.childNode, routingRecord.point, errors);
        
        // Check nesting condition
        for (const childId of childPointIds) {
          const childPoint = this.findPointById(routingRecord.childNode, childId);
          if (childPoint) {
            const dist = this.distanceFunction(routingRecord.point, childPoint);
            maxDist = Math.max(maxDist, dist);
            
            if (dist > routingRecord.radius + 0.001) {
              errors.push(`Nesting condition violation: point ${childId} is at distance ${dist} from pivot ${routingRecord.point.id}, but radius is ${routingRecord.radius}`);
            }
          }
        }
        
        // Add all points from subtree
        for (const id of childPointIds) {
          pointIds.add(id);
        }
      }
    }
    
    return pointIds;
  }
  
  /**
   * Helper method to find a point by its ID.
   * 
   * @param {MTreeNode} node - The node to search in
   * @param {number} pointId - The ID of the point to find
   * @returns {Point | null} The found point or null if not found
   * @private
   */
  private findPointById(node: MTreeNode, pointId: number): Point | null {
    if (node.isLeaf()) {
      for (const record of node.records) {
        const dataRecord = record as DataRecord;
        if (dataRecord.point.id === pointId) {
          return dataRecord.point;
        }
      }
    } else {
      for (const record of node.records) {
        const routingRecord = record as RoutingRecord;
        const foundPoint = this.findPointById(routingRecord.childNode, pointId);
        if (foundPoint) {
          return foundPoint;
        }
      }
    }
    
    return null;
  }
  
  /**
   * Returns the tree structure.
   * Implementation of IDataStructure interface.
   * 
   * @returns {Tree} This tree instance
   */
  getStructure(): Tree {
    return this;
  }

  /**
   * Gets the distance function used by this tree.
   * 
   * @returns {Function} The distance function
   */
  getDistanceFunction(): (p1: Point, p2: Point) => number {
    return this.distanceFunction;
  }
  
  /**
   * Creates a deep copy of this tree.
   * Implementation of IDataStructure interface.
   * 
   * @returns {IDataStructure<Tree>} A new tree instance with the same structure
   */
  clone(): IDataStructure<Tree> {
    // Create a new tree instance with the same distance function and capacity
    const clone = new Tree(this.distanceFunction, this.nodeCapacity);
    
    // If we have a root, clone the entire tree
    if (this.root) {
      clone.setRoot(this.cloneNode(this.root));
      clone.size = this.size; // Copy tree size
    }
    
    return clone;
  }

  /**
   * Helper method for recursively cloning a node.
   * 
   * @param {MTreeNode} node - The node to clone
   * @returns {MTreeNode} A new node instance with the same records
   * @private
   */
  private cloneNode(node: MTreeNode): MTreeNode {
    // Create a new node of the same type and capacity
    const clonedNode = new MTreeNode(node.type, node.capacity);
    
    // Copy all records
    for (const record of node.records) {
      if (node.type === MTreeNodeType.ROUTING) {
        // For routing nodes, we need to recursively clone subtrees
        const routingRecord = record as RoutingRecord;
        const clonedRecord: RoutingRecord = {
          point: routingRecord.point.clone(),
          radius: routingRecord.radius,
          childNode: this.cloneNode(routingRecord.childNode), // Recursive clone of subtree
          parentDistance: routingRecord.parentDistance
        };
        clonedNode.addRecord(clonedRecord);
      } else {
        // For leaf nodes, just copy data records
        const dataRecord = record as DataRecord;
        const clonedRecord: DataRecord = {
          point: dataRecord.point.clone(),
          id: dataRecord.id,
          parentDistance: dataRecord.parentDistance
        };
        clonedNode.addRecord(clonedRecord);
      }
    }
    
    return clonedNode;
  }

  /**
   * Gets the initial visualization data for the tree.
   * Returns arrays of distances and circles for rendering the tree structure.
   * 
   * @returns {Object} Object containing distances and circles arrays for visualization
   */
  getInitialVisualization(): { distances: any[], circles: any[] } {
    
    const distances: Array<{ from: Point, to: Point, type: VisualType }> = [];
    const circles: Array<{ center: Point, radius: number, type: VisualType }> = [];
    if (!this.getRootNode()) return { distances, circles };

    /**
     * Recursive function to collect region visualizations from the tree
     * 
     * @param {MTreeNode} node - The node to collect regions from
     * @param {number} depth - Current depth in the tree
     */
    const collectRegions = (node: MTreeNode, depth: number) => {
      if (node.type === MTreeNodeType.ROUTING) {
        for (const record of node.records) {
          const routingRecord = record as RoutingRecord;
          
          // Map depth to region type
          let regionType: VisualType;
          switch(depth) {
            case 0:
              regionType = VisualType.TREE_REGION_LVL_1;
              break;
            case 1:
              regionType = VisualType.TREE_REGION_LVL_2;
              break;
            default:
              regionType = VisualType.TREE_REGION_LVL_3;
              break;
          }
          
          // Add current node's region
          circles.push({
            center: routingRecord.point,
            radius: routingRecord.radius,
            type: regionType
          });
          
          // Recursively collect regions from subtrees
          collectRegions(routingRecord.childNode, depth + 1);
        }
      }
    };
    
    collectRegions(this.getRootNode()!, 0);
    return { distances, circles };
  }
  
  /**
   * Clears the tree structure.
   * Removes all nodes and resets the size counter.
   */
  clear(): void {
    this.root = null;
    this.size = 0;
  }
  
  /**
   * Checks if the tree is empty.
   * 
   * @returns {boolean} True if the tree has no nodes, false otherwise
   */
  isEmpty(): boolean {
    return this.root === null;
  }
  
  /**
   * Gets the number of points in the tree.
   * 
   * @returns {number} Number of points in the tree
   */
  getSize(): number {
    return this.size;
  }
  
  /**
   * Gets the root node of the tree.
   * 
   * @returns {MTreeNode | null} The root node or null if the tree is empty
   */
  getRootNode(): MTreeNode | null {
    return this.root;
  }

  /**
   * Gets the maximum capacity of nodes in this tree.
   * 
   * @returns {number} The node capacity
   */
  public getNodeCapacity(): number {
    return this.nodeCapacity;
  }
  
  /**
   * Performs a range search for points within radius of the query point.
   * 
   * @param {Point} queryPoint - The query point
   * @param {number} radius - The search radius
   * @returns {Point[]} Array of points within the specified radius
   */
  rangeSearch(queryPoint: Point, radius: number): Point[] {
    const result: Point[] = [];
    if (!this.root) return result;
    
    this.rangeSearchIter(this.root, queryPoint, radius, result, null);
    
    return result;
  }
  
  /**
   * Recursive method for tree traversal during range search.
   * Implements the RangeQueryIter from the pseudocode.
   * 
   * @param {MTreeNode} node - Current node being processed
   * @param {Point} queryPoint - Query point
   * @param {number} radius - Search radius
   * @param {Point[]} result - Array to collect result points
   * @param {Point | null} parentObject - Parent object, or null for the root
   * @private
   */
  private rangeSearchIter(node: MTreeNode, queryPoint: Point, radius: number, result: Point[], parentObject: Point | null): void {
    if (node.type === MTreeNodeType.ROUTING) {
      // Internal node (routing)
      for (const record of node.records) {
        const routingRecord = record as RoutingRecord;
        const routingObject = routingRecord.point;
        const childNode = routingRecord.childNode;
        const routingRadius = routingRecord.radius;
        
        // Implementation according to pseudocode (lines 4-10)
        let proceed = true;
        if (parentObject) {
          const parentDistance = this.distanceFunction(parentObject, queryPoint);
          const objectParentDistance = routingRecord.parentDistance;
          if (Math.abs(parentDistance - objectParentDistance) > radius + routingRadius) {
            proceed = false;
          }
        }
        
        if (proceed) {
          const distance = this.distanceFunction(routingObject, queryPoint);
          
          if (distance <= radius + routingRadius) {
            this.rangeSearchIter(childNode, queryPoint, radius, result, routingObject);
          }
        }
      }
    } else {
      // Leaf node - lines 11-17
      for (const record of node.records) {
        const dataRecord = record as DataRecord;
        const object = dataRecord.point;
        
        let proceed = true;
        if (parentObject) {
          const parentDistance = this.distanceFunction(parentObject, queryPoint);
          const objectParentDistance = dataRecord.parentDistance;
          if (Math.abs(parentDistance - objectParentDistance) > radius) {
            proceed = false;
          }
        }
        
        if (proceed) {
          const distance = this.distanceFunction(object, queryPoint);
          
          if (distance <= radius) {
            result.push(object);
          }
        }
      }
    }
  }

  /**
   * Creates a new node with the specified type and capacity.
   * 
   * @param {MTreeNodeType} type - Type of the node to create
   * @param {number} capacity - Capacity of the node
   * @returns {MTreeNode} The newly created node
   */
  public createNode(type: MTreeNodeType, capacity: number): MTreeNode {
    return new MTreeNode(type, capacity);
  }

  /**
   * Sets the root node of the tree.
   * 
   * @param {MTreeNode} node - The node to set as root
   */
  public setRoot(node: MTreeNode): void {
    this.root = node;
  }
  
  /**
   * Selects two pivot points from a set of points.
   * Uses a simple algorithm that chooses the two most distant points.
   * 
   * @param {Point[]} points - Array of points to choose pivots from
   * @returns {[Point, Point]} Tuple of two selected pivot points
   */
  public promote(points: Point[]): [Point, Point] {
    // Choose the two most distant points
    let maxDist = -1;
    let pivot1 = points[0];
    let pivot2 = points[1];
    
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = this.distanceFunction(points[i], points[j]);
        if (dist > maxDist) {
          maxDist = dist;
          pivot1 = points[i];
          pivot2 = points[j];
        }
      }
    }
    
    return [pivot1, pivot2];
  }

  /**
   * Partitions points between two nodes based on distance to pivots.
   * Assigns each point to the closer of the two pivots.
   * 
   * @param {Point[]} points - Array of points to partition
   * @param {Point} pivot1 - First pivot point
   * @param {Point} pivot2 - Second pivot point
   * @returns {[Point[], Point[]]} Tuple of two arrays containing partitioned points
   */
  public partition(points: Point[], pivot1: Point, pivot2: Point): [Point[], Point[]] {
    const node1Points: Point[] = [];
    const node2Points: Point[] = [];
    
    for (const point of points) {
      const dist1 = this.distanceFunction(point, pivot1);
      const dist2 = this.distanceFunction(point, pivot2);
      
      if (dist1 <= dist2) {
        node1Points.push(point);
      } else {
        node2Points.push(point);
      }
    }
    
    return [node1Points, node2Points];
  }
  
  /**
   * Calculates the maximum distance from a pivot to any point in a node.
   * Used for determining the radius of covering regions.
   * 
   * @param {MTreeNode} node - The node to calculate distances in
   * @param {Point} pivot - The pivot point to measure distances from
   * @returns {number} The maximum distance found
   */
  public calculateMaxDistance(node: MTreeNode, pivot: Point): number {
    let maxDist = 0;
    
    for (const record of node.records) {
      const dist = this.distanceFunction(pivot, record.point);
      if (dist > maxDist) maxDist = dist;
    }
    
    return maxDist;
  }
  
  /**
   * Updates parent distances in all records.
   * Recalculates distances between parent and child nodes in the tree.
   */
  public updateParentDistances(): void {
    if (!this.root) return;
    this.updateNodeParentDistances(this.root);
  }
  
  /**
   * Recursively updates parent distances in a node and its subtrees.
   * 
   * @param {MTreeNode} node - The node to update
   */
  public updateNodeParentDistances(node: MTreeNode): void {
    if (node.isLeaf()) return;
    
    for (const record of node.records) {
      const routingRecord = record as RoutingRecord;
      const childNode = routingRecord.childNode;
      
      for (const childRecord of childNode.records) {
        childRecord.parentDistance = this.distanceFunction(routingRecord.point, childRecord.point);
      }
      
      this.updateNodeParentDistances(childNode);
    }
  }
  
  /**
   * Finds the parent node of a given node.
   * 
   * @param {MTreeNode} startNode - The node to start the search from
   * @param {MTreeNode} targetNode - The node to find the parent of
   * @returns {MTreeNode | null} The parent node, or null if not found
   */
  public findParentNode(startNode: MTreeNode, targetNode: MTreeNode): MTreeNode | null {
    if (startNode.isLeaf()) return null;
    
    for (const record of startNode.records) {
      const routingRecord = record as RoutingRecord;
      
      if (routingRecord.childNode === targetNode) {
        return startNode;
      }
      
      const result = this.findParentNode(routingRecord.childNode, targetNode);
      if (result) return result;
    }
    
    return null;
  }
  
  /**
   * Finds the routing record for a given child node.
   * 
   * @param {MTreeNode} parentNode - The parent node
   * @param {MTreeNode} childNode - The child node to find the routing record for
   * @returns {RoutingRecord | null} The routing record, or null if not found
   */
  public findRoutingRecord(parentNode: MTreeNode, childNode: MTreeNode): RoutingRecord | null {
    for (const record of parentNode.records) {
      const routingRecord = record as RoutingRecord;
      if (routingRecord.childNode === childNode) {
        return routingRecord;
      }
    }
    return null;
  }
  
  /**
   * Finds the parent routing record of a given node.
   * 
   * @param {MTreeNode} startNode - The node to start the search from
   * @param {MTreeNode} targetNode - The node to find the parent routing record for
   * @returns {RoutingRecord | null} The parent routing record, or null if not found
   */
  public findParentRoutingRecord(startNode: MTreeNode, targetNode: MTreeNode): RoutingRecord | null {
    if (startNode === targetNode) return null;
    
    const parentNode = this.findParentNode(startNode, targetNode);
    if (!parentNode) return null;
    
    return this.findRoutingRecord(parentNode, targetNode);
  }

  /**
   * Bulk loads points into an M-tree structure.
   * Creates an efficient tree structure from a set of points.
   * 
   * @param {Point[]} points - Array of points to load into the tree
   */
  bulkLoad(points: Point[]): void {
    // Clear existing tree
    this.clear();
    
    // If there are no points, return
    if (points.length === 0) return;
    
    // For small number of points, create a simple tree
    if (points.length <= this.nodeCapacity) {
      this.root = new MTreeNode(MTreeNodeType.LEAF, this.nodeCapacity);
      for (const point of points) {
        this.root.addRecord({
          point,
          id: point.id,
          parentDistance: 0
        } as DataRecord);
      }
      this.size = points.length;
      return;
    }
    
    // For larger datasets, use a recursive approach
    const maxDepth = Math.ceil(Math.log(points.length) / Math.log(this.nodeCapacity)) + 2;
    this.root = this.buildTreeRecursive(points, null, 0, maxDepth);
    this.size = points.length;
  }

  /**
   * Enhanced recursive method for building a tree with better point clustering.
   * 
   * @param {Point[]} points - Points to include in this subtree
   * @param {Point | null} parentPivot - Parent pivot point, or null for root
   * @param {number} depth - Current depth in the tree
   * @param {number} maxDepth - Maximum allowed depth
   * @returns {MTreeNode} The root node of the created subtree
   * @private
   */
  private buildTreeRecursive(points: Point[], parentPivot: Point | null, depth: number, maxDepth: number): MTreeNode {
    // Safety condition - depth limit or small number of points
    if (depth >= maxDepth || points.length <= this.nodeCapacity) {
      // Create a leaf node
      const leafNode = new MTreeNode(MTreeNodeType.LEAF, this.nodeCapacity);
      
      // Limit number of points in the node to capacity
      const pointsToUse = points.slice(0, this.nodeCapacity);
      
      for (const point of pointsToUse) {
        leafNode.addRecord({
          point,
          id: point.id,
          parentDistance: parentPivot ? this.distanceFunction(parentPivot, point) : 0
        } as DataRecord);
      }
      
      return leafNode;
    }
    
    // Create an internal node
    const innerNode = new MTreeNode(MTreeNodeType.ROUTING, this.nodeCapacity);
    
    // Determine number of clusters to create
    const numClusters = Math.min(this.nodeCapacity, Math.ceil(Math.sqrt(points.length)));
    
    // Select appropriate pivots using a method similar to k-means++
    const pivots = this.selectPivots(points, numClusters);
    
    // Assign points to closest pivots
    const clusters = this.assignPointsToPivots(points, pivots);
    
    // Create a subtree for each cluster
    for (let i = 0; i < pivots.length; i++) {
      const pivot = pivots[i];
      const cluster = clusters[i];
      
      // Skip empty clusters (shouldn't happen, but just in case)
      if (cluster.length === 0) continue;
      
      // Recursively create subtree for this cluster
      const childNode = this.buildTreeRecursive(cluster, pivot, depth + 1, maxDepth);
      
      // Calculate covering radius
      let radius = 0;
      for (const point of cluster) {
        const distance = this.distanceFunction(pivot, point);
        if (distance > radius) radius = distance;
      }
      
      // Add routing record
      innerNode.addRecord({
        point: pivot,
        radius,
        childNode,
        parentDistance: parentPivot ? this.distanceFunction(parentPivot, pivot) : 0
      } as RoutingRecord);
    }
    
    return innerNode;
  }

  /**
   * Selects pivots using a method similar to k-means++.
   * This method tries to select well-distributed pivots.
   * 
   * @param {Point[]} points - Array of points to select pivots from
   * @param {number} numPivots - Number of pivots to select
   * @returns {Point[]} Array of selected pivot points
   * @private
   */
  private selectPivots(points: Point[], numPivots: number): Point[] {
    if (points.length <= numPivots) {
      // If there are fewer points than required pivots, return all points
      return [...points];
    }
    
    const pivots: Point[] = [];
    
    // Select the first pivot randomly
    const firstPivotIndex = Math.floor(Math.random() * points.length);
    pivots.push(points[firstPivotIndex]);
    
    // For each additional pivot
    while (pivots.length < numPivots) {
      // Calculate distance of each point from the nearest already selected pivot
      const distances: number[] = [];
      let totalDistance = 0;
      
      for (const point of points) {
        // Skip points that are already pivots
        if (pivots.some(p => p.id === point.id)) {
          distances.push(0);
          continue;
        }
        
        // Find distance to nearest pivot
        let minDistance = Infinity;
        for (const pivot of pivots) {
          const distance = this.distanceFunction(point, pivot);
          minDistance = Math.min(minDistance, distance);
        }
        
        distances.push(minDistance * minDistance); // Square for higher weight
        totalDistance += distances[distances.length - 1];
      }
      
      // If no non-zero distance, break
      if (totalDistance <= 0) break;
      
      // Select new pivot with probability proportional to distance
      let randomValue = Math.random() * totalDistance;
      let selectedIndex = -1;
      
      for (let i = 0; i < points.length; i++) {
        // Skip points that are already pivots
        if (pivots.some(p => p.id === points[i].id)) continue;
        
        randomValue -= distances[i];
        if (randomValue <= 0) {
          selectedIndex = i;
          break;
        }
      }
      
      // Fallback, if no point was selected (e.g., due to rounding errors)
      if (selectedIndex === -1) {
        for (let i = points.length - 1; i >= 0; i--) {
          if (!pivots.some(p => p.id === points[i].id)) {
            selectedIndex = i;
            break;
          }
        }
      }
      
      pivots.push(points[selectedIndex]);
    }
    
    return pivots;
  }

  /**
   * Assigns points to their nearest pivots.
   * 
   * @param {Point[]} points - Array of points to assign
   * @param {Point[]} pivots - Array of pivot points
   * @returns {Point[][]} Array of clusters, each containing points assigned to a pivot
   * @private
   */
  private assignPointsToPivots(points: Point[], pivots: Point[]): Point[][] {
    const clusters: Point[][] = Array(pivots.length).fill(null).map(() => []);
    
    // For each point, find the nearest pivot
    for (const point of points) {
      // Skip points that are pivots themselves - they will be added later
      if (pivots.some(p => p.id === point.id)) continue;
      
      let minDistance = Infinity;
      let closestPivotIndex = 0;
      
      // Find closest pivot
      for (let i = 0; i < pivots.length; i++) {
        const distance = this.distanceFunction(point, pivots[i]);
        if (distance < minDistance) {
          minDistance = distance;
          closestPivotIndex = i;
        }
      }
      
      // Add point to appropriate cluster
      clusters[closestPivotIndex].push(point);
    }
    
    // Add pivots to their own clusters
    // (pivots are typically the first point in their cluster)
    for (let i = 0; i < pivots.length; i++) {
      clusters[i].unshift(pivots[i]);
    }
    
    return clusters;
  }
}