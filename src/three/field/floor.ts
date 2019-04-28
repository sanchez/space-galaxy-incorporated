import * as THREE from "three";
import { Renderable } from "../render";

export default class Floor extends Renderable {
    onInit() {
        const geo = new THREE.BoxGeometry(20, 0.1, 20);
        const color = 0xffffff;
        // const mat = new THREE.MeshBasicMaterial({ color });
        const mat = new THREE.MeshPhysicalMaterial({ color, reflectivity: 1 });
        const cube = new THREE.Mesh(geo, mat);
        cube.receiveShadow = true;

        this.addElement("floor", cube);
    }

    render() {}
}