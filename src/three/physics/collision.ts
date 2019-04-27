import { Box3 } from "three";
import { number } from "prop-types";
import Box from "../../api/Box";

export interface ICollidable {
    collidesWith: (c: ICollidable) => void;
    boundingBox: Box;
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

export function runCollisions() {
    const boxes = new Map<number, Box>();
    for (const i of rCollides) {
        boxes.set(i.colId, i.boundingBox);
    }

    for (const i of rCollides) {
        const starter = boxes.get(i.colId);
        for (const j of rCollides) {
            if (i.colId === j.colId) {
                continue;
            }

            if (boxes.get(j.colId).intersectsBox(starter)) {
                i.collidesWith(j);
            }
        }
    }
}