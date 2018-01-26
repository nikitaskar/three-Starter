import * as THREE from 'three'
import orbitControls from 'orbit-controls'
import glsl from 'glslify'
import path from 'path'
import EffectComposer, { RenderPass, ShaderPass, CopyShader } from 'three-effectcomposer-es6'
import meshLine from 'three.meshline'
import gsap from 'gsap'

import Grid from './components/grid.js'

class createApp {
	constructor(opt) {
		this.winWidth = window.innerWidth
		this.winHeight = window.innerHeight
		this.winRatio = this.winWidth/this.winHeight
		this.camera = new THREE.PerspectiveCamera( 50,this.winRatio, 0.005, 1000 )
		this.camera2 = new THREE.PerspectiveCamera( 50,this.winRatio, 0.005, 1000 )
		this.camera.setFocalLength(50)
		this.camera2.setFocalLength(50)
		this.camera.position.z = 1
		this.camera2.position.z = 10
		this.target = new THREE.Vector3()
		console.log( )
		this.scene = new THREE.Scene();

		this.controls = orbitControls({
			position : [0,0,0],
			distance:0.0007,
			zoom: true,
			zoomSpeed: 0.000007,
			rotateSpeed: 0.007,
			damping: 0.05,
		})

		this.renderer = new THREE.WebGLRenderer({antialias: true, alpha:true})
		this.renderer.setSize(this.winWidth, this.winHeight)

		document.body.appendChild(this.renderer.domElement)

		window.addEventListener('resize', this.onResize.bind(this))
		window.addEventListener('mousemove', this.onMouseMove.bind(this))

		this.rawCoords = [
			{
				x:this.winWidth/101,
				y:0,
			},

			{	
				x:Math.cos(2*Math.PI/3)*this.winWidth/101,
				y:Math.sin(2*Math.PI/3)*this.winWidth/101
			},
			{	
				x:Math.cos((2*Math.PI/3)*2)*this.winWidth/101,
				y:Math.sin((2*Math.PI/3)*2)*this.winWidth/101
			},
		]

		// let geo = new THREE.PlaneGeometry(10,10,120,120);
		// let mat = new THREE.MeshBasicMaterial({color:"#ffffff",wireframe:true})

		// let meshh = new THREE.Mesh(geo, mat)
		// this.scene.add(meshh)
		// meshh.rotation.z = Math.PI/4
		

		this.treatedCoords = []
		
		this.light = new THREE.PointLight(0xffffff)
		this.light.position.set(0,0,0.6)
		this.scene.add(this.light)

		this.time = 0
		this.initCoords()
		this.animate()
		
	}

	initCoords() {
		for (let i = 0; i < this.rawCoords.length; i++) {
			console.log(this.rawCoords)
			let treatedCoordsX = ((this.rawCoords[i].x)/this.winWidth)*2-1
			let treatedCoordsY = -((this.rawCoords[i].y)/this.winHeight)*2+1	
			
			this.newPos = new THREE.Vector3(treatedCoordsX, treatedCoordsY,-1).unproject(this.camera)
			console.log(new THREE.Vector3(1, -1,-1).unproject(this.camera))
			this.treatedCoords.push(this.newPos.x, this.newPos.y, this.newPos.z)

		}
		this.grid = new Grid({count: 10201, scene: this.scene, coords:this.treatedCoords, screenRatio: new THREE.Vector3(1, -1,-1).unproject(this.camera)})

	}


	onMouseMove(e) {
		let mouseX = e.clientX
		let mouseY = e.clientY
		
		this.mouseX = ((mouseX)/this.winWidth)*2-1
		this.mouseY = -((mouseY)/this.winHeight)*2+1	
	
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
		this.camera2.position.fromArray(this.controls.position);
		this.camera2.up.fromArray(this.controls.up);
		this.camera2.lookAt(this.target);
		this.time += 1
		this.grid.grid.material.uniforms.u_time.value = this.time
			
		this.mousePos = new THREE.Vector3(this.mouseX, this.mouseY,-1).unproject(this.camera)
		this.grid.grid.material.uniforms.u_mouse.value.x = this.mousePos.x
		this.grid.grid.material.uniforms.u_mouse.value.y = this.mousePos.y
		

		//this.grid.grid.material.uniforms.u_time = this.time
		this.renderer.render(this.scene, this.camera2)
	}
}

export default createApp