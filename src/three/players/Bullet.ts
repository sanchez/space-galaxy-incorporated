import { Renderable } from "../render";
import PlayerPosition, { Direction } from "../../api/PlayerPosition";
import { registerCollidable, ICollidable, unregisterCollidable } from "../physics/collision";
import Box from "../../api/Box";
import Assets, { IBulletLight } from "../../api/Assets";
import { Geometry, PointLight, Object3D, Scene, BoxGeometry, MeshPhongMaterial, Mesh, Box3 } from "three";
import Position from "../../api/Position";

const BulletMaxIterations = 50;

export default class Bullet extends Renderable implements ICollidable {
    protected pos: PlayerPosition;
    protected readonly speed = 0.3;
    protected iter = 0;
    protected shell: Object3D;
    protected light: IBulletLight;

    protected size: Position;
    protected midPoint: Position;

    constructor(scene: Scene, originPosition: PlayerPosition) {
        super(scene);
        this.pos = new PlayerPosition(originPosition.x, originPosition.y, originPosition.z);
        this.pos.theta = originPosition.theta;
        this.pos.phi = originPosition.phi;
        this.pos.moveTrueForward(0.8);

        const [x, y, z] = this.pos.toTHREEPosition();
        this.shell.position.set(x, y, z);
        this.shell.setRotationFromMatrix(this.pos.rotationMatrix);
        this.midPoint.subtract(this.pos);
    }

    onInit() {
        const obj = Assets.bullet;
        if (obj) {
            this.shell = obj;
            this.addElement("shell", obj);
        } else {
            const shellGeo = new BoxGeometry(0.1, 0.1, 0.3);
            const shellMat = new MeshPhongMaterial({ color: 0xffff55 });
            this.shell = new Mesh(shellGeo, shellMat);
            this.addElement("shell", this.shell);
        }

        const b = new Box3().setFromObject(this.shell);
        const max = new Position(b.max.x, b.max.y, b.max.z);
        const min = new Position(b.min.x, b.min.y, b.min.z);
        this.size = max.copy();
        this.size.subtract(min);
        this.midPoint = max.copy();

        this.light = Assets.requestLight();
        registerCollidable(this);
    }

    collidesWith(c: ICollidable) {
        this.iter = BulletMaxIterations + 1;
    }

    get boundingBox() {
        const p = this.pos.copy();
        p.add(this.midPoint);
        return new Box(p, this.size.x, this.size.y, this.size.z);
    }

    public shouldDie() {
        return this.iter > BulletMaxIterations;
    }

    public willDie() {
        unregisterCollidable(this);
        this.removeElement("shell");
        if (this.light) {
            Assets.freeLight(this.light);
        }
    }

    shouldUpdate() {
        if (this.iter > BulletMaxIterations) return false;
        return true;
    }

    render() {
        this.iter++;
        this.pos.moveTrueForward(this.speed);
        const [x, y, z] = this.pos.toTHREEPosition();
        this.shell.position.set(x, y, z);
        if (this.light) this.light.light.position.set(x, y, z);
        this.shell.setRotationFromMatrix(this.pos.rotationMatrix);
    }
}