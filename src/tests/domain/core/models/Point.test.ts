import { PointType } from "../../../../domain/core/enums/PointType";
import { Point } from "../../../../domain/core/models/Point";


describe('Point', () => {
    test('should create point with correct properties', () => {
      const point = new Point(1, PointType.OBJECT, 2.5, 3.5);
      
      expect(point.id).toBe(1);
      expect(point.type).toBe(PointType.OBJECT);
      expect(point.x).toBe(2.5);
      expect(point.y).toBe(3.5);
      expect(point.label).toBe('O'); // Object má label 'O'
    });
  
    test('clone method should create independent copy', () => {
      const original = new Point(1, PointType.OBJECT, 2.5, 3.5);
      const cloned = original.clone();
      
      // Test že klonovaný bod má stejné hodnoty
      expect(cloned).toEqual(original);
      
      // Test že jde o nezávislou kopii
      cloned.x = 5.0;
      expect(original.x).toBe(2.5);
      expect(cloned.x).toBe(5.0);
    });
  });