import { Box3 } from "three";

export interface ICollidable {
    collidesWith: (c: ICollidable) => void;
    boundingBox: Box3;
}

export function registerCollidable(c: ICollidable) {
}

export function unregisterCollidable(c: ICollidable) {
}