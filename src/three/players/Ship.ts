import { Renderable } from "../render";
import { ICollidable, registerCollidable, unregisterCollidable } from "../physics/collision";
import PlayerPosition from "../../api/PlayerPosition";
import { Object3D, Scene, Box3 } from "three";
import Point from "../../api/Point";
import Assets from "../../api/Assets";
import Bullet from "./Bullet";

export default class Ship extends Renderable implements ICollidable {
    protected pos: PlayerPosition;
    protected readonly speed = 0.01;
    protected frame: Object3D;

    protected iter: number;
    protected onTick: number;

    constructor(scene: Scene, originPosition: Point) {
        super(scene);
        this.pos = new PlayerPosition(originPosition.x, originPosition.y, 0.5);
        this.pos.theta = -Math.PI / 2;
        this.pos.phi = 0;
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
        if (c instanceof Bullet) {
            console.log("Got Shot!");
        }
    }

    get boundingBox() {
        return new Box3().setFromObject(this.frame);
    }

    public shouldDie() {
        return false;
    }

    public willDie() {
        unregisterCollidable(this);
        this.removeElement("frame");
    }

    shouldUpdate() {
        return true;
    }

    protected shoot() {
        const p = this.pos.copy();
        p.moveTrueForward(0.1);
        const b = new Bullet(this.scene, p);
        this.children.push(b);
    }

    protected cleanUpBullets() {
        this.children = this.children.filter(x => {
            if (x instanceof Bullet) {
                if (x.shouldDie()) {
                    x.willDie();
                    return false;
                }
            }
            return true;
        });
    }

    render() {
        this.iter++;
        this.cleanUpBullets();
        if (this.iter % this.onTick === 0) {
            this.shoot();
        }

        if (this.frame) {
            const [x, y, z] = this.pos.toTHREEPosition();
            this.frame.position.set(x, y, z);
            this.frame.setRotationFromMatrix(this.pos.rotationMatrix);
        }
    }
}