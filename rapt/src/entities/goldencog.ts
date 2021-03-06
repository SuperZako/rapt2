///<reference path="./Enemy.ts" />

var GOLDEN_COG_RADIUS = 0.25;

//GoldenCog.subclasses(Enemy);

class GoldenCog extends Enemy {
    hitCircle;
    timeSinceStart = 0;
    constructor(center) {
        //Enemy.prototype.constructor.call(this, -1, 0);
        super(-1, 0);

        this.hitCircle = new Circle(center, GOLDEN_COG_RADIUS);
        this.timeSinceStart = 0;

        gameState.incrementStat(STAT_NUM_COGS);
    }

    getShape() {
        return this.hitCircle;
    }

    reactToPlayer(player) {
        this.setDead(true);
    }
    onDeath() {
        if (gameState.gameStatus === GAME_IN_PLAY) {
            gameState.incrementStat(STAT_COGS_COLLECTED);
        }
        // Golden particle goodness
        var position = this.getCenter();
        for (var i = 0; i < 100; ++i) {
            var direction = Vector.fromAngle(randInRange(0, 2 * Math.PI));
            direction = this.velocity.add(direction.mul(randInRange(1, 5)));

            Particle.get().position(position).velocity(direction).radius(0.01, 1.5).bounces(0, 4).elasticity(0.05, 0.9).decay(0.01, 0.5).color(0.9, 0.87, 0, 1).mixColor(1, 0.96, 0, 1).triangle();
        }
    }

    afterTick(seconds) {
        this.timeSinceStart += seconds;
    }

    draw(c) {
        var position = this.getCenter();
        drawGoldenCog(c, position.x, position.y, this.timeSinceStart);
    }
}
