const HealthBarWidth = 200;

export default class HealthBar {
    private _health: number;

    private parent: HTMLDivElement;

    private text: HTMLDivElement;
    private bar: HTMLDivElement;
    private innerBar: HTMLDivElement;

    constructor(health: number) {
        this.parent = document.createElement("div");
        this.parent.style.display = "flex";
        this.parent.style.flexDirection = "row";
        this.parent.style.alignContent = "center";
        this.parent.style.justifyContent = "center";
        this.parent.style.position = "absolute";
        this.parent.style.bottom = "60px";
        this.parent.style.left = "0px";
        this.parent.style.width = "100vw";

        this.text = document.createElement("div");
        this.text.style.fontSize = "50px";
        this.text.style.color = "white";
        this.text.style.paddingLeft = "10px";
        this.text.style.textShadow = "2px 2px black";

        this.bar = document.createElement("div");
        this.bar.style.width = `${HealthBarWidth}px`;
        this.innerBar = document.createElement("div");
        this.innerBar.style.backgroundColor = "green";
        this.innerBar.style.height = "100%";
        this.innerBar.style.borderRadius = "20px";

        this.parent.appendChild(this.bar);
        this.parent.appendChild(this.text);
        this.bar.appendChild(this.innerBar);

        this.health = health;
    }

    public get health() {
        return this._health;
    }

    public set health(val: number) {
        this._health = val;
        this.text.innerText = val.toFixed(0);
        this.innerBar.style.width = Math.floor((val / 100) * HealthBarWidth) + "px";
        if (val <= 25) this.innerBar.style.backgroundColor = "orangered";
    }

    public get domElement() {
        return this.parent;
    }
}