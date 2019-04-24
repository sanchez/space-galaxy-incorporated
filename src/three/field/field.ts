import { Renderable } from "../render";
import Floor from "./floor";

export default class Field extends Renderable {
    onInit() {
        const floor = new Floor(this.scene);
        this.children = [ floor ];
    }

    render() {
        console.log("rendering field");
    }
}