let modalGame = document.getElementById("modalJuego");
let span = document.getElementsByClassName("close")[0];
let juegoPelota = document.getElementById("juegoPelota");
let juegoSnake = document.getElementById("juegoSnake");
let intervalo;
let botonReinicio;
let ultimoMovimiento = 0;

let btnPelota = document.getElementById("btnPelota");
let btnSnake = document.getElementById("btnSnake");


span.onclick = function () {
    modalGame.style.display = "none";
    clearInterval(intervalo);
    if (botonReinicio) {
        botonReinicio.style.display = "none";
    }
}

window.onclick = function (event) {
    if (event.target == modalGame) {
        modalGame.style.display = "none";
        clearInterval(intervalo);
        if (botonReinicio) {
            botonReinicio.style.display = "none";
        }
    }
}


btnPelota.onclick = function () {
    juegoPelota.style.display = "block";
    juegoSnake.style.display = "none";
    iniciarJuego();
}

btnSnake.onclick = function () {
    juegoPelota.style.display = "none";
    juegoSnake.style.display = "block";
    iniciarJuegoSnake();
}

function iniciarJuego() {
    modalGame.style.display = "block";
    let pelota = document.getElementById("pelota");
    let barra = document.getElementById("barra");
    let juego = document.querySelector(".juego");
    let puntos = document.getElementById("puntos");
    let puntuacion = 0;
    let x = juego.offsetWidth / 2;
    let y = juego.offsetHeight / 2;
    let dx = 2;
    let dy = -2;
    let incrementoVelocidad = 0.5;

    // Reinicia la posición de la pelota y la barra
    pelota.style.left = x + "px";
    pelota.style.top = y + "px";
    barra.style.left = (juego.offsetWidth / 2 - barra.offsetWidth / 2) + "px";

    puntos.textContent = puntuacion;

    if (botonReinicio) {
        botonReinicio.style.display = "none";
    }

    juego.onmousemove = function (event) {
        let ahora = Date.now();
        if (ahora - ultimoMovimiento > 30) {  // Actualiza la posición cada 50ms
            let juegoRect = juego.getBoundingClientRect();
            let nuevaX = event.clientX - juegoRect.left;
            if (nuevaX > 0 && nuevaX < juego.offsetWidth - barra.offsetWidth) {
                barra.style.left = nuevaX + "px";
            }
            ultimoMovimiento = ahora;
        }
    };

    function moverPelota() {
        if (x + dx > juego.offsetWidth - pelota.offsetWidth || x + dx < 0) {
            dx = -dx;
        }
        if (y + dy < 0) {
            dy = -dy;
        } else if (y + dy > juego.offsetHeight - pelota.offsetHeight) {
            // Comprueba si la pelota está en contacto con la barra
            if (x + pelota.offsetWidth > barra.offsetLeft && x < barra.offsetLeft + barra.offsetWidth && y + pelota.offsetHeight >= juego.offsetHeight - barra.offsetHeight) {
                dy = -dy;
                y = juego.offsetHeight - pelota.offsetHeight - barra.offsetHeight;  // Ajusta la posición de la pelota
                dx = (Math.random() * 4) - 2;  // Cambia la dirección horizontal de forma aleatoria
                puntuacion++;
                puntos.textContent = puntuacion;

                // Aumenta la velocidad de la pelota
                dx += (dx > 0 ? incrementoVelocidad : -incrementoVelocidad);
                dy -= incrementoVelocidad;
            } else {
                clearInterval(intervalo);
                alert("¡Juego terminado! Puntuación: " + puntuacion);
                mostrarBotonReinicio();
            }
        }
        x += dx;
        y += dy;
        pelota.style.left = x + "px";
        pelota.style.top = y + "px";
    }



    intervalo = setInterval(moverPelota, 20);
}

