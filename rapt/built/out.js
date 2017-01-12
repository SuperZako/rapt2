var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// class Vector
var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
        // this.x = x;
        // this.y = y;
    }
    // math operations
    Vector.prototype.neg = function () { return new Vector(-this.x, -this.y); };
    ;
    Vector.prototype.add = function (v) { return new Vector(this.x + v.x, this.y + v.y); };
    ;
    Vector.prototype.sub = function (v) { return new Vector(this.x - v.x, this.y - v.y); };
    ;
    Vector.prototype.mul = function (f) { return new Vector(this.x * f, this.y * f); };
    ;
    Vector.prototype.div = function (f) { return new Vector(this.x / f, this.y / f); };
    ;
    Vector.prototype.eq = function (v) { return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) < 0.001; };
    ;
    // inplace operations
    Vector.prototype.inplaceNeg = function () { this.x = -this.x; this.y = -this.y; };
    ;
    Vector.prototype.inplaceAdd = function (v) { this.x += v.x; this.y += v.y; };
    ;
    Vector.prototype.inplaceSub = function (v) { this.x -= v.x; this.y -= v.y; };
    ;
    Vector.prototype.inplaceMul = function (f) { this.x *= f; this.y *= f; };
    ;
    Vector.prototype.inplaceDiv = function (f) { this.x /= f; this.y /= f; };
    ;
    Vector.prototype.inplaceFlip = function () { var t = this.x; this.x = this.y; this.y = -t; };
    ; // turns 90 degrees right
    // other functions
    Vector.prototype.clone = function () { return new Vector(this.x, this.y); };
    ;
    Vector.prototype.dot = function (v) { return this.x * v.x + this.y * v.y; };
    ;
    Vector.prototype.lengthSquared = function () { return this.dot(this); };
    ;
    Vector.prototype.length = function () { return Math.sqrt(this.lengthSquared()); };
    ;
    Vector.prototype.unit = function () { return this.div(this.length()); };
    ;
    Vector.prototype.normalize = function () { var len = this.length(); this.x /= len; this.y /= len; };
    ;
    Vector.prototype.flip = function () { return new Vector(this.y, -this.x); };
    ; // turns 90 degrees right
    Vector.prototype.atan2 = function () { return Math.atan2(this.y, this.x); };
    ;
    Vector.prototype.angleBetween = function (v) { return this.atan2() - v.atan2(); };
    ;
    Vector.prototype.rotate = function (theta) { var s = Math.sin(theta), c = Math.cos(theta); return new Vector(this.x * c - this.y * s, this.x * s + this.y * c); };
    ;
    Vector.prototype.minComponents = function (v) { return new Vector(Math.min(this.x, v.x), Math.min(this.y, v.y)); };
    ;
    Vector.prototype.maxComponents = function (v) { return new Vector(Math.max(this.x, v.x), Math.max(this.y, v.y)); };
    ;
    Vector.prototype.projectOntoAUnitVector = function (v) { return v.mul(this.dot(v)); };
    ;
    Vector.prototype.toString = function () { return '(' + this.x.toFixed(3) + ', ' + this.y.toFixed(3) + ')'; };
    ;
    Vector.prototype.adjustTowardsTarget = function (target, maxDistance) {
        var v = ((target.sub(this)).lengthSquared() < maxDistance * maxDistance) ? target : this.add((target.sub(this)).unit().mul(maxDistance));
        this.x = v.x;
        this.y = v.y;
    };
    // static functions
    Vector.fromAngle = function (theta) { return new Vector(Math.cos(theta), Math.sin(theta)); };
    ;
    Vector.lerp = function (a, b, percent) { return a.add(b.sub(a).mul(percent)); };
    ;
    return Vector;
}());
///<reference path="../util/vector.ts" /> 
// class AABB extends Shape
var AABB = (function () {
    function AABB(lowerLeft, upperRight) {
        this.lowerLeft = new Vector(Math.min(lowerLeft.x, upperRight.x), Math.min(lowerLeft.y, upperRight.y));
        this.size = new Vector(Math.max(lowerLeft.x, upperRight.x), Math.max(lowerLeft.y, upperRight.y)).sub(this.lowerLeft);
    }
    AABB.makeAABB = function (center, width, height) {
        var halfSize = new Vector(width * 0.5, height * 0.5);
        var lowerLeft = center.sub(halfSize);
        var upperRight = center.add(halfSize);
        return new AABB(lowerLeft, upperRight);
    };
    AABB.prototype.getTop = function () { return this.lowerLeft.y + this.size.y; };
    ;
    AABB.prototype.getLeft = function () { return this.lowerLeft.x; };
    ;
    AABB.prototype.getRight = function () { return this.lowerLeft.x + this.size.x; };
    ;
    AABB.prototype.getBottom = function () { return this.lowerLeft.y; };
    ;
    AABB.prototype.getWidth = function () { return this.size.x; };
    ;
    AABB.prototype.getHeight = function () { return this.size.y; };
    ;
    AABB.prototype.copy = function () {
        return new AABB(this.lowerLeft, this.lowerLeft.add(this.size));
    };
    AABB.prototype.getPolygon = function () {
        var center = this.getCenter();
        var halfSize = this.size.div(2);
        return new Polygon(center, new Vector(+halfSize.x, +halfSize.y), new Vector(-halfSize.x, +halfSize.y), new Vector(-halfSize.x, -halfSize.y), new Vector(+halfSize.x, -halfSize.y));
    };
    AABB.prototype.getType = function () {
        return SHAPE_AABB;
    };
    ;
    AABB.prototype.getAabb = function () {
        return this;
    };
    AABB.prototype.moveBy = function (delta) {
        this.lowerLeft = this.lowerLeft.add(delta);
    };
    AABB.prototype.moveTo = function (destination) {
        this.lowerLeft = destination.sub(this.size.div(2));
    };
    AABB.prototype.getCenter = function () {
        return this.lowerLeft.add(this.size.div(2));
    };
    AABB.prototype.expand = function (margin) {
        var marginVector = new Vector(margin, margin);
        return new AABB(this.lowerLeft.sub(marginVector), this.lowerLeft.add(this.size).add(marginVector));
    };
    AABB.prototype.union = function (aabb) {
        return new AABB(this.lowerLeft.minComponents(aabb.lowerLeft), this.lowerLeft.add(this.size).maxComponents(aabb.lowerLeft.add(aabb.size)));
    };
    AABB.prototype.include = function (point) {
        return new AABB(this.lowerLeft.minComponents(point), this.lowerLeft.add(this.size).maxComponents(point));
    };
    AABB.prototype.offsetBy = function (offset) {
        return new AABB(this.lowerLeft.add(offset), this.lowerLeft.add(this.size).add(offset));
    };
    AABB.prototype.draw = function (c) {
        c.strokeStyle = 'black';
        c.strokeRect(this.lowerLeft.x, this.lowerLeft.y, this.size.x, this.size.y);
    };
    return AABB;
}());
// class Circle extends Shape
var Circle = (function () {
    function Circle(center, radius) {
        this.center = center;
        this.radius = radius;
        // this.center = center;
        // this.radius = radius;
    }
    Circle.prototype.copy = function () {
        return new Circle(this.center, this.radius);
    };
    Circle.prototype.getType = function () {
        return SHAPE_CIRCLE;
    };
    Circle.prototype.getAabb = function () {
        var radiusVector = new Vector(this.radius, this.radius);
        return new AABB(this.center.sub(radiusVector), this.center.add(radiusVector));
    };
    Circle.prototype.getCenter = function () {
        return this.center;
    };
    Circle.prototype.moveBy = function (delta) {
        this.center = this.center.add(delta);
    };
    Circle.prototype.moveTo = function (destination) {
        this.center = destination;
    };
    Circle.prototype.offsetBy = function (offset) {
        return new Circle(this.center.add(offset), this.radius);
    };
    Circle.prototype.draw = function (c) {
        c.strokeStyle = 'black';
        c.beginPath();
        c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2, false);
        c.stroke();
    };
    return Circle;
}());
// porting notes:
//
// - a prefix of "ref_" on the variable name means it was a non-const reference in C++
//	 this is handled like so:
//
//	 // C++
//	 void func(int& foo) {
//		 foo = 2;
//	 }
//
//	 void main() {
//		 int foo;
//		 func(foo);
//		 cout << foo << endl;
//	 }
//
//	 // JavaScript
//	 function func(ref_foo) {
//		 ref_foo.ref = 2;
//	 }
//
//	 function main() {
//		 var ref_foo = {};
//		 func(ref_foo);
//		 console.log(ref_foo.ref);
//	 }
//
// - gameState is a global, so all functions that take gameState as an argument in C++ don't now
// static class CollisionDetector
var CollisionDetector;
(function (CollisionDetector) {
    var MAX_VELOCITY = 30;
    var MAX_COLLISIONS = 20;
    // if the collision detection system fails, what elasticity should we use?
    var MAX_EMERGENCY_ELASTICITY = 0.5;
    var ON_MARGIN = 0.01;
    var MAX_LOS_DISTANCE_SQUARED = 625;
    // how far should we push something out if there's an emergency?
    var EMERGENCY_PUSH_DISTANCE = 0.1;
    ////////////////////////////////////////////////////////////////////////////////
    // public functions
    ////////////////////////////////////////////////////////////////////////////////
    // collisions
    function collideEntityWorld(entity, ref_deltaPosition, ref_velocity, elasticity, world, emergency) {
        return this.collideShapeWorld(entity.getShape(), ref_deltaPosition, ref_velocity, elasticity, world, entity.getColor(), emergency);
    }
    CollisionDetector.collideEntityWorld = collideEntityWorld;
    function collideShapeWorld(shape, ref_deltaPosition, ref_velocity, elasticity, world, color, emergency) {
        // only chuck norris may divide by zero
        if (ref_deltaPosition.ref.lengthSquared() < 0.000000000001) {
            ref_deltaPosition.ref = new Vector(0, 0);
            return null;
        }
        // clamp the velocity, so this won't blow up
        // if we don't, the aabb will get too big.
        if (ref_velocity.ref.lengthSquared() > MAX_VELOCITY * MAX_VELOCITY) {
            ref_velocity.ref = ref_velocity.ref.unit().mul(MAX_VELOCITY);
        }
        // this stores the contact that happened last (if any)
        // since this can hit multiple items in a single timestep
        var lastContact = null;
        var originalDelta = ref_deltaPosition.ref;
        var originalVelocity = ref_velocity.ref;
        // try this up to a certain number of times, if we get there we are PROBABLY stuck.
        for (var i = 0; i < MAX_COLLISIONS; i++) {
            // check all the edges in the expanded bounding box of the swept area
            var newShape = shape.copy();
            newShape.moveBy(ref_deltaPosition.ref);
            var areaToCheck = shape.getAabb().union(newShape.getAabb());
            var edges = world.getEdgesInAabb(areaToCheck, color);
            // make a temporary new contact in case there is (another) collision
            var newContact = null;
            // see if this setting for deltaPosition causes a collision
            for (var it = 0; it < edges.length; it++) {
                var edge = edges[it];
                var segmentContact = this.collideShapeSegment(shape, ref_deltaPosition.ref, edge.segment);
                if (newContact === null || (segmentContact !== null && segmentContact.proportionOfDelta < newContact.proportionOfDelta)) {
                    newContact = segmentContact;
                }
            }
            // if we didn't hit anything this iteration, return our last hit
            // on the first iteration, this means return NULL
            if (newContact === null) {
                this.emergencyCollideShapeWorld(shape, ref_deltaPosition, ref_velocity, world);
                return lastContact;
            }
            // modify the velocity to not be pointing into the edge
            var velocityPerpendicular = ref_velocity.ref.projectOntoAUnitVector(newContact.normal);
            var velocityParallel = ref_velocity.ref.sub(velocityPerpendicular);
            ref_velocity.ref = velocityParallel.add(velocityPerpendicular.mul(-elasticity));
            // push the delta-position out of the edge
            var deltaPerpendicular = ref_deltaPosition.ref.projectOntoAUnitVector(newContact.normal);
            var deltaParallel = ref_deltaPosition.ref.sub(deltaPerpendicular);
            // TODO: This was here when I ported this, but it is incorrect because it
            // stops you short of an edge, which is good except the distance from that
            // edge grows with your speed.	A correct version is after this.
            // ref_deltaPosition.ref = ref_deltaPosition.ref.mul(newContact.proportionOfDelta).projectOntoAUnitVector(newContact.normal).mul(-elasticity).add(deltaParallel).add(newContact.normal.mul(0.001));
            var proportionLeft = 1 - newContact.proportionOfDelta;
            ref_deltaPosition.ref = ref_deltaPosition.ref.mul(newContact.proportionOfDelta).add(deltaPerpendicular.mul(-elasticity * proportionLeft)).add(deltaParallel.mul(proportionLeft)).add(newContact.normal.mul(0.0001));
            // the newly found contact is now the last one
            lastContact = newContact;
        }
        if (typeof console !== 'undefined' && console.log) {
            console.log("Collision loop ran out, damn!");
        }
        // if we are all looped out, take some emergency collision prevention measures.
        ref_deltaPosition.ref = new Vector(0, 0);
        ref_velocity.ref = originalVelocity.mul(-(elasticity < MAX_EMERGENCY_ELASTICITY ? elasticity : MAX_EMERGENCY_ELASTICITY));
        if (emergency) {
            this.emergencyCollideShapeWorld(shape, { ref: originalDelta }, ref_velocity, world);
        }
        return lastContact;
    }
    CollisionDetector.collideShapeWorld = collideShapeWorld;
    // overlaps
    function overlapShapePlayers(shape) {
        var players = [];
        if (this.overlapShapes(gameState.playerA.getShape(), shape)) {
            players.push(gameState.playerA);
        }
        if (this.overlapShapes(gameState.playerB.getShape(), shape)) {
            players.push(gameState.playerB);
        }
        return players;
    }
    CollisionDetector.overlapShapePlayers = overlapShapePlayers;
    function overlapPlayers() {
        return this.overlapShapes(gameState.playerA.getShape(), gameState.playerB.getShape());
    }
    CollisionDetector.overlapPlayers = overlapPlayers;
    ;
    // on-edges
    function onEntityWorld(entity, edgeQuad, world) {
        this.penetrationEntityWorld(entity, edgeQuad, world);
        edgeQuad.throwOutIfGreaterThan(ON_MARGIN);
    }
    CollisionDetector.onEntityWorld = onEntityWorld;
    // line of sight
    function lineOfSightWorld(eye, target, world) {
        // if the target is too far, we can't see it
        if (target.sub(eye).lengthSquared() > (MAX_LOS_DISTANCE_SQUARED)) {
            return null;
        }
        var edges = world.getEdgesInAabb(new AABB(eye, target), EDGE_ENEMIES);
        var minLosProportion = 1.1;
        var ref_edgeProportion = {}; // throwaway
        var ref_contactPoint = {}; // throwaway
        var firstEdge = null;
        for (var it = 0; it < edges.length; it++) {
            // this is only for edges that face towards the eye
            if (target.sub(eye).dot(edges[it].segment.normal) >= 0) {
                continue;
            }
            // find the edge closest to the viewer
            var ref_losProportion = {};
            // if the LOS is not blocked by this edge, then ignore this edge
            if (!this.intersectSegments(new Segment(eye, target), edges[it].segment, ref_losProportion, ref_edgeProportion, ref_contactPoint)) {
                continue;
            }
            // if another edge was already closer, ignore this edge
            if (ref_losProportion.ref >= minLosProportion) {
                continue;
            }
            // otherwise this is the closest edge to the eye
            minLosProportion = ref_losProportion.ref;
            firstEdge = edges[it];
        }
        return firstEdge;
    }
    CollisionDetector.lineOfSightWorld = lineOfSightWorld;
    ;
    // puts the closest point in the world into worldpoint and the one on the shape
    // to shapepoint, returns the distance to the closest point in the world to the shape
    // will always find any point within radius of any point on the shape, may find ones farther out
    // returns infinity if nothing was found within radius
    function closestToEntityWorld(entity, radius, ref_shapePoint, ref_worldPoint, world) {
        var shape = entity.getShape();
        var boundingBox = shape.getAabb().expand(radius);
        var edges = world.getEdgesInAabb(boundingBox, entity.getColor());
        var distance = Number.POSITIVE_INFINITY;
        for (var it = 0; it < edges.length; it++) {
            var ref_thisShapePoint = {}, ref_thisWorldPoint = {};
            var thisDistance = this.closestToShapeSegment(shape, ref_thisShapePoint, ref_thisWorldPoint, edges[it].segment);
            if (thisDistance < distance) {
                distance = thisDistance;
                ref_shapePoint.ref = ref_thisShapePoint.ref;
                ref_worldPoint.ref = ref_thisWorldPoint.ref;
            }
        }
        return distance;
    }
    CollisionDetector.closestToEntityWorld = closestToEntityWorld;
    ;
    function containsPointShape(point, shape) {
        switch (shape.getType()) {
            case SHAPE_CIRCLE:
                return (point.sub(shape.center).lengthSquared() < shape.radius * shape.radius);
            case SHAPE_AABB:
                return (point.x >= shape.lowerLeft.x &&
                    point.x <= shape.lowerLeft.x + shape.size.x &&
                    point.y >= shape.lowerLeft.y &&
                    point.y <= shape.lowerLeft.y + shape.size.y);
            case SHAPE_POLYGON:
                var len = shape.vertices.length;
                for (var i = 0; i < len; ++i) {
                    // Is this point outside this edge?  if so, it's not inside the polygon
                    if (point.sub(shape.vertices[i].add(shape.center)).dot(shape.segments[i].normal) > 0) {
                        return false;
                    }
                }
                // if the point was inside all of the edges, then it's inside the polygon.
                return true;
        }
        alert('assertion failed in CollisionDetector.containsPointShape');
    }
    CollisionDetector.containsPointShape = containsPointShape;
    ;
    // intersect, disregards entity color
    function intersectEntitySegment(entity, segment) {
        return this.intersectShapeSegment(entity.getShape(), segment);
    }
    CollisionDetector.intersectEntitySegment = intersectEntitySegment;
    ;
    ////////////////////////////////////////////////////////////////////////////////
    // private functions
    ////////////////////////////////////////////////////////////////////////////////
    // INTERSECTIONS
    function intersectSegments(segment0, segment1, ref_segmentProportion0, ref_segmentProportion1, ref_contactPoint) {
        var segStart0 = segment0.start;
        var segEnd0 = segment0.end;
        var segSize0 = segEnd0.sub(segStart0);
        var segStart1 = segment1.start;
        var segEnd1 = segment1.end;
        var segSize1 = segEnd1.sub(segStart1);
        // make sure these aren't parallel
        if (Math.abs(segSize0.dot(segSize1.flip())) < 0.000001) {
            return false;
        }
        // calculate the point of intersection...
        ref_segmentProportion0.ref = ((segStart1.y - segStart0.y) * segSize1.x + (segStart0.x - segStart1.x) * segSize1.y) /
            (segSize0.y * segSize1.x - segSize1.y * segSize0.x);
        ref_segmentProportion1.ref = ((segStart0.y - segStart1.y) * segSize0.x + (segStart1.x - segStart0.x) * segSize0.y) /
            (segSize1.y * segSize0.x - segSize0.y * segSize1.x);
        // where do these actually meet?
        ref_contactPoint.ref = segStart0.add(segSize0.mul(ref_segmentProportion0.ref));
        // make sure the point of intersection is inside segment0
        if (ref_segmentProportion0.ref < 0 || ref_segmentProportion0.ref > 1) {
            return false;
        }
        // make sure the point of intersection is inside segment1
        if (ref_segmentProportion1.ref < 0 || ref_segmentProportion1.ref > 1) {
            return false;
        }
        // now that we've checked all this, the segments do intersect.
        return true;
    }
    CollisionDetector.intersectSegments = intersectSegments;
    ;
    function intersectCircleLine(circle, line, ref_lineProportion0, ref_lineProportion1) {
        // variables taken from http://local.wasp.uwa.edu.au/~pbourke/geometry/sphereline/
        // thanks, internet!
        var lineStart = line.start;
        var lineEnd = line.end;
        var lineSize = lineEnd.sub(lineStart);
        // find quadratic equation variables
        var a = lineSize.lengthSquared();
        var b = 2 * lineSize.dot(lineStart.sub(circle.center));
        var c = lineStart.sub(circle.center).lengthSquared() - circle.radius * circle.radius;
        var insideSqrt = b * b - 4 * a * c;
        if (insideSqrt < 0) {
            return false;
        }
        // calculate the point of intersection...
        ref_lineProportion0.ref = (-b - Math.sqrt(insideSqrt)) * 0.5 / a;
        ref_lineProportion1.ref = (-b + Math.sqrt(insideSqrt)) * 0.5 / a;
        return true;
    }
    CollisionDetector.intersectCircleLine = intersectCircleLine;
    ;
    function intersectShapeSegment(shape, segment) {
        switch (shape.getType()) {
            case SHAPE_CIRCLE:
                return this.intersectCircleSegment(shape, segment);
            case SHAPE_AABB:
                return this.intersectPolygonSegment(shape.getPolygon(), segment);
            case SHAPE_POLYGON:
                return this.intersectPolygonSegment(shape, segment);
        }
        alert('assertion failed in CollisionDetector.intersectShapeSegment');
    }
    CollisionDetector.intersectShapeSegment = intersectShapeSegment;
    ;
    function intersectCircleSegment(circle, segment) {
        var ref_lineProportion0 = {}, ref_lineProportion1 = {};
        if (!this.intersectCircleLine(circle, segment, ref_lineProportion0, ref_lineProportion1)) {
            return false;
        }
        if (ref_lineProportion0.ref >= 0 && ref_lineProportion0.ref <= 1) {
            return true;
        }
        return (ref_lineProportion1.ref >= 0 && ref_lineProportion1.ref <= 1);
    }
    CollisionDetector.intersectCircleSegment = intersectCircleSegment;
    ;
    function intersectPolygonSegment(polygon, segment) {
        // may fail on large enemies (if the segment is inside)
        var ref_segmentProportion0 = {}, ref_segmentProportion1 = {}, ref_contactPoint = {};
        for (var i = 0; i < polygon.vertices.length; i++) {
            if (this.intersectSegments(polygon.getSegment(i), segment, ref_segmentProportion0, ref_segmentProportion1, ref_contactPoint)) {
                return true;
            }
        }
        return false;
    }
    CollisionDetector.intersectPolygonSegment = intersectPolygonSegment;
    ;
    // COLLISIONS
    function collideShapeSegment(shape, deltaPosition, segment) {
        var segmentNormal = segment.normal;
        // if the shape isn't traveling into this edge, then it can't collide with it
        if (deltaPosition.dot(segmentNormal) > 0.0) {
            return null;
        }
        switch (shape.getType()) {
            case SHAPE_CIRCLE:
                return this.collideCircleSegment(shape, deltaPosition, segment);
            case SHAPE_AABB:
                return this.collidePolygonSegment(shape.getPolygon(), deltaPosition, segment);
            case SHAPE_POLYGON:
                return this.collidePolygonSegment(shape, deltaPosition, segment);
        }
        alert('assertion failed in CollisionDetector.collideShapeSegment');
    }
    CollisionDetector.collideShapeSegment = collideShapeSegment;
    ;
    function collideCircleSegment(circle, deltaPosition, segment) {
        var segmentNormal = segment.normal;
        // a directed radius towards the segment
        var radiusToLine = segmentNormal.mul(-circle.radius);
        // position of this circle after being moved
        var newCircle = new Circle(circle.center.add(deltaPosition), circle.radius);
        // the point on the new circle farthest "in" this segment
        var newCircleInnermost = newCircle.center.add(radiusToLine);
        var endedInside = newCircleInnermost.sub(segment.start).dot(segmentNormal) < 0.001;
        // if the circle didn't end inside this segment, then it's not a collision.
        if (!endedInside) {
            return null;
        }
        // the point on the circle farthest "in" this segment, before moving
        var circleInnermost = newCircleInnermost.sub(deltaPosition);
        // did this circle start completely outside this segment?
        var startedOutside = circleInnermost.sub(segment.start).dot(segmentNormal) > 0;
        // if the circle started outside this segment, then it might have hit the flat part of this segment
        if (startedOutside) {
            var ref_segmentProportion = {}, ref_proportionOfDelta = {}, ref_contactPoint = {};
            if (this.intersectSegments(segment, new Segment(circleInnermost, newCircleInnermost), ref_segmentProportion, ref_proportionOfDelta, ref_contactPoint)) {
                // we can return this because the circle will always hit the flat part before it hits an end
                return new Contact(ref_contactPoint.ref, segmentNormal, ref_proportionOfDelta.ref);
            }
        }
        // get the contacts that occurred when the edge of the circle hit an endpoint of this edge.
        var startContact = this.collideCirclePoint(circle, deltaPosition, segment.start);
        var endContact = this.collideCirclePoint(circle, deltaPosition, segment.end);
        // select the collision that occurred first
        if (!startContact && !endContact) {
            return null;
        }
        if (startContact && !endContact) {
            return startContact;
        }
        if (!startContact && endContact) {
            return endContact;
        }
        if (startContact.proportionOfDelta < endContact.proportionOfDelta) {
            return startContact;
        }
        return endContact;
    }
    CollisionDetector.collideCircleSegment = collideCircleSegment;
    ;
    function collideCirclePoint(circle, deltaPosition, point) {
        // deltaProportion1 is a throwaway
        // we can only use segmentProportion0 because segmentProportion1 represents the intersection
        // when the circle travels so that the point moves OUT of it, so we don't want to stop it from doing that.
        var ref_deltaProportion0 = {}, ref_deltaProportion1 = {};
        // BUGFIX: shock hawks were disappearing on Traps when deltaPosition was very small, which caused
        // us to try to solve a quadratic with a second order coefficient of zero and put NaNs everywhere
        var delta = deltaPosition.length();
        if (delta < 0.0000001) {
            return false;
        }
        // if these don't intersect at all, then forget about it.
        if (!this.intersectCircleLine(circle, new Segment(point, point.sub(deltaPosition)), ref_deltaProportion0, ref_deltaProportion1)) {
            return null;
        }
        // check that this actually happens inside of the segment.
        if (ref_deltaProportion0.ref < 0 || ref_deltaProportion0.ref > 1) {
            return null;
        }
        // find where the circle will be at the time of the collision
        var circleCenterWhenCollides = circle.center.add(deltaPosition.mul(ref_deltaProportion0.ref));
        return new Contact(point, circleCenterWhenCollides.sub(point).unit(), ref_deltaProportion0.ref);
    }
    CollisionDetector.collideCirclePoint = collideCirclePoint;
    ;
    function collidePolygonSegment(polygon, deltaPosition, segment) {
        // use these for storing parameters about the collision.
        var ref_edgeProportion = {}; // throwaway
        var ref_deltaProportion = {}; // how far into the timestep we get before colliding
        var ref_contactPoint = {}; // where we collide
        // if this was touching the segment before, NO COLLISION
        if (this.intersectPolygonSegment(polygon, segment)) {
            return null;
        }
        // the first instance of contact
        var firstContact = null;
        var i;
        // for each side of the polygon, check the edge's endpoints for a collision
        for (i = 0; i < polygon.vertices.length; i++) {
            var edgeEndpoints = [segment.start, segment.end];
            var edgeMiddle = segment.start.add(segment.end).div(2);
            // for each endpoint of the edge
            for (var j = 0; j < 2; j++) {
                var polygonSegment = polygon.getSegment(i);
                // if the polygon is trying to pass out of the edge, no collision
                if (polygonSegment.normal.dot(edgeEndpoints[j].sub(edgeMiddle)) > 0) {
                    continue;
                }
                // if these don't intersect, ignore this edge
                if (!this.intersectSegments(polygonSegment, new Segment(edgeEndpoints[j], edgeEndpoints[j].sub(deltaPosition)), ref_edgeProportion, ref_deltaProportion, ref_contactPoint)) {
                    continue;
                }
                // if this contact is sooner, or if there wasn't one before, then we'll use this one
                if (!firstContact || ref_deltaProportion.ref < firstContact.proportionOfDelta) {
                    firstContact = new Contact(ref_contactPoint.ref, polygonSegment.normal.mul(-1), ref_deltaProportion.ref);
                }
            }
        }
        // for each point of the polygon, check for a collision
        for (i = 0; i < polygon.vertices.length; i++) {
            var vertex = polygon.getVertex(i);
            // if these don't intersect, ignore this edge
            if (!this.intersectSegments(segment, new Segment(vertex, vertex.add(deltaPosition)), ref_edgeProportion, ref_deltaProportion, ref_contactPoint)) {
                continue;
            }
            // if this contact is sooner, or if there wasn't one before, then we'll use this one
            if (!firstContact || ref_deltaProportion.ref < firstContact.proportionOfDelta) {
                firstContact = new Contact(ref_contactPoint.ref, segment.normal, ref_deltaProportion.ref);
            }
        }
        // return the first instance of contact
        return firstContact;
    }
    CollisionDetector.collidePolygonSegment = collidePolygonSegment;
    ;
    // EMERGENCY COLLISIONS, PREVENTS FALLING THROUGH FLOORS
    function emergencyCollideShapeWorld(shape, ref_deltaPosition, ref_velocity, world) {
        // do we need to push this shape anywhere?
        var push = false;
        var newShape = shape.copy();
        newShape.moveBy(ref_deltaPosition.ref);
        if (newShape.getAabb().getBottom() < 0) {
            push = true;
        }
        if (newShape.getAabb().getTop() > world.height) {
            push = true;
        }
        if (newShape.getAabb().getLeft() < 0) {
            push = true;
        }
        if (newShape.getAabb().getRight() > world.width) {
            push = true;
        }
        if (!push) {
            var cells = world.getCellsInAabb(newShape.getAabb());
            for (var it = 0; it < cells.length; it++) {
                var cellShape = cells[it].getShape();
                if (!cellShape) {
                    continue;
                }
                if (this.overlapShapes(newShape, cellShape)) {
                    push = true;
                    break;
                }
            }
        }
        if (push) {
            var minX = Math.floor(newShape.getCenter().x) - 3;
            var maxX = Math.floor(newShape.getCenter().x) + 3;
            var minY = Math.floor(newShape.getCenter().y) - 3;
            var maxY = Math.floor(newShape.getCenter().y) + 3;
            // find the closest open square, push toward that
            var bestSafety = world.safety;
            for (var x = minX; x <= maxX; x++) {
                for (var y = minY; y <= maxY; y++) {
                    // if this cell doesn't exist or has a shape in it, not good to push towards.
                    if (!world.getCell(x, y) || world.getCell(x, y).type != CELL_EMPTY) {
                        continue;
                    }
                    // loop through centers of squares and replace if closer
                    var candidateSafety = new Vector(x + 0.5, y + 0.5);
                    if (candidateSafety.sub(newShape.getCenter()).lengthSquared() < bestSafety.sub(newShape.getCenter()).lengthSquared()) {
                        bestSafety = candidateSafety;
                    }
                }
            }
            newShape.moveBy(bestSafety.sub(newShape.getCenter()).unit().mul(EMERGENCY_PUSH_DISTANCE));
            ref_deltaPosition.ref = newShape.getCenter().sub(shape.getCenter());
        }
    }
    CollisionDetector.emergencyCollideShapeWorld = emergencyCollideShapeWorld;
    ;
    // OVERLAPS
    function overlapShapes(shape0, shape1) {
        var shapeTempPointer = null;
        var shape0Pointer = shape0.copy();
        var shape1Pointer = shape1.copy();
        // convert aabb's to polygons
        if (shape0Pointer.getType() == SHAPE_AABB) {
            shapeTempPointer = shape0Pointer;
            shape0Pointer = shape0Pointer.getPolygon();
        }
        if (shape1Pointer.getType() == SHAPE_AABB) {
            shapeTempPointer = shape1Pointer;
            shape1Pointer = shape1Pointer.getPolygon();
        }
        // swap the shapes so that they're in order
        if (shape0Pointer.getType() > shape1Pointer.getType()) {
            shapeTempPointer = shape1Pointer;
            shape1Pointer = shape0Pointer;
            shape0Pointer = shapeTempPointer;
        }
        var result;
        var shape0Type = shape0Pointer.getType();
        var shape1Type = shape1Pointer.getType();
        // if they're both circles
        if (shape0Type == SHAPE_CIRCLE && shape1Type == SHAPE_CIRCLE) {
            result = this.overlapCircles(shape0Pointer, shape1Pointer);
        }
        else if (shape0Type == SHAPE_CIRCLE && shape1Type == SHAPE_POLYGON) {
            result = this.overlapCirclePolygon(shape0Pointer, shape1Pointer);
        }
        else if (shape0Type == SHAPE_POLYGON && shape1Type == SHAPE_POLYGON) {
            result = this.overlapPolygons(shape0Pointer, shape1Pointer);
        }
        else {
            alert('assertion failed in CollisionDetector.overlapShapes');
        }
        return result;
    }
    CollisionDetector.overlapShapes = overlapShapes;
    ;
    function overlapCircles(circle0, circle1) {
        return circle1.getCenter().sub(circle0.getCenter()).lengthSquared() <= (circle0.radius + circle1.radius) * (circle0.radius + circle1.radius);
    }
    CollisionDetector.overlapCircles = overlapCircles;
    ;
    function overlapCirclePolygon(circle, polygon) {
        // see if any point on the border of the the polygon is in the circle
        var len = polygon.vertices.length;
        for (var i = 0; i < len; ++i) {
            // if a segment of the polygon crosses the edge of the circle
            if (this.intersectCircleSegment(circle, polygon.getSegment(i))) {
                return true;
            }
            // if a vertex of the polygon is inside the circle
            if (polygon.getVertex(i).sub(circle.center).lengthSquared() < circle.radius * circle.radius) {
                return true;
            }
        }
        // otherwise, the circle could be completely inside the polygon
        var point = circle.center;
        for (var i = 0; i < len; ++i) {
            // Is this point outside this edge?  if so, it's not inside the polygon
            if (point.sub(polygon.vertices[i].add(polygon.center)).dot(polygon.segments[i].normal) > 0) {
                return false;
            }
        }
        // if the point was inside all of the edges, then it's inside the polygon.
        return true;
    }
    CollisionDetector.overlapCirclePolygon = overlapCirclePolygon;
    ;
    function overlapPolygons(polygon0, polygon1) {
        var i;
        var len0 = polygon0.vertices.length;
        var len1 = polygon1.vertices.length;
        // see if any corner of polygon 0 is inside of polygon 1
        for (i = 0; i < len0; ++i) {
            if (this.containsPointPolygon(polygon0.vertices[i].add(polygon0.center), polygon1)) {
                return true;
            }
        }
        // see if any corner of polygon 1 is inside of polygon 0
        for (i = 0; i < len1; ++i) {
            if (this.containsPointPolygon(polygon1.vertices[i].add(polygon1.center), polygon0)) {
                return true;
            }
        }
        return false;
    }
    CollisionDetector.overlapPolygons = overlapPolygons;
    ;
    // CONTAINS
    function containsPointPolygon(point, polygon) {
        var len = polygon.vertices.length;
        for (var i = 0; i < len; ++i) {
            // Is this point outside this edge?  if so, it's not inside the polygon
            if (point.sub(polygon.vertices[i].add(polygon.center)).dot(polygon.segments[i].normal) > 0) {
                return false;
            }
        }
        // if the point was inside all of the edges, then it's inside the polygon.
        return true;
    }
    CollisionDetector.containsPointPolygon = containsPointPolygon;
    ;
    // DISTANCES
    function distanceShapeSegment(shape, segment) {
        // if the two are intersecting, the distance is obviously 0
        if (this.intersectShapeSegment(shape, segment)) {
            return 0;
        }
        var ref_shapePoint = {}, ref_worldPoint = {};
        return this.closestToShapeSegment(shape, ref_shapePoint, ref_worldPoint, segment);
    }
    CollisionDetector.distanceShapeSegment = distanceShapeSegment;
    ;
    function distanceShapePoint(shape, point) {
        switch (shape.getType()) {
            case SHAPE_CIRCLE:
                return this.distanceCirclePoint(shape, point);
            case SHAPE_AABB:
                return this.distancePolygonPoint(shape.getPolygon(), point);
            case SHAPE_POLYGON:
                return this.distancePolygonPoint(shape, point);
        }
        alert('assertion failed in CollisionDetector.distanceShapePoint');
    }
    CollisionDetector.distanceShapePoint = distanceShapePoint;
    ;
    function distanceCirclePoint(circle, point) {
        var distance = circle.center.sub(point).length();
        return distance > circle.radius ? distance - circle.radius : 0;
    }
    CollisionDetector.distanceCirclePoint = distanceCirclePoint;
    ;
    function distancePolygonPoint(polygon, point) {
        var ref_polygonEdgeProportion = {}, ref_distanceProportion = {};
        var ref_closestPointOnPolygonEdge = {}; //throwaway
        var distance = Number.POSITIVE_INFINITY;
        // see how close each endpoint of the segment is to a point on the middle of a polygon edge
        for (var i = 0; i < polygon.vertices.length; i++) {
            var polygonSegment = polygon.getSegment(i);
            // find where this segment endpoint projects onto the polygon edge
            this.intersectSegments(polygonSegment, new Segment(point, point.add(polygonSegment.normal)), ref_polygonEdgeProportion, ref_distanceProportion, ref_closestPointOnPolygonEdge);
            // if this projects beyond the endpoints of the polygon's edge, ignore it
            if (ref_polygonEdgeProportion.ref < 0 || ref_polygonEdgeProportion.ref > 1) {
                continue;
            }
            var thisDistance = Math.abs(ref_distanceProportion.ref);
            if (thisDistance < distance) {
                distance = thisDistance;
            }
        }
        return distance;
    }
    CollisionDetector.distancePolygonPoint = distancePolygonPoint;
    ;
    // CLOSEST TO
    function closestToShapeSegment(shape, ref_shapePoint, ref_segmentPoint, segment) {
        switch (shape.getType()) {
            case SHAPE_CIRCLE:
                return this.closestToCircleSegment(shape, ref_shapePoint, ref_segmentPoint, segment);
            case SHAPE_AABB:
                return this.closestToPolygonSegment(shape.getPolygon(), ref_shapePoint, ref_segmentPoint, segment);
            case SHAPE_POLYGON:
                return this.closestToPolygonSegment(shape, ref_shapePoint, ref_segmentPoint, segment);
        }
        alert('assertion failed in CollisionDetector.closestToShapeSegment');
    }
    CollisionDetector.closestToShapeSegment = closestToShapeSegment;
    ;
    function closestToCircleSegment(circle, ref_shapePoint, ref_segmentPoint, segment) {
        // see if the closest point is in the middle of the segment
        var ref_segmentProportion = {}, ref_projectProportion = {};
        this.intersectSegments(segment, new Segment(circle.center, circle.center.sub(segment.normal)), ref_segmentProportion, ref_projectProportion, ref_segmentPoint);
        // if the closest point is in the middle of the segment
        if (ref_segmentProportion.ref >= 0 && ref_segmentProportion.ref <= 1) {
            // this returns the distance of the circle from the segment, along the normal
            // since the normal is a unit vector and is also the shortest path, this works.
            ref_shapePoint.ref = circle.center.sub(segment.normal.mul(circle.radius * (ref_projectProportion.ref > 0 ? 1 : -1)));
            return ref_segmentPoint.ref.sub(circle.center).length() - circle.radius;
        }
        // otherwise, the closest point is one of the ends
        var distanceSquaredToStart = circle.center.sub(segment.start).lengthSquared();
        var distanceSquaredToEnd = circle.center.sub(segment.end).lengthSquared();
        // if the start is closer, use it
        if (distanceSquaredToStart < distanceSquaredToEnd) {
            ref_segmentPoint.ref = segment.start;
            // this was WAY off in the version before the port, was relative to circle.center instead of absolute:
            ref_shapePoint.ref = circle.center.add(ref_segmentPoint.ref.sub(circle.center).unit().mul(circle.radius));
            return Math.sqrt(distanceSquaredToStart) - circle.radius;
        }
        // otherwise, the end is closer
        ref_segmentPoint.ref = segment.end;
        // this was WAY off in the version before the port, was relative to circle.center instead of absolute:
        ref_shapePoint.ref = circle.center.add(ref_segmentPoint.ref.sub(circle.center).unit().mul(circle.radius));
        return Math.sqrt(distanceSquaredToEnd) - circle.radius;
    }
    CollisionDetector.closestToCircleSegment = closestToCircleSegment;
    ;
    function closestToPolygonSegment(polygon, ref_shapePoint, ref_segmentPoint, segment) {
        var distance = Number.POSITIVE_INFINITY;
        var thisDistance;
        // check every pair of points for distance
        for (var i = 0; i < polygon.vertices.length; i++) {
            var polygonPoint = polygon.getVertex(i);
            for (var j = 0; j < 2; j++) {
                var thisSegmentPoint = j == 0 ? segment.start : segment.end;
                thisDistance = polygonPoint.sub(thisSegmentPoint).length();
                if (thisDistance < distance) {
                    distance = thisDistance;
                    ref_segmentPoint.ref = thisSegmentPoint;
                    ref_shapePoint.ref = polygonPoint;
                }
            }
        }
        var ref_edgeProportion = {}, ref_polygonDistanceProportion = {}, ref_closestPoint = {};
        // see how close each vertex of the polygon is to a point in the middle of the edge
        for (var i = 0; i < polygon.vertices.length; i++) {
            var polygonPoint = polygon.getVertex(i);
            // find where this polygon vertex projects onto the edge
            this.intersectSegments(segment, new Segment(polygonPoint, polygonPoint.sub(segment.normal)), ref_edgeProportion, ref_polygonDistanceProportion, ref_closestPoint);
            // if this projects beyond the endpoints of the edge, ignore it
            if (ref_edgeProportion.ref < 0 || ref_edgeProportion.ref > 1) {
                continue;
            }
            // the distance along the normal of the segment from the segment to this vertex of the polygon
            thisDistance = Math.abs(ref_polygonDistanceProportion.ref);
            // if this is the closest we've found, use this
            if (thisDistance < distance) {
                distance = thisDistance;
                ref_segmentPoint.ref = ref_closestPoint.ref;
                ref_shapePoint.ref = polygonPoint;
            }
        }
        var ref_polygonEdgeProportion = {}, ref_distanceProportion = {};
        // see how close each endpoint of the segment is to a point on the middle of a polygon edge
        for (var i = 0; i < polygon.vertices.length; i++) {
            var polygonSegment = polygon.getSegment(i);
            for (var j = 0; j < 2; j++) {
                var thisSegmentPoint = j == 0 ? segment.start : segment.end;
                // find where this segment endpoint projects onto the polygon edge
                this.intersectSegments(polygonSegment, new Segment(thisSegmentPoint, thisSegmentPoint.add(polygonSegment.normal)), ref_polygonEdgeProportion, ref_distanceProportion, ref_closestPoint);
                // if this projects beyond the endpoints of the polygon's edge, ignore it
                if (ref_polygonEdgeProportion.ref < 0 || ref_polygonEdgeProportion.ref > 1) {
                    continue;
                }
                thisDistance = Math.abs(ref_distanceProportion.ref);
                if (thisDistance < distance) {
                    distance = thisDistance;
                    ref_segmentPoint.ref = thisSegmentPoint;
                    ref_shapePoint.ref = ref_closestPoint.ref;
                }
            }
        }
        return distance;
    }
    CollisionDetector.closestToPolygonSegment = closestToPolygonSegment;
    ;
    // PENETRATIONS
    function penetrationEntityWorld(entity, edgeQuad, world) {
        var shape = entity.getShape();
        edgeQuad.nullifyEdges();
        var edges = world.getEdgesInAabb(shape.getAabb().expand(0.1), entity.getColor());
        for (var it = 0; it < edges.length; it++) {
            // if the polygon isn't close to this segment, forget about it
            var thisDistance = this.distanceShapeSegment(shape, edges[it].segment);
            if (thisDistance > 0.01) {
                continue;
            }
            // if the penetration is negative, ignore this segment
            var thisPenetration = this.penetrationShapeSegment(shape, edges[it].segment);
            if (thisPenetration < 0) {
                continue;
            }
            edgeQuad.minimize(edges[it], thisPenetration);
        }
    }
    CollisionDetector.penetrationEntityWorld = penetrationEntityWorld;
    ;
    function penetrationShapeSegment(shape, segment) {
        switch (shape.getType()) {
            case SHAPE_CIRCLE:
                return this.penetrationCircleSegment(shape, segment);
            case SHAPE_AABB:
                return this.penetrationPolygonSegment(shape.getPolygon(), segment);
            case SHAPE_POLYGON:
                return this.penetrationPolygonSegment(shape, segment);
        }
        alert('assertion failed in CollisionDetector.penetrationShapeSegment');
    }
    CollisionDetector.penetrationShapeSegment = penetrationShapeSegment;
    ;
    function penetrationCircleSegment(circle, segment) {
        // a directed radius towards the segment
        var radiusToLine = segment.normal.mul(-circle.radius);
        // position on the circle closest to the inside of the line
        var innermost = circle.center.add(radiusToLine);
        // map this onto the normal.
        return innermost.sub(segment.start).dot(segment.normal);
    }
    CollisionDetector.penetrationCircleSegment = penetrationCircleSegment;
    ;
    function penetrationPolygonSegment(polygon, segment) {
        var innermost = Number.POSITIVE_INFINITY;
        var ref_edgeProportion = {}, ref_penetrationProportion = {}, ref_closestPointOnSegment = {};
        // check the penetration of each vertex of the polygon
        for (var i = 0; i < polygon.vertices.length; i++) {
            var vertex = polygon.getVertex(i);
            // find where this polygon point projects onto the segment
            this.intersectSegments(segment, new Segment(vertex, vertex.sub(segment.normal)), ref_edgeProportion, ref_penetrationProportion, ref_closestPointOnSegment);
            // if this point projects onto the segment outside of its endpoints, don't consider this point to be projected
            // into this edge
            if (ref_edgeProportion.ref < 0 || ref_edgeProportion.ref > 1) {
                continue;
            }
            // the penetration of this vertex
            if (ref_penetrationProportion.ref < innermost) {
                innermost = ref_penetrationProportion.ref;
            }
        }
        return innermost;
    }
    CollisionDetector.penetrationPolygonSegment = penetrationPolygonSegment;
})(CollisionDetector || (CollisionDetector = {}));
// class Contact
var Contact = (function () {
    function Contact(contactPoint, normal, proportionOfDelta) {
        this.contactPoint = contactPoint;
        this.normal = normal;
        this.proportionOfDelta = proportionOfDelta;
        // this.proportionOfDelta = proportionOfDelta;
        // this.contactPoint = contactPoint;
        // this.normal = normal;
    }
    return Contact;
}());
// class EdgeQuad
var EdgeQuad = (function () {
    function EdgeQuad() {
        this.quantities = [0, 0, 0, 0];
        this.nullifyEdges();
        // this.quantities = [0, 0, 0, 0];
    }
    EdgeQuad.prototype.nullifyEdges = function () {
        this.edges = [null, null, null, null];
    };
    EdgeQuad.prototype.minimize = function (edge, quantity) {
        var orientation = edge.getOrientation();
        if (this.edges[orientation] == null || quantity < this.quantities[orientation]) {
            this.edges[orientation] = edge;
            this.quantities[orientation] = quantity;
        }
    };
    EdgeQuad.prototype.throwOutIfGreaterThan = function (minimum) {
        for (var i = 0; i < 4; i++) {
            if (this.quantities[i] > minimum) {
                this.edges[i] = null;
            }
        }
    };
    return EdgeQuad;
}());
// this is a global because we only ever need one and allocations are expensive
var edgeQuad = new EdgeQuad();
/**
  *  For the polygon class, the segments and the bounding box are all relative to the center of the polygon.
  *  That is, when the polygon moves, the center is the only thing that changes.  This is to prevent
  *  floating-point arithmetic errors that would be caused by maintaining several sets of absolute coordinates.
  *
  *  Segment i goes from vertex i to vertex ((i + 1) % vertices.length)
  *
  *  When making a new polygon, please declare the vertices in counterclockwise order.	I'm not sure what will
  *  happen if you don't do that.
  */
