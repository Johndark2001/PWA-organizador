from flask import Blueprint, request, jsonify, abort
from datetime import datetime
<<<<<<< HEAD
from backend.extensions import db
from backend.models import Task, Metric
=======
from backend.models import db, Task, Metric
>>>>>>> 9690f33 (chore: normalize imports, unify auth token handling, fix jwt-decode import, Vite port and misc fixes)
from backend.auth import verify_token

sync_routes = Blueprint("sync", __name__)

@sync_routes.route("/api/sync/task", methods=["POST"])
def sync_task():
    data = request.get_json()
    if not data:
        return abort(400, "Falta JSON en el body")

    # Si hay token en Authorization, intentar verificar y extraer userSub
    auth_header = request.headers.get("Authorization")
    token_payload = None
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1]
        token_payload = verify_token(token)

    if data.get("deleted"):
        t = Task.query.get(data.get("id"))
        if t:
            db.session.delete(t)
            db.session.commit()
            return jsonify({"status": "ok", "action": "deleted", "id": data.get("id")})
        return jsonify({"status": "ok", "action": "not_found", "id": data.get("id")})

    task_id = data.get("id")
    if not task_id:
        return abort(400, "El payload debe incluir 'id'")

    now_iso = data.get("updatedAt") or datetime.utcnow().isoformat()
    existing = Task.query.get(task_id)

    if existing:
        existing.title = data.get("title", existing.title)
        existing.scope = data.get("scope", existing.scope)
        existing.priority = data.get("priority", existing.priority)
        existing.due_date = data.get("dueDate", existing.due_date)
        existing.estimated_minutes = data.get("estimatedMinutes", existing.estimated_minutes)
        existing.status = data.get("status", existing.status)
        existing.important = bool(data.get("important", existing.important))
        existing.urgent = bool(data.get("urgent", existing.urgent))
        existing.updated_at = now_iso
        db.session.commit()
        return jsonify({"status": "ok", "action": "updated", "task": existing.to_dict()})
    else:
        # Si no viene userSub en el payload, intentar obtenerlo del token verificado
        inferred_user = data.get("userSub") or (token_payload.get("sub") if token_payload else None) or (token_payload.get("email") if token_payload else None) or "unknown"
        new_task = Task(
            id=task_id,
            uuid=data.get("uuid") or task_id,
            user_sub=inferred_user,
            title=data.get("title", "Tarea"),
            scope=data.get("scope"),
            priority=data.get("priority"),
            due_date=data.get("dueDate"),
            estimated_minutes=data.get("estimatedMinutes") or 0,
            status=data.get("status") or "pending",
            important=bool(data.get("important", False)),
            urgent=bool(data.get("urgent", False)),
            created_at=data.get("createdAt") or datetime.utcnow().isoformat(),
            updated_at=now_iso,
            deleted=False
        )
        db.session.add(new_task)
        db.session.commit()
        return jsonify({"status": "ok", "action": "created", "task": new_task.to_dict()})

@sync_routes.route("/api/sync/metric", methods=["POST"])
def sync_metric():
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
