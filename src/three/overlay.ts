import { Renderable } from "./render";
import { Scene, Camera } from "three";

export interface IUIElement {
    initializeUI: () => HTMLDivElement;
}

let rInterfaces = new Array<IUIElement>();

export function registerUIElement(u: IUIElement) {
    const d = u.initializeUI();
    document.body.appendChild(d);
    rInterfaces.push(u);
}