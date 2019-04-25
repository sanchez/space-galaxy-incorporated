import * as THREE from "three";
import { Renderable } from "../render";

export default class Floor extends Renderable {
    onInit() {
        const geo = new THREE.BoxGeometry(10, 0.1, 10);
        const color = 0xffffff;
        const mat = new THREE.MeshPhongMaterial({ color });
        const cube = new THREE.Mesh(geo, mat);
        cube.receiveShadow = true;

        this.addElement("floor", cube);
    }

    render() {}
}