import { Renderable } from "./render";
import Field from "./field/field";
import Player from "./players/Player";
import { Vector3, Scene, PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh, PointLight } from "three";
import Assets from "../api/Assets";
import Ship from "./players/Ship";
import Point from "../api/Point";
import ShipController from "./players/ShipController";
import WallController from "./players/WallController";

export default class World extends Renderable {
    protected loading = true;
    protected player: Player;
    protected ships: ShipController;
    protected walls: WallController;

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

        const light = new PointLight(0xffffff, 0, 100, 2);
        light.position.set(25, 25, 25);
        light.castShadow = true;
        this.addElement("light", light);
        
        // this.addElement("origin", new Mesh(new BoxGeometry(0.5, 0.5, 0.5), new MeshBasicMaterial({ color: 0x00ff00 })));
    }

    gameRunning() {
        if (this.player && !this.player.isAlive) {
            return false;
        }
        return true;
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