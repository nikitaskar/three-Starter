import * as THREE from 'three'
import OBJLoader from 'three-obj-loader';

import geometryUtils from '../vendor/geometryUtils'
OBJLoader(THREE);
import MTLLoader from 'three-mtl-loader';

class ParticleLogo {
    constructor(opt) {
        this.instancedGeo = new THREE.BufferGeometry();
        this.scene = opt.scene
        this.stadium = 0;
        
        this.loadJSONObject()
        this.loadJSON()
        //this.loadOBJ()
    }

  
    instanceBlueprint(positions) {
        this.count = positions.length/3
        let translation = new Float32Array(this.count*3)
        let newPos = new Float32Array(this.count*3)
       
    
        let translationIterator = 0;


        //this.redrawBuffer(positions)


        let newPosIterator= 0;

        let q = new THREE.Quaternion()

        for ( let i = 0; i < this.count; i++) {
            translation[translationIterator++] = this.logoBuffer[translationIterator-1]
            translation[translationIterator++] = this.logoBuffer[translationIterator-1]
            translation[translationIterator++] =this.logoBuffer[translationIterator-1]

            newPos[newPosIterator++] = positions[newPosIterator-1]*2.
            newPos[newPosIterator++] = positions[newPosIterator-1]*2.
            newPos[newPosIterator++] =   positions[newPosIterator-1]*2.


        }

        this.instancedGeo.addAttribute('position', new THREE.BufferAttribute(translation,3,1))
        this.instancedGeo.addAttribute('newPos', new THREE.BufferAttribute(newPos,3,1))
      
        let material = new THREE.RawShaderMaterial(
            {   uniforms: {
                    u_time: {
                        type:'f',
                        value:.0,
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
                vertexShader: document.getElementById('particleVert').innerHTML,
                fragmentShader: document.getElementById('particleFrag').innerHTML,
                side: THREE.DoubleSide,
                wireframe: false,
                transparent: true,              
            }
        )

        this.mesh = new THREE.Points(this.instancedGeo, material)
       
        this.scene.add(this.mesh)
    }

    loadJSON() {
        let url = '../pos.json'

        fetch('app/pos.json')
        .then(res => res.json())
        .then((out) => {
            let buffer = new Float32Array(out.positions.length)
            for (let i = 0; i < buffer.length; i++) {
                buffer[i] = out.positions[i]
                
            }
            this.instanceBlueprint(buffer)
        })
        .catch(err => { throw err });
    }

    loadJSONObject() {
        let scene = this.scene
        var loader = new THREE.JSONLoader();
        self =this;
        loader.load( 'app/logo3.json', function ( geometry ) {   
        
            let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({wireframe:true})) 
            let newPositions =  geometryUtils.randomPointsInGeometry( geometry,458424/3 )

            self.transformVectorToBuffer(newPositions)
        }); 

    }
    
    transformVectorToBuffer(newPositions) {
        let logoBuffer = new Float32Array(newPositions.length*3)

        let logoBufferIterator = 0
        for (let i = 0; i < logoBuffer.length; i++) {
           
            logoBuffer[logoBufferIterator++] = newPositions[Math.floor((i)/3)].x
        
           
            logoBuffer[logoBufferIterator++] = newPositions[Math.floor((i)/3)].y  
           
            logoBuffer[logoBufferIterator++] = newPositions[Math.floor((i)/3)].z  
        }
        this.logoBuffer = logoBuffer
    }

    loadOBJ() {
        var loader = new THREE.OBJLoader();
        let scene = this.scene
        // load a resource
        
        self = this
        loader.load(
            // resource URL
            'app/Elephant.obj',
            // called when resource is loaded
            function ( object ) {
                console.log(object)    
                self.instanceBlueprint(object.children[0].geometry.attributes.position.array)

            },
            // called when loading is in progresses
            function ( xhr ) {

                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            function ( error ) {

                console.log( 'An error happened' );

            }
        );
            
    }

    redrawBuffer(buffer) {

      
        let uniqueArray  = buffer.filter(function(elem,index,self) {
        return  index == self.indexOf(elem)


        })
        console.log(uniqueArray)
    }
}

export default ParticleLogo