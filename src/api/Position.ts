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

    public toTHREEPosition() {
        return [this.x, this.z, this.y];
    }

    public add(p: Position) {
        this._x += p.x;
        this._y += p.y;
        this._z += p.z;
    }
}