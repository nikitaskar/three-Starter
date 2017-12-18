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
		this.camera.position.z = 10

		this.scene = new THREE.Scene();

		this.controls = orbitControls({
			position : [0,0,0],
			distance: 10,
			zoom: false,
			rotateSpeed: 0.007,
			damping: 0.05,
		})
		this.uniforms = {
			viewVector: {
				type:"v3",
				value:new THREE.Vector3( 0, 0, 0 ),
			}
		}
		
		this.material = new THREE.ShaderMaterial({
			vertexShader:glsl((`uniform vec3 viewVector;
				varying float intensity;
				void main() {
				  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position/5., 1.0 );
				  vec3 actual_normal = vec3(modelMatrix * vec4(normal, 0.0));
				  intensity = pow( dot(normalize(viewVector), actual_normal), 3.0 );
				}`
			)),
			fragmentShader:glsl((`varying float intensity;
				void main() {
				  vec3 glow = vec3(246./255., 54./255., 81./255.) * intensity;
				  gl_FragColor = vec4( glow, intensity );
				}`
			)),
			transparent: true,
			uniforms: this.uniforms

		});
		this.geometry = new THREE.SphereGeometry(2,64,64)
		this.mesh = new THREE.Mesh(this.geometry, this.material)


		this.scene.add(this.mesh)

		console.log(CopyShader)

		this.renderer = new THREE.WebGLRenderer( {antialias:true, alpha: true} )
		this.renderer.setSize(this.winWidth, this.winHeight)
		document.body.appendChild(this.renderer.domElement)

		window.addEventListener('resize', this.onResize.bind(this))
		// window.addEventListener('mousemove', this.onMouseMove.bind(this))

		this.composer = new EffectComposer(this.renderer)
	    this.composer.addPass(new RenderPass(this.scene, this.camera))
	 
	    // Add shaders! Celebrate! 
	    // const someShaderPass = new ShaderPass(SomeShader) 
	    // this.composer.addPass(someShaderPass) 
	 
	    // And draw to the screen 
	    const copyPass = new ShaderPass(CopyShader)
	    copyPass.renderToScreen = true
	    this.composer.addPass(copyPass)

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

		this.viewVector = new THREE.Vector3().subVectors( this.camera.position, this.mesh.getWorldPosition());
		this.mesh.material.uniforms.viewVector.value = this.viewVector;

		this.composer.render()
	}
}

export default createApp