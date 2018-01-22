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
			distance: 65,
			zoom: true,
			rotateSpeed: 0.007,
			damping: 0.05,
		})
		this.anim = false;
		this.uniforms = {
			viewVector: {
				type:"v3",
				value:new THREE.Vector3( 0, 0, 0 ),
			}
		}
		
		console.log(meshLine)

		var geometry = new THREE.Geometry();
		for( var i = 0; i < 500; i ++) {
			let phi = Math.acos( -1 + ( 2 * i ) / 500 );
			let theta = Math.sqrt(500 * Math.PI/3 ) * phi;

			
		

		    var v = new THREE.Vector3( 30 * Math.cos( theta ) * Math.sin( phi ), -30 * Math.cos( phi ), 30 * Math.sin( theta ) * Math.sin( phi ) );
		    geometry.vertices.push( v );
		}

		var line = new meshLine.MeshLine();

		line.setGeometry( geometry, function( p ) { return 1*Math.pow( 4 * p * ( 1 - p ), 0.5 ); } ); // makes width sinusoidal 

		var material = new meshLine.MeshLineMaterial({
			lineWidth: 1,
			visibility: 0,
			transparent: true,
		});
		this.line = new THREE.Mesh( line.geometry, material ); // this syntax could definitely be improved! 
		this.scene.add( this.line );

		

		console.log(CopyShader)

		this.renderer = new THREE.WebGLRenderer( {alpha: true} )
		this.renderer.setSize(this.winWidth, this.winHeight)
		document.body.appendChild(this.renderer.domElement)

		window.addEventListener('resize', this.onResize.bind(this))
		// window.addEventListener('mousemove', this.onMouseMove.bind(this))

		// this.composer = new EffectComposer(this.renderer)
	 //    this.composer.addPass(new RenderPass(this.scene, this.camera))
	 
	    // Add shaders! Celebrate! 
	    // const someShaderPass = new ShaderPass(SomeShader) 
	    // this.composer.addPass(someShaderPass) 
	 
	    // And draw to the screen 
	    // console.log(CopyShader)
	    // const copyPass = new ShaderPass(CopyShader)
	    // copyPass.renderToScreen = true
	    // this.composer.addPass(copyPass)


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
		if (!this.anim) {
			this.anim = true;
			console.log(gsap)
			gsap.TweenLite.to(this.line.material.uniforms.visibility,5, {value:1, ease: Power4.easeInOut})
		}
		this.viewVector = new THREE.Vector3().subVectors( this.camera.position, this.mesh.getWorldPosition());
		this.mesh.material.uniforms.viewVector.value = this.viewVector;

		this.renderer.render(this.scene, this.camera)
	}
}

export default createApp