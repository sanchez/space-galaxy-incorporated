import { Renderable } from "./render";
import Field from "./field/field";
import Player from "./players/Player";
import { Vector3, Scene, PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh, PointLight, Sphere, SphereGeometry, MeshLambertMaterial } from "three";
import Assets from "../api/Assets";
import ShipController from "./players/ShipController";
import WallController from "./players/WallController";
import { IUIElement, registerUIElement } from "./overlay";

export default class World extends Renderable implements IUIElement {
    protected loading = true;
    protected player: Player;
    protected ships: ShipController;
    protected walls: WallController;

    private gameoverDiv: HTMLDivElement;

    constructor(scene: Scene, protected camera: PerspectiveCamera) {
        super(scene);
        camera.position.set(0, 10, 0);
        camera.lookAt(new Vector3());
    }

    onInit() {
        Assets.loadAssets(this.scene);
        this.children = [];
        const field = new Field(this.scene);
        this.children.push(field);

        const light = new PointLight(0xffffaa, 0.2, 100, 2);
        light.position.set(25, 25, 25);
        light.castShadow = true;
        this.addElement("light", light);

        const sun = new Mesh(new SphereGeometry(1), new MeshLambertMaterial({ color: 0xffffaa, emissive: 0xffffaa, emissiveIntensity: 10 }));
        sun.position.set(light.position.x, light.position.y, light.position.z);
        this.addElement("sun", sun);

        this.gameoverDiv = document.createElement("div");
        this.gameoverDiv.style.position = "fixed";
        this.gameoverDiv.style.top = "90px";
        this.gameoverDiv.style.left = "auto";
        this.gameoverDiv.style.right = "auto";
        this.gameoverDiv.style.fontSize = "100px";
        this.gameoverDiv.style.color = "white";
        this.gameoverDiv.style.textShadow = "2px 2px black";
        registerUIElement(this);
        
        // this.addElement("origin", new Mesh(new BoxGeometry(0.5, 0.5, 0.5), new MeshBasicMaterial({ color: 0x00ff00 })));
    }

    gameRunning() {
        if (this.player && !this.player.isAlive) {
            this.gameoverDiv.innerText = "Game Over";
            return false;
        }
        this.gameoverDiv.innerText = "";
        return true;
    }

    initializeUI() {
        return this.gameoverDiv;
    }

    render() {
        if (this.loading) {
            console.log("Loading: ", Math.round(Assets.getProgress() * 100), "%");
            if (Assets.getProgress() === 1) {
                this.loading = false;
                this.player = new Player(this.scene, this.camera);
                this.children.push(this.player);

                this.ships = new ShipController(this.scene);
                this.children.push(this.ships);

                this.walls = new WallController(this.scene);
                this.children.push(this.walls);
            }
        }
    }

    renderChildren() {
        if (!this.gameRunning()) return;
        if (this.children) this.children.forEach(x => {
            x.doRender();
        });
    }
}