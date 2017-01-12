var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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