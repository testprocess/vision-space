import * as THREE from 'three';
import { OrbitControls } from "./jsm/OrbitControls.js";

class Scene {
    scene: any
    camera: any
    renderer: any
    controls: any
    blocks: any

    constructor() {

        this.init()

        window.addEventListener('webcamEvent', this.handleWebcamEvent.bind(this));

    }

    async init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000000 );
    
        const clock = new THREE.Clock();
    
    
        
        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 100 );
        this.camera.position.set( 0, 2, 4 );
        this.camera.rotation.set( 0, 90, 0 )

        this.scene.add(this.camera);
    
    
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true


    
        document.querySelector("#screen").appendChild( this.renderer.domElement );
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );

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
        
        const meshFloor = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ),new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: true} ) );
        meshFloor.rotation.x = - Math.PI / 2;
        meshFloor.receiveShadow = true;
        this.scene.add(meshFloor);


        const meshFront = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ),new THREE.MeshPhongMaterial( { color: 0xffffff, depthWrite: true} ) );
        meshFront.rotation.x = 0;
        meshFront.position.z = -20
        meshFront.receiveShadow = true;
        this.scene.add(meshFront);
        
        const meshLeft = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ),new THREE.MeshPhongMaterial( { color: 0xfff777, depthWrite: true} ) );
        meshLeft.rotation.y =  Math.PI / 2;
        meshLeft.position.x = -20
        meshLeft.receiveShadow = true;
        this.scene.add(meshLeft);

        const meshRight = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ),new THREE.MeshPhongMaterial( { color: 0xfff777, depthWrite: true} ) );
        meshRight.rotation.y = - Math.PI / 2;
        meshRight.position.x = 20
        meshRight.receiveShadow = true;
        this.scene.add(meshRight);

        this.animate();
    }



    animate() {
        requestAnimationFrame( this.animate.bind(this) );

        this.renderer.render( this.scene, this.camera );
    }

    // Note: 테스트
    moveCamera({ x, y }: { x: number, y: number}) {
        const strength = 20
        this.camera.position.set( 0 + (x/strength), 10, 30 + (y/strength) );
    }


    handleWebcamEvent(e: any) {
        const webcam = {
            width: 640,
            height: 480
        }

        const face = {
            x: e.detail.boundingBox.originX + (e.detail.boundingBox.width / 2),
            y: e.detail.boundingBox.originY + (e.detail.boundingBox.height / 2)
        }

        const faceRelative = {
            x: face.x - webcam.width / 2,
            y: face.y - webcam.height / 2

        }

        this.moveCamera(faceRelative)
        console.log(faceRelative)
    }

    
}




export { Scene }