using Microsoft.AspNetCore.SignalR;
using SignalR.Shared.Contracts;

namespace SignalR.Hub.Hubs;

public sealed class OrderHub : Microsoft.AspNetCore.SignalR.Hub
{
    public async Task UpdateOrderStatus(int orderId, string status)
    {
        if(orderId <= 0)
        {
            throw new HubException("El numero de pedido no es valido");
        }

        if(!Enum.TryParse<OrderStatus>(status, out var newStatus ) ||
            !Enum.IsDefined(newStatus))
        {
            throw new HubException("El estado del pedido no es valido");
        }
        var notificacion = new OrderNotification(orderId,
            newStatus.ToString(),
            DateTimeOffset.UtcNow);
        await Clients.All.SendAsync("OrderStatusChanged", notificacion);
    }
}
