# ==============================================================
#  Inicialización del paquete routes
# ==============================================================

from backend.routes.sync import sync_routes
from backend.routes.pomodoro import pomodoro_routes
from backend.routes.reminder import reminder_routes
from backend.routes.eisenhower import eisenhower_routes
from backend.routes.tag_routes import tag_routes
from backend.routes.main import main_routes
from backend.routes.metric import metric_routes
from backend.routes.week import week_routes

# Registro agrupado (opcional, si deseas importar todos juntos)
all_routes = [
    main_routes,
    sync_routes,
    metric_routes,
    pomodoro_routes,
    reminder_routes,
    week_routes,
    eisenhower_routes,
    tag_routes,
]

__all__ = [
    "main_routes",
    "sync_routes",
    "metric_routes",
    "pomodoro_routes",
    "reminder_routes",
    "week_routes",
    "eisenhower_routes",
    "tag_routes",
    "all_routes"
]
