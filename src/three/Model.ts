import * as THREE from 'three';


class Model {
    model: any;
    scene: any;

    constructor({ scene }: any) {
        const model = this.createModel()
        this.scene = scene
        this.model = model
        this.scene.add(this.model)
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