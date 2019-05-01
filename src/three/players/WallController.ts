import { Renderable } from "../render";
import Wall from "./Wall";
import Position from "../../api/Position";
import Point from "../../api/Point";
import { WorldSize } from "../field/field";

const WallCount = 15;

export default class WallController extends Renderable {
    protected addWall(p: Point) {
        this.children.push(new Wall(this.scene, new Position(p.x, p.y, 0)));
    }

    protected generateWallCoords(): Point {
        const x = Math.floor(Math.random() * WorldSize) - (WorldSize / 2);
        const y = Math.floor(Math.random() * WorldSize) - (WorldSize / 2);
        if (this.children.filter(x => x instanceof Wall).find((w: Wall) => (x === w.position.x && y === w.position.y))) {
            return this.generateWallCoords();
        }
        return new Point(x, y);
    }

    onInit() {
        for (let i = 0; i < WallCount; i++) {
            this.addWall(this.generateWallCoords());
        }
    }

    public reset() {
        this.children = this.children.filter(x => {
            if (x instanceof Wall) {
                x.willDie();
                return false;
            }
            return true;
        });
        this.onInit();
    }

    protected cleanUpChildren() {
        this.children = this.children.filter(x => {
            if (x instanceof Wall) {
                if (x.shouldDie()) {
                    x.willDie();
                    return false;
                }
            }
            return true;
        });
    }

    render() {
        this.cleanUpChildren();
    }
}