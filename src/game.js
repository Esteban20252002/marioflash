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
    // Crear textura de bloque estilo Mario Bros
    brickTexture = createGraphics(64, 64);
    brickTexture.background(202, 77, 62); // Color ladrillo Mario
    brickTexture.fill(0, 0, 0, 50);
    brickTexture.noStroke();
    brickTexture.rect(0, 32, 64, 2); // Línea horizontal
    brickTexture.rect(32, 0, 2, 64); // Línea vertical
    
    // Textura para la plataforma
    platformTexture = createGraphics(64, 64);
    platformTexture.background(94, 145, 254); // Azul Mario Bros
    platformTexture.fill(255, 255, 255, 30);
    platformTexture.noStroke();
    platformTexture.rect(0, 0, 32, 32);
    platformTexture.rect(32, 32, 32, 32);
    
    // Textura para monedas
    coinTexture = createGraphics(64, 64);
    coinTexture.background(255, 215, 0);
    coinTexture.fill(255, 235, 100);
    coinTexture.ellipse(32, 32, 48, 48);
    
    // Textura para el personaje (círculo rojo con bigote)
    playerTexture = createGraphics(128, 128);
    playerTexture.background(255, 0, 0); // Rojo Mario
    playerTexture.fill(255, 220, 180); // Color piel
    playerTexture.ellipse(64, 50, 60, 60); // Cara
    playerTexture.fill(0); // Negro para el bigote
    playerTexture.arc(64, 60, 40, 20, 0, PI); // Bigote
    playerTexture.fill(255, 0, 0); // Rojo para la gorra
    playerTexture.arc(64, 40, 60, 40, PI, TWO_PI); // Gorra
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
    // Cielo azul brillante estilo Mario Bros
    background(107, 140, 255);
    
    push();
    noStroke();
    
    // Dibuja el sol
    push();
    translate(-width/3, -height/3, -500);
    fill(255, 255, 200);
    sphere(100);
    pop();
    
    // Nubes estilo Mario Bros
    fill(255, 255, 255);
    for(let i = 0; i < 10; i++) {
        push();
        translate(
            sin(frameCount * 0.001 + i) * width, 
            -200, 
            cos(frameCount * 0.001 + i) * height
        );
        // Nube estilo Mario Bros (múltiples esferas)
        for(let j = 0; j < 3; j++) {
            translate(30 * j, sin(frameCount * 0.05 + j) * 5, 0);
            sphere(30);
        }
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
        this.size = 50;
        this.bobAmount = 0;
        this.isMoving = false;
        
        // Propiedades de animación del personaje
        this.animationFrame = 0;
        this.blinkTime = 0;
        this.mustacheAngle = 0;
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

        update() {
        // Animación del personaje
        this.animationFrame += 0.1;
        this.mustacheAngle = sin(this.animationFrame) * 0.1;
        
        if (frameCount % 180 === 0) {
            this.blinkTime = 5;
        }
        if (this.blinkTime > 0) {
            this.blinkTime--;
        }
        
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
