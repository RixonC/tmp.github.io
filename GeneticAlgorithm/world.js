var draggables = [];
var goals = [];
var playerPopulations = [];
var projectiles = [];

var circleWidth = 50;
var squareSize = 50;
var canvas_holder_element = document.getElementById("canvas_holder");
var currentlyChoosingProjectileDirection = false;
var playButton = undefined;
var selectionAreaHeight = 0;
var selectionAreaWidth = 0;
var canvasHeight = 0;
var canvasWidth = 0;
var speedController = undefined;
var cancelRun = false;
var solutionFoundForAllPopulations = false;
var numberOfPlayerStartPoints = 0;

// var initialSteps = parseInt(prompt("Please enter initial steps", "4"), 10);
// if(isNaN(initialSteps) || initialSteps > 10)

function setup() {
    // set-up canvas and adjust variables
    if(windowHeight <= windowWidth/3) {
        var canvas = createCanvas(windowWidth*0.8, (windowWidth/3)*0.8);
    } else if(windowHeight >= windowWidth) {
        var canvas = createCanvas(windowWidth*0.8, windowWidth*0.8);
    } else {
        var canvas = createCanvas(windowWidth*0.8, windowHeight*0.8);
    }
    canvas.parent('canvas_holder');
    canvasHeight = canvas.height;
    canvasWidth = canvas.width;
    selectionAreaHeight = canvas.height;
    selectionAreaWidth = canvas.width * 0.15;
    circleWidth = selectionAreaHeight/12;
    squareSize = selectionAreaHeight/12;
    initialPlayerStepSize *= (squareSize/50);
    initialProjectileSpeed *= (circleWidth/50);
    playButton = new PlayButton(selectionAreaWidth/2, selectionAreaHeight*0.15, selectionAreaWidth/4);
    draggables = getDraggables();
    speedController = new SpeedController();
    populationController = new PopulationController();
}

function draw() { // the main loop
    frameRate(60);
    background(255);
    stroke('#1C1933');
    strokeWeight(4);
    noFill();
    rect(0, 0, canvasWidth, canvasHeight);
    fill('#F3FFE2');
    rect(0, 0, selectionAreaWidth, selectionAreaHeight);
    canvas_holder_element.style.cursor = 'auto';

    if(cancelRun && !playButton.isPlayButton) {
        playButton.changeButton();
        cancelRun = false;
    }

    playButton.isMouseOver();
    playButton.drawButton();
    if(playButton.mouseOver) {
        canvas_holder_element.style.cursor = 'pointer';
    }

    if(playButton.isPlayButton) {
        drawText();
    } else {
        drawControls();
    }
    
    numberOfPlayerStartPoints = 0;
    for(let i=0; i<draggables.length; i++) {
        if(!draggables[i].unmodified) {
            if(draggables[i].object === 'player') {
                numberOfPlayerStartPoints += 1;
            }
        }
        draggables[i].mouseOver = false;
    }

    for(let i=0; i<draggables.length; i++) {
        if(playButton.isPlayButton) { // play area can only be modified when not running
            if(!currentlyChoosingProjectileDirection) {
                if(numberOfPlayerStartPoints >= 1){ // we limit the number of Start Points to 1
                    if(draggables[i].object === 'player') {
                        if(!draggables[i].unmodified) {
                            draggables[i].isMouseOver();
                        }
                    } else {
                        draggables[i].isMouseOver();
                    }
                } else {
                    draggables[i].isMouseOver();
                }
            }
            if(numberOfPlayerStartPoints >= 1){
                if(draggables[i].object === 'player') {
                    if(!draggables[i].unmodified) {
                        draggables[i].drawDraggable();
                    }
                } else {
                    draggables[i].drawDraggable();
                }
            } else {
                draggables[i].drawDraggable();
            }
            if(draggables[i].mouseOver) {
                canvas_holder_element.style.cursor = 'move';
            }
        } else {
            drawGoals();
            let currentEvolutionSpeed = evolutionSpeed;
            for(let j=0; j<currentEvolutionSpeed; j++) {
                updatePlayerPopulations();
                updateProjectiles();
            }
            drawPlayerPopulations();
            drawProjectiles();

            if(!solutionFoundForAllPopulations && playerPopulations.length>0) {
                let temp = true;
                for(let i=0; i<playerPopulations.length; i++) {
                    if(!playerPopulations[i].solutionFound) {
                        temp = false;
                    }
                }
                // if(temp && !confirm("A path from each starting point has been found! Continue to find shorter paths?")) {
                //     cancelRun = true;
                // }
                if(temp && !confirm("A path ending at a goal has been found! Continue to find a shorter path that ends at a goal?")) {
                    cancelRun = true;
                }
                solutionFoundForAllPopulations = temp;
            }

            if(playerPopulations[0].generation >= 1000) {
                alert("Maximum generations reached");
                playButton.changeButton();
            }
        }
    }
}

