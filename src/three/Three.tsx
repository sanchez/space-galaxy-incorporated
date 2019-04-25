import React, { useRef, FunctionComponent, useState } from "react";
import * as THREE from "three";
import World from "./world";

export interface IThreeProps {
}

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
let camera: THREE.PerspectiveCamera;
let world: World;

const render = () => {
    world.doRender();
    renderer.render(scene, camera);
};

const Three: FunctionComponent<IThreeProps> = (props) => {
    const documentEl = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const width = documentEl.current.clientWidth;
        const height = documentEl.current.clientHeight;
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);
        world = new World(scene, camera);

        renderer.setSize(width, height);
        documentEl.current.appendChild(renderer.domElement);

        const i = setInterval(render, 25);

        return () => {
            clearInterval(i);
        }
    });

    return <div style={{ flexGrow: 5 }}>
        <div ref={documentEl} style={{ width: "100%", height: "100%" }}></div>
    </div>
}

export default Three;