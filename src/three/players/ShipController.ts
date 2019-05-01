import { Renderable } from "../render";
import Ship from "./Ship";
import Point from "../../api/Point";
import Bullet, { ShipBullet } from "./Bullet";
import PlayerPosition from "../../api/PlayerPosition";
import { WorldSize } from "../field/field";
import { Vector3, Scene } from "three";

let ShipCount = 15;

export default class ShipController extends Renderable {
    constructor(scene: Scene, private onDeadShip: () => void) {
        super(scene);
    }

    protected addShip(p: Point) {
        this.children.push(new Ship(this.scene, p, this.addBullet.bind(this)));
    }

    protected addBullet(pos: PlayerPosition) {
        const p = pos.copy();
        p.moveTrueForward(0.5);
        const b = new ShipBullet(this.scene, p);
        this.children.push(b);
    }

    protected pointCollides(p: Point) {
        for (const x of this.children) {
            if (x instanceof Ship) {
                if (x.boundingbox.containsPoint(new Vector3(p.x, 0.5, p.y))) {
                    return true;
                }
            }
        }
        return false;
    }

    protected generateShipCoords(): Point {
        let x = Math.floor(Math.random() * 5);
        x = (Math.random() > 0.5) ? x + (WorldSize / 2) : x - (WorldSize / 2);
        let y = Math.floor(Math.random() * 5);
        y = (Math.random() > 0.5) ? y + (WorldSize / 2) : y - (WorldSize / 2);
        const p = new Point(x, y);
        if (this.pointCollides(p)) return this.generateShipCoords();
        return p;
    }

    onInit() {
        for (let i = 0; i < 5; i++) {
            this.addShip(this.generateShipCoords());
        }
    }

    public reset() {
        this.children = this.children.filter(x => {
            if (x instanceof Ship || x instanceof Bullet) {
                x.willDie();
                return false;
            }
            return true;
        });
        this.onInit();
    }

    protected cleanUpChildren() {
        this.children = this.children.filter(x => {
            if (x instanceof Ship || x instanceof Bullet) {
                if (x.shouldDie()) {
                    if (x instanceof Ship) {
                        this.onDeadShip();
                    }
                    x.willDie();
                    return false;
                }
            }
            return true;
        });
    }

    public updatePlayerPosition(p: Point) {
        for (const s of this.children) {
            if (s instanceof Ship) {
                s.updatePlayerPosition(p);
            }
        }
    }

    private iter = 0;
    render() {
        this.iter++;
        this.cleanUpChildren();

        if (this.iter % 60 === 0) {
            const shipCount = this.children.reduce((p, c) => {
                if (c instanceof Ship) {
                    return p + 1;
                }
                return p;
            }, 0);

            if (shipCount <= ShipCount) {
                this.addShip(this.generateShipCoords());
            }
        }
    }
}