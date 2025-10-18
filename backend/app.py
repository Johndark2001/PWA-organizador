from flask import Flask
from flask_cors import CORS
import os

from backend.extensions import db, mail

# ==============================================================
# CONFIGURACIÓN BASE
# ==============================================================

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173"]}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "data.db")

app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_PATH}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Configuración de correo
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME", "tucorreo@gmail.com")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD", "tu_contraseña_app")
app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_DEFAULT_SENDER", "tucorreo@gmail.com")

# Inicializar extensiones
db.init_app(app)
mail.init_app(app)

# ==============================================================
# IMPORTAR MODELOS (asegura que SQLAlchemy los registre)
# ==============================================================

<<<<<<< HEAD
=======
from backend.models.task import Task
from backend.models.metric import Metric
from backend.models.pomodoro import PomodoroSession
from backend.models.tag import Tag

# Crear tablas si no existen
>>>>>>> 9690f33 (chore: normalize imports, unify auth token handling, fix jwt-decode import, Vite port and misc fixes)
with app.app_context():
    # Importar modelos después de inicializar `db` para evitar import cycles
    from backend.models.task import Task
    from backend.models.metric import Metric
    from backend.models.pomodoro import PomodoroSession
    from backend.models.tag import Tag

    # Crear tablas si no existen
    db.create_all()

# ==============================================================
# IMPORTAR RUTAS
# ==============================================================

from backend.routes.sync import sync_routes
from backend.routes.pomodoro import pomodoro_routes
from backend.routes.reminder import reminder_routes
from backend.routes.eisenhower import eisenhower_routes
from backend.routes.tag_routes import tag_routes
from backend.routes.main import main_routes
from backend.routes.metric import metric_routes
from backend.routes.week import week_routes

# ==============================================================
# REGISTRO DE BLUEPRINTS
# ==============================================================

# Agrega solo las rutas que EXISTEN
all_routes = [
    sync_routes,
    pomodoro_routes,
    reminder_routes,
    eisenhower_routes,
    tag_routes,
    main_routes,
    metric_routes,
    week_routes
]

for route in all_routes:
    app.register_blueprint(route)

# ==============================================================
# RUTA RAÍZ
# ==============================================================

@app.route("/", methods=["GET"])
def index():
    return {"status": "ok", "message": "Backend PWA Organizador activo"}, 200

# ==============================================================
# RUN SERVER
# ==============================================================

if __name__ == "__main__":
    app.run(debug=True, port=5000)
