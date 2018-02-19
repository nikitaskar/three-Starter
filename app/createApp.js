import * as THREE from 'three'
import orbitControls from 'orbit-controls'
import glsl from 'glslify'
import path from 'path'
import EffectComposer, { RenderPass, ShaderPass, CopyShader } from 'three-effectcomposer-es6'

class createApp {
	constructor(opt) {
		this.winWidth = window.innerWidth
		this.winHeight = window.innerHeight
		this.winRatio = this.winWidth/this.winHeight
		this.camera = new THREE.PerspectiveCamera( 75,this.winRatio, 0.1, 1000 )
		this.target = new THREE.Vector3()
		this.camera.position.z = 5

		this.scene = new THREE.Scene();

		this.controls = orbitControls({
			position : [0,0,0],
			distance: 10,
			zoom: true,
			rotateSpeed: 0.007,
			damping: 0.05,
		})

		console.log(CopyShader)
		
		this.rank = new Float32Array([
			1,0,2,
			2,0,1,
			3,0,4,
			4,0,1,
			3,3,1,
			3,3,4,
			3,4,1
		])
		this.buffer = new Float32Array ([
			0, 0,  0,
			
			0.5,  0.5,  0.,
			0, 1,  0,

			0, 1,  0,
			0.5,  0.5,  0.,
			1.,1.,0.,

			1.,1.,0.,
			0.5,  0.5,  0.,
			1.,0,0,

			1.,0,0,
			0.5,  0.5,  0.,
			0,0,0,

			1,1,0,
			1.5,.5,0,
			1.5,1,0,
			
			1.5,.5,0,
			1,1,0,
			1,0,0,

			
			1.5,.5,0,
			1,0,0,
			1.5,0,0

		] )

		this.bufferFolded = new Float32Array ([
			1,1,0,			
			0.5,  0.5,  0.,
			1,0,0,

			1,0,0,
			0.5,  0.5,  0.,
			1.,1.,0.,

			1.,1.,0.,
			0.5,  0.5,  0.,
			1.,0,0,

			1.,0,0,
			0.5,  0.5,  0.,
			1,1,0,

			1,1,0,
			0.5,.5,0,
			1,.5,0,
			
			0.5,.5,0,
			1,1,0,
			1,0,0,

			
			0.5,.5,0,
			1,0,0,
			1.,0.5,0

		] )


		this.bufferGeometry = new THREE.BufferGeometry()
		this.bufferGeometry.addAttribute('position', new THREE.BufferAttribute(this.buffer,3))

		this.bufferGeometry.addAttribute('folded', new THREE.BufferAttribute(this.bufferFolded,3))

		this.bufferGeometry.addAttribute('rank', new THREE.BufferAttribute(this.rank,1))

		this.uniforms= {
			u_time:{
				type:'f',
				value:0,
			}
		}

		this.material = new THREE.RawShaderMaterial(
			{
				vertexShader: document.getElementById('vert').innerHTML,
				fragmentShader: document.getElementById('frag').innerHTML,
				uniforms: this.uniforms,
				side: THREE.DoubleSide,
				wireframe: true,
			}
		)
		this.mesh = new THREE.Mesh(this.bufferGeometry, this.material)
		console.log(this.mesh)
		this.scene.add(this.mesh)


		
		this.renderer = new THREE.WebGLRenderer( {antialias:true, alpha: true} )
		this.renderer.setSize(this.winWidth, this.winHeight)
		document.body.appendChild(this.renderer.domElement)

		window.addEventListener('resize', this.onResize.bind(this))
		// window.addEventListener('mousemove', this.onMouseMove.bind(this))

	

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
 		this.camera.lookAt(this.target)
 	
		this.uniforms.u_time.value += .01
		console.log(this.uniforms.u_time.value)
		this.renderer.render(this.scene, this.camera)
	}
}

export default createApp