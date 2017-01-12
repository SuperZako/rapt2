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
//# sourceMappingURL=out.js.map