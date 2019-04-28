import { Renderable } from "../render";
import Wall from "./Wall";
import Position from "../../api/Position";
import Point from "../../api/Point";

export default class WallController extends Renderable {
    protected addWall(p: Point) {
        this.children.push(new Wall(this.scene, new Position(p.x, p.y, 0)));
    }

    onInit() {
        for (let i = -4; i <= 4; i += 1.3) {
            this.addWall(new Point(3, i));
        }
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