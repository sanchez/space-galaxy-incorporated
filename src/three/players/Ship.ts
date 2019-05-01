import { Renderable } from "../render";
import { ICollidable, registerCollidable, unregisterCollidable } from "../physics/collision";
import PlayerPosition from "../../api/PlayerPosition";
import { Object3D, Scene, Box3, BoxGeometry, Mesh, MeshBasicMaterial, Vector3 } from "three";
import Point from "../../api/Point";
import Assets from "../../api/Assets";
import Bullet, { ShipBullet } from "./Bullet";
import Position from "../../api/Position";
import { WorldWall } from "../field/field";

export default class Ship extends Renderable implements ICollidable {
    protected pos: PlayerPosition;
    protected readonly speed = 0.01;
    protected frame: Object3D;

    protected iter: number;
    protected onTick: number;

    protected health = 30;
    protected shoot: () => void;

    private bounding: Box3;

    constructor(scene: Scene, originPosition: Point, bulletHandler: (p: PlayerPosition) => void) {
        super(scene);
        this.pos = new PlayerPosition(originPosition.x, originPosition.y, 0.5);
        this.pos.theta = -Math.PI / 2;
        this.pos.phi = 0;
        this.shoot = () => {
            bulletHandler(this.pos);
        }

        this.frame.setRotationFromMatrix(this.pos.rotationMatrix);
        this.bounding = new Box3().setFromObject(this.frame);
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

    lastColliding?: ICollidable;
    collidesWith(c: ICollidable) {
        if (c instanceof ShipBullet) {
            return;
        }
        if (c instanceof Bullet) {
            this.health -= 15;
            return;
        }

        if (c instanceof WorldWall) return;

        while (this.boundingbox.intersectsBox(c.boundingbox)) {
            this.lastColliding = c;
            this.pos.moveTrueForward(-0.01);
        }
    }

    get boundingbox() {
        const bMin = new Position(this.bounding.min.x, this.bounding.min.z, this.bounding.min.y);
        const bMax = new Position(this.bounding.max.x, this.bounding.max.z, this.bounding.max.y);

        bMin.subtract(this.pos);
        bMax.subtract(this.pos);

        bMin.rotateAroundZ(this.pos.theta);
        bMax.rotateAroundZ(this.pos.theta);

        bMin.add(this.pos);
        bMax.add(this.pos);

        const v1 = new Vector3(...bMin.toTHREEPosition());
        const v2 = new Vector3(...bMax.toTHREEPosition());
        return new Box3().setFromPoints([ v1, v2 ]);
        // return this.bounding.clone().applyMatrix4(this.pos.rotationMatrix);
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

    protected lastPlayerLocation: Point;

    public updatePlayerPosition(p: Point) {
        this.lastPlayerLocation = p;
    }

    render() {
        this.pos.moveTrueForward(0.02);
        while (this.lastColliding && this.lastColliding.boundingbox.intersectsBox(this.boundingbox)) {
            this.pos.moveTrueForward(-0.01);
        }

        this.iter++;
        if (this.iter % this.onTick === 0) {
            const myP = new Point(this.pos.x, this.pos.y);
            const diffP = myP.subtract(this.lastPlayerLocation);

            this.pos.theta = -diffP.angle + Math.PI / 2;
            this.shoot();
        }

        if (this.frame) {
            const [x, y, z] = this.pos.toTHREEPosition();

            const beforePosition = this.frame.position.clone();
            this.frame.position.set(x, y, z);
            const diffPosition = this.frame.position.clone().sub(beforePosition);
            this.bounding.translate(diffPosition);

            this.frame.setRotationFromMatrix(this.pos.rotationMatrix);
        }
    }
}