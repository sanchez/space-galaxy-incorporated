import { Box3, Scene, Mesh, SphereGeometry, MeshBasicMaterial, Sphere, Object3D, Geometry, BufferGeometry, Vector3, Matrix4, Raycaster } from "three";
import { number } from "prop-types";
import Box from "../../api/Box";

export interface ICollidable {
    collidesWith: (c: ICollidable) => void;
    boundingbox: Box3;
    colId?: number;
}

let rCollides = new Array<ICollidable>();

export function registerCollidable(c: ICollidable) {
    const ids = rCollides.map(x => x.colId);
    let id = 0;
    do {
        id = Math.floor(Math.random() * 1000);
    } while (ids.indexOf(id) !== -1);
    c.colId = id;
    rCollides.push(c);
}

export function unregisterCollidable(c: ICollidable) {
    rCollides = rCollides.filter(x => x.colId !== c.colId);
}

export function runCollisions(scene?: Scene) {

    if (scene) {
        scene.children = scene.children.filter(x => !x.name.startsWith("collision"));

        for (const i of rCollides) {
            const sMin = new Mesh(new SphereGeometry(0.05), new MeshBasicMaterial({ color: 0xff0000 }));
            const min = i.boundingbox.min;
            sMin.position.set(min.x, min.y, min.z);
            sMin.name = "collision-min";
            scene.add(sMin);

            const sMax = new Mesh(new SphereGeometry(0.05), new MeshBasicMaterial({ color: 0x00ff00 }));
            const max = i.boundingbox.max;
            sMax.position.set(max.x, max.y, max.z);
            sMax.name = "collision-max";
            scene.add(sMax);
        }
    }

    for (const i of rCollides) {
        for (const j of rCollides) {
            if (i.colId === j.colId) {
                continue;
            }

            if (i.boundingbox.intersectsBox(j.boundingbox)) {
                i.collidesWith(j);
            }
        }
    }
}