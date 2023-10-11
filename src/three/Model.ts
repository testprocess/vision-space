import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


class Model {
    model: any;
    scene: any;
    isAvailable: boolean;

    constructor({ scene }: any) {
        this.loadModel()
        this.scene = scene
        this.isAvailable = false
        this.model = undefined
    }

    private loadModel() {
        const loader = new GLTFLoader();

        loader.load( '/public/models/cup.glb', ( gltf ) => {

            this.scene.add( gltf.scene );
            this.model = gltf.scene
            this.scene.add(this.model)

            this.isAvailable = true

        }, undefined, function ( error ) {

            console.error( error );

        } );
    }

    private createModel() {
        const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
        const cube = new THREE.Mesh( geometry, material ); 
        cube.position.set(0,2,0)

        return cube
    }
}

export { Model }