function mousePressed() {
    if(currentlyChoosingProjectileDirection) {
        for(let i=0; i<draggables.length; i++) {
            if(draggables[i].object === 'projectile' && draggables[i].choosingProjectileDirection) {
                draggables[i].setInitialProjectileDirection();
                draggables[i].choosingProjectileDirection = false;
            }
        }
        currentlyChoosingProjectileDirection = false;
    }
    if(playButton.isPlayButton) { // play area can only be modified when not running
        let replacementDraggables = []; // we replace draggables that are in the selection area
        for(let i=0; i<draggables.length; i++) {
            if(draggables[i].mouseOver) {
                if(draggables[i].unmodified) {
                    replacementDraggables.push(new Draggable(draggables[i].xPosition, 
                                                            draggables[i].yPosition, 
                                                            draggables[i].object));
                }
                draggables[i].unmodified = false;
                draggables[i].dragging = true;
                draggables[i].offsetX = draggables[i].xPosition - mouseX;
                draggables[i].offsetY = draggables[i].yPosition - mouseY;
            }
        }
        for(let i=0; i<replacementDraggables.length; i++) {
            draggables.push(replacementDraggables[i]);
        }
    } else {
        speedController.isMouseOver();
        speedController.adjustSpeed();
        populationController.isMouseOver();
        populationController.adjustPopulation();
    }
    
    // click on play/pause button to change it
    if(playButton.mouseOver) {
        solutionFoundForAllPopulations = false;
        evolutionSpeed = initialEvolutionSpeed;
        spawnSize = initialSpawnSize;
        playButton.changeButton();
        convertDraggablesToObjects();
        if(playerPopulations.length == 0) {
            playButton.changeButton();
            alert("Add a starting point");
        } else {
            if(goals.length == 0) {
                playButton.changeButton();
                alert("Add at least one goal");
            }
        }
    }
}

function mouseReleased() {
    // record all draggables that are dropped off the playable area
    let draggablesToRemove = [];
    for(let i=0; i<draggables.length; i++) {
        if(draggables[i].dragging) {
            if(draggables[i].object === 'projectile'){
                if(draggables[i].xPosition-draggables[i].width/2 <= selectionAreaWidth 
                || draggables[i].xPosition+draggables[i].width/2 >= canvas.width 
                || draggables[i].yPosition-draggables[i].width/2 <= 0 
                || draggables[i].yPosition+draggables[i].width/2 >= canvas.height) {
                    draggablesToRemove.push(i);
                } 
            } else {
                if(draggables[i].xPosition <= selectionAreaWidth 
                || draggables[i].xPosition+draggables[i].width >= canvas.width 
                || draggables[i].yPosition <= 0 
                || draggables[i].yPosition+draggables[i].width >= canvas.height) {
                    draggablesToRemove.push(i);
                } 
            }
        }
    }

    // remove all draggables that were dropped off the playable area
    if(draggablesToRemove.length > 0){
        for(let i=draggablesToRemove.length-1; i>=0; i--) {
            draggables.splice(draggablesToRemove[i], 1);
        }
    }

    // if draggable is a projectile then choose velocity
    for(let i=0; i<draggables.length; i++) {
        if(draggables[i].object === 'projectile' && draggables[i].dragging) {
            currentlyChoosingProjectileDirection = true;
            draggables[i].choosingProjectileDirection = true;
            draggables[i].mouseOver = false;
        }
        draggables[i].dragging = false;
    }
}

function getDraggables() {
    let startSquare 
    = new Draggable((selectionAreaWidth-squareSize)/2, (selectionAreaHeight-squareSize/2)*0.5, 'player');
    let goal 
    = new Draggable((selectionAreaWidth-squareSize)/2, (selectionAreaHeight-squareSize/2)*0.7, 'goal');
    let projectile = new Draggable(selectionAreaWidth/2, selectionAreaHeight*0.9 ,'projectile');
    return [startSquare, goal, projectile];
}

