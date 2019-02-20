class Projectile {
    constructor(initialPosition, initialDirection) {
        this.initialDirection = initialDirection.copy();
        this.initialPosition = initialPosition.copy();
        this.position = initialPosition.copy();
        this.velocity = initialDirection.copy();
        this.width = circleWidth;
    }

    drawProjectile() {
        fill(projectileColourR, projectileColourG, projectileColourB);
        strokeWeight(2);
        stroke(0);
        circle(this.position.x, this.position.y, this.width/2);
    }

    move() {
        this.velocity.normalize().mult(universalSpeedFactor * initialProjectileSpeed);
        this.position.add(this.velocity);

        // it cannot leave
        if(this.position.x - this.width/2 <= selectionAreaWidth || 
        this.position.x + this.width/2 >= canvasWidth) {
            this.velocity = createVector(-this.velocity.x, this.velocity.y);
        } 
        if(this.position.y - this.width/2 <= 0 || 
        this.position.y + this.width/2 >= canvasHeight) {
            this.velocity = createVector(this.velocity.x, -this.velocity.y);
        }
    }

    resetProjectile() {
        this.position = this.initialPosition.copy();
        this.velocity = this.initialDirection.copy();
    }
}