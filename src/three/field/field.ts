import { Renderable } from "../render";
import { ICollidable, registerCollidable } from "../physics/collision";
import { Scene, Box3, Vector3, Mesh, BoxGeometry, MeshPhysicalMaterial, MeshBasicMaterial, MeshLambertMaterial } from "three";
import Point from "../../api/Point";

export class WorldWall extends Renderable implements ICollidable {
    private bounding: Box3;

    constructor(scene: Scene, min: Point, max: Point) {
        super(scene);

        this.bounding = new Box3(new Vector3(min.x, 0, min.y), new Vector3(max.x, 1.2, max.y));

        const center = new Vector3();
        this.bounding.getCenter(center);
        const size = new Vector3();
        this.bounding.getSize(size);
        const box = new Mesh(new BoxGeometry(size.x, size.y, size.z), new MeshLambertMaterial({ color: 0xff0000 }));
        box.position.copy(center);
        this.addElement("test", box);

        registerCollidable(this);
    }

    onInit() {
    }

    get boundingbox() {
        return this.bounding;
    }

    collidesWith(c: ICollidable) {
    }

    render() {
    }
}

export const WorldSize = 20;

export default class Field extends Renderable {
    onInit() {
        const floor = new Mesh(new BoxGeometry(WorldSize, 0.1, WorldSize), new MeshPhysicalMaterial({
            color: 0xffffff,
            reflectivity: 0,
        }));
        floor.receiveShadow = true;

        this.addElement("floor", floor);

        const wallLength = WorldSize / 2;
        const w1 = new WorldWall(this.scene, new Point(-wallLength, -wallLength - 0.1), new Point(-wallLength, wallLength));
        const w2 = new WorldWall(this.scene, new Point(-wallLength - 0.1, -wallLength), new Point(wallLength, -wallLength));
        const w3 = new WorldWall(this.scene, new Point(wallLength, -wallLength), new Point(wallLength + 0.1, wallLength));
        const w4 = new WorldWall(this.scene, new Point(-wallLength, wallLength), new Point(wallLength, wallLength + 0.1));
        this.children.push(w1, w2, w3, w4);
    }

    render() {
    }
}