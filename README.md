# marioflash

![boceto](marioflahs.jpg)

Perfecto 🚀, entonces vamos a precisar en tu **PRD** el requisito de comunicación con **Arduino Esplora**, aclarando que los datos viajan por un puerto COM (ej. COM12), pasan por un **servidor Node.js** usando **p5.serialport**, y de ahí se muestran en el navegador.

Aquí te actualizo el PRD con ese detalle técnico:

---

# 📝 PRD – Escenario Interactivo de Mario Bros con Arduino Esplora

---

## 📌 1. Nombre del proyecto

**Mini Escenario de Mario Bros con Obstáculos Interactivos (Arduino Esplora + Navegador Web)**

---

## 🎯 2. Objetivo del proyecto

Diseñar y construir un escenario físico inspirado en el videojuego *Mario Bros*, con obstáculos interactivos y un sistema de comunicación que permita recibir datos desde **Arduino Esplora** a través de un **puerto COM** (ej. COM12). Dichos datos serán procesados en un **servidor Node.js con p5.serialport** y enviados al navegador para visualizar y complementar la experiencia interactiva.

---

## 👨‍🏫 3. Justificación

Además de la parte física y electrónica, este proyecto integra un **flujo de datos en tiempo real entre hardware y navegador**, fomentando el aprendizaje de **IoT básico, Node.js y p5.js** junto con programación en Arduino.

---

## 🧩 4. Componentes funcionales

### 4.1 Hardware

* Arduino Esplora (control y captura de datos por sensores integrados)
* Servos, sensores externos, LEDs, buzzer, pantalla LCD/OLED
* Fuente de energía y estructura física

### 4.2 Software

* **Arduino IDE** (código del Esplora)
* **Node.js** (servidor intermedio de comunicación)
* **p5.serialport** (librería para gestionar el puerto serie en Node.js y enviar datos al navegador)
* **p5.js** en navegador (interfaz visual y lógica del juego)
* Librerías Arduino: `Servo.h`, `LiquidCrystal.h`, `Esplora.h`

---

## 🛠️ 5. Funciones clave

| **Función**                      | **Descripción**                                        |
| -------------------------------- | ------------------------------------------------------ |
| Movimiento de obstáculos físicos | Servo motores controlados por Arduino Esplora          |
| Detección de colisión            | Sensor en Esplora o sensor externo (ej. ultrasónico)   |
| Sistema de vidas                 | LEDs y pantalla muestran estado                        |
| Comunicación serie               | Esplora envía datos por **puerto COM (ej. COM12)**     |
| Servidor intermedio              | Node.js con **p5.serialport** recibe datos del Esplora |
| Visualización en navegador       | p5.js muestra puntuación, vidas y estado del nivel     |
| Sonido/efectos visuales          | LEDs, buzzer y mensajes en pantalla y navegador        |

---

## 🎮 6. Interacción del usuario

* El usuario mueve físicamente a Mario por el escenario.
* El Esplora envía datos de sensores (movimiento, botones, etc.) vía **COM12**.
* Node.js procesa esos datos y los transmite al navegador con **p5.serialport**.
* El navegador refleja los eventos del juego (vidas, colisiones, victoria).

---

## 📈 7. Criterios de éxito

✅ Arduino Esplora transmite datos vía puerto serie.
✅ Node.js con p5.serialport recibe y procesa datos.
✅ Navegador (p5.js) visualiza vidas, colisiones y estados en tiempo real.
✅ Al menos un obstáculo físico responde a los datos recibidos.

---

## 📦 8. Entregables

* Código Arduino (Esplora)
* Código Node.js (servidor con p5.serialport)
* Código navegador (p5.js para interfaz)
* Esquema eléctrico
* Video/demostración del flujo completo **hardware → Node.js → navegador**

---

## 📅 9. Cronograma sugerido

| **Día** | **Tarea**                                      |
| ------- | ---------------------------------------------- |
| 1       | Diseño de maqueta y pruebas Esplora en COM     |
| 2       | Instalación de componentes electrónicos        |
| 3       | Programación básica Esplora (lectura de datos) |
| 4       | Configuración Node.js + p5.serialport          |
| 5       | Interfaz en navegador con p5.js                |
| 6       | Integración completa y pruebas                 |
| 7       | Presentación/grabación final                   |

---

## 🧠 10. Ideas futuras

* Control inalámbrico con **Bluetooth/WiFi** en vez de COM.
* Dashboard web con estadísticas de partidas.
* Integración con móviles vía WebUSB/WebSerial.

---


---


