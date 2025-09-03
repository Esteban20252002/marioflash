let gameState = 'waiting'; // waiting, playing, success, gameOver
let timeLeft = 10.0;
let player;
let selectedOption = null;
let blocks = [];
let coins = [];
let goombas = [];
let platformTexture;
let brickTexture;
let coinTexture;
let goombaTexture;
const WORLD_SIZE = 3000; // Mundo mucho más grande
const BLOCK_SIZE = 100; // Bloques más grandes para mejor escala

// Precarga de texturas y recursos
function preload() {
    // Usar colores básicos inicialmente para evitar problemas de carga
    platformTexture = createGraphics(64, 64);
    platformTexture.background(100, 200, 100);
    
    brickTexture = createGraphics(64, 64);
    brickTexture.background(200, 100, 50);
    
    coinTexture = createGraphics(64, 64);
    coinTexture.background(255, 215, 0);
    
    goombaTexture = createGraphics(64, 64);
    goombaTexture.background(139, 69, 19);
}

function setup() {
    // Crear el canvas y configurarlo
    const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.parent('game-canvas');
    
    // Configuración básica de WebGL
    setAttributes('antialias', true);
    
    // Configuración de la perspectiva
    perspective(PI / 3.0, width / height, 0.1, 3000);
    
    // Configuración de la iluminación inicial
    ambientLight(100);
    directionalLight(255, 255, 255, 0, 1, -1);
    
    // Hacer que el canvas se ajuste automáticamente al tamaño de la ventana
    window.addEventListener('resize', () => {
        resizeCanvas(windowWidth, windowHeight);
        perspective(PI / 3.0, width / height, 0.1, 3000);
    });
    
    // Inicializar el mundo y el jugador
    createMarioWorld();
    player = new Player();
    
    // Inicializar el obstáculo
    obstacle = new Obstacle();
    // Inicializar el jugador (cámara en primera persona)
    player = new Player();
    // Inicializar la zona de peligro
    dangerZone = new DangerZone();
}

function draw() {
    background(135, 206, 235); // Color de cielo
    push();
    noStroke();
    fill(255);
    // Añadir algunas nubes básicas en el fondo
    for(let i = 0; i < 10; i++) {
        push();
        translate(
            sin(frameCount * 0.001 + i) * width, 
            -200, 
            cos(frameCount * 0.001 + i) * height
        );
        box(100, 50, 100);
        pop();
    }
    
    switch(gameState) {
        case 'waiting':
            displayStartScreen();
            break;
        case 'playing':
            updateGame();
            break;
        case 'success':
        case 'gameOver':
            // La interfaz se maneja con HTML
            break;
    }
}

class Player {
    constructor() {
        this.position = createVector(0, 100, 200);
        this.velocity = createVector(0, 0, 0);
        this.rotation = 0;
        this.speed = 25;
        this.lookSpeed = 0.03;
        this.renderDistance = 2000;
        this.fov = 90;
        this.minFov = 60;
        this.maxFov = 120;
        this.bobbingAmount = 0;
        this.bobbingSpeed = 0.1;
        this.runningEffect = 0;
        this.isMoving = false;
        this.lookX = 0;
        this.lookZ = -1;
        this.gravity = 0.5;
        this.jumping = false;
        this.score = 0;
    }

    update() {
        // Gravedad y salto
        this.velocity.y += this.gravity;
        this.position.y += this.velocity.y;
        
        // Limitar caída y detectar suelo
        if (this.position.y > 100) {
            this.position.y = 100;
            this.velocity.y = 0;
            this.jumping = false;
        }

        // Movimiento con WASD
        let moveX = 0;
        let moveZ = 0;
        this.isMoving = false;

        // Efecto de correr con Shift
        let currentSpeed = this.speed;
        if (keyIsDown(SHIFT)) {
            currentSpeed *= 1.5;
            this.bobbingSpeed = 0.15;
            this.bobbingAmount = 5;
        } else {
            this.bobbingSpeed = 0.1;
            this.bobbingAmount = 3;
        }

        if (keyIsDown(87)) { // W - Adelante
            moveZ = -1;
            this.isMoving = true;
        }
        if (keyIsDown(83)) { // S - Atrás
            moveZ = 1;
            this.isMoving = true;
        }
        if (keyIsDown(65)) { // A - Izquierda
            moveX = -1;
            this.isMoving = true;
        }
        if (keyIsDown(68)) { // D - Derecha
            moveX = 1;
            this.isMoving = true;
        }
        
        // Aplicar movimiento en la dirección de la mirada
        if (moveX !== 0 || moveZ !== 0) {
            let moveAngle = atan2(moveZ, moveX);
            this.position.x += cos(moveAngle + this.rotation) * this.speed;
            this.position.z += sin(moveAngle + this.rotation) * this.speed;
        }

        // Rotación con el mouse
        if (mouseX !== pmouseX) {
            this.rotation -= (mouseX - pmouseX) * 0.005;
        }

        // Salto con espacio
        if (keyIsDown(32) && !this.jumping) { // Espacio
            this.velocity.y = -15;
            this.jumping = true;
        }

        // Actualizar dirección de la mirada
        this.lookX = sin(this.rotation);
        this.lookZ = -cos(this.rotation);

        // Ajustar FOV con las teclas Q y E
        if (keyIsDown(81)) { // Q - Reducir FOV
            this.fov = max(this.minFov, this.fov - 1);
        }
        if (keyIsDown(69)) { // E - Aumentar FOV
            this.fov = min(this.maxFov, this.fov + 1);
        }

        // Actualizar perspectiva con el FOV actual
        perspective(radians(this.fov), width / height, 0.1, this.renderDistance);

        // Actualizar cámara con efecto de bobbing
        let bobbing = this.jumping ? 0 : sin(frameCount * 0.1) * 3;
        camera(
            this.position.x, 
            this.position.y + bobbing, 
            this.position.z,
            this.position.x + this.lookX * 100,
            this.position.y + bobbing,
            this.position.z + this.lookZ * 100,
            0, 1, 0
        );

        // Colisión con monedas y enemigos
        this.checkCollisions();
    }

