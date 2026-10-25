"use strict";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7001/chatHub")
    .withAutomaticReconnect()
    .build();

const sendButton = document.getElementById("sendButton");
const status = document.getElementById("status");
const userInput = document.getElementById("userInput");
const messageInput = document.getElementById("messageInput");
const messagesList = document.getElementById("messageList");
const roomSelect = document.getElementById("roomSelect");

async function joinRoom() {
    await connection.invoke("JoinRoom", roomSelect.value);
}

if (!sendButton || !status || !userInput || !messageInput || !messagesList) {
    throw new Error("Faltan elementos del chat en la página.");
}

connection.on("ReceiveMessage", (message) => {
    const item = document.createElement("li");
    const time = new Date(message.sentAt).toLocaleTimeString();
    item.textContent = `[${time}] ${message.user}: ${message.message}`;
    messagesList.appendChild(item);
});

connection.onreconnecting(() => {
    status.textContent = "Reconectando...";
    sendButton.disabled = true;
});

connection.onreconnected( async () => {
    status.textContent = "Conectado";
    sendButton.disabled = false;
    await joinRoom();
});

async function startConnection() {
    try {
        await connection.start();
        await joinRoom();
        status.textContent = "Conectado";
        sendButton.disabled = false;
    } catch (error) {
        status.textContent = "Error de conexión";
        console.error(error);
    }
}

sendButton.addEventListener("click", async () => {
    const user = userInput.value.trim();
    const message = messageInput.value.trim();

    if (!user || !message) {
        alert("Completa el usuario y el mensaje.");
        return;
    }

    if (connection.state !== signalR.HubConnectionState.Connected) {
        alert("No existe una conexión activa.");
        return;
    }

    try {
        await connection.invoke("SendMessage", user, message);
        messageInput.value = "";
    } catch (error) {
        console.error("No se pudo enviar el mensaje:", error);
    }
});

startConnection();