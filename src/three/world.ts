import { Renderable } from "./render";
import Field from "./field/field";
import Player from "./players/Player";
import { Vector3, Scene, PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh, PointLight, Sphere, SphereGeometry, MeshLambertMaterial, AmbientLight } from "three";
import Assets from "../api/Assets";
import ShipController from "./players/ShipController";
import WallController from "./players/WallController";
import { IUIElement, registerUIElement } from "./overlay";

export default class World extends Renderable implements IUIElement {
    protected loading = true;
    protected player: Player;
    protected ships: ShipController;
    protected walls: WallController;
    private _score: number;

    private gameoverDiv: HTMLDivElement;
    private instructions: HTMLDivElement;
    private scoreDiv: HTMLDivElement;

    constructor(scene: Scene, protected camera: PerspectiveCamera) {
        super(scene);
        camera.position.set(0, 10, 0);
        camera.lookAt(new Vector3());
        document.addEventListener("keypress", this.handleKeyPress);
    }

    protected get score() {
        return this._score;
    }

    protected set score(val: number) {
        this._score = val;
        this.scoreDiv.innerText = `Score: ${val}`;
    }

    protected handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "r") {
            this.player.onInit();
            this.ships.reset();
            this.walls.reset();
            this.score = 0;
        }
    }

    onInit() {
        Assets.loadAssets(this.scene);
        this.children = [];

        const light = new PointLight(0xffffaa, 0.2, 100, 2);
        light.position.set(25, 25, 25);
        light.castShadow = true;
        this.addElement("light", light);

        const sun = new Mesh(new SphereGeometry(1), new MeshLambertMaterial({ color: 0xffffaa, emissive: 0xffffaa, emissiveIntensity: 10 }));
        sun.position.set(light.position.x, light.position.y, light.position.z);
        this.addElement("sun", sun);

        const ambientLight = new AmbientLight(0x404040, 0.1);
        this.addElement("ambient", ambientLight);

        this.gameoverDiv = document.createElement("div");
        this.gameoverDiv.style.position = "fixed";
        this.gameoverDiv.style.top = "90px";
        this.gameoverDiv.style.left = "auto";
        this.gameoverDiv.style.right = "auto";
        this.gameoverDiv.style.fontSize = "100px";
        this.gameoverDiv.style.color = "white";
        this.gameoverDiv.style.textShadow = "2px 2px black";

        this.scoreDiv = document.createElement("div");
        this.scoreDiv.style.position = "fixed";
        this.scoreDiv.style.top = "15px";
        this.scoreDiv.style.left = "15px";
        this.scoreDiv.style.fontSize = "50px";
        this.scoreDiv.style.color = "white";

        this.instructions = document.createElement("div");
        this.instructions.style.position = "fixed";
        this.instructions.style.top = "15px";
        this.instructions.style.right = "15px";
        this.instructions.style.fontSize = "20px";
        this.instructions.style.color = "white";
        this.instructions.style.maxWidth = "33%";
        this.instructions.innerHTML = "<b>Instructions:</b><br />To move use wasd, to aim use the mouse and click to shoot. Don't get hit by the bullets and shoot the ships.<br />To restart the game press r.<br /><br /><i>NOTE: Due to web security you need to click the screen for the camera movement</i>";

        this.score = 0;

        registerUIElement(this);
        
        // this.addElement("origin", new Mesh(new BoxGeometry(0.5, 0.5, 0.5), new MeshBasicMaterial({ color: 0x00ff00 })));
    }

    gameRunning() {
        if (this.player && !this.player.isAlive) {
            return false;
        }
        return true;
    }

    handleShipDie = () => {
        this.score += 1;
    }

    initializeUI() {
        return [this.gameoverDiv, this.instructions, this.scoreDiv];
    }

    render() {
        if (this.loading) {
            this.gameoverDiv.innerText = `Loading: ${Math.round(Assets.getProgress() * 100)}%`;
            if (Assets.getProgress() === 1) {
                this.loading = false;
                this.player = new Player(this.scene, this.camera);
                this.children.push(this.player);

                this.ships = new ShipController(this.scene, this.handleShipDie);
                this.children.push(this.ships);

                this.walls = new WallController(this.scene);
                this.children.push(this.walls);

                const field = new Field(this.scene);
                this.children.push(field);
            }
        } else if (this.gameRunning()) {
            this.gameoverDiv.innerText = "";
            this.ships.updatePlayerPosition(this.player.position);
        } else {
            this.gameoverDiv.innerText = "Game Over";
        }
    }

    renderChildren() {
        if (!this.gameRunning()) return;
        if (this.children) this.children.forEach(x => {
            x.doRender();
        });
    }
}