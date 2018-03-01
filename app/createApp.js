import * as THREE from 'three'
import orbitControls from 'orbit-controls'
import glsl from 'glslify'
import path from 'path'
import EffectComposer, { RenderPass, ShaderPass, CopyShader } from 'three-effectcomposer-es6'
import meshLine from 'three.meshline'
import {TweenMax} from "gsap";
import Grid from './components/grid.js'
import SecondGrid from './components/grid2.js'
import ParticleLogo from './components/particleLogo.js'

class createApp {
	constructor(opt) {
		this.winWidth = window.innerWidth
		this.winHeight = window.innerHeight
		this.winRatio = this.winWidth/this.winHeight
		this.camera = new THREE.PerspectiveCamera( 50,this.winRatio, 0.005, 1000 )
		this.camera2 = new THREE.PerspectiveCamera( 50,this.winRatio, 0.005, 1000 )
		this.camera.setFocalLength(50)
		this.camera2.setFocalLength(50)
		this.camera.position.z = 0.05
		this.camera2.position.z = 10
		this.target = new THREE.Vector3()
		this.scene = new THREE.Scene();
		this.mobile = false;
		if(!this.mobile) {
			this.controls = orbitControls({
				position : [0,0,0],
				distance:10,
				zoom: true,
				zoomSpeed: 0.0007,
				//rotate: false,
				rotateSpeed: 0.009,
				damping: 0.05,
			})
		} else {
			this.controls = orbitControls({
				position : [0,0,0],
				distance:0.0146,
				zoom: false,
				zoomSpeed: 0.000007,
				rotate: false,
				rotateSpeed: 0.003,
				damping: 0.05,
			})
		}
		this.time = 0
		this.raycaster = new THREE.Raycaster()
		this.currentPos = {
			x:0,
			y:0,
		}
		this.renderer = new THREE.WebGLRenderer()
		this.renderer.setSize(this.winWidth, this.winHeight)

		document.body.appendChild(this.renderer.domElement)

		window.addEventListener('resize', this.onResize.bind(this))
		 window.addEventListener('mousemove', this.onMouseMove.bind(this))
		// window.addEventListener('touchmove', this.onTouchMove.bind(this))
		//  window.addEventListener('click', this.onMouseClick.bind(this))
	


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

		this.squareRatio = 17
		this.count = Math.floor((Math.floor(this.squareRatio*2*1.38*1.19*this.squareRatio))/this.squareRatio)*this.squareRatio
	
		this.rawCoords2 = [
			{
				x:-this.winWidth/this.squareRatio,
				y:0,
			},


			{	
				x:-	Math.cos(-2*Math.PI/3)*this.winWidth/this.squareRatio,
				y:-	Math.sin(-2*Math.PI/3)*this.winWidth/this.squareRatio
			},
			{	
				x:-	Math.cos((-2*Math.PI/3)*2)*this.winWidth/this.squareRatio,
				y:-	Math.sin((-2*Math.PI/3)*2)*this.winWidth/this.squareRatio
			},


			{	
				x:-	Math.cos(-2*Math.PI/3)*this.winWidth/this.squareRatio,
				y:-	Math.sin(-2*Math.PI/3)*this.winWidth/this.squareRatio
			},
			{
				x:2*this.winWidth/this.squareRatio,
				y:0,
			},
			{	
				x:-	Math.cos((-2*Math.PI/3)*2)*this.winWidth/this.squareRatio,
				y:-	Math.sin((-2*Math.PI/3)*2)*this.winWidth/this.squareRatio
			},
		]

	
		this.particleLogo = new ParticleLogo({scene: this.scene})

		this.mouse = new THREE.Vector2()

		this.anim = {
			x: this.winWidth/2,
			y:this.winHeight/2,
		}

		this.treatedCoords = []
		
		this.composer = new EffectComposer(this.renderer)
		this.composer.addPass(new RenderPass(this.scene, this.camera2))
		this.postProcMaterial = new THREE.ShaderMaterial({
			uniforms: {
				'tDiffuse': { type: 't', value: null },
				'opacity': { type: 'f', value: 1 },
				'u_time': {type: 'f', value:0},
				'u_resolution': {
					type: 'v2',
					value : {
						x: this.winWidth,
						y:this.winHeight,
					}
				},
			},
			vertexShader: document.getElementById('ppVert').innerHTML,
			fragmentShader: document.getElementById('ppFrag').innerHTML
		})

		// And draw to the screen 
		this.copyPass = new ShaderPass(this.postProcMaterial)
		this.copyPass.renderToScreen = true
		this.composer.addPass(this.copyPass)

		this.time = 0
		//this.initCoords()
		this.animate()
		
	}

