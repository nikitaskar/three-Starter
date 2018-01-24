import * as THREE from 'three'

class Grid {
    constructor(opt) {
        this.instancedGeo = new THREE.InstancedBufferGeometry();
        this.count = opt.count
        this.scene = opt.scene
        this.coords = opt.coords
        this.pos = opt.pos

        this.createBlueprint()
        this.instanceBlueprint()
    }

    createBlueprint() {
        this.blueprint = this.coords
       
        this.sideLength = Math.sqrt((Math.pow(this.blueprint[0]-this.blueprint[3],2))+(Math.pow(this.blueprint[1]-this.blueprint[4],2)))
        console.log(this.sideLength)

        let attribute =  new THREE.BufferAttribute(new Float32Array(this.blueprint),3)
        this.instancedGeo.addAttribute('position', attribute)        
    }

    instanceBlueprint() {
        let translation = new Float32Array(this.count*3)
        let rotation = new Float32Array(this.count*4)
        let scale = new Float32Array(this.count*3)


        let translationIterator = 0;
        let rotationIterator = 0;
        let scaleIterator = 0;
        let q = new THREE.Quaternion();
        let count = -1;
        for ( let i = 0; i < 15; i++) {
            
            
            for (let j = 0;j<15; j++) {
                count++
                if(count%2 == 0) {
                    scale[scaleIterator++] = -1
                    scale[scaleIterator++] = 1
                    scale[scaleIterator++] = 1
                } else {
                    scale[scaleIterator++] = 1
                    scale[scaleIterator++] = 1
                    scale[scaleIterator++] = 1
                }

                if(count%2 == 0) {
                    translation[translationIterator++] = ((Math.sin(Math.PI/3)*this.sideLength)*i)-(-this.pos.x-this.blueprint[0])-((Math.sin(Math.PI/3)*this.sideLength)*15)-(((this.pos.x*2)-(Math.sin(Math.PI/3)*this.sideLength)*15)/2)
                    translation[translationIterator++] = -this.sideLength/2*j
                    translation[translationIterator++] = 0
                } else {
                    translation[translationIterator++] = -((Math.sin(Math.PI/3)*this.sideLength)*i)+(-this.pos.x-this.blueprint[0])+((Math.sin(Math.PI/3)*this.sideLength)*15)+(((this.pos.x*2)-(Math.sin(Math.PI/3)*this.sideLength)*15)/2)
                    translation[translationIterator++] = -this.sideLength/2*j
                    translation[translationIterator++] = 0
                }
                
            }
           
          

           
            

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
        this.instancedGeo.addAttribute('scale', new THREE.InstancedBufferAttribute(scale,3,1))

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