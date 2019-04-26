import { Renderable } from "../render";
import PlayerPosition, { Direction } from "../../api/PlayerPosition";
import { registerCollidable, ICollidable, unregisterCollidable } from "../physics/collision";
import Box from "../../api/Box";
import Assets, { IBulletLight } from "../../api/Assets";
import { Geometry, PointLight, Object3D, Scene, BoxGeometry, MeshPhongMaterial, Mesh } from "three";

const BulletMaxIterations = 50;

export default class Bullet extends Renderable implements ICollidable {
    protected pos: PlayerPosition;
    protected readonly speed = 0.3;
    protected iter = 0;
    protected shell: Object3D;
    protected light: IBulletLight;

    constructor(scene: Scene, originPosition: PlayerPosition) {
        super(scene);
        this.pos = new PlayerPosition(originPosition.x, originPosition.y, originPosition.z);
        this.pos.theta = originPosition.theta;
        this.pos.phi = originPosition.phi;
        this.pos.moveTrueForward(0.8);
    }

    onInit() {
        const obj = Assets.bullet;
        if (obj) {
            this.shell = obj;
            this.shell.scale.multiplyScalar(0.1);
            this.addElement("shell", obj);
        } else {
            const shellGeo = new BoxGeometry(0.1, 0.1, 0.3);
            const shellMat = new MeshPhongMaterial({ color: 0xffff55 });
            this.shell = new Mesh(shellGeo, shellMat);
            this.addElement("shell", this.shell);
        }
        this.light = Assets.requestLight();
        registerCollidable(this);
    }

    collidesWith(c: ICollidable) {
        this.iter = BulletMaxIterations;
    }

    get boundingBox() {
        return new Box(this.pos, 0.1, 0.3, 0.1);
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