	initCoords() {
		for (let i = 0; i < this.rawCoords2.length; i++) {
			let treatedCoordsX = ((this.rawCoords2[i].x)/this.winWidth)*2-1
			let treatedCoordsY = -((this.rawCoords2[i].y)/this.winHeight)*2+1	
			
			this.newPos = new THREE.Vector3(treatedCoordsX, treatedCoordsY,-1).unproject(this.camera)
			this.treatedCoords.push(this.newPos.x, this.newPos.y, this.newPos.z)

		}
		//this.grid2 = new SecondGrid({count:this.count, scene: this.scene, coords: this.treatedCoords,  screenRatio: new THREE.Vector3(1, -1,-1).unproject(this.camera), squareRatio: this.squareRatio })
		//this.grid = new Grid({count: 10201, scene: this.scene, coords:this.treatedCoords, screenRatio: new THREE.Vector3(1, -1,-1).unproject(this.camera)})

	}


	onMouseMove(e) {
		let mouseX = e.clientX
		let mouseY = e.clientY

		this.mouse.x = ((mouseX)/this.winWidth)*2-1
		this.mouse.y = -((mouseY)/this.winHeight)*2+1	
	
	}

	onMouseClick(e) {
		TweenMax.to(this.mouse, 1.5, {x: this.winWidth*1.5, ease: SlowMo.ease.config(0.5, 0.5, false)})
		TweenMax.to(this.anim, 1.5, {x: this.winWidth*1.5, ease: Power2.easeIn})
		
		let video = document.getElementById( 'video' );
        video.play()
	}


	onTouchMove(e) {
		
		this.mouse.x = ((mouseX)/this.winWidth)*2-1
		this.mouse.y = -((mouseY)/this.winHeight)*2+1	
	
	}

	onResize() {
		this.winWidth = window.innerWidth
		this.winHeight = window.innerHeight
		this.winRatio = this.winWidth/this.winHeight
		this.camera2.aspect = this.winRatio;
		this.camera2.updateProjectionMatrix();	
		this.renderer.setSize(this.winWidth, this.winHeight)
	}


	
	animate() {
		
		requestAnimationFrame(this.animate.bind(this))

		this.controls.update();
		this.camera2.position.fromArray(this.controls.position);
		this.camera2.up.fromArray(this.controls.up);
		this.camera2.lookAt(this.target);
		this.time += 1/150
		// this.grid.grid.material.uniforms.u_time.value = this.time
		// this.grid2.grid.material.uniforms.u_time.value = this.time

		//this.raycaster.setFromCamera( this.mouse, this.camera2 );
		//console.log(this.raycaster.ray.origin)

		this.copyPass.material.uniforms.u_time.value = this.time
	
		// this.mouseX = ((this.mouse.x)/this.winWidth)*2-1
		// this.mouseY = -((this.mouse.y)/this.winHeight)*2+1	

		// this.animX = ((this.anim.x)/this.winWidth)*2-1
		// this.animY = -((this.anim.y)/this.winHeight)*2+1	
	
		//this.mousePos = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5).unproject(this.camera2 )
		var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, -1);
		vector.unproject( this.camera2 );
		var dir = vector.sub( this.camera2.position ).normalize();
		var distance = - this.camera2.position.z / dir.z;
		var pos = this.camera2.position.clone().add( dir.multiplyScalar( distance ) );
	
		//console.log(this.mousePos)
		// this.animPos = new THREE.Vector3(this.animX, this.animY,-1).unproject(this.camera)
		var distX = pos.x - this.currentPos.x;
		var distY = pos.y - this.currentPos.y;

		this.currentPos.x += distX/15;
		this.currentPos.y += distY/15;

		// this.currentPos.x = this.mousePos.x;
		// this.currentPos.y = this.mousePos.y;
		
		// this.grid2.grid.material.uniforms.u_mouse.value.x = this.currentPos.x
		// this.grid2.grid.material.uniforms.u_mouse.value.y = this.currentPos.y
	
		
		// this.grid2.grid.material.uniforms.u_anim.value.x = this.animPos.x
		// this.grid2.grid.material.uniforms.u_anim.value.y = this.animPos.y
		if(this.particleLogo.mesh) {
			this.particleLogo.mesh.material.uniforms.u_time.value = this.time
			//this.particleLogo.mesh.rotation.y += 0.01
			//console.log(this.camera2.position.z)
			this.particleLogo.mesh.material.uniforms.u_mouse.value.x = this.currentPos.x
			this.particleLogo.mesh.material.uniforms.u_mouse.value.y = this.currentPos.y
		
			this.particleLogo.mesh.material.uniforms.u_mouse.value.z = pos.z
	
		}
		

		
		this.composer.render(this.scene, this.camera2)
	}
}

export default createApp