from flask import Blueprint, request, jsonify, abort
from backend.models.metric import Metric
<<<<<<< HEAD
from backend.extensions import db
=======
from backend.models import db
>>>>>>> 9690f33 (chore: normalize imports, unify auth token handling, fix jwt-decode import, Vite port and misc fixes)

metric_routes = Blueprint("metric_routes", __name__)

# ==============================================================
# ENDPOINTS DE MÉTRICAS
# ==============================================================

@metric_routes.route("/api/sync/metric", methods=["POST"])
def sync_metric():
    """
    Crea o actualiza métricas de usuario (Pomodoro, foco, racha, etc.)
    """
    data = request.get_json()
    if not data:
        return abort(400, "Falta JSON en el body")

    user_sub = data.get("userSub")
    date = data.get("date")
    if not user_sub or not date:
        return abort(400, "Falta userSub o date")

    existing = Metric.query.filter_by(user_sub=user_sub, date=date).first()
    if existing:
        existing.focused_minutes_today = data.get("focusedMinutesToday", existing.focused_minutes_today)
        existing.streak_days = data.get("streakDays", existing.streak_days)
        existing.last_active_date = data.get("lastActiveDate", existing.last_active_date)
        db.session.commit()
        return jsonify({"status": "ok", "action": "updated", "metric": existing.to_dict()})
    else:
        m = Metric(
            user_sub=user_sub,
            date=date,
            focused_minutes_today=data.get("focusedMinutesToday", 0),
            streak_days=data.get("streakDays", 0),
            last_active_date=data.get("lastActiveDate", None)
        )
        db.session.add(m)
        db.session.commit()
        return jsonify({"status": "ok", "action": "created", "metric": m.to_dict()})
