import Position from "./Position";

export default class Box {
    protected min: Position;
    protected max: Position;
    protected pos: Position;

    constructor(pos: Position, protected readonly width: number, protected readonly height: number, protected readonly depth: number) {
        this.min = new Position(this.width / 2, this.height / 2, this.depth / 2);
        this.min.subtract(pos);

        this.max = new Position(this.width / 2, this.height / 2, this.depth / 2);
        this.max.add(pos);

        this.pos = pos;
    }

    public containsPoint(p: Position) {
        const x = p.x >= this.min.x && p.x <= this.max.x;
        const y = p.y >= this.min.y && p.y <= this.max.y;
        const z = p.z >= this.min.z && p.z <= this.max.z;

        return x && y && z;
    }

    public applyThetaRotation(theta: number) {
        let min = new Position(this.width / 2, this.height / 2, this.depth / 2);
        min.subtract(this.pos);
        let newMinTheta = min.theta + theta;
        this.min = Position.fromPolar(min.mag, newMinTheta, min.phi);

        let max = new Position(this.width / 2, this.height / 2, this.depth / 2);
        max.add(this.pos);
        let newMaxTheta = max.theta + theta;
        this.max = Position.fromPolar(max.mag, newMaxTheta, max.phi);
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