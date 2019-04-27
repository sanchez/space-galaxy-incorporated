import Position from "./Position";
import { Scene, Mesh, SphereGeometry, MeshBasicMaterial } from "three";

export default class Box {
    public min: Position;
    public max: Position;
    protected pos: Position;

    constructor(pos: Position, protected readonly width: number, protected readonly height: number, protected readonly depth: number) {
        this.min = new Position(-this.width / 2, -this.height / 2, -this.depth / 2);
        this.min.add(pos);

        this.max = new Position(this.width / 2, this.height / 2, this.depth / 2);
        this.max.add(pos);

        this.pos = pos;
    }

    public containsPoint(p: Position) {
        const x = p.x >= this.min.x && p.x <= this.max.x;
        const y = p.y >= this.min.y && p.y <= this.max.y;
        const z = p.z >= this.min.z && p.z <= this.max.z;

        let result = "";
        if (x) result += "x";
        if (y) result += "y";
        if (z) result += "z";
        if (result !== "") console.log(result);

        return x && y && z;
    }

    public applyThetaRotation(theta: number) {
        let min = new Position(-this.width / 2, -this.height / 2, -this.depth / 2);
        min.rotateAroundZ(theta);
        min.add(this.pos);
        this.min = min;

        let max = new Position(this.width / 2, this.height / 2, this.depth / 2);
        max.rotateAroundZ(theta);
        max.add(this.pos);
        this.max = max;
    }

    public intersectsBox(b: Box, scene?: Scene) {
        const bottom1 = new Position(this.min.x, this.min.y, this.min.z);
        const bottom2 = new Position(this.min.x, this.max.y, this.min.z);
        const bottom3 = new Position(this.max.x, this.min.y, this.min.z);
        const bottom4 = new Position(this.max.x, this.max.y, this.min.z);
        const top1 = new Position(this.min.x, this.min.y, this.max.z);
        const top2 = new Position(this.min.x, this.max.y, this.max.z);
        const top3 = new Position(this.max.x, this.min.y, this.max.z);
        const top4 = new Position(this.max.x, this.max.y, this.max.z);

        if (scene) {
            [bottom1, bottom2, bottom3, bottom4].forEach(i => {
                const m = new Mesh(new SphereGeometry(0.05), new MeshBasicMaterial({ color: 0x00ff00 }));
                m.name = "collides-yep";
                const [x, y, z] = i.toTHREEPosition();
                m.position.set(x, y, z);
                scene.add(m);
            });

            [top1, top2, top3, top4].forEach(i => {
                const m = new Mesh(new SphereGeometry(0.05), new MeshBasicMaterial({ color: 0x55ff55 }));
                m.name = "collides-bottom";
                const [x, y, z] = i.toTHREEPosition();
                m.position.set(x, y, z);
                scene.add(m);
            });
        }

        return !![ bottom1, bottom2, bottom3, bottom4, top1, top2, top3, top4 ].find(x => this.containsPoint(x));
    }
}