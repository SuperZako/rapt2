///<reference path="./Enemy.ts" />

//HoveringEnemy.subclasses(Enemy);
class HoveringEnemy extends Enemy {
    /**
      * Abstract class representing a Hovering Enemy
      */
    hitCircle;
    constructor(type, center, radius, elasticity) {
        // Enemy.prototype.constructor.call(this, type, elasticity);
        super(type, elasticity);
        this.hitCircle = new Circle(center, radius);
    }

    getShape() {
        return this.hitCircle;
    }
}
