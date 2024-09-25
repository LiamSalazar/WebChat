function connect() {
    // Asegúrate de que la URL incluya el contexto de la aplicación si es necesario
    ws = new WebSocket("ws://" + window.location.host + "/ChatMelodyFinderR3/chat");

    ws.onmessage = function(event) {
        if (typeof CryptoJS !== 'undefined') {
            try {
                // Asegúrate de que estás recibiendo el mensaje en forma de cadena cifrada
                var decryptedBytes = CryptoJS.AES.decrypt(event.data, "claveSecreta");
                var decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);

                if (decryptedMessage) {
                    var message = buildReceivedMessage(decryptedMessage);
                    conversation.appendChild(message);
                } else {
                    console.log("No se pudo descifrar el mensaje.");
                }
            } catch (e) {
                console.log("Error al descifrar:", e);
            }
        } else {
            console.log("CryptoJS no está cargado.");
        }
    };

    ws.onclose = function() {
        console.log("Conexión cerrada");
    };

    ws.onopen = function() {
        console.log("Conectado al servidor");
    };
}

function sendMessage() {
    var messageInput = document.getElementById("messageInput");
    var messageText = messageInput.value.trim();

    if (messageText) {
        if (typeof CryptoJS !== 'undefined') {
            try {
                // Asegúrate de que el mensaje se cifra antes de enviar
                var encryptedMessage = CryptoJS.AES.encrypt(messageText, "claveSecreta").toString();
                ws.send(encryptedMessage);
            } catch (e) {
                console.log("Error al cifrar:", e);
            }

            var messageElement = buildMessage(messageText); // Mostrar el mensaje no cifrado en la UI
            conversation.appendChild(messageElement);
            animateMessage(messageElement);
            conversation.scrollTop = conversation.scrollHeight;  // Asegura que el scroll se mueve al final
        } else {
            console.log("CryptoJS no está cargado.");
        }
    }

    messageInput.value = '';
}


function buildReceivedMessage(text) {
    var element = document.createElement('div');
    element.classList.add('message', 'received');
    element.innerHTML = text +
        '<span class="metadata">' +
            '<span class="time">' + moment().format('h:mm A') + '</span>' +
        '</span>';
    return element;
}


var deviceTime = document.querySelector('.status-bar .time');
var messageTime = document.querySelectorAll('.message .time');

deviceTime.innerHTML = moment().format('h:mm');

setInterval(function() {
	deviceTime.innerHTML = moment().format('h:mm');
}, 1000);

for (var i = 0; i < messageTime.length; i++) {
	messageTime[i].innerHTML = moment().format('h:mm A');
}

/* Message */

var form = document.querySelector('.conversation-compose');
var conversation = document.querySelector('.conversation-container');

form.addEventListener('submit', newMessage);

function newMessage(e) {
	var input = e.target.input;

	if (input.value) {
		var message = buildMessage(input.value);
		conversation.appendChild(message);
		animateMessage(message);
	}

	input.value = '';
	conversation.scrollTop = conversation.scrollHeight;

	e.preventDefault();
}

    function buildMessage(text) {
	var element = document.createElement('div');

	element.classList.add('message', 'sent');

	element.innerHTML = text +
		'<span class="metadata">' +
			'<span class="time">' + moment().format('h:mm A') + '</span>' +
			'<span class="tick tick-animation">' +
                                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck" x="2047" y="2061"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#92a58c"/></svg>' +
                                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7"/></svg>' +
                            '</span>' +
                    '</span>';

        return element;
    }

function animateMessage(message) {
	setTimeout(function() {
		var tick = message.querySelector('.tick');
		tick.classList.remove('tick-animation');
	}, 500);
}


// La carga de CryptoJS se mueve al inicio para asegurar que esté disponible
var script = document.createElement('script');
script.onload = function() {
    connect(); // Esta es la llamada a connect.
};
script.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js";
document.head.appendChild(script);