// class Polygon extends Shape
var Polygon = (function () {
    function Polygon() {
        this.segments = [];
        // center is the first argument, the next arguments are the vertices relative to the center
        arguments = Array.prototype.slice.call(arguments);
        this.center = arguments.shift();
        this.vertices = arguments;
        // this.segments = [];
        for (var i = 0; i < this.vertices.length; i++) {
            this.segments.push(new Segment(this.vertices[i], this.vertices[(i + 1) % this.vertices.length]));
        }
        this.boundingBox = new AABB(this.vertices[0], this.vertices[0]);
        this.initializeBounds();
    }
    Polygon.prototype.copy = function () {
        var polygon = new Polygon(this.center, this.vertices[0]);
        polygon.vertices = this.vertices;
        polygon.segments = this.segments;
        polygon.initializeBounds();
        return polygon;
    };
    Polygon.prototype.getType = function () {
        return SHAPE_POLYGON;
    };
    Polygon.prototype.moveBy = function (delta) {
        this.center = this.center.add(delta);
    };
    Polygon.prototype.moveTo = function (destination) {
        this.center = destination;
    };
    Polygon.prototype.getVertex = function (i) {
        return this.vertices[i].add(this.center);
    };
    Polygon.prototype.getSegment = function (i) {
        return this.segments[i].offsetBy(this.center);
    };
    Polygon.prototype.getAabb = function () {
        return this.boundingBox.offsetBy(this.center);
    };
    Polygon.prototype.getCenter = function () {
        return this.center;
    };
    // expand the aabb and the bounding circle to contain all vertices
    Polygon.prototype.initializeBounds = function () {
        for (var i = 0; i < this.vertices.length; i++) {
            var vertex = this.vertices[i];
            // expand the bounding box to include this vertex
            this.boundingBox = this.boundingBox.include(vertex);
        }
    };
    Polygon.prototype.draw = function (c) {
        c.strokeStyle = 'black';
        c.beginPath();
        for (var i = 0; i < this.vertices.length; i++) {
            c.lineTo(this.vertices[i].x + this.center.x, this.vertices[i].y + this.center.y);
        }
        c.closePath();
        c.stroke();
    };
    return Polygon;
}());
// class Segment
var Segment = (function () {
    function Segment(start, end) {
        this.start = start;
        this.end = end;
        // this.start = start;
        // this.end = end;
        this.normal = end.sub(start).flip().unit();
    }
    Segment.prototype.offsetBy = function (offset) {
        return new Segment(this.start.add(offset), this.end.add(offset));
    };
    Segment.prototype.draw = function (c) {
        c.beginPath();
        c.moveTo(this.start.x, this.start.y);
        c.lineTo(this.end.x, this.end.y);
        c.stroke();
    };
    return Segment;
}());
// enum ShapeType
var SHAPE_CIRCLE = 0;
var SHAPE_AABB = 1;
var SHAPE_POLYGON = 2;
///<reference path="../util/vector.ts" /> 
// class Entity
var Entity = (function () {
    function Entity() {
        // this.velocity = new Vector(0, 0);
        this.velocity = new Vector(0, 0);
        this._isDead = false;
        // private variable to tell whether this enemy will be removed at the end of all Entity ticks
        //this._isDead = false;
    }
    Entity.prototype.getVelocity = function () { return this.velocity; };
    Entity.prototype.setVelocity = function (vel) { this.velocity = vel; };
    Entity.prototype.isDead = function () { return this._isDead; };
    Entity.prototype.setDead = function (isDead) {
        if (this._isDead === isDead)
            return;
        this._isDead = isDead;
        if (this._isDead)
            this.onDeath();
        else
            this.onRespawn();
    };
    Entity.prototype.getCenter = function () { return this.getShape().getCenter(); };
    Entity.prototype.setCenter = function (vec) { this.getShape().moveTo(vec); };
    Entity.prototype.getColor = function () { throw 'Entity.getColor() unimplemented'; };
    Entity.prototype.getShape = function () { throw 'Entity.getShape() unimplemented'; };
    Entity.prototype.getCenter = function () { return this.getShape().getCenter(); };
    Entity.prototype.setCenter = function (center) { this.getShape().moveTo(center); };
    Entity.prototype.isOnFloor = function () {
        // THIS IS A GLOBAL NOW var edgeQuad = new EdgeQuad();
        CollisionDetector.onEntityWorld(this, edgeQuad, gameState.world);
        return (edgeQuad.edges[EDGE_FLOOR] != null);
    };
    Entity.prototype.tick = function () { throw 'Entity.tick() unimplemented'; };
    Entity.prototype.draw = function () { throw 'Entity.draw() unimplemented'; };
    Entity.prototype.onDeath = function () { };
    Entity.prototype.onRespawn = function () { };
    return Entity;
}());
///<reference path="./entity.ts" /> 
var MAX_SPAWN_FORCE = 100.0;
var INNER_SPAWN_RADIUS = 1.0;
var OUTER_SPAWN_RADIUS = 1.1;
// enum for enemies
var ENEMY_BOMB = 0;
var ENEMY_BOMBER = 1;
var ENEMY_BOUNCY_ROCKET = 2;
var ENEMY_BOUNCY_ROCKET_LAUNCHER = 3;
var ENEMY_CLOUD = 4;
var ENEMY_MAGNET = 5;
var ENEMY_GRENADE = 6;
var ENEMY_GRENADIER = 7;
var ENEMY_HEADACHE = 8;
var ENEMY_HELP_SIGN = 9;
var ENEMY_HUNTER = 10;
var ENEMY_LASER = 11;
var ENEMY_MULTI_GUN = 12;
var ENEMY_POPPER = 13;
var ENEMY_RIOT_BULLET = 14;
var ENEMY_JET_STREAM = 15;
var ENEMY_ROCKET = 16;
var ENEMY_ROCKET_SPIDER = 17;
var ENEMY_ROLLER_BEAR = 18;
var ENEMY_SHOCK_HAWK = 19;
var ENEMY_SPIKE_BALL = 20;
var ENEMY_STALACBAT = 21;
var ENEMY_WALL_AVOIDER = 22;
var ENEMY_CRAWLER = 23;
var ENEMY_WHEELIGATOR = 24;
var ENEMY_DOORBELL = 25;
// Enemy.subclasses(Entity);
/**
  * Abstract class.  Represents dynamic non-user-controlled entities in the game world.
  */
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(type, elasticity) {
        var _this = 
        // Entity.prototype.constructor.call(this);
        _super.call(this) || this;
        _this.type = type;
        _this.elasticity = elasticity;
        return _this;
        // this.type = type;
        // this.elasticity = elasticity;
    }
    // Most enemies should use the default Tick and override methods below
    Enemy.prototype.tick = function (seconds) {
        if (this.avoidsSpawn()) {
            this.setVelocity(this.getVelocity().add(this.avoidSpawnForce().mul(seconds)));
        }
        var ref_deltaPosition = { ref: this.move(seconds) };
        var ref_velocity = { ref: this.getVelocity() };
        var shape = this.getShape();
        var contact = null;
        // Only collide enemies that can collide with the world
        if (this.canCollide()) {
            contact = CollisionDetector.collideEntityWorld(this, ref_deltaPosition, ref_velocity, this.elasticity, gameState.world, true);
            this.setVelocity(ref_velocity.ref);
        }
        shape.moveBy(ref_deltaPosition.ref);
        // If this enemy collided with the world, react to the world
        if (contact !== null) {
            this.reactToWorld(contact);
        }
        // If this is way out of bounds, kill it
        if (!CollisionDetector.containsPointShape(shape.getCenter(), gameState.world.getHugeAabb())) {
            this.setDead(true);
        }
        // If the enemy is still alive, collide it with the players
        if (!this.isDead()) {
            var players = CollisionDetector.overlapShapePlayers(shape);
            for (var i = 0; i < players.length; ++i) {
                if (!players[i].isDead()) {
                    this.reactToPlayer(players[i]);
                }
            }
        }
        this.afterTick(seconds);
    };
    Enemy.prototype.getColor = function () {
        return EDGE_ENEMIES;
    };
    Enemy.prototype.getElasticity = function () { return this.elasticity; };
    ;
    Enemy.prototype.getType = function () { return this.type; };
    ;
    Enemy.prototype.getTarget = function () { return -1; };
    ;
    Enemy.prototype.setTarget = function (player) { };
    ;
    Enemy.prototype.onDeath = function () { };
    ;
    Enemy.prototype.canCollide = function () { return true; };
    ;
    Enemy.prototype.avoidsSpawn = function () { return false; };
    ;
    // Accelerate updates velocity and returns the delta position
    Enemy.prototype.accelerate = function (accel, seconds) {
        this.setVelocity(this.velocity.add(accel.mul(seconds)));
        return this.velocity.mul(seconds);
    };
    Enemy.prototype.avoidSpawnForce = function () {
        var relSpawnPosition = gameState.getSpawnPoint().sub(this.getCenter());
        var radius = this.getShape().radius;
        var distance = relSpawnPosition.length() - radius;
        // If inside the inner circle, push with max force
        if (distance < INNER_SPAWN_RADIUS) {
            return relSpawnPosition.unit().mul(-MAX_SPAWN_FORCE);
        }
        else if (distance < OUTER_SPAWN_RADIUS) {
            var magnitude = MAX_SPAWN_FORCE * (1 - (distance - INNER_SPAWN_RADIUS) / (OUTER_SPAWN_RADIUS - INNER_SPAWN_RADIUS));
            return relSpawnPosition.unit().mul(-magnitude);
        }
        else
            return new Vector(0, 0);
    };
    // THE FOLLOWING SHOULD BE OVERRIDDEN BY ALL ENEMIES:
    // This moves the enemy
    Enemy.prototype.move = function (seconds) {
        return new Vector(0, 0);
    };
    // Enemy's reaction to a collision with the World, by default has no effect
    Enemy.prototype.reactToWorld = function (contact) { };
    ;
    // Enemy's reaction to a collision with a Player, by default kills the Player
    Enemy.prototype.reactToPlayer = function (player) {
        player.setDead(true);
    };
    // Do stuff that needs an updated enemy, like move the graphics
    Enemy.prototype.afterTick = function (seconds) { };
    return Enemy;
}(Entity));
///<reference path="./enemy.ts" /> 
var FREEFALL_ACCEL = -6;
//FreefallEnemy.subclasses(Enemy);
var FreefallEnemy = (function (_super) {
    __extends(FreefallEnemy, _super);
    function FreefallEnemy(type, center, radius, elasticity) {
        var _this = 
        //Enemy.prototype.constructor.call(this, type, elasticity);
        _super.call(this, type, elasticity) || this;
        _this.hitCircle = new Circle(center, radius);
        return _this;
    }
    FreefallEnemy.prototype.getShape = function () {
        return this.hitCircle;
    };
    FreefallEnemy.prototype.draw = function (c) {
        var pos = this.hitCircle.center;
        c.fillStyle = 'black';
        c.beginPath();
        c.arc(pos.x, pos.y, this.hitCircle.radius, 0, Math.PI * 2, false);
        c.fill();
    };
    // This moves the enemy and constrains its position
    FreefallEnemy.prototype.move = function (seconds) {
        return this.accelerate(new Vector(0, FREEFALL_ACCEL), seconds);
    };
    // Enemy's reaction to a collision with the World
    FreefallEnemy.prototype.reactToWorld = function (contact) {
        this.setDead(true);
    };
    // Enemy's reaction to a collision with a Player
    FreefallEnemy.prototype.reactToPlayer = function (player) {
        this.setDead(true);
        player.setDead(true);
    };
    return FreefallEnemy;
}(Enemy));
///<reference path="./freefallenemy.ts" /> 
var BOMB_RADIUS = 0.15;
//Bomb.subclasses(FreefallEnemy);
var Bomb = (function (_super) {
    __extends(Bomb, _super);
    function Bomb(center, velocity) {
        var _this = 
        //FreefallEnemy.prototype.constructor.call(this, ENEMY_BOMB, center, BOMB_RADIUS, 0);
        _super.call(this, ENEMY_BOMB, center, BOMB_RADIUS, 0) || this;
        _this.velocity = velocity;
        _this.velocity = velocity;
        return _this;
    }
    // bomb particle effects
    Bomb.prototype.onDeath = function () {
        var position = this.getShape().getCenter();
        // fire
        for (var i = 0; i < 50; ++i) {
            var direction = Vector.fromAngle(randInRange(0, 2 * Math.PI)).mul(randInRange(0.5, 7));
            Particle().position(position).velocity(direction).radius(0.02, 0.15).bounces(0, 4).elasticity(0.05, 0.9).decay(0.00001, 0.0001).expand(1.0, 1.2).color(1, 0.5, 0, 1).mixColor(1, 1, 0, 1).triangle();
        }
        // white center
        // collide should be false on this
        Particle().position(position).radius(0.1).bounces(0).gravity(false).decay(0.000001).expand(10).color(1, 1, 1, 5).circle();
    };
    return Bomb;
}(FreefallEnemy));
// SpawningEnemy.subclasses(Enemy);
var SpawningEnemy = (function (_super) {
    __extends(SpawningEnemy, _super);
    function SpawningEnemy(type, center, width, height, elasticity, frequency, startingTime) {
        var _this = 
        // Enemy.prototype.constructor.call(this, type, elasticity);
        _super.call(this, type, elasticity) || this;
        _this.spawnFrequency = frequency;
        // Time until next enemy gets spawned
        _this.timeUntilNextSpawn = startingTime;
        _this.hitBox = AABB.makeAABB(center, width, height);
        return _this;
    }
    SpawningEnemy.prototype.getShape = function () {
        return this.hitBox;
    };
    // return a number between 0 and 1 indicating how ready we are for
    // the next spawn (0 is just spawned and 1 is about to spawn)
    SpawningEnemy.prototype.getReloadPercentage = function () {
        return 1 - this.timeUntilNextSpawn / this.spawnFrequency;
    };
    // Special tick to include a step to spawn enemies
    SpawningEnemy.prototype.tick = function (seconds) {
        this.timeUntilNextSpawn -= seconds;
        if (this.timeUntilNextSpawn <= 0) {
            // If an enemy is spawned, increase the time by the spawn frequency
            if (this.spawn()) {
                this.timeUntilNextSpawn += this.spawnFrequency;
            }
            else {
                this.timeUntilNextSpawn = 0;
            }
        }
        //Enemy.prototype.tick.call(this, seconds);
        _super.prototype.tick.call(this, seconds);
    };
    SpawningEnemy.prototype.reactToPlayer = function (player) {
    };
    // Subclasses of this should overwrite Spawn() to spawn the right type of enemy
    // Returns true iff an enemy is actually spawned
    SpawningEnemy.prototype.spawn = function () {
        throw 'SpawningEnemy.spawn() unimplemented';
    };
    return SpawningEnemy;
}(Enemy));
///<reference path="./SpawningEnemy.ts" />
var BOMBER_WIDTH = .4;
var BOMBER_HEIGHT = .4;
var BOMBER_SPEED = 2;
// Frequency is in seconds
var BOMB_FREQUENCY = 1.0;
var BOMBER_ELASTICITY = 1.0;
var BOMBER_EXPLOSION_POWER = 6;
// Bomber.subclasses(SpawningEnemy);
var Bomber = (function (_super) {
    __extends(Bomber, _super);
    function Bomber(center, angle) {
        var _this = 
        //SpawningEnemy.prototype.constructor.call(this, ENEMY_BOMBER, center, BOMBER_WIDTH, BOMBER_HEIGHT, BOMBER_ELASTICITY, BOMB_FREQUENCY, randInRange(0, BOMB_FREQUENCY));
        _super.call(this, ENEMY_BOMBER, center, BOMBER_WIDTH, BOMBER_HEIGHT, BOMBER_ELASTICITY, BOMB_FREQUENCY, randInRange(0, BOMB_FREQUENCY)) || this;
        if (angle < Math.PI * 0.25)
            _this.setVelocity(new Vector(BOMBER_SPEED, 0));
        else if (angle < Math.PI * 0.75)
            _this.setVelocity(new Vector(0, BOMBER_SPEED));
        else if (angle < Math.PI * 1.25)
            _this.setVelocity(new Vector(-BOMBER_SPEED, 0));
        else if (angle < Math.PI * 1.75)
            _this.setVelocity(new Vector(0, -BOMBER_SPEED));
        else
            _this.setVelocity(new Vector(BOMBER_SPEED, 0));
        return _this;
    }
    Bomber.prototype.move = function (seconds) {
        return this.velocity.mul(seconds);
    };
    Bomber.prototype.reactToPlayer = function (player) {
        var relativePos = player.getCenter().sub(this.getCenter());
        // If player jumps on top of the Bomber, it explodes
        if (relativePos.y > (BOMBER_HEIGHT - .05)) {
            player.setVelocity(new Vector(player.getVelocity().x, BOMBER_EXPLOSION_POWER));
            this.setDead(true);
        }
        else if (player.isSuperJumping) {
            this.setDead(true);
        }
        else {
            player.setDead(true);
        }
    };
    Bomber.prototype.spawn = function () {
        var spawnPoint = new Vector(this.hitBox.lowerLeft.x + this.hitBox.getWidth() * 0.5, this.hitBox.getBottom());
        gameState.addEnemy(new Bomb(spawnPoint, new Vector(0, Math.min(this.velocity.y, -.3))), spawnPoint);
        return true;
    };
    Bomber.prototype.afterTick = function () {
        // drawing stuff
    };
    Bomber.prototype.onDeath = function () {
        Bomb.prototype.onDeath.call(this);
        gameState.incrementStat(STAT_ENEMY_DEATHS);
    };
    Bomber.prototype.draw = function (c) {
        var pos = this.getCenter();
        c.strokeStyle = 'black';
        c.beginPath();
        c.moveTo(pos.x - 0.25, pos.y - 0.2);
        c.lineTo(pos.x - 0.25, pos.y - 0.1);
        c.lineTo(pos.x - 0.1, pos.y + 0.05);
        c.lineTo(pos.x + 0.1, pos.y + 0.05);
        c.lineTo(pos.x + 0.25, pos.y - 0.1);
        c.lineTo(pos.x + 0.25, pos.y - 0.2);
        c.arc(pos.x, pos.y - BOMBER_HEIGHT * 0.5, BOMB_RADIUS, 0, Math.PI, false);
        c.lineTo(pos.x - 0.25, pos.y - 0.2);
        c.moveTo(pos.x - 0.1, pos.y + 0.05);
        c.lineTo(pos.x - 0.2, pos.y + 0.15);
        c.moveTo(pos.x + 0.1, pos.y + 0.05);
        c.lineTo(pos.x + 0.2, pos.y + 0.15);
        c.stroke();
        c.fillStyle = 'black';
        c.beginPath();
        c.arc(pos.x, pos.y - BOMBER_HEIGHT * 0.5, BOMB_RADIUS * this.getReloadPercentage(), 0, 2 * Math.PI, false);
        c.fill();
    };
    return Bomber;
}(SpawningEnemy));
// RotatingEnemy.subclasses(Enemy);
/**
  * Abstract class representing enemies that may rotating, including seeking enemies.
  * These enemies are all circular.
  */
