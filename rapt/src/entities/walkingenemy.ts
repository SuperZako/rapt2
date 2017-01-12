///<reference path="./Enemy.ts" />


//WalkingEnemy.subclasses(Enemy);
class WalkingEnemy extends Enemy {
    constructor(type, center, radius, elasticity) {
        // Enemy.prototype.constructor.call(this, type, elasticity);
        super(type, elasticity);
        this.hitCircle = new Circle(center, radius);
    }

    getShape() {
        return this.hitCircle;
    }

    move(seconds) {
        return this.velocity.mul(seconds);
    }
}
