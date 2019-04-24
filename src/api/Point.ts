export default class Point {
    constructor(public readonly x: number, public readonly y: number) {}

    public subtract(p: Point) {
        return new Point(this.x - p.x, this.y - p.y);
    }

    public add(p: Point) {
        return new Point(this.x + p.x, this.y + p.y);
    }

    public multiply(p: number | Point) {
        if (p instanceof Point) {
            return new Point(this.x * p.x, this.y * p.y);
        }
        return new Point(this.x * p, this.y * p);
    }

    public dot(p: Point) {
        return this.x * p.x + this.y * p.y;
    }

    public distance(p: Point) {
        return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2));
    }

    public get angle() {
        return Math.atan2(this.y, this.x);
    }

    public get magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    public static fromPolar(mag: number, angle: number) {
        return new Point(
            Math.sin(angle) * mag,
            Math.cos(angle) * mag
        );
    }
}