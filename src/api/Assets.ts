import * as THREE from "three";
// @ts-ignore
import OBJLoader from "three-obj-loader";
import { MeshBasicMaterial, Mesh, MeshLambertMaterial, Group, MeshPhysicalMaterial, Scene, PointLight, DoubleSide, Font, Texture, TextureLoader, Loader } from "three";
OBJLoader(THREE);

const BulletMaxLights = 1;

export interface IBulletLight {
    light: PointLight;
    inUse: boolean;
    index: number;
}

export class AssetLoader {
    private _bullet: THREE.Group;
    public get bullet() {
        if (this._bullet) return this._bullet.clone();
        throw new Error("Assets not loaded");
    }

    private _bulletProgress = 0;
    protected handleBulletLoad = (e: ProgressEvent) => {
        this._bulletProgress = e.loaded / e.total - 0.1;
    }

    protected handleBulletError = (error: Error) => {
        console.error("Failed to load bullet: ", error);
    }

    private _ship1: THREE.Group;
    public get ship1() {
        if (this._ship1) return this._ship1.clone();
        throw new Error("Assets not loaded");
    }

    private _shipProgress = 0;
    protected handleShip1Load = (e: ProgressEvent) => {
        this._shipProgress = e.loaded / e.total - 0.1;
    }

    protected handleShipError = (error: Error) => {
        console.error("Failed to load ship: ", error);
    }

    private _bulletLightPool = new Array<IBulletLight>();

    public requestLight() {
        const l = this._bulletLightPool.find(x => x.inUse === false);
        if (l === undefined) return undefined;
        l.inUse = true;
        l.light.intensity = 6;
        return l;
    }

    public freeLight(l: IBulletLight) {
        this._bulletLightPool[l.index].inUse = false;
        this._bulletLightPool[l.index].light.intensity = 0;
    }

    private _font: Font;
    public get font() {
        if (this._font) return this._font;
        throw new Error("Assets not loaded");
    }
    private _fontProgress = 0;
    protected handleFontProgress = (e: ProgressEvent) => {
        this._fontProgress = e.loaded / e.total;
    }

    private _floor: Texture;
    public get floor() {
        if (this._floor) return this._floor;
        throw new Error("Assets not loaded");
    }
    private _floorProgress = 0;

    public loadAssets(scene: Scene) {
        // @ts-ignore
        const bulletLoader = new THREE.OBJLoader();
        bulletLoader.load("/blender/objects/bullet.obj", (obj: THREE.Object3D) => {
            const mat = new MeshPhysicalMaterial({ color: 0xffff55, emissive: 0xffff55, emissiveIntensity: 1, side: DoubleSide });
            // @ts-ignore
            const g = obj.children.map(x => new Mesh(x.geometry, mat)).reduce((p, c) => p.add(c), new Group());
            g.scale.multiplyScalar(0.1);
            this._bullet = g;
            this._bulletProgress = 1;
        }, this.handleBulletLoad, this.handleBulletError);

        // @ts-ignore
        const shipLoader = new THREE.OBJLoader();
        shipLoader.load("/blender/objects/space1.obj", (obj: THREE.Object3D) => {
            const mat = new MeshPhysicalMaterial({ color: 0xd63511, side: DoubleSide });
            // @ts-ignore
            const g = obj.children.map(x => new Mesh(x.geometry, mat)).reduce((p, c) => p.add(c), new Group());
            g.receiveShadow = true;
            g.castShadow = true;
            g.scale.multiplyScalar(0.4);
            this._ship1 = g;
            this._shipProgress = 1;
        }, this.handleShip1Load, this.handleShipError);

        const fontLoader = new THREE.FontLoader();
        fontLoader.load("/fonts/Courier New_Bold.json", (font) => {
            this._font = font;
        }, this.handleFontProgress);

        const textureLoader = new TextureLoader();
        textureLoader.load("/imgs/floor.png", (texture) => {
            this._floor = texture;
            this._floorProgress = 1;
        }, (error) => console.error(error));

        const i = setInterval(() => {
            if (this._bulletLightPool.length >= BulletMaxLights) {
                clearInterval(i);
            } else {
                const l = new PointLight(0xffff55, 0, 1.2, 1);
                l.castShadow = true;
                l.name = `BulletLight`;
                scene.add(l);
                this._bulletLightPool.push({
                    light: l,
                    inUse: false,
                    index: this._bulletLightPool.length,
                });
            }
        }, 50);
    }

    public getProgress() {
        const p = [ this._bulletProgress, this._shipProgress, this._fontProgress, this._floorProgress, (this._bulletLightPool.length / BulletMaxLights) ].filter(x => x !== undefined);
        return p.reduce((p, c) => p + c, 0) / p.length;
    }
}

const Assets = new AssetLoader();
export default Assets;