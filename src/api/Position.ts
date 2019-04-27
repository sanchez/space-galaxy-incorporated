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
}