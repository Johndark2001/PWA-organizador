from flask import Blueprint, request, jsonify, abort
from datetime import datetime
<<<<<<< HEAD
from backend.extensions import db
from backend.models import PomodoroSession
=======
from backend.models import db, PomodoroSession
>>>>>>> 9690f33 (chore: normalize imports, unify auth token handling, fix jwt-decode import, Vite port and misc fixes)

pomodoro_routes = Blueprint("pomodoro", __name__)

@pomodoro_routes.route("/api/pomodoro/sync", methods=["POST"])
def sync_pomodoro():
    data = request.get_json()
    if not data:
        return abort(400, "Falta JSON")

    p = PomodoroSession(
        user_sub=data.get("userSub"),
        task_id=data.get("taskId"),
        start_time=data.get("startTime", datetime.utcnow().isoformat()),
        end_time=data.get("endTime", datetime.utcnow().isoformat()),
        duration=data.get("duration", 25),
        completed=bool(data.get("completed", True))
    )
    db.session.add(p)
    db.session.commit()
    return jsonify({"status": "ok", "session": p.to_dict()})
