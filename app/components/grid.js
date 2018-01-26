import * as THREE from 'three'

class Grid {
    constructor(opt) {
        this.instancedGeo = new THREE.InstancedBufferGeometry();
        this.count = opt.count
        this.scene = opt.scene
        this.coords = opt.coords
        this.pos = opt.screenRatio

        this.createBlueprint()
        this.instanceBlueprint()
    }

    createBlueprint() {
        this.blueprint = this.coords
        this.sideLength = Math.sqrt((Math.pow(this.blueprint[0]-this.blueprint[3],2))+(Math.pow(this.blueprint[1]-this.blueprint[4],2)))

        let attribute =  new THREE.BufferAttribute(new Float32Array(this.blueprint),3)
        this.instancedGeo.addAttribute('position', attribute)      
    }

    instanceBlueprint() {
        let translation = new Float32Array(this.count*3)
        let rotation = new Float32Array(this.count*4)
        let scale = new Float32Array(this.count*3)
        let rank = new Float32Array(this.count)

        let rankIterator = 0;
        let translationIterator = 0;
        let rotationIterator = 0;
        let scaleIterator = 0;

        let count = -1;
        for ( let i = 0; i < 101; i++) {
            
            
            for (let j = 0;j<101; j++) {
                count++
                
                if(count%2 == 0) {
                    scale[scaleIterator++] = -1
                    scale[scaleIterator++] = 1
                    scale[scaleIterator++] = 1
                    rank[rankIterator++] = count
                } else {
                    scale[scaleIterator++] = 1
                    scale[scaleIterator++] = 1
                    scale[scaleIterator++] = 1
                    rank[rankIterator++] = count
                }

                if(count%2 == 0) {
                    translation[translationIterator++] = -((Math.sin(Math.PI/3)*this.sideLength)*i)-(-this.pos.x-this.blueprint[0])-((Math.sin(Math.PI/3)*this.sideLength)*101)-(((this.pos.x*2)-(Math.sin(Math.PI/3)*this.sideLength)*101)/2)+(Math.sin(Math.PI/3)*this.sideLength)*101-((Math.sin(Math.PI/3)*this.sideLength))
                    translation[translationIterator++] = -this.sideLength/2*j-((-this.pos.y*2)-(this.sideLength/2)*101)/2
                    translation[translationIterator++] = Math.random()*0.01
                } else {
                    translation[translationIterator++] = -((Math.sin(Math.PI/3)*this.sideLength)*i)+(-this.pos.x-this.blueprint[0])+((Math.sin(Math.PI/3)*this.sideLength)*101)+(((this.pos.x*2)-(Math.sin(Math.PI/3)*this.sideLength)*101)/2)
                    translation[translationIterator++] = -this.sideLength/2*j-((-this.pos.y*2)-(this.sideLength/2)*101)/2
                    translation[translationIterator++] = Math.random()*0.01
                }                            
            }       
        }

        this.instancedGeo.addAttribute('translation', new THREE.InstancedBufferAttribute(translation,3,1))
        this.instancedGeo.addAttribute('scale', new THREE.InstancedBufferAttribute(scale,3,1))
        this.instancedGeo.addAttribute('rank', new THREE.InstancedBufferAttribute(rank,1,1))
       

        let material = new THREE.RawShaderMaterial(
            {   uniforms: {
                    u_time: {
                        type:'f',
                        value:1.0,
                    },
                    u_resolution: {
                        type: 'v2',
                        value : {
                            x: window.innerWidth,
                            y:window.innerHeight,
                        }
                    },
                    u_mouse: {
                        type: 'v2',
                        value: {
                            x:0,
                            y:0,
                        }
                    }
                },
                vertexShader: document.getElementById('vertexShader').innerHTML,
                fragmentShader: document.getElementById('fragmentShader').innerHTML,
                side: THREE.DoubleSide,
                wireframe: false,              
            }
        )

        this.grid = new THREE.Mesh(this.instancedGeo, material)
        this.grid.scale.set(1,1,1)
        this.scene.add(this.grid)
    }
}

export default Grid