var RotatingEnemy = (function (_super) {
    __extends(RotatingEnemy, _super);
    function RotatingEnemy(type, center, radius, heading, elasticity) {
        var _this = 
        // Enemy.prototype.constructor.call(this, type, elasticity);
        _super.call(this, type, elasticity) || this;
        _this.hitCircle = new Circle(center, radius);
        _this.heading = heading;
        return _this;
    }
    RotatingEnemy.prototype.getShape = function () {
        return this.hitCircle;
    };
    return RotatingEnemy;
}(Enemy));
///<reference path="./RotatingEnemy.ts" />
var ROCKET_SPRITE_RED = 0;
var ROCKET_SPRITE_BLUE = 1;
var ROCKET_SPEED = 2.5;
// Max rotation in radians / second
var ROCKET_MAX_ROTATION = 8;
var ROCKET_RADIUS = .15;
var ROCKET_ELASTICITY = 1;
// In seconds, the amount of time the Rocket's direction is fixed
var ROCKET_HEADING_CONSTRAINT_TIME = 0.3;
var PARTICLE_FREQUENCY = 0.03;
function drawRocket(c) {
    var size = 0.075;
    c.strokeStyle = 'black';
    c.beginPath();
    c.moveTo(-ROCKET_RADIUS, size);
    c.lineTo(ROCKET_RADIUS - size, size);
    c.lineTo(ROCKET_RADIUS, 0);
    c.lineTo(ROCKET_RADIUS - size, -size);
    c.lineTo(-ROCKET_RADIUS, -size);
    c.closePath();
    c.fill();
    c.stroke();
}
// Rocket.subclasses(RotatingEnemy);
var Rocket = (function (_super) {
    __extends(Rocket, _super);
    function Rocket(center, target, heading, maxRotation, type) {
        var _this = 
        //RotatingEnemy.prototype.constructor.call(this, type, center, ROCKET_RADIUS, heading, ROCKET_ELASTICITY);
        _super.call(this, type, center, ROCKET_RADIUS, heading, ROCKET_ELASTICITY) || this;
        _this.sprites = [new Sprite(), new Sprite];
        _this.target = target;
        _this.maxRotation = maxRotation;
        _this.timeUntilFree = ROCKET_HEADING_CONSTRAINT_TIME;
        _this.timeUntilNextParticle = 0;
        _this.velocity = new Vector(ROCKET_SPEED * Math.cos(heading), ROCKET_SPEED * Math.sin(heading));
        _this.sprites = [new Sprite(), new Sprite];
        _this.sprites[ROCKET_SPRITE_RED].drawGeometry = function (c) {
            c.fillStyle = 'red';
            drawRocket(c);
        };
        _this.sprites[ROCKET_SPRITE_BLUE].drawGeometry = function (c) {
            c.fillStyle = 'blue';
            drawRocket(c);
        };
        return _this;
    }
    Rocket.prototype.getTarget = function () { return this.target === gameState.playerB; };
    Rocket.prototype.setTarget = function (player) { this.target = player; };
    Rocket.prototype.calcHeading = function (seconds) {
        if (this.target.isDead())
            return;
        var delta = this.target.getCenter().sub(this.getCenter());
        var angle = delta.atan2();
        this.heading = adjustAngleToTarget(this.heading, angle, this.maxRotation * seconds);
    };
    Rocket.prototype.move = function (seconds) {
        if (this.timeUntilFree <= 0) {
            this.calcHeading(seconds);
            this.velocity = new Vector(ROCKET_SPEED * Math.cos(this.heading), ROCKET_SPEED * Math.sin(this.heading));
        }
        else {
            this.timeUntilFree -= seconds;
        }
        return this.velocity.mul(seconds);
    };
    Rocket.prototype.afterTick = function (seconds) {
        var position = this.getCenter();
        this.sprites[ROCKET_SPRITE_RED].offsetBeforeRotation = position;
        this.sprites[ROCKET_SPRITE_BLUE].offsetBeforeRotation = position;
        this.sprites[ROCKET_SPRITE_RED].angle = this.heading;
        this.sprites[ROCKET_SPRITE_BLUE].angle = this.heading;
        position = position.sub(this.velocity.unit().mul(ROCKET_RADIUS));
        this.timeUntilNextParticle -= seconds;
        while (this.timeUntilNextParticle <= 0 && !this.isDead()) {
            // add a flame
            var direction = Vector.fromAngle(randInRange(0, 2 * Math.PI));
            direction = direction.mul(randInRange(0, 2)).sub(this.velocity.mul(3));
            Particle().position(position).velocity(direction).radius(0.1, 0.15).bounces(1).decay(0.000001, 0.00001).expand(1.0, 1.2).color(1, 0.5, 0, 1).mixColor(1, 1, 0, 1).triangle();
            // add a puff of smoke
            direction = Vector.fromAngle(randInRange(0, 2 * Math.PI));
            direction = direction.mul(randInRange(0.25, 1)).sub(this.velocity);
            Particle().position(position).velocity(direction).radius(0.05, 0.1).bounces(1).elasticity(0.05, 0.9).decay(0.0005, 0.001).expand(1.2, 1.4).color(0, 0, 0, 0.25).mixColor(0.25, 0.25, 0.25, 0.75).circle().gravity(-0.4, 0);
            this.timeUntilNextParticle += PARTICLE_FREQUENCY;
        }
    };
    Rocket.prototype.reactToWorld = function (contact) {
        this.setDead(true);
    };
    Rocket.prototype.reactToPlayer = function (player) {
        this.setDead(true);
        player.setDead(true);
    };
    Rocket.prototype.onDeath = function () {
        var position = this.getCenter();
        // fire
        for (var i = 0; i < 50; ++i) {
            var direction = Vector.fromAngle(randInRange(0, 2 * Math.PI));
            direction = direction.mul(randInRange(0.5, 17));
            Particle().position(position).velocity(direction).radius(0.02, 0.15).bounces(0, 4).elasticity(0.05, 0.9).decay(0.00001, 0.0001).expand(1.0, 1.2).color(1, 0.5, 0, 1).mixColor(1, 1, 0, 1).triangle();
        }
    };
    Rocket.prototype.draw = function (c) {
        this.sprites[this.target == gameState.playerA ? ROCKET_SPRITE_RED : ROCKET_SPRITE_BLUE].draw(c);
    };
    return Rocket;
}(RotatingEnemy));
///<reference path="./rocket.ts" />
var BOUNCY_ROCKET_SPEED = 4;
var BOUNCY_ROCKET_MAX_ROTATION = 3;
var BOUNCY_ROCKET_HEALTH = 2;
function drawBouncyRocket(c, isBlue) {
    var size = 0.1;
    c.strokeStyle = 'black';
    c.fillStyle = isBlue ? 'blue' : 'red';
    c.beginPath();
    c.moveTo(-ROCKET_RADIUS, size);
    c.arc(ROCKET_RADIUS - size, 0, size, Math.PI / 2, -Math.PI / 2, true);
    c.lineTo(-ROCKET_RADIUS, -size);
    c.fill();
    c.stroke();
    c.fillStyle = isBlue ? 'red' : 'blue';
    c.beginPath();
    c.arc(-ROCKET_RADIUS, 0, size, -Math.PI / 2, Math.PI / 2, false);
    c.closePath();
    c.fill();
    c.stroke();
}
// BouncyRocket.subclasses(Rocket);
var BouncyRocket = (function (_super) {
    __extends(BouncyRocket, _super);
    function BouncyRocket(center, target, heading, launcher) {
        var _this = 
        // Rocket.prototype.constructor.call(this, center, target, heading, BOUNCY_ROCKET_MAX_ROTATION, ENEMY_BOUNCY_ROCKET);
        _super.call(this, center, target, heading, BOUNCY_ROCKET_MAX_ROTATION, ENEMY_BOUNCY_ROCKET) || this;
        _this.velocity = new Vector(BOUNCY_ROCKET_SPEED * Math.cos(heading), BOUNCY_ROCKET_SPEED * Math.sin(heading));
        _this.launcher = launcher;
        _this.hitsUntilExplodes = BOUNCY_ROCKET_HEALTH;
        _this.sprites[ROCKET_SPRITE_RED].drawGeometry = function (c) {
            drawBouncyRocket(c, false);
        };
        _this.sprites[ROCKET_SPRITE_BLUE].drawGeometry = function (c) {
            drawBouncyRocket(c, true);
        };
        return _this;
    }
    BouncyRocket.prototype.move = function (seconds) {
        this.heading = this.velocity.atan2();
        this.calcHeading(seconds);
        this.velocity = new Vector(BOUNCY_ROCKET_SPEED * Math.cos(this.heading), BOUNCY_ROCKET_SPEED * Math.sin(this.heading));
        return this.velocity.mul(seconds);
    };
    BouncyRocket.prototype.reactToWorld = function (contact) {
        --this.hitsUntilExplodes;
        if (this.hitsUntilExplodes <= 0) {
            this.setDead(true);
        }
        else {
            this.target = gameState.getOtherPlayer(this.target);
        }
    };
    BouncyRocket.prototype.setDead = function (isDead) {
        Entity.prototype.setDead.call(this, isDead);
        if (isDead && this.launcher !== null) {
            this.launcher.rocketDestroyed();
        }
    };
    return BouncyRocket;
}(Rocket));
///<reference path="./SpawningEnemy.ts" />
var BOUNCY_LAUNCHER_WIDTH = .5;
var BOUNCY_LAUNCHER_HEIGHT = .5;
var BOUNCY_LAUNCHER_SHOOT_FREQ = 1;
var BOUNCY_LAUNCHER_RANGE = 8;
// BouncyRocketLauncher.subclasses(SpawningEnemy);
var BouncyRocketLauncher = (function (_super) {
    __extends(BouncyRocketLauncher, _super);
    function BouncyRocketLauncher(center, target) {
        var _this = 
        //SpawningEnemy.prototype.constructor.call(this, ENEMY_BOUNCY_ROCKET_LAUNCHER, center, BOUNCY_LAUNCHER_WIDTH, BOUNCY_LAUNCHER_HEIGHT, 0, BOUNCY_LAUNCHER_SHOOT_FREQ, 0);
        _super.call(this, ENEMY_BOUNCY_ROCKET_LAUNCHER, center, BOUNCY_LAUNCHER_WIDTH, BOUNCY_LAUNCHER_HEIGHT, 0, BOUNCY_LAUNCHER_SHOOT_FREQ, 0) || this;
        _this.target = target;
        _this.canFire = true;
        _this.angle = 0;
        _this.bodySprite = new Sprite();
        if (_this.target === gameState.playerA) {
            _this.bodySprite.drawGeometry = function (c) {
                // End of gun
                c.strokeStyle = 'black';
                c.beginPath();
                c.moveTo(0, -0.1);
                c.lineTo(-0.3, -0.1);
                c.lineTo(-0.3, 0.1);
                c.lineTo(0, 0 + 0.1);
                c.stroke();
                // Main body
                c.fillStyle = 'red';
                c.beginPath();
                c.arc(0, 0, 0.2, 0, 2 * Math.PI, false);
                c.fill();
                c.fillStyle = 'blue';
                c.beginPath();
                c.arc(0, 0, 0.2, 1.65 * Math.PI, 2.35 * Math.PI, false);
                c.fill();
                c.strokeStyle = 'black';
                c.beginPath();
                c.arc(0, 0, 0.2, 0, 2 * Math.PI, false);
                c.stroke();
                c.beginPath();
                c.moveTo(0.1, -0.18);
                c.lineTo(0.1, 0.18);
                c.stroke();
            };
        }
        else {
            _this.bodySprite.drawGeometry = function (c) {
                // End of gun
                c.strokeStyle = 'black';
                c.beginPath();
                c.moveTo(0, -0.1);
                c.lineTo(-0.3, -0.1);
                c.lineTo(-0.3, 0.1);
                c.lineTo(0, 0 + 0.1);
                c.stroke();
                // Main body
                c.fillStyle = 'blue';
                c.beginPath();
                c.arc(0, 0, 0.2, 0, 2 * Math.PI, false);
                c.fill();
                c.fillStyle = 'red';
                c.beginPath();
                c.arc(0, 0, 0.2, 1.65 * Math.PI, 2.35 * Math.PI, false);
                c.fill();
                c.strokeStyle = 'black';
                c.beginPath();
                c.arc(0, 0, 0.2, 0, 2 * Math.PI, false);
                c.stroke();
                c.fillStyle = 'black';
                c.beginPath();
                c.moveTo(0.1, -0.18);
                c.lineTo(0.1, 0.18);
                c.stroke();
            };
        }
        return _this;
    }
    BouncyRocketLauncher.prototype.setTarget = function (player) { this.target = player; };
    BouncyRocketLauncher.prototype.canCollide = function () { return false; };
    BouncyRocketLauncher.prototype.rocketDestroyed = function () { this.canFire = true; };
    BouncyRocketLauncher.prototype.getTarget = function () { return this.target === gameState.playerB; };
    BouncyRocketLauncher.prototype.spawn = function () {
        if (this.canFire && !this.target.isDead()) {
            var targetDelta = this.target.getCenter().sub(this.getCenter());
            // If Player is out of range or out of line of sight, don't launch anything
            if (targetDelta.length() < BOUNCY_LAUNCHER_RANGE) {
                if (!CollisionDetector.lineOfSightWorld(this.getCenter(), this.target.getCenter(), gameState.world)) {
                    gameState.addEnemy(new BouncyRocket(this.getCenter(), this.target, targetDelta.atan2(), this), this.getCenter());
                    this.canFire = false;
                    return true;
                }
            }
        }
        return false;
    };
    BouncyRocketLauncher.prototype.afterTick = function (seconds) {
        var position = this.getCenter();
        if (!this.target.isDead()) {
            this.bodySprite.angle = (position.sub(this.target.getCenter())).atan2();
        }
        this.bodySprite.offsetBeforeRotation = position;
    };
    BouncyRocketLauncher.prototype.draw = function (c) {
        this.bodySprite.draw(c);
    };
    return BouncyRocketLauncher;
}(SpawningEnemy));
///<reference path="./RotatingEnemy.ts" />
var CORROSION_CLOUD_RADIUS = .5;
var CORROSION_CLOUD_SPEED = .7;
var CORROSION_CLOUD_ACCEL = 10;
// CorrosionCloud.subclasses(RotatingEnemy);
var CorrosionCloud = (function (_super) {
    __extends(CorrosionCloud, _super);
    function CorrosionCloud(center, target) {
        var _this = 
        // RotatingEnemy.prototype.constructor.call(this, ENEMY_CLOUD, center, CORROSION_CLOUD_RADIUS, 0, 0);
        _super.call(this, ENEMY_CLOUD, center, CORROSION_CLOUD_RADIUS, 0, 0) || this;
        _this.target = target;
        _this.smoothedVelocity = new Vector(0, 0);
        return _this;
    }
    CorrosionCloud.prototype.canCollide = function () {
        return false;
    };
    CorrosionCloud.prototype.avoidsSpawn = function () {
        return true;
    };
    CorrosionCloud.prototype.move = function (seconds) {
        var avoidingSpawn = false;
        if (!this.target)
            return new Vector(0, 0);
        var targetDelta = this.target.getCenter().sub(this.getCenter());
        // As long as the max rotation is over 2 pi, it will rotate to face the player no matter what
        this.heading = adjustAngleToTarget(this.heading, targetDelta.atan2(), 7);
        // ACCELERATION
        var speed = CORROSION_CLOUD_SPEED * CORROSION_CLOUD_ACCEL * seconds;
        this.velocity.x += speed * Math.cos(this.heading);
        this.velocity.y += speed * Math.sin(this.heading);
        if (this.velocity.lengthSquared() > (CORROSION_CLOUD_SPEED * CORROSION_CLOUD_SPEED)) {
            this.velocity.normalize();
            this.velocity.inplaceMul(CORROSION_CLOUD_SPEED);
        }
        return this.velocity.mul(seconds);
    };
    CorrosionCloud.prototype.afterTick = function (seconds) {
        var direction = Vector.fromAngle(randInRange(0, 2 * Math.PI));
        var center = this.getCenter().add(direction.mul(randInRange(0, CORROSION_CLOUD_RADIUS)));
        var isRed = (this.target === gameState.playerA) ? 0.4 : 0;
        var isBlue = (this.target === gameState.playerB) ? 0.3 : 0;
        this.smoothedVelocity = this.smoothedVelocity.mul(0.95).add(this.velocity.mul(0.05));
        Particle().position(center).velocity(this.smoothedVelocity.sub(new Vector(0.1, 0.1)), this.smoothedVelocity.add(new Vector(0.1, 0.1))).radius(0.01, 0.1).bounces(0, 4).elasticity(0.05, 0.9).decay(0.01, 0.5).expand(1, 1.2).color(0.2 + isRed, 0.2, 0.2 + isBlue, 1).mixColor(0.1 + isRed, 0.1, 0.1 + isBlue, 1).circle().gravity(-0.4, 0);
    };
    CorrosionCloud.prototype.getTarget = function () {
        return this.target === gameState.playerB;
    };
    CorrosionCloud.prototype.draw = function (c) {
        // do nothing, it's all particles!
    };
    return CorrosionCloud;
}(RotatingEnemy));
///<reference path="./RotatingEnemy.ts" />
var DOOM_MAGNET_RADIUS = .3;
var DOOM_MAGNET_ELASTICITY = 0.5;
var DOOM_MAGNET_RANGE = 10;
var DOOM_MAGNET_ACCEL = 2;
var MAGNET_MAX_ROTATION = 2 * Math.PI;
//DoomMagnet.subclasses(RotatingEnemy);
var DoomMagnet = (function (_super) {
    __extends(DoomMagnet, _super);
    function DoomMagnet(center) {
        var _this = 
        // RotatingEnemy.prototype.constructor.call(this, ENEMY_MAGNET, center, DOOM_MAGNET_RADIUS, 0, DOOM_MAGNET_ELASTICITY);
        _super.call(this, ENEMY_MAGNET, center, DOOM_MAGNET_RADIUS, 0, DOOM_MAGNET_ELASTICITY) || this;
        _this.bodySprite = new Sprite();
        _this.bodySprite.drawGeometry = function (c) {
            var length = 0.15;
            var outerRadius = 0.15;
            var innerRadius = 0.05;
            for (var scale = -1; scale <= 1; scale += 2) {
                c.fillStyle = 'red';
                c.beginPath();
                c.moveTo(-outerRadius - length, scale * innerRadius);
                c.lineTo(-outerRadius - length, scale * outerRadius);
                c.lineTo(-outerRadius - length + (outerRadius - innerRadius), scale * outerRadius);
                c.lineTo(-outerRadius - length + (outerRadius - innerRadius), scale * innerRadius);
                c.fill();
                c.fillStyle = 'blue';
                c.beginPath();
                c.moveTo(outerRadius + length, scale * innerRadius);
                c.lineTo(outerRadius + length, scale * outerRadius);
                c.lineTo(outerRadius + length - (outerRadius - innerRadius), scale * outerRadius);
                c.lineTo(outerRadius + length - (outerRadius - innerRadius), scale * innerRadius);
                c.fill();
            }
            c.strokeStyle = 'black';
            // draw one prong of the magnet 
            c.beginPath();
            c.arc(outerRadius, 0, outerRadius, 1.5 * Math.PI, 0.5 * Math.PI, true);
            c.lineTo(outerRadius + length, outerRadius);
            c.lineTo(outerRadius + length, innerRadius);
            c.arc(outerRadius, 0, innerRadius, 0.5 * Math.PI, 1.5 * Math.PI, false);
            c.lineTo(outerRadius + length, -innerRadius);
            c.lineTo(outerRadius + length, -outerRadius);
            c.lineTo(outerRadius, -outerRadius);
            c.stroke();
            // other prong
            c.beginPath();
            c.arc(-outerRadius, 0, outerRadius, 1.5 * Math.PI, 2.5 * Math.PI, false);
            c.lineTo(-outerRadius - length, outerRadius);
            c.lineTo(-outerRadius - length, innerRadius);
            c.arc(-outerRadius, 0, innerRadius, 2.5 * Math.PI, 1.5 * Math.PI, true);
            c.lineTo(-outerRadius - length, -innerRadius);
            c.lineTo(-outerRadius - length, -outerRadius);
            c.lineTo(-outerRadius, -outerRadius);
            c.stroke();
        };
        return _this;
    }
    DoomMagnet.prototype.avoidsSpawn = function () {
        return true;
    };
    DoomMagnet.prototype.calcHeadingVector = function (target) {
        if (target.isDead())
            return new Vector(0, 0);
        var delta = target.getCenter().sub(this.getCenter());
        if (delta.lengthSquared() > (DOOM_MAGNET_RANGE * DOOM_MAGNET_RANGE))
            return new Vector(0, 0);
        delta.normalize();
        return delta;
    };
    DoomMagnet.prototype.move = function (seconds) {
        var playerA = gameState.playerA;
        var playerB = gameState.playerB;
        var headingA = this.calcHeadingVector(playerA);
        var headingB = this.calcHeadingVector(playerB);
        var heading = (headingA.add(headingB)).mul(DOOM_MAGNET_ACCEL);
        var delta = this.accelerate(heading, seconds);
        // Time independent version of mulitiplying by 0.994
        this.velocity.inplaceMul(Math.pow(0.547821, seconds));
        var center = this.getCenter();
        var oldAngle = this.bodySprite.angle;
        var targetAngle = oldAngle;
        if (!playerA.isDead() && playerB.isDead()) {
            targetAngle = (playerA.getCenter().sub(center)).atan2() + Math.PI;
        }
        else if (playerA.isDead() && !playerB.isDead()) {
            targetAngle = (playerB.getCenter().sub(center)).atan2();
        }
        else if (!playerA.isDead() && !playerB.isDead()) {
            var needsFlip = (playerA.getCenter().sub(center).flip().dot(playerB.getCenter().sub(center)) < 0);
            targetAngle = heading.atan2() - Math.PI * 0.5 + Math.PI * needsFlip;
        }
        this.bodySprite.angle = adjustAngleToTarget(oldAngle, targetAngle, MAGNET_MAX_ROTATION * seconds);
        return delta;
    };
    DoomMagnet.prototype.afterTick = function (seconds) {
        var position = this.getCenter();
        this.bodySprite.offsetBeforeRotation = new Vector(position.x, position.y);
    };
    DoomMagnet.prototype.draw = function (c) {
        this.bodySprite.draw(c);
    };
    return DoomMagnet;
}(RotatingEnemy));
///<reference path="./Enemy.ts" />
// enum
var DOORBELL_OPEN = 0;
var DOORBELL_CLOSE = 1;
var DOORBELL_TOGGLE = 2;
// Must be wider and taller than the player to avoid double toggling 
var DOORBELL_WIDTH = 0.40;
// PLAYER_HEIGHT + .01
var DOORBELL_HEIGHT = 0.76;
var DOORBELL_RADIUS = 0.11;
var DOORBELL_SLICES = 3;
//Doorbell.subclasses(Enemy);
var Doorbell = (function (_super) {
    __extends(Doorbell, _super);
    function Doorbell(center, behavior, visible) {
        var _this = 
        //Enemy.prototype.constructor.call(this, ENEMY_DOORBELL, 1);
        _super.call(this, ENEMY_DOORBELL, 1) || this;
        _this.hitBox = AABB.makeAABB(center, DOORBELL_WIDTH, DOORBELL_HEIGHT);
        _this.rotationPercent = 1;
        _this.restingAngle = randInRange(0, 2 * Math.PI);
        _this.behavior = behavior;
        _this.visible = visible;
        _this.triggeredLastTick = false;
        _this.triggeredThisTick = false;
        _this.doors = [];
        return _this;
    }
    Doorbell.prototype.getShape = function () { return this.hitBox; };
    Doorbell.prototype.addDoor = function (doorIndex) { this.doors.push(doorIndex); };
    Doorbell.prototype.canCollide = function () { return false; };
    Doorbell.prototype.tick = function (seconds) {
        this.rotationPercent += seconds;
        if (this.rotationPercent > 1) {
            this.rotationPercent = 1;
        }
        this.triggeredThisTick = false;
        Enemy.prototype.tick.call(this, seconds);
        this.triggeredLastTick = this.triggeredThisTick;
    };
    Doorbell.prototype.reactToPlayer = function (player) {
        this.triggeredThisTick = true;
        if (this.triggeredLastTick) {
            return;
        }
        for (var i = 0; i < this.doors.length; ++i) {
            gameState.getDoor(this.doors[i]).act(this.behavior, false, true);
        }
        for (var i = 0; i < 50; ++i) {
            var rotationAngle = randInRange(0, 2 * Math.PI);
            var direction = Vector.fromAngle(rotationAngle).mul(randInRange(3, 5));
            Particle().position(this.getCenter()).velocity(direction).angle(rotationAngle).radius(0.05).bounces(3).elasticity(0.5).decay(0.01).line().color(1, 1, 1, 1);
        }
        this.rotationPercent = 0;
    };
    Doorbell.prototype.draw = function (c) {
        if (this.visible) {
            var pos = this.getCenter();
            var startingAngle = this.restingAngle + (2 * Math.PI / 3) / (this.rotationPercent + 0.1);
            c.fillStyle = 'white';
            c.strokeStyle = 'black';
            c.beginPath();
            c.arc(pos.x, pos.y, DOORBELL_RADIUS, 0, 2 * Math.PI, false);
            c.fill();
            c.stroke();
            c.beginPath();
            for (var i = 0; i < DOORBELL_SLICES; ++i) {
                c.moveTo(pos.x, pos.y);
                var nextPos = pos.add(Vector.fromAngle(startingAngle + (i - 0.5) * (2 * Math.PI / DOORBELL_SLICES)).mul(DOORBELL_RADIUS));
                c.lineTo(nextPos.x, nextPos.y);
            }
            c.stroke();
        }
    };
    return Doorbell;
}(Enemy));
///<reference path="./Enemy.ts" />
var GOLDEN_COG_RADIUS = 0.25;
//GoldenCog.subclasses(Enemy);
var GoldenCog = (function (_super) {
    __extends(GoldenCog, _super);
    function GoldenCog(center) {
        var _this = 
        //Enemy.prototype.constructor.call(this, -1, 0);
        _super.call(this, -1, 0) || this;
        _this.timeSinceStart = 0;
        _this.hitCircle = new Circle(center, GOLDEN_COG_RADIUS);
        _this.timeSinceStart = 0;
        gameState.incrementStat(STAT_NUM_COGS);
        return _this;
    }
    GoldenCog.prototype.getShape = function () {
        return this.hitCircle;
    };
    GoldenCog.prototype.reactToPlayer = function (player) {
        this.setDead(true);
    };
    GoldenCog.prototype.onDeath = function () {
        if (gameState.gameStatus === GAME_IN_PLAY) {
            gameState.incrementStat(STAT_COGS_COLLECTED);
        }
        // Golden particle goodness
        var position = this.getCenter();
        for (var i = 0; i < 100; ++i) {
            var direction = Vector.fromAngle(randInRange(0, 2 * Math.PI));
            direction = this.velocity.add(direction.mul(randInRange(1, 5)));
            Particle().position(position).velocity(direction).radius(0.01, 1.5).bounces(0, 4).elasticity(0.05, 0.9).decay(0.01, 0.5).color(0.9, 0.87, 0, 1).mixColor(1, 0.96, 0, 1).triangle();
        }
    };
    GoldenCog.prototype.afterTick = function (seconds) {
        this.timeSinceStart += seconds;
    };
    GoldenCog.prototype.draw = function (c) {
        var position = this.getCenter();
        drawGoldenCog(c, position.x, position.y, this.timeSinceStart);
    };
    return GoldenCog;
}(Enemy));
///<reference path="./FreefallEnemy.ts" />
var GRENADE_LIFETIME = 5;
var GRENADE_RADIUS = 0.2;
var GRENADE_ELASTICITY = 0.5;
//Grenade.subclasses(FreefallEnemy);
var Grenade = (function (_super) {
    __extends(Grenade, _super);
    function Grenade(center, direction, speed) {
        var _this = 
        //FreefallEnemy.prototype.constructor.call(this, ENEMY_GRENADE, center, GRENADE_RADIUS, GRENADE_ELASTICITY);
        _super.call(this, ENEMY_GRENADE, center, GRENADE_RADIUS, GRENADE_ELASTICITY) || this;
        _this.timeUntilExplodes = GRENADE_LIFETIME;
        _this.velocity = new Vector(speed * Math.cos(direction), speed * Math.sin(direction));
        _this.timeUntilExplodes = GRENADE_LIFETIME;
        return _this;
    }
    Grenade.prototype.draw = function (c) {
        var position = this.getShape().getCenter();
        var percentUntilExplodes = this.timeUntilExplodes / GRENADE_LIFETIME;
        // draw the expanding dot in the center
        c.fillStyle = 'black';
        c.beginPath();
        c.arc(position.x, position.y, (1 - percentUntilExplodes) * GRENADE_RADIUS, 0, Math.PI * 2, false);
        c.fill();
        // draw the rim
        c.strokeStyle = 'black';
        c.beginPath();
        c.arc(position.x, position.y, GRENADE_RADIUS, 0, Math.PI * 2, false);
        c.stroke();
    };
    // Grenades have a Tick that counts until their explosion
    Grenade.prototype.tick = function (seconds) {
        this.timeUntilExplodes -= seconds;
        if (this.timeUntilExplodes <= 0) {
            this.setDead(true);
        }
        FreefallEnemy.prototype.tick.call(this, seconds);
    };
    // Grenades bounce around, and are not destroyed by edges like other FreefallEnemies
    Grenade.prototype.reactToWorld = function (contact) {
    };
    Grenade.prototype.onDeath = function () {
        var position = this.getCenter();
        // fire
        for (var i = 0; i < 100; i++) {
            var direction = Vector.fromAngle(randInRange(0, 2 * Math.PI)).mul(randInRange(1, 10));
            Particle().position(position).velocity(direction).radius(0.1, 0.2).bounces(0, 4).elasticity(0.05, 0.9).decay(0.0001, 0.001).expand(1, 1.2).color(1, 0.25, 0, 1).mixColor(1, 0.5, 0, 1).triangle();
        }
        // smoke
        for (var i = 0; i < 50; i++) {
            var direction = Vector.fromAngle(randInRange(0, 2 * Math.PI));
            direction = new Vector(0, 1).add(direction.mul(randInRange(0.25, 1)));
            Particle().position(position).velocity(direction).radius(0.1, 0.2).bounces(1, 3).elasticity(0.05, 0.9).decay(0.0005, 0.1).expand(1.1, 1.3).color(0, 0, 0, 1).mixColor(0.5, 0.5, 0.5, 1).circle().gravity(-0.4, 0);
        }
    };
    return Grenade;
}(FreefallEnemy));
///<reference path="./SpawningEnemy.ts" />
var GRENADIER_WIDTH = .5;
var GRENADIER_HEIGHT = .5;
// Max speed at which a Grenadier can throw an enemy
var GRENADIER_RANGE = 8;
var GRENADIER_SHOOT_FREQ = 1.2;
// Grenadier.subclasses(SpawningEnemy);
var Grenadier = (function (_super) {
    __extends(Grenadier, _super);
    function Grenadier(center, target) {
        var _this = 
        // SpawningEnemy.prototype.constructor.call(this, ENEMY_GRENADIER, center, GRENADIER_WIDTH, GRENADIER_HEIGHT, 0, GRENADIER_SHOOT_FREQ, randInRange(0, GRENADIER_SHOOT_FREQ));
        _super.call(this, ENEMY_GRENADIER, center, GRENADIER_WIDTH, GRENADIER_HEIGHT, 0, GRENADIER_SHOOT_FREQ, randInRange(0, GRENADIER_SHOOT_FREQ)) || this;
        _this.target = target;
        _this.actualRecoilDistance = 0;
        _this.targetRecoilDistance = 0;
        _this.bodySprite = new Sprite();
        // this.target = target;
        //this.actualRecoilDistance = 0;
        //this.targetRecoilDistance = 0;
        //this.bodySprite = new Sprite();
        _this.bodySprite.drawGeometry = function (c) {
            var barrelLength = 0.25;
            var outerRadius = 0.25;
            var innerRadius = 0.175;
            c.beginPath();
            c.moveTo(-outerRadius, -barrelLength);
            c.lineTo(-innerRadius, -barrelLength);
            c.lineTo(-innerRadius, -0.02);
            c.lineTo(0, innerRadius);
            c.lineTo(innerRadius, -0.02);
            c.lineTo(innerRadius, -barrelLength);
            c.lineTo(outerRadius, -barrelLength);
            c.lineTo(outerRadius, 0);
            c.lineTo(0, outerRadius + 0.02);
            c.lineTo(-outerRadius, 0);
            c.closePath();
            c.fill();
            c.stroke();
        };
        return _this;
    }
    Grenadier.prototype.getTarget = function () {
        return this.target === gameState.GetPlayerB();
    };
    Grenadier.prototype.setTarget = function (player) {
        this.target = player;
    };
    Grenadier.prototype.canCollide = function () {
        return false;
    };
    Grenadier.prototype.spawn = function () {
        var targetDelta = this.target.getCenter().add(new Vector(0, 3)).sub(this.getCenter());
        var direction = targetDelta.atan2();
        var distance = targetDelta.length();
        // If Player is out of range or out of line of sight, don't throw anything
        if (!this.target.isDead() && distance < GRENADIER_RANGE) {
            if (!CollisionDetector.lineOfSightWorld(this.getCenter(), this.target.getCenter(), gameState.world)) {
                this.targetRecoilDistance = distance * (0.6 / GRENADIER_RANGE);
                gameState.addEnemy(new Grenade(this.getCenter(), direction, targetDelta.length()), this.getCenter());
                return true;
            }
        }
        return false;
    };
    Grenadier.prototype.afterTick = function (seconds) {
        var position = this.getCenter();
        if (!this.target.isDead()) {
            this.bodySprite.angle = this.target.getCenter().add(new Vector(0, 3)).sub(position).atan2() + Math.PI / 2;
        }
        this.bodySprite.offsetBeforeRotation = position;
        if (this.actualRecoilDistance < this.targetRecoilDistance) {
            this.actualRecoilDistance += 5 * seconds;
            if (this.actualRecoilDistance >= this.targetRecoilDistance) {
                this.actualRecoilDistance = this.targetRecoilDistance;
                this.targetRecoilDistance = 0;
            }
        }
        else {
            this.actualRecoilDistance -= 0.5 * seconds;
            if (this.actualRecoilDistance <= 0) {
                this.actualRecoilDistance = 0;
            }
        }
        this.bodySprite.offsetAfterRotation = new Vector(0, this.actualRecoilDistance);
    };
    Grenadier.prototype.draw = function (c) {
        c.fillStyle = (this.target == gameState.playerA) ? 'red' : 'blue';
        c.strokeStyle = 'black';
        this.bodySprite.draw(c);
    };
    return Grenadier;
}(SpawningEnemy));
///<reference path="./Enemy.ts" />
//HoveringEnemy.subclasses(Enemy);
var HoveringEnemy = (function (_super) {
    __extends(HoveringEnemy, _super);
    function HoveringEnemy(type, center, radius, elasticity) {
        var _this = 
        // Enemy.prototype.constructor.call(this, type, elasticity);
        _super.call(this, type, elasticity) || this;
        _this.hitCircle = new Circle(center, radius);
        return _this;
    }
    HoveringEnemy.prototype.getShape = function () {
        return this.hitCircle;
    };
    return HoveringEnemy;
}(Enemy));
///<reference path="./HoveringEnemy.ts" />
var HEADACHE_RADIUS = .15;
var HEADACHE_ELASTICITY = 0;
var HEADACHE_SPEED = 3;
var HEADACHE_RANGE = 6;
var HEADACHE_CLOUD_RADIUS = HEADACHE_RADIUS * 0.5;
var HeadacheChain = (function () {
    function HeadacheChain(center) {
        this.points = [];
        this.point = new Vector(center.x * gameScale, center.y * gameScale);
        this.point.x += (Math.random() - 0.5) * HEADACHE_RADIUS;
        this.point.y += (Math.random() - 0.5) * HEADACHE_RADIUS;
        this.angle = Math.random() * Math.PI * 2;
    }
    HeadacheChain.prototype.tick = function (seconds, center) {
        var speed = 600;
        var dx = this.point.x - center.x * gameScale;
        var dy = this.point.y - center.y * gameScale;
        var percentFromCenter = Math.min(1, Math.sqrt(dx * dx + dy * dy) / HEADACHE_CLOUD_RADIUS);
        var angleFromCenter = Math.atan2(dy, dx) - this.angle;
        while (angleFromCenter < -Math.PI)
            angleFromCenter += Math.PI * 2;
        while (angleFromCenter > Math.PI)
            angleFromCenter -= Math.PI * 2;
        var percentHeading = (Math.PI - Math.abs(angleFromCenter)) / Math.PI;
        var randomOffset = speed * (Math.random() - 0.5) * seconds;
        this.angle += randomOffset * (1 - percentFromCenter * 0.8) + percentHeading * percentFromCenter * (angleFromCenter > 0 ? -2 : 2);
        this.angle -= Math.floor(this.angle / (Math.PI * 2)) * Math.PI * 2;
        this.point.x += speed * Math.cos(this.angle) * seconds;
        this.point.y += speed * Math.sin(this.angle) * seconds;
        this.points.push(new Vector(this.point.x, this.point.y));
        if (this.points.length > 15)
            this.points.shift();
    };
    HeadacheChain.prototype.draw = function (c) {
        for (var i = 1; i < this.points.length; i++) {
            var a = this.points[i - 1];
            var b = this.points[i];
            c.strokeStyle = 'rgba(0, 0, 0, ' + (i / this.points.length).toFixed(3) + ')';
            c.beginPath();
            c.moveTo(a.x / gameScale, a.y / gameScale);
            c.lineTo(b.x / gameScale, b.y / gameScale);
            c.stroke();
        }
    };
    return HeadacheChain;
}());
// Headache.subclasses(HoveringEnemy);
var Headache = (function (_super) {
    __extends(Headache, _super);
    function Headache(center, target) {
        var _this = 
        // HoveringEnemy.prototype.constructor.call(this, ENEMY_HEADACHE, center, HEADACHE_RADIUS, HEADACHE_ELASTICITY);
        _super.call(this, ENEMY_HEADACHE, center, HEADACHE_RADIUS, HEADACHE_ELASTICITY) || this;
        _this.target = target;
        _this.isAttached = false;
        _this.isTracking = false;
        _this.restingOffset = new Vector(0, -10);
        _this.chains = [];
        for (var i = 0; i < 4; i++) {
            _this.chains.push(new HeadacheChain(center));
        }
        return _this;
    }
    Headache.prototype.move = function (seconds) {
        this.isTracking = false;
        // If the headache isn't yet attached to a Player
        if (!this.isAttached) {
            if (this.target.isDead())
                return new Vector(0, 0);
            var delta = this.target.getCenter().sub(this.getCenter());
            if (delta.lengthSquared() < (HEADACHE_RANGE * HEADACHE_RANGE) && !CollisionDetector.lineOfSightWorld(this.getCenter(), this.target.getCenter(), gameState.world)) {
                // Seeks the top of the Player, not the center
                delta.y += 0.45;
                // Multiply be 3 so it attaches more easily if its close to a player
                if (delta.lengthSquared() > (HEADACHE_SPEED * seconds * HEADACHE_SPEED * seconds * 3)) {
                    this.isTracking = true;
                    delta.normalize();
                    delta = delta.mul(HEADACHE_SPEED * seconds);
                }
                else {
                    this.isAttached = true;
                }
                return delta;
            }
        }
        else {
            // If a headache is attached to a dead player, it vanishes
            if (this.target.isDead()) {
                this.setDead(true);
            }
            // Otherwise it moves with the player
            var delta = this.target.getCenter().add(new Vector(0, 0.45)).sub(this.getCenter());
            // If player is crouching, adjust position
            if (this.target.getCrouch() && this.target.isOnFloor()) {
                delta.y -= 0.25;
                if (this.target.facingRight)
                    delta.x += 0.15;
                else
                    delta.x -= 0.15;
            }
            this.hitCircle.moveBy(delta);
        }
        return new Vector(0, 0);
    };
    Headache.prototype.reactToWorld = function () {
        // Nothing happens
    };
    Headache.prototype.onDeath = function () {
        gameState.incrementStat(STAT_ENEMY_DEATHS);
        var position = this.getCenter();
        // body
        var direction = Vector.fromAngle(randInRange(0, 2 * Math.PI)).mul(randInRange(0, 0.05));
        var body = Particle().position(position).velocity(direction).radius(HEADACHE_RADIUS).bounces(3).elasticity(0.5).decay(0.01).circle().gravity(5);
        if (this.target == gameState.playerA) {
            body.color(1, 0, 0, 1);
        }
        else {
            body.color(0, 0, 1, 1);
        }
        // black lines out from body
        for (var i = 0; i < 50; ++i) {
            var rotationAngle = randInRange(0, 2 * Math.PI);
            var direction = Vector.fromAngle(rotationAngle).mul(randInRange(3, 5));
            Particle().position(this.getCenter()).velocity(direction).angle(rotationAngle).radius(0.05).bounces(3).elasticity(0.5).decay(0.01).line().color(0, 0, 0, 1);
        }
    };
    Headache.prototype.reactToPlayer = function (player) {
        if (player === this.target) {
            player.disableJump();
        }
        else if (player.getVelocity().y < 0 && player.getCenter().y > this.getCenter().y) {
            // The other player must jump on the headache from above to kill it
            this.setDead(true);
        }
    };
    Headache.prototype.getTarget = function () {
        return this.target === gameState.playerB;
    };
    Headache.prototype.afterTick = function (seconds) {
        var center = this.getCenter();
        for (var i = 0; i < this.chains.length; i++) {
            this.chains[i].tick(seconds, center);
        }
    };
    Headache.prototype.draw = function (c) {
        var center = this.getCenter();
        c.strokeStyle = 'black';
        for (var i = 0; i < this.chains.length; i++) {
            this.chains[i].draw(c);
        }
        c.fillStyle = (this.target == gameState.playerA) ? 'red' : 'blue';
        c.beginPath();
        c.arc(center.x, center.y, HEADACHE_RADIUS * 0.75, 0, Math.PI * 2, false);
        c.fill();
        c.stroke();
    };
    return Headache;
}(HoveringEnemy));
///<reference path="./Enemy.ts" />
var HELP_SIGN_TEXT_WIDTH = 1.5;
var HELP_SIGN_WIDTH = 0.76;
var HELP_SIGN_HEIGHT = 0.76;
//HelpSign.subclasses(Enemy);
var HelpSign = (function (_super) {
    __extends(HelpSign, _super);
    function HelpSign(center, text, width) {
        var _this = 
        // Enemy.prototype.constructor.call(this, ENEMY_HELP_SIGN, 0);
        _super.call(this, ENEMY_HELP_SIGN, 0) || this;
        _this.hitBox = AABB.makeAABB(center, HELP_SIGN_WIDTH, HELP_SIGN_HEIGHT);
        _this.textArray = null;
        _this.text = text;
        _this.drawText = false;
        _this.timeSinceStart = 0;
        if (width === undefined) {
            _this.textWidth = HELP_SIGN_TEXT_WIDTH;
        }
        else {
            _this.textWidth = width;
        }
        return _this;
    }
    // Private helper
    // Splits up a string into an array of phrases based on the width of the sign
    HelpSign.prototype.splitUpText = function (c, phrase) {
        var words = phrase.split(" ");
        var phraseArray = new Array();
        var lastPhrase = "";
        c.font = "12px sans serif";
        var maxWidth = this.textWidth * gameScale;
        var measure = 0;
        for (var i = 0; i < words.length; ++i) {
            var word = words[i];
            measure = c.measureText(lastPhrase + word).width;
            if (measure < maxWidth) {
                lastPhrase += " " + word;
            }
            else {
                if (lastPhrase.length > 0)
                    phraseArray.push(lastPhrase);
                lastPhrase = word;
            }
            if (i == words.length - 1) {
                phraseArray.push(lastPhrase);
                break;
            }
        }
        return phraseArray;
    };
    HelpSign.prototype.getShape = function () { return this.hitBox; };
    HelpSign.prototype.canCollide = function () { return false; };
    HelpSign.prototype.tick = function (seconds) {
        this.timeSinceStart += seconds;
        this.drawText = false;
        //Enemy.prototype.tick.call(this, seconds);
        _super.prototype.tick.call(this, seconds);
    };
    HelpSign.prototype.reactToPlayer = function (player) {
        this.drawText = true;
    };
    HelpSign.prototype.draw = function (c) {
        // split up the text into an array the first call
        if (this.textArray === null) {
            this.textArray = this.splitUpText(c, this.text);
        }
        var pos = this.getCenter();
        c.save();
        c.textAlign = "center";
        c.scale(1 / gameScale, -1 / gameScale);
        c.save();
        // Draw the sprite
        c.font = "bold 34px sans-serif";
        c.lineWidth = 1;
        c.fillStyle = "yellow";
        c.strokeStyle = "black";
        c.translate(pos.x * gameScale, -pos.y * gameScale + 12);
        var timeFloor = Math.floor(this.timeSinceStart);
        /* 2 second period version
        var scale = this.timeSinceStart;
        if (timeFloor % 2 === 0) {
            scale -= timeFloor;
        } else {
            scale -= 1 + timeFloor;
        }
        scale = Math.cos(scale * Math.PI) / 9 + 1; */
        var scaleFactor = this.timeSinceStart - timeFloor;
        scaleFactor = Math.cos(scaleFactor * 2 * Math.PI) / 16 + 1;
        // Convert from 0-2 to 1 - 1/16 to 1 + 1/16
        c.scale(scaleFactor, scaleFactor);
        c.fillText("?", 0, 0);
        c.strokeText("?", 0, 0);
        c.restore();
        // Draw the text in a text box
        if (this.drawText) {
            var fontSize = 13;
            var xCenter = pos.x * gameScale;
            var yCenter = -(pos.y + 0.5) * gameScale - (fontSize + 2) * this.textArray.length / 2;
            drawTextBox(c, this.textArray, xCenter, yCenter, fontSize);
        }
        c.restore();
    };
    return HelpSign;
}(Enemy));
///<reference path="./RotatingEnemy.ts" />
var HUNTER_BODY = 0;
var HUNTER_CLAW1 = 1;
var HUNTER_CLAW2 = 2;
var HUNTER_RADIUS = 0.3;
var HUNTER_ELASTICITY = 0.4;
var HUNTER_CHASE_ACCEL = 14;
var HUNTER_FLEE_ACCEL = 3;
var HUNTER_FLEE_RANGE = 10;
var HUNTER_CHASE_RANGE = 8;
var HUNTER_LOOKAHEAD = 20;
var STATE_IDLE = 0;
var STATE_RED = 1;
var STATE_BLUE = 2;
var STATE_BOTH = 3;
// Hunter.subclasses(RotatingEnemy);
var Hunter = (function (_super) {
    __extends(Hunter, _super);
    function Hunter(center) {
        var _this = 
        //RotatingEnemy.prototype.constructor.call(this, ENEMY_HUNTER, center, HUNTER_RADIUS, 0, HUNTER_ELASTICITY);
        _super.call(this, ENEMY_HUNTER, center, HUNTER_RADIUS, 0, HUNTER_ELASTICITY) || this;
        _this.state = STATE_IDLE;
        _this.acceleration = new Vector(0, 0);
        _this.jawAngle = 0;
        _this.sprites = [new Sprite(), new Sprite(), new Sprite()];
        _this.state = STATE_IDLE;
        _this.acceleration = new Vector(0, 0);
        _this.jawAngle = 0;
        _this.sprites = [new Sprite(), new Sprite(), new Sprite()];
        _this.sprites[HUNTER_BODY].drawGeometry = function (c) {
            c.beginPath();
            c.arc(0, 0, 0.1, 0, 2 * Math.PI, false);
            c.stroke();
        };
        _this.sprites[HUNTER_CLAW1].drawGeometry = _this.sprites[HUNTER_CLAW2].drawGeometry = function (c) {
            c.beginPath();
            c.moveTo(0, 0.1);
            for (var i = 0; i <= 6; i++)
                c.lineTo((i & 1) / 24, 0.2 + i * 0.05);
            c.arc(0, 0.2, 0.3, 0.5 * Math.PI, -0.5 * Math.PI, true);
            c.stroke();
        };
        _this.sprites[HUNTER_CLAW1].setParent(_this.sprites[HUNTER_BODY]);
        _this.sprites[HUNTER_CLAW2].setParent(_this.sprites[HUNTER_BODY]);
        _this.sprites[HUNTER_CLAW2].flip = true;
        _this.sprites[HUNTER_BODY].offsetAfterRotation = new Vector(0, -0.2);
        return _this;
    }
    Hunter.prototype.avoidsSpawn = function () { return true; };
    ;
    Hunter.prototype.calcAcceleration = function (target) {
        return target.unit().sub(this.velocity.mul(3.0 / HUNTER_CHASE_ACCEL)).unit().mul(HUNTER_CHASE_ACCEL);
    };
    Hunter.prototype.playerInSight = function (target, distanceSquared) {
        if (target.isDead())
            return false;
        var inSight = distanceSquared < (HUNTER_CHASE_RANGE * HUNTER_CHASE_RANGE);
        inSight &= !CollisionDetector.lineOfSightWorld(this.getCenter(), target.getCenter(), gameState.world);
        return inSight;
    };
    Hunter.prototype.move = function (seconds) {
        // Relative player positions
        var deltaA = gameState.playerA.getCenter().sub(this.getCenter());
        var deltaB = gameState.playerB.getCenter().sub(this.getCenter());
        // Projection positions with lookahead
        var projectedA = deltaA.add(gameState.playerA.getVelocity().mul(HUNTER_LOOKAHEAD * seconds));
        var projectedB = deltaB.add(gameState.playerB.getVelocity().mul(HUNTER_LOOKAHEAD * seconds));
        // Squared distances
        var distASquared = deltaA.lengthSquared();
        var distBSquared = deltaB.lengthSquared();
        // Checks if players are in sight
        var inSightA = this.playerInSight(gameState.playerA, distASquared);
        var inSightB = this.playerInSight(gameState.playerB, distBSquared);
        // If player A is in sight
        if (inSightA) {
            // If both in sight
            if (inSightB) {
                // If they're on the same side of the Hunter, the Hunter will flee
                if ((deltaA.dot(this.velocity) * deltaB.dot(this.velocity)) >= 0) {
                    this.acceleration = deltaA.unit().add(deltaB.unit()).mul(-.5 * HUNTER_FLEE_ACCEL);
                    this.target = null;
                    this.state = STATE_BOTH;
                }
                else if (distASquared < distBSquared) {
                    // Otherwise the hunter will chase after the closer of the two players
                    this.acceleration = this.calcAcceleration(projectedA);
                    this.target = gameState.playerA;
                    this.state = STATE_RED;
                }
                else {
                    this.acceleration = this.calcAcceleration(projectedB);
                    this.target = gameState.playerB;
                    this.state = STATE_BLUE;
                }
            }
            else {
                this.acceleration = this.calcAcceleration(projectedA);
                this.target = gameState.playerA;
                this.state = STATE_RED;
            }
        }
        else if (inSightB) {
            // If only player B in sight
            this.acceleration = this.calcAcceleration(projectedB);
            this.target = gameState.playerB;
            this.state = STATE_BLUE;
        }
        else {
            this.acceleration.x = this.acceleration.y = 0;
            this.target = null;
            this.state = STATE_IDLE;
        }
        // Damp the movement so it doesn't keep floating around
        // Time independent version of multiplying by 0.99
        this.velocity.inplaceMul(Math.pow(0.366032, seconds));
        return this.accelerate(this.acceleration, seconds);
    };
    Hunter.prototype.afterTick = function (seconds) {
        var position = this.getCenter();
        this.sprites[HUNTER_BODY].offsetBeforeRotation = position;
        if (this.target) {
            var currentAngle = this.sprites[HUNTER_BODY].angle;
            var targetAngle = this.target.getCenter().sub(position).atan2() - Math.PI / 2;
            this.sprites[HUNTER_BODY].angle = adjustAngleToTarget(currentAngle, targetAngle, Math.PI * seconds);
        }
        var targetJawAngle = this.target ? -0.2 : 0;
        this.jawAngle = adjustAngleToTarget(this.jawAngle, targetJawAngle, 0.4 * seconds);
        this.sprites[HUNTER_CLAW1].angle = this.jawAngle;
        this.sprites[HUNTER_CLAW2].angle = this.jawAngle;
    };
    Hunter.prototype.draw = function (c) {
        c.fillStyle = (this.target == gameState.playerA) ? 'red' : 'blue';
        c.strokeStyle = 'black';
        if (this.state != STATE_IDLE) {
            var angle = this.sprites[HUNTER_BODY].angle + Math.PI / 2;
            var fromEye = Vector.fromAngle(angle);
            var eye = this.getCenter().sub(fromEye.mul(0.2));
            if (this.state == STATE_RED) {
                c.fillStyle = 'red';
                c.beginPath();
                c.arc(eye.x, eye.y, 0.1, 0, 2 * Math.PI, false);
                c.fill();
            }
            else if (this.state == STATE_BLUE) {
                c.fillStyle = 'blue';
                c.beginPath();
                c.arc(eye.x, eye.y, 0.1, 0, 2 * Math.PI, false);
                c.fill();
            }
            else {
                c.fillStyle = 'red';
                c.beginPath();
                c.arc(eye.x, eye.y, 0.1, angle, angle + Math.PI, false);
                c.fill();
                c.fillStyle = 'blue';
                c.beginPath();
                c.arc(eye.x, eye.y, 0.1, angle + Math.PI, angle + 2 * Math.PI, false);
                c.fill();
                c.beginPath();
                c.moveTo(eye.x - fromEye.x * 0.1, eye.y - fromEye.y * 0.1);
                c.lineTo(eye.x + fromEye.x * 0.1, eye.y + fromEye.y * 0.1);
                c.stroke();
            }
        }
        this.sprites[HUNTER_BODY].draw(c);
    };
    return Hunter;
}(RotatingEnemy));
///<reference path="./SpawningEnemy.ts" />
var JET_STREAM_WIDTH = 0.4;
var JET_STREAM_HEIGHT = 0.4;
var JET_STREAM_SHOOT_FREQ = 0.2;
var NUM_BARRELS = 3;
var JET_STREAM_SPRITE_A = 0;
var JET_STREAM_SPRITE_B = 1;
// JetStream.subclasses(SpawningEnemy);
var JetStream = (function (_super) {
    __extends(JetStream, _super);
    function JetStream(center, direction) {
        var _this = 
        //SpawningEnemy.prototype.constructor.call(this, ENEMY_JET_STREAM, center, JET_STREAM_WIDTH, JET_STREAM_HEIGHT, 0, JET_STREAM_SHOOT_FREQ, 0);
        _super.call(this, ENEMY_JET_STREAM, center, JET_STREAM_WIDTH, JET_STREAM_HEIGHT, 0, JET_STREAM_SHOOT_FREQ, 0) || this;
        _this.direction = direction;
        _this.reloadAnimation = 0;
        _this.sprites = [new Sprite(), new Sprite()];
        _this.sprites[JET_STREAM_SPRITE_A].drawGeometry = _this.sprites[JET_STREAM_SPRITE_B].drawGeometry = function (c) {
            c.strokeStyle = 'black';
            c.beginPath();
            for (var i = 0; i < NUM_BARRELS; i++) {
                var angle = i * (2 * Math.PI / NUM_BARRELS);
                c.moveTo(0, 0);
                c.lineTo(0.2 * Math.cos(angle), 0.2 * Math.sin(angle));
            }
            c.stroke();
        };
        return _this;
    }
    JetStream.prototype.canCollide = function () { return false; };
    JetStream.prototype.spawn = function () {
        gameState.addEnemy(new RiotBullet(this.getCenter(), this.direction), this.getCenter());
        return true;
    };
    JetStream.prototype.afterTick = function (seconds) {
        this.reloadAnimation += seconds * (0.5 / JET_STREAM_SHOOT_FREQ);
        var angle = this.reloadAnimation * (2 * Math.PI / NUM_BARRELS);
        var targetAngle = this.direction - Math.PI / 2;
        var bodyOffset = Vector.fromAngle(targetAngle).mul(0.2);
        var position = this.getCenter();
        this.sprites[JET_STREAM_SPRITE_A].angle = targetAngle + angle;
        this.sprites[JET_STREAM_SPRITE_B].angle = targetAngle - angle;
        this.sprites[JET_STREAM_SPRITE_A].offsetBeforeRotation = position.sub(bodyOffset);
        this.sprites[JET_STREAM_SPRITE_B].offsetBeforeRotation = position.add(bodyOffset);
        // adjust for even NUM_BARRELS
        if (!(NUM_BARRELS & 1))
            this.sprites[JET_STREAM_SPRITE_B].angle += Math.PI / NUM_BARRELS;
    };
    JetStream.prototype.draw = function (c) {
        this.sprites[JET_STREAM_SPRITE_A].draw(c);
        this.sprites[JET_STREAM_SPRITE_B].draw(c);
        var angle = this.reloadAnimation * (2 * Math.PI / NUM_BARRELS);
        var targetAngle = this.direction - Math.PI / 2;
        var position = this.getCenter();
        var bodyOffset = Vector.fromAngle(targetAngle).mul(0.2);
        c.fillStyle = 'yellow';
        c.strokeStyle = 'black';
        for (var side = -1; side <= 1; side += 2) {
            for (var i = 0; i < NUM_BARRELS; i++) {
                var theta = i * (2 * Math.PI / NUM_BARRELS) - side * angle;
                var reload = (this.reloadAnimation - i * side) / NUM_BARRELS + (side == 1) * 0.5;
                // adjust for even NUM_BARRELS
                if (side == 1 && !(NUM_BARRELS & 1)) {
                    theta += Math.PI / NUM_BARRELS;
                    reload -= 0.5 / NUM_BARRELS;
                }
                reload -= Math.floor(reload);
                var pos = position.add(bodyOffset.mul(side)).add(bodyOffset.rotate(theta));
                c.beginPath();
                c.arc(pos.x, pos.y, 0.1 * reload, 0, 2 * Math.PI, false);
                c.fill();
                c.stroke();
            }
        }
    };
    return JetStream;
}(SpawningEnemy));
///<reference path="./FreefallEnemy.ts" />
var LASER_RADIUS = .15;
var LASER_SPEED = 5;
var LASER_BOUNCES = 0;
//Laser.subclasses(FreefallEnemy);
var Laser = (function (_super) {
    __extends(Laser, _super);
    function Laser(center, direction) {
        var _this = 
        // FreefallEnemy.prototype.constructor.call(this, ENEMY_LASER, center, LASER_RADIUS, 1);
        _super.call(this, ENEMY_LASER, center, LASER_RADIUS, 1) || this;
        _this.bouncesLeft = LASER_BOUNCES;
        _this.velocity = new Vector(LASER_SPEED * Math.cos(direction), LASER_SPEED * Math.sin(direction));
        return _this;
    }
    Laser.prototype.move = function (seconds) {
        return this.velocity.mul(seconds);
    };
    Laser.prototype.reactToWorld = function (contact) {
        if (this.bouncesLeft <= 0) {
            this.setDead(true);
            var position = this.getCenter();
            for (var i = 0; i < 20; ++i) {
                var angle = randInRange(0, 2 * Math.PI);
                var direction = Vector.fromAngle(angle);
                direction = direction.mul(randInRange(0.5, 5));
                Particle().position(position).velocity(direction).angle(angle).radius(0.1).bounces(1).elasticity(1).decay(0.01).gravity(0).color(1, 1, 1, 1).line();
            }
        }
        else {
            --this.bouncesLeft;
        }
    };
    Laser.prototype.draw = function (c) {
        var heading = this.velocity.unit().mul(LASER_RADIUS);
        var segment = new Segment(this.getCenter().sub(heading), this.getCenter().add(heading));
        c.lineWidth = .07;
        c.strokeStyle = 'white';
        segment.draw(c);
        c.lineWidth = .02;
    };
    return Laser;
}(FreefallEnemy));
var MULTI_GUN_WIDTH = .5;
var MULTI_GUN_HEIGHT = .5;
var MULTI_GUN_SHOOT_FREQ = 1.25;
var MULTI_GUN_RANGE = 8;
// MultiGun.subclasses(SpawningEnemy);
var MultiGun = (function (_super) {
    __extends(MultiGun, _super);
    function MultiGun(center) {
        var _this = 
        // SpawningEnemy.prototype.constructor.call(this, ENEMY_MULTI_GUN, center, MULTI_GUN_WIDTH, MULTI_GUN_HEIGHT, 0, MULTI_GUN_SHOOT_FREQ, 0);
        _super.call(this, ENEMY_MULTI_GUN, center, MULTI_GUN_WIDTH, MULTI_GUN_HEIGHT, 0, MULTI_GUN_SHOOT_FREQ, 0) || this;
        _this.redGun = null;
        _this.blueGun = null;
        _this.gunFired = new Array(4);
        _this.gunPositions = new Array(4);
        //this.redGun = null;
        //this.blueGun = null;
        //this.gunFired = new Array(4);
        //this.gunPositions = new Array(4);
        var pos = _this.getCenter();
        _this.redGun = new Vector(pos.x, pos.y);
        _this.blueGun = new Vector(pos.x, pos.y);
        _this.gunPositions[0] = _this.hitBox.lowerLeft;
        _this.gunPositions[1] = new Vector(_this.hitBox.getRight(), _this.hitBox.getBottom());
        _this.gunPositions[2] = new Vector(_this.hitBox.getLeft(), _this.hitBox.getTop());
        _this.gunPositions[3] = _this.hitBox.lowerLeft.add(new Vector(_this.hitBox.getWidth(), _this.hitBox.getHeight()));
        return _this;
    }
    MultiGun.prototype.canCollide = function () {
        return false;
    };
    MultiGun.prototype.vectorToIndex = function (v) {
        var indexX = (v.x < 0) ? 0 : 1;
        var indexY = (v.y < 0) ? 0 : 2;
        return indexX + indexY;
    };
    MultiGun.prototype.spawn = function () {
        for (var i = 0; i < 4; ++i) {
            this.gunFired[i] = false;
        }
        var fired = false;
        for (var i = 0; i < 2; ++i) {
            var target = gameState.getPlayer(i);
            var index = this.vectorToIndex(target.getCenter().sub(this.getCenter()));
            var relPosition = target.getCenter().sub(this.gunPositions[index]);
            // Player must be alive and in range to be shot
            if (!target.isDead() && relPosition.lengthSquared() < (MULTI_GUN_RANGE * MULTI_GUN_RANGE) &&
                !CollisionDetector.lineOfSightWorld(this.gunPositions[index], target.getCenter(), gameState.world)) {
                if (!this.gunFired[index]) {
                    gameState.addEnemy(new Laser(this.gunPositions[index], relPosition.atan2()), this.gunPositions[index]);
                    this.gunFired[index] = true;
                    fired = true;
                }
            }
        }
        return fired;
    };
    MultiGun.prototype.afterTick = function (seconds) {
        var position = this.getCenter();
        var redGunTarget = this.gunPositions[this.vectorToIndex(gameState.playerA.getCenter().sub(position))];
        var blueGunTarget = this.gunPositions[this.vectorToIndex(gameState.playerB.getCenter().sub(position))];
        var speed = 4 * seconds;
        this.redGun.adjustTowardsTarget(redGunTarget, speed);
        this.blueGun.adjustTowardsTarget(blueGunTarget, speed);
        //bodySprite.SetOffsetBeforeRotation(position.x, position.y);
    };
    MultiGun.prototype.draw = function (c) {
        // Draw the red and/or blue circles
        if (this.redGun.eq(this.blueGun) && !gameState.playerA.isDead() && !gameState.playerB.isDead()) {
            var angle = (this.redGun.sub(this.getCenter())).atan2();
            c.fillStyle = "rgb(205, 0, 0)";
            c.beginPath();
            c.arc(this.redGun.x, this.redGun.y, 0.1, angle, angle + Math.PI, false);
            c.fill();
            c.fillStyle = "rgb(0, 0, 255)";
            c.beginPath();
            c.arc(this.blueGun.x, this.blueGun.y, 0.1, angle + Math.PI, angle + 2 * Math.PI, false);
            c.fill();
        }
        else {
            if (!gameState.playerA.isDead()) {
                c.fillStyle = "rgb(205, 0, 0)";
                c.beginPath();
                c.arc(this.redGun.x, this.redGun.y, 0.1, 0, 2 * Math.PI, false);
                c.fill();
            }
            if (!gameState.playerB.isDead()) {
                c.fillStyle = "rgb(0, 0, 255)";
                c.beginPath();
                c.arc(this.blueGun.x, this.blueGun.y, 0.1, 0, 2 * Math.PI, false);
                c.fill();
            }
        }
        // Draw the body
        c.strokeStyle = "black";
        c.beginPath();
        // Bottom horizontal
        c.moveTo(this.gunPositions[0].x, this.gunPositions[0].y + 0.1);
        c.lineTo(this.gunPositions[1].x, this.gunPositions[1].y + 0.1);
        c.moveTo(this.gunPositions[0].x, this.gunPositions[0].y - 0.1);
        c.lineTo(this.gunPositions[1].x, this.gunPositions[1].y - 0.1);
        // Top horizontal
        c.moveTo(this.gunPositions[2].x, this.gunPositions[2].y - 0.1);
        c.lineTo(this.gunPositions[3].x, this.gunPositions[3].y - 0.1);
        c.moveTo(this.gunPositions[2].x, this.gunPositions[2].y + 0.1);
        c.lineTo(this.gunPositions[3].x, this.gunPositions[3].y + 0.1);
        // Left vertical
        c.moveTo(this.gunPositions[0].x + 0.1, this.gunPositions[0].y);
        c.lineTo(this.gunPositions[2].x + 0.1, this.gunPositions[2].y);
        c.moveTo(this.gunPositions[0].x - 0.1, this.gunPositions[0].y);
        c.lineTo(this.gunPositions[2].x - 0.1, this.gunPositions[2].y);
        // Right vertical
        c.moveTo(this.gunPositions[1].x - 0.1, this.gunPositions[1].y);
        c.lineTo(this.gunPositions[3].x - 0.1, this.gunPositions[3].y);
        c.moveTo(this.gunPositions[1].x + 0.1, this.gunPositions[1].y);
        c.lineTo(this.gunPositions[3].x + 0.1, this.gunPositions[3].y);
        c.stroke();
        // Draw the gun holders
        c.beginPath();
        c.arc(this.gunPositions[0].x, this.gunPositions[0].y, 0.1, 0, 2 * Math.PI, false);
        c.stroke();
        c.beginPath();
        c.arc(this.gunPositions[1].x, this.gunPositions[1].y, 0.1, 0, 2 * Math.PI, false);
        c.stroke();
        c.beginPath();
        c.arc(this.gunPositions[2].x, this.gunPositions[2].y, 0.1, 0, 2 * Math.PI, false);
        c.stroke();
        c.beginPath();
        c.arc(this.gunPositions[3].x, this.gunPositions[3].y, 0.1, 0, 2 * Math.PI, false);
        c.stroke();
    };
    return MultiGun;
}(SpawningEnemy));
///<reference path="../util/vector.ts" /> 
// Particles are statically allocated in a big array so that creating a
// new particle doesn't need to allocate any memory (for speed reasons).
// To create one, call Particle(), which will return one of the elements
// in that array with all values reset to defaults.  To change a property
// use the function with the name of that property.  Some property functions
// can take two values, which will pick a random number between those numbers.
// Example:
//
// Particle().position(center).color(0.9, 0, 0, 0.5).mixColor(1, 0, 0, 1).gravity(1).triangle()
// Particle().position(center).velocity(velocity).color(0, 0, 0, 1).gravity(0.4, 0.6).circle()
// enum ParticleType
var PARTICLE_CIRCLE = 0;
var PARTICLE_TRIANGLE = 1;
var PARTICLE_LINE = 2;
var PARTICLE_CUSTOM = 3;
function randOrTakeFirst(min, max) {
    return (typeof max !== 'undefined') ? randInRange(min, max) : min;
}
function cssRGBA(r, g, b, a) {
    return 'rgba(' + Math.round(r * 255) + ', ' + Math.round(g * 255) + ', ' + Math.round(b * 255) + ', ' + a + ')';
}
// class Particle
var ParticleInstance = (function () {
    function ParticleInstance() {
        this.m_bounces = 0;
        this.m_type = 0;
        this.m_red = 0;
        this.m_green = 0;
        this.m_blue = 0;
        this.m_alpha = 0;
        this.m_radius = 0;
        this.m_gravity = 0;
        this.m_elasticity = 0;
        this.m_decay = 1;
        this.m_expand = 1;
        this.m_position = new Vector(0, 0);
        this.m_velocity = new Vector(0, 0);
        this.m_angle = 0;
        this.m_angularVelocity = 0;
        this.m_drawFunc = null;
    }
    ParticleInstance.prototype.init = function () {
        // must use 'm_' here because many setting functions have the same name as their property
        this.m_bounces = 0;
        this.m_type = 0;
        this.m_red = 0;
        this.m_green = 0;
        this.m_blue = 0;
        this.m_alpha = 0;
        this.m_radius = 0;
        this.m_gravity = 0;
        this.m_elasticity = 0;
        this.m_decay = 1;
        this.m_expand = 1;
        this.m_position = new Vector(0, 0);
        this.m_velocity = new Vector(0, 0);
        this.m_angle = 0;
        this.m_angularVelocity = 0;
        this.m_drawFunc = null;
    };
    ParticleInstance.prototype.tick = function (seconds) {
        if (this.m_bounces < 0) {
            return false;
        }
        this.m_alpha *= Math.pow(this.m_decay, seconds);
        this.m_radius *= Math.pow(this.m_expand, seconds);
        this.m_velocity.y -= this.m_gravity * seconds;
        this.m_position = this.m_position.add(this.m_velocity.mul(seconds));
        this.m_angle += this.m_angularVelocity * seconds;
        if (this.m_alpha < 0.05) {
            this.m_bounces = -1;
        }
        return (this.m_bounces >= 0);
    };
    ParticleInstance.prototype.draw = function (c) {
        switch (this.m_type) {
            case PARTICLE_CIRCLE:
                c.fillStyle = cssRGBA(this.m_red, this.m_green, this.m_blue, this.m_alpha);
                c.beginPath();
                c.arc(this.m_position.x, this.m_position.y, this.m_radius, 0, 2 * Math.PI, false);
                c.fill();
                break;
            case PARTICLE_TRIANGLE:
                var v1 = this.m_position.add(this.m_velocity.mul(0.04));
                var v2 = this.m_position.sub(this.m_velocity.flip().mul(0.01));
                var v3 = this.m_position.add(this.m_velocity.flip().mul(0.01));
                c.fillStyle = cssRGBA(this.m_red, this.m_green, this.m_blue, this.m_alpha);
                c.beginPath();
                c.moveTo(v1.x, v1.y);
                c.lineTo(v2.x, v2.y);
                c.lineTo(v3.x, v3.y);
                c.closePath();
                c.fill();
                break;
            case PARTICLE_LINE:
                var dx = Math.cos(this.m_angle) * this.m_radius;
                var dy = Math.sin(this.m_angle) * this.m_radius;
                c.strokeStyle = cssRGBA(this.m_red, this.m_green, this.m_blue, this.m_alpha);
                c.beginPath();
                c.moveTo(this.m_position.x - dx, this.m_position.y - dy);
                c.lineTo(this.m_position.x + dx, this.m_position.y + dy);
                c.stroke();
                break;
            case PARTICLE_CUSTOM:
                c.fillStyle = cssRGBA(this.m_red, this.m_green, this.m_blue, this.m_alpha);
                c.save();
                c.translate(this.m_position.x, this.m_position.y);
                c.rotate(this.m_angle);
                this.m_drawFunc(c);
                c.restore();
                break;
        }
    };
    // all of these functions support chaining to fix constructor with 200 arguments
    ParticleInstance.prototype.bounces = function (min, max) { this.m_bounces = Math.round(randOrTakeFirst(min, max)); return this; };
    ;
    ParticleInstance.prototype.circle = function () { this.m_type = PARTICLE_CIRCLE; return this; };
    ;
    ParticleInstance.prototype.triangle = function () { this.m_type = PARTICLE_TRIANGLE; return this; };
    ;
    ParticleInstance.prototype.line = function () { this.m_type = PARTICLE_LINE; return this; };
    ;
    ParticleInstance.prototype.custom = function (drawFunc) { this.m_type = PARTICLE_CUSTOM; this.m_drawFunc = drawFunc; return this; };
    ;
    ParticleInstance.prototype.color = function (r, g, b, a) {
        this.m_red = r;
        this.m_green = g;
        this.m_blue = b;
        this.m_alpha = a;
        return this;
    };
    ParticleInstance.prototype.mixColor = function (r, g, b, a) {
        var percent = Math.random();
        this.m_red = lerp(this.m_red, r, percent);
        this.m_green = lerp(this.m_green, g, percent);
        this.m_blue = lerp(this.m_blue, b, percent);
        this.m_alpha = lerp(this.m_alpha, a, percent);
        return this;
    };
    ParticleInstance.prototype.radius = function (min, max) { this.m_radius = randOrTakeFirst(min, max); return this; };
    ;
    ParticleInstance.prototype.gravity = function (min, max) { this.m_gravity = randOrTakeFirst(min, max); return this; };
    ;
    ParticleInstance.prototype.elasticity = function (min, max) { this.m_elasticity = randOrTakeFirst(min, max); return this; };
    ;
    ParticleInstance.prototype.decay = function (min, max) { this.m_decay = randOrTakeFirst(min, max); return this; };
    ;
    ParticleInstance.prototype.expand = function (min, max) { this.m_expand = randOrTakeFirst(min, max); return this; };
    ;
    ParticleInstance.prototype.angle = function (min, max) { this.m_angle = randOrTakeFirst(min, max); return this; };
    ;
    ParticleInstance.prototype.angularVelocity = function (min, max) { this.m_angularVelocity = randOrTakeFirst(min, max); return this; };
    ;
    ParticleInstance.prototype.position = function (position) { this.m_position = position; return this; };
    ;
    ParticleInstance.prototype.velocity = function (velocity) { this.m_velocity = velocity; return this; };
    ;
    return ParticleInstance;
}());
// wrap in anonymous function for private variables
var Particle = (function () {
    // particles is an array of ParticleInstances where the first count are in use
    var particles = new Array(3000);
    var maxCount = particles.length;
    var count = 0;
    for (var i = 0; i < particles.length; i++) {
        particles[i] = new ParticleInstance();
    }
    function Particle() {
        var particle = (count < maxCount) ? particles[count++] : particles[maxCount - 1];
        particle.init();
        return particle;
    }
    Particle.reset = function () {
        count = 0;
    };
    Particle.tick = function (seconds) {
        for (var i = 0; i < count; i++) {
            var isAlive = particles[i].tick(seconds);
            if (!isAlive) {
                // swap the current particle with the last active particle (this will swap with itself if this is the last active particle)
                var temp = particles[i];
                particles[i] = particles[count - 1];
                particles[count - 1] = temp;
                // forget about the dead particle that we just moved to the end of the active particle list
                count--;
                // don't skip the particle that we just swapped in
                i--;
            }
        }
    };
    Particle.draw = function (c) {
        for (var i = 0; i < count; i++) {
            var particle = particles[i];
            var pos = particle.m_position;
            if (pos.x >= drawMinX && pos.y >= drawMinY && pos.x <= drawMaxX && pos.y <= drawMaxY) {
                particle.draw(c);
            }
        }
    };
    return Particle;
})();
///<reference path="../util/vector.ts" /> 
// class Keyframe
var Keyframe = (function () {
    function Keyframe(x, y) {
        this.angles = [];
        this.center = new Vector(x, y);
        // this.angles = [];
    }
    Keyframe.prototype.add = function () {
        for (var i = 0; i < arguments.length; i++) {
            this.angles.push(arguments[i] * Math.PI / 180);
        }
        return this;
    };
    Keyframe.prototype.lerpWith = function (keyframe, percent) {
        var result = new Keyframe(lerp(this.center.x, keyframe.center.x, percent), lerp(this.center.y, keyframe.center.y, percent));
        for (var i = 0; i < this.angles.length; i++) {
            result.angles.push(lerp(this.angles[i], keyframe.angles[i], percent));
        }
        return result;
    };
    Keyframe.lerp = function (keyframes, percent) {
        var lower = Math.floor(percent);
        percent -= lower;
        lower = lower % keyframes.length;
        var upper = (lower + 1) % keyframes.length;
        return keyframes[lower].lerpWith(keyframes[upper], percent);
    };
    return Keyframe;
}());
///<reference path="../util/keyframe.ts" /> 
///<reference path="./entity.ts" /> 
// constants
var PAUSE_AFTER_DEATH = 2;
var RESPAWN_INTERPOLATION_TIME = 1;
var PAUSE_BEFORE_RESPAWN = 0.3;
var PLAYER_ACCELERATION = 50;
var PLAYER_MAX_SPEED = 8;
var PLAYER_WIDTH = 0.2;
var PLAYER_HEIGHT = 0.75;
var PLAYER_SUPER_JUMP_SPEED = 10;
var PLAYER_CLAMBER_ACCEL_X = 5;
var PLAYER_CLAMBER_ACCEL_Y = 10;
var PLAYER_DEATH_SPEED = 15;
var PLAYER_GRAVITY = 10;
var SLIDE_PARTICLE_TIMER_PERIOD = 1 / 5;
var SUPER_PARTICLE_TIMER_PERIOD = 1 / 40;
var JUMP_MIN_WAIT = 0.5;
var WALL_FRICTION = 0.1;
// enum PlayerState
var PLAYER_STATE_FLOOR = 0;
var PLAYER_STATE_AIR = 1;
var PLAYER_STATE_CLAMBER = 2;
var PLAYER_STATE_LEFT_WALL = 3;
var PLAYER_STATE_RIGHT_WALL = 4;
var runningKeyframes = [
    new Keyframe(0, -5 / 50).add(5, -10, 65, -55, 20, 40, -20, -30, -30, 10),
    new Keyframe(0, -2 / 50).add(5, -10, 35, -25, 0, 30, 18, -110, 0, 20),
    new Keyframe(0, 0).add(5, -10, 10, -30, -20, 20, 60, -100, 10, 30),
    new Keyframe(0, -5 / 50).add(5, -10, -20, -30, -30, 10, 65, -55, 20, 40),
    new Keyframe(0, -2 / 50).add(5, -10, 18, -110, 0, 20, 35, -25, 0, 30),
    new Keyframe(0, 0).add(5, -10, 60, -100, 10, 30, 10, -30, -20, 20)
];
var jumpingKeyframes = [
    new Keyframe(0, 0).add(0, -10, 150, -170, -40, 30, -30, -20, 20, 150),
    new Keyframe(0, 0).add(-20, 10, 60, -100, -80, 30, 30, -20, 30, 30)
];
var wallSlidingKeyframe = new Keyframe((0.4 - PLAYER_WIDTH) / 2, 0).add(0, -10, 150, -130, 140, 50, 50, -30, 50, 130);
var crouchingKeyframe = new Keyframe(0, -0.2).add(30, -30, 130, -110, -30, 40, 60, -120, 20, 20);
var fallingKeyframes = [
    new Keyframe(0, 0).add(-20, 5, 10, -30, -120, -30, 40, -20, 120, 30),
    new Keyframe(0, 0).add(-20, 5, 10, -30, -130, -60, 40, -20, 150, 50)
];
var clamberingKeyframes = [
    new Keyframe((0.4 - PLAYER_WIDTH) / 2, 0).add(0, -10, 150, -130, 140, 50, 50, -30, 50, 130),
    new Keyframe(0, -0.2).add(30, -30, 160, -180, -30, 40, 20, -10, 20, 20)
];
// enum PlayerSpriteIndex
var PLAYER_HEAD = 0;
var PLAYER_TORSO = 1;
var PLAYER_LEFT_UPPER_LEG = 2;
var PLAYER_LEFT_LOWER_LEG = 3;
var PLAYER_LEFT_UPPER_ARM = 4;
var PLAYER_LEFT_LOWER_ARM = 5;
var PLAYER_RIGHT_UPPER_LEG = 6;
var PLAYER_RIGHT_LOWER_LEG = 7;
var PLAYER_RIGHT_UPPER_ARM = 8;
var PLAYER_RIGHT_LOWER_ARM = 9;
var PLAYER_NUM_SPRITES = 10;
function drawPlayerQuad(c, x1, x2, y1, y2) {
    x1 /= 50;
    x2 /= 50;
    y1 /= 50;
    y2 /= 50;
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.lineTo(-x2, y2);
    c.lineTo(-x1, y1);
    c.closePath();
    c.fill();
    c.stroke();
}
function drawPlayerHead(c, x1, x2, y1, y2, y3) {
    drawPlayerQuad(c, x1, x2, y1, y2);
    y2 /= 50;
    y3 /= 50;
    c.beginPath();
    c.moveTo(0, y2);
    c.lineTo(0, y3 - 0.02);
    c.arc(0, y3, 0.02, -Math.PI / 2, Math.PI * 3 / 2, false);
    c.stroke();
}
function createPlayerSprites() {
    var sprites = [];
    for (var i = 0; i < PLAYER_NUM_SPRITES; i++) {
        sprites.push(new Sprite());
    }
    sprites[PLAYER_HEAD].drawGeometry = function (c) { drawPlayerHead(c, 2.5, 2.5, 1, 10, 18); };
    sprites[PLAYER_TORSO].drawGeometry = function (c) { drawPlayerQuad(c, 1.5, 1.5, 0, 15); };
    sprites[PLAYER_LEFT_UPPER_LEG].drawGeometry = sprites[PLAYER_RIGHT_UPPER_LEG].drawGeometry = function (c) { drawPlayerQuad(c, 1.5, 1, 0, -10); };
    sprites[PLAYER_LEFT_LOWER_LEG].drawGeometry = sprites[PLAYER_RIGHT_LOWER_LEG].drawGeometry = function (c) { drawPlayerQuad(c, 1, 1.5, 0, -10); };
    sprites[PLAYER_LEFT_UPPER_ARM].drawGeometry = sprites[PLAYER_RIGHT_UPPER_ARM].drawGeometry = function (c) { drawPlayerQuad(c, 1.5, 0.5, 0, -9); };
    sprites[PLAYER_LEFT_LOWER_ARM].drawGeometry = sprites[PLAYER_RIGHT_LOWER_ARM].drawGeometry = function (c) { drawPlayerQuad(c, 0.5, 1.5, 0, -10); };
    sprites[PLAYER_HEAD].setParent(sprites[PLAYER_TORSO]);
    sprites[PLAYER_LEFT_UPPER_ARM].setParent(sprites[PLAYER_TORSO]);
    sprites[PLAYER_RIGHT_UPPER_ARM].setParent(sprites[PLAYER_TORSO]);
    sprites[PLAYER_LEFT_LOWER_ARM].setParent(sprites[PLAYER_LEFT_UPPER_ARM]);
    sprites[PLAYER_RIGHT_LOWER_ARM].setParent(sprites[PLAYER_RIGHT_UPPER_ARM]);
    sprites[PLAYER_LEFT_UPPER_LEG].setParent(sprites[PLAYER_TORSO]);
    sprites[PLAYER_RIGHT_UPPER_LEG].setParent(sprites[PLAYER_TORSO]);
    sprites[PLAYER_LEFT_LOWER_LEG].setParent(sprites[PLAYER_LEFT_UPPER_LEG]);
    sprites[PLAYER_RIGHT_LOWER_LEG].setParent(sprites[PLAYER_RIGHT_UPPER_LEG]);
    sprites[PLAYER_HEAD].offsetBeforeRotation = new Vector(0, 17 / 50);
    sprites[PLAYER_LEFT_LOWER_LEG].offsetBeforeRotation = new Vector(0, -10 / 50);
    sprites[PLAYER_RIGHT_LOWER_LEG].offsetBeforeRotation = new Vector(0, -10 / 50);
    sprites[PLAYER_LEFT_UPPER_ARM].offsetBeforeRotation = new Vector(0, 15 / 50);
    sprites[PLAYER_RIGHT_UPPER_ARM].offsetBeforeRotation = new Vector(0, 15 / 50);
    sprites[PLAYER_LEFT_LOWER_ARM].offsetBeforeRotation = new Vector(0, -9 / 50);
    sprites[PLAYER_RIGHT_LOWER_ARM].offsetBeforeRotation = new Vector(0, -9 / 50);
    return sprites;
}
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(center, color) {
        var _this = 
        //Entity.prototype.constructor.call(this);
        _super.call(this) || this;
        _this.reset(center, color);
        return _this;
    }
    // this is necessary because if we just set gameState.playerA = new Player()
    // it'll wipe out everyone's references (for targets and so on)
    Player.prototype.reset = function (center, color) {
        // keys (will be set automatically)
        this.jumpKey = false;
        this.crouchKey = false;
        this.leftKey = false;
        this.rightKey = false;
        // the player is modeled as a triangle so it behaves like a
        // box on top (so it has width) and behaves like a point on
        // bottom (so it slides down when walking off ledges)
        this.polygon = new Polygon(center, new Vector(PLAYER_WIDTH / 2, PLAYER_HEIGHT / 2), new Vector(-PLAYER_WIDTH / 2, PLAYER_HEIGHT / 2), new Vector(0, -PLAYER_HEIGHT / 2));
        // physics stuff
        this.velocity = new Vector(0, 0);
        this.actualVelocity = new Vector(0, 0);
        this.boost = 0;
        this.boostTime = 0;
        this.boostMagnitude = 0;
        this.onDiagLastTick = false;
        this.jumpDisabled = false;
        this.lastContact = null;
        this.state = PLAYER_STATE_FLOOR;
        this.prevState = PLAYER_STATE_FLOOR;
        // animation stuff
        this.sprites = createPlayerSprites();
        this.facingRight = false;
        this.runningFrame = 0;
        this.fallingFrame = 0;
        this.crouchTimer = 0;
        this.timeSinceDeath = 0;
        this.positionOfDeath = new Vector(0, 0);
        this.slideParticleTimer = 0;
        this.superJumpParticleTimer = 0;
        // other stuff
        this.isSuperJumping = false;
        this.color = color;
    };
    Player.prototype.getShape = function () { return this.polygon; };
    ;
    Player.prototype.getColor = function () { return this.color; };
    ;
    // returns 0 for red player and 1 for blue player
    Player.prototype.getPlayerIndex = function () {
        return (this == gameState.playerB);
    };
    Player.prototype.getCrouch = function () {
        return this.crouchKey;
    };
    Player.prototype.disableJump = function () {
        this.jumpDisabled = true;
    };
    Player.prototype.addToVelocity = function (v) {
        this.velocity.inplaceAdd(v);
    };
    Player.prototype.collideWithOtherPlayer = function () {
        // Do a co-op jump if a bunch of conditions hold: Both players on floor, the other player is crouching, and the two are colliding
        var otherPlayer = gameState.getOtherPlayer(this);
        if (otherPlayer.crouchKey && !otherPlayer.isDead() && this.state == PLAYER_STATE_FLOOR && otherPlayer.state == PLAYER_STATE_FLOOR) {
            // Other player not moving, this player moving fast enough in x
            if (otherPlayer.velocity.lengthSquared() < 0.01 &&
                Math.abs(this.velocity.x) > 4 /* && TODO: HAD TO COMMENT THIS OUT BECAUSE Y VELOCITY IS BIGGER THAN 0.1, WHY IS THIS
        Math.abs(this.velocity.y) < 0.1*/) {
                var relativePos = this.getCenter().sub(otherPlayer.getCenter());
                // if y-position within 0.01 and x-position within 0.1
                if (Math.abs(relativePos.y) <= 0.01 && Math.abs(relativePos.x) < 0.1) {
                    this.velocity = new Vector(0, PLAYER_SUPER_JUMP_SPEED);
                    this.isSuperJumping = true;
                }
            }
            // Change the spawn point if the players are within 1 unit and we have waited for at least 1 second
            if (this.getCenter().sub(otherPlayer.getCenter()).lengthSquared() < 1 &&
                this.crouchTimer > 1 && otherPlayer.crouchTimer >= this.crouchTimer) {
                gameState.setSpawnPoint(otherPlayer.getCenter());
            }
        }
    };
    Player.prototype.tick = function (seconds) {
        this.tickDeath(seconds);
        if (!this.isDead()) {
            this.tickPhysics(seconds);
            this.tickParticles(seconds);
            this.tickAnimation(seconds);
        }
    };
    Player.prototype.tickDeath = function (seconds) {
        // increment the death timer
        if (!this.isDead())
            this.timeSinceDeath = 0;
        else
            this.timeSinceDeath += seconds;
        // respawn as needed (but only if the other player isn't also dead)
        if (this.timeSinceDeath > PAUSE_AFTER_DEATH + RESPAWN_INTERPOLATION_TIME + PAUSE_BEFORE_RESPAWN && !gameState.getOtherPlayer(this).isDead()) {
            this.setDead(false);
        }
        // if we're dead, interpolate back to the spawn point
        if (this.isDead()) {
            // smoothly interpolate the position of death to the spawn point (speeding up at the beginning and slowing down at the end)
            var destination = gameState.getSpawnPoint();
            var percent = (this.timeSinceDeath - PAUSE_AFTER_DEATH) / RESPAWN_INTERPOLATION_TIME;
            percent = Math.max(0, Math.min(1, percent));
            percent = 0.5 - 0.5 * Math.cos(percent * Math.PI);
            percent = 0.5 - 0.5 * Math.cos(percent * Math.PI);
            this.setCenter(Vector.lerp(this.positionOfDeath, destination, percent));
        }
    };
    Player.prototype.tickPhysics = function (seconds) {
        // if we hit something, stop the boost
        if (this.lastContact != null) {
            this.boostMagnitude = 0;
            this.boostTime = 0;
        }
        // if we're not in a boost, decrease the boost magnitude
        this.boostTime -= seconds;
        if (this.boostTime < 0)
            this.boostMagnitude *= Math.pow(0.1, seconds);
        // if we hit something or fall down, turn super jumping off
        if (this.lastContact != null || this.velocity.y < 0)
            this.isSuperJumping = false;
        // move the player horizontally
        var moveLeft = (this.leftKey && !this.rightKey && !this.crouchKey);
        var moveRight = (this.rightKey && !this.leftKey && !this.crouchKey);
        // check for edge collisions.  sometimes if we hit an edge hard, we won't actually be within the margin
        // but we will have a contact so we use both methods to detect an edge contact
        // THIS IS A GLOBAL NOW var edgeQuad = new EdgeQuad();
        CollisionDetector.onEntityWorld(this, edgeQuad, gameState.world);
        var onGround = (edgeQuad.edges[EDGE_FLOOR] != null) || (this.lastContact != null && Edge.getOrientation(this.lastContact.normal) == EDGE_FLOOR);
        var onLeft = (edgeQuad.edges[EDGE_LEFT] != null) || (this.lastContact != null && Edge.getOrientation(this.lastContact.normal) == EDGE_LEFT);
        var onRight = (edgeQuad.edges[EDGE_RIGHT] != null) || (this.lastContact != null && Edge.getOrientation(this.lastContact.normal) == EDGE_RIGHT);
        var onCeiling = (edgeQuad.edges[EDGE_CEILING] != null) || (this.lastContact != null && Edge.getOrientation(this.lastContact.normal) == EDGE_CEILING);
        if (!this.jumpDisabled && this.jumpKey) {
            // do a vertical jump
            if (onGround) {
                this.velocity.y = 6.5;
                this.boostTime = 0;
                this.boost = 0;
                this.boostMagnitude = 0;
                // boost away from the wall
                if (onLeft || onRight) {
                    this.boostTime = 0.5;
                    this.boost = 1;
                    this.boostMagnitude = 0.5;
                }
                // if it's on the right wall, just switch the boost direction
                if (onRight)
                    this.boost = -this.boost;
                // if the other player is super jumping, make us super jumping too!
                if (gameState.getOtherPlayer(this).isSuperJumping) {
                    this.velocity.y = PLAYER_SUPER_JUMP_SPEED;
                    this.isSuperJumping = true;
                }
            }
            else if (onLeft && !moveLeft && this.boostTime < 0) {
                this.velocity = new Vector(3.5, 6.5);
                this.boostTime = JUMP_MIN_WAIT;
                this.boost = 2.5;
                this.boostMagnitude = 1;
            }
            else if (onRight && !moveRight && this.boostTime < 0) {
                this.velocity = new Vector(-3.5, 6.5);
                this.boostTime = JUMP_MIN_WAIT;
                this.boost = -2.5;
                this.boostMagnitude = 1;
            }
        }
        // kill the boost when we hit a ceiling
        if (onCeiling) {
            this.boostTime = 0;
            this.boost = 0;
            this.boostMagnitude = 0;
        }
        // accelerate left and right (but not on ceilings, unless you are also on the ground for diagonal corners)
        if (onGround || !onCeiling) {
            if (moveLeft) {
                this.velocity.x -= PLAYER_ACCELERATION * seconds;
                this.velocity.x = Math.max(this.velocity.x, -PLAYER_MAX_SPEED);
            }
            if (moveRight) {
                this.velocity.x += PLAYER_ACCELERATION * seconds;
                this.velocity.x = Math.min(this.velocity.x, PLAYER_MAX_SPEED);
            }
        }
        if (edgeQuad.edges[EDGE_FLOOR])
            this.state = PLAYER_STATE_FLOOR;
        else if (edgeQuad.edges[EDGE_LEFT])
            this.state = PLAYER_STATE_LEFT_WALL;
        else if (edgeQuad.edges[EDGE_RIGHT])
            this.state = PLAYER_STATE_RIGHT_WALL;
        else
            this.state = PLAYER_STATE_AIR;
        var ref_closestPointWorld = {}, ref_closestPointShape = {};
        var closestPointDistance = CollisionDetector.closestToEntityWorld(this, 0.1, ref_closestPointShape, ref_closestPointWorld, gameState.world);
        if (this.state == PLAYER_STATE_LEFT_WALL || this.state == PLAYER_STATE_RIGHT_WALL) {
            // apply wall friction if the player is sliding down
            if (this.velocity.y < 0) {
                this.velocity.y *= Math.pow(WALL_FRICTION, seconds);
            }
            if (this.velocity.y > -0.5 && this.prevState === PLAYER_STATE_CLAMBER) {
                // continue clambering to prevent getting stuck alternating between clambering and climbing
                this.state = PLAYER_STATE_CLAMBER;
            }
        }
        // start clambering if we're touching something below us, but not on a floor, wall, or ceiling
        if (this.state == PLAYER_STATE_AIR && closestPointDistance < 0.01 && ref_closestPointShape.ref.y > ref_closestPointWorld.ref.y)
            this.state = PLAYER_STATE_CLAMBER;
        if (this.state == PLAYER_STATE_CLAMBER) {
            // clamber left
            if (this.leftKey && ref_closestPointWorld.ref.x - this.polygon.getCenter().x < 0) {
                this.velocity.x -= PLAYER_CLAMBER_ACCEL_X * seconds;
                this.velocity.y += PLAYER_CLAMBER_ACCEL_Y * seconds;
            }
            // clamber right
            if (this.rightKey && ref_closestPointWorld.ref.x - this.polygon.getCenter().x > 0) {
                this.velocity.x += PLAYER_CLAMBER_ACCEL_X * seconds;
                this.velocity.y += PLAYER_CLAMBER_ACCEL_Y * seconds;
            }
        }
        this.crouchTimer += seconds;
        if (!this.crouchKey || this.state != PLAYER_STATE_FLOOR)
            this.crouchTimer = 0;
        // If on a floor
        if (this.state == PLAYER_STATE_FLOOR) {
            if (this.crouchKey) {
                this.velocity.inplaceMul(Math.pow(0.000001, seconds));
            }
            else {
                this.velocity.y -= PLAYER_GRAVITY * seconds;
                if (!this.jumpKey && this.leftKey != this.rightKey &&
                    this.onDiagLastTick && edgeQuad.edges[EDGE_FLOOR].segment.normal.y < 0.99) {
                    // If running down on a diagonal floor, dont let the player run off
                    this.velocity = this.velocity.projectOntoAUnitVector(edgeQuad.edges[EDGE_FLOOR].segment.normal.flip()).mul(0.99);
                    this.velocity.y += .001;
                }
            }
        }
        else {
            this.velocity.y -= PLAYER_GRAVITY * seconds;
        }
        this.onDiagLastTick = (this.state == PLAYER_STATE_FLOOR && edgeQuad.edges[EDGE_FLOOR].segment.normal.y < 0.99);
        this.collideWithOtherPlayer();
        // boost the velocity in the x direction
        this.actualVelocity = Vector.lerp(this.velocity, new Vector(this.boost, this.velocity.y), this.boostMagnitude);
        if (this.boost != 0 && this.velocity.x / this.boost > 1)
            this.actualVelocity.x = this.velocity.x;
        var deltaPosition = this.actualVelocity.mul(seconds);
        // Time independent version of multiplying by 0.909511377
        this.velocity.x *= Math.pow(0.000076, seconds);
        var ref_deltaPosition = { ref: deltaPosition }, ref_velocity = { ref: this.velocity };
        var newContact = CollisionDetector.collideEntityWorld(this, ref_deltaPosition, ref_velocity, 0, gameState.world, true);
        deltaPosition = ref_deltaPosition.ref;
        this.velocity = ref_velocity.ref;
        this.lastContact = newContact;
        this.polygon.moveBy(deltaPosition);
        if (this.actualVelocity.y < -PLAYER_DEATH_SPEED && newContact != null && newContact.normal.y > 0.9) {
            this.setDead(true);
            this.onDeath();
        }
        // After everything, reenable jump
        this.prevState = this.state;
        this.jumpDisabled = false;
    };
    Player.prototype.onDeath = function () {
        this.velocity = new Vector(0, 0);
        this.state = PLAYER_STATE_AIR;
        this.boost = this.boostMagnitude = 0;
        this.isSuperJumping = false;
        this.timeSinceDeath = 0;
        this.positionOfDeath = this.polygon.center;
        var isRed = (gameState.playerA == this);
        var r = isRed ? 1 : 0.1;
        var g = 0.1;
        var b = isRed ? 0.1 : 1;
        for (var i = 0; i < 500; i++) {
            var direction = Vector.fromAngle(lerp(0, 2 * Math.PI, Math.random()));
            direction = this.velocity.add(direction.mul(lerp(1, 10, Math.random())));
            Particle().triangle().position(this.polygon.center).velocity(direction).radius(0.01, 0.1).bounces(0, 4).elasticity(0.05, 0.9).decay(0.01, 0.02).expand(1, 1.2).color(r / 2, g / 2, b / 2, 1).mixColor(r, g, b, 1);
        }
        gameState.incrementStat(STAT_PLAYER_DEATHS);
    };
    Player.prototype.onRespawn = function () {
    };
    Player.prototype.tickParticles = function (seconds) {
        // wall sliding particles
        if (this.state == PLAYER_STATE_LEFT_WALL || this.state == PLAYER_STATE_RIGHT_WALL) {
            var directionMultiplier = (this.state == PLAYER_STATE_RIGHT_WALL) ? -1 : 1;
            var bounds = this.polygon.getAabb();
            var up = this.velocity.y;
            this.slideParticleTimer -= seconds * this.velocity.length();
            while (this.slideParticleTimer < 0) {
                this.slideParticleTimer += SLIDE_PARTICLE_TIMER_PERIOD;
                // distribute the particles along the side of the bounding box closest to the world (add 0.25 because the hands reach over the bounding box)
                var position = new Vector((this.state == PLAYER_STATE_RIGHT_WALL) ? bounds.getRight() : bounds.getLeft(), lerp(bounds.getBottom(), bounds.getTop() + 0.25, Math.random()));
                var velocity = new Vector(lerp(0, directionMultiplier, Math.random()), lerp(up, 2 * up, Math.random()));
                Particle().color(0.3, 0.3, 0.3, 1).mixColor(0.5, 0.3, 0.3, 1).position(position).circle().radius(0.02, 0.04).decay(0.01, 0.2).gravity(15).bounces(2, 4).velocity(velocity).elasticity(0.05, 0.1);
            }
        }
        else {
            this.slideParticleTimer = 0;
        }
        // super jump particles
        if (this.isSuperJumping) {
            this.superJumpParticleTimer -= seconds;
            while (this.superJumpParticleTimer < 0) {
                this.superJumpParticleTimer += SUPER_PARTICLE_TIMER_PERIOD;
                var position = this.polygon.center.add(new Vector(randInRange(-0.2, 0.2), randInRange(-0.4, 0.4)));
                Particle().color(1, 1, 0, 1).mixColor(1, 1, 0, 0.75).position(position).circle().radius(0.03, 0.05).expand(1.1, 1.2).decay(0.1, 0.2).gravity(5).bounces(2, 3);
            }
        }
        else {
            this.superJumpParticleTimer = 0;
        }
    };
    Player.prototype.tickAnimation = function (seconds) {
        var frame;
        var slowDownScale = 1;
        this.runningFrame += seconds * Math.abs(this.actualVelocity.x) * Math.PI;
        this.fallingFrame += 8 * seconds;
        if (this.state == PLAYER_STATE_LEFT_WALL) {
            this.facingRight = false;
            frame = wallSlidingKeyframe;
        }
        else if (this.state == PLAYER_STATE_RIGHT_WALL) {
            this.facingRight = true;
            frame = wallSlidingKeyframe;
        }
        else if (this.state == PLAYER_STATE_AIR) {
            if (this.actualVelocity.x < 0)
                this.facingRight = false;
            else if (this.actualVelocity.x > 0)
                this.facingRight = true;
            if (this.actualVelocity.y > -PLAYER_DEATH_SPEED) {
                var percent = this.actualVelocity.y / 4;
                percent = (percent < 0) ? 1 / (1 - percent) - 1 : 1 - 1 / (1 + percent);
                percent = 0.5 - 0.5 * percent;
                frame = jumpingKeyframes[0].lerpWith(jumpingKeyframes[1], percent);
            }
            else {
                frame = Keyframe.lerp(fallingKeyframes, this.fallingFrame);
            }
        }
        else if (this.state == PLAYER_STATE_CLAMBER) {
            var ref_shapePoint = {}, ref_worldPoint = {};
            CollisionDetector.closestToEntityWorld(this, 2, ref_shapePoint, ref_worldPoint, gameState.world);
            // this should be from -0.5 to 0.5, so add 0.5 so it is from 0 to 1
            var percent = (this.getCenter().y - ref_worldPoint.ref.y) / PLAYER_HEIGHT;
            percent += 0.5;
            frame = clamberingKeyframes[0].lerpWith(clamberingKeyframes[1], percent);
            this.facingRight = (ref_shapePoint.ref.x < ref_worldPoint.ref.x);
        }
        else if (this.crouchKey) {
            frame = crouchingKeyframe;
        }
        else {
            frame = Keyframe.lerp(runningKeyframes, this.runningFrame);
            if (this.actualVelocity.x < -0.1)
                this.facingRight = false;
            else if (this.actualVelocity.x > 0.1)
                this.facingRight = true;
            slowDownScale = Math.abs(this.actualVelocity.x) / 5;
            if (slowDownScale > 1)
                slowDownScale = 1;
        }
        for (var i = 0; i < this.sprites.length; i++) {
            this.sprites[i].angle = frame.angles[i] * slowDownScale;
        }
        var offset = frame.center.mul(slowDownScale);
        this.sprites[PLAYER_TORSO].offsetBeforeRotation = new Vector(this.getCenter().x + offset.x * (this.facingRight ? -1 : 1), this.getCenter().y + offset.y);
        this.sprites[PLAYER_TORSO].flip = !this.facingRight;
    };
    Player.prototype.draw = function (c) {
        if (!this.isDead()) {
            if (this.isSuperJumping) {
                var alpha = Math.max(0, this.velocity.y / PLAYER_SUPER_JUMP_SPEED);
                c.strokeStyle = 'rgba(255, 255, 0, ' + alpha.toFixed(3) + ')';
                c.lineWidth *= 3;
                this.sprites[PLAYER_TORSO].draw(c);
                c.lineWidth /= 3;
            }
            c.fillStyle = (this.getPlayerIndex() == 0) ? 'red' : 'blue';
            c.strokeStyle = 'black';
            this.sprites[PLAYER_TORSO].draw(c);
        }
    };
    return Player;
}(Entity));
var RIOT_BULLET_RADIUS = 0.1;
var RIOT_BULLET_SPEED = 7;
// RiotBullet.subclasses(FreefallEnemy);
var RiotBullet = (function (_super) {
    __extends(RiotBullet, _super);
    function RiotBullet(center, direction) {
        var _this = 
        // FreefallEnemy.prototype.constructor.call(this, ENEMY_RIOT_BULLET, center, RIOT_BULLET_RADIUS, 0);
        _super.call(this, ENEMY_RIOT_BULLET, center, RIOT_BULLET_RADIUS, 0) || this;
        _this.velocity = new Vector(RIOT_BULLET_SPEED * Math.cos(direction), RIOT_BULLET_SPEED * Math.sin(direction));
        return _this;
    }
    RiotBullet.prototype.reactToPlayer = function (player) {
        if (!this.isDead()) {
            // the delta-velocity applied to the player
            var deltaVelocity = this.velocity.mul(0.75);
            player.addToVelocity(deltaVelocity);
        }
        this.setDead(true);
    };
    RiotBullet.prototype.onDeath = function () {
        var position = this.getCenter();
        // smoke
        for (var i = 0; i < 5; ++i) {
            var direction = Vector.fromAngle(randInRange(0, 2 * Math.PI));
            direction = this.velocity.add(direction.mul(randInRange(0.1, 1)));
            Particle().position(position).velocity(direction).radius(0.01, 0.1).bounces(0, 4).elasticity(0.05, 0.9).decay(0.0005, 0.005).expand(1.0, 1.2).color(0.9, 0.9, 0, 1).mixColor(1, 1, 0, 1).circle();
        }
        Enemy.prototype.onDeath.call(this);
    };
    RiotBullet.prototype.draw = function (c) {
        var pos = this.getCenter();
        c.strokeStyle = 'black';
        c.fillStyle = 'yellow';
        c.beginPath();
        c.arc(pos.x, pos.y, RIOT_BULLET_RADIUS, 0, 2 * Math.PI, false);
        c.fill();
        c.stroke();
    };
    return RiotBullet;
}(FreefallEnemy));
var SHOCK_HAWK_RADIUS = 0.3;
var SHOCK_HAWK_ACCEL = 6;
var SHOCK_HAWK_DECEL = 0.8;
var SHOCK_HAWK_RANGE = 10;
// ShockHawk.subclasses(HoveringEnemy);
var ShockHawk = (function (_super) {
    __extends(ShockHawk, _super);
    function ShockHawk(center, target) {
        var _this = 
        // HoveringEnemy.prototype.constructor.call(this, ENEMY_SHOCK_HAWK, center, SHOCK_HAWK_RADIUS, 0);
        _super.call(this, ENEMY_SHOCK_HAWK, center, SHOCK_HAWK_RADIUS, 0) || this;
        _this.chasing = false;
        _this.target = target;
        _this.chasing = false;
        _this.bodySprite = new Sprite();
        _this.bodySprite.drawGeometry = function (c) {
            // draw solid center
            c.beginPath();
            c.moveTo(0, -0.15);
            c.lineTo(0.05, -0.1);
            c.lineTo(0, 0.1);
            c.lineTo(-0.05, -0.1);
            c.fill();
            // draw outlines
            c.beginPath();
            for (var scale = -1; scale <= 1; scale += 2) {
                c.moveTo(0, -0.3);
                c.lineTo(scale * 0.05, -0.2);
                c.lineTo(scale * 0.1, -0.225);
                c.lineTo(scale * 0.1, -0.275);
                c.lineTo(scale * 0.15, -0.175);
                c.lineTo(0, 0.3);
                c.moveTo(0, -0.15);
                c.lineTo(scale * 0.05, -0.1);
                c.lineTo(0, 0.1);
            }
            c.stroke();
        };
        return _this;
    }
    ShockHawk.prototype.getTarget = function () { return target === gameState.playerB; };
    ShockHawk.prototype.setTarget = function (player) { this.target = player; };
    ShockHawk.prototype.avoidsSpawn = function () {
        if (this.chasing) {
            return false;
        }
        else {
            return true;
        }
    };
    ShockHawk.prototype.move = function (seconds) {
        // Time independent version of multiplying by 0.998
        // solved x^0.01 = 0.998 for x very precisely using wolfram alpha
        this.velocity.inplaceMul(Math.pow(0.8185668046884278157989334904543296243702023236680159019579, seconds));
        if (!this.target || this.target.isDead()) {
            this.chasing = false;
            return this.accelerate(this.velocity.mul(-SHOCK_HAWK_DECEL), seconds);
        }
        var relTargetPos = this.target.getCenter().sub(this.getCenter());
        if (relTargetPos.lengthSquared() > (SHOCK_HAWK_RANGE * SHOCK_HAWK_RANGE)) {
            this.chasing = false;
            return this.accelerate(this.velocity.mul(-SHOCK_HAWK_DECEL), seconds);
        }
        this.chasing = true;
        relTargetPos.normalize();
        var accel = relTargetPos.mul(SHOCK_HAWK_ACCEL);
        return this.accelerate(accel, seconds);
    };
    ShockHawk.prototype.onDeath = function () {
        gameState.incrementStat(STAT_ENEMY_DEATHS);
    };
    ShockHawk.prototype.afterTick = function (seconds) {
        var position = this.getCenter();
        this.bodySprite.offsetBeforeRotation = position;
        if (!this.target.isDead()) {
            this.bodySprite.angle = this.target.getCenter().sub(position).atan2() - Math.PI / 2;
        }
    };
    ShockHawk.prototype.draw = function (c) {
        c.fillStyle = (this.target == gameState.playerA) ? 'red' : 'blue';
        c.strokeStyle = 'black';
        this.bodySprite.draw(c);
    };
    return ShockHawk;
}(HoveringEnemy));
var SPIKE_BALL_RADIUS = 0.2;
function makeDrawSpikes(count) {
    var radii = [];
    for (var i = 0; i < count; i++) {
        radii.push(randInRange(0.5, 1.5));
    }
    return function (c) {
        c.strokeStyle = 'black';
        c.beginPath();
        for (var i = 0; i < count; i++) {
            var angle = i * (2 * Math.PI / count);
            var radius = SPIKE_BALL_RADIUS * radii[i];
            c.moveTo(0, 0);
            c.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
        c.stroke();
    };
}
// SpikeBall.subclasses(Enemy);
var SpikeBall = (function (_super) {
    __extends(SpikeBall, _super);
    function SpikeBall(center) {
        var _this = 
        //Enemy.prototype.constructor.call(this, ENEMY_SPIKE_BALL, 0);
        _super.call(this, ENEMY_SPIKE_BALL, 0) || this;
        _this.sprites = [new Sprite(), new Sprite(), new Sprite()];
        _this.hitCircle = new Circle(center, SPIKE_BALL_RADIUS);
        _this.sprites = [new Sprite(), new Sprite(), new Sprite()];
        _this.sprites[0].drawGeometry = makeDrawSpikes(11);
        _this.sprites[1].drawGeometry = makeDrawSpikes(13);
        _this.sprites[2].drawGeometry = makeDrawSpikes(7);
        _this.sprites[1].setParent(_this.sprites[0]);
        _this.sprites[2].setParent(_this.sprites[0]);
        _this.sprites[0].angle = randInRange(0, 2 * Math.PI);
        _this.sprites[1].angle = randInRange(0, 2 * Math.PI);
        _this.sprites[2].angle = randInRange(0, 2 * Math.PI);
        return _this;
    }
    SpikeBall.prototype.getShape = function () { return this.hitCircle; };
    SpikeBall.prototype.canCollide = function () { return false; };
    SpikeBall.prototype.afterTick = function (seconds) {
        this.sprites[0].offsetBeforeRotation = this.getCenter();
        this.sprites[0].angle -= seconds * (25 * Math.PI / 180);
        this.sprites[1].angle += seconds * (65 * Math.PI / 180);
        this.sprites[2].angle += seconds * (15 * Math.PI / 180);
    };
    SpikeBall.prototype.draw = function (c) {
        this.sprites[0].draw(c);
    };
    return SpikeBall;
}(Enemy));
var STALACBAT_RADIUS = 0.2;
var STALACBAT_SPEED = 2;
var STALACBAT_SPRITE_BODY = 0;
var STALACBAT_SPRITE_LEFT_WING = 1;
var STALACBAT_SPRITE_RIGHT_WING = 2;
// Stalacbat.subclasses(FreefallEnemy);
var Stalacbat = (function (_super) {
    __extends(Stalacbat, _super);
    function Stalacbat(center, target) {
        var _this = 
        //FreefallEnemy.prototype.constructor.call(this, ENEMY_STALACBAT, center, STALACBAT_RADIUS, 0);
        _super.call(this, ENEMY_STALACBAT, center, STALACBAT_RADIUS, 0) || this;
        _this.target = target;
        _this.isFalling = false;
        _this.sprites = [new Sprite(), new Sprite(), new Sprite()];
        // Draw circle for body
        _this.sprites[STALACBAT_SPRITE_BODY].drawGeometry = function (c) {
            c.strokeStyle = 'black';
            c.beginPath();
            c.arc(0, 0, 0.1, 0, 2 * Math.PI, false);
            c.stroke();
            c.fill();
        };
        // Draw the two wings 
        _this.sprites[STALACBAT_SPRITE_LEFT_WING].drawGeometry = _this.sprites[STALACBAT_SPRITE_RIGHT_WING].drawGeometry = function (c) {
            c.strokeStyle = 'black';
            c.beginPath();
            c.arc(0, 0, 0.2, 0, Math.PI / 2, false);
            c.arc(0, 0, 0.15, Math.PI / 2, 0, true);
            c.stroke();
            c.beginPath();
            c.moveTo(0.07, 0.07);
            c.lineTo(0.1, 0.1);
            c.stroke();
        };
        _this.sprites[STALACBAT_SPRITE_LEFT_WING].setParent(_this.sprites[STALACBAT_SPRITE_BODY]);
        _this.sprites[STALACBAT_SPRITE_RIGHT_WING].setParent(_this.sprites[STALACBAT_SPRITE_BODY]);
        return _this;
    }
    // Falls when the target is directly beneat it
    Stalacbat.prototype.move = function (seconds) {
        if (this.isFalling) {
            return FreefallEnemy.prototype.move.call(this, seconds);
        }
        else if (this.target !== null && !this.target.isDead()) {
            var playerPos = this.target.getCenter();
            var pos = this.getCenter();
            if ((Math.abs(playerPos.x - pos.x) < 0.1) && (playerPos.y < pos.y)) {
                if (!CollisionDetector.lineOfSightWorld(pos, playerPos, gameState.world)) {
                    this.isFalling = true;
                    return FreefallEnemy.prototype.move.call(this, seconds);
                }
            }
        }
        return new Vector(0, 0);
    };
    Stalacbat.prototype.getTarget = function () {
        return this.target === gameState.playerB;
    };
    Stalacbat.prototype.afterTick = function (seconds) {
        var percent = this.velocity.y * -0.25;
        if (percent > 1) {
            percent = 1;
        }
        var position = this.getCenter();
        this.sprites[STALACBAT_SPRITE_BODY].offsetBeforeRotation = new Vector(position.x, position.y + 0.1 - 0.2 * percent);
        var angle = percent * Math.PI / 2;
        this.sprites[STALACBAT_SPRITE_LEFT_WING].angle = Math.PI - angle;
        this.sprites[STALACBAT_SPRITE_RIGHT_WING].angle = angle - Math.PI / 2;
    };
    Stalacbat.prototype.onDeath = function () {
        gameState.incrementStat(STAT_ENEMY_DEATHS);
        var isRed = (this.target === gameState.playerA) ? 0.8 : 0;
        var isBlue = (this.target === gameState.playerB) ? 1 : 0;
        var position = this.getCenter();
        for (var i = 0; i < 15; ++i) {
            var direction = Vector.fromAngle(randInRange(0, 2 * Math.PI)).mul(randInRange(5, 10));
            Particle().position(position).velocity(direction).radius(0.2).bounces(3).decay(0.01).elasticity(0.5).color(isRed, 0, isBlue, 1).triangle();
        }
    };
    Stalacbat.prototype.draw = function (c) {
        // Draw the colored "eye"
        if (this.target === gameState.playerA) {
            c.fillStyle = 'red';
        }
        else {
            c.fillStyle = 'blue';
        }
        // Draw the black wings
        this.sprites[STALACBAT_SPRITE_BODY].draw(c);
    };
    return Stalacbat;
}(FreefallEnemy));
///<reference path="./Enemy.ts" />
//WalkingEnemy.subclasses(Enemy);
var WalkingEnemy = (function (_super) {
    __extends(WalkingEnemy, _super);
    function WalkingEnemy(type, center, radius, elasticity) {
        var _this = 
        // Enemy.prototype.constructor.call(this, type, elasticity);
        _super.call(this, type, elasticity) || this;
        _this.hitCircle = new Circle(center, radius);
        return _this;
    }
    WalkingEnemy.prototype.getShape = function () {
        return this.hitCircle;
    };
    WalkingEnemy.prototype.move = function (seconds) {
        return this.velocity.mul(seconds);
    };
    return WalkingEnemy;
}(Enemy));
///<reference path="./WalkingEnemy.ts" />
var WALL_CRAWLER_SPEED = 1;
var WALL_CRAWLER_RADIUS = 0.25;
var PULL_FACTOR = 0.9;
var PUSH_FACTOR = 0.11;
// WallCrawler.subclasses(WalkingEnemy);
var WallCrawler = (function (_super) {
    __extends(WallCrawler, _super);
    function WallCrawler(center, direction) {
        var _this = 
        //WalkingEnemy.prototype.constructor.call(this, ENEMY_CRAWLER, center, WALL_CRAWLER_RADIUS, 0);
        _super.call(this, ENEMY_CRAWLER, center, WALL_CRAWLER_RADIUS, 0) || this;
        _this.firstTick = true;
        _this.clockwise = false;
        _this.firstTick = true;
        _this.clockwise = false;
        _this.velocity = new Vector(Math.cos(direction), Math.sin(direction));
        _this.bodySprite = new Sprite();
        _this.bodySprite.drawGeometry = function (c) {
            var space = 0.15;
            c.fillStyle = 'black';
            c.strokeStyle = 'black';
            c.beginPath();
            c.arc(0, 0, 0.25, Math.PI * 0.25 + space, Math.PI * 0.75 - space, false);
            c.stroke();
            c.beginPath();
            c.arc(0, 0, 0.25, Math.PI * 0.75 + space, Math.PI * 1.25 - space, false);
            c.stroke();
            c.beginPath();
            c.arc(0, 0, 0.25, Math.PI * 1.25 + space, Math.PI * 1.75 - space, false);
            c.stroke();
            c.beginPath();
            c.arc(0, 0, 0.25, Math.PI * 1.75 + space, Math.PI * 2.25 - space, false);
            c.stroke();
            c.beginPath();
            c.arc(0, 0, 0.15, 0, 2 * Math.PI, false);
            c.stroke();
            c.beginPath();
            c.moveTo(0.15, 0);
            c.lineTo(0.25, 0);
            c.moveTo(0, 0.15);
            c.lineTo(0, 0.25);
            c.moveTo(-0.15, 0);
            c.lineTo(-0.25, 0);
            c.moveTo(0, -0.15);
            c.lineTo(0, -0.25);
            c.stroke();
            c.beginPath();
            c.arc(0, 0, 0.05, 0, 2 * Math.PI, false);
            c.fill();
        };
        return _this;
    }
    // Rotates about the closest point in the world
    WallCrawler.prototype.move = function (seconds) {
        var ref_shapePoint = {};
        var ref_worldPoint = {};
        var closestPointDist = CollisionDetector.closestToEntityWorld(this, 2, ref_shapePoint, ref_worldPoint, gameState.world);
        if (closestPointDist < Number.POSITIVE_INFINITY) {
            var delta = this.getCenter().sub(ref_worldPoint.ref);
            // Make sure it doesn't get too far away or get stuck in corners
            var flip = delta.flip();
            if (this.firstTick) {
                if (this.velocity.dot(flip) < 0)
                    this.clockwise = true;
                else
                    this.clockwise = false;
                this.firstTick = false;
            }
            if (delta.lengthSquared() > (WALL_CRAWLER_RADIUS * WALL_CRAWLER_RADIUS * 1.1)) {
                // Pull the crawler towards the wall
                if (this.clockwise)
                    this.velocity = flip.mul(-1).sub(delta.mul(PULL_FACTOR));
                else
                    this.velocity = flip.sub(delta.mul(PULL_FACTOR));
            }
            else {
                // Push the crawler away from the wall
                if (this.clockwise)
                    this.velocity = flip.mul(-1).add(delta.mul(PUSH_FACTOR));
                else
                    this.velocity = flip.add(delta.mul(PUSH_FACTOR));
            }
            this.velocity.normalize();
        }
        return this.velocity.mul(WALL_CRAWLER_SPEED * seconds);
    };
    WallCrawler.prototype.afterTick = function (seconds) {
        var deltaAngle = WALL_CRAWLER_SPEED / WALL_CRAWLER_RADIUS * seconds;
        this.bodySprite.offsetBeforeRotation = this.getCenter();
        if (this.clockwise)
            this.bodySprite.angle += deltaAngle;
        else
            this.bodySprite.angle -= deltaAngle;
    };
    WallCrawler.prototype.draw = function (c) {
        this.bodySprite.draw(c);
    };
    return WallCrawler;
}(WalkingEnemy));
///<reference path="./WalkingEnemy.ts" />
var WHEELIGATOR_RADIUS = 0.3;
var WHEELIGATOR_SPEED = 3;
var WHEELIGATOR_ELASTICITY = 1;
var WHEELIGATOR_FLOOR_ELASTICITY = 0.3;
//Wheeligator.subclasses(WalkingEnemy);
var Wheeligator = (function (_super) {
    __extends(Wheeligator, _super);
    function Wheeligator(center, angle) {
        var _this = 
        //WalkingEnemy.prototype.constructor.call(this, ENEMY_WHEELIGATOR, center, WHEELIGATOR_RADIUS, WHEELIGATOR_ELASTICITY);
        _super.call(this, ENEMY_WHEELIGATOR, center, WHEELIGATOR_RADIUS, WHEELIGATOR_ELASTICITY) || this;
        _this.hitGround = false;
        _this.angularVelocity = 0;
        _this.startsRight = (Math.cos(angle) > 0);
        _this.bodySprite = new Sprite();
        _this.bodySprite.drawGeometry = function (c) {
            var rim = 0.1;
            c.strokeStyle = 'black';
            c.beginPath();
            c.arc(0, 0, WHEELIGATOR_RADIUS, 0, 2 * Math.PI, false);
            c.arc(0, 0, WHEELIGATOR_RADIUS - rim, Math.PI, 3 * Math.PI, false);
            c.stroke();
            c.fillStyle = 'black';
            for (var i = 0; i < 4; i++) {
                var startAngle = i * (2 * Math.PI / 4);
                var endAngle = startAngle + Math.PI / 4;
                c.beginPath();
                c.arc(0, 0, WHEELIGATOR_RADIUS, startAngle, endAngle, false);
                c.arc(0, 0, WHEELIGATOR_RADIUS - rim, endAngle, startAngle, true);
                c.fill();
            }
        };
        return _this;
    }
    Wheeligator.prototype.move = function (seconds) {
        var isOnFloor = this.isOnFloor();
        if (!this.hitGround && isOnFloor) {
            if (this.velocity.x < WHEELIGATOR_SPEED) {
                this.velocity.x = this.startsRight ? WHEELIGATOR_SPEED : -WHEELIGATOR_SPEED;
                this.hitGround = true;
            }
        }
        if (isOnFloor) {
            this.angularVelocity = -this.velocity.x / WHEELIGATOR_RADIUS;
        }
        this.velocity.y += (FREEFALL_ACCEL * seconds);
        return this.velocity.mul(seconds);
    };
    Wheeligator.prototype.reactToWorld = function (contact) {
        // If a floor, bounce off like elasticity is FLOOR_ELASTICITY
        if (Edge.getOrientation(contact.normal) === EDGE_FLOOR) {
            var perpendicular = this.velocity.projectOntoAUnitVector(contact.normal);
            var parallel = this.velocity.sub(perpendicular);
            this.velocity = parallel.add(perpendicular.mul(WHEELIGATOR_FLOOR_ELASTICITY));
            this.angularVelocity = -this.velocity.x / WHEELIGATOR_RADIUS;
        }
    };
    Wheeligator.prototype.afterTick = function (seconds) {
        this.bodySprite.offsetBeforeRotation = this.getCenter();
        this.bodySprite.angle = this.bodySprite.angle + this.angularVelocity * seconds;
    };
    Wheeligator.prototype.draw = function (c) {
        var pos = this.getCenter();
        this.bodySprite.draw(c);
    };
    return Wheeligator;
}(WalkingEnemy));
// caching strategy: cache the level background around each player on two
// canvases twice the size of the screen and re-center them as needed
// FPS data:
// ff = Firefox 4.0b7 on Mac 10.6.5
// ch = Chrome 9.0.597.42 beta on Mac 10.6.5
// fixed physics tick
//
// Level		   |  ff cache	|  ff no cache	|  ch cache  |	ch no cache
// ----------------+------------+---------------+------------+---------------
// Intro 1 (whole) |	 38		|	   52		|	  56	 |		60
// Intro 1 (split) |	 26		|	   32		|	  33	 |		46
// Cube (whole)    |	  9		|		9		|	  36	 |		43
// Cube (split)    |	  5		|		6		|	  15	 |		17
// variable physics tick (note: while this improved speed in ff quite a bit,
// physics were noticably wrong -- wall crawlers got stuck and wheeligators
// would hop up and down while rolling)
//
// Level		   |  ff cache	|  ff no cache	|  ch cache  |	ch no cache
// ----------------+------------+---------------+------------+---------------
// Intro 1 (whole) |	 40		|	   60		|	  56	 |		60
// Intro 1 (split) |	 28		|	   38		|	  34	 |		44
// Cube (whole)    |	 26		|	   28		|	  37	 |		43
// Cube (split)    |	 17		|	   14		|	  20	 |		20
// class BackgroundCache
var BackgroundCache = (function () {
    function BackgroundCache(name) {
        // create a <canvas>, unless we already created one in a previous game
        var id = 'background-cache-' + name;
        this.canvas = document.getElementById(id);
        if (this.canvas === null) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = id;
            this.canvas.style.display = 'none';
            document.body.appendChild(this.canvas);
        }
        this.c = this.canvas.getContext('2d');
        // the cache is empty at first
        this.xmin = 0;
        this.ymin = 0;
        this.xmax = 0;
        this.ymax = 0;
        this.width = 0;
        this.height = 0;
        this.ratio = 0;
        this.modificationCount = -1;
    }
    BackgroundCache.prototype.draw = function (c, xmin, ymin, xmax, ymax) {
        var ratio = globalScaleFactor(); // Retina support
        // if cache is invalid, update cache
        if (this.modificationCount != gameState.modificationCount || xmin < this.xmin || xmax > this.xmax || ymin < this.ymin || ymax > this.ymax || this.ratio != ratio) {
            this.modificationCount = gameState.modificationCount;
            // set bounds of cached image
            var viewportWidth = 2 * (xmax - xmin);
            var viewportHeight = 2 * (ymax - ymin);
            this.xmin = xmin - viewportWidth / 4;
            this.ymin = ymin - viewportHeight / 4;
            this.xmax = xmax + viewportWidth / 4;
            this.ymax = ymax + viewportHeight / 4;
            // resize canvas bigger if needed
            var width = Math.ceil(viewportWidth * gameScale);
            var height = Math.ceil(viewportHeight * gameScale);
            this.width = width;
            this.height = height;
            this.canvas.width = Math.round(this.width * ratio);
            this.canvas.height = Math.round(this.height * ratio);
            this.c.scale(ratio, ratio);
            // clear the background
            this.c.fillStyle = '#BFBFBF';
            this.c.fillRect(0, 0, width, height);
            // set up transform
            this.c.save();
            this.c.translate(width / 2, height / 2);
            this.c.scale(gameScale, -gameScale);
            this.c.lineWidth = 1 / gameScale;
            // render
            this.c.translate(-(this.xmin + this.xmax) / 2, -(this.ymin + this.ymax) / 2);
            gameState.world.draw(this.c, this.xmin, this.ymin, this.xmax, this.ymax);
            // undo transform
            this.c.restore();
        }
        // draw from cache
        // for performance, we MUST make sure the image is drawn at an integer coordinate to take
        // advantage of fast blitting, otherwise browsers will use slow software bilinear interpolation
        c.mozImageSmoothingEnabled = false;
        c.save();
        var ratio = globalScaleFactor(); // Retina support
        c.setTransform(ratio, 0, 0, ratio, 0, 0);
        c.drawImage(this.canvas, Math.round((this.xmin - xmin) * gameScale), Math.round((2 * ymin - ymax - this.ymin) * gameScale), this.width, this.height);
        c.restore();
    };
    return BackgroundCache;
}());
var useBackgroundCache = true;
// Clip a rectangular w by h polygon by a line passing though split and the origin:
//
//	+-----+---+
//	| A  /	B |
//	+---+-----+
//
// Pass split to get region A and -split to get region B.  This is necessary likely
// because Firefox 4.0b8 renders to an internal buffer bounding the clipping polygon,
// but the polygon isn't clipped to the canvas before being bounded.  Before this,
// we were just drawing a huge polygon 99999 units across and not bothering to tightly
// wrap the canvas, but Firefox was crashing.
function clipHelper(c, w, h, split) {
    var tx = h / split.y;
    var ty = w / split.x;
    c.beginPath();
    if ((-w) * split.y - (-h) * split.x >= 0)
        c.lineTo(-w, -h);
    if (Math.abs(split.y * ty) <= h)
        c.lineTo(-split.x * ty, -split.y * ty);
    if ((-w) * split.y - (+h) * split.x >= 0)
        c.lineTo(-w, +h);
    if (Math.abs(split.x * tx) <= w)
        c.lineTo(split.x * tx, split.y * tx);
    if ((+w) * split.y - (+h) * split.x >= 0)
        c.lineTo(+w, +h);
    if (Math.abs(split.y * ty) <= h)
        c.lineTo(split.x * ty, split.y * ty);
    if ((+w) * split.y - (-h) * split.x >= 0)
        c.lineTo(+w, -h);
    if (Math.abs(split.x * tx) <= w)
        c.lineTo(-split.x * tx, -split.y * tx);
    c.closePath();
    c.clip();
}
// class SplitScreenCamera
var SplitScreenCamera = (function () {
    function SplitScreenCamera(playerA, playerB, width, height) {
        //this.playerA = playerA;
        //this.playerB = playerB;
        //this.width = width;
        //this.height = height;
        this.playerA = playerA;
        this.playerB = playerB;
        this.width = width;
        this.height = height;
        if (useBackgroundCache) {
            this.backgroundCacheA = new BackgroundCache('a');
            this.backgroundCacheB = new BackgroundCache('b');
        }
        else {
            this.backgroundCacheA = null;
            this.backgroundCacheB = null;
        }
    }
    SplitScreenCamera.prototype.draw = function (c, renderer) {
        var positionA = this.playerA.getCenter();
        var positionB = this.playerB.getCenter();
        var center = positionA.add(positionB).div(2);
        // maximum distance between a player and the center is the distance to the box that is half the size of the screen
        var temp = positionB.sub(positionA).unit();
        temp = new Vector(this.width / Math.abs(temp.x), this.height / Math.abs(temp.y));
        var maxLength = Math.min(temp.x, temp.y) / 4;
        var isSplit = (positionB.sub(positionA).lengthSquared() > 4 * maxLength * maxLength);
        if (!isSplit) {
            renderer.render(c, center, this.width, this.height, this.backgroundCacheA);
        }
        else {
            var AtoB = positionB.sub(positionA).unit().mul(99);
            var split = AtoB.flip();
            // make sure a's center isn't more than maxLength from positionA
            var centerA = center.sub(positionA);
            if (centerA.lengthSquared() > maxLength * maxLength)
                centerA = centerA.unit().mul(maxLength);
            centerA = centerA.add(positionA);
            // make sure b's center isn't more than maxLength from positionB
            var centerB = center.sub(positionB);
            if (centerB.lengthSquared() > maxLength * maxLength)
                centerB = centerB.unit().mul(maxLength);
            centerB = centerB.add(positionB);
            // draw world from a's point of view
            c.save();
            clipHelper(c, this.width / 2, this.height / 2, split);
            renderer.render(c, centerA, this.width, this.height, this.backgroundCacheA);
            c.restore();
            // draw world from b's point of view
            c.save();
            clipHelper(c, this.width / 2, this.height / 2, split.mul(-1));
            renderer.render(c, centerB, this.width, this.height, this.backgroundCacheB);
            c.restore();
            // divide both player's view with a black line
            var splitSize = Math.min(0.1, (positionB.sub(positionA).length() - 1.9 * maxLength) * 0.01);
            c.save();
            c.lineWidth = 2 * splitSize;
            c.strokeStyle = 'black';
            c.beginPath();
            c.moveTo(-split.x, -split.y);
            c.lineTo(split.x, split.y);
            c.stroke();
            c.restore();
        }
    };
    return SplitScreenCamera;
}());
var Camera = SplitScreenCamera;
// abstract class Screen
var Screen = (function () {
    function Screen() {
    }
    Screen.prototype.tick = function (seconds) { };
    Screen.prototype.draw = function (c) { };
    Screen.prototype.resize = function (w, h) { };
    Screen.prototype.keyDown = function (key) { };
    Screen.prototype.keyUp = function (key) { };
    return Screen;
}());
///<reference path="./screen.ts" /> 
var gameScale = 50;
// text constants
var GAME_WIN_TEXT = "You won!  Hit SPACE to play the next level or ESC for the level selection menu.";
var GOLDEN_COG_TEXT = "You earned a golden cog!";
var SILVER_COG_TEXT = "You earned a silver cog!";
var GAME_LOSS_TEXT = "You lost.  Hit SPACE to restart, or ESC to select a new level.";
var TEXT_BOX_X_MARGIN = 6;
var TEXT_BOX_Y_MARGIN = 6;
var SECONDS_BETWEEN_TICKS = 1 / 60;
var useFixedPhysicsTick = true;
// Draw a text box, takes in an array of lines
function drawTextBox(c, textArray, xCenter, yCenter, textSize) {
    var numLines = textArray.length;
    if (numLines < 1)
        return;
    // Calculate the height of all lines and the widest line's width
    c.font = textSize + 'px Arial, sans-serif';
    var lineHeight = textSize + 2;
    var textHeight = lineHeight * numLines;
    var textWidth = -1;
    for (var i = 0; i < numLines; ++i) {
        var currWidth = c.measureText(textArray[i]).width;
        if (textWidth < currWidth) {
            textWidth = currWidth;
        }
    }
    // Draw the box
    c.fillStyle = '#BFBFBF';
    c.strokeStyle = '#7F7F7F';
    c.lineWidth = 1;
    var xLeft = xCenter - textWidth / 2 - TEXT_BOX_X_MARGIN;
    var yBottom = yCenter - textHeight / 2 - TEXT_BOX_Y_MARGIN;
    c.fillRect(xLeft, yBottom, textWidth + TEXT_BOX_X_MARGIN * 2, textHeight + TEXT_BOX_Y_MARGIN * 2);
    c.strokeRect(xLeft, yBottom, textWidth + TEXT_BOX_X_MARGIN * 2, textHeight + TEXT_BOX_Y_MARGIN * 2);
    // Draw the text
    c.fillStyle = 'black';
    c.textAlign = 'center';
    // yCurr starts at the top, so subtract half of height of box
    var yCurr = yCenter + 4 - (numLines - 1) * lineHeight / 2;
    for (var i = 0; i < numLines; ++i) {
        c.fillText(textArray[i], xCenter, yCurr);
        yCurr += lineHeight;
    }
}
// Game.subclasses(Screen);
// class Game extends Screen
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this) || this;
        _this.camera = new Camera();
        _this.fps = 0;
        _this.fixedPhysicsTick = 0;
        _this.isDone = false;
        _this.onWin = null;
        _this.lastLevel = false;
        _this.camera = new Camera();
        _this.fps = 0;
        _this.fixedPhysicsTick = 0;
        _this.isDone = false;
        _this.onWin = null;
        // whether this game is the last level in the menu, this will be updated by main.js when the menu loads
        _this.lastLevel = false;
        gameState = new GameState();
        return _this;
    }
    Game.prototype.resize = function (w, h) {
        this.width = w;
        this.height = h;
        this.camera = new Camera(gameState.playerA, gameState.playerB, w / gameScale, h / gameScale);
    };
    Game.prototype.tick = function (seconds) {
        // when the screen isn't split, standing at the original spawn point:
        // * Triple Threat
        //	 - variable physics tick: 30 FPS
        //	 - fixed physics tick: 25 FPS
        // * Cube
        //	 - variable physics tick: 35 FPS
        //	 - fixed physics tick: 30 FPS
        // * Coordinated Panic
        //	 - variable physics tick: 55 FPS
        //	 - fixed physics tick: 50 FPS
        // overall, a fixed physics tick provides about 5 FPS drop but fixes a lot of
        // gameplay issues (measurements above approximate but within about +/-1)
        if (useFixedPhysicsTick) {
            // fixed physics tick
            var count = 0;
            this.fixedPhysicsTick += seconds;
            while (++count <= 3 && this.fixedPhysicsTick >= 0) {
                this.fixedPhysicsTick -= SECONDS_BETWEEN_TICKS;
                gameState.tick(SECONDS_BETWEEN_TICKS);
                Particle.tick(SECONDS_BETWEEN_TICKS);
            }
        }
        else {
            // variable physics tick
            gameState.tick(seconds);
            Particle.tick(seconds);
        }
        // smooth the fps a bit
        this.fps = lerp(this.fps, 1 / seconds, 0.05);
        // handle winning the game
        if (!this.isDone && gameState.gameStatus != GAME_IN_PLAY) {
            this.isDone = true;
            if (gameState.gameStatus == GAME_WON && this.onWin) {
                this.onWin();
            }
        }
    };
    Game.prototype.render = function (c, center, width, height, backgroundCache) {
        var halfWidth = width / 2;
        var halfHeight = height / 2;
        var xmin = center.x - halfWidth;
        var ymin = center.y - halfHeight;
        var xmax = center.x + halfWidth;
        var ymax = center.y + halfHeight;
        c.save();
        c.translate(-center.x, -center.y);
        // draw the background, backgroundCache is an optional argument
        if (backgroundCache) {
            backgroundCache.draw(c, xmin, ymin, xmax, ymax);
        }
        else {
            gameState.world.draw(c, xmin, ymin, xmax, ymax);
        }
        gameState.draw(c, xmin, ymin, xmax, ymax);
        Particle.draw(c);
        c.restore();
    };
    Game.prototype.draw = function (c) {
        if (!useBackgroundCache) {
            // clear the background
            c.fillStyle = '#BFBFBF';
            c.fillRect(0, 0, this.width, this.height);
        }
        // draw the game
        c.save();
        c.translate(this.width / 2, this.height / 2);
        c.scale(gameScale, -gameScale);
        c.lineWidth = 1 / gameScale;
        this.camera.draw(c, this);
        c.restore();
        if (gameState.gameStatus === GAME_WON) {
            // draw winning text
            c.save();
            var gameWinText = (this.lastLevel ? "Congratulations, you beat the last level in this set!	Press SPACE or ESC to return to the level selection menu." : GAME_WIN_TEXT);
            var cogsCollectedText = "Cogs Collected: " + gameState.stats[STAT_COGS_COLLECTED] + "/" + gameState.stats[STAT_NUM_COGS];
            drawTextBox(c, [gameWinText, "", cogsCollectedText], this.width / 2, this.height / 2, 14);
            c.restore();
        }
        else if (gameState.gameStatus === GAME_LOST) {
            // draw losing text
            c.save();
            drawTextBox(c, [GAME_LOSS_TEXT], this.width / 2, this.height / 2, 14);
            c.restore();
        }
        // draw the fps counter
        c.font = '10px Arial, sans-serif';
        c.fillStyle = 'black';
        var text = this.fps.toFixed(0) + ' FPS';
        c.fillText(text, this.width - 5 - c.measureText(text).width, this.height - 5);
    };
    Game.prototype.keyDown = function (e) {
        var keyCode = e.which;
        var action = Keys.fromKeyCode(keyCode);
        if (action != null) {
            if (action.indexOf('a-') == 0)
                gameState.playerA[action.substr(2)] = true;
            else if (action.indexOf('b-') == 0)
                gameState.playerB[action.substr(2)] = true;
            else
                gameState[action] = true;
            e.preventDefault();
            e.stopPropagation();
        }
    };
    Game.prototype.keyUp = function (e) {
        var keyCode = e.which;
        var action = Keys.fromKeyCode(keyCode);
        if (action != null) {
            if (action.indexOf('a-') == 0)
                gameState.playerA[action.substr(2)] = false;
            else if (action.indexOf('b-') == 0)
                gameState.playerB[action.substr(2)] = false;
            else
                gameState[action] = false;
            e.preventDefault();
            e.stopPropagation();
        }
    };
    return Game;
}(Screen));
function toTitleCase(s) {
    return s.toLowerCase().replace(/^(.)|\s(.)/g, function ($1) { return $1.toUpperCase(); });
}
var Keys = {
    keyMap: {
        'killKey': 75,
        // player a
        'a-jumpKey': 38,
        'a-crouchKey': 40,
        'a-leftKey': 37,
        'a-rightKey': 39,
        // player b
        'b-jumpKey': 87,
        'b-crouchKey': 83,
        'b-leftKey': 65,
        'b-rightKey': 68 // d key
    },
    fromKeyCode: function (keyCode) {
        for (var name in this.keyMap) {
            if (keyCode == this.keyMap[name]) {
                return name;
            }
        }
        return null;
    },
    keyCodeHTML: function (keyCode) {
        var name = keyCodeArray[keyCode] || '&iquest;';
        var html = toTitleCase(name).replace(' ', '<br>');
        if (html.charAt(0) != '&' && html.length > 1) {
            html = '<div style="' + (html.indexOf('<br>') != -1 ? 'padding-top:10px;line-height:15px;' : '') +
                'font-size:' + (html.length <= 3 ? 25 : html.length <= 5 ? 18 : 15).toFixed() + 'px;">' + html + '</div>';
        }
        return html;
    },
    load: function () {
        for (var name in this.keyMap) {
            var keyCode = parseInt(getLocalStorage(name), 10);
            if (!isNaN(keyCode)) {
                this.keyMap[name] = keyCode;
            }
        }
        this.updateHTML();
    },
    save: function () {
        for (var name in this.keyMap) {
            setLocalStorage(name, this.keyMap[name]);
        }
        this.updateHTML();
    },
    updateHTML: function () {
        for (var name in this.keyMap) {
            $('#' + name).html(this.keyCodeHTML(this.keyMap[name]));
        }
    }
};
var ENTER_KEY = 13;
var ESCAPE_KEY = 27;
var SPACEBAR = 32;
var UP_ARROW = 38;
var DOWN_ARROW = 40;
function getMenuUrl(username) { return '//' + location.host + '/data/' + username + '/'; }
function getLevelUrl(username, levelname) {
    // return '//' + location.host + '/data/' + username + '/' + levelname + '/';
    return '//' + location.host + '/data/' + "Intro 4.json";
}
function text2html(text) {
    return text ? text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') : '';
}
// get json data via ajax
function ajaxGet(what, url, onSuccess) {
    function showError() {
        $('#loadingScreen').html('Could not load ' + what + ' from<br><b>' + text2html(url) + '</b>');
    }
    $.ajax({
        'url': url,
        'type': 'GET',
        'cache': false,
        'dataType': 'json',
        'success': function (data, status, request) {
            if (data != null) {
                onSuccess(data);
            }
            else {
                showError();
            }
        },
        'error': function (request, status, error) {
            showError();
        }
    });
}
function globalScaleFactor() {
    // return window['devicePixelRatio']; // This is too slow T_T
    return 1;
}
////////////////////////////////////////////////////////////////////////////////
// class MenuItem
////////////////////////////////////////////////////////////////////////////////
function MenuItem(levelname, title, difficulty) {
    this.levelname = levelname;
    this.title = title;
    this.difficulty = difficulty;
}
////////////////////////////////////////////////////////////////////////////////
// class Menu
////////////////////////////////////////////////////////////////////////////////
function Menu() {
    this.username = null;
    this.items = [];
    this.isLoading = false;
    this.selectedIndex = -1;
}
Menu.prototype.load = function (username, onSuccess) {
    // Don't reload the menu if we just loaded it
    if (!this.isLoading && this.username == username) {
        if (onSuccess)
            onSuccess();
        return;
    }
    // Don't reload the menu if we're already loading it
    if (this.isLoading && this.username == username) {
        return;
    }
    this.username = username;
    this.items = [];
    this.isLoading = true;
    var this_ = this;
    ajaxGet('menu', getMenuUrl(username), function (json) {
        var levels = json['levels'];
        for (var i = 0; i < levels.length; i++) {
            var level = levels[i];
            this_.items.push(new MenuItem(level['html_title'], level['title'], level['difficulty']));
        }
        this_.isLoading = false;
        this_.selectedIndex = 0;
        if (onSuccess)
            onSuccess();
    });
};
Menu.prototype.updateSelectedIndex = function () {
    var selectedLevel = $('#level' + this.selectedIndex);
    if (selectedLevel.length > 0) {
        $('.level').blur();
        $(selectedLevel).focus();
        // no idea why 475 is the magic number that centers the selected level, but not going to worry about it
        var scrollTop = $('#levelScreen').scrollTop() + $(selectedLevel).offset().top - 475;
        $('#levelScreen').scrollTop(scrollTop);
    }
};
Menu.prototype.show = function () {
    if (this.isLoading) {
        $('#canvas').hide();
        $('#levelScreen').hide();
        $('#loadingScreen').show();
        $('#loadingScreen').html('Loading...');
    }
    else {
        $('#canvas').hide();
        $('#levelScreen').show();
        $('#loadingScreen').hide();
        var html = '<h2>';
        html += (this.username == 'rapt') ? 'Official Levels' : 'Levels made by ' + text2html(this.username);
        html += '</h2><div id="levels">';
        var prevDifficulty = null;
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            var difficulty = ['Easy', 'Medium', 'Hard', 'Brutal', 'Demoralizing'][item.difficulty];
            if (difficulty != prevDifficulty) {
                prevDifficulty = difficulty;
                html += '<div class="difficulty">' + difficulty + '</div>';
            }
            html += '<a class="level" id="level' + i + '" href="' + text2html(Hash.getLevelHash(this.username, item.levelname)) + '">';
            var s = stats.getStatsForLevel(this.username, item.levelname);
            html += '<img src="/images/' + (s['gotAllCogs'] ? 'checkplus' : s['complete'] ? 'check' : 'empty') + '.png">';
            html += text2html(item.title) + '</a>';
        }
        html += '</div>';
        $('#levelScreen').html(html);
        var this_ = this;
        $('.level').hover(function () {
            $(this).focus();
        });
        $('.level').focus(function () {
            this_.selectedIndex = this.id.substr(5); // remove "level"
        });
        this.updateSelectedIndex();
    }
};
Menu.prototype.indexOfLevel = function (username, levelname) {
    if (username === this.username) {
        for (var i = 0; i < this.items.length; i++) {
            if (levelname === this.items[i].levelname) {
                return i;
            }
        }
    }
    return -1;
};
Menu.prototype.isLastLevel = function (username, levelname) {
    if (username !== this.username) {
        // This level is in some other menu, so return true (it is the last level)
        // so pressing spacebar takes the user back to that other menu
        return true;
    }
    else {
        return this.indexOfLevel(username, levelname) >= this.items.length - 1;
    }
};
Menu.prototype.keyDown = function (e) {
    if (e.which == UP_ARROW) {
        if (this.selectedIndex > 0)
            this.selectedIndex--;
        this.updateSelectedIndex();
    }
    else if (e.which == DOWN_ARROW) {
        if (this.selectedIndex < this.items.length - 1)
            this.selectedIndex++;
        this.updateSelectedIndex();
    }
};
Menu.prototype.keyUp = function (e) {
};
////////////////////////////////////////////////////////////////////////////////
// class Level
////////////////////////////////////////////////////////////////////////////////
function Level() {
    this.username = null;
    this.levelname = null;
    this.isLoading = false;
    this.width = 800;
    this.height = 600;
    this.ratio = 0;
    // set up the canvas
    this.canvas = $('#canvas')[0];
    this.context = this.canvas.getContext('2d');
    this.lastTime = new Date();
    this.game = null;
    this.json = null;
}
Level.prototype.tick = function () {
    var currentTime = new Date();
    var seconds = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    // Retina support
    var ratio = globalScaleFactor();
    if (ratio != this.ratio) {
        this.canvas.width = Math.round(this.width * ratio);
        this.canvas.height = Math.round(this.height * ratio);
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        this.context.scale(ratio, ratio);
    }
    if (this.game != null) {
        // if the computer goes to sleep, act like the game was paused
        if (seconds > 0 && seconds < 1)
            this.game.tick(seconds);
        this.game.lastLevel = menu.isLastLevel(this.username, this.levelname);
        this.game.draw(this.context);
    }
};
Level.prototype.restart = function () {
    Particle.reset();
    this.game = new Game();
    this.game.resize(this.width, this.height);
    gameState.loadLevelFromJSON(this.json);
    // add the check mark on the level menu when this level is won
    var this_ = this;
    this.game.onWin = function () {
        var gotAllCogs = gameState.stats[STAT_COGS_COLLECTED] == gameState.stats[STAT_NUM_COGS];
        var s = stats.getStatsForLevel(this_.username, this_.levelname);
        stats.setStatsForLevel(this_.username, this_.levelname, true, s['gotAllCogs'] || gotAllCogs);
    };
};
Level.prototype.load = function (username, levelname, onSuccess) {
    this.username = username;
    this.levelname = levelname;
    this.isLoading = true;
    var this_ = this;
    ajaxGet('level', getLevelUrl(username, levelname), function (json) {
        // reset the game
        this_.json = json; //JSON.parse(json['data']);
        this_.restart();
        // reset the tick timer in case level loading took a while (we don't want the physics to
        // try and catch up, because then it will rush through the first few seconds of the game)
        this_.lastTime = new Date();
        this_.isLoading = false;
        if (onSuccess)
            onSuccess();
    });
};
Level.prototype.show = function () {
    if (this.isLoading) {
        $('#canvas').hide();
        $('#levelScreen').hide();
        $('#loadingScreen').show();
        $('#loadingScreen').html('Loading...');
    }
    else {
        $('#canvas').show();
        $('#levelScreen').hide();
        $('#loadingScreen').hide();
    }
};
Level.prototype.keyDown = function (e) {
    if (this.game != null) {
        this.game.keyDown(e);
        if (e.which == SPACEBAR) {
            if (gameState.gameStatus === GAME_LOST) {
                // restart the current level
                this.restart();
            }
            else if (gameState.gameStatus === GAME_WON) {
                if (menu.isLastLevel(this.username, this.levelname)) {
                    // go back to the level menu
                    hash.setHash(this.username, null);
                }
                else {
                    // go straight to the next level
                    var index = menu.indexOfLevel(this.username, this.levelname);
                    hash.setHash(this.username, menu.items[index + 1].levelname);
                }
            }
        }
    }
};
Level.prototype.keyUp = function (e) {
    if (this.game != null) {
        this.game.keyUp(e);
    }
};
////////////////////////////////////////////////////////////////////////////////
// class Hash
////////////////////////////////////////////////////////////////////////////////
function Hash() {
    this.username = null;
    this.levelname = null;
    this.hash = null;
    this.prevHash = null;
}
Hash.prototype.hasChanged = function () {
    if (this.hash != location.hash) {
        this.prevHash = this.hash;
        this.hash = location.hash;
        var levelMatches = /^#\/?([^\/]+)\/([^\/]+)\/?$/.exec(this.hash);
        var userMatches = /^#\/?([^\/]+)\/?$/.exec(this.hash);
        if (levelMatches != null) {
            this.username = levelMatches[1];
            this.levelname = levelMatches[2];
        }
        else if (userMatches != null) {
            this.username = userMatches[1];
            this.levelname = null;
        }
        else {
            this.username = null;
            this.levelname = null;
        }
        return true;
    }
    return false;
};
Hash.prototype.setHash = function (username, levelname) {
    var newHash = '#/' + username + '/' + (levelname ? levelname + '/' : '');
    if (this.prevHash === newHash) {
        // if we were on page A, we are now on page B, and we want to go back to page A, use the browser's back button instead
        // this is so a game session doesn't add tons of level => menu => level => menu stuff to the history
        history.back();
    }
    else {
        this.username = username;
        this.levelname = levelname;
        location.hash = newHash;
    }
};
Hash.getMenuHash = function (username) { return '#/' + username + '/'; };
Hash.getLevelHash = function (username, levelname) { return '#/' + username + '/' + levelname + '/'; };
////////////////////////////////////////////////////////////////////////////////
// module Main
////////////////////////////////////////////////////////////////////////////////
var stats = null;
var hash = null;
var menu = null;
var level = null;
var keyToChange = null;
// scroll the game to the center of the window if it lies partially or completely off screen
function scrollGameIntoWindow() {
    var windowTop = $('body').scrollTop(), windowHeight = $(window).height();
    var gameTop = $('#game').offset().top, gameHeight = $('#game').outerHeight();
    if (gameTop < windowTop || gameTop + gameHeight > windowTop + windowHeight) {
        // html is for firefox, body is for webkit
        $('html, body').animate({ scrollTop: gameTop + (gameHeight - windowHeight) / 2 });
    }
}
$(document).ready(function () {
    scrollGameIntoWindow();
    Keys.load();
    hash = new Hash();
    menu = new Menu();
    level = new Level();
    stats = new PlayerStats(function () {
        // if we're in the menu, reload the menu so the icons show up
        if (hash.levelname == null) {
            menu.show();
        }
    });
    tick();
    setInterval(tick, 1000 / 60);
});
$('.key.changeable').live('mousedown', function (e) {
    keyToChange = this.id;
    $('.key.changing').removeClass('changing');
    $('#' + keyToChange).addClass('changing');
    e.preventDefault();
    e.stopPropagation();
});
$(document).keydown(function (e) {
    // catch every key if we're remapping keys
    if (keyToChange != null) {
        Keys.keyMap[keyToChange] = e.which;
        Keys.save();
        $('#' + keyToChange).removeClass('changing');
        e.preventDefault();
        e.stopPropagation();
        keyToChange = null;
        return;
    }
    // Allow keyboard shortcuts to work
    if (!e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        menu.keyDown(e);
        level.keyDown(e);
        if (e.which === ESCAPE_KEY) {
            // escape returns the player to the level select page
            hash.setHash(menu.username || level.username, null);
        }
        // Prevents default behaviors like scrolling up/down
        if (e.which == UP_ARROW || e.which == DOWN_ARROW || e.which == SPACEBAR) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
});
$(document).keyup(function (e) {
    // Allow keyboard shortcuts to work
    if (!e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        menu.keyUp(e);
        level.keyUp(e);
        // Prevents default behaviors like scrolling up/down
        if (e.which == UP_ARROW || e.which == DOWN_ARROW || e.which == SPACEBAR) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
});
var flag = true;
function tick() {
    //if (hash.hasChanged()) {
    //    if (hash.username == null) {
    //        hash.setHash('rapt', null);;
    //    } else if (hash.levelname == null) {
    //        level.game = null;;
    //        var index = menu.indexOfLevel(level.username, level.levelname);
    //        if (index !== -1) menu.selectedIndex = index;;
    //        menu.load(hash.username, function () {
    //            menu.show();;
    //        });;
    //        menu.show();;
    //    } else {
    //        scrollGameIntoWindow();;
    //        menu.load(hash.username);;
    //        level.load(hash.username, hash.levelname, function () {
    //            level.show();;
    //        });;
    //        level.show();;
    //    };
    //};
    if (flag === true) {
        scrollGameIntoWindow();
        ;
        menu.load(hash.username);
        ;
        level.load(hash.username, hash.levelname, function () {
            level.show();
            ;
        });
        ;
        level.show();
        ;
        flag = false;
    }
    level.tick();
}
var PlayerStats = (function () {
    function PlayerStats(callback) {
        // this.current_username = null;//username;
        // this.stats = [];
        this.current_username = null;
        this.stats = [];
        if (this.current_username !== null) {
            // load from server if user is logged in
            var this_ = this;
            $.ajax({
                'url': '/stats/',
                'type': 'GET',
                'cache': false,
                'dataType': 'json',
                'success': function (stats) {
                    this_.stats = stats;
                    callback();
                }
            });
        }
        else {
            // load from cookie if user isn't logged in
            this.stats = JSON.parse(getCookie('rapt') || '[]');
            callback();
        }
    }
    PlayerStats.prototype.getStatsForLevel = function (username, levelname) {
        // try looking up stat by username and levelname
        for (var i = 0; i < this.stats.length; i++) {
            var stat = this.stats[i];
            if (stat['username'] == username && stat['levelname'] == levelname) {
                return stat;
            }
        }
        // return default if not found
        return {
            'username': username,
            'levelname': levelname,
            'complete': false,
            'gotAllCogs': false
        };
    };
    PlayerStats.prototype.setStatsForLevel = function (username, levelname, complete, gotAllCogs) {
        // remove all existing stats for this level
        for (var i = 0; i < this.stats.length; i++) {
            var stat = this.stats[i];
            if (stat['username'] == username && stat['levelname'] == levelname) {
                this.stats.splice(i--, 1);
            }
        }
        // insert new stat
        var stat = {
            'username': username,
            'levelname': levelname,
            'complete': complete,
            'gotAllCogs': gotAllCogs
        };
        this.stats.push(stat);
        if (this.current_username !== null) {
            // save stat to server if user is logged in
            $.ajax({
                'url': '/stats/',
                'type': 'PUT',
                'dataType': 'json',
                'data': JSON.stringify(stat),
                'beforeSend': function (xhr) {
                    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                },
                'contentType': 'application/json; charset=utf-8'
            });
        }
        else {
            // save stat to cookie if user isn't logged in
            setCookie('rapt', JSON.stringify(this.stats), 365 * 5);
        }
    };
    return PlayerStats;
}());
var COG_ICON_TEETH_COUNT = 16;
function drawCog(c, x, y, radius, numTeeth, numSpokes, changeBlending, numVertices) {
    var innerRadius = radius * 0.2;
    var spokeRadius = radius * 0.8;
    var spokeWidth1 = radius * 0.125;
    var spokeWidth2 = radius * 0.05;
    for (var loop = 0; loop < 2; loop++) {
        // draw the vertices with zig-zags for triangle strips and outlines for line strip
        for (var iter = 0; iter <= loop; iter++) {
            c.beginPath();
            for (var i = 0; i <= numVertices; i++) {
                var angle = (i + 0.25) / numVertices * (2.0 * Math.PI);
                var s = Math.sin(angle);
                var csn = Math.cos(angle);
                var r1 = radius * 0.7;
                var r2 = radius * (1.0 + Math.cos(angle * numTeeth * 0.5) * 0.1);
                if (!loop || !iter)
                    c.lineTo(csn * r1, s * r1);
                if (!loop || iter)
                    c.lineTo(csn * r2, s * r2);
            }
            c.stroke();
        }
        for (var i = 0; i < numSpokes; i++) {
            var angle = i / numSpokes * (Math.PI * 2.0);
            var s = Math.sin(angle);
            var csn = Math.cos(angle);
            c.beginPath();
            c.lineTo(s * spokeWidth1, -csn * spokeWidth1);
            c.lineTo(-s * spokeWidth1, csn * spokeWidth1);
            c.lineTo(csn * spokeRadius - s * spokeWidth2, s * spokeRadius + csn * spokeWidth2);
            c.lineTo(csn * spokeRadius + s * spokeWidth2, s * spokeRadius - csn * spokeWidth2);
            c.fill();
        }
    }
}
function drawCogIcon(c, x, y, time) {
    c.save();
    c.strokeStyle = 'rgb(255, 245, 0)';
    c.fillStyle = 'rgb(255, 245, 0)';
    c.translate(x, y);
    c.rotate(time * Math.PI / 2 + (time < 0 ? 2 * Math.PI / COG_ICON_TEETH_COUNT : 0));
    drawCog(c, 0, 0, COG_ICON_RADIUS, COG_ICON_TEETH_COUNT, 5, false, 64);
    c.restore();
}
function drawGoldenCog(c, x, y, time) {
    c.save();
    c.strokeStyle = 'rgb(255, 245, 0)';
    c.fillStyle = 'rgb(255, 245, 0)';
    c.translate(x, y);
    c.rotate(time * Math.PI / 2);
    drawCog(c, x, y, GOLDEN_COG_RADIUS, 16, 5, false, 64);
    c.restore();
}
function setCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = '; expires=' + date.toGMTString();
    }
    else {
        var expires = '';
    }
    document.cookie = name + '=' + escape(value) + expires + '; path=/';
}
function getCookie(name) {
    var nameEQ = name + '=';
    var parts = document.cookie.split(';');
    for (var i = 0; i < parts.length; i++) {
        var c = parts[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return unescape(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
}
// modified from https://github.com/Superficial/keyCode-array
var keyCodeArray = [, , ,
    'CANCEL',
    ,
    ,
    'HELP',
    ,
    'BACK SPACE',
    'TAB',
    ,
    ,
    'CLEAR',
    'RETURN',
    'ENTER',
    ,
    'SHIFT',
    'CTRL',
    'ALT',
    'PAUSE',
    'CAPS LOCK',
    ,
    ,
    ,
    ,
    ,
    ,
    'ESCAPE',
    ,
    ,
    ,
    ,
    'SPACE',
    'PAGE UP',
    'PAGE DOWN',
    'END',
    'HOME',
    '&larr;',
    '&uarr;',
    '&rarr;',
    '&darr;',
    ,
    ,
    ,
    'PRINT SCREEN',
    'INSERT',
    'DELETE',
    ,
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    ,
    ';',
    ,
    '=',
    ,
    ,
    ,
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'META',
    ,
    'CONTEXT MENU',
    ,
    ,
    'NUMPAD0',
    'NUMPAD1',
    'NUMPAD2',
    'NUMPAD3',
    'NUMPAD4',
    'NUMPAD5',
    'NUMPAD6',
    'NUMPAD7',
    'NUMPAD8',
    'NUMPAD9',
    '*',
    '+',
    'SEPARATOR',
    '-',
    'DECIMAL',
    'DIVIDE',
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12',
    'F13',
    'F14',
    'F15',
    'F16',
    'F17',
    'F18',
    'F19',
    'F20',
    'F21',
    'F22',
    'F23',
    'F24',
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    'NUM LOCK',
    'SCROLL LOCK',
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ';',
    '=',
    ',',
    '-',
    '.',
    '/',
    '"',
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    '[',
    '\\',
    ']',
    "'",
    ,
    'META'
];
function setLocalStorage(name, value) {
    // attempt to use localStorage first
    if (typeof localStorage != 'undefined') {
        localStorage[name] = value;
    }
    else {
        var date = new Date();
        date.setTime(date.getTime() + 5 * 365 * 24 * 60 * 60 * 1000);
        document.cookie = name + '=' + value + '; expires=' + date.toGMTString() + '; path=/';
    }
}
function getLocalStorage(name) {
    // attempt to use localStorage first
    if (typeof localStorage != 'undefined') {
        return localStorage.hasOwnProperty(name) ? localStorage[name] : '';
    }
    else {
        var pairs = document.cookie.split(';');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i], equals = pair.indexOf('=');
            if (equals != -1 && pair.substring(0, equals).replace(/ /g, '') == name) {
                return pair.substring(equals + 1);
            }
        }
        return '';
    }
}
function lerp(a, b, percent) {
    return a + (b - a) * percent;
}
function randInRange(a, b) {
    return lerp(a, b, Math.random());
}
// class Sprite
var Sprite = (function () {
    function Sprite() {
        this.flip = 0;
        this.angle = 0;
        this.offsetBeforeRotation = new Vector(0, 0);
        this.offsetAfterRotation = new Vector(0, 0);
        this.parent = null;
        this.firstChild = null;
        this.nextSibling = null;
        this.drawGeometry = null;
        //this.flip = 0;
        //this.angle = 0;
        //this.offsetBeforeRotation = new Vector(0, 0);
        //this.offsetAfterRotation = new Vector(0, 0);
        //this.parent = null;
        //this.firstChild = null;
        //this.nextSibling = null;
        //this.drawGeometry = null;
    }
    Sprite.prototype.clone = function () {
        var sprite = new Sprite();
        sprite.flip = this.flip;
        sprite.angle = this.angle;
        sprite.offsetBeforeRotation = this.offsetBeforeRotation;
        sprite.offsetAfterRotation = this.offsetAfterRotation;
        sprite.drawGeometry = this.drawGeometry;
        return sprite;
    };
    Sprite.prototype.setParent = function (newParent) {
        // remove from the old parent
        if (this.parent !== null) {
            if (this.parent.firstChild == this) {
                this.parent.firstChild = this.nextSibling;
            }
            else {
                for (var sprite = this.parent.firstChild; sprite !== null; sprite = sprite.nextSibling) {
                    if (sprite.nextSibling == this) {
                        sprite.nextSibling = this.nextSibling;
                    }
                }
            }
        }
        // switch to new parent
        this.nextSibling = null;
        this.parent = newParent;
        // add to new parent
        if (this.parent !== null) {
            this.nextSibling = this.parent.firstChild;
            this.parent.firstChild = this;
        }
    };
    Sprite.prototype.draw = function (c) {
        c.save();
        c.translate(this.offsetBeforeRotation.x, this.offsetBeforeRotation.y);
        if (this.flip) {
            c.scale(-1, 1);
        }
        c.rotate(this.angle);
        c.translate(this.offsetAfterRotation.x, this.offsetAfterRotation.y);
        this.drawGeometry(c);
        for (var sprite = this.firstChild; sprite !== null; sprite = sprite.nextSibling) {
            sprite.draw(c);
        }
        c.restore();
    };
    return Sprite;
}());
function adjustAngleToTarget(currAngle, targetAngle, maxRotation) {
    if (targetAngle - currAngle > Math.PI)
        currAngle += 2 * Math.PI;
    else if (currAngle - targetAngle > Math.PI)
        currAngle -= 2 * Math.PI;
    var deltaAngle = targetAngle - currAngle;
    if (Math.abs(deltaAngle) > maxRotation)
        deltaAngle = (deltaAngle > 0 ? maxRotation : -maxRotation);
    currAngle += deltaAngle;
    currAngle -= Math.floor(currAngle / (2 * Math.PI)) * (2 * Math.PI);
    return currAngle;
}
var CELL_EMPTY = 0;
var CELL_SOLID = 1;
var CELL_FLOOR_DIAG_LEFT = 2;
var CELL_FLOOR_DIAG_RIGHT = 3;
var CELL_CEIL_DIAG_LEFT = 4;
var CELL_CEIL_DIAG_RIGHT = 5;
// class Cell
var Cell = (function () {
    function Cell(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.edges = [];
        //this.x = x;
        //this.y = y;
        //this.type = type;
        //this.edges = [];
    }
    Cell.prototype.bottomLeft = function () { return new Vector(this.x, this.y); };
    Cell.prototype.bottomRight = function () { return new Vector(this.x + 1, this.y); };
    Cell.prototype.topLeft = function () { return new Vector(this.x, this.y + 1); };
    Cell.prototype.topRight = function () { return new Vector(this.x + 1, this.y + 1); };
    Cell.prototype.ceilingOccupied = function () {
        return this.type === CELL_SOLID || this.type === CELL_CEIL_DIAG_LEFT || this.type === CELL_CEIL_DIAG_RIGHT;
    };
    Cell.prototype.floorOccupied = function () {
        return this.type === CELL_SOLID || this.type === CELL_FLOOR_DIAG_LEFT || this.type === CELL_FLOOR_DIAG_RIGHT;
    };
    Cell.prototype.leftWallOccupied = function () {
        return this.type === CELL_SOLID || this.type === CELL_FLOOR_DIAG_LEFT || this.type === CELL_CEIL_DIAG_LEFT;
    };
    Cell.prototype.rightWallOccupied = function () {
        return this.type === CELL_SOLID || this.type === CELL_FLOOR_DIAG_RIGHT || this.type === CELL_CEIL_DIAG_RIGHT;
    };
    // This diagonal: /
    Cell.prototype.posDiagOccupied = function () {
        return this.type === CELL_SOLID || this.type === CELL_FLOOR_DIAG_RIGHT || this.type === CELL_CEIL_DIAG_LEFT;
    };
    // This diagonal: \
    Cell.prototype.negDiagOccupied = function () {
        return this.type === CELL_SOLID || this.type === CELL_FLOOR_DIAG_LEFT || this.type === CELL_CEIL_DIAG_RIGHT;
    };
    Cell.prototype.addEdge = function (newEdge) {
        this.edges.push(newEdge);
    };
    Cell.prototype.removeEdge = function (edge) {
        var edgeIndex = this.getEdge(edge);
        this.edges.splice(edgeIndex, 1);
    };
    // returns all edges that block this color
    Cell.prototype.getBlockingEdges = function (color) {
        var blockingEdges = [];
        for (var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].blocksColor(color)) {
                blockingEdges.push(this.edges[i]);
            }
        }
        return blockingEdges;
    };
    Cell.prototype.getEdge = function (edge) {
        for (var i = 0; i < this.edges.length; ++i) {
            var thisEdge = this.edges[i];
            if ((thisEdge.getStart().sub(edge.getStart())).lengthSquared() < 0.001 &&
                (thisEdge.getEnd().sub(edge.getEnd())).lengthSquared() < 0.001) {
                return i;
            }
        }
        return -1;
    };
    // returns a polygon that represents this cell
    Cell.prototype.getShape = function () {
        var vxy = new Vector(this.x, this.y);
        var v00 = new Vector(0, 0);
        var v01 = new Vector(0, 1);
        var v10 = new Vector(1, 0);
        var v11 = new Vector(1, 1);
        switch (this.type) {
            case CELL_SOLID: return new Polygon(vxy, v00, v10, v11, v01);
            case CELL_FLOOR_DIAG_LEFT: return new Polygon(vxy, v00, v10, v01);
            case CELL_FLOOR_DIAG_RIGHT: return new Polygon(vxy, v00, v10, v11);
            case CELL_CEIL_DIAG_LEFT: return new Polygon(vxy, v00, v11, v01);
            case CELL_CEIL_DIAG_RIGHT: return new Polygon(vxy, v01, v10, v11);
        }
        return null;
    };
    Cell.prototype.draw = function (c) {
        var x = this.x, y = this.y;
        c.beginPath();
        if (this.type == CELL_SOLID) {
            c.moveTo(x, y);
            c.lineTo(x, y + 1);
            c.lineTo(x + 1, y + 1);
            c.lineTo(x + 1, y);
        }
        else if (this.type == CELL_FLOOR_DIAG_LEFT) {
            c.moveTo(x, y);
            c.lineTo(x + 1, y);
            c.lineTo(x, y + 1);
        }
        else if (this.type == CELL_FLOOR_DIAG_RIGHT) {
            c.moveTo(x, y);
            c.lineTo(x + 1, y + 1);
            c.lineTo(x + 1, y);
        }
        else if (this.type == CELL_CEIL_DIAG_LEFT) {
            c.moveTo(x, y);
            c.lineTo(x, y + 1);
            c.lineTo(x + 1, y + 1);
        }
        else if (this.type == CELL_CEIL_DIAG_RIGHT) {
            c.moveTo(x + 1, y);
            c.lineTo(x, y + 1);
            c.lineTo(x + 1, y + 1);
        }
        c.closePath();
        c.fill();
        c.stroke();
    };
    Cell.prototype.drawEdges = function (c) {
        for (var i = 0; i < this.edges.length; i++) {
            this.edges[i].draw(c);
        }
    };
    return Cell;
}());
// enum DoorType
var ONE_WAY = 0;
var TWO_WAY = 1;
var Door = (function () {
    function Door(edge0, edge1, cell0, cell1) {
        this.cells = [cell0, cell1];
        this.edges = [edge0, edge1];
    }
    Door.prototype.doorExists = function (i) {
        if (this.edges[i] === null) {
            return false;
        }
        var cell = this.cells[i];
        return cell !== null && cell.getEdge(this.edges[i]) !== -1;
    };
    Door.prototype.doorPut = function (i, kill) {
        if (this.edges[i] !== null && !this.doorExists(i)) {
            var cell = this.cells[i];
            if (cell === null) {
                return;
            }
            cell.addEdge(new Edge(this.edges[i].getStart(), this.edges[i].getEnd(), this.edges[i].color));
            if (kill) {
                gameState.killAll(this.edges[i]);
            }
            gameState.recordModification();
        }
    };
    Door.prototype.doorRemove = function (i) {
        if (this.edges[i] !== null && this.doorExists(i)) {
            var cell = this.cells[i];
            if (cell === null) {
                return;
            }
            cell.removeEdge(this.edges[i]);
            gameState.recordModification();
        }
    };
    Door.prototype.act = function (behavior, force, kill) {
        for (var i = 0; i < 2; ++i) {
            switch (behavior) {
                case DOORBELL_OPEN:
                    this.doorRemove(i);
                    break;
                case DOORBELL_CLOSE:
                    this.doorPut(i, kill);
                    break;
                case DOORBELL_TOGGLE:
                    if (this.doorExists(i)) {
                        this.doorRemove(i);
                    }
                    else
                        this.doorPut(i, kill);
                    break;
            }
        }
    };
    return Door;
}());
// enum EdgeType
var EDGE_FLOOR = 0;
var EDGE_LEFT = 1;
var EDGE_RIGHT = 2;
var EDGE_CEILING = 3;
// enum EdgeColor
var EDGE_NEUTRAL = 0;
var EDGE_RED = 1;
var EDGE_BLUE = 2;
var EDGE_PLAYERS = 3;
var EDGE_ENEMIES = 4;
// class Edge
var Edge = (function () {
    function Edge(start, end, color) {
        this.color = color;
        this.segment = new Segment(start, end);
        // this.color = color;
    }
    Edge.prototype.blocksColor = function (entityColor) {
        switch (this.color) {
            case EDGE_NEUTRAL: return true;
            case EDGE_RED: return entityColor != EDGE_RED;
            case EDGE_BLUE: return entityColor != EDGE_BLUE;
            case EDGE_PLAYERS: return entityColor != EDGE_RED && entityColor != EDGE_BLUE;
            case EDGE_ENEMIES: return entityColor != EDGE_ENEMIES;
        }
        return false;
    };
    Edge.prototype.getStart = function () {
        return this.segment.start;
    };
    Edge.prototype.getEnd = function () {
        return this.segment.end;
    };
    Edge.prototype.getOrientation = function () {
        return Edge.getOrientation(this.segment.normal);
    };
    Edge.getOrientation = function (normal) {
        if (normal.x > 0.9)
            return EDGE_LEFT;
        if (normal.x < -0.9)
            return EDGE_RIGHT;
        if (normal.y < 0)
            return EDGE_CEILING;
        return EDGE_FLOOR;
    };
    Edge.prototype.draw = function (c) {
        switch (this.color) {
            case EDGE_NEUTRAL:
                c.strokeStyle = 'black';
                break;
            case EDGE_RED:
                c.strokeStyle = '#C00000';
                break;
            case EDGE_BLUE:
                c.strokeStyle = '#0000D2';
                break;
        }
        this.segment.draw(c);
        var xOffset = this.segment.normal.x * 0.1;
        var yOffset = this.segment.normal.y * 0.1;
        c.beginPath();
        for (var i = 1, num = 10; i < num - 1; ++i) {
            var fraction = i / (num - 1);
            var start = this.segment.start.mul(fraction).add(this.segment.end.mul(1 - fraction));
            c.moveTo(start.x, start.y);
            c.lineTo(start.x - xOffset, start.y - yOffset);
        }
        c.stroke();
    };
    return Edge;
}());
// constants
var SPAWN_POINT_PARTICLE_FREQ = 0.3;
// enum GameStatus
var GAME_IN_PLAY = 0;
var GAME_WON = 1;
var GAME_LOST = 2;
// enum StatIndex
var STAT_PLAYER_DEATHS = 0;
var STAT_ENEMY_DEATHS = 1;
var STAT_COGS_COLLECTED = 2;
var STAT_NUM_COGS = 3;
// global variable for game state, initialized in main.js
var gameState;
// bounding rectangle around all pixels currently being drawn to (also includes 2 cells of padding,
// so just check that the enemy center is within these bounds, don't bother about adding the radius)
var drawMinX = 0, drawMinY = 0;
var drawMaxX = 0, drawMaxY = 0;
function drawSpawnPoint(c, point) {
    c.strokeStyle = c.fillStyle = 'rgba(255, 255, 255, 0.1)';
    c.beginPath();
    c.arc(point.x, point.y, 1, 0, 2 * Math.PI, false);
    c.stroke();
    c.fill();
    var gradient = c.createLinearGradient(0, point.y - 0.4, 0, point.y + 0.6);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    c.fillStyle = gradient;
    c.beginPath();
    c.lineTo(point.x - 0.35, point.y + 0.6);
    c.lineTo(point.x - 0.1, point.y - 0.4);
    c.lineTo(point.x + 0.1, point.y - 0.4);
    c.lineTo(point.x + 0.35, point.y + 0.6);
    c.fill();
    c.fillStyle = 'black';
    c.beginPath();
    c.moveTo(point.x - 0.1, point.y - 0.45);
    c.lineTo(point.x - 0.1, point.y - 0.4);
    c.lineTo(point.x + 0.1, point.y - 0.4);
    c.lineTo(point.x + 0.1, point.y - 0.45);
    c.arc(point.x, point.y - 0.45, 0.2, 0, Math.PI, true);
    c.fill();
}
function drawGoal(c, point, time) {
    var percent = time - Math.floor(time);
    percent = 1 - percent;
    percent = (percent - Math.pow(percent, 6)) * 1.72;
    percent = 1 - percent;
    c.fillStyle = 'black';
    for (var i = 0; i < 4; ++i) {
        var angle = i * (2 * Math.PI / 4);
        var s = Math.sin(angle);
        var csn = Math.cos(angle);
        var radius = 0.45 - percent * 0.25;
        var size = 0.15;
        c.beginPath();
        c.moveTo(point.x + csn * radius - s * size, point.y + s * radius + csn * size);
        c.lineTo(point.x + csn * radius + s * size, point.y + s * radius - csn * size);
        c.lineTo(point.x + csn * (radius - size), point.y + s * (radius - size));
        c.fill();
    }
}
// class GameState
var GameState = (function () {
    function GameState() {
        this.spawnPointParticleTimer = 0;
        this.enemies = [];
        this.doors = [];
        this.timeSinceStart = 0;
        this.killKey = false;
        this.modificationCount = 0;
        this.gameStatus = GAME_IN_PLAY;
        this.stats = [0, 0, 0, 0];
        this.world = new World(50, 50, new Vector(0.5, 0.5), new Vector(0.5, 0.5));
        // Player color must be EDGE_RED or EDGE_BLUE to support proper collisions with doors!
        this.playerA = new Player(this.world.spawnPoint, EDGE_RED);
        this.playerB = new Player(this.world.spawnPoint, EDGE_BLUE);
        this.spawnPointParticleTimer = 0;
        this.spawnPointOffset = new Vector(0, 0);
        this.enemies = [];
        this.doors = [];
        this.timeSinceStart = 0;
        // keys (will be set automatically)
        this.killKey = false;
        // if you need to tell if the world has been modified (door has been opened/closed), just watch
        // for changes to this variable, which can be incremented by gameState.recordModification()
        this.modificationCount = 0;
        this.gameStatus = GAME_IN_PLAY;
        this.stats = [0, 0, 0, 0];
    }
    GameState.prototype.recordModification = function () {
        this.modificationCount++;
    };
    GameState.prototype.getPlayer = function (i) {
        return (i == 0) ? this.playerA : this.playerB;
    };
    GameState.prototype.getOtherPlayer = function (player) {
        return (player == this.playerA) ? this.playerB : this.playerA;
    };
    GameState.prototype.getSpawnPoint = function () {
        return this.world.spawnPoint;
    };
    GameState.prototype.setSpawnPoint = function (point) {
        this.world.spawnPoint = new Vector(point.x, point.y);
        // offset to keep spawn point from drawing below ground
        this.spawnPointOffset.y = 0.125;
        // prevents slipping?
        this.world.spawnPoint.y += 0.01;
    };
    GameState.prototype.gameWon = function () {
        var goal = this.world.goal;
        var atGoalA = !this.playerA.isDead() && Math.abs(this.playerA.getCenter().x - goal.x) < 0.4 &&
            Math.abs(this.playerA.getCenter().y - goal.y) < 0.4;
        var atGoalB = !this.playerB.isDead() && Math.abs(this.playerB.getCenter().x - goal.x) < 0.4 &&
            Math.abs(this.playerB.getCenter().y - goal.y) < 0.4;
        return atGoalA && atGoalB;
    };
    GameState.prototype.gameLost = function () {
        return (this.playerA.isDead() && this.playerB.isDead());
    };
    GameState.prototype.incrementStat = function (stat) {
        ++this.stats[stat];
    };
    GameState.prototype.addEnemy = function (enemy, spawnerPosition) {
        // If adding at the start of the game, start at its own center
        if (typeof spawnerPosition === 'undefined') {
            spawnerPosition = enemy.getShape().getCenter();
        }
        else {
            // rewind the enemy back to the spawner's center
            enemy.getShape().moveTo(spawnerPosition);
        }
        var ref_deltaPosition = { ref: enemy.getShape().getCenter().sub(spawnerPosition) };
        var ref_velocity = { ref: enemy.getVelocity() };
        // do collision detection and push the enemy backwards if it would hit any walls
        var contact = CollisionDetector.collideEntityWorld(enemy, ref_deltaPosition, ref_velocity, enemy.getElasticity(), this.world, true);
        // put the velocity back into the enemy
        enemy.setVelocity(ref_velocity.ref);
        // move the spawned enemy as far out from the spawner as we can
        enemy.getShape().moveBy(ref_deltaPosition.ref);
        // now we can add the enemy to the list
        this.enemies.push(enemy);
    };
    GameState.prototype.clearDoors = function () {
        this.doors = [];
    };
    GameState.prototype.addDoor = function (start, end, type, color, startsOpen) {
        var cell1;
        var cell2;
        var valid = true;
        // left wall
        if (start.y + 1 == end.y && start.x == end.x) {
            cell1 = this.world.getCell(start.x, start.y);
            cell2 = this.world.getCell(start.x - 1, start.y);
            if (!cell1 || !cell2 || cell1.leftWallOccupied() || cell2.rightWallOccupied()) {
                valid = false;
            }
        }
        else if (start.y - 1 == end.y && start.x == end.x) {
            cell1 = this.world.getCell(start.x - 1, end.y);
            cell2 = this.world.getCell(start.x, end.y);
            if (!cell1 || !cell2 || cell1.rightWallOccupied() || cell2.leftWallOccupied()) {
                valid = false;
            }
        }
        else if (start.x + 1 == end.x && start.y == end.y) {
            cell1 = this.world.getCell(start.x, start.y - 1);
            cell2 = this.world.getCell(start.x, start.y);
            if (!cell1 || !cell2 || cell1.ceilingOccupied() || cell2.floorOccupied()) {
                valid = false;
            }
        }
        else if (start.x - 1 == end.x && start.y == end.y) {
            cell1 = this.world.getCell(end.x, start.y);
            cell2 = this.world.getCell(end.x, start.y - 1);
            if (!cell1 || !cell2 || cell1.floorOccupied() || cell2.ceilingOccupied()) {
                valid = false;
            }
        }
        else {
            var x = start.x < end.x ? start.x : end.x;
            var y = start.y < end.y ? start.y : end.y;
            cell1 = this.world.getCell(x, y);
            cell2 = this.world.getCell(x, y);
            if ((start.x < end.x) === (start.y < end.y)) {
                if (!cell1 || cell1.posDiagOccupied()) {
                    valid = false;
                }
            }
            else if (!cell1 || cell1.negDiagOccupied()) {
                valid = false;
            }
        }
        var door;
        if (!valid) {
            // Make a dummy door that doesn't do anything
            door = new Door(null, null, null, null);
        }
        else if (type === ONE_WAY) {
            door = new Door(new Edge(start, end, color), null, cell1, null);
        }
        else {
            door = new Door(new Edge(start, end, color), new Edge(end, start, color), cell1, cell2);
        }
        this.doors.push(door);
        if (!startsOpen) {
            door.act(DOORBELL_CLOSE, true, false);
        }
    };
    GameState.prototype.getDoor = function (doorIndex) {
        return this.doors[doorIndex];
    };
    // Kill all entities that intersect a given edge
    GameState.prototype.killAll = function (edge) {
        for (var i = 0; i < 2; ++i) {
            if (CollisionDetector.intersectEntitySegment(this.getPlayer(i), edge.segment)) {
                this.getPlayer(i).setDead(true);
            }
        }
        for (var i = 0; i < this.enemies.length; ++i) {
            var enemy = this.enemies[i];
            if (enemy.canCollide() && CollisionDetector.intersectEntitySegment(enemy, edge.segment)) {
                enemy.setDead(true);
            }
        }
    };
    GameState.prototype.tick = function (seconds) {
        if (this.gameStatus === GAME_WON || this.gameWon()) {
            this.gameStatus = GAME_WON;
        }
        else if (this.gameStatus === GAME_LOST || this.gameLost()) {
            this.gameStatus = GAME_LOST;
        }
        this.timeSinceStart += seconds;
        if (this.killKey) {
            this.playerA.setDead(true);
            this.playerB.setDead(true);
        }
        this.playerA.tick(seconds);
        this.playerB.tick(seconds);
        for (var i = 0; i < this.enemies.length; ++i) {
            this.enemies[i].tick(seconds);
        }
        for (var i = 0; i < this.enemies.length; ++i) {
            if (this.enemies[i].isDead()) {
                this.enemies.splice(i, 1);
            }
        }
        this.spawnPointParticleTimer -= seconds;
        if (this.spawnPointParticleTimer <= 0) {
            var position = this.world.spawnPoint.sub(new Vector(0, 0.25));
            Particle().position(position).velocity(new Vector(randInRange(-0.3, 0.3), 0.3)).radius(0.03, 0.05).bounces(0).decay(0.1, 0.2).color(1, 1, 1, 1).circle().gravity(-5);
            this.spawnPointParticleTimer += SPAWN_POINT_PARTICLE_FREQ;
        }
    };
    GameState.prototype.draw = function (c, xmin, ymin, xmax, ymax) {
        // no enemy or particle is larger than two cells wide
        drawMinX = xmin - 2;
        drawMinY = ymin - 2;
        drawMaxX = xmax + 2;
        drawMaxY = ymax + 2;
        // spawn point and goal
        var spawnPoint = this.world.spawnPoint.add(this.spawnPointOffset);
        var goal = this.world.goal;
        if (spawnPoint.x >= drawMinX && spawnPoint.y >= drawMinY && spawnPoint.x <= drawMaxX && spawnPoint.y <= drawMaxY) {
            drawSpawnPoint(c, spawnPoint);
        }
        if (goal.x >= drawMinX && goal.y >= drawMinY && goal.x <= drawMaxX && goal.y <= drawMaxY) {
            drawGoal(c, goal, this.timeSinceStart);
        }
        // players
        this.playerA.draw(c);
        this.playerB.draw(c);
        // enemies
        for (var i = 0; i < this.enemies.length; ++i) {
            var enemy = this.enemies[i];
            var center = enemy.getCenter();
            if (center.x >= drawMinX && center.y >= drawMinY && center.x <= drawMaxX && center.y <= drawMaxY) {
                enemy.draw(c);
            }
        }
    };
    GameState.prototype.loadLevelFromJSON = function (json) {
        // values are quoted (like json['width'] instead of json.width) so closure compiler doesn't touch them
        // Reset stats
        this.stats = [0, 0, 0, 0];
        // Load size, spawn point, and goal
        this.world = new World(json['width'], json['height'], jsonToVec(json['start']), jsonToVec(json['end']));
        // Load cells & create edges
        for (var x = 0; x < json['width']; x++) {
            for (var y = 0; y < json['height']; y++) {
                var type = json['cells'][y][x];
                this.world.setCell(x, y, type);
                if (type !== CELL_SOLID) {
                    this.world.safety = new Vector(x + 0.5, y + 0.5);
                }
            }
        }
        this.world.createAllEdges();
        // Reset players
        this.playerA.reset(this.world.spawnPoint, EDGE_RED);
        this.playerB.reset(this.world.spawnPoint, EDGE_BLUE);
        // Load entities
        for (var i = 0; i < json['entities'].length; ++i) {
            var e = json['entities'][i];
            switch (e['class']) {
                case 'cog':
                    this.enemies.push(new GoldenCog(jsonToVec(e['pos'])));
                    break;
                case 'wall':
                    gameState.addDoor(jsonToVec(e['end']), jsonToVec(e['start']), e['oneway'] ? ONE_WAY : TWO_WAY, e['color'], e['open']);
                    break;
                case 'button':
                    var button = new Doorbell(jsonToVec(e['pos']), e['type'], true);
                    button.doors = e['walls'];
                    this.enemies.push(button);
                    break;
                case 'sign':
                    this.enemies.push(new HelpSign(jsonToVec(e['pos']), e['text']));
                    break;
                case 'enemy':
                    this.enemies.push(jsonToEnemy(e));
                    break;
            }
        }
    };
    return GameState;
}());
var WORLD_MARGIN = 60;
function rect(c, x, y, w, h) { c.fillRect(x, y, w, h); c.strokeRect(x, y, w, h); }
// is this side of the cell empty?
function IS_EMPTY_XNEG(type) { return type == CELL_EMPTY || type == CELL_FLOOR_DIAG_RIGHT || type == CELL_CEIL_DIAG_RIGHT; }
function IS_EMPTY_YNEG(type) { return type == CELL_EMPTY || type == CELL_CEIL_DIAG_LEFT || type == CELL_CEIL_DIAG_RIGHT; }
function IS_EMPTY_XPOS(type) { return type == CELL_EMPTY || type == CELL_FLOOR_DIAG_LEFT || type == CELL_CEIL_DIAG_LEFT; }
function IS_EMPTY_YPOS(type) { return type == CELL_EMPTY || type == CELL_FLOOR_DIAG_LEFT || type == CELL_FLOOR_DIAG_RIGHT; }
// is this side of the cell solid?
function IS_SOLID_XNEG(type) { return type == CELL_SOLID || type == CELL_FLOOR_DIAG_LEFT || type == CELL_CEIL_DIAG_LEFT; }
function IS_SOLID_YNEG(type) { return type == CELL_SOLID || type == CELL_FLOOR_DIAG_LEFT || type == CELL_FLOOR_DIAG_RIGHT; }
function IS_SOLID_XPOS(type) { return type == CELL_SOLID || type == CELL_FLOOR_DIAG_RIGHT || type == CELL_CEIL_DIAG_RIGHT; }
function IS_SOLID_YPOS(type) { return type == CELL_SOLID || type == CELL_CEIL_DIAG_LEFT || type == CELL_CEIL_DIAG_RIGHT; }
// class World
var World = (function () {
    function World(w, h, spawnPoint, goal) {
        this.cells = new Array(w);
        for (var x = 0; x < w; ++x) {
            this.cells[x] = new Array(h);
            for (var y = 0; y < h; ++y) {
                this.cells[x][y] = new Cell(x, y, CELL_SOLID);
            }
        }
        this.width = w;
        this.height = h;
        this.safety = spawnPoint;
        this.spawnPoint = spawnPoint.add(new Vector(0.5, 0.5));
        this.goal = goal.add(new Vector(0.5, 0.5));
    }
    World.prototype.drawBorder = function (c, xmin, ymin, xmax, ymax) {
        var padding = 100;
        if (xmin < 0)
            rect(c, -padding, 0, padding, this.height);
        if (ymin < 0)
            rect(c, -padding, -padding, this.width + 2 * padding, padding);
        if (xmax > this.width)
            rect(c, this.width, 0, padding, this.height);
        if (ymax > this.height)
            rect(c, -padding, this.height, this.width + 2 * padding, padding);
    };
    World.prototype.draw = function (c, xmin, ymin, xmax, ymax) {
        c.fillStyle = '#7F7F7F';
        c.strokeStyle = '#7F7F7F';
        this.drawBorder(c, xmin, ymin, xmax, ymax);
        xmin = Math.max(0, Math.floor(xmin));
        ymin = Math.max(0, Math.floor(ymin));
        xmax = Math.min(this.width, Math.ceil(xmax));
        ymax = Math.min(this.height, Math.ceil(ymax));
        for (var x = xmin; x < xmax; x++) {
            for (var y = ymin; y < ymax; y++) {
                this.cells[x][y].draw(c);
            }
        }
        c.strokeStyle = 'black';
        for (var x = xmin; x < xmax; x++) {
            for (var y = ymin; y < ymax; y++) {
                this.cells[x][y].drawEdges(c);
            }
        }
    };
    // cells outside the world return null
    World.prototype.getCell = function (x, y) {
        return (x >= 0 && y >= 0 && x < this.width && y < this.height) ? this.cells[x][y] : null;
    };
    // cells outside the world return solid
    World.prototype.getCellType = function (x, y) {
        return (x >= 0 && y >= 0 && x < this.width && y < this.height) ? this.cells[x][y].type : CELL_SOLID;
    };
    World.prototype.setCell = function (x, y, type) {
        this.cells[x][y] = new Cell(x, y, type);
    };
    World.prototype.createAllEdges = function () {
        for (var x = 0; x < this.cells.length; x++) {
            for (var y = 0; y < this.cells[0].length; y++) {
                this.cells[x][y].edges = this.createEdges(x, y);
            }
        }
    };
    World.prototype.createEdges = function (x, y) {
        var edges = [];
        var cellType = this.getCellType(x, y);
        var cellTypeXneg = this.getCellType(x - 1, y);
        var cellTypeYneg = this.getCellType(x, y - 1);
        var cellTypeXpos = this.getCellType(x + 1, y);
        var cellTypeYpos = this.getCellType(x, y + 1);
        var lowerLeft = new Vector(x, y);
        var lowerRight = new Vector(x + 1, y);
        var upperLeft = new Vector(x, y + 1);
        var upperRight = new Vector(x + 1, y + 1);
        // add horizontal and vertical edges
        if (IS_EMPTY_XNEG(cellType) && IS_SOLID_XPOS(cellTypeXneg))
            edges.push(new Edge(lowerLeft, upperLeft, EDGE_NEUTRAL));
        if (IS_EMPTY_YNEG(cellType) && IS_SOLID_YPOS(cellTypeYneg))
            edges.push(new Edge(lowerRight, lowerLeft, EDGE_NEUTRAL));
        if (IS_EMPTY_XPOS(cellType) && IS_SOLID_XNEG(cellTypeXpos))
            edges.push(new Edge(upperRight, lowerRight, EDGE_NEUTRAL));
        if (IS_EMPTY_YPOS(cellType) && IS_SOLID_YNEG(cellTypeYpos))
            edges.push(new Edge(upperLeft, upperRight, EDGE_NEUTRAL));
        // add diagonal edges
        if (cellType == CELL_FLOOR_DIAG_RIGHT)
            edges.push(new Edge(upperRight, lowerLeft, EDGE_NEUTRAL));
        else if (cellType == CELL_CEIL_DIAG_LEFT)
            edges.push(new Edge(lowerLeft, upperRight, EDGE_NEUTRAL));
        else if (cellType == CELL_FLOOR_DIAG_LEFT)
            edges.push(new Edge(lowerRight, upperLeft, EDGE_NEUTRAL));
        else if (cellType == CELL_CEIL_DIAG_RIGHT)
            edges.push(new Edge(upperLeft, lowerRight, EDGE_NEUTRAL));
        return edges;
    };
    World.prototype.getEdgesInAabb = function (aabb, color) {
        var xmin = Math.max(0, Math.floor(aabb.getLeft()));
        var ymin = Math.max(0, Math.floor(aabb.getBottom()));
        var xmax = Math.min(this.width, Math.ceil(aabb.getRight()));
        var ymax = Math.min(this.height, Math.ceil(aabb.getTop()));
        var edges = [];
        for (var x = xmin; x < xmax; x++)
            for (var y = ymin; y < ymax; y++)
                edges = edges.concat(this.cells[x][y].getBlockingEdges(color));
        return edges;
    };
    World.prototype.getCellsInAabb = function (aabb) {
        var xmin = Math.max(0, Math.floor(aabb.getLeft()));
        var ymin = Math.max(0, Math.floor(aabb.getBottom()));
        var xmax = Math.min(this.width, Math.ceil(aabb.getRight()));
        var ymax = Math.min(this.height, Math.ceil(aabb.getTop()));
        var cells = [];
        for (var x = xmin; x < xmax; x++)
            for (var y = ymin; y < ymax; y++)
                cells = cells.concat(this.cells[x][y]);
        return cells;
    };
    World.prototype.getHugeAabb = function () {
        return new AABB(new Vector(-WORLD_MARGIN, -WORLD_MARGIN), new Vector(this.width + WORLD_MARGIN, this.height + WORLD_MARGIN));
    };
    World.prototype.getWidth = function () {
        return this.width;
    };
    World.prototype.getHeight = function () {
        return this.height;
    };
    return World;
}());
//# sourceMappingURL=out.js.map