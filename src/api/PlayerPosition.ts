import Position from "./Position";

export default class PlayerPosition extends Position {
    public theta: number = 0;
    private _phi: number = 0;

    public get phi() {
        return this._phi;
    }

    public set phi(val: number) {
        if (val <= (-Math.PI / 2)) this._phi = -Math.PI / 2;
        else if (val >= (Math.PI)) this._phi = Math.PI / 2;
        else this._phi = val;
    }

    public cameraDistance = 10;

    public getCameraLookat() {
        const x = this.cameraDistance * Math.sin(this.theta) * Math.sin(this.phi);
        const y = this.cameraDistance * Math.cos(this.theta) * Math.sin(this.phi);
        const z = this.cameraDistance * Math.cos(this.phi);

        return [x, z, y];
    }
}