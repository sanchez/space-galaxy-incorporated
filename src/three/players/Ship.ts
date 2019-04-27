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

    collidesWith(c: ICollidable) {
        if (c instanceof Bullet) {
            this.health -= 15;
        }
    }

    get boundingbox() {
        return this.bounding;
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

    private lastRotation: number[] = [ NaN ];
    render() {
        this.iter++;
        if (this.iter % this.onTick === 0) {
            this.shoot();
        }

        if (this.frame) {
            const [x, y, z] = this.pos.toTHREEPosition();

            const beforePosition = this.frame.position.clone();
            this.frame.position.set(x, y, z);
            const diffPosition = this.frame.position.clone().sub(beforePosition);
            this.bounding.translate(diffPosition);

            const r = this.pos.rotationMatrix;
            const rArray = r.toArray();
            if (!!this.lastRotation.map((x, i) => x !== rArray[i]).find(x => x)) {
                this.bounding = new Box3().setFromObject(this.frame);
                this.lastRotation = rArray.map(x => x);
            }
            this.frame.setRotationFromMatrix(this.pos.rotationMatrix);
        }
    }
}