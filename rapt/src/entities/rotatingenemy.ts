
// RotatingEnemy.subclasses(Enemy);

/**
  * Abstract class representing enemies that may rotating, including seeking enemies.
  * These enemies are all circular.
  */
class RotatingEnemy extends Enemy {
    hitCircle: Circle;
    constructor(type, center, radius, public heading, elasticity) {
        // Enemy.prototype.constructor.call(this, type, elasticity);
        super(type, elasticity);
        this.hitCircle = new Circle(center, radius);
        // this.heading = heading;
    }

    getShape() {
        return this.hitCircle;
    }
}
