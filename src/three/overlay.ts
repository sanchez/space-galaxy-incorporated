import { Renderable } from "./render";
import { Scene, Camera } from "three";

export interface IUIElement {
    initializeUI: () => HTMLDivElement | Array<HTMLDivElement>;
}

let rInterfaces = new Array<IUIElement>();

export function registerUIElement(u: IUIElement) {
    const d = u.initializeUI();
    if (d instanceof Array) {
        d.forEach(x => document.body.appendChild(x));
    } else {
        document.body.appendChild(d);
    }
    rInterfaces.push(u);
}