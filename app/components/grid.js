import * as THREE from 'three'

class Grid {
    constructor(opt) {
        this.instancedGeo = new THREE.InstancedBufferGeometry();
        this.count = opt.count
        this.scene = opt.scene
        this.coords = opt.coords
        this.createBlueprint()
        this.instanceBlueprint()
    }

    createBlueprint() {
        this.blueprint = this.coords
       

        console.log(this.blueprint)

        let attribute =  new THREE.BufferAttribute(new Float32Array(this.blueprint),3)
        this.instancedGeo.addAttribute('position', attribute)        
    }

    instanceBlueprint() {
        let translation = new Float32Array(this.count*3)
        let rotation = new Float32Array(this.count*4)

        let translationIterator = 0;
        let rotationIterator = 0;

        let q = new THREE.Quaternion();

        for (let i = 0; i < this.count; i++) {
            translation[translationIterator++] = 0
            translation[translationIterator++] = -i/390 
            translation[translationIterator++] = 0
            q.set(
                (Math.random()-5)*2,
                (Math.random()-5)*2,
                (Math.random()-5)*2,
                Math.random() * Math.PI 
            )
            q.normalize()
            
            rotation[rotationIterator++] = q.x
            rotation[rotationIterator++] = q.w
            rotation[rotationIterator++] = q.y
            rotation[rotationIterator++] = q.z
    
        }

        this.instancedGeo.addAttribute('translation', new THREE.InstancedBufferAttribute(translation,3,1))
        this.instancedGeo.addAttribute('rotation', new THREE.InstancedBufferAttribute(rotation,4,1))

        let material = new THREE.RawShaderMaterial(
            {
                vertexShader: document.getElementById('vertexShader').innerHTML,
                fragmentShader: document.getElementById('fragmentShader').innerHTML,
                side: THREE.DoubleSide,
                wireframe: true,
            }
        )
        this.grid = new THREE.Mesh(this.instancedGeo, material)
        this.scene.add(this.grid)
    }
}

export default Grid