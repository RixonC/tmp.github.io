class Player {
    constructor(startPosition) {
        this.brain = new Brain();
        this.dead = false;
        this.deathAtStep = 0;
        this.deathByDot = false;
        this.deathByWall = false;
        this.fitness = 0;
        this.generation = 0;
        this.isBest = false;
        this.position = startPosition.copy();
        this.speedFactor = universalSpeedFactor;
        this.startPosition = startPosition;
        this.stepTimer = 0;
        this.reachedGoal = false;
        this.velocity = createVector(0,0);
    }

    //------------------------------------------------------------------------------------
    // draw

    drawPlayer() {
        if(this.isBest) {
            fill(255, 0, 0);
        } else if(this.dead) {
            fill('#77C4D3');
        } else {
            fill(squareColour);
        }
        strokeWeight(2);
        stroke(0);
        rect(this.position.x, this.position.y, squareSize, squareSize);
    }

    //------------------------------------------------------------------------------------
    // update

    move() {
        // move in the next available direction in this.brain.path
        // we only call move() when this.dead = false
        if(this.stepTimer == 0) {
            if(this.brain.path.length > this.brain.step) {
                this.stepTimer = floor(newDirectionEvery / universalSpeedFactor);
                this.velocity = this.brain.path[this.brain.step].normalize().mult(universalSpeedFactor * initialPlayerStepSize);
                this.brain.step++;
            } else {
                this.dead = true;
                this.deathAtStep = this.brain.step;
            }
        } else {
            this.stepTimer--;
        }
        this.position.add(this.velocity);

        // it cannot leave
        if(this.position.x <= selectionAreaWidth || 
        this.position.x + squareSize >= canvasWidth || 
        this.position.y <= 0 || 
        this.position.y + squareSize >= canvasHeight) {
            this.dead = true;
            this.deathAtStep = this.brain.step;
            this.deathByWall = true;
        }
    }

    checkCollisionWithGoals() {
        for(let i=0; i<goals.length; i++) {
            if(this.position.x < goals[i].position.x + goals[i].width 
                && this.position.x + squareSize > goals[i].position.x
                && this.position.y < goals[i].position.y + goals[i].width 
                && this.position.y + squareSize > goals[i].position.y) {
                this.reachedGoal = true;
            }
        }
    }

    checkCollisionWithProjectile() {
        for(let i=0; i<projectiles.length; i++) {
            if(this.position.x < projectiles[i].position.x + projectiles[i].width/2 
            && this.position.x + squareSize > projectiles[i].position.x - projectiles[i].width/2
            && this.position.y < projectiles[i].position.y + projectiles[i].width/2 
            && this.position.y + squareSize > projectiles[i].position.y - projectiles[i].width/2) {
                if(dist(this.position.x + squareSize/2,
                this.position.y + squareSize/2,
                projectiles[i].position.x,
                projectiles[i].position.y) < 0.707*squareSize + projectiles[i].width/2) {
                    this.dead = true;
                    this.deathByDot = true;
                    this.deathAtStep = this.brain.step;
                }
            }
        }
    }

    checkCollisions() {
        this.checkCollisionWithGoals();
        this.checkCollisionWithProjectile();
    }

    updatePlayer() {
        if(!this.dead && !this.reachedGoal) {
            this.move();
            this.checkCollisions();
        }
    }

    //------------------------------------------------------------------------------------
    // evolution

    getMinumumDistance() {
        let minimumDistance 
        = dist(this.position.x + squareSize/2, 
            this.position.y + squareSize/2, 
            goals[0].position.x + goals[0].width/2, 
            goals[0].position.y + goals[0].width/2);
        for(let i=1; i<goals.length; i++) {
            let temp 
            = dist(this.position.x + squareSize/2, 
                this.position.y + squareSize/2, 
                goals[i].position.x + goals[i].width/2, 
                goals[i].position.y + goals[i].width/2);
            if(minimumDistance > temp) {
                minimumDistance = temp;
            }
        }
        return minimumDistance;
    }

    calculateFitness() {
        var minimumDistance = this.getMinumumDistance();
        let displacement 
        = dist(this.position.x + squareSize/2, 
            this.position.y + squareSize/2,
            this.startPosition.x + squareSize/2, 
            this.startPosition.y + squareSize/2);
        this.fitness = displacement/(minimumDistance**2);

        if(this.reachedGoal) {
            this.fitness += 100000/(this.brain.step**2);
        } else {
            if(this.deathByDot || this.deathByWall) {
                this.fitness *= 0.1;
            }
        }
    }

    createChild() {
        let child = new Player(this.startPosition);
        child.brain = this.brain.cloneBrain();
        child.generation = this.generation;
        return child;
    }
}