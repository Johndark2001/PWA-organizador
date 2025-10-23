# PWA Organizador de Tareas

Aplicación web progresiva (PWA) para organización de tareas, con características de gestión de tiempo Pomodoro, matriz de Eisenhower y sincronización offline.

## 🚀 Enlace de Descarga

Puedes descargar el código fuente desde:
https://github.com/Johndark2001/PWA-organizador

## ⬇️ Descarga directa (ZIP)

Si quieres descargar el proyecto como un archivo ZIP (rama main), usa este enlace:

https://github.com/Johndark2001/PWA-organizador/archive/refs/heads/main.zip

Nota: si publicas releases, también puedes enlazar el ZIP de una versión específica desde la página de "Releases" en GitHub (botón "Source code (zip)").

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- Python (v3.8 o superior)
- Git

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Johndark2001/PWA-organizador.git
cd PWA-organizador
```

### 2. Configurar el Frontend

```bash
# Instalar dependencias del frontend
npm install

# Crear archivo .env con las credenciales de Firebase
# (Usar .env.example como plantilla)
copy .env.example .env
```

### 3. Configurar el Backend

```bash
# Crear y activar entorno virtual
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate # Linux/macOS

# Instalar dependencias del backend
cd backend
pip install -r requirements.txt
```

### 4. Configurar Variables de Entorno

1. Renombra `.env.example` a `.env`
2. Completa las variables en el archivo `.env`:
   - Credenciales de Firebase
   - Configuración de correo (opcional)

### 5. Iniciar la Aplicación

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
python app.py
```

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🛠️ Características

- ✅ Gestión de tareas con sincronización offline
- ⏱️ Temporizador Pomodoro
- 📊 Matriz de Eisenhower
- 🏷️ Etiquetas personalizables
- 📅 Vista semanal
- 🔄 Sincronización con la nube
- 🔐 Autenticación con Google

## 📱 PWA - Instalación como Aplicación

1. Abre el sitio en Chrome/Edge: http://localhost:5173
2. Busca el icono de instalación en la barra de direcciones (💠)
3. Haz clic en "Instalar aplicación"
4. La app se instalará en tu dispositivo como una aplicación nativa

## 🤝 Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu función: `git checkout -b feature/NuevaFuncion`
3. Commit tus cambios: `git commit -am 'Añadir nueva función'`
4. Push a la rama: `git push origin feature/NuevaFuncion`
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🎯 Resolución de Problemas

### Error de conexión con el backend
- Verifica que el servidor Python esté corriendo
- Comprueba que el puerto 5000 esté libre
- Revisa los logs del servidor en la terminal

### Problemas de autenticación
- Verifica las credenciales en el archivo .env
- Asegúrate de que localhost esté autorizado en Firebase Console
- Revisa la consola del navegador para errores específicos

### Error al iniciar el frontend
- Elimina node_modules y package-lock.json
- Ejecuta npm install nuevamente
- Verifica que todas las variables de entorno estén definidas
