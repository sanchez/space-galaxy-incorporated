import * as THREE from "three";
import Position from "./Position";
import Point from "./Point";

export const enum Direction {
    Forward, Back, Left, Right
};

export function directionToPoint(d: Direction) {
    switch(d) {
        case Direction.Forward:
            return new Point(-1, 0);
        case Direction.Back:
            return new Point(1, 0);
        case Direction.Left:
            return new Point(0, -1);
        case Direction.Right:
            return new Point(0, 1);
    }
}

export default class PlayerPosition extends Position {
    public theta: number = 0;
    private _phi: number = 0;

    public get phi() {
        return this._phi;
    }

    public set phi(val: number) {
        if (val <= (-Math.PI / 2)) this._phi = -Math.PI / 2;
        else if (val >= (Math.PI / 2)) this._phi = Math.PI / 2;
        else this._phi = val;
    }

    public get rotationMatrix() {
        const leftRightMat = (new THREE.Matrix4()).makeRotationY(this.theta);
        const upDownMat = (new THREE.Matrix4()).makeRotationX(this.phi);
        return leftRightMat.multiply(upDownMat);
    }

    public move(dir: Direction, length: number) {
        const p = directionToPoint(dir);
        const forwardPos = Point.fromPolar(p.x * length, this.theta)
        const sidewayPos = Point.fromPolar(p.y * length, this.theta + Math.PI / 2);
        const move = forwardPos.add(sidewayPos);

        this.add(move);
    }

    private readonly distance = 1;
    public get lookingPosition() {
        const x = this.distance * Math.sin(this.theta) * Math.sin(this.phi - Math.PI / 2);
        const y = this.distance * Math.cos(this.theta) * Math.sin(this.phi - Math.PI / 2);
        const z = this.distance * Math.cos(this.phi - Math.PI / 2);
        
        const p = new Position(x, y, z);
        p.add(this);
        return p;
    }
}