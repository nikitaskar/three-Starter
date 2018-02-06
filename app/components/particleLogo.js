import logo from '../logo3'
import * as THREE from 'three'
class ParticleLogo {
    constructor(opt) {
        this.instancedGeo = new THREE.InstancedBufferGeometry();
        this.scene = opt.scene

        this.createBlueprint()
        this.instanceBlueprint()
    }

    createBlueprint() {
        this.blueprint = [];
        for ( var i = 0; i < 3; i++){
            var a = Math.PI / 180 * 120 * i;
            this.blueprint.push( Math.cos( a ), Math.sin( a ), 0 );
        }
      

        let attribute =  new THREE.BufferAttribute(new Float32Array(this.blueprint),3)
        this.instancedGeo.addAttribute('position', attribute)      
    }

    instanceBlueprint() {
        let translation = new Float32Array(64*3)
        let rotation = new Float32Array(64*4)

        let translationIterator = -1;
        let rotationIterator= 0;
        let q = new THREE.Quaternion()
        for ( let i = 0; i < 64; i++) {
            translation[translationIterator++] = logo.vertices[translationIterator-1]*1
            translation[translationIterator++] = logo.vertices[translationIterator-1]*1
            translation[translationIterator++] = logo.vertices[translationIterator-1]*1


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
        this.instancedGeo.addAttribute( 'rotation', new THREE.InstancedBufferAttribute( rotation, 4, 1 ) );


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
                vertexShader: document.getElementById('particleVert').innerHTML,
                fragmentShader: document.getElementById('particleFrag').innerHTML,
                side: THREE.DoubleSide,
                wireframe: false,              
            }
        )

        this.mesh = new THREE.Mesh(this.instancedGeo, material)
        console.log(this.mesh.geometry.attributes)

        let scene = this.scene
        var loader = new THREE.JSONLoader();
        loader.load( 'app/logo3.json', function ( geometry ) {
        var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({wireframe: true}) );

                        mesh.position.x =0;
                        mesh.position.y =0;
                        mesh.position.z =0;
        scene.add( mesh );
        console.log(mesh.geometry)

        }); 

       
        this.scene.add(this.mesh)
    }
}

export default ParticleLogo