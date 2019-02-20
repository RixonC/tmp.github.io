class PopulationController {
    constructor() {
        this.buttonWidth = selectionAreaWidth/8;
        this.minusButtonPositionX = selectionAreaWidth/2 - 2*this.buttonWidth - this.buttonWidth/2;
        this.minusButtonPositionY = selectionAreaHeight*0.9 - this.buttonWidth/2;
        this.mouseOverMinus = false;
        this.mouseOverPlus = false;
        this.plusButtonPositionX = selectionAreaWidth/2 + 2*this.buttonWidth - this.buttonWidth/2;
        this.plusButtonPositionY = selectionAreaHeight*0.9 - this.buttonWidth/2;
    }

    drawPopulationController() {
        var population = `${spawnSize}`;
        fill(255);
        strokeWeight(2);
        stroke(0);
        rect(this.minusButtonPositionX, 
            this.minusButtonPositionY, 
            this.buttonWidth, 
            this.buttonWidth);
        rect(this.plusButtonPositionX, 
            this.plusButtonPositionY, 
            this.buttonWidth, 
            this.buttonWidth);
        fill(0);
        textAlign(CENTER, CENTER);
        strokeWeight(0);
        textStyle(BOLD);
        text('-', this.minusButtonPositionX + this.buttonWidth/2, this.minusButtonPositionY + this.buttonWidth/2);
        text('+', this.plusButtonPositionX + this.buttonWidth/2, this.plusButtonPositionY + this.buttonWidth/2);
        text(population, selectionAreaWidth/2, this.minusButtonPositionY + this.buttonWidth/2);
    }

    isMouseOver() {
        if(mouseX > this.minusButtonPositionX 
        && mouseX < this.minusButtonPositionX + this.buttonWidth 
        && mouseY > this.minusButtonPositionY 
        && mouseY < this.minusButtonPositionY + this.buttonWidth) {
            this.mouseOverMinus = true;
        }
        if(mouseX > this.plusButtonPositionX 
        && mouseX < this.plusButtonPositionX + this.buttonWidth 
        && mouseY > this.plusButtonPositionY 
        && mouseY < this.plusButtonPositionY + this.buttonWidth) {
            this.mouseOverPlus = true;
        }
    }

    adjustPopulation() {
        if(this.mouseOverMinus) {
            if(spawnSize > 16) {
                spawnSize = floor(0.5*spawnSize);
            }
            this.mouseOverMinus = false;
        }
        if(this.mouseOverPlus) {
            if(spawnSize < 256) {
                spawnSize = floor(2*spawnSize);
            }
            this.mouseOverPlus = false;
        }
    }
}