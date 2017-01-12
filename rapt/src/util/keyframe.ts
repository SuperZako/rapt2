///<reference path="../util/vector.ts" /> 

// class Keyframe
class Keyframe {
    center;
    angles = [];
    constructor(x, y) {
        this.center = new Vector(x, y);
        // this.angles = [];
    }

    add(angles: number[]) {
        //for (var i = 0; i < arguments.length; i++) {
        //    this.angles.push(arguments[i] * Math.PI / 180);
        //}
        for (var i = 0; i < angles.length; i++) {
            this.angles.push(angles[i] * Math.PI / 180);
        }
        return this;
    }

    lerpWith(keyframe, percent) {
        var result = new Keyframe(
            lerp(this.center.x, keyframe.center.x, percent),
            lerp(this.center.y, keyframe.center.y, percent)
        );
        for (var i = 0; i < this.angles.length; i++) {
            result.angles.push(lerp(this.angles[i], keyframe.angles[i], percent));
        }
        return result;
    }

    static lerp(keyframes, percent) {
        var lower = Math.floor(percent);
        percent -= lower;
        lower = lower % keyframes.length;
        var upper = (lower + 1) % keyframes.length;
        return keyframes[lower].lerpWith(keyframes[upper], percent);
    }
}