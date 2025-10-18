# ==============================================================
# Inicialización del paquete models
# ==============================================================

<<<<<<< HEAD
# Nota: no importamos `db` aquí para evitar importaciones circulares.
# El objeto `db` se crea en `backend.app` y los módulos que necesiten
# acceder a la instancia deben importarlo desde `backend.app`.
=======
from backend.app import db
from .task import Task
from .metric import Metric
from .pomodoro import PomodoroSession
from .tag import Tag  # 👈 nuevo modelo Tag
>>>>>>> 9690f33 (chore: normalize imports, unify auth token handling, fix jwt-decode import, Vite port and misc fixes)

from .task import Task
from .metric import Metric
from .pomodoro import PomodoroSession
from .tag import Tag

__all__ = ["Task", "Metric", "PomodoroSession", "Tag"]
