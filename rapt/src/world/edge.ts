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
class Edge {
    segment: Segment;
    constructor(start, end, public color) {
        this.segment = new Segment(start, end);
        // this.color = color;
    }

    blocksColor(entityColor) {
        switch (this.color) {
            case EDGE_NEUTRAL: return true;
            case EDGE_RED: return entityColor != EDGE_RED;
            case EDGE_BLUE: return entityColor != EDGE_BLUE;
            case EDGE_PLAYERS: return entityColor != EDGE_RED && entityColor != EDGE_BLUE;
            case EDGE_ENEMIES: return entityColor != EDGE_ENEMIES;
        }
        return false;
    }

    getStart() {
        return this.segment.start;
    }

    getEnd() {
        return this.segment.end;
    }

    getOrientation() {
        return Edge.getOrientation(this.segment.normal);
    }

    static getOrientation(normal) {
        if (normal.x > 0.9) return EDGE_LEFT;
        if (normal.x < -0.9) return EDGE_RIGHT;
        if (normal.y < 0) return EDGE_CEILING;
        return EDGE_FLOOR;
    }

    draw(c) {
        switch (this.color) {
            case EDGE_NEUTRAL: c.strokeStyle = 'black'; break;
            case EDGE_RED: c.strokeStyle = '#C00000'; break;
            case EDGE_BLUE: c.strokeStyle = '#0000D2'; break;
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
    }
}