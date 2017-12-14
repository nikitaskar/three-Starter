import * as THREE from 'three'
import orbitControls from 'orbit-controls'

class createApp {
	constructor(opt) {
		this.winWidth = window.innerWidth
		this.winHeight = window.innerHeight
		this.winRatio = this.winWidth/this.winHeight
		this.camera = new THREE.PerspectiveCamera( 75,this.winRatio, 0.1, 1000 )

		this.camera.position.z = 10

		this.scene = new THREE.Scene();

		this.material = new THREE.MeshBasicMaterial({color:0xffffff});
		this.geometry = new THREE.SphereGeometry(2,8,8)
		this.mesh = new THREE.Mesh(this.geometry, this.material)


		this.scene.add(this.mesh)

		this.renderer = new THREE.WebGLRenderer( {antialias:true} )
		this.renderer.setSize(this.winWidth, this.winHeight)
		document.body.appendChild(this.renderer.domElement)

		window.addEventListener('resize', this.onResize.bind(this))

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

		this.renderer.render(this.scene, this.camera)
	}
}

export default createApp