const canvas = document.getElementById('pong-canvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const PADDLE_WIDTH = 14;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;

const player = {
    x: 10,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: "#fff"
};

const ai = {
    x: WIDTH - PADDLE_WIDTH - 10,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: "#fff",
    speed: 4
};

const ball = {
    x: WIDTH / 2 - BALL_SIZE / 2,
    y: HEIGHT / 2 - BALL_SIZE / 2,
    size: BALL_SIZE,
    speedX: 5 * (Math.random() > 0.5 ? 1 : -1),
    speedY: (Math.random() * 4 + 2) * (Math.random() > 0.5 ? 1 : -1),
    color: "#fff"
};

let playerScore = 0;
let aiScore = 0;

function drawRect(rect) {
    ctx.fillStyle = rect.color;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
}

function drawBall(ball) {
    ctx.fillStyle = ball.color;
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

function resetBall() {
    ball.x = WIDTH / 2 - BALL_SIZE / 2;
    ball.y = HEIGHT / 2 - BALL_SIZE / 2;
    ball.speedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = (Math.random() * 4 + 2) * (Math.random() > 0.5 ? 1 : -1);
}

function updateScoreboard() {
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('ai-score').textContent = aiScore;
}

function gameLoop() {
    // Move ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collision with top/bottom walls
    if (ball.y < 0) {
        ball.y = 0;
        ball.speedY *= -1;
    }
    if (ball.y + BALL_SIZE > HEIGHT) {
        ball.y = HEIGHT - BALL_SIZE;
        ball.speedY *= -1;
    }

    // Ball collision with paddles
    // Player paddle
    if (
        ball.x < player.x + player.width &&
        ball.x + ball.size > player.x &&
        ball.y < player.y + player.height &&
        ball.y + ball.size > player.y
    ) {
        ball.x = player.x + player.width;
        ball.speedX *= -1.05;
        // Add some vertical randomness
        ball.speedY += (Math.random() - 0.5) * 1.5;
    }

    // AI paddle
    if (
        ball.x + ball.size > ai.x &&
        ball.x < ai.x + ai.width &&
        ball.y < ai.y + ai.height &&
        ball.y + ball.size > ai.y
    ) {
        ball.x = ai.x - ball.size;
        ball.speedX *= -1.05;
        ball.speedY += (Math.random() - 0.5) * 1.5;
    }

    // Ball out of bounds (score)
    if (ball.x < 0) {
        aiScore++;
        updateScoreboard();
        resetBall();
    }
    if (ball.x + BALL_SIZE > WIDTH) {
        playerScore++;
        updateScoreboard();
        resetBall();
    }

    // AI movement (simple tracking)
    let aiTarget = ball.y + ball.size / 2 - ai.height / 2;
    if (ai.y < aiTarget) {
        ai.y += ai.speed;
        if (ai.y > aiTarget) ai.y = aiTarget;
    } else if (ai.y > aiTarget) {
        ai.y -= ai.speed;
        if (ai.y < aiTarget) ai.y = aiTarget;
    }
    // Clamp AI paddle within bounds
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > HEIGHT) ai.y = HEIGHT - ai.height;

    // Draw everything
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Middle dashed line
    ctx.strokeStyle = "#fff";
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    drawRect(player);
    drawRect(ai);
    drawBall(ball);

    requestAnimationFrame(gameLoop);
}

// Mouse controls for player paddle
canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    player.y = mouseY - player.height / 2;
    // Clamp paddle within bounds
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > HEIGHT) player.y = HEIGHT - player.height;
});

// Initialize
updateScoreboard();
gameLoop();