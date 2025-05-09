// test/distanceFunctions.test.ts

import { PointType } from "../../../../domain/core/enums/PointType";
import { euclideanDistance } from "../../../../domain/core/functions/distanceFunctions";
import { Point } from "../../../../domain/core/models/Point";


describe('Distance Functions', () => {
  describe('euclideanDistance', () => {
    test('calculates distance correctly for basic points', () => {
      const p1 = new Point(1, PointType.OBJECT, 0, 0);
      const p2 = new Point(2, PointType.OBJECT, 3, 4);
      
      // Vzdálenost by měla být 5 (Pythagorova věta: sqrt(3^2 + 4^2) = 5)
      expect(euclideanDistance(p1, p2)).toBe(5);
    });
    
    test('returns 0 for identical points', () => {
      const p = new Point(1, PointType.OBJECT, 2, 3);
      
      expect(euclideanDistance(p, p)).toBe(0);
    });
    
    test('is symmetric', () => {
      const p1 = new Point(1, PointType.OBJECT, 0, 0);
      const p2 = new Point(2, PointType.OBJECT, 5, 5);
      
      const d12 = euclideanDistance(p1, p2);
      const d21 = euclideanDistance(p2, p1);
      
      expect(d12).toBe(d21);
    });
    
    test('satisfies triangle inequality', () => {
      const p1 = new Point(1, PointType.OBJECT, 0, 0);
      const p2 = new Point(2, PointType.OBJECT, 3, 0);
      const p3 = new Point(3, PointType.OBJECT, 3, 4);
      
      const d12 = euclideanDistance(p1, p2);
      const d23 = euclideanDistance(p2, p3);
      const d13 = euclideanDistance(p1, p3);
      
      // Trojúhelníková nerovnost: d(a,c) ≤ d(a,b) + d(b,c)
      expect(d13).toBeLessThanOrEqual(d12 + d23);
    });
    
    test('handles floating point values correctly', () => {
      const p1 = new Point(1, PointType.OBJECT, 1.5, 2.5);
      const p2 = new Point(2, PointType.OBJECT, 4.5, 6.5);
      
      // Očekávaná vzdálenost: sqrt((4.5-1.5)^2 + (6.5-2.5)^2) = sqrt(9 + 16) = sqrt(25) = 5
      expect(euclideanDistance(p1, p2)).toBe(5);
    });
    
    test('returns positive value for different points', () => {
      const p1 = new Point(1, PointType.OBJECT, 1, 1);
      const p2 = new Point(2, PointType.OBJECT, 2, 2);
      
      expect(euclideanDistance(p1, p2)).toBeGreaterThan(0);
    });
  });
});