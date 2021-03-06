import { Renderable } from "../render";
import { ICollidable, registerCollidable, unregisterCollidable } from "../physics/collision";
import { Box3, Scene, Group, Mesh, BoxGeometry, MeshPhysicalMaterial, Vector3, TextGeometry, MeshPhongMaterial, MeshBasicMaterial } from "three";
import Position from "../../api/Position";
import Bullet from "./Bullet";
import Assets from "../../api/Assets";

export default class Wall extends Renderable implements ICollidable {
    protected pos: Position;
    protected bounding: Box3;
    protected wall: Mesh | Group;
    protected health: number;

    constructor(scene: Scene, originPosition: Position) {
        super(scene);
        this.pos = originPosition.copy().add(new Position(0, 0, 0.5));
        this.health = 300;
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

    public get position() {
        return this.pos.copy();
    }

    protected drawHealth() {
        const geo = new TextGeometry(this.health.toFixed(), {
            font: Assets.font,
            height: 5
        });
        const fontScale = 0.002;
        geo.scale(fontScale, fontScale, fontScale);
        geo.rotateY(Math.PI / 2);
        geo.translate(0, 0, 0.3);
        const h = new Mesh(geo, new MeshBasicMaterial({
            color: 0x3333ff
        }));

        const [x, y, z] = this.pos.copy().add(new Position(0, 0, 0.7)).toTHREEPosition()
        h.position.set(x, y, z);

        this.removeElement("text");
        this.addElement("text", h);
    }

    collidesWith(c: ICollidable) {
        if (c instanceof Bullet) {
            this.health -= 15;
            this.drawHealth();
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
        this.removeElement("text");
    }

    shouldUpdate() {
        return this.health > 0;
    }

    render() {
        const [x, y, z] = this.pos.toTHREEPosition();
        this.wall.position.set(x, y, z);
    }
}