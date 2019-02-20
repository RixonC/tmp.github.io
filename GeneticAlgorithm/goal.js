class Goal {
    constructor(position) {
        this.position = position;
        this.width = squareSize;
    }

    drawGoal() {
        fill(goalColourR, goalColourG, goalColourB);
        strokeWeight(2);
        stroke(0);
        rect(this.position.x, this.position.y, this.width, this.width);
    }
}