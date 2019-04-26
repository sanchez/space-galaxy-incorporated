import * as THREE from "three";
// @ts-ignore
import OBJLoader from "three-obj-loader";
import { MeshBasicMaterial, Mesh, MeshLambertMaterial, Group, MeshPhysicalMaterial, Scene, PointLight } from "three";
OBJLoader(THREE);

const BulletMaxLights = 10;

export interface IBulletLight {
    light: PointLight;
    inUse: boolean;
    index: number;
}

export class AssetLoader {

    private _bullet: THREE.Object3D;
    public get bullet() {
        if (this._bullet) return this._bullet.clone();
        throw new Error("Assets not loaded");
    }

    private _bulletProgress: number;
    protected handleBulletLoad = (e: ProgressEvent) => {
        this._bulletProgress = e.loaded / e.total;
    }

    protected handleBulletError = (error: Error) => {
        console.error("Failed to load bullet: ", error);
    }

    private _bulletLightPool = new Array<IBulletLight>();

    public requestLight() {
        const l = this._bulletLightPool.find(x => x.inUse === false);
        if (l === undefined) return undefined;
        l.inUse = true;
        l.light.intensity = 4;
        return l;
    }

    public freeLight(l: IBulletLight) {
        this._bulletLightPool[l.index].inUse = false;
        this._bulletLightPool[l.index].light.intensity = 0;
    }

    public loadAssets(scene: Scene) {
        // @ts-ignore
        const bulletLoader = new THREE.OBJLoader();
        bulletLoader.load("/blender/objects/bullet.obj", (obj: THREE.Object3D) => {
            const mat = new MeshPhysicalMaterial({ color: 0xffff55 });
            // @ts-ignore
            const g = obj.children.map(x => new Mesh(x.geometry, mat)).reduce((p, c) => p.add(c), new Group());
            this._bullet = g;
        }, this.handleBulletLoad, this.handleBulletError);

        for (let i = 0; i < BulletMaxLights; i++) {
            const l = new PointLight(0xffff55, 0, 1, 1);
            l.name = `BulletLight-${i}`;
            scene.add(l);
            this._bulletLightPool.push({
                light: l,
                inUse: false,
                index: i,
            });
        }
    }

    public getProgress() {
        const p = [ this._bulletProgress ];
        return p.reduce((p, c) => p + c, 0) / p.length;
    }
}

const Assets = new AssetLoader();
export default Assets;