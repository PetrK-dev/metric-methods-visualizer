import { Database } from "../../../../domain/core/database/Database";
import { PointType } from "../../../../domain/core/enums/PointType";
import { Point } from "../../../../domain/core/models/Point";

describe('Database', () => {
    let database: Database;
    
    beforeEach(() => {
      database = new Database();
    });
    
    test('generatePoints should create correct number of points', () => {
      database.generatePoints(15);
      expect(database.getDataPoints().length).toBe(15);
    });
    
    test('getQuery should return query point', () => {
      database.generatePoints(10);
      const query = database.getQuery();
      
      expect(query.type).toBe(PointType.QUERY);
      expect(query.label).toBe('Q');
    });
    
    test('setPivots should mark selected points as pivots', () => {
      database.generatePoints(10);
      database.setPivots([0, 1]);
      
      const pivots = database.getDataPoints().filter(p => p.type === PointType.PIVOT);
      expect(pivots.length).toBe(2);
      expect(pivots[0].id).toBe(0);
      expect(pivots[1].id).toBe(1);
    });
    
    test('clone should create independent copy', () => {
      database.generatePoints(10);
      const clonedDB = database.clone();
      
      // Uložíme si ID prvního bodu
      const pointId = database.getDataPoints()[0].id;
      
      // Změna na původní databázi by neměla ovlivnit klon
      database.updatePoint(new Point(pointId, PointType.OBJECT, 9.9, 9.9));
      
      // Najdeme bod v obou databázích podle ID
      const originalPoint = database.getDataPoints().find(p => p.id === pointId);
      const clonedPoint = clonedDB.getDataPoints().find(p => p.id === pointId);
      
      expect(originalPoint?.x).toBe(9.9);
      expect(clonedPoint?.x).not.toBe(9.9);
    });
  });