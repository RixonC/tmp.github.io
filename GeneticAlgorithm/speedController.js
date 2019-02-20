class SpeedController {
    constructor() {
        this.buttonWidth = selectionAreaWidth/8;
        this.minusButtonPositionX = selectionAreaWidth/2 - 2*this.buttonWidth - this.buttonWidth/2;
        this.minusButtonPositionY = selectionAreaHeight*0.7 - this.buttonWidth/2;
        this.mouseOverMinus = false;
        this.mouseOverPlus = false;
        this.plusButtonPositionX = selectionAreaWidth/2 + 2*this.buttonWidth - this.buttonWidth/2;
        this.plusButtonPositionY = selectionAreaHeight*0.7 - this.buttonWidth/2;
    }

    drawSpeedController() {
        var speedPercentage = `${(evolutionSpeed / initialEvolutionSpeed)*100}%`;
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
        text(speedPercentage, selectionAreaWidth/2, this.minusButtonPositionY + this.buttonWidth/2);
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

    adjustSpeed() {
        if(this.mouseOverMinus) {
            if(evolutionSpeed / initialEvolutionSpeed > 0.25) {
                evolutionSpeed = floor(0.5*evolutionSpeed);
            }
            this.mouseOverMinus = false;
        }
        if(this.mouseOverPlus) {
            if(evolutionSpeed / initialEvolutionSpeed < 8) {
                evolutionSpeed = floor(2*evolutionSpeed);
            }
            this.mouseOverPlus = false;
        }
    }
}