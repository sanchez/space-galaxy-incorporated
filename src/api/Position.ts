import Point from "./Point";

export default class Position {
    constructor(protected _x: number, protected _y: number, protected _z: number) {}

    public get x() {
        return this._x;
    }

    public get y() {
        return this._y;
    }

    public get z() {
        return this._z;
    }

    public get theta() {
        return Math.atan2(this.y, this.x);
    }

    public get phi() {
        return Math.acos(this.z / this.mag);
    }

    public get mag() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }

    public rotateAroundZ(theta: number) {
        this._x = this.x * Math.cos(theta) - this.y * Math.sin(theta);
        this._y = this.x * Math.sin(theta) + this.y * Math.cos(theta);
        this._z = this.z;
    }

    public static fromPolar(mag: number, theta: number, phi: number) {
        const x = mag * Math.sin(theta) * Math.sin(phi);
        const y = mag * Math.cos(theta) * Math.sin(phi);
        const z = mag * Math.cos(phi);
        return new Position(x, y, z);
    }

    public copy() {
        return new Position(this.x, this.y, this.z);
    }

    public toTHREEPosition() {
        return [this.x, this.z, this.y];
    }

    public add(p: Position | Point) {
        this._x += p.x;
        this._y += p.y;
        if (p instanceof Position) this._z += p.z;

        return this;
    }

    public subtract(p: Position | Point) {
        this._x -= p.x;
        this._y -= p.y;
        if (p instanceof Position) this._z -= p.z;

        return this;
    }

    public multiply(p: number) {
        this._x *= p;
        this._y *= p;
        this._z *= p;

        return this;
    }
}