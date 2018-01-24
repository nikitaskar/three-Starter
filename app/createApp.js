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
		this.camera = new THREE.PerspectiveCamera( 75,this.winRatio, 0.005, 1000 )
		this.camera2 = new THREE.PerspectiveCamera( 75,this.winRatio, 0.005, 1000 )
		this.camera.position.z = 1
		this.camera2.position.z = 10
		this.target = new THREE.Vector3()
		console.log( )
		this.scene = new THREE.Scene();

		this.controls = orbitControls({
			position : [0,0,0],
			distance: 0.01,
			zoom: true,
			zoomSpeed: 0.00007,
			rotateSpeed: 0.007,
			damping: 0.05,
		})

		// this.sphereMaterial = new THREE.MeshBasicMaterial({
		// })

		// this.sphereGeometry = new THREE.SphereGeometry(6,8,8)
		// this.sphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial)

		// this.scene.add(this.sphere)

		this.renderer = new THREE.WebGLRenderer({antialias: true, alpha:true})
		this.renderer.setSize(this.winWidth, this.winHeight)

		document.body.appendChild(this.renderer.domElement)

		window.addEventListener('resize', this.onResize.bind(this))
		window.addEventListener('mousemove', this.onMouseMove.bind(this))
		

		let geo = new THREE.PlaneGeometry(2,2,28,28)
		let material = new THREE.MeshBasicMaterial({wireframe:true})

		let mesh = new THREE.Mesh(geo, material)
		console.log(mesh)
		mesh.rotation.z = Math.PI/4
		//this.scene.add(mesh)

		console.log(this.grid)
		


		this.rawCoords = [
			{
				x:this.winWidth/15,
				y:0,
			},

			{	
				x:Math.cos(2*Math.PI/3)*this.winWidth/15,
				y:Math.sin(2*Math.PI/3)*this.winWidth/15
			},
			{	
				x:Math.cos((2*Math.PI/3)*2)*this.winWidth/15,
				y:Math.sin((2*Math.PI/3)*2)*this.winWidth/15
			},
		]

		this.treatedCoords = []
		
		this.time = 0
		//this.customGeo()
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
		this.grid = new Grid({count: 315, scene: this.scene, coords:this.treatedCoords, pos: new THREE.Vector3(1, -1,-1).unproject(this.camera)})

	}

	customGeo() {
		var geometry = new THREE.BufferGeometry();
		var positions = new Float32Array(30 ); // 3 vertices per point
		geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
		console.log(geometry)
		var positions  = geometry.attributes.position.array
		console.log(positions)
		var x, y, z, index;
		x = y = z = index = 0;
		
		for ( var i = 0, l = 10; i < l; i ++ ) {
			
			positions[ index ++ ] = x;
			positions[ index ++ ] = y;
			positions[ index ++ ] = z;
		
			x += ( Math.random() - 0.5 ) * 30;
			y += ( Math.random() - 0.5 ) * 30;
			z += ( Math.random() - 0.5 ) * 30;
		
		}

		console.log(geometry)
		var face;
		face = new THREE.Face3 (0,1,2); face.materialIndex = 0;
		geometry.faces.push (face);
		face = new THREE.Face3 (3,4,5); face.materialIndex = 0;
		geometry.faces.push (face);

		geometry.computeBoundingSphere();
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

 
		var material = new THREE.MeshBasicMaterial({color:"#ffffff", wireframe: true});
		this.cube = new THREE.Mesh (geometry, material);
		this.scene.add (this.cube);
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
		//this.grid.grid.material.uniforms.u_time = 
		this.renderer.render(this.scene, this.camera2)
	}
}

export default createApp