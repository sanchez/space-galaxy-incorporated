import { Renderable } from "../render";
import { ICollidable, registerCollidable, unregisterCollidable } from "../physics/collision";
import PlayerPosition from "../../api/PlayerPosition";
import { Object3D, Scene, Box3, BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import Point from "../../api/Point";
import Assets from "../../api/Assets";
import Bullet from "./Bullet";
import Position from "../../api/Position";
import Box from "../../api/Box";

export default class Ship extends Renderable implements ICollidable {
    protected pos: PlayerPosition;
    protected readonly speed = 0.01;
    protected frame: Object3D;

    protected iter: number;
    protected onTick: number;

    protected health = 100;
    protected shoot: () => void;

    protected size: Position;
    protected center: Position;

    constructor(scene: Scene, originPosition: Point, bulletHandler: (p: PlayerPosition) => void) {
        super(scene);
        this.pos = new PlayerPosition(originPosition.x, originPosition.y, 0.5);
        this.pos.theta = -Math.PI / 2;
        this.pos.phi = 0;
        this.shoot = () => {
            bulletHandler(this.pos);
        }

        const b = new Box3().setFromObject(this.frame);
        const max = new Position(b.max.x, b.max.z, b.max.y);
        const min = new Position(b.min.x, b.min.z, b.min.y);
        this.size = max.copy().subtract(min);
        this.center = this.size.copy().multiply(0.5);
    }

    onInit() {
        const obj = Assets.ship1;
        if (obj) {
            this.frame = obj;
            this.addElement("frame", obj);
        }
        registerCollidable(this);

        const occurance = 20;
        this.iter = 0;
        this.onTick = Math.floor(Math.random() * occurance) + occurance;
    }

    collidesWith(c: ICollidable) {
        console.log("Collided");
        if (c instanceof Bullet) {
            this.health -= 15;
        }
    }

    get boundingBox() {
        const b = new Box(this.pos.copy().subtract(this.center), this.size.x, this.size.y, this.size.z);
        b.applyThetaRotation(this.pos.theta);
        return b;
    }

    public shouldDie() {
        return this.health <= 0;
    }

    public willDie() {
        unregisterCollidable(this);
        this.removeElement("frame");
    }

    shouldUpdate() {
        return this.health > 0;
    }

    render() {
        this.iter++;
        if (this.iter % this.onTick === 0) {
            this.shoot();
        }

        if (this.frame) {
            const p = this.pos.copy().subtract(this.center);
            const [x, y, z] = p.toTHREEPosition();
            this.frame.position.set(x, y, z);
            this.frame.setRotationFromMatrix(this.pos.rotationMatrix);
        }
    }
}