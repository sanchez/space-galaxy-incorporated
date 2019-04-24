import Position from "./Position";

export default class PlayerPosition extends Position {
    public theta: number = 0;
    public phi: number = Math.PI / 2;

    public cameraDistance = 10;

    public getCameraLookat() {
        const x = this.cameraDistance * Math.sin(this.theta) * Math.sin(this.phi);
        const y = this.cameraDistance * Math.cos(this.theta) * Math.sin(this.phi);
        const z = this.cameraDistance * Math.cos(this.phi);

        return [x, z, y];
    }
}