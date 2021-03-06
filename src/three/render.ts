import * as THREE from "three";

const stringSet = "qwertyuiopasdfghjklzxcvbnm";
const ids: {[key: string]: boolean} = {};

export abstract class Renderable {
    private name: string;
    protected children: Renderable[];

    constructor(protected scene: THREE.Scene) {
        let name = "";
        do {
            name = "";
            for (let i = 0; i < 10; i++) {
                name += stringSet.charAt(Math.floor(Math.random() * stringSet.length));
            }
        } while(ids[name] == true);
        ids[name] = true;
        this.name = name;

        this.children = [];

        this.onInit();
    }

    protected abstract onInit(): void;

    protected getElement(elementName: string) {
        return this.scene.getObjectByName(`${this.name}-${elementName}`);
    }

    protected addElement(elementName: string, el: THREE.Object3D) {
        el.name = `${this.name}-${elementName}`;
        this.scene.add(el);
    }

    protected removeElement(elementName: string) {
        this.scene.remove(this.scene.getObjectByName(`${this.name}-${elementName}`));
    }

    public shouldUpdate() {
        return true;
    }

    public doRender() {
        if (this.shouldUpdate()) {
            this.render();
        }
        this.renderChildren();
    }

    protected renderChildren() {
        if (this.children) this.children.forEach(x => {
            // const start = performance.now();
            x.doRender();
            // const end = performance.now();
            // const diff = (end - start);
            // if (diff >= 2) {
            //     console.warn(`[${this.constructor.name}] (${this.name}) ${diff}`);
            // }
        });
    }

    protected abstract render(): void;
}