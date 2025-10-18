from flask import Blueprint, jsonify
from backend.models import Task
from datetime import datetime, timedelta

week_routes = Blueprint("week_routes", __name__)

# ==============================================================
# ENDPOINTS DE TAREAS DE LA SEMANA
# ==============================================================

@week_routes.route("/api/tasks/week/<user_sub>", methods=["GET"])
def get_week_tasks(user_sub):
    """
    Devuelve las tareas programadas dentro de los próximos 7 días.
    """
    today = datetime.utcnow().date()
    end_week = today + timedelta(days=7)
    tasks = Task.query.filter_by(user_sub=user_sub, deleted=False).all()
    result = []

    for t in tasks:
        if t.due_date:
            try:
                due = datetime.fromisoformat(t.due_date).date()
                if today <= due <= end_week:
                    result.append(t.to_dict())
            except Exception:
                continue

    return jsonify({"count": len(result), "tasks": result})
