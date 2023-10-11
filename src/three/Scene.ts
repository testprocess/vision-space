import * as THREE from 'three';
import { OrbitControls } from "./jsm/OrbitControls.js";
import { Model } from './Model';

class Scene {
    scene: any
    camera: any
    renderer: any
    controls: any
    blocks: any
    meshLeft: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhongMaterial>;
    meshRight: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhongMaterial>;
    model: Model;

    constructor() {

        this.init()

        window.addEventListener('webcamEvent', this.handleWebcamEvent.bind(this));

    }

    private init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000000 );
        this.scene.fog = new THREE.Fog( 0xa0a0a0, 1, 500 );

        const clock = new THREE.Clock();
    

        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 100 );
        this.camera.position.set( 0, 5, 6);
        this.scene.add(this.camera);
    
    
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true

        const dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( -40, 400, -70 );
        dirLight.shadow.camera.top = 150;
        dirLight.shadow.camera.right = 150;
        dirLight.shadow.camera.bottom = -150;
        dirLight.shadow.camera.left = -150;
        dirLight.castShadow = true;
        this.scene.add(dirLight);
        
        const hemiLight = new THREE.HemisphereLight( 0x707070, 0x444444 );
        hemiLight.position.set( 0, 120, 0 );
        this.scene.add(hemiLight);
        
        const meshFloor = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 1 ),new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: true} ) );
        meshFloor.rotation.x = - Math.PI / 2;
        meshFloor.receiveShadow = true;
        this.scene.add(meshFloor);

        this.model = new Model({ scene: this.scene })

        document.querySelector("#screen").appendChild( this.renderer.domElement );
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.animate();
    }

    private handleWebcamEvent(e: any) {
        const webcam = {
            width: 640,
            height: 480
        }

        const face = {
            x: e.detail.boundingBox.originX + (e.detail.boundingBox.width / 2),
            y: e.detail.boundingBox.originY + (e.detail.boundingBox.height / 2)
        }

        const faceRelative = {
            x: -(face.x - webcam.width / 2),
            y: face.y - webcam.height / 2

        }

        this.model.model.rotation.y = -((faceRelative.x) * Math.PI/180)/5
    }


    private animate() {
        requestAnimationFrame( this.animate.bind(this) );
        this.renderer.render( this.scene, this.camera );
    }
    
}




export { Scene }