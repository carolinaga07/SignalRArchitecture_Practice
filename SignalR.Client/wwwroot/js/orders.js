"use strict";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7001/orderHub")
    .withAutomaticReconnect()
    .build();

const updateButton = document.getElementById("updateButton");
const status = document.getElementById("status");
const orderIdInput = document.getElementById("orderIdInput");
const statusSelect = document.getElementById("statusSelect");
const ordersList = document.getElementById("ordersList");
const orderItems = new Map();

connection.on("OrderStatusChanged", (notificacion) => {
    let item = orderItems.get(notificacion.orderId);

    if (item) {
        item = document.createElement("li");
        orderItems.set(notificacion.orderId, item);
        ordersList.appendChild(item);
    }

    const time = new Date(notificacion.updatedAt).toLocaleTimeString();
    item.textContent = `Pedido #${notificacion.orderId}: ${notificacion.status} (${time})`;
});

connection.onreconnecting(() => {
    status.textContent = "Reconectando...";
    updateButton.disabled = true;
});

connection.onreconnected(() => {
    status.textContent = "Conectando";
    updateButton.disabled = false;
});

async function startConnection() {
    try {
        await connection.start();
        status.textContent = "Conectado";
        updateButton.disabled = false;
    } catch (error) {
        status.textContent = "Error de conexion";
        console.error(error);
    }
}

updateButton.addEventListener("click", async () => {
    const orderId = parseInt(orderIdInput.value, 10);
    if (!orderId || orderId <= 0) {
        alert("Escribe un numero de pedido valido");
        return;
    }

    try {
        await connection.invoke("UpdateOrderStatus", orderId, statusSelect.value);
    } catch (error) {
        console.error("No se pudo actualizar el pedido:", error);
    }
});

startConnection();