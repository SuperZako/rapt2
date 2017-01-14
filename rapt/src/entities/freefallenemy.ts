///<reference path="./enemy.ts" /> 

var FREEFALL_ACCEL = -6;

//FreefallEnemy.subclasses(Enemy);
class FreefallEnemy extends Enemy {
    hitCircle: Circle;
    constructor(type, center, radius: number, elasticity) {
        //Enemy.prototype.constructor.call(this, type, elasticity);
        super(type, elasticity);
        this.hitCircle = new Circle(center, radius);
    }

    getShape() {
        return this.hitCircle;
    }

    draw(c: CanvasRenderingContext2D) {
        var pos = this.hitCircle.center;
        c.fillStyle = 'black';
        c.beginPath();
        c.arc(pos.x, pos.y, this.hitCircle.radius, 0, Math.PI * 2, false);
        c.fill();
    }

    // This moves the enemy and constrains its position
    move(seconds: number) {
        return this.accelerate(new Vector(0, FREEFALL_ACCEL), seconds);
    }

    // Enemy's reaction to a collision with the World
    reactToWorld(contact) {
        this.setDead(true);
    }

    // Enemy's reaction to a collision with a Player
    reactToPlayer(player) {
        this.setDead(true);
        player.setDead(true);
    }
}
