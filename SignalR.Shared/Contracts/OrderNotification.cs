using System;
using System.Collections.Generic;
using System.Text;

namespace SignalR.Shared.Contracts;

public sealed record OrderNotification(
    int OrderId,
    string Status,
    DateTimeOffset UpdateAt);

