import { Renderable } from "../render";
import Ship from "./Ship";
import Point from "../../api/Point";
import Bullet from "./Bullet";
import PlayerPosition from "../../api/PlayerPosition";

export default class ShipController extends Renderable {
    protected addShip(p: Point) {
        this.children.push(new Ship(this.scene, p, this.addBullet.bind(this)));
    }

    protected addBullet(pos: PlayerPosition) {
        const p = pos.copy();
        p.moveTrueForward(0.5);
        const b = new Bullet(this.scene, p);
        this.children.push(b);
    }

    onInit() {
        // this.addShip(new Point(-9, 0));
        for (let i = -5; i <= 4; i += 3) {
            this.addShip(new Point(-9, i));
        }
    }

    protected cleanUpChildren() {
        this.children = this.children.filter(x => {
            if (x instanceof Ship || x instanceof Bullet) {
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