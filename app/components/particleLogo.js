import logo from '../logo3'
import OBJLoader from 'three-obj-loader';
OBJLoader(THREE);
import MTLLoader from 'three-mtl-loader';
import * as THREE from 'three'
class ParticleLogo {
    constructor(opt) {
        this.instancedGeo = new THREE.InstancedBufferGeometry();
        this.scene = opt.scene
        this.stadium = 0;
        //this.loadJSON()
        this.loadOBJ()
    }

    createBlueprint() {
        this.blueprint = [];
        for ( var i = 0; i < 3; i++){
            var a = Math.PI / 180 * 120 * i;
            this.blueprint.push( Math.cos( a ), Math.sin( a ), 0 );
        }
        console.log(this.blueprint)

        let attribute =  new THREE.BufferAttribute(new Float32Array(this.blueprint),3)
        this.instancedGeo.addAttribute('position', attribute)      
    }

    instanceBlueprint(positions) {
        console.log(positions)
        this.count = positions.length/3
        let translation = new Float32Array(this.count*3)
        let newPos = new Float32Array(this.count*3)
        let rotation = new Float32Array(this.count*4)

        let translationIterator = 0;
        let rotationIterator= 0;
        let newPosIterator= 0;

        let q = new THREE.Quaternion()

        for ( let i = 0; i < this.count; i++) {
            translation[translationIterator++] = Math.sin((i/this.count*Math.PI*30))*Math.sin(i/this.count*Math.PI)
            translation[translationIterator++] =  Math.cos((i/this.count*Math.PI*30))*Math.sin(i/this.count*Math.PI)
            translation[translationIterator++] = Math.cos((i/this.count*Math.PI))

            newPos[newPosIterator++] = positions[newPosIterator-1]/10.
            newPos[newPosIterator++] = positions[newPosIterator-1]/10.
            newPos[newPosIterator++] =   positions[newPosIterator-1]/10.


            q.set(  ( Math.random() - .5 ) * 2,
            ( Math.random() - .5 ) * 2,
                ( Math.random() - .5 ) * 2,
                Math.random() * Math.PI );
            q.normalize();
    
            //assign to bufferAttribute
            rotation[ rotationIterator++ ] = q.x;
            rotation[ rotationIterator++ ] = q.y;
            rotation[ rotationIterator++ ] = q.z;
            rotation[ rotationIterator++ ] = q.w;
        }

        this.instancedGeo.addAttribute('translation', new THREE.InstancedBufferAttribute(translation,3,1))
        this.instancedGeo.addAttribute('newPos', new THREE.InstancedBufferAttribute(newPos,3,1))
        this.instancedGeo.addAttribute( 'rotation', new THREE.InstancedBufferAttribute( rotation, 4, 1 ) );
        console.log(newPos)

        console.log(translation)

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
            }
        )

        this.mesh = new THREE.Mesh(this.instancedGeo, material)
        console.log(this.mesh.geometry.attributes)

        // let scene = this.scene
        // var loader = new THREE.JSONLoader();
        // loader.load( 'app/logo3.json', function ( geometry ) {
        // var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({wireframe: true}) );

        //                 mesh.position.x =0;
        //                 mesh.position.y =0;
        //                 mesh.position.z =0;
        // scene.add( mesh );
        // console.log(mesh.geometry)

        // }); 

       
        this.scene.add(this.mesh)
    }

    loadJSON() {
        let url = '../pos.json'

        fetch('app/pos.json')
        .then(res => res.json())
        .then((out) => {
            this.createBlueprint()
            this.instanceBlueprint(out)
        })
        .catch(err => { throw err });
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
                    console.log(object,'object')
                    console.log(self)
                    
                    self.createBlueprint()
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
}

export default ParticleLogo