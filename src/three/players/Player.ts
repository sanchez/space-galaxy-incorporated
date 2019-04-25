import * as THREE from "three";
import { Renderable } from "../render";
import PlayerPosition from "../../api/PlayerPosition";

enum PlayerEvent {
    moveForward,
    moveBack,
    moveRight,
    moveLeft,
    jump,
};

export default class Player extends Renderable {
    protected pos = new PlayerPosition(5, 5, 5);
    protected movementSpeed = 0.01;
    protected mouseSpeed = -0.01;

    protected events = [] as PlayerEvent[];

    constructor(scene: THREE.Scene, protected camera: THREE.PerspectiveCamera) {
        super(scene);
    }

    private addEvent(e: PlayerEvent) {
        this.events.push(e);
    }

    protected handleKeyboardDown(ev: KeyboardEvent) {
        switch(ev.key) {
            case "w":
                this.addEvent(PlayerEvent.moveForward);
                break;
            case "s":
                this.addEvent(PlayerEvent.moveBack);
                break;
            case "a":
                this.addEvent(PlayerEvent.moveLeft);
                break;
            case "d":
                this.addEvent(PlayerEvent.moveRight);
                break;
            case " ":
                this.addEvent(PlayerEvent.jump);
                break;
        }
    }

    protected handleMouseMove = (ev: MouseEvent) => {
        ev.preventDefault();
        this.pos.theta += ev.movementX * this.mouseSpeed;
        this.pos.phi += ev.movementY * this.mouseSpeed;
    }


    onInit() {
        document.addEventListener("keydown", this.handleKeyboardDown.bind(this));
        // document.addEventListener("mousemove", this.handleMouseMove.bind(this));

        setTimeout(() => {
            const canvas = document.querySelector("canvas");
            canvas.addEventListener("click", () => {
                canvas.requestPointerLock();
            });

            const lockChangeAlert = () => {
                if (document.pointerLockElement === canvas) {
                    document.addEventListener("mousemove", this.handleMouseMove);
                } else {
                    document.removeEventListener("mousemove", this.handleMouseMove);
                }
                console.log("Lock change");
            }

            document.addEventListener("pointerlockchange", lockChangeAlert);
        }, 1000);

    }

    protected applyEvent(e: PlayerEvent) {
        switch(e) {
            case PlayerEvent.jump:
                return;
            case PlayerEvent.moveForward:
                return;
            case PlayerEvent.moveBack:
                return;
        }
    }

    render() {
        const [x, y, z] = this.pos.toTHREEPosition();
        this.camera.position.set(x, y, z);
        const leftRightMat = (new THREE.Matrix4()).makeRotationY(this.pos.theta);
        const upDownMat = (new THREE.Matrix4()).makeRotationX(this.pos.phi);
        const transMat = leftRightMat.multiply(upDownMat);
        this.camera.setRotationFromMatrix(transMat);
    }
}