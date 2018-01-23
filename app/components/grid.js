class Grid {
    constructor(opt) {
        this.instancedGeo = new THREE.InstancedBufferGeometry();
        
    }

    createBlueprint() {
        this.blueprint = []
        for (let i = 0; i < array.length; i++) {
            let angle = Math.PI/180*(120*i)
            this.blueprint.push(Math.cos(a), Math.sin(a), 0)
        }

        
    }
}