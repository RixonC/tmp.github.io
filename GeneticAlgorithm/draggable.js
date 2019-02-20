class Draggable {
    constructor(xPosition, yPosition, object) {
        this.choosingProjectileDirection = false;
        this.dragging = false;
        this.mouseOver = false;
        this.object = object;
        this.offsetX = 0;
        this.offsetY = 0;
        this.projectileDirection = null;
        this.unmodified = true;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        if(this.object === 'player' || this.object === 'goal') {
            this.width = squareSize;
        } else {
            this.width = circleWidth;
        }
    }

    drawDraggable() {
        if (this.dragging) {
            this.xPosition = mouseX + this.offsetX;
            this.yPosition = mouseY + this.offsetY;
        }

        if (this.mouseOver) {
            var a = 100;
        } else {
            var a = 255;
        }

        if(this.object === 'player') {
            fill(squareColourR, squareColourG, squareColourB, a);
            strokeWeight(2);
            stroke(0);
            rect(this.xPosition, this.yPosition, this.width, this.width);
        } else if(this.object === 'goal') {
            fill(goalColourR, goalColourG, goalColourB, a);
            strokeWeight(2);
            stroke(0);
            rect(this.xPosition, this.yPosition, this.width, this.width);
        } else { // projectile
            fill(projectileColourR, projectileColourG, projectileColourB, a);
            strokeWeight(2);
            stroke(0);
            circle(this.xPosition, this.yPosition, this.width/2);
            this.drawProjectileArrow();
        }
    }

    drawProjectileArrow() {
        let angle = null;
        if(this.choosingProjectileDirection) {
            if(dist(this.xPosition, this.yPosition, mouseX, mouseY) <= this.width/2) {
                fill(0, 0, 0);
                circle(this.xPosition, this.yPosition, this.width/6);
            } else {
                angle = atan2(mouseY-this.yPosition, mouseX-this.xPosition);
            }
        } else if (this.projectileDirection != null) {
            if(this.projectileDirection.x == 0 && this.projectileDirection.y == 0) {
                fill(0, 0, 0);
                circle(this.xPosition, this.yPosition, this.width/6);
            } else {
                angle = atan2(this.projectileDirection.y, this.projectileDirection.x);
            }
        }
        if(angle != null) {
            var length = circleWidth/6;
            fill(0, 0, 0);
            push();
            translate(this.xPosition,this.yPosition);
            rotate(angle);

            beginShape();
            noStroke();
            vertex(0,-length);
            vertex(5*length, -length);
            vertex(5*length, -3*length);
            vertex(9*length, 0);
            vertex(5*length, 3*length);
            vertex(5*length, length);
            vertex(0,length);
            endShape(CLOSE);
            pop();
        }
    }

    setInitialProjectileDirection() {
        if(dist(this.xPosition, this.yPosition, mouseX, mouseY) <= this.width/2) {
            this.projectileDirection = createVector(0, 0);
        } else {
            this.projectileDirection 
            = createVector(mouseX-this.xPosition, mouseY-this.yPosition).normalize();
        }
    }

    isMouseOver() {
        if(this.object === 'player' || this.object === 'goal') {
            if(mouseX > this.xPosition && mouseX < this.xPosition + this.width && mouseY > this.yPosition && mouseY < this.yPosition + this.width) {
                this.mouseOver = true;
            } else {
                this.mouseOver = false;
            }
        } else {
            if(dist(mouseX, mouseY, this.xPosition, this.yPosition) < this.width/2) {
                this.mouseOver = true;
            } else {
                this.mouseOver = false;
            }
        }
    }
}