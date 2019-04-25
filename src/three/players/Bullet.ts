import * as THREE from "three";
import { Renderable } from "../render";
import PlayerPosition, { Direction } from "../../api/PlayerPosition";

export default class Bullet extends Renderable {
    protected pos: PlayerPosition;
    protected readonly speed = 0.3;
    protected iter = 0;
    protected shell: THREE.Object3D;
    protected light: THREE.Light;

    constructor(scene: THREE.Scene, originPosition: PlayerPosition) {
        super(scene);
        this.pos = new PlayerPosition(originPosition.x, originPosition.y, originPosition.z);
        this.pos.theta = originPosition.theta;
        this.pos.phi = originPosition.phi;
        this.pos.moveTrueForward(0.4);
    }

    onInit() {
        const shellGeo = new THREE.BoxGeometry(0.1, 0.1, 0.3);
        const shellMat = new THREE.MeshBasicMaterial({ color: 0xffff55 });
        this.shell = new THREE.Mesh(shellGeo, shellMat);
        this.addElement("shell", this.shell);

        // this.light = new THREE.PointLight(0xffff55, 4, 10, 1);
        // this.light = new THREE.RectAreaLight(0xffff55, 4, 0.1, 0.1);
        // this.addElement("light", this.light);
    }

    public shouldDie() {
        return this.iter > 50;
    }

    public willDie() {
        this.removeElement("shell");
    }

    render() {
        if (this.iter > 50) {
            return;
        }
        this.iter++;
        this.pos.moveTrueForward(this.speed);
        const [x, y, z] = this.pos.toTHREEPosition();
        this.shell.position.set(x, y, z);
        if (this.light) this.light.position.set(x, y, z);
        this.shell.setRotationFromMatrix(this.pos.rotationMatrix);
    }
}