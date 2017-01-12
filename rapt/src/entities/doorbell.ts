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
class Doorbell extends Enemy {
    hitBox: AABB;
    rotationPercent = 1;
    restingAngle = randInRange(0, 2 * Math.PI);
    triggeredLastTick = false;
    triggeredThisTick = false;
    doors = [];
    constructor(center, public behavior, public visible) {
        //Enemy.prototype.constructor.call(this, ENEMY_DOORBELL, 1);
        super(ENEMY_DOORBELL, 1);
        this.hitBox = AABB.makeAABB(center, DOORBELL_WIDTH, DOORBELL_HEIGHT);
        this.rotationPercent = 1;
        this.restingAngle = randInRange(0, 2 * Math.PI);
        this.behavior = behavior;
        this.visible = visible;
        this.triggeredLastTick = false;
        this.triggeredThisTick = false;
        this.doors = [];
    }

    getShape() { return this.hitBox; }

    addDoor(doorIndex) { this.doors.push(doorIndex); }

    canCollide() { return false; }

    tick(seconds) {
        this.rotationPercent += seconds;
        if (this.rotationPercent > 1) {
            this.rotationPercent = 1;
        }

        this.triggeredThisTick = false;
        Enemy.prototype.tick.call(this, seconds);
        this.triggeredLastTick = this.triggeredThisTick;
    }

    reactToPlayer(player) {
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
    }

    draw(c) {
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
    }
}