import Box from "../../api/Box";

export interface ICollidable {
    collidesWith: (c: ICollidable) => void;
    boundingBox: Box;
}

export function registerCollidable(c: ICollidable) {
}

export function unregisterCollidable(c: ICollidable) {
}