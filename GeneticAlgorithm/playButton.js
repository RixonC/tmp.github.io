class PlayButton {
    constructor(xCentrePosition, yCentrePosition, radius) {
        this.isPlayButton = true;
        this.mouseOver = false;
        this.radius = radius;
        this.xCentrePosition = xCentrePosition;
        this.yCentrePosition = yCentrePosition;
    }

    changeButton() {
        if(this.isPlayButton) {
            this.isPlayButton = false;
        } else {
            this.isPlayButton = true;
        }
    }

    drawButton() {
        if (this.mouseOver) {
            var a = 100;
        } else {
            var a = 255;
        }

        fill(34, 83, 120, a);
        strokeWeight(2);
        stroke(0);
        circle(this.xCentrePosition, this.yCentrePosition, this.radius);

        if(this.isPlayButton) {
            // play button
            fill(61, 255, 103, a);
            triangle(this.xCentrePosition - this.radius/3, 
                this.yCentrePosition - this.radius/2, 
                this.xCentrePosition - this.radius/3, 
                this.yCentrePosition + this.radius/2,
                this.xCentrePosition + this.radius/2,
                this.yCentrePosition);
        } else {
            // stop button
            fill(255, 0, 0, a);
            rect(this.xCentrePosition - this.radius/2,
                this.yCentrePosition - this.radius/2,
                this.radius,
                this.radius);
        }
    }

    isMouseOver() {
        if(dist(mouseX, mouseY, this.xCentrePosition, this.yCentrePosition) <= this.radius) {
            this.mouseOver = true;
        } else {
            this.mouseOver = false;
        }
    }
}