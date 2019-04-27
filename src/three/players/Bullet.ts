import { Renderable } from "../render";
import PlayerPosition, { Direction } from "../../api/PlayerPosition";
import { registerCollidable, ICollidable, unregisterCollidable } from "../physics/collision";
import Box from "../../api/Box";
import Assets, { IBulletLight } from "../../api/Assets";
import { Geometry, PointLight, Object3D, Scene, BoxGeometry, MeshPhongMaterial, Mesh, Box3, Vector3, Group, BufferGeometry, Matrix4 } from "three";
import Position from "../../api/Position";

const BulletMaxIterations = 50;

export default class Bullet extends Renderable implements ICollidable {
    protected pos: PlayerPosition;
    protected readonly speed = 0.3;
    protected iter = 0;
    protected shell: Mesh | Group;
    protected light: IBulletLight;
    protected bounding: Box3;

    constructor(scene: Scene, originPosition: PlayerPosition) {
        super(scene);
        this.pos = new PlayerPosition(originPosition.x, originPosition.y, originPosition.z);
        this.pos.theta = originPosition.theta;
        this.pos.phi = originPosition.phi;
        this.pos.moveTrueForward(0.8);

        const [x, y, z] = this.pos.toTHREEPosition();
        this.shell.position.set(x, y, z);
        this.shell.setRotationFromMatrix(this.pos.rotationMatrix);
        this.bounding = new Box3().setFromObject(this.shell);
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

        this.light = Assets.requestLight();
        registerCollidable(this);
    }

    collidesWith(c: ICollidable) {
        this.iter = BulletMaxIterations + 1;
    }

    get boundingbox() {
        return this.bounding;
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

    private lastRotation: number[] = [ NaN ];
    render() {
        this.iter++;
        this.pos.moveTrueForward(this.speed);
        const p = this.pos.copy();
        const [x, y, z] = p.toTHREEPosition();

        const beforePosition = this.shell.position.clone();
        this.shell.position.set(x, y, z);
        const diffPosition = this.shell.position.clone().sub(beforePosition);
        this.bounding.translate(diffPosition);

        if (this.light) this.light.light.position.set(x, y, z);

        const r = this.pos.rotationMatrix;
        const rArray = r.toArray();
        if (!!this.lastRotation.map((x, i) => x !== rArray[i]).find(x => x)) {
            this.shell.setRotationFromMatrix(r);
            this.bounding = new Box3().setFromObject(this.shell);
            this.lastRotation = rArray.map(x => x);
        }
    }
}