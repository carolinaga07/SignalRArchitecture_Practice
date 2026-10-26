# SignalRArchitecture_Practice

# Pasos para la Ejecución
Sigue estos pasos para compilar y ejecutar la solución en tu entorno local.

# Prerrequisitos
.NET 10 SDK o superior instalado.
Tu IDE de preferencia (Visual Studio 2022 / VS Code / JetBrains Rider).

# Instrucciones de Inicio
# 1. Clonar el repositorio:
git clone <URL_DE_TU_REPOSITORIO>
cd <NOMBRE_DE_TU_REPOSITORIO>

# 2. Restaurar y compilar la solución:
dotnet build SignalRArchitecture.slnx

# 3. Ejecutar el Servidor (SignalR.Hub):
Abre una terminal y ejecuta:
dotnet run --project SignalR.Hub --urls https://localhost:7001

# 4. Ejecutar el Cliente (SignalR.Client):
Abre una segunda terminal y ejecuta:
dotnet run --project SignalR.Client --urls https://localhost:7002
