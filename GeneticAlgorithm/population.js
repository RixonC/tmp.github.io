class Population {
    constructor(playersList) {
        this.bestPlayerIndex = 0;
        this.fitnessSum = 0;
        this.generation = 0;
        this.maximumPlayerSteps = 500;
        this.players = playersList;
        this.smallestNumberOfSteps = Infinity;
        this.solutionFound = false;
    }

    allPlayersDead() {
        for(let i=0; i<this.players.length; i++) {
            if(!this.players[i].dead && !this.players[i].reachedGoal) {
                return false;
            }
        }
        return true;
    }

    drawPopulation() {
        for(let i=this.players.length-1; i>=0; i--) {
            this.players[i].drawPlayer();
        }
    }

    updatePopulation() {
        for(let i=0; i<this.players.length; i++) {
            if(this.players[i].brain.step > this.smallestNumberOfSteps) {
                this.players[i].dead = true;
                this.players[i].deathAtStep = this.players[i].brain.step;
            } else {
                this.players[i].updatePlayer();
            }
        }
    }

    calculateBestPlayer() {
        let maxFitness = 0;
        let maxIndex = 0;
        for(let i=0; i<this.players.length; i++) {
            if(this.players[i].fitness > maxFitness) {
                maxFitness = this.players[i].fitness;
                maxIndex = i;
            }
        }
        this.bestPlayerIndex = maxIndex;
        if(this.players[this.bestPlayerIndex].reachedGoal) {
            this.smallestNumberOfSteps = this.players[this.bestPlayerIndex].brain.step;
            this.solutionFound = true;
        }
    }

    calculateFitness() {
        for(let i=0; i<this.players.length; i++) {
            this.players[i].calculateFitness();
        }
    }

    calculateFitnessSum() {
        this.fitnessSum = 0;
        for(let i=0; i<this.players.length; i++) {
            this.fitnessSum += this.players[i].fitness;
        }
    }

    selectParent() {
        let rand = random(this.fitnessSum);
        let sum = 0;
        for(let i=0; i<this.players.length; i++) {
            sum += this.players[i].fitness;
            if(sum > rand) {
                return this.players[i];
            }
        }
    }

    naturalSelection() {
        let newPlayers = [];
        this.calculateBestPlayer();
        this.calculateFitnessSum();

        newPlayers[0] = this.players[this.bestPlayerIndex].createChild();
        newPlayers[0].isBest = true;
        for(let i=1; i<spawnSize; i++) {
            newPlayers[i] = this.selectParent().createChild();
        }
        this.players = [];
        for(let i=0; i<newPlayers.length; i++) {
            this.players[i] = newPlayers[i];
        }
        this.generation++;
    }

    mutatePlayers() {
        for(let i=1; i<this.players.length; i++) {
            this.players[i].brain.mutatePath(this.players[i].deathByDot, this.players[i].deathAtStep);
            this.players[i].deathByDot = false;
            this.players[i].generation = this.generation;
        }
        this.players[0].deathByDot = false;
        this.players[0].gen = this.gen;
    }

    increasePlayerSteps(number) {
        if(this.players[0].brain.path.length < this.maximumPlayerSteps) {
            for(let i=0; i<this.players.length; i++) {
                this.players[i].brain.extendPath(number);
            }
        }
    }
}