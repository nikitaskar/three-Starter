import * as THREE from 'three'

class SecondGrid {
    constructor(opt) {
        this.geometry = new THREE.InstancedBufferGeometry()
        this.scene = opt.scene;
        this.coords = opt.coords;
        this.count = opt.count
        this.screenRatio = opt.screenRatio;
        this.squareRatio = opt.squareRatio;
        this.createBlueprint()
        this.instanceBlueprint()
    }

    createBlueprint() {
        this.blueprint = this.coords;

        this.sideLength = Math.sqrt((Math.pow(this.blueprint[0]-this.blueprint[3],2))+(Math.pow(this.blueprint[1]-this.blueprint[4],2)))
        this.uv = [0,0.5,0.5,0.14,0.5,0.86,0.5,0.14,1,0.5,0.5,0.86]
        console.log(this.coords)

        let position =  new THREE.BufferAttribute(new Float32Array(this.blueprint),3)
        this.geometry.addAttribute('position', position) 
        let uv =  new THREE.BufferAttribute(new Float32Array(this.uv),2)
        this.geometry.addAttribute('uv', uv)    

    }

    instanceBlueprint() {
        var translation = new Float32Array( this.count * 3 );
        
        var uvOffset = new Float32Array(this.count * 2);
        var uvScales = new Float32Array(this.count * 2);

        var uvOffsetIterator = 0;
        var uvScalesIterator = 0;
        //and iterators for convenience :)
        var translationIterator = 0;
        this.rank = -1;


        let uvScale = new THREE.Vector2(1 / this.squareRatio, 1 / this.squareRatio);

        for (let i = 0; i < this.squareRatio*2; i++) {

            for (let j = 0; j < this.squareRatio; j++) {
                this.rank++            
          
                uvScales[uvScalesIterator++] = uvScale.x;
                uvScales[uvScalesIterator++] = uvScale.y;
                if(i %2 ==0) {
                    translation[ translationIterator++ ] = 2*((Math.sin(Math.PI/3)*this.sideLength)*j)  - Math.abs(((this.screenRatio.x*2)-2*((Math.sin(Math.PI/3)*this.sideLength))*this.squareRatio))/2
                    translation[ translationIterator++ ] = i*this.sideLength/2  - this.sideLength*this.squareRatio + Math.abs(((-this.screenRatio.y*2)-this.sideLength*this.squareRatio))/2
                    translation[ translationIterator++ ] = Math.random()*0.001+0.005           
                    uvOffset[uvOffsetIterator++] =  j * uvScale.x;
                    uvOffset[uvOffsetIterator++] =  0.36*i * uvScale.y;
                } else {
                    translation[ translationIterator++ ] = 2*((Math.sin(Math.PI/3)*this.sideLength)*j)+(Math.sin(Math.PI/3)*this.sideLength) - Math.abs(((this.screenRatio.x*2)-2*((Math.sin(Math.PI/3)*this.sideLength))*this.squareRatio))/2
                    translation[ translationIterator++ ] = i*this.sideLength/2  - this.sideLength*this.squareRatio + Math.abs(((-this.screenRatio.y*2)-this.sideLength*this.squareRatio))/2
                    translation[ translationIterator++ ] = Math.random()*0.001+0.005
                    uvOffset[uvOffsetIterator++] =  (j * uvScale.x)+(0.5/this.squareRatio) ;
                    uvOffset[uvOffsetIterator++] =  0.36*i * uvScale.y;      
                }
                
            }
            
            
        }
        this.geometry.addAttribute( 'translation', new THREE.InstancedBufferAttribute( translation, 3, 1 ) );
        
  this.geometry.addAttribute(
    "uvOffset",
    new THREE.InstancedBufferAttribute(uvOffset, 2, 1)
  );
  this.geometry.addAttribute(
    "uvScale",
    new THREE.InstancedBufferAttribute(uvScales, 2, 1)
  );    
        //   video = document.createElement( 'video' );
        // // video.id = 'video';
        // // video.type = ' video/ogg; codecs="theora, vorbis" ';
        // video.src = "../Untitled.mp4";
        // video.load(); // must call after setting/changing source
        // video.play();

        // var texture = new THREE.VideoTexture( video );
        // texture.minFilter = THREE.LinearFilter;
        // texture.magFilter = THREE.LinearFilter;
        // texture.format = THREE.RGBFormat;

        let material = new THREE.RawShaderMaterial(
            {    uniforms: {
                    u_time: {
                        type:'f',
                        value:1.0,
                    },
                    u_mouse: {
                        type:'v2',
                        value: {
                            x:0,
                            y:0,
                        },
                    },
                    envmap: { type: "t", value: null },
                    texture: { type: "t", value: null },

                },

                vertexShader: document.getElementById('vertShader').innerHTML,
                fragmentShader: document.getElementById('fragShader').innerHTML,
                side: THREE.DoubleSide,
                wireframe: false,              
            }
        )

        var tl = new THREE.TextureLoader();
        tl.setCrossOrigin( "Anonymous" );
        tl.load("../12719.jpg", function( t ) {
          material.uniforms.envmap.value = t;
        });

        tl = new THREE.TextureLoader();
        tl.setCrossOrigin( "Anonymous" );
        tl.load("../fish.jpg", function( t ) {
          material.uniforms.texture.value = t;
        });

      

        this.grid = new THREE.Mesh(this.geometry, material)
        this.scene.add(this.grid)
    }
}

export default SecondGrid