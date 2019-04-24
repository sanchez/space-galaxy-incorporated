import * as THREE from "three";
import { Renderable } from "./render";
import Field from "./field/field";

export default class World extends Renderable {
    onInit() {
        const field = new Field(this.scene);
        this.children = [ field ];

        const light = new THREE.PointLight(0xffffff, 5, 100, 2);
        light.position.set(25, 25, 25);
        light.castShadow = true;
        this.addElement("light", light);
    }

    render() {}
}