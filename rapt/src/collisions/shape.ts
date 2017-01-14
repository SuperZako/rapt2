///<reference path="../util/vector.ts" /> 

// enum ShapeType
var SHAPE_CIRCLE = 0;
var SHAPE_AABB = 1;
var SHAPE_POLYGON = 2;


abstract class Shape {
    radius: number;
    abstract getCenter(): Vector;
    abstract moveTo(destination: Vector);
    abstract moveBy(delta: Vector);
}