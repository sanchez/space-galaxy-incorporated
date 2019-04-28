import { Renderable } from "../render";
import { ICollidable, registerCollidable, unregisterCollidable } from "../physics/collision";
import { Box3, Scene, Group, Mesh, BoxGeometry, MeshPhysicalMaterial, Vector3 } from "three";
import Position from "../../api/Position";
import Bullet from "./Bullet";

export default class Wall extends Renderable implements ICollidable {
    protected pos: Position;
    protected bounding: Box3;
    protected wall: Mesh | Group;
    protected health = 300;

    constructor(scene: Scene, originPosition: Position) {
        super(scene);
        this.pos = originPosition.copy().add(new Position(0, 0, 0.5));
    }

    onInit() {
        this.wall = new Mesh(new BoxGeometry(1, 1, 1), new MeshPhysicalMaterial({
            color: 0x555555
        }));
        this.wall.castShadow = true;
        this.wall.receiveShadow = true;

        this.addElement("wall", this.wall);
        this.bounding = new Box3().setFromObject(this.wall);
        registerCollidable(this);
    }

    collidesWith(c: ICollidable) {
        if (c instanceof Bullet) {
            this.health -= 15;
        }
    }

    get boundingbox() {
        const [x, y, z] = this.pos.toTHREEPosition();
        return this.bounding.clone().translate(new Vector3(x, y, z));
    }

    public shouldDie() {
        return this.health <= 0;
    }

    public willDie() {
        unregisterCollidable(this);
        this.removeElement("wall");
    }

    shouldUpdate() {
        return this.health > 0;
    }

    render() {
        const [x, y, z] = this.pos.toTHREEPosition();
        this.wall.position.set(x, y, z);
    }
}