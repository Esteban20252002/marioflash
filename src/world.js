function createMarioWorld() {
    // Crear plataforma base más grande
    for (let x = -WORLD_SIZE/2; x < WORLD_SIZE/2; x += BLOCK_SIZE) {
        for (let z = -WORLD_SIZE/2; z < WORLD_SIZE/2; z += BLOCK_SIZE) {
            // Crear un patrón más interesante en el suelo
            let height = noise(x/500, z/500) * 50; // Terreno ondulado
            blocks.push({
                x: x,
                y: 150 + height,
                z: z,
                type: 'platform'
            });
        }
    }

    // Crear bloques flotantes y monedas
    for (let i = 0; i < 20; i++) {
        let x = random(-WORLD_SIZE/3, WORLD_SIZE/3);
        let z = random(-WORLD_SIZE/3, WORLD_SIZE/3);
        
        // Bloques flotantes
        blocks.push({
            x: x,
            y: 0,
            z: z,
            type: 'brick'
        });

        // Monedas
        if (random() > 0.5) {
            coins.push({
                x: x,
                y: -50,
                z: z,
                rotation: 0
            });
        }
    }

    // Crear Goombas
    for (let i = 0; i < 5; i++) {
        goombas.push({
            x: random(-WORLD_SIZE/3, WORLD_SIZE/3),
            z: random(-WORLD_SIZE/3, WORLD_SIZE/3),
            direction: random(TWO_PI)
        });
    }
}

function updateWorld() {
    // Dibujar plataforma y bloques
    for (let block of blocks) {
        push();
        translate(block.x, block.y, block.z);
        if (block.type === 'platform') {
            texture(platformTexture);
        } else {
            texture(brickTexture);
        }
        box(BLOCK_SIZE);
        pop();
    }

    // Actualizar y dibujar monedas
    for (let coin of coins) {
        push();
        translate(coin.x, coin.y, coin.z);
        rotateY(frameCount * 0.05);
        texture(coinTexture);
        cylinder(15, 5, 24);
        pop();
    }

    // Actualizar y dibujar Goombas
    for (let goomba of goombas) {
        // Movimiento simple de los Goombas
        goomba.x += cos(goomba.direction) * 2;
        goomba.z += sin(goomba.direction) * 2;

        // Cambiar dirección si llegan al límite del mundo
        if (abs(goomba.x) > WORLD_SIZE/3 || abs(goomba.z) > WORLD_SIZE/3) {
            goomba.direction += PI;
        }

        push();
        translate(goomba.x, 50, goomba.z);
        texture(goombaTexture);
        sphere(20);
        pop();
    }
}

function updateGame() {
    if (gameState === 'playing') {
        if (timeLeft > 0) {
            timeLeft -= deltaTime / 1000;
            document.getElementById('time').textContent = timeLeft.toFixed(2);
            
            if (timeLeft <= 0) {
                gameOver();
            }
        }

        // Actualizar elementos del juego
        player.update();
        updateWorld();

        // Mostrar puntuación
        push();
        fill(255);
        textSize(32);
        textAlign(LEFT, TOP);
        text('Puntuación: ' + player.score, -width/2 + 20, -height/2 + 20);
        pop();
    }
}
