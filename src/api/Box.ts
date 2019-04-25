import Position from "./Position";

export default class Box {
    constructor(protected readonly pos: Position, protected readonly width: number, protected readonly height: number, protected readonly depth: number) {}

    containsPoint(p: Position) {
        const bigBoy = new Position(this.width / 2, this.height / 2, this.depth / 2)
        bigBoy.add(this.pos);
        const smallBoy = new Position(this.width / 2, this.height / 2, this.depth)
        smallBoy.subtract(this.pos);

        const x = p.x >= smallBoy.x && p.x <= bigBoy.x;
        const y = p.y >= smallBoy.y && p.y <= bigBoy.y;
        const z = p.z >= smallBoy.z && p.z <= bigBoy.z;

        return x && y && z;
    }
}