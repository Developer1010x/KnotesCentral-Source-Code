// Matrix animation effect
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

let symbolSize = 12; // Adjust symbol size as needed
let columns, rows;
let matrix = [];

let animationSpeed = 1; // Initial animation speed factor
const minSpeed = 0.2; // Minimum speed factor

function initMatrix() {
    columns = Math.floor(window.innerWidth / symbolSize);
    rows = Math.floor(window.innerHeight / symbolSize);

    canvas.width = columns * symbolSize;
    canvas.height = window.innerHeight;

    matrix = [];
    for (let i = 0; i < columns; i++) {
        matrix[i] = Math.floor(Math.random() * rows);
    }
}

function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f0'; // Matrix color
    ctx.font = `${symbolSize}px Arial`;

    for (let i = 0; i < matrix.length; i++) {
        const text = "1 0 0 1 0 1 0 1 0 1"[Math.floor(Math.random() * "1 0".length)];
        ctx.fillText(text, i * symbolSize, matrix[i] * symbolSize);

        if (matrix[i] * symbolSize > canvas.height && Math.random() > 0.975) {
            matrix[i] = 0;
        }

        matrix[i]++;
    }
}

function animate() {
    draw();
    // Reduce animation speed gradually
    if (animationSpeed > minSpeed) {
        animationSpeed -= 1.0; // Adjust the decrement rate as needed
    }
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1000 / animationSpeed);
}

window.addEventListener('resize', () => {
    initMatrix();
});

window.addEventListener('load', () => {
    initMatrix();
    animate();
});
