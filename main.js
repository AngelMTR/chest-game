const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// بارگذاری تصاویر
const boxImage = new Image();
boxImage.src = 'assets/box.png';

const jackpotImage = new Image();
jackpotImage.src = 'assets/jackpot.png';

// تنظیمات بازی
const boxWidth = 100;
const boxHeight = 100;
const numBoxes = 5;
const jackpotChance = 0.1; // 10% شانس برنده شدن جکپات

// موقعیت جعبه‌ها
const boxes = [];
for (let i = 0; i < numBoxes; i++) {
    boxes.push({
        x: i * (boxWidth + 20) + 50,
        y: canvas.height / 2 - boxHeight / 2,
        isJackpot: Math.random() < jackpotChance,
        opened: false
    });
}

// رویداد کلیک
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    boxes.forEach(box => {
        if (
            mouseX > box.x &&
            mouseX < box.x + boxWidth &&
            mouseY > box.y &&
            mouseY < box.y + boxHeight &&
            !box.opened
        ) {
            box.opened = true;
        }
    });

    draw();
});

// رسم بازی
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    boxes.forEach(box => {
        if (box.opened) {
            if (box.isJackpot) {
                ctx.drawImage(jackpotImage, box.x, box.y, boxWidth, boxHeight);
            } else {
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(box.x, box.y, boxWidth, boxHeight);
                ctx.fillStyle = '#000';
                ctx.fillText('Try Again', box.x + 10, box.y + 50);
            }
        } else {
            ctx.drawImage(boxImage, box.x, box.y, boxWidth, boxHeight);
        }
    });
}

// بارگذاری اولیه تصاویر و رسم بازی
boxImage.onload = draw;
jackpotImage.onload = draw;
