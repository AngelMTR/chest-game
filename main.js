let scene, camera, renderer, chest, controls;
let isJackpot = false;
let clickCount = 0;

const jackpotChance = 0.1; // 10% شانس برنده شدن جکپات

// صداها
const dingSound = new Audio('assets/ding.mp3');
const jackpotSound = new Audio('assets/jackpot.mp3');

function init() {
    // تنظیمات صحنه
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // کنترل‌ها
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;

    // نورپردازی
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // جعبه (Chest)
    const textureLoader = new THREE.TextureLoader();
    const boxTexture = textureLoader.load('assets/box.png');
    
    // تنظیم UV Mapping برای تکسچر
    const materials = [
        new THREE.MeshBasicMaterial({ map: boxTexture }), // right
        new THREE.MeshBasicMaterial({ map: boxTexture }), // left
        new THREE.MeshBasicMaterial({ map: boxTexture }), // top
        new THREE.MeshBasicMaterial({ map: boxTexture }), // bottom
        new THREE.MeshBasicMaterial({ map: boxTexture }), // front
        new THREE.MeshBasicMaterial({ map: boxTexture })  // back
    ];
    
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    chest = new THREE.Mesh(boxGeometry, materials);
    scene.add(chest);

    camera.position.z = 5;

    // رویداد کلیک
    window.addEventListener('click', onClick, false);

    animate();
}

function onClick(event) {
    // محاسبه مختصات ماوس
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(chest);

    if (intersects.length > 0 && !isJackpot) {
        clickCount++;
        if (Math.random() < jackpotChance) {
            isJackpot = true;
            jackpotSound.play();
            const jackpotTexture = textureLoader.load('assets/jackpot.png');
            chest.material.map = jackpotTexture;
        } else {
            dingSound.play();
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.onload = init;