    checkCollisions() {
        // Revisar colisiones con monedas
        for (let i = coins.length - 1; i >= 0; i--) {
            if (dist(this.position.x, this.position.z, coins[i].x, coins[i].z) < 30) {
                this.score += 100;
                coins.splice(i, 1);
            }
        }

        // Revisar colisiones con goombas
        for (let goomba of goombas) {
            if (dist(this.position.x, this.position.z, goomba.x, goomba.z) < 40) {
                gameState = 'gameOver';
            }
        }
    }
}

class Obstacle {
    constructor() {
        this.position = createVector(0, 0, 0);
        this.size = 50;
    }

    display() {
        push();
        translate(this.position.x, this.position.y, this.position.z);
        // Dibujamos un obstáculo simple para el MVP
        normalMaterial();
        box(this.size);
        pop();
    }
}

class DangerZone {
    constructor() {
        this.position = createVector(0, 0, -100);
        this.size = 150;
        this.warningActive = false;
    }

    update() {
        push();
        translate(this.position.x, this.position.y, this.position.z);
        // Zona de peligro semitransparente
        ambientMaterial(255, 0, 0, 100);
        noStroke();
        sphere(this.size);
        pop();
    }
}

function updateProximityWarning(distance) {
    const warningElement = document.getElementById('proximity-warning');
    const indicatorElement = document.getElementById('danger-indicator');
    const distanceElement = document.getElementById('distance');
    
    // Actualizar la distancia mostrada
    distanceElement.textContent = Math.floor(distance);
    
    if (distance < DANGER_THRESHOLD) {
        warningElement.classList.remove('hidden');
        indicatorElement.classList.remove('hidden');
        warningElement.classList.add('active');
        indicatorElement.classList.add('active');
    } else {
        warningElement.classList.remove('active');
        indicatorElement.classList.remove('active');
        warningElement.classList.add('hidden');
        indicatorElement.classList.add('hidden');
    }

function updateGame() {
    if (gameState === 'playing') {
        // Asegurarse de que el mundo está visible
        clear();
        background(135, 206, 235); // Color de cielo
        
        if (timeLeft > 0) {
            timeLeft -= deltaTime / 1000;
            document.getElementById('time').textContent = timeLeft.toFixed(2);
            
            if (timeLeft <= 0) {
                gameOver();
            }
        }

function displayStartScreen() {
    // La interfaz de inicio se maneja con HTML
}

function startGame() {
    gameState = 'playing';
    timeLeft = 10.0;
    document.getElementById('start-message').classList.add('hidden');
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('success').classList.add('hidden');
}

function gameOver() {
    gameState = 'gameOver';
    document.getElementById('game-over').classList.remove('hidden');
}

function success() {
    gameState = 'success';
    document.getElementById('success').classList.remove('hidden');
}

// Event Listeners
function keyPressed() {
    if (key === ' ' && gameState === 'waiting') {
        startGame();
    }
    
    if (gameState === 'playing') {
        if (key === 'a' || key === 'A') {
            handleOption('A');
        } else if (key === 'b' || key === 'B') {
            handleOption('B');
        }
    }
}

function handleOption(option) {
    selectedOption = option;
    // En un escenario real, aquí verificaríamos si la opción es correcta
    // Por ahora, simplemente asumimos que cualquier opción antes del tiempo límite es correcta
    if (timeLeft > 0) {
        success();
    }
}

// Manejo de datos del puerto serie (simulado para el MVP)
function mockSerialData() {
    // Aquí se manejarían los datos reales del puerto serie
    // Por ahora solo tenemos la funcionalidad básica con el teclado
}
