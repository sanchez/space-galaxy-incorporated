import { Renderable } from "./render";

export interface IUIElement {
    initializeUI: () => HTMLDivElement;
}

let rInterfaces = new Array<IUIElement>();

export function registerUIElement(u: IUIElement) {
    const d = u.initializeUI();
    document.body.appendChild(d);
    rInterfaces.push(u);
}