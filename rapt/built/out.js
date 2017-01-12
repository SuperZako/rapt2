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