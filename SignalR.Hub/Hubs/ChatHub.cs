using Microsoft.AspNetCore.SignalR;
using SignalR.Shared.Contracts;

namespace SignalR.HubServer.Hubs;

public sealed class ChatHub: Microsoft.AspNetCore.SignalR.Hub
{
    public async Task SendMessage(string user, string message)
    {
        if(string.IsNullOrWhiteSpace(user) || string.IsNullOrWhiteSpace(message))
        {
            throw new HubException("El usuario y el mensaje son obligatorios.");
        }

        user = user.Trim();
        message = message.Trim();

        if(user.Length > 40 || message.Length > 1000)
        {
            throw new HubException("El mensaje supera el limite permitido");
        }

        var chatMessage = new ChatMessage(user, message, DateTimeOffset.UtcNow);

        await Clients.All.SendAsync("ReceiveMessage", chatMessage);

    }

    public async Task JoinRoom(string room)
    {
        if(string.IsNullOrWhiteSpace(room) || room.Length > 40)
        {
            throw new HubException("La sala no es valida");
        }
        await Groups.AddToGroupAsync(Context.ConnectionId, room.Trim());
    }

    public async Task SendMessageToRoom(string room, string user, string message)
    {
        if(string.IsNullOrWhiteSpace(room) ||
            string.IsNullOrWhiteSpace(user) ||
            string.IsNullOrWhiteSpace(message))
        {
            throw new HubException("La sala, el usuario y el mensaje son obligatorios");
        }
        user = user.Trim();
        message = message.Trim();

        if(user.Length > 40 || message.Length > 1000)
        {
            throw new HubException("El mensaje supera el limite permitido.");
        }

        var chatMessage = new ChatMessage(user, message, DateTimeOffset.UtcNow);
        await Clients.Group(room.Trim()).SendAsync("ReceiveMessage", chatMessage);
    }
}
