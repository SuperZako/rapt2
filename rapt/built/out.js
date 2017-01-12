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