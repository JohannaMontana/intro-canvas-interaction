const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvas_height = canvas.height;
const canvas_width = canvas.width;

canvas.style.background = "#000";

const colors = ["#ff5722", "#e91e63", "#9c27b0", "#3f51b5", "#03a9f4", "#009688", "#8bc34a", "#ffeb3b", "#ff9800", "#795548"];

let circlesDeleted = 0;

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = 1 * this.speed;
        this.dy = -1 * this.speed; // Changed to move circles upwards
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context, otherCircles) {
        this.draw(context);
        let collision = false;

        for (let i = 0; i < otherCircles.length; i++) {
            if (this !== otherCircles[i]) {
                let dx = this.posX - otherCircles[i].posX;
                let dy = this.posY - otherCircles[i].posY;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.radius + otherCircles[i].radius) {
                    this.color = colors[Math.floor(Math.random() * colors.length)];
                    otherCircles[i].color = colors[Math.floor(Math.random() * colors.length)];
                    let normalX = dx / distance;
                    let normalY = dy / distance;
                    let dotProduct = this.dx * normalX + this.dy * normalY;
                    this.dx = this.dx - 2 * dotProduct * normalX;
                    this.dy = this.dy - 2 * dotProduct * normalY;
                    let overlap = this.radius + otherCircles[i].radius - distance;
                    let adjustX = overlap * normalX * 0.5;
                    let adjustY = overlap * normalY * 0.5;
                    this.posX += adjustX;
                    this.posY += adjustY;
                    otherCircles[i].posX -= adjustX;
                    otherCircles[i].posY -= adjustY;
                    collision = true;
                }
            }
        }

        if (!collision) {
            this.color = "#ffffff";
        }

        if ((this.posX + this.radius) > canvas_width || (this.posX - this.radius) < 0) {
            this.dx = -this.dx;
            if (this.posX + this.radius > canvas_width) {
                this.posX = canvas_width - this.radius;
            }
            if (this.posX - this.radius < 0) {
                this.posX = this.radius;
            }
        }

        if ((this.posY - this.radius) < -this.radius) {
            circlesDeleted++;
            eliminatedNumber.textContent = circlesDeleted;
            let index = otherCircles.indexOf(this);
            otherCircles.splice(index, 1);
        }

        this.posX += this.dx;
        this.posY += this.dy;
    }

    isClicked(x, y) {
        return (x - this.posX) ** 2 + (y - this.posY) ** 2 < this.radius ** 2;
    }
}

let circles = [];

let n = 15;
for (let i = 0; i < n; i++) {
    let randomX = Math.random() * canvas_width;
    let randomY = canvas_height + Math.random() * (canvas_height / 2) + 50;
    let randomRadius = Math.floor(Math.random() * 30 + 10);
    let speed = 1.5;
    circles.push(new Circle(randomX, randomY, randomRadius, "#ffffff", `${i + 1}`, speed));
}

let updateCircles = function () {
    requestAnimationFrame(updateCircles);
    ctx.clearRect(0, 0, canvas_width, canvas_height);
    for (let i = 0; i < circles.length; i++) {
        circles[i].update(ctx, circles);
    }
};

canvas.addEventListener("click", function(event) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;
    for (let i = 0; i < circles.length; i++) {
        if (circles[i].isClicked(mouseX, mouseY)) {
            circlesDeleted++;
            eliminatedNumber.textContent = circlesDeleted;
            circles.splice(i, 1);
            break;
        }
    }
});

canvas.addEventListener("mousemove", function(event) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;
    document.getElementById("mouseCoordinates").textContent = `Coordenadas del Mouse: (${mouseX.toFixed(2)}, ${mouseY.toFixed(2)})`;
});

startButton.addEventListener("click", function() {
    circlesDeleted = 0;
    eliminatedNumber.textContent = circlesDeleted;
    circles = [];
    for (let i = 0; i < n; i++) {
        let randomX = Math.random() * canvas_width;
        let randomY = canvas_height + Math.random() * (canvas_height / 2) + 50;
        let randomRadius = Math.floor(Math.random() * 30 + 10);
        let speed = 1.5;
        circles.push(new Circle(randomX, randomY, randomRadius, "#ffffff", `${i + 1}`, speed));
    }
    updateCircles();
});

updateCircles();
