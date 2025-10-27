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

- Node.js (LTS recomendado: v18 o v20)
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

Nota: si estás usando Husky para hooks, ejecuta:

```bash
# Prepara los hooks (ejecuta el script `prepare` que agrega los hooks de Husky)
npm run prepare
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
   - Credenciales de Firebase (desde tu consola de Firebase)
   - Configuración de correo (opcional)

⚠️ IMPORTANTE: Seguridad de las Credenciales
- NUNCA subas el archivo `.env` al repositorio
- NUNCA compartas las credenciales en chats o correos
- Rota las credenciales periódicamente
- Usa credenciales diferentes para desarrollo y producción

Variables requeridas en `.env`:
```bash
# Firebase (requerido) - usa estos nombres de variables; sustituye los valores en tu `.env` local
# Ejemplo (valores reemplazados por <REDACTED> para evitar exponer secrets en el README)
VITE_FIREBASE_API_KEY=<REDACTED_FIREBASE_API_KEY>
VITE_FIREBASE_AUTH_DOMAIN=<REDACTED_FIREBASE_AUTH_DOMAIN>
VITE_FIREBASE_PROJECT_ID=<REDACTED_FIREBASE_PROJECT_ID>
VITE_FIREBASE_STORAGE_BUCKET=<REDACTED_FIREBASE_STORAGE_BUCKET>
VITE_FIREBASE_MESSAGING_SENDER_ID=<REDACTED_FIREBASE_MESSAGING_SENDER_ID>
VITE_FIREBASE_APP_ID=<REDACTED_FIREBASE_APP_ID>

# Correo (opcional) - sustituye por tus credenciales locales
MAIL_PASSWORD=<REDACTED_MAIL_PASSWORD>
MAIL_USERNAME=<REDACTED_MAIL_USERNAME>
MAIL_DEFAULT_SENDER=<REDACTED_MAIL_DEFAULT_SENDER>
```

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

## 🔒 Seguridad

### Protección de Credenciales
1. Usa `.env` para variables sensibles (nunca subir al repositorio)
2. Mantén `.env.example` como plantilla (sin valores reales)
3. Rota las credenciales periódicamente
4. Usa diferentes credenciales para desarrollo y producción

### Configuración de GitHub
1. Habilita la autenticación de dos factores (2FA) en tu cuenta
2. Configura la protección de la rama main:
   - Ve a Settings > Branches
   - Añade regla para 'main'
   - Activa "Require pull request reviews"
   - Desactiva "Allow force pushes"
3. Habilita la detección de secretos:
   - Settings > Security > Code security and analysis
   - Activa "Secret scanning"

### Pre-commit Hooks
Usa pre-commit hooks para prevenir subir secretos:
```bash
# Instalar husky
npm install husky --save-dev
npm install detect-secrets --save-dev

# Configurar hook
npx husky add .husky/pre-commit "npx detect-secrets --scan"
```

Nota: tras instalar dependencias ejecuta `npm run prepare` para que Husky instale los hooks localmente.

Recomendación: usa la versión LTS de Node (v18 o v20) para evitar incompatibilidades con dependencias.

## 🤝 Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu función: `git checkout -b feature/NuevaFuncion`
3. Commit tus cambios: `git commit -am 'Añadir nueva función'`
4. Asegúrate de no incluir credenciales o secretos
5. Crea un pull request a la rama main
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
