let gameState = 'waiting'; // waiting, playing, success, gameOver
let timeLeft = 10.0;
let obstacle;
let player;
let selectedOption = null;
let dangerZone;
const DANGER_THRESHOLD = 100; // Distancia a la que se activa la advertencia

function setup() {
    const canvas = createCanvas(800, 600, WEBGL);
    canvas.parent('game-canvas');
    
    // Inicializar el obstáculo
    obstacle = new Obstacle();
    // Inicializar el jugador (cámara en primera persona)
    player = new Player();
    // Inicializar la zona de peligro
    dangerZone = new DangerZone();
}

function draw() {
    background(0);
    
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
        this.position = createVector(0, 0, 200);
        this.rotation = 0;
    }

    update() {
        // Actualizar la posición basada en datos del puerto serie
        // Por ahora, solo mantenemos la vista centrada en el obstáculo
        camera(
            this.position.x, this.position.y, this.position.z,
            0, 0, 0,
            0, 1, 0
        );
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
    if (timeLeft > 0) {
        timeLeft -= deltaTime / 1000;
        document.getElementById('time').textContent = timeLeft.toFixed(2);
        
        if (timeLeft <= 0) {
            gameOver();
        }
    }

    // Actualizar y mostrar elementos del juego
    player.update();
    obstacle.display();
    dangerZone.update();
    
    // Verificar proximidad y actualizar indicadores
    const distance = dist(player.position.x, player.position.y, player.position.z,
                         dangerZone.position.x, dangerZone.position.y, dangerZone.position.z);
    
    updateProximityWarning(distance);
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
