import * as THREE from 'three'
import orbitControls from 'orbit-controls'
import glsl from 'glslify'
import path from 'path'
import EffectComposer, { RenderPass, ShaderPass, CopyShader } from 'three-effectcomposer-es6'
import meshLine from 'three.meshline'
import gsap from 'gsap'


class createApp {
	constructor(opt) {
		this.winWidth = window.innerWidth
		this.winHeight = window.innerHeight
		this.winRatio = this.winWidth/this.winHeight
		this.camera = new THREE.PerspectiveCamera( 75,this.winRatio, 0.1, 1000 )
		this.target = new THREE.Vector3()
		this.camera.position.z = 65

		this.scene = new THREE.Scene();

		this.controls = orbitControls({
			position : [0,0,0],
			distance: 10,
			zoom: true,
			rotateSpeed: 0.007,
			damping: 0.05,
		})

		this.sphereMaterial = new THREE.MeshBasicMaterial({
		})


		this.sphereGeometry = new THREE.SphereGeometry(6,8,8)
		this.sphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial)

		this.scene.add(this.sphere)

		this.renderer = new THREE.WebGLRenderer({antialias: true})

		this.animate()
	}


	onResize() {
		this.winWidth = window.innerWidth
		this.winHeight = window.innerHeight
		this.winRatio = this.winWidth/this.winHeight
		this.camera.aspect = this.winRatio;
   		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.winWidth, this.winHeight)
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this))
		this.controls.update();
		this.camera.position.fromArray(this.controls.position);
		this.camera.up.fromArray(this.controls.up);
		this.camera.lookAt(this.target);

		this.renderer.render(this.scene, this.camera)
	}
}

export default createApp