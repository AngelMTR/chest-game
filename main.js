let scene, camera, renderer, controls;
let chest, isJackpot = false, clickCount = 0;

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

    // بارگذاری تکسچر
    const textureLoader = new THREE.TextureLoader();
    const boxTexture = textureLoader.load('assets/box_texture.png');
    const jackpotTexture = textureLoader.load('assets/jackpot_texture.png');

    // ایجاد جعبه با UV Mapping
    const geometry = new THREE.BoxGeometry(2, 2, 2);

    const uvs = geometry.attributes.uv.array;
    for (let i = 0; i < uvs.length; i += 2) {
        const u = uvs[i];
        const v = uvs[i + 1];

        if (u === 0) {
            uvs[i] = 0.33;
        } else if (u === 1) {
            uvs[i] = 0.66;
        }

        if (v === 0) {
            uvs[i + 1] = 0.5;
        } else if (v === 1) {
            uvs[i + 1] = 1;
        }
    }

    const material = new THREE.MeshBasicMaterial({ map: boxTexture });
    chest = new THREE.Mesh(geometry, material);
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
