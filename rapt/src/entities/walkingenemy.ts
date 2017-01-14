///<reference path="./Enemy.ts" />


//WalkingEnemy.subclasses(Enemy);
class WalkingEnemy extends Enemy {
    hitCircle: Circle;
    constructor(type, center: Vector, radius, elasticity) {
        // Enemy.prototype.constructor.call(this, type, elasticity);
        super(type, elasticity);
        this.hitCircle = new Circle(center, radius);
    }

    getShape() {
        return this.hitCircle;
    }

    move(seconds: number) {
        return this.velocity.mul(seconds);
    }
}
