import Position from "./Position";

export default class Box {
    constructor(protected readonly pos: Position, protected readonly width: number, protected readonly height: number, protected readonly depth: number) {}

    public containsPoint(p: Position) {
        const bigBoy = new Position(this.width / 2, this.height / 2, this.depth / 2)
        bigBoy.add(this.pos);
        const smallBoy = new Position(this.width / 2, this.height / 2, this.depth)
        smallBoy.subtract(this.pos);

        const x = p.x >= smallBoy.x && p.x <= bigBoy.x;
        const y = p.y >= smallBoy.y && p.y <= bigBoy.y;
        const z = p.z >= smallBoy.z && p.z <= bigBoy.z;

        return x && y && z;
    }

    public intersectsBox(b: Box) {
        const hw = b.width / 2;
        const hh = b.height / 2;
        const hd = b.depth / 2;
        const bottom1 = new Position(hw, hh, -hd).add(b.pos);
        const bottom2 = new Position(hw, -hh, -hd).add(b.pos);
        const bottom3 = new Position(-hw, hh, -hd).add(b.pos);
        const bottom4 = new Position(-hw, -hh, -hd).add(b.pos);
        const top1 = new Position(hw, hh, hd).add(b.pos);
        const top2 = new Position(hw, -hh, hd).add(b.pos);
        const top3 = new Position(-hw, hh, hd).add(b.pos);
        const top4 = new Position(-hw, -hh, hd).add(b.pos);

        return !![ bottom1, bottom2, bottom3, bottom4, top1, top2, top3, top4 ].find(x => this.containsPoint(x));
    }
}