function iniciarJuegoSnake() {
    let canvas = document.getElementById("canvasSnake");
    canvas.width = 300; // Establece el ancho del lienzo
    canvas.height = 300; // Establece el alto del lienzo
    let ctx = canvas.getContext("2d");
    let snake = [{ x: 150, y: 150 }, { x: 140, y: 150 }, { x: 130, y: 150 }, { x: 120, y: 150 }, { x: 110, y: 150 }];
    let dx = 10;
    let dy = 0;
    let comida = { x: 0, y: 0 };
    let puntuacion = 0;
    clearInterval(intervalo);
    crearComida();
    document.addEventListener("keydown", cambiarDireccion);
    intervalo = setInterval(moverSnake, 100);

    function dibujarParte(part) {
        ctx.fillStyle = "#20A789";  // Cambia el color de la serpiente aquí
        ctx.fillRect(part.x, part.y, 10, 10);
        ctx.strokeRect(part.x, part.y, 10, 10);
    }


    function dibujarSnake() {
        snake.forEach(dibujarParte);
    }

    function moverSnake() {
        let cabeza = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(cabeza);
        if (cabeza.x === comida.x && cabeza.y === comida.y) {
            puntuacion += 10;
            document.getElementById("puntos").textContent = puntuacion;
            crearComida();
        } else {
            snake.pop();
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dibujarSnake();
        dibujarComida();
        verificarColision();
    }

    function cambiarDireccion(event) {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;
        const keyPressed = event.keyCode;
        const irArriba = dy === -10;
        const irAbajo = dy === 10;
        const irDerecha = dx === 10;
        const irIzquierda = dx === -10;
        if (keyPressed === LEFT_KEY && !irDerecha) {
            dx = -10;
            dy = 0;
        }
        if (keyPressed === UP_KEY && !irAbajo) {
            dx = 0;
            dy = -10;
        }
        if (keyPressed === RIGHT_KEY && !irIzquierda) {
            dx = 10;
            dy = 0;
        }
        if (keyPressed === DOWN_KEY && !irArriba) {
            dx = 0;
            dy = 10;
        }
    }

    function randomTen(min, max) {
        return Math.round((Math.random() * (max - min) + min) / 10) * 10;
    }

    function crearComida() {
        comida.x = randomTen(0, canvas.width - 10);
        comida.y = randomTen(0, canvas.height - 10);
        snake.forEach(function (part) {
            if (part.x === comida.x && part.y === comida.y) crearComida();
        });
    }

    function dibujarComida() {
        ctx.fillStyle = "red";
        ctx.fillRect(comida.x, comida.y, 10, 10);
    }

    function verificarColision() {
        for (let i = 4; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) finJuego();
        }
        if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height) finJuego();
    }

    function finJuego() {
        clearInterval(intervalo);
        alert("¡Juego terminado! Puntuación: " + puntuacion);
        mostrarBotonReinicio();
    }
}


function mostrarBotonReinicio() {
    if (!botonReinicio) {
        botonReinicio = document.createElement("button");
        botonReinicio.classList.add('btn-game')
        botonReinicio.textContent = "Volver a jugar";
        document.querySelector(".modal-content-game").appendChild(botonReinicio);
    }
    botonReinicio.style.display = "block";
    botonReinicio.onclick = function () {
        if (juegoPelota.style.display === "block") {
            iniciarJuegoPelota();
        } else if (juegoSnake.style.display === "block") {
            iniciarJuegoSnake();
        }
    };
}

function toggleUniqueAlert(message = null) {
    const alert = document.getElementById("unique-alert");
    const alertText = document.getElementById("unique-alert-text");

    if (message) {
        alertText.innerHTML = message;
    }

    if (alert.classList.contains("unique-show")) {
        alert.classList.remove("unique-show");
    } else {
        alert.classList.add("unique-show");
    }
}

function toggleChat() {
    const body = document.getElementById('chatbot-body');
    body.classList.toggle('active');

    const container = document.querySelector(".chatbot-container");
    container.classList.toggle("active");
}


function handleInput(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
}

const appendBotMessageAnimated = (sender, fullText) => {
    const chatBox = document.getElementById('chat-messages');
    const msg = document.createElement('div');
    msg.className = 'chat-message bot';

    const strong = document.createElement('strong');
    strong.textContent = ``;

    const textContainer = document.createElement('span');
    msg.appendChild(strong);
    msg.appendChild(textContainer);

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;

    let index = 0;

    const typeWriter = () => {
        if (index < fullText.length) {
            textContainer.textContent += fullText.charAt(index);
            index++;
            chatBox.scrollTop = chatBox.scrollHeight; // mantiene scroll abajo
            setTimeout(typeWriter, 20); // velocidad del efecto
        }
    };

    typeWriter();
};


const sendMessage = async () => {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    const hostname = location.origin
    const sid = unaBase.sid.encoded()
    if (!message) return;

    appendMessage('Tú', message);
    input.value = '';

    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'chat-message bot';
    loadingMsg.innerHTML = `
                            <div class="chat-message-text">
  <span class="chat-loader-inline">
    <span></span><span></span><span></span>
  </span>
</div>

                            `;

    const chatBox = document.getElementById('chat-messages');
    chatBox.appendChild(loadingMsg);
    chatBox.scrollTop = chatBox.scrollHeight;


    try {
        const response = await fetch('https://devbase.unabase.com/node/chat-ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message, hostname, sid })
        });

        const data = await response.json();
        loadingMsg.remove();

        appendBotMessageAnimated('', data.response || '⚠️ Error al procesar respuesta.');

    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        loadingMsg.remove();
        appendMessage('', '❌ Ocurrió un error al conectar con el servidor.');
    }
};



const appendMessage = (sender, text) => {
    const chatBox = document.getElementById('chat-messages');
    const msg = document.createElement('div');

    // Aplica clases según el remitente
    const isUser = sender.toLowerCase() === 'tú' || sender.toLowerCase() === 'you';
    msg.className = `chat-message ${isUser ? 'user' : 'bot'}`;

    // Opcional: puedes ocultar el nombre si quieres estilo más "WhatsApp"
    msg.innerHTML = `<div>${text}</div>`;

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msg;
};