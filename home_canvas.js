const star_colours = ['#FF800C','#FFF7EA','#6D8FCC','#6AFAB5'];

var canvas = document.getElementById('home_canvas');
canvas.width = window.innerWidth;
canvas.height = 400;
var num_stars = Math.floor(canvas.width/10);
var c = canvas.getContext('2d');

// name
function Text() {
    this.draw = function() {
        c.strokeStyle = '#1C1933';
        c.fillStyle = '#FFF7EA';
        c.textAlign = 'center';
        c.font = '50px Arial';
        c.globalAlpha = 1;
        c.strokeText('Rixon Crane', canvas.width/2, canvas.height/2);
        c.fillText('Rixon Crane', canvas.width/2, canvas.height/2);
    }
}

var txt = new Text();

function Star() {
    this.x = Math.random() * canvas.clientWidth;
    this.y = Math.random() * canvas.clientHeight;
    this.r = 2;
    this.alpha = Math.random();
    this.delta = Math.random() * 0.009 + 0.001;
    this.color = star_colours[Math.floor(Math.random()*star_colours.length)]

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, 2*Math.PI*this.r);
        c.fillStyle = this.color;
        c.globalAlpha = this.alpha;
        c.fill();
    }

    this.update = function() {
        if (this.alpha + this.delta < 0 || this.alpha + this.delta > 1) {
            this.delta *= -1;
        }
        this.alpha += this.delta;
    }
}

// init stars
var starsArray = [];
for (i=0; i<num_stars; i++) {
    starsArray.push(new Star());
}

// animate
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (i=0; i<starsArray.length; i++) {
        starsArray[i].draw();
        starsArray[i].update();
    }
    txt.draw();
}

animate();

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = 400;
    num_stars = Math.floor(canvas.width/10);
    starsArray = [];
    for (i=0; i<num_stars; i++) {
        starsArray.push(new Star());
    }
})