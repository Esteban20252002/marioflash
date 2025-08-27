# marioflash

![boceto](marioflahs.jpg)

juego interactivo de mario flash para poder llegar a la meta 
¡Perfecto! Aquí tienes el **PRD (Product Requirements Document)** o documento de requerimientos del producto para tu proyecto de **“Escenario físico de Mario Bros con obstáculos usando Arduino”**.

---

# 📝 **PRD – Escenario Interactivo de Mario Bros con Arduino**

---

## 📌 1. **Nombre del proyecto**

**Mini Escenario de Mario Bros con Obstáculos Interactivos (Arduino)**

---

## 🎯 2. **Objetivo del proyecto**

Diseñar y construir un escenario físico inspirado en el videojuego Mario Bros, donde el personaje principal (Mario) debe avanzar y esquivar obstáculos móviles. El sistema detectará colisiones, contará vidas, y usará luces, sonidos y pantallas para mejorar la experiencia interactiva.

---

## 👨‍🏫 3. **Justificación**

Este proyecto busca fomentar la creatividad, la lógica de programación y el uso de electrónica básica mediante la recreación de un entorno de videojuego clásico con Arduino. Aporta valor como herramienta educativa, proyecto maker o exposición de feria tecnológica.

---

## 🧩 4. **Componentes funcionales**

### 4.1. **Hardware**

* Arduino Uno o Nano
* Servo motores (1 o 2) – para mover obstáculos
* Sensor ultrasónico o infrarrojo – para detectar colisiones
* Buzzer – para efectos de sonido
* LEDs (rojo y verde) – para indicar estados
* Pantalla LCD 16x2 o pantalla OLED – para mostrar vidas y puntuación
* Botones – para activar power-ups (opcional)
* DFPlayer Mini + altavoz (opcional) – para reproducir música real
* Fuente de energía (cable USB o batería)
* Material estructural (cartón, madera, impresión 3D)

### 4.2. **Software**

* Arduino IDE
* Librerías: `Servo.h`, `LiquidCrystal.h` o `Adafruit_SSD1306.h`, `SoftwareSerial.h` (si se usa DFPlayer)
* Sonidos en MP3 (si se usa reproductor)
* Código fuente para lógica del juego

---

## 🛠️ 5. **Funciones clave**

| Función                                 | Descripción                                                                |
| --------------------------------------- | -------------------------------------------------------------------------- |
| Movimiento de obstáculos                | Obstáculos giran o suben/bajan con servo motor                             |
| Detección de colisión                   | Sensor detecta si Mario toca el obstáculo                                  |
| Sistema de vidas                        | Se reducen vidas al fallar. LEDs y pantalla lo indican                     |
| Sonido interactivo                      | Buzzer suena al colisionar o completar el nivel                            |
| Efecto visual con LEDs                  | LED rojo indica daño, verde indica zona segura                             |
| Pantalla de puntuación y estado         | LCD muestra vidas, puntos, y estados como “Nivel completado” o “Game Over” |
| Botón de estrella (power-up) (opcional) | Activa modo invencible temporal con luces y sonidos                        |

---

## 🎮 6. **Interacción del usuario**

* El usuario desplaza físicamente a Mario por el escenario.
* El escenario tiene obstáculos que se mueven automáticamente.
* Si Mario se acerca demasiado a un obstáculo, se activa una "colisión":

  * Se pierde una vida.
  * Suena una alerta.
  * Se enciende un LED rojo.
* Al llegar a la meta, se reproduce un sonido de victoria y se muestra un mensaje en pantalla.

---

## 📈 7. **Criterios de éxito**

* El escenario debe tener al menos un obstáculo funcional.
* El sistema debe detectar correctamente las colisiones.
* La pantalla debe mostrar vidas o puntos correctamente.
* Los efectos de luz y sonido deben responder a las acciones del jugador.
* El sistema debe ser estable durante al menos 3 minutos de juego continuo.

---

## 📦 8. **Entregables**

* Código Arduino funcional y comentado
* Esquema eléctrico (puede ser hecho en Fritzing)
* Maqueta o estructura física montada
* Video o demostración del sistema en funcionamiento
* Documentación breve con fotos, materiales y conexiones

---

## 📅 9. **Cronograma sugerido**

| Día | Tarea                                         |
| --- | --------------------------------------------- |
| 1   | Diseño físico y maqueta del escenario         |
| 2   | Instalación de componentes electrónicos       |
| 3   | Programación de servos y sensor               |
| 4   | Programación de colisiones y sistema de vidas |
| 5   | Integración de pantalla y sonido              |
| 6   | Pruebas, mejoras y ajustes                    |
| 7   | Presentación o grabación del proyecto final   |

---

## 🧠 10. **Ideas futuras o mejoras (post-entrega)**

* Añadir más niveles o caminos alternativos
* Controlar a Mario con joystick o botones
* Crear una app móvil complementaria
* Integrar con Bluetooth o WiFi para ranking online

---


