import { DataRecord, MTreeNode, MTreeNodeType, RoutingRecord } from "../../core/data-structures/Tree";
import { VisualType } from "../../core/enums/VisualType";
import { Point } from "../../core/models/Point";
import { BaseAlgorithm } from "./BaseAlgorithm";

/**
 * Base class for algorithms that use tree structures.
 * Provides utility methods for working with M-Tree nodes and regions.
 */
export class TreeAlgorithm extends BaseAlgorithm {

    /**
     * Calculates the maximum distance from a pivot to any point in the node,
     * considering the radius of routing records.
     * 
     * @param {MTreeNode} node - The node to calculate maximum distance for
     * @param {Point} pivot - The pivot point to measure distance from
     * @param {Function} distanceFunction - The function to calculate distance between points
     * @returns {number} The maximum distance from pivot to any point in the node
     */
    protected static calculateMaxDistance(
        node: MTreeNode, 
        pivot: Point, 
        distanceFunction: (p1: Point, p2: Point) => number
      ): number {
        let maxDistance = 0;
        
        for (const record of node.records) {
          const distance = distanceFunction(pivot, record.point);
          maxDistance = Math.max(maxDistance, distance);
          
          // For routing records we must also consider their radius
          if (node.type === MTreeNodeType.ROUTING) {
            const routingRecord = record as RoutingRecord;
            maxDistance = Math.max(maxDistance, distance + routingRecord.radius);
          }
        }
        
        return maxDistance;
      }
      
    /**
     * Calculates the maximum radius needed to cover all points in the node from a pivot.
     * 
     * @param {MTreeNode} node - The node to calculate maximum radius for
     * @param {Point} pivot - The pivot point to measure radius from
     * @param {Function} distanceFunction - The function to calculate distance between points
     * @returns {number} The maximum radius needed to cover all points
     */
    protected static calculateMaxRadius(
        node: MTreeNode, 
        pivot: Point, 
        distanceFunction: (p1: Point, p2: Point) => number
      ): number {
        let maxRadius = 0;
        
        for (const record of node.records) {
          if (node.type === MTreeNodeType.ROUTING) {
            const routingRecord = record as RoutingRecord;
            const childMaxDist = distanceFunction(pivot, routingRecord.point) + routingRecord.radius;
            maxRadius = Math.max(maxRadius, childMaxDist);
          } else {
            const distance = distanceFunction(pivot, record.point);
            maxRadius = Math.max(maxRadius, distance);
          }
        }
        
        return maxRadius;
      }
      
    /**
     * Finds the routing record in a parent node that points to a specific child node.
     * 
     * @param {MTreeNode} parentNode - The parent node to search in
     * @param {MTreeNode} childNode - The child node to find the routing record for
     * @returns {RoutingRecord | null} The routing record pointing to the child node, or null if not found
     */
    protected static findRoutingRecord(
        parentNode: MTreeNode, 
        childNode: MTreeNode
      ): RoutingRecord | null {
        for (const record of parentNode.records) {
          if (parentNode.type === MTreeNodeType.ROUTING) {
            const routingRecord = record as RoutingRecord;
            if (routingRecord.childNode === childNode) {
              return routingRecord;
            }
          }
        }
        return null;
      }
      
    /**
     * Gets the pivot point of a node (first point in the records).
     * 
     * @param {MTreeNode} node - The node to get the pivot for
     * @returns {Point | null} The pivot point, or null if the node has no records
     */
    protected static getPivotOfNode(node: MTreeNode): Point | null {
        if (node.records.length === 0) return null;
        return node.records[0].point;
      }
      
    /**
     * Recursively collects all regions from a node and its descendants.
     * 
     * @param {MTreeNode | null} node - The root node to collect regions from
     * @returns {Array<{center: Point, radius: number, type: VisualType}>} Array of all regions
     */
    protected static getAllRegions(node: MTreeNode | null): { center: Point, radius: number, type: VisualType }[] {
        if (!node) return [];
        
        const regions: { center: Point, radius: number, type: VisualType }[] = [];
        
        if (node.type === MTreeNodeType.ROUTING) {
          for (const record of node.records) {
            const routingRecord = record as RoutingRecord;
            
            regions.push({
              center: routingRecord.point,
              radius: routingRecord.radius,
              type: VisualType.TREE_REGION
            });
            
            const childRegions = this.getAllRegions(routingRecord.childNode);
            regions.push(...childRegions);
          }
        }
        
        return regions;
      }
      
    /**
     * Gets the regions directly associated with a node (not including descendants).
     * 
     * @param {MTreeNode} node - The node to get regions for
     * @param {VisualType} type - The visual type to assign to the regions
     * @returns {Array<{center: Point, radius: number, type: VisualType}>} Array of node regions
     */
    protected static getNodeRegions(
        node: MTreeNode,
        type: VisualType = VisualType.TREE_REGION
      ): { center: Point, radius: number, type: VisualType }[] {
        const regions: { center: Point, radius: number, type: VisualType }[] = [];
        
        if (node.type === MTreeNodeType.ROUTING) {
          for (const record of node.records) {
            const routingRecord = record as RoutingRecord;
            regions.push({
              center: routingRecord.point,
              radius: routingRecord.radius,
              type
            });
          }
        }
        
        return regions;
      }

    /**
     * Recursively collects all points from a node and its subtree.
     * 
     * @param {MTreeNode} node - The root node to collect points from
     * @returns {Point[]} Array of all points in the subtree
     */
    protected static getAllPointsInSubtree(node: MTreeNode): Point[] {
        const points: Point[] = [];
        
        if (node.type === MTreeNodeType.LEAF) {
          // For a leaf node, add all data records
          for (const record of node.records) {
            const dataRecord = record as DataRecord;
            points.push(dataRecord.point);
          }
        } else {
          // For an internal node, add all routing objects and recursively get points from subtrees
          for (const record of node.records) {
            const routingRecord = record as RoutingRecord;
            points.push(routingRecord.point);
            
            // Recursively get points from subtree
            const childPoints = this.getAllPointsInSubtree(routingRecord.childNode);
            points.push(...childPoints);
          }
        }
        
        return points;
      }
}