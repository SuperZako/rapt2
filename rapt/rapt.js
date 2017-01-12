(function () {
    var useBackgroundCache = true;
    function SplitScreenCamera(playerA, playerB, width, height) {
        this.playerA = playerA;;
        this.playerB = playerB;;
        this.width = width;;
        this.height = height;;
        if (useBackgroundCache) {
            this.backgroundCacheA = new BackgroundCache('a');;
            this.backgroundCacheB = new BackgroundCache('b');;
        } else {
            this.backgroundCacheA = null;;
            this.backgroundCacheB = null;;
        };

    };
    function clipHelper(c, w, h, split) {
        var tx = h / split.y;
        var ty = w / split.x;
        c.beginPath();;
        if ((-w) * split.y - (-h) * split.x >= 0) c.lineTo(-w, -h);;
        if (Math.abs(split.y * ty) <= h) c.lineTo(-split.x * ty, -split.y * ty);;
        if ((-w) * split.y - (+h) * split.x >= 0) c.lineTo(-w, +h);;
        if (Math.abs(split.x * tx) <= w) c.lineTo(split.x * tx, split.y * tx);;
        if ((+w) * split.y - (+h) * split.x >= 0) c.lineTo(+w, +h);;
        if (Math.abs(split.y * ty) <= h) c.lineTo(split.x * ty, split.y * ty);;
        if ((+w) * split.y - (-h) * split.x >= 0) c.lineTo(+w, -h);;
        if (Math.abs(split.x * tx) <= w) c.lineTo(-split.x * tx, -split.y * tx);;
        c.closePath();;
        c.clip();;

    };
    SplitScreenCamera.prototype.draw = function (c, renderer) {
        var _0, _1, _2, _3;
        var positionA = this.playerA.getCenter();
        var positionB = this.playerB.getCenter();
        var center = (_0 = (_1 = new Vector(0, 0), _1.x = positionA.x + positionB.x, _1.y = positionA.y + positionB.y, _1), _0.x /= 2, _0.y /= 2, _0);
        var temp = (_0 = (_2 = new Vector(0, 0), _2.x = positionB.x - positionA.x, _2.y = positionB.y - positionA.y, _2), _1 = Math.sqrt(_0.x * _0.x + _0.y * _0.y), _0.x /= _1, _0.y /= _1, _0);
        temp = new Vector(this.width / Math.abs(temp.x), this.height / Math.abs(temp.y));;
        var maxLength = Math.min(temp.x, temp.y) / 4;
        var isSplit = ((_0 = (_1 = new Vector(0, 0), _1.x = positionB.x - positionA.x, _1.y = positionB.y - positionA.y, _1), _0.x * _0.x + _0.y * _0.y) > 4 * maxLength * maxLength);
        if (!isSplit) {
            renderer.render(c, center, this.width, this.height, this.backgroundCacheA);;
        } else {
            var AtoB = (_0 = (_1 = (_3 = new Vector(0, 0), _3.x = positionB.x - positionA.x, _3.y = positionB.y - positionA.y, _3), _2 = Math.sqrt(_1.x * _1.x + _1.y * _1.y), _1.x /= _2, _1.y /= _2, _1), _0.x *= 99, _0.y *= 99, _0);
            var split = (_0 = new Vector(0, 0), _0.x = AtoB.y, _0.y = -AtoB.x, _0);
            var centerA = (_0 = new Vector(0, 0), _0.x = center.x - positionA.x, _0.y = center.y - positionA.y, _0);
            if ((centerA.x * centerA.x + centerA.y * centerA.y) > maxLength * maxLength) centerA = (_0 = (_1 = new Vector(0, 0), _2 = Math.sqrt(centerA.x * centerA.x + centerA.y * centerA.y), _1.x = centerA.x / _2, _1.y = centerA.y / _2, _1), _0.x *= maxLength, _0.y *= maxLength, _0);;
            centerA = (_0 = new Vector(0, 0), _0.x = centerA.x + positionA.x, _0.y = centerA.y + positionA.y, _0);;
            var centerB = (_0 = new Vector(0, 0), _0.x = center.x - positionB.x, _0.y = center.y - positionB.y, _0);
            if ((centerB.x * centerB.x + centerB.y * centerB.y) > maxLength * maxLength) centerB = (_0 = (_1 = new Vector(0, 0), _2 = Math.sqrt(centerB.x * centerB.x + centerB.y * centerB.y), _1.x = centerB.x / _2, _1.y = centerB.y / _2, _1), _0.x *= maxLength, _0.y *= maxLength, _0);;
            centerB = (_0 = new Vector(0, 0), _0.x = centerB.x + positionB.x, _0.y = centerB.y + positionB.y, _0);;
            c.save();;
            clipHelper(c, this.width / 2, this.height / 2, split);;
            renderer.render(c, centerA, this.width, this.height, this.backgroundCacheA);;
            c.restore();;
            c.save();;
            clipHelper(c, this.width / 2, this.height / 2, (_0 = -1, _1 = new Vector(0, 0), _1.x = split.x * _0, _1.y = split.y * _0, _1));;
            renderer.render(c, centerB, this.width, this.height, this.backgroundCacheB);;
            c.restore();;
            var splitSize = Math.min(0.1, ((_0 = (_1 = new Vector(0, 0), _1.x = positionB.x - positionA.x, _1.y = positionB.y - positionA.y, _1), Math.sqrt(_0.x * _0.x + _0.y * _0.y)) - 1.9 * maxLength) * 0.01);
            c.save();;
            c.lineWidth = 2 * splitSize;;
            c.strokeStyle = 'black';;
            c.beginPath();;
            c.moveTo(-split.x, -split.y);;
            c.lineTo(split.x, split.y);;
            c.stroke();;
            c.restore();;
        };

    };;
    var Camera = SplitScreenCamera;
    function PlayerStats(callback) {
        this.current_username = null;//susername;;
        this.stats = [];;
        if (this.current_username !== null) {
            var this_ = this;
            $.ajax({
                'url': '/stats/',
                'type': 'GET',
                'cache': false,
                'dataType': 'json',
                'success': function (stats) {
                    this_.stats = stats;;
                    callback();;

                }
            });;
        } else {
            this.stats = JSON.parse(getCookie('rapt') || '[]');;
            callback();;
        };

    };
    PlayerStats.prototype.getStatsForLevel = function (username, levelname) {
        for (var i = 0; i < this.stats.length; i++) {
            var stat = this.stats[i];
            if (stat['username'] == username && stat['levelname'] == levelname) {
                return stat;;
            };
        };
        return {
            'username': username,
            'levelname': levelname,
            'complete': false,
            'gotAllCogs': false
        };;

    };;
    PlayerStats.prototype.setStatsForLevel = function (username, levelname, complete, gotAllCogs) {
        for (var i = 0; i < this.stats.length; i++) {
            var stat = this.stats[i];
            if (stat['username'] == username && stat['levelname'] == levelname) {
                this.stats.splice(i--, 1);;
            };
        };
        var stat = {
            'username': username,
            'levelname': levelname,
            'complete': complete,
            'gotAllCogs': gotAllCogs
        };
        this.stats.push(stat);;
        if (this.current_username !== null) {
            $.ajax({
                'url': '/stats/',
                'type': 'PUT',
                'dataType': 'json',
                'data': JSON.stringify(stat),
                'beforeSend': function (xhr) {
                    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));;

                },
                'contentType': 'application/json; charset=utf-8'
            });;
        } else {
            setCookie('rapt', JSON.stringify(this.stats), 365 * 5);;
        };

    };;
    function Screen() {
        this.tick = function (seconds) {

        };;
        this.draw = function (c) {

        };;
        this.resize = function (w, h) {

        };;
        this.keyDown = function (key) {

        };;
        this.keyUp = function (key) {

        };;

    };
    Function.prototype.subclasses = function (obj) {
        $.extend(this.prototype, obj.prototype);;

    };;
    var MAX_SPAWN_FORCE = 100.0;
    var INNER_SPAWN_RADIUS = 1.0;
    var OUTER_SPAWN_RADIUS = 1.1;
    var ENEMY_BOMB = 0;
    var ENEMY_BOMBER = 1;
    var ENEMY_BOUNCY_ROCKET = 2;
    var ENEMY_BOUNCY_ROCKET_LAUNCHER = 3;
    var ENEMY_CLOUD = 4;
    var ENEMY_MAGNET = 5;
    var ENEMY_GRENADE = 6;
    var ENEMY_GRENADIER = 7;
    var ENEMY_HEADACHE = 8;
    var ENEMY_HELP_SIGN = 9;
    var ENEMY_HUNTER = 10;
    var ENEMY_LASER = 11;
    var ENEMY_MULTI_GUN = 12;
    var ENEMY_POPPER = 13;
    var ENEMY_RIOT_BULLET = 14;
    var ENEMY_JET_STREAM = 15;
    var ENEMY_ROCKET = 16;
    var ENEMY_ROCKET_SPIDER = 17;
    var ENEMY_ROLLER_BEAR = 18;
    var ENEMY_SHOCK_HAWK = 19;
    var ENEMY_SPIKE_BALL = 20;
    var ENEMY_STALACBAT = 21;
    var ENEMY_WALL_AVOIDER = 22;
    var ENEMY_CRAWLER = 23;
    var ENEMY_WHEELIGATOR = 24;
    var ENEMY_DOORBELL = 25;
    Enemy.subclasses(Entity);;
    function Enemy(type, elasticity) {
        Entity.prototype.constructor.call(this);;
        this.type = type;;
        this.elasticity = elasticity;;

    };
    Enemy.prototype.tick = function (seconds) {
        var _0, _1, _2, _3, _4;
        if (this.avoidsSpawn()) {
            this.setVelocity((_0 = this.getVelocity(), _1 = (_3 = this.avoidSpawnForce(), _4 = new Vector(0, 0), _4.x = _3.x * seconds, _4.y = _3.y * seconds, _4), _2 = new Vector(0, 0), _2.x = _0.x + _1.x, _2.y = _0.y + _1.y, _2));;
        };
        var ref_deltaPosition = {
            ref: this.move(seconds)
        };
        var ref_velocity = {
            ref: this.getVelocity()
        };
        var shape = this.getShape();
        var contact = null;
        if (this.canCollide()) {
            contact = CollisionDetector.collideEntityWorld(this, ref_deltaPosition, ref_velocity, this.elasticity, gameState.world, true);;
            this.setVelocity(ref_velocity.ref);;
        };
        shape.moveBy(ref_deltaPosition.ref);;
        if (contact !== null) {
            this.reactToWorld(contact);;
        };
        if (!CollisionDetector.containsPointShape(shape.getCenter(), gameState.world.getHugeAabb())) {
            this.setDead(true);;
        };
        if (!this.isDead()) {
            var players = CollisionDetector.overlapShapePlayers(shape);
            for (var i = 0; i < players.length; ++i) {
                if (!players[i].isDead()) {
                    this.reactToPlayer(players[i]);;
                };
            };
        };
        this.afterTick(seconds);;

    };;
    Enemy.prototype.getColor = function () {
        return EDGE_ENEMIES;;

    };;
    Enemy.prototype.getElasticity = function () {
        return this.elasticity;;

    };;
    Enemy.prototype.getType = function () {
        return this.type;;

    };;
    Enemy.prototype.getTarget = function () {
        return -1;;

    };;
    Enemy.prototype.setTarget = function (player) {

    };;
    Enemy.prototype.onDeath = function () {

    };;
    Enemy.prototype.canCollide = function () {
        return true;;

    };;
    Enemy.prototype.avoidsSpawn = function () {
        return false;;

    };;
    Enemy.prototype.accelerate = function (accel, seconds) {
        var _0, _1, _2, _3;
        this.setVelocity((_0 = this.velocity, _1 = (_3 = new Vector(0, 0), _3.x = accel.x * seconds, _3.y = accel.y * seconds, _3), _2 = new Vector(0, 0), _2.x = _0.x + _1.x, _2.y = _0.y + _1.y, _2));;
        return (_0 = this.velocity, _1 = new Vector(0, 0), _1.x = _0.x * seconds, _1.y = _0.y * seconds, _1);;

    };;
    Enemy.prototype.avoidSpawnForce = function () {
        var _0, _1, _2, _3;
        var relSpawnPosition = (_0 = gameState.getSpawnPoint(), _1 = this.getCenter(), _2 = new Vector(0, 0), _2.x = _0.x - _1.x, _2.y = _0.y - _1.y, _2);
        var radius = this.getShape().radius;
        var distance = (Math.sqrt(relSpawnPosition.x * relSpawnPosition.x + relSpawnPosition.y * relSpawnPosition.y)) - radius;
        if (distance < INNER_SPAWN_RADIUS) {
            return (_0 = (_2 = new Vector(0, 0), _3 = Math.sqrt(relSpawnPosition.x * relSpawnPosition.x + relSpawnPosition.y * relSpawnPosition.y), _2.x = relSpawnPosition.x / _3, _2.y = relSpawnPosition.y / _3, _2), _1 = -MAX_SPAWN_FORCE, _0.x *= _1, _0.y *= _1, _0);;
        } else if (distance < OUTER_SPAWN_RADIUS) {
            var magnitude = MAX_SPAWN_FORCE * (1 - (distance - INNER_SPAWN_RADIUS) / (OUTER_SPAWN_RADIUS - INNER_SPAWN_RADIUS));
            return (_0 = (_2 = new Vector(0, 0), _3 = Math.sqrt(relSpawnPosition.x * relSpawnPosition.x + relSpawnPosition.y * relSpawnPosition.y), _2.x = relSpawnPosition.x / _3, _2.y = relSpawnPosition.y / _3, _2), _1 = -magnitude, _0.x *= _1, _0.y *= _1, _0);;
        } else return new Vector(0, 0);;

    };;
    Enemy.prototype.move = function (seconds) {
        return new Vector(0, 0);;

    };;
    Enemy.prototype.reactToWorld = function (contact) {

    };;
    Enemy.prototype.reactToPlayer = function (player) {
        player.setDead(true);;

    };;
    Enemy.prototype.afterTick = function (seconds) {

    };;
    var DOORBELL_OPEN = 0;
    var DOORBELL_CLOSE = 1;
    var DOORBELL_TOGGLE = 2;
    var DOORBELL_WIDTH = 0.4;
    var DOORBELL_HEIGHT = 0.76;
    var DOORBELL_RADIUS = 0.11;
    var DOORBELL_SLICES = 3;
    Doorbell.subclasses(Enemy);;
    function Doorbell(center, behavior, visible) {
        var _0;
        Enemy.prototype.constructor.call(this, ENEMY_DOORBELL, 1);;
        this.hitBox = AABB.makeAABB(center, DOORBELL_WIDTH, DOORBELL_HEIGHT);;
        this.rotationPercent = 1;;
        this.restingAngle = (_0 = 2 * Math.PI, 0 + (_0 - 0) * Math.random());;
        this.behavior = behavior;;
        this.visible = visible;;
        this.triggeredLastTick = false;;
        this.triggeredThisTick = false;;
        this.doors = [];;

    };
    Doorbell.prototype.getShape = function () {
        return this.hitBox;;

    };;
    Doorbell.prototype.addDoor = function (doorIndex) {
        this.doors.push(doorIndex);;

    };;
    Doorbell.prototype.canCollide = function () {
        return false;;

    };;
    Doorbell.prototype.tick = function (seconds) {
        this.rotationPercent += seconds;;
        if (this.rotationPercent > 1) {
            this.rotationPercent = 1;;
        };
        this.triggeredThisTick = false;;
        Enemy.prototype.tick.call(this, seconds);;
        this.triggeredLastTick = this.triggeredThisTick;;

    };;
    Doorbell.prototype.reactToPlayer = function (player) {
        var _0, _1, _2;
        this.triggeredThisTick = true;;
        if (this.triggeredLastTick) {
            return;;
        };
        for (var i = 0; i < this.doors.length; ++i) {
            gameState.getDoor(this.doors[i]).act(this.behavior, false, true);;
        };
        for (var i = 0; i < 50; ++i) {
            var rotationAngle = (_0 = 2 * Math.PI, 0 + (_0 - 0) * Math.random());
            var direction = (_0 = Vector.fromAngle(rotationAngle), _1 = (3 + (5 - 3) * Math.random()), _2 = new Vector(0, 0), _2.x = _0.x * _1, _2.y = _0.y * _1, _2);
            Particle().position(this.getCenter()).velocity(direction).angle(rotationAngle).radius(0.05).bounces(3).elasticity(0.5).decay(0.01).line().color(1, 1, 1, 1);;
        };
        this.rotationPercent = 0;;

    };;
    Doorbell.prototype.draw = function (c) {
        var _0, _1, _2, _3;
        if (this.visible) {
            var pos = this.getCenter();
            var startingAngle = this.restingAngle + (2 * Math.PI / 3) / (this.rotationPercent + 0.1);
            c.fillStyle = 'white';;
            c.strokeStyle = 'black';;
            c.beginPath();;
            c.arc(pos.x, pos.y, DOORBELL_RADIUS, 0, 2 * Math.PI, false);;
            c.fill();;
            c.stroke();;
            c.beginPath();;
            for (var i = 0; i < DOORBELL_SLICES; ++i) {
                c.moveTo(pos.x, pos.y);;
                var nextPos = (_0 = (_2 = Vector.fromAngle(startingAngle + (i - 0.5) * (2 * Math.PI / DOORBELL_SLICES)), _3 = new Vector(0, 0), _3.x = _2.x * DOORBELL_RADIUS, _3.y = _2.y * DOORBELL_RADIUS, _3), _1 = new Vector(0, 0), _1.x = pos.x + _0.x, _1.y = pos.y + _0.y, _1);
                c.lineTo(nextPos.x, nextPos.y);;
            };
            c.stroke();;
        };

    };;
    var FREEFALL_ACCEL = -6;
    FreefallEnemy.subclasses(Enemy);;
    function FreefallEnemy(type, center, radius, elasticity) {
        Enemy.prototype.constructor.call(this, type, elasticity);;
        this.hitCircle = new Circle(center, radius);;

    };
    FreefallEnemy.prototype.getShape = function () {
        return this.hitCircle;;

    };;
    FreefallEnemy.prototype.draw = function (c) {
        var pos = this.hitCircle.center;
        c.fillStyle = 'black';;
        c.beginPath();;
        c.arc(pos.x, pos.y, this.hitCircle.radius, 0, Math.PI * 2, false);;
        c.fill();;

    };;
    FreefallEnemy.prototype.move = function (seconds) {
        return this.accelerate(new Vector(0, FREEFALL_ACCEL), seconds);;

    };;
    FreefallEnemy.prototype.reactToWorld = function (contact) {
        this.setDead(true);;

    };;
    FreefallEnemy.prototype.reactToPlayer = function (player) {
        this.setDead(true);;
        player.setDead(true);;

    };;
    var BOMB_RADIUS = 0.15;
    Bomb.subclasses(FreefallEnemy);;
    function Bomb(center, velocity) {
        FreefallEnemy.prototype.constructor.call(this, ENEMY_BOMB, center, BOMB_RADIUS, 0);;
        this.velocity = velocity;;

    };
    Bomb.prototype.onDeath = function () {
        var _0, _1, _2, _3;
        var position = this.getShape().getCenter();
        for (var i = 0; i < 50; ++i) {
            var direction = (_0 = Vector.fromAngle((_3 = 2 * Math.PI, 0 + (_3 - 0) * Math.random())), _1 = (0.5 + (7 - 0.5) * Math.random()), _2 = new Vector(0, 0), _2.x = _0.x * _1, _2.y = _0.y * _1, _2);
            Particle().position(position).velocity(direction).radius(0.02, 0.15).bounces(0, 4).elasticity(0.05, 0.9).decay(1e-05, 0.0001).expand(1.0, 1.2).color(1, 0.5, 0, 1).mixColor(1, 1, 0, 1).triangle();;
        };
        Particle().position(position).radius(0.1).bounces(0).gravity(false).decay(1e-06).expand(10).color(1, 1, 1, 5).circle();;

    };;
    var GOLDEN_COG_RADIUS = 0.25;
    GoldenCog.subclasses(Enemy);;
    function GoldenCog(center) {
        Enemy.prototype.constructor.call(this, -1, 0);;
        this.hitCircle = new Circle(center, GOLDEN_COG_RADIUS);;
        this.timeSinceStart = 0;;
        gameState.incrementStat(STAT_NUM_COGS);;

    };
    GoldenCog.prototype.getShape = function () {
        return this.hitCircle;;

    };;
    GoldenCog.prototype.reactToPlayer = function (player) {
        this.setDead(true);;

    };;
    GoldenCog.prototype.onDeath = function () {
        var _0, _1, _2, _3, _4;
        if (gameState.gameStatus === GAME_IN_PLAY) {
            gameState.incrementStat(STAT_COGS_COLLECTED);;
        };
        var position = this.getCenter();
        for (var i = 0; i < 100; ++i) {
            var direction = Vector.fromAngle((_0 = 2 * Math.PI, 0 + (_0 - 0) * Math.random()));
            direction = (_0 = this.velocity, _1 = (_3 = (1 + (5 - 1) * Math.random()), _4 = new Vector(0, 0), _4.x = direction.x * _3, _4.y = direction.y * _3, _4), _2 = new Vector(0, 0), _2.x = _0.x + _1.x, _2.y = _0.y + _1.y, _2);;
            Particle().position(position).velocity(direction).radius(0.01, 1.5).bounces(0, 4).elasticity(0.05, 0.9).decay(0.01, 0.5).color(0.9, 0.87, 0, 1).mixColor(1, 0.96, 0, 1).triangle();;
        };

    };;
    GoldenCog.prototype.afterTick = function (seconds) {
        this.timeSinceStart += seconds;;

    };;
    GoldenCog.prototype.draw = function (c) {
        var position = this.getCenter();
        drawGoldenCog(c, position.x, position.y, this.timeSinceStart);;

    };;
    var GRENADE_LIFETIME = 5;
    var GRENADE_RADIUS = 0.2;
    var GRENADE_ELASTICITY = 0.5;
    Grenade.subclasses(FreefallEnemy);;
    function Grenade(center, direction, speed) {
        FreefallEnemy.prototype.constructor.call(this, ENEMY_GRENADE, center, GRENADE_RADIUS, GRENADE_ELASTICITY);;
        this.velocity = new Vector(speed * Math.cos(direction), speed * Math.sin(direction));;
        this.timeUntilExplodes = GRENADE_LIFETIME;;

    };
    Grenade.prototype.draw = function (c) {
        var position = this.getShape().getCenter();
        var percentUntilExplodes = this.timeUntilExplodes / GRENADE_LIFETIME;
        c.fillStyle = 'black';;
        c.beginPath();;
        c.arc(position.x, position.y, (1 - percentUntilExplodes) * GRENADE_RADIUS, 0, Math.PI * 2, false);;
        c.fill();;
        c.strokeStyle = 'black';;
        c.beginPath();;
        c.arc(position.x, position.y, GRENADE_RADIUS, 0, Math.PI * 2, false);;
        c.stroke();;

    };;
    Grenade.prototype.tick = function (seconds) {
        this.timeUntilExplodes -= seconds;;
        if (this.timeUntilExplodes <= 0) {
            this.setDead(true);;
        };
        FreefallEnemy.prototype.tick.call(this, seconds);;

    };;
    Grenade.prototype.reactToWorld = function (contact) {

    };;
    Grenade.prototype.onDeath = function () {
        var _0, _1, _2, _3, _4;
        var position = this.getCenter();
        for (var i = 0; i < 100; i++) {
            var direction = (_0 = Vector.fromAngle((_3 = 2 * Math.PI, 0 + (_3 - 0) * Math.random())), _1 = (1 + (10 - 1) * Math.random()), _2 = new Vector(0, 0), _2.x = _0.x * _1, _2.y = _0.y * _1, _2);
            Particle().position(position).velocity(direction).radius(0.1, 0.2).bounces(0, 4).elasticity(0.05, 0.9).decay(0.0001, 0.001).expand(1, 1.2).color(1, 0.25, 0, 1).mixColor(1, 0.5, 0, 1).triangle();;
        };
        for (var i = 0; i < 50; i++) {
            var direction = Vector.fromAngle((_0 = 2 * Math.PI, 0 + (_0 - 0) * Math.random()));
            direction = (_0 = new Vector(0, 1), _1 = (_3 = (0.25 + (1 - 0.25) * Math.random()), _4 = new Vector(0, 0), _4.x = direction.x * _3, _4.y = direction.y * _3, _4), _2 = new Vector(0, 0), _2.x = _0.x + _1.x, _2.y = _0.y + _1.y, _2);;
            Particle().position(position).velocity(direction).radius(0.1, 0.2).bounces(1, 3).elasticity(0.05, 0.9).decay(0.0005, 0.1).expand(1.1, 1.3).color(0, 0, 0, 1).mixColor(0.5, 0.5, 0.5, 1).circle().gravity(-0.4, 0);;
        };

    };;
    var HELP_SIGN_TEXT_WIDTH = 1.5;
    var HELP_SIGN_WIDTH = 0.76;
    var HELP_SIGN_HEIGHT = 0.76;
    HelpSign.subclasses(Enemy);;
    function HelpSign(center, text, width) {
        Enemy.prototype.constructor.call(this, ENEMY_HELP_SIGN, 0);;
        this.hitBox = AABB.makeAABB(center, HELP_SIGN_WIDTH, HELP_SIGN_HEIGHT);;
        this.textArray = null;;
        this.text = text;;
        this.drawText = false;;
        this.timeSinceStart = 0;;
        if (width === undefined) {
            this.textWidth = HELP_SIGN_TEXT_WIDTH;;
        } else {
            this.textWidth = width;;
        };

    };
    HelpSign.prototype.splitUpText = function (c, phrase) {
        var words = phrase.split(' ');
        var phraseArray = new Array();
        var lastPhrase = '';
        c.font = '12px sans serif';;
        var maxWidth = this.textWidth * gameScale;
        var measure = 0;
        for (var i = 0; i < words.length; ++i) {
            var word = words[i];
            measure = c.measureText(lastPhrase + word).width;;
            if (measure < maxWidth) {
                lastPhrase += ' ' + word;;
            } else {
                if (lastPhrase.length > 0) phraseArray.push(lastPhrase);;
                lastPhrase = word;;
            };
            if (i == words.length - 1) {
                phraseArray.push(lastPhrase);;
                break;
            };
        };
        return phraseArray;;

    };;
    HelpSign.prototype.getShape = function () {
        return this.hitBox;;

    };;
    HelpSign.prototype.canCollide = function () {
        return false;;

    };;
    HelpSign.prototype.tick = function (seconds) {
        this.timeSinceStart += seconds;;
        this.drawText = false;;
        Enemy.prototype.tick.call(this, seconds);;

    };;
    HelpSign.prototype.reactToPlayer = function (player) {
        this.drawText = true;;

    };;
    HelpSign.prototype.draw = function (c) {
        if (this.textArray === null) {
            this.textArray = this.splitUpText(c, this.text);;
        };
        var pos = this.getCenter();
        c.save();;
        c.textAlign = 'center';;
        c.scale(1 / gameScale, -1 / gameScale);;
        c.save();;
        c.font = 'bold 34px sans-serif';;
        c.lineWidth = 1;;
        c.fillStyle = 'yellow';;
        c.strokeStyle = 'black';;
        c.translate(pos.x * gameScale, -pos.y * gameScale + 12);;
        var timeFloor = Math.floor(this.timeSinceStart);
        var scaleFactor = this.timeSinceStart - timeFloor;
        scaleFactor = Math.cos(scaleFactor * 2 * Math.PI) / 16 + 1;;
        c.scale(scaleFactor, scaleFactor);;
        c.fillText('?', 0, 0);;
        c.strokeText('?', 0, 0);;
        c.restore();;
        if (this.drawText) {
            var fontSize = 13;
            var xCenter = pos.x * gameScale;
            var yCenter = -(pos.y + 0.5) * gameScale - (fontSize + 2) * this.textArray.length / 2;
            drawTextBox(c, this.textArray, xCenter, yCenter, fontSize);;
        };
        c.restore();;

    };;
    HoveringEnemy.subclasses(Enemy);;
    function HoveringEnemy(type, center, radius, elasticity) {
        Enemy.prototype.constructor.call(this, type, elasticity);;
        this.hitCircle = new Circle(center, radius);;

    };
    HoveringEnemy.prototype.getShape = function () {
        return this.hitCircle;;

    };;
    var HEADACHE_RADIUS = 0.15;
    var HEADACHE_ELASTICITY = 0;
    var HEADACHE_SPEED = 3;
    var HEADACHE_RANGE = 6;
    var HEADACHE_CLOUD_RADIUS = HEADACHE_RADIUS * 0.5;
    function HeadacheChain(center) {
        this.points = [];;
        this.point = new Vector(center.x * gameScale, center.y * gameScale);;
        this.point.x += (Math.random() - 0.5) * HEADACHE_RADIUS;;
        this.point.y += (Math.random() - 0.5) * HEADACHE_RADIUS;;
        this.angle = Math.random() * Math.PI * 2;;

    };
    HeadacheChain.prototype.tick = function (seconds, center) {
        var speed = 600;
        var dx = this.point.x - center.x * gameScale;
        var dy = this.point.y - center.y * gameScale;
        var percentFromCenter = Math.min(1, Math.sqrt(dx * dx + dy * dy) / HEADACHE_CLOUD_RADIUS);
        var angleFromCenter = Math.atan2(dy, dx) - this.angle;
        while (angleFromCenter < -Math.PI) angleFromCenter += Math.PI * 2;;
        while (angleFromCenter > Math.PI) angleFromCenter -= Math.PI * 2;;
        var percentHeading = (Math.PI - Math.abs(angleFromCenter)) / Math.PI;
        var randomOffset = speed * (Math.random() - 0.5) * seconds;
        this.angle += randomOffset * (1 - percentFromCenter * 0.8) + percentHeading * percentFromCenter * (angleFromCenter > 0 ? -2 : 2);;
        this.angle -= Math.floor(this.angle / (Math.PI * 2)) * Math.PI * 2;;
        this.point.x += speed * Math.cos(this.angle) * seconds;;
        this.point.y += speed * Math.sin(this.angle) * seconds;;
        this.points.push(new Vector(this.point.x, this.point.y));;
        if (this.points.length > 15) this.points.shift();;

    };;
    HeadacheChain.prototype.draw = function (c) {
        for (var i = 1; i < this.points.length; i++) {
            var a = this.points[i - 1];
            var b = this.points[i];
            c.strokeStyle = 'rgba(0, 0, 0, ' + (i / this.points.length).toFixed(3) + ')';;
            c.beginPath();;
            c.moveTo(a.x / gameScale, a.y / gameScale);;
            c.lineTo(b.x / gameScale, b.y / gameScale);;
            c.stroke();;
        };

    };;
    Headache.subclasses(HoveringEnemy);;
    function Headache(center, target) {
        HoveringEnemy.prototype.constructor.call(this, ENEMY_HEADACHE, center, HEADACHE_RADIUS, HEADACHE_ELASTICITY);;
        this.target = target;;
        this.isAttached = false;;
        this.isTracking = false;;
        this.restingOffset = new Vector(0, -10);;
        this.chains = [];;
        for (var i = 0; i < 4; i++) {
            this.chains.push(new HeadacheChain(center));;
        };

    };
    Headache.prototype.move = function (seconds) {
        var _0, _1, _2, _3, _4;
        this.isTracking = false;;
        if (!this.isAttached) {
            if (this.target.isDead()) return new Vector(0, 0);;
            var delta = (_0 = this.target.getCenter(), _1 = this.getCenter(), _2 = new Vector(0, 0), _2.x = _0.x - _1.x, _2.y = _0.y - _1.y, _2);
            if ((delta.x * delta.x + delta.y * delta.y) < (HEADACHE_RANGE * HEADACHE_RANGE) && !CollisionDetector.lineOfSightWorld(this.getCenter(), this.target.getCenter(), gameState.world)) {
                delta.y += 0.45;;
                if ((delta.x * delta.x + delta.y * delta.y) > (HEADACHE_SPEED * seconds * HEADACHE_SPEED * seconds * 3)) {
                    this.isTracking = true;;
                    (_0 = Math.sqrt(delta.x * delta.x + delta.y * delta.y), delta.x /= _0, delta.y /= _0);;
                    delta = (_0 = HEADACHE_SPEED * seconds, _1 = new Vector(0, 0), _1.x = delta.x * _0, _1.y = delta.y * _0, _1);;
                } else {
                    this.isAttached = true;;
                };
                return delta;;
            };
        } else {
            if (this.target.isDead()) {
                this.setDead(true);;
            };
            var delta = (_0 = (_2 = this.target.getCenter(), _3 = new Vector(0, 0.45), _4 = new Vector(0, 0), _4.x = _2.x + _3.x, _4.y = _2.y + _3.y, _4), _1 = this.getCenter(), _0.x -= _1.x, _0.y -= _1.y, _0);
            if (this.target.getCrouch() && this.target.isOnFloor()) {
                delta.y -= 0.25;;
                if (this.target.facingRight) delta.x += 0.15; else delta.x -= 0.15;;
            };
            this.hitCircle.moveBy(delta);;
        };
        return new Vector(0, 0);;

    };;
    Headache.prototype.reactToWorld = function () {

    };;
    Headache.prototype.onDeath = function () {
        var _0, _1, _2, _3;
        gameState.incrementStat(STAT_ENEMY_DEATHS);;
        var position = this.getCenter();
        var direction = (_0 = Vector.fromAngle((_3 = 2 * Math.PI, 0 + (_3 - 0) * Math.random())), _1 = (0 + (0.05 - 0) * Math.random()), _2 = new Vector(0, 0), _2.x = _0.x * _1, _2.y = _0.y * _1, _2);
        var body = Particle().position(position).velocity(direction).radius(HEADACHE_RADIUS).bounces(3).elasticity(0.5).decay(0.01).circle().gravity(5);
        if (this.target == gameState.playerA) {
            body.color(1, 0, 0, 1);;
        } else {
            body.color(0, 0, 1, 1);;
        };
        for (var i = 0; i < 50; ++i) {
            var rotationAngle = (_0 = 2 * Math.PI, 0 + (_0 - 0) * Math.random());
            var direction = (_0 = Vector.fromAngle(rotationAngle), _1 = (3 + (5 - 3) * Math.random()), _2 = new Vector(0, 0), _2.x = _0.x * _1, _2.y = _0.y * _1, _2);
            Particle().position(this.getCenter()).velocity(direction).angle(rotationAngle).radius(0.05).bounces(3).elasticity(0.5).decay(0.01).line().color(0, 0, 0, 1);;
        };

    };;
    Headache.prototype.reactToPlayer = function (player) {
        if (player === this.target) {
            player.disableJump();;
        } else if (player.getVelocity().y < 0 && player.getCenter().y > this.getCenter().y) {
            this.setDead(true);;
        };

    };;
    Headache.prototype.getTarget = function () {
        return this.target === gameState.playerB;;

    };;
    Headache.prototype.afterTick = function (seconds) {
        var center = this.getCenter();
        for (var i = 0; i < this.chains.length; i++) {
            this.chains[i].tick(seconds, center);;
        };

    };;
    Headache.prototype.draw = function (c) {
        var center = this.getCenter();
        c.strokeStyle = 'black';;
        for (var i = 0; i < this.chains.length; i++) {
            this.chains[i].draw(c);;
        };
        c.fillStyle = (this.target == gameState.playerA) ? 'red' : 'blue';;
        c.beginPath();;
        c.arc(center.x, center.y, HEADACHE_RADIUS * 0.75, 0, Math.PI * 2, false);;
        c.fill();;
        c.stroke();;

    };;
    var LASER_RADIUS = 0.15;
    var LASER_SPEED = 5;
    var LASER_BOUNCES = 0;
    Laser.subclasses(FreefallEnemy);;
    function Laser(center, direction) {
        FreefallEnemy.prototype.constructor.call(this, ENEMY_LASER, center, LASER_RADIUS, 1);;
        this.bouncesLeft = LASER_BOUNCES;;
        this.velocity = new Vector(LASER_SPEED * Math.cos(direction), LASER_SPEED * Math.sin(direction));;

    };
    Laser.prototype.move = function (seconds) {
        var _0, _1;
        return (_0 = this.velocity, _1 = new Vector(0, 0), _1.x = _0.x * seconds, _1.y = _0.y * seconds, _1);;

    };;
    Laser.prototype.reactToWorld = function (contact) {
        var _0, _1;
        if (this.bouncesLeft <= 0) {
            this.setDead(true);;
            var position = this.getCenter();
            for (var i = 0; i < 20; ++i) {
                var angle = (_0 = 2 * Math.PI, 0 + (_0 - 0) * Math.random());
                var direction = Vector.fromAngle(angle);
                direction = (_0 = (0.5 + (5 - 0.5) * Math.random()), _1 = new Vector(0, 0), _1.x = direction.x * _0, _1.y = direction.y * _0, _1);;
                Particle().position(position).velocity(direction).angle(angle).radius(0.1).bounces(1).elasticity(1).decay(0.01).gravity(0).color(1, 1, 1, 1).line();;
            };
        } else {
            --this.bouncesLeft;;
        };

    };;
    Laser.prototype.draw = function (c) {
        var _0, _1, _2, _3;
        var heading = (_0 = (_1 = this.velocity, _2 = new Vector(0, 0), _3 = Math.sqrt(_1.x * _1.x + _1.y * _1.y), _2.x = _1.x / _3, _2.y = _1.y / _3, _2), _0.x *= LASER_RADIUS, _0.y *= LASER_RADIUS, _0);
        var segment = new Segment((_0 = this.getCenter(), _1 = new Vector(0, 0), _1.x = _0.x - heading.x, _1.y = _0.y - heading.y, _1), (_0 = this.getCenter(), _1 = new Vector(0, 0), _1.x = _0.x + heading.x, _1.y = _0.y + heading.y, _1));
        c.lineWidth = 0.07;;
        c.strokeStyle = 'white';;
        segment.draw(c);;
        c.lineWidth = 0.02;;

    };;
    var RIOT_BULLET_RADIUS = 0.1;
    var RIOT_BULLET_SPEED = 7;
    RiotBullet.subclasses(FreefallEnemy);;
    function RiotBullet(center, direction) {
        FreefallEnemy.prototype.constructor.call(this, ENEMY_RIOT_BULLET, center, RIOT_BULLET_RADIUS, 0);;
        this.velocity = new Vector(RIOT_BULLET_SPEED * Math.cos(direction), RIOT_BULLET_SPEED * Math.sin(direction));;

    };
    RiotBullet.prototype.reactToPlayer = function (player) {
        var _0, _1;
        if (!this.isDead()) {
            var deltaVelocity = (_0 = this.velocity, _1 = new Vector(0, 0), _1.x = _0.x * 0.75, _1.y = _0.y * 0.75, _1);
            player.addToVelocity(deltaVelocity);;
        };
        this.setDead(true);;

    };;
    RiotBullet.prototype.onDeath = function () {
        var _0, _1, _2, _3, _4;
        var position = this.getCenter();
        for (var i = 0; i < 5; ++i) {
            var direction = Vector.fromAngle((_0 = 2 * Math.PI, 0 + (_0 - 0) * Math.random()));
            direction = (_0 = this.velocity, _1 = (_3 = (0.1 + (1 - 0.1) * Math.random()), _4 = new Vector(0, 0), _4.x = direction.x * _3, _4.y = direction.y * _3, _4), _2 = new Vector(0, 0), _2.x = _0.x + _1.x, _2.y = _0.y + _1.y, _2);;
            Particle().position(position).velocity(direction).radius(0.01, 0.1).bounces(0, 4).elasticity(0.05, 0.9).decay(0.0005, 0.005).expand(1.0, 1.2).color(0.9, 0.9, 0, 1).mixColor(1, 1, 0, 1).circle();;
        };
        Enemy.prototype.onDeath.call(this);;

    };;
    RiotBullet.prototype.draw = function (c) {
        var pos = this.getCenter();
        c.strokeStyle = 'black';;
        c.fillStyle = 'yellow';;
        c.beginPath();;
        c.arc(pos.x, pos.y, RIOT_BULLET_RADIUS, 0, 2 * Math.PI, false);;
        c.fill();;
        c.stroke();;

    };;
    RotatingEnemy.subclasses(Enemy);;
    function RotatingEnemy(type, center, radius, heading, elasticity) {
        Enemy.prototype.constructor.call(this, type, elasticity);;
        this.hitCircle = new Circle(center, radius);;
        this.heading = heading;;

    };
    RotatingEnemy.prototype.getShape = function () {
        return this.hitCircle;;

    };;
    var CORROSION_CLOUD_RADIUS = 0.5;
    var CORROSION_CLOUD_SPEED = 0.7;
    var CORROSION_CLOUD_ACCEL = 10;
    CorrosionCloud.subclasses(RotatingEnemy);;
    function CorrosionCloud(center, target) {
        RotatingEnemy.prototype.constructor.call(this, ENEMY_CLOUD, center, CORROSION_CLOUD_RADIUS, 0, 0);;
        this.target = target;;
        this.smoothedVelocity = new Vector(0, 0);;

    };
    CorrosionCloud.prototype.canCollide = function () {
        return false;;

    };;
    CorrosionCloud.prototype.avoidsSpawn = function () {
        return true;;

    };;
    CorrosionCloud.prototype.move = function (seconds) {
        var _0, _1, _2;
        var avoidingSpawn = false;
        if (!this.target) return new Vector(0, 0);;
        var targetDelta = (_0 = this.target.getCenter(), _1 = this.getCenter(), _2 = new Vector(0, 0), _2.x = _0.x - _1.x, _2.y = _0.y - _1.y, _2);
        this.heading = adjustAngleToTarget(this.heading, targetDelta.atan2(), 7);;
        var speed = CORROSION_CLOUD_SPEED * CORROSION_CLOUD_ACCEL * seconds;
        this.velocity.x += speed * Math.cos(this.heading);;
        this.velocity.y += speed * Math.sin(this.heading);;
        if ((_0 = this.velocity, _0.x * _0.x + _0.y * _0.y) > (CORROSION_CLOUD_SPEED * CORROSION_CLOUD_SPEED)) {
            (_0 = this.velocity, _1 = Math.sqrt(_0.x * _0.x + _0.y * _0.y), _0.x /= _1, _0.y /= _1);;
            (_0 = this.velocity, _0.x *= CORROSION_CLOUD_SPEED, _0.y *= CORROSION_CLOUD_SPEED);;
        };
        return (_0 = this.velocity, _1 = new Vector(0, 0), _1.x = _0.x * seconds, _1.y = _0.y * seconds, _1);;

    };;
    CorrosionCloud.prototype.afterTick = function (seconds) {
        var _0, _1, _2, _3, _4;
        var direction = Vector.fromAngle((_0 = 2 * Math.PI, 0 + (_0 - 0) * Math.random()));
        var center = (_0 = this.getCenter(), _1 = (_3 = (0 + (CORROSION_CLOUD_RADIUS - 0) * Math.random()), _4 = new Vector(0, 0), _4.x = direction.x * _3, _4.y = direction.y * _3, _4), _2 = new Vector(0, 0), _2.x = _0.x + _1.x, _2.y = _0.y + _1.y, _2);
        var isRed = (this.target === gameState.playerA) ? 0.4 : 0;
        var isBlue = (this.target === gameState.playerB) ? 0.3 : 0;
        this.smoothedVelocity = (_0 = (_2 = this.smoothedVelocity, _3 = new Vector(0, 0), _3.x = _2.x * 0.95, _3.y = _2.y * 0.95, _3), _1 = (_2 = this.velocity, _3 = new Vector(0, 0), _3.x = _2.x * 0.05, _3.y = _2.y * 0.05, _3), _0.x += _1.x, _0.y += _1.y, _0);;
        Particle().position(center).velocity((_0 = this.smoothedVelocity, _1 = new Vector(0.1, 0.1), _2 = new Vector(0, 0), _2.x = _0.x - _1.x, _2.y = _0.y - _1.y, _2), (_0 = this.smoothedVelocity, _1 = new Vector(0.1, 0.1), _2 = new Vector(0, 0), _2.x = _0.x + _1.x, _2.y = _0.y + _1.y, _2)).radius(0.01, 0.1).bounces(0, 4).elasticity(0.05, 0.9).decay(0.01, 0.5).expand(1, 1.2).color(0.2 + isRed, 0.2, 0.2 + isBlue, 1).mixColor(0.1 + isRed, 0.1, 0.1 + isBlue, 1).circle().gravity(-0.4, 0);;

    };;
    CorrosionCloud.prototype.getTarget = function () {
        return this.target === gameState.playerB;;

    };;
    CorrosionCloud.prototype.draw = function (c) {

    };;
    var DOOM_MAGNET_RADIUS = 0.3;
    var DOOM_MAGNET_ELASTICITY = 0.5;
    var DOOM_MAGNET_RANGE = 10;
    var DOOM_MAGNET_ACCEL = 2;
    var MAGNET_MAX_ROTATION = 2 * Math.PI;
    DoomMagnet.subclasses(RotatingEnemy);;
    function DoomMagnet(center) {
        RotatingEnemy.prototype.constructor.call(this, ENEMY_MAGNET, center, DOOM_MAGNET_RADIUS, 0, DOOM_MAGNET_ELASTICITY);;
        this.bodySprite = new Sprite();;
        this.bodySprite.drawGeometry = function (c) {
            var length = 0.15;
            var outerRadius = 0.15;
            var innerRadius = 0.05;
            for (var scale = -1; scale <= 1; scale += 2) {
                c.fillStyle = 'red';;
                c.beginPath();;
                c.moveTo(-outerRadius - length, scale * innerRadius);;
                c.lineTo(-outerRadius - length, scale * outerRadius);;
                c.lineTo(-outerRadius - length + (outerRadius - innerRadius), scale * outerRadius);;
                c.lineTo(-outerRadius - length + (outerRadius - innerRadius), scale * innerRadius);;
                c.fill();;
                c.fillStyle = 'blue';;
                c.beginPath();;
                c.moveTo(outerRadius + length, scale * innerRadius);;
                c.lineTo(outerRadius + length, scale * outerRadius);;
                c.lineTo(outerRadius + length - (outerRadius - innerRadius), scale * outerRadius);;
                c.lineTo(outerRadius + length - (outerRadius - innerRadius), scale * innerRadius);;
                c.fill();;
            };
            c.strokeStyle = 'black';;
            c.beginPath();;
            c.arc(outerRadius, 0, outerRadius, 1.5 * Math.PI, 0.5 * Math.PI, true);;
            c.lineTo(outerRadius + length, outerRadius);;
            c.lineTo(outerRadius + length, innerRadius);;
            c.arc(outerRadius, 0, innerRadius, 0.5 * Math.PI, 1.5 * Math.PI, false);;
            c.lineTo(outerRadius + length, -innerRadius);;
            c.lineTo(outerRadius + length, -outerRadius);;
            c.lineTo(outerRadius, -outerRadius);;
            c.stroke();;
            c.beginPath();;
            c.arc(-outerRadius, 0, outerRadius, 1.5 * Math.PI, 2.5 * Math.PI, false);;
            c.lineTo(-outerRadius - length, outerRadius);;
            c.lineTo(-outerRadius - length, innerRadius);;
            c.arc(-outerRadius, 0, innerRadius, 2.5 * Math.PI, 1.5 * Math.PI, true);;
            c.lineTo(-outerRadius - length, -innerRadius);;
            c.lineTo(-outerRadius - length, -outerRadius);;
            c.lineTo(-outerRadius, -outerRadius);;
            c.stroke();;

        };;

    };
    DoomMagnet.prototype.avoidsSpawn = function () {
        return true;;

    };;
    DoomMagnet.prototype.calcHeadingVector = function (target) {
        var _0, _1, _2;
        if (target.isDead()) return new Vector(0, 0);;
        var delta = (_0 = target.getCenter(), _1 = this.getCenter(), _2 = new Vector(0, 0), _2.x = _0.x - _1.x, _2.y = _0.y - _1.y, _2);
        if ((delta.x * delta.x + delta.y * delta.y) > (DOOM_MAGNET_RANGE * DOOM_MAGNET_RANGE)) return new Vector(0, 0);;
        (_0 = Math.sqrt(delta.x * delta.x + delta.y * delta.y), delta.x /= _0, delta.y /= _0);;
        return delta;;

    };;
    DoomMagnet.prototype.move = function (seconds) {
        var _0, _1, _2, _3, _4, _5;
        var playerA = gameState.playerA;
        var playerB = gameState.playerB;
        var headingA = this.calcHeadingVector(playerA);
        var headingB = this.calcHeadingVector(playerB);
        var heading = (_0 = ((_2 = new Vector(0, 0), _2.x = headingA.x + headingB.x, _2.y = headingA.y + headingB.y, _2)), _1 = new Vector(0, 0), _1.x = _0.x * DOOM_MAGNET_ACCEL, _1.y = _0.y * DOOM_MAGNET_ACCEL, _1);
        var delta = this.accelerate(heading, seconds);
        (_0 = this.velocity, _1 = Math.pow(0.547821, seconds), _0.x *= _1, _0.y *= _1);;
        var center = this.getCenter();
        var oldAngle = this.bodySprite.angle;
        var targetAngle = oldAngle;
        if (!playerA.isDead() && playerB.isDead()) {
            targetAngle = ((_0 = playerA.getCenter(), _1 = new Vector(0, 0), _1.x = _0.x - center.x, _1.y = _0.y - center.y, _1)).atan2() + Math.PI;;
        } else if (playerA.isDead() && !playerB.isDead()) {
            targetAngle = ((_0 = playerB.getCenter(), _1 = new Vector(0, 0), _1.x = _0.x - center.x, _1.y = _0.y - center.y, _1)).atan2();;
        } else if (!playerA.isDead() && !playerB.isDead()) {
            var needsFlip = ((_0 = (_2 = (_4 = playerA.getCenter(), _5 = new Vector(0, 0), _5.x = _4.x - center.x, _5.y = _4.y - center.y, _5), _3 = _2.x, _2.x = _2.y, _2.y = -_3, _2), _1 = (_2 = playerB.getCenter(), _3 = new Vector(0, 0), _3.x = _2.x - center.x, _3.y = _2.y - center.y, _3), _0.x * _1.x + _0.y * _1.y) < 0);
            targetAngle = heading.atan2() - Math.PI * 0.5 + Math.PI * needsFlip;;
        };
        this.bodySprite.angle = adjustAngleToTarget(oldAngle, targetAngle, MAGNET_MAX_ROTATION * seconds);;
        return delta;;

    };;
    DoomMagnet.prototype.afterTick = function (seconds) {
        var position = this.getCenter();
        this.bodySprite.offsetBeforeRotation = new Vector(position.x, position.y);;

    };;
    DoomMagnet.prototype.draw = function (c) {
        this.bodySprite.draw(c);;

    };;
    var HUNTER_BODY = 0;
    var HUNTER_CLAW1 = 1;
    var HUNTER_CLAW2 = 2;
    var HUNTER_RADIUS = 0.3;
    var HUNTER_ELASTICITY = 0.4;
    var HUNTER_CHASE_ACCEL = 14;
    var HUNTER_FLEE_ACCEL = 3;
    var HUNTER_FLEE_RANGE = 10;
    var HUNTER_CHASE_RANGE = 8;
    var HUNTER_LOOKAHEAD = 20;
    var STATE_IDLE = 0;
    var STATE_RED = 1;
    var STATE_BLUE = 2;
    var STATE_BOTH = 3;
    Hunter.subclasses(RotatingEnemy);;
    function Hunter(center) {
        RotatingEnemy.prototype.constructor.call(this, ENEMY_HUNTER, center, HUNTER_RADIUS, 0, HUNTER_ELASTICITY);;
        this.state = STATE_IDLE;;
        this.acceleration = new Vector(0, 0);;
        this.jawAngle = 0;;
        this.sprites = [new Sprite(), new Sprite(), new Sprite()];;
        this.sprites[HUNTER_BODY].drawGeometry = function (c) {
            c.beginPath();;
            c.arc(0, 0, 0.1, 0, 2 * Math.PI, false);;
            c.stroke();;

        };;
        this.sprites[HUNTER_CLAW1].drawGeometry = this.sprites[HUNTER_CLAW2].drawGeometry = function (c) {
            c.beginPath();;
            c.moveTo(0, 0.1);;
            for (var i = 0; i <= 6; i++) c.lineTo((i & 1) / 24, 0.2 + i * 0.05);;
            c.arc(0, 0.2, 0.3, 0.5 * Math.PI, -0.5 * Math.PI, true);;
            c.stroke();;

        };;
        this.sprites[HUNTER_CLAW1].setParent(this.sprites[HUNTER_BODY]);;
        this.sprites[HUNTER_CLAW2].setParent(this.sprites[HUNTER_BODY]);;
        this.sprites[HUNTER_CLAW2].flip = true;;
        this.sprites[HUNTER_BODY].offsetAfterRotation = new Vector(0, -0.2);;

    };
    Hunter.prototype.avoidsSpawn = function () {
        return true;;

    };;
    Hunter.prototype.calcAcceleration = function (target) {
        var _0, _1, _2, _3, _4, _5, _6, _7;
        return (_0 = (_1 = (_3 = (_5 = new Vector(0, 0), _6 = Math.sqrt(target.x * target.x + target.y * target.y), _5.x = target.x / _6, _5.y = target.y / _6, _5), _4 = (_5 = this.velocity, _6 = 3.0 / HUNTER_CHASE_ACCEL, _7 = new Vector(0, 0), _7.x = _5.x * _6, _7.y = _5.y * _6, _7), _3.x -= _4.x, _3.y -= _4.y, _3), _2 = Math.sqrt(_1.x * _1.x + _1.y * _1.y), _1.x /= _2, _1.y /= _2, _1), _0.x *= HUNTER_CHASE_ACCEL, _0.y *= HUNTER_CHASE_ACCEL, _0);;

    };;
    Hunter.prototype.playerInSight = function (target, distanceSquared) {
        if (target.isDead()) return false;;
        var inSight = distanceSquared < (HUNTER_CHASE_RANGE * HUNTER_CHASE_RANGE);
        inSight &= !CollisionDetector.lineOfSightWorld(this.getCenter(), target.getCenter(), gameState.world);;
        return inSight;;

    };;
    Hunter.prototype.move = function (seconds) {
        var _0, _1, _2, _3, _4, _5;
        var deltaA = (_0 = gameState.playerA.getCenter(), _1 = this.getCenter(), _2 = new Vector(0, 0), _2.x = _0.x - _1.x, _2.y = _0.y - _1.y, _2);
        var deltaB = (_0 = gameState.playerB.getCenter(), _1 = this.getCenter(), _2 = new Vector(0, 0), _2.x = _0.x - _1.x, _2.y = _0.y - _1.y, _2);
        var projectedA = (_0 = (_2 = gameState.playerA.getVelocity(), _3 = HUNTER_LOOKAHEAD * seconds, _4 = new Vector(0, 0), _4.x = _2.x * _3, _4.y = _2.y * _3, _4), _1 = new Vector(0, 0), _1.x = deltaA.x + _0.x, _1.y = deltaA.y + _0.y, _1);
        var projectedB = (_0 = (_2 = gameState.playerB.getVelocity(), _3 = HUNTER_LOOKAHEAD * seconds, _4 = new Vector(0, 0), _4.x = _2.x * _3, _4.y = _2.y * _3, _4), _1 = new Vector(0, 0), _1.x = deltaB.x + _0.x, _1.y = deltaB.y + _0.y, _1);
        var distASquared = (deltaA.x * deltaA.x + deltaA.y * deltaA.y);
        var distBSquared = (deltaB.x * deltaB.x + deltaB.y * deltaB.y);
        var inSightA = this.playerInSight(gameState.playerA, distASquared);
        var inSightB = this.playerInSight(gameState.playerB, distBSquared);
        if (inSightA) {
            if (inSightB) {
                if (((_0 = this.velocity, deltaA.x * _0.x + deltaA.y * _0.y) * (_0 = this.velocity, deltaB.x * _0.x + deltaB.y * _0.y)) >= 0) {
                    this.acceleration = (_0 = (_2 = (_4 = new Vector(0, 0), _5 = Math.sqrt(deltaA.x * deltaA.x + deltaA.y * deltaA.y), _4.x = deltaA.x / _5, _4.y = deltaA.y / _5, _4), _3 = (_4 = new Vector(0, 0), _5 = Math.sqrt(deltaB.x * deltaB.x + deltaB.y * deltaB.y), _4.x = deltaB.x / _5, _4.y = deltaB.y / _5, _4), _2.x += _3.x, _2.y += _3.y, _2), _1 = -0.5 * HUNTER_FLEE_ACCEL, _0.x *= _1, _0.y *= _1, _0);;
                    this.target = null;;
                    this.state = STATE_BOTH;;
                } else if (distASquared < distBSquared) {
                    this.acceleration = this.calcAcceleration(projectedA);;
                    this.target = gameState.playerA;;
                    this.state = STATE_RED;;
                } else {
                    this.acceleration = this.calcAcceleration(projectedB);;
                    this.target = gameState.playerB;;
                    this.state = STATE_BLUE;;
                };
            } else {
                this.acceleration = this.calcAcceleration(projectedA);;
                this.target = gameState.playerA;;
                this.state = STATE_RED;;
            };
        } else if (inSightB) {
            this.acceleration = this.calcAcceleration(projectedB);;
            this.target = gameState.playerB;;
            this.state = STATE_BLUE;;
        } else {
            this.acceleration.x = this.acceleration.y = 0;;
            this.target = null;;
            this.state = STATE_IDLE;;
        };
        (_0 = this.velocity, _1 = Math.pow(0.366032, seconds), _0.x *= _1, _0.y *= _1);;
        return this.accelerate(this.acceleration, seconds);;

    };;
    Hunter.prototype.afterTick = function (seconds) {
        var _0, _1;
        var position = this.getCenter();
        this.sprites[HUNTER_BODY].offsetBeforeRotation = position;;
        if (this.target) {
            var currentAngle = this.sprites[HUNTER_BODY].angle;
            var targetAngle = (_0 = this.target.getCenter(), _1 = new Vector(0, 0), _1.x = _0.x - position.x, _1.y = _0.y - position.y, _1).atan2() - Math.PI / 2;
            this.sprites[HUNTER_BODY].angle = adjustAngleToTarget(currentAngle, targetAngle, Math.PI * seconds);;
        };
        var targetJawAngle = this.target ? -0.2 : 0;
        this.jawAngle = adjustAngleToTarget(this.jawAngle, targetJawAngle, 0.4 * seconds);;
        this.sprites[HUNTER_CLAW1].angle = this.jawAngle;;
        this.sprites[HUNTER_CLAW2].angle = this.jawAngle;;

    };;
    Hunter.prototype.draw = function (c) {
        var _0, _1, _2, _3;
        c.fillStyle = (this.target == gameState.playerA) ? 'red' : 'blue';;
        c.strokeStyle = 'black';;
        if (this.state != STATE_IDLE) {
            var angle = this.sprites[HUNTER_BODY].angle + Math.PI / 2;
            var fromEye = Vector.fromAngle(angle);
            var eye = (_0 = this.getCenter(), _1 = (_3 = new Vector(0, 0), _3.x = fromEye.x * 0.2, _3.y = fromEye.y * 0.2, _3), _2 = new Vector(0, 0), _2.x = _0.x - _1.x, _2.y = _0.y - _1.y, _2);
            if (this.state == STATE_RED) {
                c.fillStyle = 'red';;
                c.beginPath();;
                c.arc(eye.x, eye.y, 0.1, 0, 2 * Math.PI, false);;
                c.fill();;
            } else if (this.state == STATE_BLUE) {
                c.fillStyle = 'blue';;
                c.beginPath();;
                c.arc(eye.x, eye.y, 0.1, 0, 2 * Math.PI, false);;
                c.fill();;
            } else {
                c.fillStyle = 'red';;
                c.beginPath();;
                c.arc(eye.x, eye.y, 0.1, angle, angle + Math.PI, false);;
                c.fill();;
                c.fillStyle = 'blue';;
                c.beginPath();;
                c.arc(eye.x, eye.y, 0.1, angle + Math.PI, angle + 2 * Math.PI, false);;
                c.fill();;
                c.beginPath();;
                c.moveTo(eye.x - fromEye.x * 0.1, eye.y - fromEye.y * 0.1);;
                c.lineTo(eye.x + fromEye.x * 0.1, eye.y + fromEye.y * 0.1);;
                c.stroke();;
            };
        };
        this.sprites[HUNTER_BODY].draw(c);;

    };;
    var ROCKET_SPRITE_RED = 0;
    var ROCKET_SPRITE_BLUE = 1;
    var ROCKET_SPEED = 2.5;
    var ROCKET_MAX_ROTATION = 8;
    var ROCKET_RADIUS = 0.15;
    var ROCKET_ELASTICITY = 1;
    var ROCKET_HEADING_CONSTRAINT_TIME = 0.3;
    var PARTICLE_FREQUENCY = 0.03;
    function drawRocket(c) {
        var size = 0.075;
        c.strokeStyle = 'black';;
        c.beginPath();;
        c.moveTo(-ROCKET_RADIUS, size);;
        c.lineTo(ROCKET_RADIUS - size, size);;
        c.lineTo(ROCKET_RADIUS, 0);;
        c.lineTo(ROCKET_RADIUS - size, -size);;
        c.lineTo(-ROCKET_RADIUS, -size);;
        c.closePath();;
        c.fill();;
        c.stroke();;

    };
    Rocket.subclasses(RotatingEnemy);;
    function Rocket(center, target, heading, maxRotation, type) {
        RotatingEnemy.prototype.constructor.call(this, type, center, ROCKET_RADIUS, heading, ROCKET_ELASTICITY);;
        this.target = target;;
        this.maxRotation = maxRotation;;
        this.timeUntilFree = ROCKET_HEADING_CONSTRAINT_TIME;;
        this.timeUntilNextParticle = 0;;
        this.velocity = new Vector(ROCKET_SPEED * Math.cos(heading), ROCKET_SPEED * Math.sin(heading));;
        this.sprites = [new Sprite(), new Sprite()];;
        this.sprites[ROCKET_SPRITE_RED].drawGeometry = function (c) {
            c.fillStyle = 'red';;
            drawRocket(c);;

        };;
        this.sprites[ROCKET_SPRITE_BLUE].drawGeometry = function (c) {
            c.fillStyle = 'blue';;
            drawRocket(c);;

        };;

    };
    Rocket.prototype.getTarget = function () {
        return this.target === gameState.playerB;;

    };;
    Rocket.prototype.setTarget = function (player) {
        this.target = player;;

    };;
    Rocket.prototype.calcHeading = function (seconds) {
        var _0, _1, _2;
        if (this.target.isDead()) return;;
        var delta = (_0 = this.target.getCenter(), _1 = this.getCenter(), _2 = new Vector(0, 0), _2.x = _0.x - _1.x, _2.y = _0.y - _1.y, _2);
        var angle = delta.atan2();
        this.heading = adjustAngleToTarget(this.heading, angle, this.maxRotation * seconds);;

    };;
    Rocket.prototype.move = function (seconds) {
        var _0, _1;
        if (this.timeUntilFree <= 0) {
            this.calcHeading(seconds);;
            this.velocity = new Vector(ROCKET_SPEED * Math.cos(this.heading), ROCKET_SPEED * Math.sin(this.heading));;
        } else {
            this.timeUntilFree -= seconds;;
        };
        return (_0 = this.velocity, _1 = new Vector(0, 0), _1.x = _0.x * seconds, _1.y = _0.y * seconds, _1);;

    };;
    Rocket.prototype.afterTick = function (seconds) {
        var _0, _1, _2, _3, _4, _5;
        var position = this.getCenter();
        this.sprites[ROCKET_SPRITE_RED].offsetBeforeRotation = position;;
        this.sprites[ROCKET_SPRITE_BLUE].offsetBeforeRotation = position;;
        this.sprites[ROCKET_SPRITE_RED].angle = this.heading;;
        this.sprites[ROCKET_SPRITE_BLUE].angle = this.heading;;
        position = (_0 = (_2 = (_3 = this.velocity, _4 = new Vector(0, 0), _5 = Math.sqrt(_3.x * _3.x + _3.y * _3.y), _4.x = _3.x / _5, _4.y = _3.y / _5, _4), _2.x *= ROCKET_RADIUS, _2.y *= ROCKET_RADIUS, _2), _1 = new Vector(0, 0), _1.x = position.x - _0.x, _1.y = position.y - _0.y, _1);;
        this.timeUntilNextParticle -= seconds;;
        while (this.timeUntilNextParticle <= 0 && !this.isDead()) {
            var direction = Vector.fromAngle((_0 = 2 * Math.PI, 0 + (_0 - 0) * Math.random()));
            direction = (_0 = (_2 = (0 + (2 - 0) * Math.random()), _3 = new Vector(0, 0), _3.x = direction.x * _2, _3.y = direction.y * _2, _3), _1 = (_2 = this.velocity, _3 = new Vector(0, 0), _3.x = _2.x * 3, _3.y = _2.y * 3, _3), _0.x -= _1.x, _0.y -= _1.y, _0);;
            Particle().position(position).velocity(direction).radius(0.1, 0.15).bounces(1).decay(1e-06, 1e-05).expand(1.0, 1.2).color(1, 0.5, 0, 1).mixColor(1, 1, 0, 1).triangle();;
            direction = Vector.fromAngle((_0 = 2 * Math.PI, 0 + (_0 - 0) * Math.random()));;
            direction = (_0 = (_2 = (0.25 + (1 - 0.25) * Math.random()), _3 = new Vector(0, 0), _3.x = direction.x * _2, _3.y = direction.y * _2, _3), _1 = this.velocity, _0.x -= _1.x, _0.y -= _1.y, _0);;
            Particle().position(position).velocity(direction).radius(0.05, 0.1).bounces(1).elasticity(0.05, 0.9).decay(0.0005, 0.001).expand(1.2, 1.4).color(0, 0, 0, 0.25).mixColor(0.25, 0.25, 0.25, 0.75).circle().gravity(-0.4, 0);;
            this.timeUntilNextParticle += PARTICLE_FREQUENCY;;
        };

    };;
    Rocket.prototype.reactToWorld = function (contact) {
        this.setDead(true);;

    };;
    Rocket.prototype.reactToPlayer = function (player) {
        this.setDead(true);;
        player.setDead(true);;

    };;
    Rocket.prototype.onDeath = function () {
        var _0, _1;
        var position = this.getCenter();
        for (var i = 0; i < 50; ++i) {
            var direction = Vector.fromAngle((_0 = 2 * Math.PI, 0 + (_0 - 0) * Math.random()));
            direction = (_0 = (0.5 + (17 - 0.5) * Math.random()), _1 = new Vector(0, 0), _1.x = direction.x * _0, _1.y = direction.y * _0, _1);;
            Particle().position(position).velocity(direction).radius(0.02, 0.15).bounces(0, 4).elasticity(0.05, 0.9).decay(1e-05, 0.0001).expand(1.0, 1.2).color(1, 0.5, 0, 1).mixColor(1, 1, 0, 1).triangle();;
        };

    };;
    Rocket.prototype.draw = function (c) {
        this.sprites[this.target == gameState.playerA ? ROCKET_SPRITE_RED : ROCKET_SPRITE_BLUE].draw(c);;

    };;
    var BOUNCY_ROCKET_SPEED = 4;
    var BOUNCY_ROCKET_MAX_ROTATION = 3;
    var BOUNCY_ROCKET_HEALTH = 2;
    function drawBouncyRocket(c, isBlue) {
        var size = 0.1;
        c.strokeStyle = 'black';;
        c.fillStyle = isBlue ? 'blue' : 'red';;
        c.beginPath();;
        c.moveTo(-ROCKET_RADIUS, size);;
        c.arc(ROCKET_RADIUS - size, 0, size, Math.PI / 2, -Math.PI / 2, true);;
        c.lineTo(-ROCKET_RADIUS, -size);;
        c.fill();;
        c.stroke();;
        c.fillStyle = isBlue ? 'red' : 'blue';;
        c.beginPath();;
        c.arc(-ROCKET_RADIUS, 0, size, -Math.PI / 2, Math.PI / 2, false);;
        c.closePath();;
        c.fill();;
        c.stroke();;

    };
    BouncyRocket.subclasses(Rocket);;
    function BouncyRocket(center, target, heading, launcher) {
        Rocket.prototype.constructor.call(this, center, target, heading, BOUNCY_ROCKET_MAX_ROTATION, ENEMY_BOUNCY_ROCKET);;
        this.velocity = new Vector(BOUNCY_ROCKET_SPEED * Math.cos(heading), BOUNCY_ROCKET_SPEED * Math.sin(heading));;
        this.launcher = launcher;;
        this.hitsUntilExplodes = BOUNCY_ROCKET_HEALTH;;
        this.sprites[ROCKET_SPRITE_RED].drawGeometry = function (c) {
            drawBouncyRocket(c, false);;

        };;
        this.sprites[ROCKET_SPRITE_BLUE].drawGeometry = function (c) {
            drawBouncyRocket(c, true);;

        };;

    };
    BouncyRocket.prototype.move = function (seconds) {
        var _0, _1;
        this.heading = this.velocity.atan2();;
        this.calcHeading(seconds);;
        this.velocity = new Vector(BOUNCY_ROCKET_SPEED * Math.cos(this.heading), BOUNCY_ROCKET_SPEED * Math.sin(this.heading));;
        return (_0 = this.velocity, _1 = new Vector(0, 0), _1.x = _0.x * seconds, _1.y = _0.y * seconds, _1);;

    };;
    BouncyRocket.prototype.reactToWorld = function (contact) {
        --this.hitsUntilExplodes;;
        if (this.hitsUntilExplodes <= 0) {
            this.setDead(true);;
        } else {
            this.target = gameState.getOtherPlayer(this.target);;
        };

    };;
    BouncyRocket.prototype.setDead = function (isDead) {
        Entity.prototype.setDead.call(this, isDead);;
        if (isDead && this.launcher !== null) {
            this.launcher.rocketDestroyed();;
        };

    };;
    var SHOCK_HAWK_RADIUS = 0.3;
    var SHOCK_HAWK_ACCEL = 6;
    var SHOCK_HAWK_DECEL = 0.8;
    var SHOCK_HAWK_RANGE = 10;
    ShockHawk.subclasses(HoveringEnemy);;
    function ShockHawk(center, target) {
        HoveringEnemy.prototype.constructor.call(this, ENEMY_SHOCK_HAWK, center, SHOCK_HAWK_RADIUS, 0);;
        this.target = target;;
        this.chasing = false;;
        this.bodySprite = new Sprite();;
        this.bodySprite.drawGeometry = function (c) {
            c.beginPath();;
            c.moveTo(0, -0.15);;
            c.lineTo(0.05, -0.1);;
            c.lineTo(0, 0.1);;
            c.lineTo(-0.05, -0.1);;
            c.fill();;
            c.beginPath();;
            for (var scale = -1; scale <= 1; scale += 2) {
                c.moveTo(0, -0.3);;
                c.lineTo(scale * 0.05, -0.2);;
                c.lineTo(scale * 0.1, -0.225);;
                c.lineTo(scale * 0.1, -0.275);;
                c.lineTo(scale * 0.15, -0.175);;
                c.lineTo(0, 0.3);;
                c.moveTo(0, -0.15);;
                c.lineTo(scale * 0.05, -0.1);;
                c.lineTo(0, 0.1);;
            };
            c.stroke();;

        };;

    };
    ShockHawk.prototype.getTarget = function () {
        return target === gameState.playerB;;

    };;
    ShockHawk.prototype.setTarget = function (player) {
        this.target = player;;

    };;
    ShockHawk.prototype.avoidsSpawn = function () {
        if (this.chasing) {
            return false;;
        } else {
            return true;;
        };

    };;
    ShockHawk.prototype.move = function (seconds) {
        var _0, _1, _2;
        (_0 = this.velocity, _1 = Math.pow(0.818566804688, seconds), _0.x *= _1, _0.y *= _1);;
        if (!this.target || this.target.isDead()) {
            this.chasing = false;;
            return this.accelerate((_0 = this.velocity, _1 = -SHOCK_HAWK_DECEL, _2 = new Vector(0, 0), _2.x = _0.x * _1, _2.y = _0.y * _1, _2), seconds);;
        };
        var relTargetPos = (_0 = this.target.getCenter(), _1 = this.getCenter(), _2 = new Vector(0, 0), _2.x = _0.x - _1.x, _2.y = _0.y - _1.y, _2);
        if ((relTargetPos.x * relTargetPos.x + relTargetPos.y * relTargetPos.y) > (SHOCK_HAWK_RANGE * SHOCK_HAWK_RANGE)) {
            this.chasing = false;;
            return this.accelerate((_0 = this.velocity, _1 = -SHOCK_HAWK_DECEL, _2 = new Vector(0, 0), _2.x = _0.x * _1, _2.y = _0.y * _1, _2), seconds);;
        };
        this.chasing = true;;
        (_0 = Math.sqrt(relTargetPos.x * relTargetPos.x + relTargetPos.y * relTargetPos.y), relTargetPos.x /= _0, relTargetPos.y /= _0);;
        var accel = (_0 = new Vector(0, 0), _0.x = relTargetPos.x * SHOCK_HAWK_ACCEL, _0.y = relTargetPos.y * SHOCK_HAWK_ACCEL, _0);
        return this.accelerate(accel, seconds);;

    };;
    ShockHawk.prototype.onDeath = function () {
        gameState.incrementStat(STAT_ENEMY_DEATHS);;

    };;
    ShockHawk.prototype.afterTick = function (seconds) {
        var _0, _1;
        var position = this.getCenter();
        this.bodySprite.offsetBeforeRotation = position;;
        if (!this.target.isDead()) {
            this.bodySprite.angle = (_0 = this.target.getCenter(), _1 = new Vector(0, 0), _1.x = _0.x - position.x, _1.y = _0.y - position.y, _1).atan2() - Math.PI / 2;;
        };

    };;
    ShockHawk.prototype.draw = function (c) {
        c.fillStyle = (this.target == gameState.playerA) ? 'red' : 'blue';;
        c.strokeStyle = 'black';;
        this.bodySprite.draw(c);;

    };;
    SpawningEnemy.subclasses(Enemy);;
    function SpawningEnemy(type, center, width, height, elasticity, frequency, startingTime) {
        Enemy.prototype.constructor.call(this, type, elasticity);;
        this.spawnFrequency = frequency;;
        this.timeUntilNextSpawn = startingTime;;
        this.hitBox = AABB.makeAABB(center, width, height);;

    };
    SpawningEnemy.prototype.getShape = function () {
        return this.hitBox;;

    };;
    SpawningEnemy.prototype.getReloadPercentage = function () {
        return 1 - this.timeUntilNextSpawn / this.spawnFrequency;;

    };;
    SpawningEnemy.prototype.tick = function (seconds) {
        this.timeUntilNextSpawn -= seconds;;
        if (this.timeUntilNextSpawn <= 0) {
            if (this.spawn()) {
                this.timeUntilNextSpawn += this.spawnFrequency;;
            } else {
                this.timeUntilNextSpawn = 0;;
            };
        };
        Enemy.prototype.tick.call(this, seconds);;

    };;
    SpawningEnemy.prototype.reactToPlayer = function (player) {

    };;
    SpawningEnemy.prototype.spawn = function () {
        throw 'SpawningEnemy.spawn() unimplemented';

    };;
    var BOMBER_WIDTH = 0.4;
    var BOMBER_HEIGHT = 0.4;
    var BOMBER_SPEED = 2;
    var BOMB_FREQUENCY = 1.0;
    var BOMBER_ELASTICITY = 1.0;
    var BOMBER_EXPLOSION_POWER = 6;
    Bomber.subclasses(SpawningEnemy);;
    function Bomber(center, angle) {
        SpawningEnemy.prototype.constructor.call(this, ENEMY_BOMBER, center, BOMBER_WIDTH, BOMBER_HEIGHT, BOMBER_ELASTICITY, BOMB_FREQUENCY, (0 + (BOMB_FREQUENCY - 0) * Math.random()));;
        if (angle < Math.PI * 0.25) this.setVelocity(new Vector(BOMBER_SPEED, 0)); else if (angle < Math.PI * 0.75) this.setVelocity(new Vector(0, BOMBER_SPEED)); else if (angle < Math.PI * 1.25) this.setVelocity(new Vector(-BOMBER_SPEED, 0)); else if (angle < Math.PI * 1.75) this.setVelocity(new Vector(0, -BOMBER_SPEED)); else this.setVelocity(new Vector(BOMBER_SPEED, 0));;

    };
    Bomber.prototype.move = function (seconds) {
        var _0, _1;
        return (_0 = this.velocity, _1 = new Vector(0, 0), _1.x = _0.x * seconds, _1.y = _0.y * seconds, _1);;

    };;
    Bomber.prototype.reactToPlayer = function (player) {
        var _0, _1, _2;
        var relativePos = (_0 = player.getCenter(), _1 = this.getCenter(), _2 = new Vector(0, 0), _2.x = _0.x - _1.x, _2.y = _0.y - _1.y, _2);
        if (relativePos.y > (BOMBER_HEIGHT - 0.05)) {
            player.setVelocity(new Vector(player.getVelocity().x, BOMBER_EXPLOSION_POWER));;
            this.setDead(true);;
        } else if (player.isSuperJumping) {
            this.setDead(true);;
        } else {
            player.setDead(true);;
        };

    };;
    Bomber.prototype.spawn = function () {
        var spawnPoint = new Vector(this.hitBox.lowerLeft.x + this.hitBox.getWidth() * 0.5, this.hitBox.getBottom());
        gameState.addEnemy(new Bomb(spawnPoint, new Vector(0, Math.min(this.velocity.y, -0.3))), spawnPoint);;
        return true;;

    };;
    Bomber.prototype.afterTick = function () {

    };;
    Bomber.prototype.onDeath = function () {
        Bomb.prototype.onDeath.call(this);;
        gameState.incrementStat(STAT_ENEMY_DEATHS);;

    };;
    Bomber.prototype.draw = function (c) {
        var pos = this.getCenter();
        c.strokeStyle = 'black';;
        c.beginPath();;
        c.moveTo(pos.x - 0.25, pos.y - 0.2);;
        c.lineTo(pos.x - 0.25, pos.y - 0.1);;
        c.lineTo(pos.x - 0.1, pos.y + 0.05);;
        c.lineTo(pos.x + 0.1, pos.y + 0.05);;
        c.lineTo(pos.x + 0.25, pos.y - 0.1);;
        c.lineTo(pos.x + 0.25, pos.y - 0.2);;
        c.arc(pos.x, pos.y - BOMBER_HEIGHT * 0.5, BOMB_RADIUS, 0, Math.PI, false);;
        c.lineTo(pos.x - 0.25, pos.y - 0.2);;
        c.moveTo(pos.x - 0.1, pos.y + 0.05);;
        c.lineTo(pos.x - 0.2, pos.y + 0.15);;
        c.moveTo(pos.x + 0.1, pos.y + 0.05);;
        c.lineTo(pos.x + 0.2, pos.y + 0.15);;
        c.stroke();;
        c.fillStyle = 'black';;
        c.beginPath();;
        c.arc(pos.x, pos.y - BOMBER_HEIGHT * 0.5, BOMB_RADIUS * this.getReloadPercentage(), 0, 2 * Math.PI, false);;
        c.fill();;

    };;
    var BOUNCY_LAUNCHER_WIDTH = 0.5;
    var BOUNCY_LAUNCHER_HEIGHT = 0.5;
    var BOUNCY_LAUNCHER_SHOOT_FREQ = 1;
    var BOUNCY_LAUNCHER_RANGE = 8;
    BouncyRocketLauncher.subclasses(SpawningEnemy);;
    function BouncyRocketLauncher(center, target) {
        SpawningEnemy.prototype.constructor.call(this, ENEMY_BOUNCY_ROCKET_LAUNCHER, center, BOUNCY_LAUNCHER_WIDTH, BOUNCY_LAUNCHER_HEIGHT, 0, BOUNCY_LAUNCHER_SHOOT_FREQ, 0);;
        this.target = target;;
        this.canFire = true;;
        this.angle = 0;;
        this.bodySprite = new Sprite();;
        if (this.target === gameState.playerA) {
            this.bodySprite.drawGeometry = function (c) {
                c.strokeStyle = 'black';;
                c.beginPath();;
                c.moveTo(0, -0.1);;
                c.lineTo(-0.3, -0.1);;
                c.lineTo(-0.3, 0.1);;
                c.lineTo(0, 0 + 0.1);;
                c.stroke();;
                c.fillStyle = 'red';;
                c.beginPath();;
                c.arc(0, 0, 0.2, 0, 2 * Math.PI, false);;
                c.fill();;
                c.fillStyle = 'blue';;
                c.beginPath();;
                c.arc(0, 0, 0.2, 1.65 * Math.PI, 2.35 * Math.PI, false);;
                c.fill();;
                c.strokeStyle = 'black';;
                c.beginPath();;
                c.arc(0, 0, 0.2, 0, 2 * Math.PI, false);;
                c.stroke();;
                c.beginPath();;
                c.moveTo(0.1, -0.18);;
                c.lineTo(0.1, 0.18);;
                c.stroke();;

            };;
        } else {
            this.bodySprite.drawGeometry = function (c) {
                c.strokeStyle = 'black';;
                c.beginPath();;
                c.moveTo(0, -0.1);;
                c.lineTo(-0.3, -0.1);;
                c.lineTo(-0.3, 0.1);;
                c.lineTo(0, 0 + 0.1);;
                c.stroke();;
                c.fillStyle = 'blue';;
                c.beginPath();;
                c.arc(0, 0, 0.2, 0, 2 * Math.PI, false);;
                c.fill();;
                c.fillStyle = 'red';;
                c.beginPath();;
                c.arc(0, 0, 0.2, 1.65 * Math.PI, 2.35 * Math.PI, false);;
                c.fill();;
                c.strokeStyle = 'black';;
                c.beginPath();;
                c.arc(0, 0, 0.2, 0, 2 * Math.PI, false);;
                c.stroke();;
                c.fillStyle = 'black';;
                c.beginPath();;
                c.moveTo(0.1, -0.18);;
                c.lineTo(0.1, 0.18);;
                c.stroke();;

            };;
        };

    };
    BouncyRocketLauncher.prototype.setTarget = function (player) {
        this.target = player;;

    };;
    BouncyRocketLauncher.prototype.canCollide = function () {
        return false;;

    };;
    BouncyRocketLauncher.prototype.rocketDestroyed = function () {
        this.canFire = true;;

    };;
    BouncyRocketLauncher.prototype.getTarget = function () {
        return this.target === gameState.playerB;;

    };;
    BouncyRocketLauncher.prototype.spawn = function () {
        var _0, _1, _2;
        if (this.canFire && !this.target.isDead()) {
            var targetDelta = (_0 = this.target.getCenter(), _1 = this.getCenter(), _2 = new Vector(0, 0), _2.x = _0.x - _1.x, _2.y = _0.y - _1.y, _2);
            if ((Math.sqrt(targetDelta.x * targetDelta.x + targetDelta.y * targetDelta.y)) < BOUNCY_LAUNCHER_RANGE) {
                if (!CollisionDetector.lineOfSightWorld(this.getCenter(), this.target.getCenter(), gameState.world)) {
                    gameState.addEnemy(new BouncyRocket(this.getCenter(), this.target, targetDelta.atan2(), this), this.getCenter());;
                    this.canFire = false;;
                    return true;;
                };
            };
        };
        return false;;

    };;
    BouncyRocketLauncher.prototype.afterTick = function (seconds) {
        var _0, _1;
        var position = this.getCenter();
        if (!this.target.isDead()) {
            this.bodySprite.angle = ((_0 = this.target.getCenter(), _1 = new Vector(0, 0), _1.x = position.x - _0.x, _1.y = position.y - _0.y, _1)).atan2();;
        };
        this.bodySprite.offsetBeforeRotation = position;;

    };;
    BouncyRocketLauncher.prototype.draw = function (c) {
        this.bodySprite.draw(c);;

    };;
    var GRENADIER_WIDTH = 0.5;
    var GRENADIER_HEIGHT = 0.5;
    var GRENADIER_RANGE = 8;
    var GRENADIER_SHOOT_FREQ = 1.2;
    Grenadier.subclasses(SpawningEnemy);;
    function Grenadier(center, target) {
        SpawningEnemy.prototype.constructor.call(this, ENEMY_GRENADIER, center, GRENADIER_WIDTH, GRENADIER_HEIGHT, 0, GRENADIER_SHOOT_FREQ, (0 + (GRENADIER_SHOOT_FREQ - 0) * Math.random()));;
        this.target = target;;
        this.actualRecoilDistance = 0;;
        this.targetRecoilDistance = 0;;
        this.bodySprite = new Sprite();;
        this.bodySprite.drawGeometry = function (c) {
            var barrelLength = 0.25;
            var outerRadius = 0.25;
            var innerRadius = 0.175;
            c.beginPath();;
            c.moveTo(-outerRadius, -barrelLength);;
            c.lineTo(-innerRadius, -barrelLength);;
            c.lineTo(-innerRadius, -0.02);;
            c.lineTo(0, innerRadius);;
            c.lineTo(innerRadius, -0.02);;
            c.lineTo(innerRadius, -barrelLength);;
            c.lineTo(outerRadius, -barrelLength);;
            c.lineTo(outerRadius, 0);;
            c.lineTo(0, outerRadius + 0.02);;
            c.lineTo(-outerRadius, 0);;
            c.closePath();;
            c.fill();;
            c.stroke();;

        };;

    };
    Grenadier.prototype.getTarget = function () {
        return this.target === gameState.GetPlayerB();;

    };;
    Grenadier.prototype.setTarget = function (player) {
        this.target = player;;

    };;
    Grenadier.prototype.canCollide = function () {
        return false;;

    };;
    Grenadier.prototype.spawn = function () {
        var _0, _1, _2, _3, _4;
        var targetDelta = (_0 = (_2 = this.target.getCenter(), _3 = new Vector(0, 3), _4 = new Vector(0, 0), _4.x = _2.x + _3.x, _4.y = _2.y + _3.y, _4), _1 = this.getCenter(), _0.x -= _1.x, _0.y -= _1.y, _0);
        var direction = targetDelta.atan2();
        var distance = (Math.sqrt(targetDelta.x * targetDelta.x + targetDelta.y * targetDelta.y));
        if (!this.target.isDead() && distance < GRENADIER_RANGE) {
            if (!CollisionDetector.lineOfSightWorld(this.getCenter(), this.target.getCenter(), gameState.world)) {
                this.targetRecoilDistance = distance * (0.6 / GRENADIER_RANGE);;
                gameState.addEnemy(new Grenade(this.getCenter(), direction, (Math.sqrt(targetDelta.x * targetDelta.x + targetDelta.y * targetDelta.y))), this.getCenter());;
                return true;;
            };
        };
        return false;;

    };;
    Grenadier.prototype.afterTick = function (seconds) {
        var _0, _1, _2, _3;
        var position = this.getCenter();
        if (!this.target.isDead()) {
            this.bodySprite.angle = (_0 = (_1 = this.target.getCenter(), _2 = new Vector(0, 3), _3 = new Vector(0, 0), _3.x = _1.x + _2.x, _3.y = _1.y + _2.y, _3), _0.x -= position.x, _0.y -= position.y, _0).atan2() + Math.PI / 2;;
        };
        this.bodySprite.offsetBeforeRotation = position;;
        if (this.actualRecoilDistance < this.targetRecoilDistance) {
            this.actualRecoilDistance += 5 * seconds;;
            if (this.actualRecoilDistance >= this.targetRecoilDistance) {
                this.actualRecoilDistance = this.targetRecoilDistance;;
                this.targetRecoilDistance = 0;;
            };
        } else {
            this.actualRecoilDistance -= 0.5 * seconds;;
            if (this.actualRecoilDistance <= 0) {
                this.actualRecoilDistance = 0;;
            };
        };
        this.bodySprite.offsetAfterRotation = new Vector(0, this.actualRecoilDistance);;

    };;
    Grenadier.prototype.draw = function (c) {
        c.fillStyle = (this.target == gameState.playerA) ? 'red' : 'blue';;
        c.strokeStyle = 'black';;
        this.bodySprite.draw(c);;

    };;
    var JET_STREAM_WIDTH = 0.4;
    var JET_STREAM_HEIGHT = 0.4;
    var JET_STREAM_SHOOT_FREQ = 0.2;
    var NUM_BARRELS = 3;
    var JET_STREAM_SPRITE_A = 0;
    var JET_STREAM_SPRITE_B = 1;
    JetStream.subclasses(SpawningEnemy);;
    function JetStream(center, direction) {
        SpawningEnemy.prototype.constructor.call(this, ENEMY_JET_STREAM, center, JET_STREAM_WIDTH, JET_STREAM_HEIGHT, 0, JET_STREAM_SHOOT_FREQ, 0);;
        this.direction = direction;;
        this.reloadAnimation = 0;;
        this.sprites = [new Sprite(), new Sprite()];;
        this.sprites[JET_STREAM_SPRITE_A].drawGeometry = this.sprites[JET_STREAM_SPRITE_B].drawGeometry = function (c) {
            c.strokeStyle = 'black';;
            c.beginPath();;
            for (var i = 0; i < NUM_BARRELS; i++) {
                var angle = i * (2 * Math.PI / NUM_BARRELS);
                c.moveTo(0, 0);;
                c.lineTo(0.2 * Math.cos(angle), 0.2 * Math.sin(angle));;
            };
            c.stroke();;

        };;

    };
    JetStream.prototype.canCollide = function () {
        return false;;

    };;
    JetStream.prototype.spawn = function () {
        gameState.addEnemy(new RiotBullet(this.getCenter(), this.direction), this.getCenter());;
        return true;;

    };;
    JetStream.prototype.afterTick = function (seconds) {
        var _0, _1;
        this.reloadAnimation += seconds * (0.5 / JET_STREAM_SHOOT_FREQ);;
        var angle = this.reloadAnimation * (2 * Math.PI / NUM_BARRELS);
        var targetAngle = this.direction - Math.PI / 2;
        var bodyOffset = (_0 = Vector.fromAngle(targetAngle), _1 = new Vector(0, 0), _1.x = _0.x * 0.2, _1.y = _0.y * 0.2, _1);
        var position = this.getCenter();
        this.sprites[JET_STREAM_SPRITE_A].angle = targetAngle + angle;;
        this.sprites[JET_STREAM_SPRITE_B].angle = targetAngle - angle;;
        this.sprites[JET_STREAM_SPRITE_A].offsetBeforeRotation = (_0 = new Vector(0, 0), _0.x = position.x - bodyOffset.x, _0.y = position.y - bodyOffset.y, _0);;
        this.sprites[JET_STREAM_SPRITE_B].offsetBeforeRotation = (_0 = new Vector(0, 0), _0.x = position.x + bodyOffset.x, _0.y = position.y + bodyOffset.y, _0);;
        if (!(NUM_BARRELS & 1)) this.sprites[JET_STREAM_SPRITE_B].angle += Math.PI / NUM_BARRELS;;

    };;
    JetStream.prototype.draw = function (c) {
        var _0, _1, _2, _3, _4;
        this.sprites[JET_STREAM_SPRITE_A].draw(c);;
        this.sprites[JET_STREAM_SPRITE_B].draw(c);;
        var angle = this.reloadAnimation * (2 * Math.PI / NUM_BARRELS);
        var targetAngle = this.direction - Math.PI / 2;
        var position = this.getCenter();
        var bodyOffset = (_0 = Vector.fromAngle(targetAngle), _1 = new Vector(0, 0), _1.x = _0.x * 0.2, _1.y = _0.y * 0.2, _1);
        c.fillStyle = 'yellow';;
        c.strokeStyle = 'black';;
        for (var side = -1; side <= 1; side += 2) {
            for (var i = 0; i < NUM_BARRELS; i++) {
                var theta = i * (2 * Math.PI / NUM_BARRELS) - side * angle;
                var reload = (this.reloadAnimation - i * side) / NUM_BARRELS + (side == 1) * 0.5;
                if (side == 1 && !(NUM_BARRELS & 1)) {
                    theta += Math.PI / NUM_BARRELS;;
                    reload -= 0.5 / NUM_BARRELS;;
                };
                reload -= Math.floor(reload);;
                var pos = (_0 = (_2 = (_4 = new Vector(0, 0), _4.x = bodyOffset.x * side, _4.y = bodyOffset.y * side, _4), _3 = new Vector(0, 0), _3.x = position.x + _2.x, _3.y = position.y + _2.y, _3), _1 = bodyOffset.rotate(theta), _0.x += _1.x, _0.y += _1.y, _0);
                c.beginPath();;
                c.arc(pos.x, pos.y, 0.1 * reload, 0, 2 * Math.PI, false);;
                c.fill();;
                c.stroke();;
            };
        };

    };;
    var MULTI_GUN_WIDTH = 0.5;
    var MULTI_GUN_HEIGHT = 0.5;
    var MULTI_GUN_SHOOT_FREQ = 1.25;
    var MULTI_GUN_RANGE = 8;
    MultiGun.subclasses(SpawningEnemy);;
    function MultiGun(center) {
        var _0, _1, _2;
        SpawningEnemy.prototype.constructor.call(this, ENEMY_MULTI_GUN, center, MULTI_GUN_WIDTH, MULTI_GUN_HEIGHT, 0, MULTI_GUN_SHOOT_FREQ, 0);;
        this.redGun = null;;
        this.blueGun = null;;
        this.gunFired = new Array(4);;
        this.gunPositions = new Array(4);;
        var pos = this.getCenter();
        this.redGun = new Vector(pos.x, pos.y);;
        this.blueGun = new Vector(pos.x, pos.y);;
        this.gunPositions[0] = this.hitBox.lowerLeft;;
        this.gunPositions[1] = new Vector(this.hitBox.getRight(), this.hitBox.getBottom());;
        this.gunPositions[2] = new Vector(this.hitBox.getLeft(), this.hitBox.getTop());;
        this.gunPositions[3] = (_0 = this.hitBox.lowerLeft, _1 = new Vector(this.hitBox.getWidth(), this.hitBox.getHeight()), _2 = new Vector(0, 0), _2.x = _0.x + _1.x, _2.y = _0.y + _1.y, _2);;

    };
    MultiGun.prototype.canCollide = function () {
        return false;;

    };;
    MultiGun.prototype.vectorToIndex = function (v) {
        var indexX = (v.x < 0) ? 0 : 1;
        var indexY = (v.y < 0) ? 0 : 2;
        return indexX + indexY;;

    };;
    MultiGun.prototype.spawn = function () {
        var _0, _1, _2;
        for (var i = 0; i < 4; ++i) {
            this.gunFired[i] = false;;
        };
        var fired = false;
        for (var i = 0; i < 2; ++i) {
            var target = gameState.getPlayer(i);
            var index = this.vectorToIndex((_0 = target.getCenter(), _1 = this.getCenter(), _2 = new Vector(0, 0), _2.x = _0.x - _1.x, _2.y = _0.y - _1.y, _2));
            var relPosition = (_0 = target.getCenter(), _1 = this.gunPositions[index], _2 = new Vector(0, 0), _2.x = _0.x - _1.x, _2.y = _0.y - _1.y, _2);
            if (!target.isDead() && (relPosition.x * relPosition.x + relPosition.y * relPosition.y) < (MULTI_GUN_RANGE * MULTI_GUN_RANGE) && !CollisionDetector.lineOfSightWorld(this.gunPositions[index], target.getCenter(), gameState.world)) {
                if (!this.gunFired[index]) {
                    gameState.addEnemy(new Laser(this.gunPositions[index], relPosition.atan2()), this.gunPositions[index]);;
                    this.gunFired[index] = true;;
                    fired = true;;
                };
            };
        };
        return fired;;

    };;
    MultiGun.prototype.afterTick = function (seconds) {
        var _0, _1;
        var position = this.getCenter();
        var redGunTarget = this.gunPositions[this.vectorToIndex((_0 = gameState.playerA.getCenter(), _1 = new Vector(0, 0), _1.x = _0.x - position.x, _1.y = _0.y - position.y, _1))];
        var blueGunTarget = this.gunPositions[this.vectorToIndex((_0 = gameState.playerB.getCenter(), _1 = new Vector(0, 0), _1.x = _0.x - position.x, _1.y = _0.y - position.y, _1))];
        var speed = 4 * seconds;
        this.redGun.adjustTowardsTarget(redGunTarget, speed);;
        this.blueGun.adjustTowardsTarget(blueGunTarget, speed);;

    };;
    MultiGun.prototype.draw = function (c) {
        var _0, _1, _2;
        if (this.redGun.eq(this.blueGun) && !gameState.playerA.isDead() && !gameState.playerB.isDead()) {
            var angle = ((_0 = this.redGun, _1 = this.getCenter(), _2 = new Vector(0, 0), _2.x = _0.x - _1.x, _2.y = _0.y - _1.y, _2)).atan2();
            c.fillStyle = 'rgb(205, 0, 0)';;
            c.beginPath();;
            c.arc(this.redGun.x, this.redGun.y, 0.1, angle, angle + Math.PI, false);;
            c.fill();;
            c.fillStyle = 'rgb(0, 0, 255)';;
            c.beginPath();;
            c.arc(this.blueGun.x, this.blueGun.y, 0.1, angle + Math.PI, angle + 2 * Math.PI, false);;
            c.fill();;
        } else {
            if (!gameState.playerA.isDead()) {
                c.fillStyle = 'rgb(205, 0, 0)';;
                c.beginPath();;
                c.arc(this.redGun.x, this.redGun.y, 0.1, 0, 2 * Math.PI, false);;
                c.fill();;
            };
            if (!gameState.playerB.isDead()) {
                c.fillStyle = 'rgb(0, 0, 255)';;
                c.beginPath();;
                c.arc(this.blueGun.x, this.blueGun.y, 0.1, 0, 2 * Math.PI, false);;
                c.fill();;
            };
        };
        c.strokeStyle = 'black';;
        c.beginPath();;
        c.moveTo(this.gunPositions[0].x, this.gunPositions[0].y + 0.1);;
        c.lineTo(this.gunPositions[1].x, this.gunPositions[1].y + 0.1);;
        c.moveTo(this.gunPositions[0].x, this.gunPositions[0].y - 0.1);;
        c.lineTo(this.gunPositions[1].x, this.gunPositions[1].y - 0.1);;
        c.moveTo(this.gunPositions[2].x, this.gunPositions[2].y - 0.1);;
        c.lineTo(this.gunPositions[3].x, this.gunPositions[3].y - 0.1);;
        c.moveTo(this.gunPositions[2].x, this.gunPositions[2].y + 0.1);;
        c.lineTo(this.gunPositions[3].x, this.gunPositions[3].y + 0.1);;
        c.moveTo(this.gunPositions[0].x + 0.1, this.gunPositions[0].y);;
        c.lineTo(this.gunPositions[2].x + 0.1, this.gunPositions[2].y);;
        c.moveTo(this.gunPositions[0].x - 0.1, this.gunPositions[0].y);;
        c.lineTo(this.gunPositions[2].x - 0.1, this.gunPositions[2].y);;
        c.moveTo(this.gunPositions[1].x - 0.1, this.gunPositions[1].y);;
        c.lineTo(this.gunPositions[3].x - 0.1, this.gunPositions[3].y);;
        c.moveTo(this.gunPositions[1].x + 0.1, this.gunPositions[1].y);;
        c.lineTo(this.gunPositions[3].x + 0.1, this.gunPositions[3].y);;
        c.stroke();;
        c.beginPath();;
        c.arc(this.gunPositions[0].x, this.gunPositions[0].y, 0.1, 0, 2 * Math.PI, false);;
        c.stroke();;
        c.beginPath();;
        c.arc(this.gunPositions[1].x, this.gunPositions[1].y, 0.1, 0, 2 * Math.PI, false);;
        c.stroke();;
        c.beginPath();;
        c.arc(this.gunPositions[2].x, this.gunPositions[2].y, 0.1, 0, 2 * Math.PI, false);;
        c.stroke();;
        c.beginPath();;
        c.arc(this.gunPositions[3].x, this.gunPositions[3].y, 0.1, 0, 2 * Math.PI, false);;
        c.stroke();;

    };;
    var SPIKE_BALL_RADIUS = 0.2;
    function makeDrawSpikes(count) {
        var radii = [];
        for (var i = 0; i < count; i++) {
            radii.push((0.5 + (1.5 - 0.5) * Math.random()));;
        };
        return function (c) {
            c.strokeStyle = 'black';;
            c.beginPath();;
            for (var i = 0; i < count; i++) {
                var angle = i * (2 * Math.PI / count);
                var radius = SPIKE_BALL_RADIUS * radii[i];
                c.moveTo(0, 0);;
                c.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);;
            };
            c.stroke();;

        };;

    };
    SpikeBall.subclasses(Enemy);;
    function SpikeBall(center) {
        var _0;
        Enemy.prototype.constructor.call(this, ENEMY_SPIKE_BALL, 0);;
        this.hitCircle = new Circle(center, SPIKE_BALL_RADIUS);;
        this.sprites = [new Sprite(), new Sprite(), new Sprite()];;
        this.sprites[0].drawGeometry = makeDrawSpikes(11);;
        this.sprites[1].drawGeometry = makeDrawSpikes(13);;
        this.sprites[2].drawGeometry = makeDrawSpikes(7);;
        this.sprites[1].setParent(this.sprites[0]);;
        this.sprites[2].setParent(this.sprites[0]);;
        this.sprites[0].angle = (_0 = 2 * Math.PI, 0 + (_0 - 0) * Math.random());;
        this.sprites[1].angle = (_0 = 2 * Math.PI, 0 + (_0 - 0) * Math.random());;
        this.sprites[2].angle = (_0 = 2 * Math.PI, 0 + (_0 - 0) * Math.random());;

    };
    SpikeBall.prototype.getShape = function () {
        return this.hitCircle;;

    };;
    SpikeBall.prototype.canCollide = function () {
        return false;;

    };;
    SpikeBall.prototype.afterTick = function (seconds) {
        this.sprites[0].offsetBeforeRotation = this.getCenter();;
        this.sprites[0].angle -= seconds * (25 * Math.PI / 180);;
        this.sprites[1].angle += seconds * (65 * Math.PI / 180);;
        this.sprites[2].angle += seconds * (15 * Math.PI / 180);;

    };;
    SpikeBall.prototype.draw = function (c) {
        this.sprites[0].draw(c);;

    };;
    var STALACBAT_RADIUS = 0.2;
    var STALACBAT_SPEED = 2;
    var STALACBAT_SPRITE_BODY = 0;
    var STALACBAT_SPRITE_LEFT_WING = 1;
    var STALACBAT_SPRITE_RIGHT_WING = 2;
    Stalacbat.subclasses(FreefallEnemy);;
    function Stalacbat(center, target) {
        FreefallEnemy.prototype.constructor.call(this, ENEMY_STALACBAT, center, STALACBAT_RADIUS, 0);;
        this.target = target;;
        this.isFalling = false;;
        this.sprites = [new Sprite(), new Sprite(), new Sprite()];;
        this.sprites[STALACBAT_SPRITE_BODY].drawGeometry = function (c) {
            c.strokeStyle = 'black';;
            c.beginPath();;
            c.arc(0, 0, 0.1, 0, 2 * Math.PI, false);;
            c.stroke();;
            c.fill();;

        };;
        this.sprites[STALACBAT_SPRITE_LEFT_WING].drawGeometry = this.sprites[STALACBAT_SPRITE_RIGHT_WING].drawGeometry = function (c) {
            c.strokeStyle = 'black';;
            c.beginPath();;
            c.arc(0, 0, 0.2, 0, Math.PI / 2, false);;
            c.arc(0, 0, 0.15, Math.PI / 2, 0, true);;
            c.stroke();;
            c.beginPath();;
            c.moveTo(0.07, 0.07);;
            c.lineTo(0.1, 0.1);;
            c.stroke();;

        };;
        this.sprites[STALACBAT_SPRITE_LEFT_WING].setParent(this.sprites[STALACBAT_SPRITE_BODY]);;
        this.sprites[STALACBAT_SPRITE_RIGHT_WING].setParent(this.sprites[STALACBAT_SPRITE_BODY]);;

    };
    Stalacbat.prototype.move = function (seconds) {
        if (this.isFalling) {
            return FreefallEnemy.prototype.move.call(this, seconds);;
        } else if (this.target !== null && !this.target.isDead()) {
            var playerPos = this.target.getCenter();
            var pos = this.getCenter();
            if ((Math.abs(playerPos.x - pos.x) < 0.1) && (playerPos.y < pos.y)) {
                if (!CollisionDetector.lineOfSightWorld(pos, playerPos, gameState.world)) {
                    this.isFalling = true;;
                    return FreefallEnemy.prototype.move.call(this, seconds);;
                };
            };
        };
        return new Vector(0, 0);;

    };;
    Stalacbat.prototype.getTarget = function () {
        return this.target === gameState.playerB;;

    };;
    Stalacbat.prototype.afterTick = function (seconds) {
        var percent = this.velocity.y * -0.25;
        if (percent > 1) {
            percent = 1;;
        };
        var position = this.getCenter();
        this.sprites[STALACBAT_SPRITE_BODY].offsetBeforeRotation = new Vector(position.x, position.y + 0.1 - 0.2 * percent);;
        var angle = percent * Math.PI / 2;
        this.sprites[STALACBAT_SPRITE_LEFT_WING].angle = Math.PI - angle;;
        this.sprites[STALACBAT_SPRITE_RIGHT_WING].angle = angle - Math.PI / 2;;

    };;
    Stalacbat.prototype.onDeath = function () {
        var _0, _1, _2, _3;
        gameState.incrementStat(STAT_ENEMY_DEATHS);;
        var isRed = (this.target === gameState.playerA) ? 0.8 : 0;
        var isBlue = (this.target === gameState.playerB) ? 1 : 0;
        var position = this.getCenter();
        for (var i = 0; i < 15; ++i) {
            var direction = (_0 = Vector.fromAngle((_3 = 2 * Math.PI, 0 + (_3 - 0) * Math.random())), _1 = (5 + (10 - 5) * Math.random()), _2 = new Vector(0, 0), _2.x = _0.x * _1, _2.y = _0.y * _1, _2);
            Particle().position(position).velocity(direction).radius(0.2).bounces(3).decay(0.01).elasticity(0.5).color(isRed, 0, isBlue, 1).triangle();;
        };

    };;
    Stalacbat.prototype.draw = function (c) {
        if (this.target === gameState.playerA) {
            c.fillStyle = 'red';;
        } else {
            c.fillStyle = 'blue';;
        };
        this.sprites[STALACBAT_SPRITE_BODY].draw(c);;

    };;
    WalkingEnemy.subclasses(Enemy);;
    function WalkingEnemy(type, center, radius, elasticity) {
        Enemy.prototype.constructor.call(this, type, elasticity);;
        this.hitCircle = new Circle(center, radius);;

    };
    WalkingEnemy.prototype.getShape = function () {
        return this.hitCircle;;

    };;
    WalkingEnemy.prototype.move = function (seconds) {
        var _0, _1;
        return (_0 = this.velocity, _1 = new Vector(0, 0), _1.x = _0.x * seconds, _1.y = _0.y * seconds, _1);;

    };;
    var SPIDER_LEGS_RADIUS = 0.45;
    var SPIDER_LEGS_WEAK_SPOT_RADIUS = 0.2;
    var SPIDER_LEGS_ELASTICITY = 1.0;
    var SPIDER_LEGS_FLOOR_ELASTICITY = 0.1;
    RocketSpiderLegs.subclasses(WalkingEnemy);;
    function RocketSpiderLegs(center, angle, body) {
        WalkingEnemy.prototype.constructor.call(this, -1, center, SPIDER_LEGS_RADIUS, SPIDER_LEGS_ELASTICITY);;
        this.body = body;;
        this.weakSpot = new Circle(center, SPIDER_LEGS_WEAK_SPOT_RADIUS);;
        if (angle <= Math.PI * 0.5 || angle > Math.PI * 0.6666666) {
            this.velocity = new Vector(SPIDER_SPEED, 0);;
        } else {
            this.velocity = new Vector(-SPIDER_SPEED, 0);;
        };

    };
    RocketSpiderLegs.prototype.playerWillCollide = function (player) {
        if (player.isDead()) return false;;
        var toReturn = Math.abs(player.getShape().getAabb().getBottom() - this.hitCircle.getAabb().getBottom()) < 0.01;
        var xRelative = player.getCenter().x - this.getCenter().x;
        toReturn = toReturn && (Math.abs(xRelative) < 1) && (this.velocity.x * xRelative > -0.01);;
        return toReturn;;

    };;
    RocketSpiderLegs.prototype.move = function (seconds) {
        var _0, _1;
        if (this.isOnFloor()) {
            if (this.playerWillCollide(gameState.playerA) || this.playerWillCollide(gameState.playerB)) {
                this.velocity.x *= -1;;
            };
            return (_0 = this.velocity, _1 = new Vector(0, 0), _1.x = _0.x * seconds, _1.y = _0.y * seconds, _1);;
        } else {
            return this.accelerate(new Vector(0, FREEFALL_ACCEL), seconds);;
        };

    };;
    RocketSpiderLegs.prototype.reactToWorld = function (contact) {
        var _0, _1, _2, _3, _4;
        if (Edge.getOrientation(contact.normal) === EDGE_FLOOR) {
            var perpendicular = this.velocity.projectOntoAUnitVector(contact.normal);
            var parallel = (_0 = this.velocity, _1 = new Vector(0, 0), _1.x = _0.x - perpendicular.x, _1.y = _0.y - perpendicular.y, _1);
            this.velocity = (_0 = (_2 = (_3 = new Vector(0, 0), _4 = Math.sqrt(parallel.x * parallel.x + parallel.y * parallel.y), _3.x = parallel.x / _4, _3.y = parallel.y / _4, _3), _2.x *= SPIDER_SPEED, _2.y *= SPIDER_SPEED, _2), _1 = (_2 = new Vector(0, 0), _2.x = perpendicular.x * SPIDER_LEGS_FLOOR_ELASTICITY, _2.y = perpendicular.y * SPIDER_LEGS_FLOOR_ELASTICITY, _2), _0.x += _1.x, _0.y += _1.y, _0);;
        };

    };;
    RocketSpiderLegs.prototype.reactToPlayer = function (player) {
        this.weakSpot.moveTo(this.hitCircle.getCenter());;
        if (CollisionDetector.overlapShapePlayers(this.weakSpot).length === 0) {
            this.setDead(true);;
        };

    };;
    RocketSpiderLegs.prototype.setDead = function (isDead) {
        this.body.setDead(isDead);;
        Entity.prototype.setDead.call(this, isDead);;

    };;
    RocketSpiderLegs.prototype.onDeath = function () {
        var _0, _1;
        gameState.incrementStat(STAT_ENEMY_DEATHS);;
        var position = this.getCenter();
        for (var i = 0; i < 16; ++i) {
            var direction = Vector.fromAngle((_0 = 2 * Math.PI, 0 + (_0 - 0) * Math.random()));
            direction = (_0 = (0.5 + (5 - 0.5) * Math.random()), _1 = new Vector(0, 0), _1.x = direction.x * _0, _1.y = direction.y * _0, _1);;
            var angle = (_0 = 2 * Math.PI, 0 + (_0 - 0) * Math.random());
            var angularVelocity = (_0 = -Math.PI, _1 = Math.PI, _0 + (_1 - _0) * Math.random());
            Particle().position(position).velocity(direction).radius(0.25).bounces(3).elasticity(0.5).decay(0.01).line().angle(angle).angularVelocity(angularVelocity).color(0, 0, 0, 1);;
        };

    };;
    RocketSpiderLegs.prototype.draw = function (c) {

    };;
    var WALL_AVOIDER_RADIUS = 0.3;
    var WALL_AVOIDER_ACCEL = 3.3;
    WallAvoider.subclasses(RotatingEnemy);;
    function WallAvoider(center, target) {
        RotatingEnemy.prototype.constructor.call(this, ENEMY_WALL_AVOIDER, center, WALL_AVOIDER_RADIUS, 0, 0);;
        this.target = target;;
        this.acceleration = new Vector(0, 0);;
        this.angularVelocity = 0;;
        this.bodySprite = new Sprite();;
        this.bodySprite.drawGeometry = function (c) {
            c.beginPath();;
            c.arc(0, 0, 0.1, 0, 2 * Math.PI, false);;
            c.fill();;
            c.stroke();;
            c.beginPath();;
            for (var i = 0; i < 4; i++) {
                var angle = i * (2 * Math.PI / 4);
                var cos = Math.cos(angle), sin = Math.sin(angle);
                c.moveTo(cos * 0.1, sin * 0.1);;
                c.lineTo(cos * 0.3, sin * 0.3);;
                c.moveTo(cos * 0.16 - sin * 0.1, sin * 0.16 + cos * 0.1);;
                c.lineTo(cos * 0.16 + sin * 0.1, sin * 0.16 - cos * 0.1);;
                c.moveTo(cos * 0.23 - sin * 0.05, sin * 0.23 + cos * 0.05);;
                c.lineTo(cos * 0.23 + sin * 0.05, sin * 0.23 - cos * 0.05);;
            };
            c.stroke();;

        };;

    };
    WallAvoider.prototype.move = function (seconds) {
        var _0, _1, _2;
        if (this.target.isDead()) {
            this.velocity.x = this.velocity.y = 0;;
            return (_0 = this.velocity, _1 = new Vector(0, 0), _1.x = _0.x * seconds, _1.y = _0.y * seconds, _1);;
        } else {
            var targetDelta = (_0 = this.target.getCenter(), _1 = this.getCenter(), _2 = new Vector(0, 0), _2.x = _0.x - _1.x, _2.y = _0.y - _1.y, _2);
            var ref_shapePoint = {
            };
            var ref_worldPoint = {
            };
            var closestPointDist = CollisionDetector.closestToEntityWorld(this, 5, ref_shapePoint, ref_worldPoint, gameState.world);
            if (closestPointDist < 0.001) {
                return this.accelerate(new Vector(0, 0), seconds);;
            };
            this.acceleration = (_0 = new Vector(0, 0), _1 = Math.sqrt(targetDelta.x * targetDelta.x + targetDelta.y * targetDelta.y), _0.x = targetDelta.x / _1, _0.y = targetDelta.y / _1, _0);;
            if (closestPointDist < Number.POSITIVE_INFINITY) {
                var closestPointDelta = (_0 = ref_worldPoint.ref, _1 = this.getCenter(), _2 = new Vector(0, 0), _2.x = _0.x - _1.x, _2.y = _0.y - _1.y, _2);
                var wallAvoidance = (_0 = -1 / (closestPointDist * closestPointDist), _1 = new Vector(0, 0), _1.x = closestPointDelta.x * _0, _1.y = closestPointDelta.y * _0, _1);
                (_0 = this.acceleration, _0.x += wallAvoidance.x, _0.y += wallAvoidance.y);;
            };
            (_0 = this.acceleration, _1 = Math.sqrt(_0.x * _0.x + _0.y * _0.y), _0.x /= _1, _0.y /= _1);;
            (_0 = this.acceleration, _0.x *= WALL_AVOIDER_ACCEL, _0.y *= WALL_AVOIDER_ACCEL);;
            (_0 = this.velocity, _1 = Math.pow(0.366032, seconds), _0.x *= _1, _0.y *= _1);;
            return this.accelerate(this.acceleration, seconds);;
        };

    };;
    WallAvoider.prototype.reactToWorld = function (contact) {
        this.setDead(true);;

    };;
    WallAvoider.prototype.onDeath = function () {
        var _0, _1;
        gameState.incrementStat(STAT_ENEMY_DEATHS);;
        var position = this.getCenter();
        for (var i = 0; i < 50; ++i) {
            var direction = Vector.fromAngle((_0 = 2 * Math.PI, 0 + (_0 - 0) * Math.random()));
            direction = (_0 = (0.5 + (17 - 0.5) * Math.random()), _1 = new Vector(0, 0), _1.x = direction.x * _0, _1.y = direction.y * _0, _1);;
            Particle().position(position).velocity(direction).radius(0.02, 0.15).bounces(0, 4).elasticity(0.05, 0.9).decay(1e-06, 1e-05).expand(1.0, 1.2).color(1, 0.3, 0, 1).mixColor(1, 0.1, 0, 1).triangle();;
        };

    };;
    WallAvoider.prototype.getTarget = function () {
        return this.target === gameState.getPlayerB();;

    };;
    WallAvoider.prototype.afterTick = function (seconds) {
        var _0, _1;
        this.bodySprite.offsetBeforeRotation = this.getCenter();;
        this.angularVelocity = (this.angularVelocity + (_0 = -Math.PI, _1 = Math.PI, _0 + (_1 - _0) * Math.random())) * 0.5;;
        this.bodySprite.angle += this.angularVelocity * seconds;;

    };;
    WallAvoider.prototype.draw = function (c) {
        c.fillStyle = (this.target == gameState.playerA) ? 'red' : 'blue';;
        c.strokeStyle = 'black';;
        this.bodySprite.draw(c);;

    };;
    var WALL_CRAWLER_SPEED = 1;
    var WALL_CRAWLER_RADIUS = 0.25;
    var PULL_FACTOR = 0.9;
    var PUSH_FACTOR = 0.11;
    WallCrawler.subclasses(WalkingEnemy);;
    function WallCrawler(center, direction) {
        WalkingEnemy.prototype.constructor.call(this, ENEMY_CRAWLER, center, WALL_CRAWLER_RADIUS, 0);;
        this.firstTick = true;;
        this.clockwise = false;;
        this.velocity = new Vector(Math.cos(direction), Math.sin(direction));;
        this.bodySprite = new Sprite();;
        this.bodySprite.drawGeometry = function (c) {
            var space = 0.15;
            c.fillStyle = 'black';;
            c.strokeStyle = 'black';;
            c.beginPath();;
            c.arc(0, 0, 0.25, Math.PI * 0.25 + space, Math.PI * 0.75 - space, false);;
            c.stroke();;
            c.beginPath();;
            c.arc(0, 0, 0.25, Math.PI * 0.75 + space, Math.PI * 1.25 - space, false);;
            c.stroke();;
            c.beginPath();;
            c.arc(0, 0, 0.25, Math.PI * 1.25 + space, Math.PI * 1.75 - space, false);;
            c.stroke();;
            c.beginPath();;
            c.arc(0, 0, 0.25, Math.PI * 1.75 + space, Math.PI * 2.25 - space, false);;
            c.stroke();;
            c.beginPath();;
            c.arc(0, 0, 0.15, 0, 2 * Math.PI, false);;
            c.stroke();;
            c.beginPath();;
            c.moveTo(0.15, 0);;
            c.lineTo(0.25, 0);;
            c.moveTo(0, 0.15);;
            c.lineTo(0, 0.25);;
            c.moveTo(-0.15, 0);;
            c.lineTo(-0.25, 0);;
            c.moveTo(0, -0.15);;
            c.lineTo(0, -0.25);;
            c.stroke();;
            c.beginPath();;
            c.arc(0, 0, 0.05, 0, 2 * Math.PI, false);;
            c.fill();;

        };;

    };
    WallCrawler.prototype.move = function (seconds) {
        var _0, _1, _2, _3;
        var ref_shapePoint = {
        };
        var ref_worldPoint = {
        };
        var closestPointDist = CollisionDetector.closestToEntityWorld(this, 2, ref_shapePoint, ref_worldPoint, gameState.world);
        if (closestPointDist < Number.POSITIVE_INFINITY) {
            var delta = (_0 = this.getCenter(), _1 = ref_worldPoint.ref, _2 = new Vector(0, 0), _2.x = _0.x - _1.x, _2.y = _0.y - _1.y, _2);
            var flip = (_0 = new Vector(0, 0), _0.x = delta.y, _0.y = -delta.x, _0);
            if (this.firstTick) {
                if ((_0 = this.velocity, _0.x * flip.x + _0.y * flip.y) < 0) this.clockwise = true; else this.clockwise = false;;
                this.firstTick = false;;
            };
            if ((delta.x * delta.x + delta.y * delta.y) > (WALL_CRAWLER_RADIUS * WALL_CRAWLER_RADIUS * 1.1)) {
                if (this.clockwise) this.velocity = (_0 = (_2 = -1, _3 = new Vector(0, 0), _3.x = flip.x * _2, _3.y = flip.y * _2, _3), _1 = (_2 = new Vector(0, 0), _2.x = delta.x * PULL_FACTOR, _2.y = delta.y * PULL_FACTOR, _2), _0.x -= _1.x, _0.y -= _1.y, _0); else this.velocity = (_0 = (_2 = new Vector(0, 0), _2.x = delta.x * PULL_FACTOR, _2.y = delta.y * PULL_FACTOR, _2), _1 = new Vector(0, 0), _1.x = flip.x - _0.x, _1.y = flip.y - _0.y, _1);;
            } else {
                if (this.clockwise) this.velocity = (_0 = (_2 = -1, _3 = new Vector(0, 0), _3.x = flip.x * _2, _3.y = flip.y * _2, _3), _1 = (_2 = new Vector(0, 0), _2.x = delta.x * PUSH_FACTOR, _2.y = delta.y * PUSH_FACTOR, _2), _0.x += _1.x, _0.y += _1.y, _0); else this.velocity = (_0 = (_2 = new Vector(0, 0), _2.x = delta.x * PUSH_FACTOR, _2.y = delta.y * PUSH_FACTOR, _2), _1 = new Vector(0, 0), _1.x = flip.x + _0.x, _1.y = flip.y + _0.y, _1);;
            };
            (_0 = this.velocity, _1 = Math.sqrt(_0.x * _0.x + _0.y * _0.y), _0.x /= _1, _0.y /= _1);;
        };
        return (_0 = this.velocity, _1 = WALL_CRAWLER_SPEED * seconds, _2 = new Vector(0, 0), _2.x = _0.x * _1, _2.y = _0.y * _1, _2);;

    };;
    WallCrawler.prototype.afterTick = function (seconds) {
        var deltaAngle = WALL_CRAWLER_SPEED / WALL_CRAWLER_RADIUS * seconds;
        this.bodySprite.offsetBeforeRotation = this.getCenter();;
        if (this.clockwise) this.bodySprite.angle += deltaAngle; else this.bodySprite.angle -= deltaAngle;;

    };;
    WallCrawler.prototype.draw = function (c) {
        this.bodySprite.draw(c);;

    };;
    var WHEELIGATOR_RADIUS = 0.3;
    var WHEELIGATOR_SPEED = 3;
    var WHEELIGATOR_ELASTICITY = 1;
    var WHEELIGATOR_FLOOR_ELASTICITY = 0.3;
    Wheeligator.subclasses(WalkingEnemy);;
    function Wheeligator(center, angle) {
        WalkingEnemy.prototype.constructor.call(this, ENEMY_WHEELIGATOR, center, WHEELIGATOR_RADIUS, WHEELIGATOR_ELASTICITY);;
        this.hitGround = false;;
        this.angularVelocity = 0;;
        this.startsRight = (Math.cos(angle) > 0);;
        this.bodySprite = new Sprite();;
        this.bodySprite.drawGeometry = function (c) {
            var rim = 0.1;
            c.strokeStyle = 'black';;
            c.beginPath();;
            c.arc(0, 0, WHEELIGATOR_RADIUS, 0, 2 * Math.PI, false);;
            c.arc(0, 0, WHEELIGATOR_RADIUS - rim, Math.PI, 3 * Math.PI, false);;
            c.stroke();;
            c.fillStyle = 'black';;
            for (var i = 0; i < 4; i++) {
                var startAngle = i * (2 * Math.PI / 4);
                var endAngle = startAngle + Math.PI / 4;
                c.beginPath();;
                c.arc(0, 0, WHEELIGATOR_RADIUS, startAngle, endAngle, false);;
                c.arc(0, 0, WHEELIGATOR_RADIUS - rim, endAngle, startAngle, true);;
                c.fill();;
            };

        };;

    };
    ;;
    Wheeligator.prototype.move = function (seconds) {
        var _0, _1;
        var isOnFloor = this.isOnFloor();
        if (!this.hitGround && isOnFloor) {
            if (this.velocity.x < WHEELIGATOR_SPEED) {
                this.velocity.x = this.startsRight ? WHEELIGATOR_SPEED : -WHEELIGATOR_SPEED;;
                this.hitGround = true;;
            };
        };
        if (isOnFloor) {
            this.angularVelocity = -this.velocity.x / WHEELIGATOR_RADIUS;;
        };
        this.velocity.y += (FREEFALL_ACCEL * seconds);;
        return (_0 = this.velocity, _1 = new Vector(0, 0), _1.x = _0.x * seconds, _1.y = _0.y * seconds, _1);;

    };;
    Wheeligator.prototype.reactToWorld = function (contact) {
        var _0, _1, _2;
        if (Edge.getOrientation(contact.normal) === EDGE_FLOOR) {
            var perpendicular = this.velocity.projectOntoAUnitVector(contact.normal);
            var parallel = (_0 = this.velocity, _1 = new Vector(0, 0), _1.x = _0.x - perpendicular.x, _1.y = _0.y - perpendicular.y, _1);
            this.velocity = (_0 = (_2 = new Vector(0, 0), _2.x = perpendicular.x * WHEELIGATOR_FLOOR_ELASTICITY, _2.y = perpendicular.y * WHEELIGATOR_FLOOR_ELASTICITY, _2), _1 = new Vector(0, 0), _1.x = parallel.x + _0.x, _1.y = parallel.y + _0.y, _1);;
            this.angularVelocity = -this.velocity.x / WHEELIGATOR_RADIUS;;
        };

    };;
    Wheeligator.prototype.afterTick = function (seconds) {
        this.bodySprite.offsetBeforeRotation = this.getCenter();;
        this.bodySprite.angle = this.bodySprite.angle + this.angularVelocity * seconds;;

    };;
    Wheeligator.prototype.draw = function (c) {
        var pos = this.getCenter();
        this.bodySprite.draw(c);;

    };;
    var gameScale = 50;
    var GAME_WIN_TEXT = 'You won!  Hit SPACE to play the next level or ESC for the level selection menu.';
    var GOLDEN_COG_TEXT = 'You earned a golden cog!';
    var SILVER_COG_TEXT = 'You earned a silver cog!';
    var GAME_LOSS_TEXT = 'You lost.  Hit SPACE to restart, or ESC to select a new level.';
    var TEXT_BOX_X_MARGIN = 6;
    var TEXT_BOX_Y_MARGIN = 6;
    var SECONDS_BETWEEN_TICKS = 1 / 60;
    var useFixedPhysicsTick = true;
    Game.subclasses(Screen);;
    function Game() {
        this.camera = new Camera();;
        this.fps = 0;;
        this.fixedPhysicsTick = 0;;
        this.isDone = false;;
        this.onWin = null;;
        this.lastLevel = false;;
        gameState = new GameState();;

    };
    Game.prototype.resize = function (w, h) {
        this.width = w;;
        this.height = h;;
        this.camera = new Camera(gameState.playerA, gameState.playerB, w / gameScale, h / gameScale);;

    };;
    Game.prototype.tick = function (seconds) {
        var _0, _1;
        if (useFixedPhysicsTick) {
            var count = 0;
            this.fixedPhysicsTick += seconds;;
            while (++count <= 3 && this.fixedPhysicsTick >= 0) {
                this.fixedPhysicsTick -= SECONDS_BETWEEN_TICKS;;
                gameState.tick(SECONDS_BETWEEN_TICKS);;
                Particle.tick(SECONDS_BETWEEN_TICKS);;
            };
        } else {
            gameState.tick(seconds);;
            Particle.tick(seconds);;
        };
        this.fps = (_0 = this.fps, _1 = 1 / seconds, _0 + (_1 - _0) * 0.05);;
        if (!this.isDone && gameState.gameStatus != GAME_IN_PLAY) {
            this.isDone = true;;
            if (gameState.gameStatus == GAME_WON && this.onWin) {
                this.onWin();;
            };
        };

    };;
    Game.prototype.render = function (c, center, width, height, backgroundCache) {
        var halfWidth = width / 2;
        var halfHeight = height / 2;
        var xmin = center.x - halfWidth;
        var ymin = center.y - halfHeight;
        var xmax = center.x + halfWidth;
        var ymax = center.y + halfHeight;
        c.save();;
        c.translate(-center.x, -center.y);;
        if (backgroundCache) {
            backgroundCache.draw(c, xmin, ymin, xmax, ymax);;
        } else {
            gameState.world.draw(c, xmin, ymin, xmax, ymax);;
        };
        gameState.draw(c, xmin, ymin, xmax, ymax);;
        Particle.draw(c);;
        c.restore();;

    };;
    function drawTextBox(c, textArray, xCenter, yCenter, textSize) {
        var numLines = textArray.length;
        if (numLines < 1) return;;
        c.font = textSize + 'px Arial, sans-serif';;
        var lineHeight = textSize + 2;
        var textHeight = lineHeight * numLines;
        var textWidth = -1;
        for (var i = 0; i < numLines; ++i) {
            var currWidth = c.measureText(textArray[i]).width;
            if (textWidth < currWidth) {
                textWidth = currWidth;;
            };
        };
        c.fillStyle = '#BFBFBF';;
        c.strokeStyle = '#7F7F7F';;
        c.lineWidth = 1;;
        var xLeft = xCenter - textWidth / 2 - TEXT_BOX_X_MARGIN;
        var yBottom = yCenter - textHeight / 2 - TEXT_BOX_Y_MARGIN;
        c.fillRect(xLeft, yBottom, textWidth + TEXT_BOX_X_MARGIN * 2, textHeight + TEXT_BOX_Y_MARGIN * 2);;
        c.strokeRect(xLeft, yBottom, textWidth + TEXT_BOX_X_MARGIN * 2, textHeight + TEXT_BOX_Y_MARGIN * 2);;
        c.fillStyle = 'black';;
        c.textAlign = 'center';;
        var yCurr = yCenter + 4 - (numLines - 1) * lineHeight / 2;
        for (var i = 0; i < numLines; ++i) {
            c.fillText(textArray[i], xCenter, yCurr);;
            yCurr += lineHeight;;
        };

    };
    Game.prototype.draw = function (c) {
        if (!useBackgroundCache) {
            c.fillStyle = '#BFBFBF';;
            c.fillRect(0, 0, this.width, this.height);;
        };
        c.save();;
        c.translate(this.width / 2, this.height / 2);;
        c.scale(gameScale, -gameScale);;
        c.lineWidth = 1 / gameScale;;
        this.camera.draw(c, this);;
        c.restore();;
        if (gameState.gameStatus === GAME_WON) {
            c.save();;
            var gameWinText = (this.lastLevel ? 'Congratulations, you beat the last level in this set!\tPress SPACE or ESC to return to the level selection menu.' : GAME_WIN_TEXT);
            var cogsCollectedText = 'Cogs Collected: ' + gameState.stats[STAT_COGS_COLLECTED] + '/' + gameState.stats[STAT_NUM_COGS];
            drawTextBox(c, [gameWinText, '', cogsCollectedText], this.width / 2, this.height / 2, 14);;
            c.restore();;
        } else if (gameState.gameStatus === GAME_LOST) {
            c.save();;
            drawTextBox(c, [GAME_LOSS_TEXT], this.width / 2, this.height / 2, 14);;
            c.restore();;
        };
        c.font = '10px Arial, sans-serif';;
        c.fillStyle = 'black';;
        var text = this.fps.toFixed(0) + ' FPS';
        c.fillText(text, this.width - 5 - c.measureText(text).width, this.height - 5);;

    };;
    Game.prototype.keyDown = function (e) {
        var keyCode = e.which;
        var action = Keys.fromKeyCode(keyCode);
        if (action != null) {
            if (action.indexOf('a-') == 0) gameState.playerA[action.substr(2)] = true; else if (action.indexOf('b-') == 0) gameState.playerB[action.substr(2)] = true; else gameState[action] = true;;
            e.preventDefault();;
            e.stopPropagation();;
        };

    };;
    Game.prototype.keyUp = function (e) {
        var keyCode = e.which;
        var action = Keys.fromKeyCode(keyCode);
        if (action != null) {
            if (action.indexOf('a-') == 0) gameState.playerA[action.substr(2)] = false; else if (action.indexOf('b-') == 0) gameState.playerB[action.substr(2)] = false; else gameState[action] = false;;
            e.preventDefault();;
            e.stopPropagation();;
        };

    };;
    //var ENTER_KEY = 13;
    //var ESCAPE_KEY = 27;
    //var SPACEBAR = 32;
    //var UP_ARROW = 38;
    //var DOWN_ARROW = 40;
    //function getMenuUrl(username) {
    //    return '//' + location.host + '/data/' + username + '/';;

    //};
    //function getLevelUrl(username, levelname) {
    //    //return '//' + location.host + '/data/' + username + '/' + levelname + '/';;
    //    return '//' + location.host + '/data/' + "Intro 1.json";

    //};
    //function text2html(text) {
    //    return text ? text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') : '';;

    //};
    //function ajaxGet(what, url, onSuccess) {
    //    function showError() {
    //        $('#loadingScreen').html('Could not load ' + what + ' from<br><b>' + text2html(url) + '</b>');;

    //    };
    //    $.ajax({
    //        'url': url,
    //        'type': 'GET',
    //        'cache': false,
    //        'dataType': 'json',
    //        'success': function (data, status, request) {
    //            if (data != null) {
    //                onSuccess(data);;
    //            } else {
    //                showError();;
    //            };

    //        },
    //        'error': function (request, status, error) {
    //            showError();;

    //        }
    //    });;

    //};
    //function globalScaleFactor() {
    //    return 1;;

    //};
    //function MenuItem(levelname, title, difficulty) {
    //    this.levelname = levelname;;
    //    this.title = title;;
    //    this.difficulty = difficulty;;

    //};
    //function Menu() {
    //    this.username = null;;
    //    this.items = [];;
    //    this.isLoading = false;;
    //    this.selectedIndex = -1;;

    //};
    //Menu.prototype.load = function (username, onSuccess) {
    //    if (!this.isLoading && this.username == username) {
    //        if (onSuccess) onSuccess();;
    //        return;;
    //    };
    //    if (this.isLoading && this.username == username) {
    //        return;;
    //    };
    //    this.username = username;;
    //    this.items = [];;
    //    this.isLoading = true;;
    //    var this_ = this;
    //    ajaxGet('menu', getMenuUrl(username), function (json) {
    //        var levels = json['levels'];
    //        for (var i = 0; i < levels.length; i++) {
    //            var level = levels[i];
    //            this_.items.push(new MenuItem(level['html_title'], level['title'], level['difficulty']));;
    //        };
    //        this_.isLoading = false;;
    //        this_.selectedIndex = 0;;
    //        if (onSuccess) onSuccess();;

    //    });;

    //};;
    //Menu.prototype.updateSelectedIndex = function () {
    //    var selectedLevel = $('#level' + this.selectedIndex);
    //    if (selectedLevel.length > 0) {
    //        $('.level').blur();;
    //        $(selectedLevel).focus();;
    //        var scrollTop = $('#levelScreen').scrollTop() + $(selectedLevel).offset().top - 475;
    //        $('#levelScreen').scrollTop(scrollTop);;
    //    };

    //};;
    //Menu.prototype.show = function () {
    //    if (this.isLoading) {
    //        $('#canvas').hide();;
    //        $('#levelScreen').hide();;
    //        $('#loadingScreen').show();;
    //        $('#loadingScreen').html('Loading...');;
    //    } else {
    //        $('#canvas').hide();;
    //        $('#levelScreen').show();;
    //        $('#loadingScreen').hide();;
    //        var html = '<h2>';
    //        html += (this.username == 'rapt') ? 'Official Levels' : 'Levels made by ' + text2html(this.username);;
    //        html += '</h2><div id="levels">';;
    //        var prevDifficulty = null;
    //        for (var i = 0; i < this.items.length; i++) {
    //            var item = this.items[i];
    //            var difficulty = ['Easy', 'Medium', 'Hard', 'Brutal', 'Demoralizing'][item.difficulty];
    //            if (difficulty != prevDifficulty) {
    //                prevDifficulty = difficulty;;
    //                html += '<div class="difficulty">' + difficulty + '</div>';;
    //            };
    //            html += '<a class="level" id="level' + i + '" href="' + text2html(Hash.getLevelHash(this.username, item.levelname)) + '">';;
    //            var s = stats.getStatsForLevel(this.username, item.levelname);
    //            html += '<img src="/images/' + (s['gotAllCogs'] ? 'checkplus' : s['complete'] ? 'check' : 'empty') + '.png">';;
    //            html += text2html(item.title) + '</a>';;
    //        };
    //        html += '</div>';;
    //        $('#levelScreen').html(html);;
    //        var this_ = this;
    //        $('.level').hover(function () {
    //            $(this).focus();;

    //        });;
    //        $('.level').focus(function () {
    //            this_.selectedIndex = this.id.substr(5);;

    //        });;
    //        this.updateSelectedIndex();;
    //    };

    //};;
    //Menu.prototype.indexOfLevel = function (username, levelname) {
    //    if (username === this.username) {
    //        for (var i = 0; i < this.items.length; i++) {
    //            if (levelname === this.items[i].levelname) {
    //                return i;;
    //            };
    //        };
    //    };
    //    return -1;;

    //};;
    //Menu.prototype.isLastLevel = function (username, levelname) {
    //    if (username !== this.username) {
    //        return true;;
    //    } else {
    //        return this.indexOfLevel(username, levelname) >= this.items.length - 1;;
    //    };

    //};;
    //Menu.prototype.keyDown = function (e) {
    //    if (e.which == UP_ARROW) {
    //        if (this.selectedIndex > 0) this.selectedIndex--;;
    //        this.updateSelectedIndex();;
    //    } else if (e.which == DOWN_ARROW) {
    //        if (this.selectedIndex < this.items.length - 1) this.selectedIndex++;;
    //        this.updateSelectedIndex();;
    //    };

    //};;
    //Menu.prototype.keyUp = function (e) {

    //};;
    //function Level() {
    //    this.username = null;;
    //    this.levelname = null;;
    //    this.isLoading = false;;
    //    this.width = 800;;
    //    this.height = 600;;
    //    this.ratio = 0;;
    //    this.canvas = $('#canvas')[0];;
    //    this.context = this.canvas.getContext('2d');;
    //    this.lastTime = new Date();;
    //    this.game = null;;
    //    this.json = null;;

    //};
    //Level.prototype.tick = function () {
    //    var currentTime = new Date();
    //    var seconds = (currentTime - this.lastTime) / 1000;
    //    this.lastTime = currentTime;;
    //    var ratio = globalScaleFactor();
    //    if (ratio != this.ratio) {
    //        this.canvas.width = Math.round(this.width * ratio);;
    //        this.canvas.height = Math.round(this.height * ratio);;
    //        this.canvas.style.width = this.width + 'px';;
    //        this.canvas.style.height = this.height + 'px';;
    //        this.context.scale(ratio, ratio);;
    //    };
    //    if (this.game != null) {
    //        if (seconds > 0 && seconds < 1) this.game.tick(seconds);;
    //        this.game.lastLevel = menu.isLastLevel(this.username, this.levelname);;
    //        this.game.draw(this.context);;
    //    };

    //};;
    //Level.prototype.restart = function () {
    //    Particle.reset();;
    //    this.game = new Game();;
    //    this.game.resize(this.width, this.height);;
    //    gameState.loadLevelFromJSON(this.json);;
    //    var this_ = this;
    //    this.game.onWin = function () {
    //        var gotAllCogs = gameState.stats[STAT_COGS_COLLECTED] == gameState.stats[STAT_NUM_COGS];
    //        var s = stats.getStatsForLevel(this_.username, this_.levelname);
    //        stats.setStatsForLevel(this_.username, this_.levelname, true, s['gotAllCogs'] || gotAllCogs);;

    //    };;

    //};;
    //Level.prototype.load = function (username, levelname, onSuccess) {
    //    this.username = username;;
    //    this.levelname = levelname;;
    //    this.isLoading = true;;
    //    var this_ = this;
    //    ajaxGet('level', getLevelUrl(username, levelname), function (json) {
    //        this_.json = json;//JSON.parse(json['data']);;
    //        this_.restart();;
    //        this_.lastTime = new Date();;
    //        this_.isLoading = false;;
    //        if (onSuccess) onSuccess();;

    //    });;

    //};;
    //Level.prototype.show = function () {
    //    if (this.isLoading) {
    //        $('#canvas').hide();;
    //        $('#levelScreen').hide();;
    //        $('#loadingScreen').show();;
    //        $('#loadingScreen').html('Loading...');;
    //    } else {
    //        $('#canvas').show();;
    //        $('#levelScreen').hide();;
    //        $('#loadingScreen').hide();;
    //    };

    //};;
    //Level.prototype.keyDown = function (e) {
    //    if (this.game != null) {
    //        this.game.keyDown(e);;
    //        if (e.which == SPACEBAR) {
    //            if (gameState.gameStatus === GAME_LOST) {
    //                this.restart();;
    //            } else if (gameState.gameStatus === GAME_WON) {
    //                if (menu.isLastLevel(this.username, this.levelname)) {
    //                    hash.setHash(this.username, null);;
    //                } else {
    //                    var index = menu.indexOfLevel(this.username, this.levelname);
    //                    hash.setHash(this.username, menu.items[index + 1].levelname);;
    //                };
    //            };
    //        };
    //    };

    //};;
    //Level.prototype.keyUp = function (e) {
    //    if (this.game != null) {
    //        this.game.keyUp(e);;
    //    };

    //};;
    //function Hash() {
    //    this.username = null;;
    //    this.levelname = null;;
    //    this.hash = null;;
    //    this.prevHash = null;;

    //};
    //Hash.prototype.hasChanged = function () {
    //    if (this.hash != location.hash) {
    //        this.prevHash = this.hash;;
    //        this.hash = location.hash;;
    //        var levelMatches = /^#\/?([^\/]+)\/([^\/]+)\/?$/.exec(this.hash);
    //        var userMatches = /^#\/?([^\/]+)\/?$/.exec(this.hash);
    //        if (levelMatches != null) {
    //            this.username = levelMatches[1];;
    //            this.levelname = levelMatches[2];;
    //        } else if (userMatches != null) {
    //            this.username = userMatches[1];;
    //            this.levelname = null;;
    //        } else {
    //            this.username = null;;
    //            this.levelname = null;;
    //        };
    //        return true;;
    //    };
    //    return false;;

    //};;
    //Hash.prototype.setHash = function (username, levelname) {
    //    var newHash = '#/' + username + '/' + (levelname ? levelname + '/' : '');
    //    if (this.prevHash === newHash) {
    //        history.back();;
    //    } else {
    //        this.username = username;;
    //        this.levelname = levelname;;
    //        location.hash = newHash;;
    //    };

    //};;
    //Hash.getMenuHash = function (username) {
    //    return '#/' + username + '/';;

    //};;
    //Hash.getLevelHash = function (username, levelname) {
    //    return '#/' + username + '/' + levelname + '/';;

    //};;
    //var stats = null;
    //var hash = null;
    //var menu = null;
    //var level = null;
    //var keyToChange = null;
    //function scrollGameIntoWindow() {
    //    var windowTop = $('body').scrollTop(), windowHeight = $(window).height();
    //    var gameTop = $('#game').offset().top, gameHeight = $('#game').outerHeight();
    //    if (gameTop < windowTop || gameTop + gameHeight > windowTop + windowHeight) {
    //        $('html, body').animate({
    //            scrollTop: gameTop + (gameHeight - windowHeight) / 2
    //        });;
    //    };

    //};
    //$(document).ready(function () {
    //    scrollGameIntoWindow();;
    //    Keys.load();;
    //    hash = new Hash();;
    //    menu = new Menu();;
    //    level = new Level();;
    //    stats = new PlayerStats(function () {
    //        if (hash.levelname == null) {
    //            menu.show();;
    //        };

    //    });;
    //    tick();;
    //    setInterval(tick, 1000 / 60);;

    //});;
    //$('.key.changeable').live('mousedown', function (e) {
    //    keyToChange = this.id;;
    //    $('.key.changing').removeClass('changing');;
    //    $('#' + keyToChange).addClass('changing');;
    //    e.preventDefault();;
    //    e.stopPropagation();;

    //});;
    //$(document).keydown(function (e) {
    //    if (keyToChange != null) {
    //        Keys.keyMap[keyToChange] = e.which;;
    //        Keys.save();;
    //        $('#' + keyToChange).removeClass('changing');;
    //        e.preventDefault();;
    //        e.stopPropagation();;
    //        keyToChange = null;;
    //        return;;
    //    };
    //    if (!e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
    //        menu.keyDown(e);;
    //        level.keyDown(e);;
    //        if (e.which === ESCAPE_KEY) {
    //            hash.setHash(menu.username || level.username, null);;
    //        };
    //        if (e.which == UP_ARROW || e.which == DOWN_ARROW || e.which == SPACEBAR) {
    //            e.preventDefault();;
    //            e.stopPropagation();;
    //        };
    //    };

    //});;
    //$(document).keyup(function (e) {
    //    if (!e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
    //        menu.keyUp(e);;
    //        level.keyUp(e);;
    //        if (e.which == UP_ARROW || e.which == DOWN_ARROW || e.which == SPACEBAR) {
    //            e.preventDefault();;
    //            e.stopPropagation();;
    //        };
    //    };

    //});;
    //var flag = true;
    //function tick() {
    //    //if (hash.hasChanged()) {
    //    //    if (hash.username == null) {
    //    //        hash.setHash('rapt', null);;
    //    //    } else if (hash.levelname == null) {
    //    //        level.game = null;;
    //    //        var index = menu.indexOfLevel(level.username, level.levelname);
    //    //        if (index !== -1) menu.selectedIndex = index;;
    //    //        menu.load(hash.username, function () {
    //    //            menu.show();;

    //    //        });;
    //    //        menu.show();;
    //    //    } else {
    //    //        scrollGameIntoWindow();;
    //    //        menu.load(hash.username);;
    //    //        level.load(hash.username, hash.levelname, function () {
    //    //            level.show();;

    //    //        });;
    //    //        level.show();;
    //    //    };
    //    //};

    //    if (flag === true) {
    //        scrollGameIntoWindow();;
    //        menu.load(hash.username);;
    //        level.load(hash.username, hash.levelname, function () {
    //            level.show();;

    //        });;
    //        level.show();;
    //        flag = false;
    //    }
    //    level.tick();;

    //};
    var COG_ICON_TEETH_COUNT = 16;
    function drawCog(c, x, y, radius, numTeeth, numSpokes, changeBlending, numVertices) {
        var innerRadius = radius * 0.2;
        var spokeRadius = radius * 0.8;
        var spokeWidth1 = radius * 0.125;
        var spokeWidth2 = radius * 0.05;
        for (var loop = 0; loop < 2; loop++) {
            for (var iter = 0; iter <= loop; iter++) {
                c.beginPath();;
                for (var i = 0; i <= numVertices; i++) {
                    var angle = (i + 0.25) / numVertices * (2.0 * Math.PI);
                    var s = Math.sin(angle);
                    var csn = Math.cos(angle);
                    var r1 = radius * 0.7;
                    var r2 = radius * (1.0 + Math.cos(angle * numTeeth * 0.5) * 0.1);
                    if (!loop || !iter) c.lineTo(csn * r1, s * r1);;
                    if (!loop || iter) c.lineTo(csn * r2, s * r2);;
                };
                c.stroke();;
            };
            for (var i = 0; i < numSpokes; i++) {
                var angle = i / numSpokes * (Math.PI * 2.0);
                var s = Math.sin(angle);
                var csn = Math.cos(angle);
                c.beginPath();;
                c.lineTo(s * spokeWidth1, -csn * spokeWidth1);;
                c.lineTo(-s * spokeWidth1, csn * spokeWidth1);;
                c.lineTo(csn * spokeRadius - s * spokeWidth2, s * spokeRadius + csn * spokeWidth2);;
                c.lineTo(csn * spokeRadius + s * spokeWidth2, s * spokeRadius - csn * spokeWidth2);;
                c.fill();;
            };
        };

    };
    function drawCogIcon(c, x, y, time) {
        c.save();;
        c.strokeStyle = 'rgb(255, 245, 0)';;
        c.fillStyle = 'rgb(255, 245, 0)';;
        c.translate(x, y);;
        c.rotate(time * Math.PI / 2 + (time < 0 ? 2 * Math.PI / COG_ICON_TEETH_COUNT : 0));;
        drawCog(c, 0, 0, COG_ICON_RADIUS, COG_ICON_TEETH_COUNT, 5, false, 64);;
        c.restore();;

    };
    function drawGoldenCog(c, x, y, time) {
        c.save();;
        c.strokeStyle = 'rgb(255, 245, 0)';;
        c.fillStyle = 'rgb(255, 245, 0)';;
        c.translate(x, y);;
        c.rotate(time * Math.PI / 2);;
        drawCog(c, x, y, GOLDEN_COG_RADIUS, 16, 5, false, 64);;
        c.restore();;

    };
    function setCookie(name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));;
            var expires = '; expires=' + date.toGMTString();
        } else {
            var expires = '';
        };
        document.cookie = name + '=' + escape(value) + expires + '; path=/';;

    };
    function getCookie(name) {
        var nameEQ = name + '=';
        var parts = document.cookie.split(';');
        for (var i = 0; i < parts.length; i++) {
            var c = parts[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);;
            };
            if (c.indexOf(nameEQ) == 0) {
                return unescape(c.substring(nameEQ.length, c.length));;
            };
        };
        return null;;

    };
    var keyCodeArray = [, , , 'CANCEL', , , 'HELP', , 'BACK SPACE', 'TAB', , , 'CLEAR', 'RETURN', 'ENTER', , 'SHIFT', 'CTRL', 'ALT', 'PAUSE', 'CAPS LOCK', , , , , , , 'ESCAPE', , , , , 'SPACE', 'PAGE UP', 'PAGE DOWN', 'END', 'HOME', '&larr;', '&uarr;', '&rarr;', '&darr;', , , , 'PRINT SCREEN', 'INSERT', 'DELETE', , '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', , ';', , '=', , , , 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'META', , 'CONTEXT MENU', , , 'NUMPAD0', 'NUMPAD1', 'NUMPAD2', 'NUMPAD3', 'NUMPAD4', 'NUMPAD5', 'NUMPAD6', 'NUMPAD7', 'NUMPAD8', 'NUMPAD9', '*', '+', 'SEPARATOR', '-', 'DECIMAL', 'DIVIDE', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', , , , , , , , , 'NUM LOCK', 'SCROLL LOCK', , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ';', '=', ',', '-', '.', '/', '"', , , , , , , , , , , , , , , , , , , , , , , , , , , '[', '\\', ']', "'", , 'META'];
    function setLocalStorage(name, value) {
        if (typeof localStorage != 'undefined') {
            localStorage[name] = value;;
        } else {
            var date = new Date();
            date.setTime(date.getTime() + 5 * 365 * 24 * 60 * 60 * 1000);;
            document.cookie = name + '=' + value + '; expires=' + date.toGMTString() + '; path=/';;
        };

    };
    function getLocalStorage(name) {
        if (typeof localStorage != 'undefined') {
            return localStorage.hasOwnProperty(name) ? localStorage[name] : '';;
        } else {
            var pairs = document.cookie.split(';');
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i], equals = pair.indexOf('=');
                if (equals != -1 && pair.substring(0, equals).replace(/ /g, '') == name) {
                    return pair.substring(equals + 1);;
                };
            };
            return '';;
        };

    };
    function lerp(a, b, percent) {
        return a + (b - a) * percent;;

    };
    function randInRange(a, b) {
        var _0;
        return (_0 = Math.random(), a + (b - a) * _0);;

    };
    function Sprite() {
        this.flip = 0;;
        this.angle = 0;;
        this.offsetBeforeRotation = new Vector(0, 0);;
        this.offsetAfterRotation = new Vector(0, 0);;
        this.parent = null;;
        this.firstChild = null;;
        this.nextSibling = null;;
        this.drawGeometry = null;;

    };
    Sprite.prototype.clone = function () {
        var sprite = new Sprite();
        sprite.flip = this.flip;;
        sprite.angle = this.angle;;
        sprite.offsetBeforeRotation = this.offsetBeforeRotation;;
        sprite.offsetAfterRotation = this.offsetAfterRotation;;
        sprite.drawGeometry = this.drawGeometry;;
        return sprite;;

    };;
    Sprite.prototype.setParent = function (newParent) {
        if (this.parent !== null) {
            if (this.parent.firstChild == this) {
                this.parent.firstChild = this.nextSibling;;
            } else {
                for (var sprite = this.parent.firstChild; sprite !== null; sprite = sprite.nextSibling) {
                    if (sprite.nextSibling == this) {
                        sprite.nextSibling = this.nextSibling;;
                    };
                };
            };
        };
        this.nextSibling = null;;
        this.parent = newParent;;
        if (this.parent !== null) {
            this.nextSibling = this.parent.firstChild;;
            this.parent.firstChild = this;;
        };

    };;
    Sprite.prototype.draw = function (c) {
        c.save();;
        c.translate(this.offsetBeforeRotation.x, this.offsetBeforeRotation.y);;
        if (this.flip) {
            c.scale(-1, 1);;
        };
        c.rotate(this.angle);;
        c.translate(this.offsetAfterRotation.x, this.offsetAfterRotation.y);;
        this.drawGeometry(c);;
        for (var sprite = this.firstChild; sprite !== null; sprite = sprite.nextSibling) {
            sprite.draw(c);;
        };
        c.restore();;

    };;
    function adjustAngleToTarget(currAngle, targetAngle, maxRotation) {
        if (targetAngle - currAngle > Math.PI) currAngle += 2 * Math.PI; else if (currAngle - targetAngle > Math.PI) currAngle -= 2 * Math.PI;;
        var deltaAngle = targetAngle - currAngle;
        if (Math.abs(deltaAngle) > maxRotation) deltaAngle = (deltaAngle > 0 ? maxRotation : -maxRotation);;
        currAngle += deltaAngle;;
        currAngle -= Math.floor(currAngle / (2 * Math.PI)) * (2 * Math.PI);;
        return currAngle;;

    };
    function toTitleCase(s) {
        return s.toLowerCase().replace(/^(.)|\s(.)/g, function ($1) {
            return $1.toUpperCase();;

        });;

    };
    var Keys = {
        keyMap: {
            'killKey': 75,
            'a-jumpKey': 38,
            'a-crouchKey': 40,
            'a-leftKey': 37,
            'a-rightKey': 39,
            'b-jumpKey': 87,
            'b-crouchKey': 83,
            'b-leftKey': 65,
            'b-rightKey': 68
        },
        fromKeyCode: function (keyCode) {
            for (var name in this.keyMap) {
                if (keyCode == this.keyMap[name]) {
                    return name;;
                };
            };
            return null;;

        },
        keyCodeHTML: function (keyCode) {
            var name = keyCodeArray[keyCode] || '&iquest;';
            var html = toTitleCase(name).replace(' ', '<br>');
            if (html.charAt(0) != '&' && html.length > 1) {
                html = '<div style="' + (html.indexOf('<br>') != -1 ? 'padding-top:10px;line-height:15px;' : '') + 'font-size:' + (html.length <= 3 ? 25 : html.length <= 5 ? 18 : 15).toFixed() + 'px;">' + html + '</div>';;
            };
            return html;;

        },
        load: function () {
            for (var name in this.keyMap) {
                var keyCode = parseInt(getLocalStorage(name), 10);
                if (!isNaN(keyCode)) {
                    this.keyMap[name] = keyCode;;
                };
            };
            this.updateHTML();;

        },
        save: function () {
            for (var name in this.keyMap) {
                setLocalStorage(name, this.keyMap[name]);;
            };
            this.updateHTML();;

        },
        updateHTML: function () {
            for (var name in this.keyMap) {
                $('#' + name).html(this.keyCodeHTML(this.keyMap[name]));;
            };

        }
    };
    function Vector(x, y) {
        this.x = x;;
        this.y = y;;

    };
    Vector.prototype.neg = function () {
        return new Vector(-this.x, -this.y);;

    };;
    Vector.prototype.add = function (v) {
        return new Vector(this.x + v.x, this.y + v.y);;

    };;
    Vector.prototype.sub = function (v) {
        return new Vector(this.x - v.x, this.y - v.y);;

    };;
    Vector.prototype.mul = function (f) {
        return new Vector(this.x * f, this.y * f);;

    };;
    Vector.prototype.div = function (f) {
        return new Vector(this.x / f, this.y / f);;

    };;
    Vector.prototype.eq = function (v) {
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) < 0.001;;

    };;
    Vector.prototype.inplaceNeg = function () {
        this.x = -this.x;;
        this.y = -this.y;;

    };;
    Vector.prototype.inplaceAdd = function (v) {
        this.x += v.x;;
        this.y += v.y;;

    };;
    Vector.prototype.inplaceSub = function (v) {
        this.x -= v.x;;
        this.y -= v.y;;

    };;
    Vector.prototype.inplaceMul = function (f) {
        this.x *= f;;
        this.y *= f;;

    };;
    Vector.prototype.inplaceDiv = function (f) {
        this.x /= f;;
        this.y /= f;;

    };;
    Vector.prototype.inplaceFlip = function () {
        var t = this.x;
        this.x = this.y;;
        this.y = -t;;

    };;
    Vector.prototype.clone = function () {
        return new Vector(this.x, this.y);;

    };;
    Vector.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;;

    };;
    Vector.prototype.lengthSquared = function () {
        return (this.x * this.x + this.y * this.y);;

    };;
    Vector.prototype.length = function () {
        return Math.sqrt((this.x * this.x + this.y * this.y));;

    };;
    Vector.prototype.unit = function () {
        var _0, _1;
        return (_0 = (Math.sqrt(this.x * this.x + this.y * this.y)), _1 = new Vector(0, 0), _1.x = this.x / _0, _1.y = this.y / _0, _1);;

    };;
    Vector.prototype.normalize = function () {
        var len = (Math.sqrt(this.x * this.x + this.y * this.y));
        this.x /= len;;
        this.y /= len;;

    };;
    Vector.prototype.flip = function () {
        return new Vector(this.y, -this.x);;

    };;
    Vector.prototype.atan2 = function () {
        return Math.atan2(this.y, this.x);;

    };;
    Vector.prototype.angleBetween = function (v) {
        return this.atan2() - v.atan2();;

    };;
    Vector.prototype.rotate = function (theta) {
        var s = Math.sin(theta), c = Math.cos(theta);
        return new Vector(this.x * c - this.y * s, this.x * s + this.y * c);;

    };;
    Vector.prototype.minComponents = function (v) {
        return new Vector(Math.min(this.x, v.x), Math.min(this.y, v.y));;

    };;
    Vector.prototype.maxComponents = function (v) {
        return new Vector(Math.max(this.x, v.x), Math.max(this.y, v.y));;

    };;
    Vector.prototype.projectOntoAUnitVector = function (v) {
        var _0, _1;
        return (_0 = (this.x * v.x + this.y * v.y), _1 = new Vector(0, 0), _1.x = v.x * _0, _1.y = v.y * _0, _1);;

    };;
    Vector.prototype.toString = function () {
        return '(' + this.x.toFixed(3) + ', ' + this.y.toFixed(3) + ')';;

    };;
    Vector.prototype.adjustTowardsTarget = function (target, maxDistance) {
        var _0, _1, _2, _3, _4, _5, _6;
        var v = ((_0 = ((_1 = new Vector(0, 0), _1.x = target.x - this.x, _1.y = target.y - this.y, _1)), _0.x * _0.x + _0.y * _0.y) < maxDistance * maxDistance) ? target : (_0 = (_2 = (_3 = ((_6 = new Vector(0, 0), _6.x = target.x - this.x, _6.y = target.y - this.y, _6)), _4 = new Vector(0, 0), _5 = Math.sqrt(_3.x * _3.x + _3.y * _3.y), _4.x = _3.x / _5, _4.y = _3.y / _5, _4), _2.x *= maxDistance, _2.y *= maxDistance, _2), _1 = new Vector(0, 0), _1.x = this.x + _0.x, _1.y = this.y + _0.y, _1);
        this.x = v.x;;
        this.y = v.y;;

    };;
    Vector.fromAngle = function (theta) {
        return new Vector(Math.cos(theta), Math.sin(theta));;

    };;
    Vector.lerp = function (a, b, percent) {
        var _0, _1, _2, _3;
        return (_0 = (_2 = (_3 = new Vector(0, 0), _3.x = b.x - a.x, _3.y = b.y - a.y, _3), _2.x *= percent, _2.y *= percent, _2), _1 = new Vector(0, 0), _1.x = a.x + _0.x, _1.y = a.y + _0.y, _1);;

    };;
    function Keyframe(x, y) {
        this.center = new Vector(x, y);;
        this.angles = [];;

    };
    Keyframe.prototype.add = function () {
        for (var i = 0; i < arguments.length; i++) {
            this.angles.push(arguments[i] * Math.PI / 180);;
        };
        return this;;

    };;
    Keyframe.prototype.lerpWith = function (keyframe, percent) {
        var _0, _1;
        var result = new Keyframe((_0 = this.center.x, _1 = keyframe.center.x, _0 + (_1 - _0) * percent), (_0 = this.center.y, _1 = keyframe.center.y, _0 + (_1 - _0) * percent));
        for (var i = 0; i < this.angles.length; i++) {
            result.angles.push((_0 = this.angles[i], _1 = keyframe.angles[i], _0 + (_1 - _0) * percent));;
        };
        return result;;

    };;
    Keyframe.lerp = function (keyframes, percent) {
        var lower = Math.floor(percent);
        percent -= lower;;
        lower = lower % keyframes.length;;
        var upper = (lower + 1) % keyframes.length;
        return keyframes[lower].lerpWith(keyframes[upper], percent);;

    };;

    var LEG_LENGTH = 0.3;
    var POPPER_BODY = 0;
    var POPPER_LEG1_UPPER = 1;
    var POPPER_LEG2_UPPER = 2;
    var POPPER_LEG3_UPPER = 3;
    var POPPER_LEG4_UPPER = 4;
    var POPPER_LEG1_LOWER = 5;
    var POPPER_LEG2_LOWER = 6;
    var POPPER_LEG3_LOWER = 7;
    var POPPER_LEG4_LOWER = 8;
    var POPPER_NUM_SPRITES = 9;
    var popperStandingKeyframe = new Keyframe(0, 0.1).add(0, -80, -80, 80, 80, 100, 100, -100, -100);
    var popperJumpingKeyframes = [new Keyframe(0, 0.2).add(0, -40, -30, 30, 40, 40, 40, -40, -40), new Keyframe(0, 0.1).add(0, -80, -80, 80, 80, 100, 100, -100, -100)];
    var POPPER_RADIUS = 0.4;
    var POPPER_JUMP_DELAY = 0.5;
    var POPPER_MIN_JUMP_Y = 2.5;
    var POPPER_MAX_JUMP_Y = 6.5;
    var POPPER_ELASTICITY = 0.5;
    var POPPER_ACCEL = -6;
    function createPopperSprites() {
        var sprites = [];
        for (var i = 0; i < POPPER_NUM_SPRITES; i++) {
            sprites.push(new Sprite());;
        };
        sprites[POPPER_BODY].drawGeometry = function (c) {
            c.strokeStyle = 'black';;
            c.fillStyle = 'black';;
            c.beginPath();;
            c.moveTo(0.2, -0.2);;
            c.lineTo(-0.2, -0.2);;
            c.lineTo(-0.3, 0);;
            c.lineTo(-0.2, 0.2);;
            c.lineTo(0.2, 0.2);;
            c.lineTo(0.3, 0);;
            c.lineTo(0.2, -0.2);;
            c.moveTo(0.15, -0.15);;
            c.lineTo(-0.15, -0.15);;
            c.lineTo(-0.23, 0);;
            c.lineTo(-0.15, 0.15);;
            c.lineTo(0.15, 0.15);;
            c.lineTo(0.23, 0);;
            c.lineTo(0.15, -0.15);;
            c.stroke();;
            c.beginPath();;
            c.arc(-0.075, 0, 0.04, 0, 2 * Math.PI, false);;
            c.arc(0.075, 0, 0.04, 0, 2 * Math.PI, false);;
            c.fill();;

        };;
        var legDrawGeometry = function (c) {
            c.strokeStyle = 'black';;
            c.beginPath();;
            c.moveTo(0, 0);;
            c.lineTo(0, -LEG_LENGTH);;
            c.stroke();;

        };
        for (var i = 0; i < 4; i++) {
            sprites[POPPER_LEG1_UPPER + i].drawGeometry = legDrawGeometry;;
            sprites[POPPER_LEG1_LOWER + i].drawGeometry = legDrawGeometry;;
            sprites[POPPER_LEG1_UPPER + i].setParent(sprites[POPPER_BODY]);;
            sprites[POPPER_LEG1_LOWER + i].setParent(sprites[POPPER_LEG1_UPPER + i]);;
            sprites[POPPER_LEG1_LOWER + i].offsetBeforeRotation = new Vector(0, -LEG_LENGTH);;
        };
        sprites[POPPER_LEG1_UPPER].offsetBeforeRotation = new Vector(-0.2, -0.2);;
        sprites[POPPER_LEG2_UPPER].offsetBeforeRotation = new Vector(-0.1, -0.2);;
        sprites[POPPER_LEG3_UPPER].offsetBeforeRotation = new Vector(0.1, -0.2);;
        sprites[POPPER_LEG4_UPPER].offsetBeforeRotation = new Vector(0.2, -0.2);;
        return sprites;;

    };
    Popper.subclasses(WalkingEnemy);;
    function Popper(center) {
        WalkingEnemy.prototype.constructor.call(this, ENEMY_POPPER, center, POPPER_RADIUS, POPPER_ELASTICITY);;
        this.onFloor = false;;
        this.timeToNextJump = POPPER_JUMP_DELAY;;
        this.sprites = createPopperSprites();;

    };
    Popper.prototype.move = function (seconds) {
        if (this.timeToNextJump <= 0) {
            this.velocity.y = (POPPER_MIN_JUMP_Y + (POPPER_MAX_JUMP_Y - POPPER_MIN_JUMP_Y) * Math.random());;
            this.velocity.x = (Math.random() > 0.5) ? POPPER_MAX_JUMP_Y - this.velocity.y : -POPPER_MAX_JUMP_Y + this.velocity.y;;
            this.timeToNextJump = POPPER_JUMP_DELAY;;
            this.onFloor = false;;
        } else if (this.onFloor) {
            this.timeToNextJump = this.timeToNextJump - seconds;;
        };
        return this.accelerate(new Vector(0, POPPER_ACCEL), seconds);;

    };;
    Popper.prototype.reactToWorld = function (contact) {
        if (contact.normal.y >= 0.999) {
            this.velocity.x = 0;;
            this.velocity.y = 0;;
            this.onFloor = true;;
        };

    };;
    Popper.prototype.afterTick = function (seconds) {
        var _0, _1, _2, _3;
        var position = this.getCenter();
        this.sprites[POPPER_BODY].offsetBeforeRotation = position;;
        var ref_shapePoint = {
        }, ref_worldPoint = {
        };
        var distance = CollisionDetector.closestToEntityWorld(this, 2 * POPPER_RADIUS, ref_shapePoint, ref_worldPoint, gameState.world);
        var isOnFloor = (distance < 3 * POPPER_RADIUS && ref_shapePoint.ref.eq((_0 = new Vector(0, -POPPER_RADIUS), _1 = new Vector(0, 0), _1.x = position.x + _0.x, _1.y = position.y + _0.y, _1)) && (_0 = (_1 = ref_worldPoint.ref, _2 = ref_shapePoint.ref, _3 = new Vector(0, 0), _3.x = _1.x - _2.x, _3.y = _1.y - _2.y, _3), Math.sqrt(_0.x * _0.x + _0.y * _0.y)) < 0.1);
        var frame;
        if (!isOnFloor) {
            var percent = this.velocity.y * -0.25;
            percent = (percent < 0) ? 1 / (1 - percent) - 1 : 1 - 1 / (1 + percent);;
            frame = popperJumpingKeyframes[0].lerpWith(popperJumpingKeyframes[1], percent);;
        } else frame = popperStandingKeyframe;;
        this.sprites[POPPER_BODY].offsetAfterRotation = frame.center;;
        for (var i = 0; i < POPPER_NUM_SPRITES; i++) {
            this.sprites[i].angle = frame.angles[i];;
        };

    };;
    Popper.prototype.draw = function (c) {
        this.sprites[POPPER_BODY].draw(c);;

    };;
    Popper.prototype.avoidsSpawn = function () {
        return true;;

    };;
    var SPIDER_LEG_HEIGHT = 0.5;
    var SPIDER_BODY = 0;
    var SPIDER_LEG1_TOP = 1;
    var SPIDER_LEG2_TOP = 2;
    var SPIDER_LEG3_TOP = 3;
    var SPIDER_LEG4_TOP = 4;
    var SPIDER_LEG5_TOP = 5;
    var SPIDER_LEG6_TOP = 6;
    var SPIDER_LEG7_TOP = 7;
    var SPIDER_LEG8_TOP = 8;
    var SPIDER_LEG1_BOTTOM = 9;
    var SPIDER_LEG2_BOTTOM = 10;
    var SPIDER_LEG3_BOTTOM = 11;
    var SPIDER_LEG4_BOTTOM = 12;
    var SPIDER_LEG5_BOTTOM = 13;
    var SPIDER_LEG6_BOTTOM = 14;
    var SPIDER_LEG7_BOTTOM = 15;
    var SPIDER_LEG8_BOTTOM = 16;
    var SPIDER_NUM_SPRITES = 17;
    var spiderWalkingKeyframes = [new Keyframe().add(0, -10, -20, -10, 10, -10, 10, -10, -20, 20, 10, 70, 20, 70, 20, 20, 10), new Keyframe().add(0, 10, -10, -20, -10, -20, -10, 10, -10, 20, 20, 10, 70, 10, 70, 20, 20), new Keyframe().add(0, -10, 10, -10, -20, -10, -20, -10, 10, 70, 20, 20, 10, 20, 10, 70, 20), new Keyframe().add(0, -20, -10, 10, -10, 10, -10, -20, -10, 10, 70, 20, 20, 20, 20, 10, 70)];
    var spiderFallingKeyframes = [new Keyframe().add(0, 7, 3, -1, -5, 5, 1, -3, -7, -14, -6, 2, 10, -10, -2, 6, 14), new Keyframe().add(0, 30, 10, -30, -20, 30, 40, -10, -35, -50, -90, 40, 20, -50, -40, 70, 30)];
    var SPIDER_WIDTH = 0.9;
    var SPIDER_HEIGHT = 0.3;
    var SPIDER_SHOOT_FREQ = 2.0;
    var SPIDER_SPEED = 1.0;
    var SPIDER_ELASTICITY = 1.0;
    var SPIDER_FLOOR_DIST = 1.0;
    var SPIDER_SIGHT_HEIGHT = 10;
    function drawSpiderBody(c) {
        var innerRadius = 0.5;
        c.beginPath();;
        for (var i = 0; i <= 21; i++) {
            var angle = (0.25 + 0.5 * i / 21) * Math.PI;
            var radius = 0.6 + 0.05 * (i & 2);
            c.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius - 0.5);;
        };
        for (var i = 21; i >= 0; i--) {
            var angle = (0.25 + 0.5 * i / 21) * Math.PI;
            c.lineTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius - 0.5);;
        };
        c.fill();;

    };
    function drawSpiderLeg(c) {
        c.beginPath();;
        c.moveTo(0, 0);;
        c.lineTo(0, -SPIDER_LEG_HEIGHT);;
        c.stroke();;

    };
    function createSpiderSprites() {
        var sprites = [];
        for (var i = 0; i < SPIDER_NUM_SPRITES; i++) {
            sprites.push(new Sprite());;
            sprites[i].drawGeometry = (i == 0) ? drawSpiderBody : drawSpiderLeg;;
        };
        for (var i = SPIDER_LEG1_TOP; i <= SPIDER_LEG8_TOP; i++) {
            sprites[i].setParent(sprites[SPIDER_BODY]);;
        };
        for (var i = SPIDER_LEG1_BOTTOM; i <= SPIDER_LEG8_BOTTOM; i++) {
            sprites[i].setParent(sprites[i - SPIDER_LEG1_BOTTOM + SPIDER_LEG1_TOP]);;
        };
        sprites[SPIDER_LEG1_TOP].offsetBeforeRotation = new Vector(SPIDER_WIDTH * 0.35, 0);;
        sprites[SPIDER_LEG2_TOP].offsetBeforeRotation = new Vector(SPIDER_WIDTH * 0.15, 0);;
        sprites[SPIDER_LEG3_TOP].offsetBeforeRotation = new Vector(SPIDER_WIDTH * -0.05, 0);;
        sprites[SPIDER_LEG4_TOP].offsetBeforeRotation = new Vector(SPIDER_WIDTH * -0.25, 0);;
        sprites[SPIDER_LEG5_TOP].offsetBeforeRotation = new Vector(SPIDER_WIDTH * 0.25, 0);;
        sprites[SPIDER_LEG6_TOP].offsetBeforeRotation = new Vector(SPIDER_WIDTH * 0.05, 0);;
        sprites[SPIDER_LEG7_TOP].offsetBeforeRotation = new Vector(SPIDER_WIDTH * -0.15, 0);;
        sprites[SPIDER_LEG8_TOP].offsetBeforeRotation = new Vector(SPIDER_WIDTH * -0.35, 0);;
        for (var i = SPIDER_LEG1_BOTTOM; i <= SPIDER_LEG8_BOTTOM; i++) sprites[i].offsetBeforeRotation = new Vector(0, -SPIDER_LEG_HEIGHT);;
        return sprites;;

    };
    RocketSpider.subclasses(SpawningEnemy);;
    function RocketSpider(center, angle) {
        var _0, _1;
        SpawningEnemy.prototype.constructor.call(this, ENEMY_ROCKET_SPIDER, (_0 = new Vector(0, 0.81 - SPIDER_LEGS_RADIUS + SPIDER_HEIGHT * 0.5), _1 = new Vector(0, 0), _1.x = center.x + _0.x, _1.y = center.y + _0.y, _1), SPIDER_WIDTH, SPIDER_HEIGHT, SPIDER_ELASTICITY, SPIDER_SHOOT_FREQ, 0);;
        this.leftChasesA = true;;
        this.leftSpawnPoint = new Vector(0, 0);;
        this.rightSpawnPoint = new Vector(0, 0);;
        this.timeSinceStart = 0;;
        this.legs = new RocketSpiderLegs(center, angle, this);;
        gameState.addEnemy(this.legs, this.legs.getShape().getCenter());;
        this.sprites = createSpiderSprites();;
        this.animationDelay = 0;;
        this.animationIsOnFloor = 0;;

    };
    RocketSpider.prototype.canCollide = function () {
        return false;;

    };;
    RocketSpider.prototype.playerInSight = function (target) {
        var _0, _1, _2;
        if (target.isDead()) return false;;
        var relativePos = (_0 = target.getCenter(), _1 = this.getCenter(), _2 = new Vector(0, 0), _2.x = _0.x - _1.x, _2.y = _0.y - _1.y, _2);
        var relativeAngle = relativePos.atan2();
        if (relativePos.y < SPIDER_SIGHT_HEIGHT && (relativeAngle > Math.PI * 0.25) && (relativeAngle < Math.PI * 0.75)) {
            return (!CollisionDetector.lineOfSightWorld(this.getCenter(), target.getCenter(), gameState.world));;
        };
        return false;;

    };;
    RocketSpider.prototype.spawnRocket = function (loc, target, angle) {
        gameState.addEnemy(new Rocket(loc, target, angle), this.getCenter());;

    };;
    RocketSpider.prototype.spawn = function () {
        var center = this.getCenter();
        this.leftSpawnPoint = new Vector(center.x - SPIDER_WIDTH * 0.4, center.y + SPIDER_HEIGHT * 0.4);;
        this.rightSpawnPoint = new Vector(center.x + SPIDER_WIDTH * 0.4, center.y + SPIDER_HEIGHT * 0.4);;
        if (this.playerInSight(gameState.playerA)) {
            if (this.playerInSight(gameState.playerB)) {
                this.spawnRocket(this.leftChasesA ? this.leftSpawnPoint : this.rightSpawnPoint, gameState.playerA, this.leftChasesA ? Math.PI * 0.75 : Math.PI * 0.25);;
                this.spawnRocket(this.leftChasesA ? this.rightSpawnPoint : this.leftSpawnPoint, gameState.playerB, this.leftChasesA ? Math.PI * 0.25 : Math.PI * 0.75);;
                this.leftChasesA = !this.leftChasesA;;
                return true;;
            } else {
                this.spawnRocket(this.leftSpawnPoint, gameState.playerA, Math.PI * 0.75);;
                this.spawnRocket(this.rightSpawnPoint, gameState.playerA, Math.PI * 0.25);;
                return true;;
            };
        } else if (this.playerInSight(gameState.playerB)) {
            this.spawnRocket(this.leftSpawnPoint, gameState.playerB, Math.PI * 0.75);;
            this.spawnRocket(this.rightSpawnPoint, gameState.playerB, Math.PI * 0.25);;
            return true;;
        };
        return false;;

    };;
    RocketSpider.prototype.move = function (seconds) {
        var _0, _1, _2, _3, _4;
        return (_0 = (_2 = this.legs.getCenter(), _3 = this.getCenter(), _4 = new Vector(0, 0), _4.x = _2.x - _3.x, _4.y = _2.y - _3.y, _4), _1 = new Vector(0, 0.81 - SPIDER_LEGS_RADIUS + SPIDER_HEIGHT * 0.5), _0.x += _1.x, _0.y += _1.y, _0);;

    };;
    RocketSpider.prototype.afterTick = function (seconds) {
        var position = this.getCenter();
        this.sprites[SPIDER_BODY].offsetBeforeRotation = position;;
        this.sprites[SPIDER_BODY].flip = (this.legs.velocity.x > 0);;
        var isOnFloor = this.legs.isOnFloor();
        if (isOnFloor != this.animationIsOnFloor) {
            if (++this.animationDelay > 1) {
                this.animationIsOnFloor = isOnFloor;;
                this.animationDelay = 0;;
            };
        } else {
            this.animationDelay = 0;;
        };
        this.timeSinceStart += seconds * 0.5;;
        var frame;
        if (!this.animationIsOnFloor) {
            var percent = this.legs.velocity.y * -0.25;
            percent = (percent < 0.01) ? 0 : 1 - 1 / (1 + percent);;
            frame = spiderFallingKeyframes[0].lerpWith(spiderFallingKeyframes[1], percent);;
        } else frame = Keyframe.lerp(spiderWalkingKeyframes, 10 * this.timeSinceStart);;
        for (var i = 0; i < SPIDER_NUM_SPRITES; i++) {
            this.sprites[i].angle = frame.angles[i];;
        };

    };;
    RocketSpider.prototype.reactToPlayer = function (player) {
        player.setDead(true);;

    };;
    RocketSpider.prototype.onDeath = function () {
        var _0, _1;
        Particle().position(this.getCenter()).bounces(1).gravity(5).decay(0.1).custom(drawSpiderBody).color(0, 0, 0, 1).angle(0).angularVelocity((_0 = -Math.PI, _1 = Math.PI, _0 + (_1 - _0) * Math.random()));;

    };;
    RocketSpider.prototype.draw = function (c) {
        c.strokeStyle = 'black';;
        c.fillStyle = 'black';;
        this.sprites[SPIDER_BODY].draw(c);;

    };;
    var CELL_EMPTY = 0;
    var CELL_SOLID = 1;
    var CELL_FLOOR_DIAG_LEFT = 2;
    var CELL_FLOOR_DIAG_RIGHT = 3;
    var CELL_CEIL_DIAG_LEFT = 4;
    var CELL_CEIL_DIAG_RIGHT = 5;
    function Cell(x, y, type) {
        this.x = x;;
        this.y = y;;
        this.type = type;;
        this.edges = [];;

    };
    Cell.prototype.bottomLeft = function () {
        return new Vector(this.x, this.y);;

    };;
    Cell.prototype.bottomRight = function () {
        return new Vector(this.x + 1, this.y);;

    };;
    Cell.prototype.topLeft = function () {
        return new Vector(this.x, this.y + 1);;

    };;
    Cell.prototype.topRight = function () {
        return new Vector(this.x + 1, this.y + 1);;

    };;
    Cell.prototype.ceilingOccupied = function () {
        return this.type === CELL_SOLID || this.type === CELL_CEIL_DIAG_LEFT || this.type === CELL_CEIL_DIAG_RIGHT;;

    };;
    Cell.prototype.floorOccupied = function () {
        return this.type === CELL_SOLID || this.type === CELL_FLOOR_DIAG_LEFT || this.type === CELL_FLOOR_DIAG_RIGHT;;

    };;
    Cell.prototype.leftWallOccupied = function () {
        return this.type === CELL_SOLID || this.type === CELL_FLOOR_DIAG_LEFT || this.type === CELL_CEIL_DIAG_LEFT;;

    };;
    Cell.prototype.rightWallOccupied = function () {
        return this.type === CELL_SOLID || this.type === CELL_FLOOR_DIAG_RIGHT || this.type === CELL_CEIL_DIAG_RIGHT;;

    };;
    Cell.prototype.posDiagOccupied = function () {
        return this.type === CELL_SOLID || this.type === CELL_FLOOR_DIAG_RIGHT || this.type === CELL_CEIL_DIAG_LEFT;;

    };;
    Cell.prototype.negDiagOccupied = function () {
        return this.type === CELL_SOLID || this.type === CELL_FLOOR_DIAG_LEFT || this.type === CELL_CEIL_DIAG_RIGHT;;

    };;
    Cell.prototype.addEdge = function (newEdge) {
        this.edges.push(newEdge);;

    };;
    Cell.prototype.removeEdge = function (edge) {
        var edgeIndex = this.getEdge(edge);
        this.edges.splice(edgeIndex, 1);;

    };;
    Cell.prototype.getBlockingEdges = function (color) {
        var blockingEdges = [];
        for (var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].blocksColor(color)) {
                blockingEdges.push(this.edges[i]);;
            };
        };
        return blockingEdges;;

    };;
    Cell.prototype.getEdge = function (edge) {
        var _0, _1, _2, _3;
        for (var i = 0; i < this.edges.length; ++i) {
            var thisEdge = this.edges[i];
            if ((_0 = ((_1 = thisEdge.getStart(), _2 = edge.getStart(), _3 = new Vector(0, 0), _3.x = _1.x - _2.x, _3.y = _1.y - _2.y, _3)), _0.x * _0.x + _0.y * _0.y) < 0.001 && (_0 = ((_1 = thisEdge.getEnd(), _2 = edge.getEnd(), _3 = new Vector(0, 0), _3.x = _1.x - _2.x, _3.y = _1.y - _2.y, _3)), _0.x * _0.x + _0.y * _0.y) < 0.001) {
                return i;;
            };
        };
        return -1;;

    };;
    Cell.prototype.getShape = function () {
        var vxy = new Vector(this.x, this.y);
        var v00 = new Vector(0, 0);
        var v01 = new Vector(0, 1);
        var v10 = new Vector(1, 0);
        var v11 = new Vector(1, 1);
        switch (this.type) {
            case CELL_SOLID: {
                return new Polygon(vxy, v00, v10, v11, v01);;
            }
            case CELL_FLOOR_DIAG_LEFT: {
                return new Polygon(vxy, v00, v10, v01);;
            }
            case CELL_FLOOR_DIAG_RIGHT: {
                return new Polygon(vxy, v00, v10, v11);;
            }
            case CELL_CEIL_DIAG_LEFT: {
                return new Polygon(vxy, v00, v11, v01);;
            }
            case CELL_CEIL_DIAG_RIGHT: {
                return new Polygon(vxy, v01, v10, v11);;
            }
        };
        return null;;

    };;
    Cell.prototype.draw = function (c) {
        var x = this.x, y = this.y;
        c.beginPath();;
        if (this.type == CELL_SOLID) {
            c.moveTo(x, y);;
            c.lineTo(x, y + 1);;
            c.lineTo(x + 1, y + 1);;
            c.lineTo(x + 1, y);;
        } else if (this.type == CELL_FLOOR_DIAG_LEFT) {
            c.moveTo(x, y);;
            c.lineTo(x + 1, y);;
            c.lineTo(x, y + 1);;
        } else if (this.type == CELL_FLOOR_DIAG_RIGHT) {
            c.moveTo(x, y);;
            c.lineTo(x + 1, y + 1);;
            c.lineTo(x + 1, y);;
        } else if (this.type == CELL_CEIL_DIAG_LEFT) {
            c.moveTo(x, y);;
            c.lineTo(x, y + 1);;
            c.lineTo(x + 1, y + 1);;
        } else if (this.type == CELL_CEIL_DIAG_RIGHT) {
            c.moveTo(x + 1, y);;
            c.lineTo(x, y + 1);;
            c.lineTo(x + 1, y + 1);;
        };
        c.closePath();;
        c.fill();;
        c.stroke();;

    };;
    Cell.prototype.drawEdges = function (c) {
        for (var i = 0; i < this.edges.length; i++) {
            this.edges[i].draw(c);;
        };

    };;
    var ONE_WAY = 0;
    var TWO_WAY = 1;
    function Door(edge0, edge1, cell0, cell1) {
        this.cells = [cell0, cell1];;
        this.edges = [edge0, edge1];;

    };
    Door.prototype.doorExists = function (i) {
        if (this.edges[i] === null) {
            return false;;
        };
        var cell = this.cells[i];
        return cell !== null && cell.getEdge(this.edges[i]) !== -1;;

    };;
    Door.prototype.doorPut = function (i, kill) {
        if (this.edges[i] !== null && !this.doorExists(i)) {
            var cell = this.cells[i];
            if (cell === null) {
                return;;
            };
            cell.addEdge(new Edge(this.edges[i].getStart(), this.edges[i].getEnd(), this.edges[i].color));;
            if (kill) {
                gameState.killAll(this.edges[i]);;
            };
            gameState.recordModification();;
        };

    };;
    Door.prototype.doorRemove = function (i) {
        if (this.edges[i] !== null && this.doorExists(i)) {
            var cell = this.cells[i];
            if (cell === null) {
                return;;
            };
            cell.removeEdge(this.edges[i]);;
            gameState.recordModification();;
        };

    };;
    Door.prototype.act = function (behavior, force, kill) {
        for (var i = 0; i < 2; ++i) {
            switch (behavior) {
                case DOORBELL_OPEN: {
                    this.doorRemove(i);;
                    break;
                }
                case DOORBELL_CLOSE: {
                    this.doorPut(i, kill);;
                    break;
                }
                case DOORBELL_TOGGLE: {
                    if (this.doorExists(i)) {
                        this.doorRemove(i);;
                    } else this.doorPut(i, kill);;
                    break;
                }
            };
        };

    };;
    var EDGE_FLOOR = 0;
    var EDGE_LEFT = 1;
    var EDGE_RIGHT = 2;
    var EDGE_CEILING = 3;
    var EDGE_NEUTRAL = 0;
    var EDGE_RED = 1;
    var EDGE_BLUE = 2;
    var EDGE_PLAYERS = 3;
    var EDGE_ENEMIES = 4;
    function Edge(start, end, color) {
        this.segment = new Segment(start, end);;
        this.color = color;;

    };
    Edge.prototype.blocksColor = function (entityColor) {
        switch (this.color) {
            case EDGE_NEUTRAL: {
                return true;;
            }
            case EDGE_RED: {
                return entityColor != EDGE_RED;;
            }
            case EDGE_BLUE: {
                return entityColor != EDGE_BLUE;;
            }
            case EDGE_PLAYERS: {
                return entityColor != EDGE_RED && entityColor != EDGE_BLUE;;
            }
            case EDGE_ENEMIES: {
                return entityColor != EDGE_ENEMIES;;
            }
        };
        return false;;

    };;
    Edge.prototype.getStart = function () {
        return this.segment.start;;

    };;
    Edge.prototype.getEnd = function () {
        return this.segment.end;;

    };;
    Edge.prototype.getOrientation = function () {
        return Edge.getOrientation(this.segment.normal);;

    };;
    Edge.getOrientation = function (normal) {
        if (normal.x > 0.9) return EDGE_LEFT;;
        if (normal.x < -0.9) return EDGE_RIGHT;;
        if (normal.y < 0) return EDGE_CEILING;;
        return EDGE_FLOOR;;

    };;
    Edge.prototype.draw = function (c) {
        var _0, _1, _2, _3, _4;
        switch (this.color) {
            case EDGE_NEUTRAL: {
                c.strokeStyle = 'black';;
                break;
            }
            case EDGE_RED: {
                c.strokeStyle = '#C00000';;
                break;
            }
            case EDGE_BLUE: {
                c.strokeStyle = '#0000D2';;
                break;
            }
        };
        this.segment.draw(c);;
        var xOffset = this.segment.normal.x * 0.1;
        var yOffset = this.segment.normal.y * 0.1;
        c.beginPath();;
        for (var i = 1, num = 10; i < num - 1; ++i) {
            var fraction = i / (num - 1);
            var start = (_0 = (_2 = this.segment.start, _3 = new Vector(0, 0), _3.x = _2.x * fraction, _3.y = _2.y * fraction, _3), _1 = (_2 = this.segment.end, _3 = 1 - fraction, _4 = new Vector(0, 0), _4.x = _2.x * _3, _4.y = _2.y * _3, _4), _0.x += _1.x, _0.y += _1.y, _0);
            c.moveTo(start.x, start.y);;
            c.lineTo(start.x - xOffset, start.y - yOffset);;
        };
        c.stroke();;

    };;


    function jsonToTarget(json) {
        return (json['color'] === 1 ? gameState.playerA : gameState.playerB);;

    };
    function jsonToVec(json) {
        return new Vector(json[0], json[1]);;

    };
    function jsonToEnemy(json) {
        var pos = jsonToVec(json['pos']);
        switch (json['type']) {
            case 'bomber': {
                return new Bomber(pos, json['angle']);;
            }
            case 'bouncy rocket launcher': {
                return new BouncyRocketLauncher(pos, jsonToTarget(json));;
            }
            case 'corrosion cloud': {
                return new CorrosionCloud(pos, jsonToTarget(json));;
            }
            case 'doom magnet': {
                return new DoomMagnet(pos);;
            }
            case 'grenadier': {
                return new Grenadier(pos, jsonToTarget(json));;
            }
            case 'jet stream': {
                return new JetStream(pos, json['angle']);;
            }
            case 'headache': {
                return new Headache(pos, jsonToTarget(json));;
            }
            case 'hunter': {
                return new Hunter(pos);;
            }
            case 'multi gun': {
                return new MultiGun(pos);;
            }
            case 'popper': {
                return new Popper(pos);;
            }
            case 'rocket spider': {
                return new RocketSpider(pos, json['angle']);;
            }
            case 'shock hawk': {
                return new ShockHawk(pos, jsonToTarget(json));;
            }
            case 'spike ball': {
                return new SpikeBall(pos);;
            }
            case 'stalacbat': {
                return new Stalacbat(pos, jsonToTarget(json));;
            }
            case 'wall avoider': {
                return new WallAvoider(pos, jsonToTarget(json));;
            }
            case 'wall crawler': {
                return new WallCrawler(pos, json['angle']);;
            }
            case 'wheeligator': {
                return new Wheeligator(pos, json['angle']);;
            }
            default: {
                console.log('Invalid enemy type in level');;
                return new SpikeBall(pos);;
            }
        };

    };
    GameState.prototype.loadLevelFromJSON = function (json) {
        this.stats = [0, 0, 0, 0];;
        this.world = new World(json['width'], json['height'], jsonToVec(json['start']), jsonToVec(json['end']));;
        for (var x = 0; x < json['width']; x++) {
            for (var y = 0; y < json['height']; y++) {
                var type = json['cells'][y][x];
                this.world.setCell(x, y, type);;
                if (type !== CELL_SOLID) {
                    this.world.safety = new Vector(x + 0.5, y + 0.5);;
                };
            };
        };
        this.world.createAllEdges();;
        this.playerA.reset(this.world.spawnPoint, EDGE_RED);;
        this.playerB.reset(this.world.spawnPoint, EDGE_BLUE);;
        for (var i = 0; i < json['entities'].length; ++i) {
            var e = json['entities'][i];
            switch (e['class']) {
                case 'cog': {
                    this.enemies.push(new GoldenCog(jsonToVec(e['pos'])));;
                    break;
                }
                case 'wall': {
                    gameState.addDoor(jsonToVec(e['end']), jsonToVec(e['start']), e['oneway'] ? ONE_WAY : TWO_WAY, e['color'], e['open']);;
                    break;
                }
                case 'button': {
                    var button = new Doorbell(jsonToVec(e['pos']), e['type'], true);
                    button.doors = e['walls'];;
                    this.enemies.push(button);;
                    break;
                }
                case 'sign': {
                    this.enemies.push(new HelpSign(jsonToVec(e['pos']), e['text']));;
                    break;
                }
                case 'enemy': {
                    this.enemies.push(jsonToEnemy(e));;
                    break;
                }
            };
        };

    };;
})();