function convertDraggablesToObjects() {
    playerPopulations = [];
    projectiles = [];
    goals = [];
    for(var i=0; i<draggables.length; i++) {
        if(!draggables[i].unmodified) {
            if(draggables[i].object === 'goal') {
                goals.push(new Goal(createVector(draggables[i].xPosition, draggables[i].yPosition)));
            } else if(draggables[i].object === 'player') {
                let tempPlayers = [];
                for(let j=0; j<spawnSize; j++) {
                    tempPlayers.push(new Player(createVector(draggables[i].xPosition, draggables[i].yPosition)));
                }
                playerPopulations.push(new Population(tempPlayers));
            } else {
                projectiles.push(
                new Projectile(
                createVector(draggables[i].xPosition, draggables[i].yPosition), draggables[i].projectileDirection
                ));
            }
        }
    }
}

function drawText() {
    fill(0);
    textAlign(CENTER, CENTER);
    strokeWeight(0);
    textStyle(BOLD);
    text('Drag & Drop:', selectionAreaWidth/2, selectionAreaHeight*0.34);
    fill(50);
    textStyle(NORMAL);
    textSize(selectionAreaWidth / 8);
    textFont("Arial");
    text('Starting Point', selectionAreaWidth/2, selectionAreaHeight*0.42);
    text('Goal', selectionAreaWidth/2, selectionAreaHeight*0.62);
    text('Obstacle', selectionAreaWidth/2, selectionAreaHeight*0.82);
}

function drawControls() {
    fill(0);
    textAlign(CENTER, CENTER);
    strokeWeight(0);
    textStyle(BOLD);
    text('Controls:', selectionAreaWidth/2, selectionAreaHeight*0.54);
    fill(50);
    textStyle(NORMAL);
    textSize(selectionAreaWidth / 8);
    textFont("Arial");
    if(playerPopulations.length == 0) {
        text("Generation: 0", selectionAreaWidth/2, selectionAreaHeight*0.34);
        text(`Max Steps: ${initialPathSize}`, selectionAreaWidth/2, selectionAreaHeight*0.44);
    } else if(!playerPopulations[0].solutionFound) {
        text(`Generation: ${playerPopulations[0].generation}`, selectionAreaWidth/2, selectionAreaHeight*0.34);
        text(`Max Steps: ${playerPopulations[0].players[0].brain.path.length}`, selectionAreaWidth/2, selectionAreaHeight*0.44);
    } else {
        text(`Generation: ${playerPopulations[0].generation}`, selectionAreaWidth/2, selectionAreaHeight*0.34);
        text(`Best Steps: ${playerPopulations[0].smallestNumberOfSteps}`, selectionAreaWidth/2, selectionAreaHeight*0.44);
    }
    text('Speed', selectionAreaWidth/2, selectionAreaHeight*0.62);
    text('Population', selectionAreaWidth/2, selectionAreaHeight*0.82);
    speedController.drawSpeedController();
    populationController.drawPopulationController();
}

function drawGoals() {
    for(let i=0; i<goals.length; i++) {
        goals[i].drawGoal();
    }
}

function resetProjectiles() {
    for(let i=0; i<projectiles.length; i++) {
        projectiles[i].resetProjectile();
    }
}

function updateProjectiles() {
    for(let i=0; i<projectiles.length; i++) {
        projectiles[i].move();
    }
}

function drawProjectiles() {
    for(let i=0; i<projectiles.length; i++) {
        projectiles[i].drawProjectile();
    }
}

function updatePlayerPopulations() {
    for(var i=0; i<playerPopulations.length; i++) {
        if(playerPopulations[i].allPlayersDead()) {
            playerPopulations[i].calculateFitness();
            playerPopulations[i].naturalSelection();
            playerPopulations[i].mutatePlayers();
            if(playerPopulations[i].generation % 2 == 0 && !playerPopulations[i].solutionFound) {
                playerPopulations[i].increasePlayerSteps(2);
            }
            resetProjectiles();
        } else {
            playerPopulations[i].updatePopulation();
        }
    }
}

function drawPlayerPopulations() {
    for(var i=0; i<playerPopulations.length; i++) {
        playerPopulations[i].drawPopulation();
    }
}