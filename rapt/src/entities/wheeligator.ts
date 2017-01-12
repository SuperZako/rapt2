///<reference path="./WalkingEnemy.ts" />

var WHEELIGATOR_RADIUS = 0.3;
var WHEELIGATOR_SPEED = 3;
var WHEELIGATOR_ELASTICITY = 1;
var WHEELIGATOR_FLOOR_ELASTICITY = 0.3;

//Wheeligator.subclasses(WalkingEnemy);
class Wheeligator extends WalkingEnemy {
    hitGround = false;
    angularVelocity = 0;
    startsRight;
    bodySprite = new Sprite();
    constructor(center, angle) {
        //WalkingEnemy.prototype.constructor.call(this, ENEMY_WHEELIGATOR, center, WHEELIGATOR_RADIUS, WHEELIGATOR_ELASTICITY);
        super(ENEMY_WHEELIGATOR, center, WHEELIGATOR_RADIUS, WHEELIGATOR_ELASTICITY);
        // this.hitGround = false;
        // this.angularVelocity = 0;
        // this.startsRight = (Math.cos(angle) > 0);

        // this.bodySprite = new Sprite();
        this.bodySprite.drawGeometry = function (c) {
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
    }

    move(seconds) {
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
    }

    reactToWorld(contact) {
        // If a floor, bounce off like elasticity is FLOOR_ELASTICITY
        if (Edge.getOrientation(contact.normal) === EDGE_FLOOR) {
            var perpendicular = this.velocity.projectOntoAUnitVector(contact.normal);
            var parallel = this.velocity.sub(perpendicular);
            this.velocity = parallel.add(perpendicular.mul(WHEELIGATOR_FLOOR_ELASTICITY));
            this.angularVelocity = -this.velocity.x / WHEELIGATOR_RADIUS;
        }
    }

    afterTick(seconds) {
        this.bodySprite.offsetBeforeRotation = this.getCenter();
        this.bodySprite.angle = this.bodySprite.angle + this.angularVelocity * seconds;
    }

    draw(c) {
        var pos = this.getCenter();
        this.bodySprite.draw(c);
    }
}