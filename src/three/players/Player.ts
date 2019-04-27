import * as THREE from "three";
import { Renderable } from "../render";
import PlayerPosition, { Direction } from "../../api/PlayerPosition";
import Position from "../../api/Position";
import { promiseSleep } from "../../api/util";
import Bullet from "./Bullet";

enum PlayerEvent {
    jump,
};

export default class Player extends Renderable {
    protected pos: PlayerPosition;
    protected readonly mouseSpeed = -0.007;
    protected readonly movementSpeed = 0.1;

    protected events = [] as PlayerEvent[];
    protected keys = new Map<Direction, boolean>();

    private spot: THREE.SpotLight;
    private spotPoint: THREE.Object3D;

    constructor(scene: THREE.Scene, protected camera: THREE.PerspectiveCamera) {
        super(scene);
        this.pos = new PlayerPosition(5, 0, 1);
        this.pos.theta = Math.PI / 2;
    }

    private addEvent(e: PlayerEvent) {
        this.events.push(e);
    }

    protected handleKeyboardDown(ev: KeyboardEvent) {
        switch(ev.key) {
            case "w":
                return this.keys.set(Direction.Forward, true);
            case "s":
                return this.keys.set(Direction.Back, true);
            case "a":
                return this.keys.set(Direction.Left, true);
            case "d":
                return this.keys.set(Direction.Right, true);
            case " ":
                this.addEvent(PlayerEvent.jump);
                break;
        }
    }

    protected handleKeyboardUp(ev: KeyboardEvent) {
        switch(ev.key) {
            case "w":
                return this.keys.set(Direction.Forward, false);
            case "s":
                return this.keys.set(Direction.Back, false);
            case "a":
                return this.keys.set(Direction.Left, false);
            case "d":
                return this.keys.set(Direction.Right, false);
        }
    }

    protected handleMouseMove = (ev: MouseEvent) => {
        ev.preventDefault();
        this.pos.theta += ev.movementX * this.mouseSpeed;
        this.pos.phi += ev.movementY * this.mouseSpeed;
    }

    protected handleMouseDown = (ev: MouseEvent) => {
        if (ev.button === 0) {
            const bullet = new Bullet(this.scene, this.pos);
            this.children.push(bullet);
        }
    }

    onInit() {
        document.addEventListener("keyup", this.handleKeyboardUp.bind(this));
        document.addEventListener("keydown", this.handleKeyboardDown.bind(this));

        setTimeout(() => {
            const canvas = document.querySelector("canvas");
            canvas.addEventListener("click", () => {
                canvas.requestPointerLock();
            });

            const lockChangeAlert = () => {
                if (document.pointerLockElement === canvas) {
                    document.addEventListener("mousemove", this.handleMouseMove);
                    document.addEventListener("mousedown", this.handleMouseDown);
                } else {
                    document.removeEventListener("mousemove", this.handleMouseMove);
                    document.removeEventListener("mousedown", this.handleMouseDown);
                }
            }

            document.addEventListener("pointerlockchange", lockChangeAlert);
        }, 100);

        this.spot = new THREE.SpotLight(0xffffff, 1, 10, 0.6, 1, 1);
        this.spotPoint = new THREE.Object3D();
        this.spot.target = this.spotPoint;
        this.spot.castShadow = true;
        this.spot.shadow.mapSize = new THREE.Vector2(1024, 1024);
        this.addElement("spot", this.spot);
        this.addElement("spotPoint", this.spotPoint);
    }

    private async jump() {
        for (let i = 0; i < 30; i++) {
            this.pos.add(new Position(0, 0, 0.04));
            await promiseSleep(30);
        }
        while (this.pos.z > 1) {
            this.pos.add(new Position(0, 0, -0.04));
            await promiseSleep(30);
        }
    }

    protected applyEvent(e: PlayerEvent) {
        switch(e) {
            case PlayerEvent.jump:
                if (this.pos.z <= 1) {
                    this.jump().then(() => console.log("Jumped"));
                }
                return;
        }
    }

    protected movePlayer() {
        for (const d of this.keys.keys()) {
            const b = this.keys.get(d);
            if (b) this.pos.move(d, this.movementSpeed);
        }
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
        this.movePlayer();
        while (this.events.length > 0) {
            this.applyEvent(this.events.shift());
        }
        const [x, y, z] = this.pos.toTHREEPosition();
        this.camera.position.set(x, y, z);
        this.spot.position.set(x, y, z);
        this.camera.setRotationFromMatrix(this.pos.rotationMatrix);
        const [sX, sY, sZ] = this.pos.lookingPosition.toTHREEPosition();
        this.spotPoint.position.set(sX, sY, sZ);
        this.cleanUpBullets();
    }
}