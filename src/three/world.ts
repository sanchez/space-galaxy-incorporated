import * as THREE from "three";
import { Renderable } from "./render";
import Field from "./field/field";
import Player from "./players/Player";

export default class World extends Renderable {
    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        super(scene);
        const player = new Player(this.scene, camera);
        this.children.push(player);
    }

    onInit() {
        this.children = [];
        const field = new Field(this.scene);
        this.children.push(field);

        const light = new THREE.PointLight(0xffffff, 0, 100, 2);
        light.position.set(25, 25, 25);
        light.castShadow = true;
        this.addElement("light", light);
        
        this.addElement("origin", new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshBasicMaterial({ color: 0x00ff00 })));
    }

    render() {}
}