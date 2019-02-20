class Brain {
    constructor() {
        this.mutationRate = mutationRate;
        this.path = [];
        this.randomizePath(initialPathSize);
        this.step = 0;
    }

    getRandomDirection() {
        return createVector(2*random()-1, 2*random()-1).normalize();
    }

    randomizePath(pathSize) {
        for (let i=0; i<pathSize; i++) {
            this.path[i] = this.getRandomDirection();
        }
    }

    mutatePath(died, deathStep) {
        for (let i=0; i < this.path.length; i++) {
            let mutationChance = Math.random();
            if (died && i > deathStep - 10) {
                mutationChance = random(0.2);
            }
            if (mutationChance < this.mutationRate) {
                this.path[i] = this.getRandomDirection();
            }
        }
    }

    extendPath(numberOfMoves) {
        for (let i=0; i < numberOfMoves; i++) {
            this.path.push(this.getRandomDirection());
        }
    }

    cloneBrain() {
        let clone = new Brain(this.mutationRate, this.path.length);
        for(let i=0; i<this.path.length; i++) {
            clone.path[i] = this.path[i].copy();
        }
        return clone;
    }

}