from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
<<<<<<< HEAD
from backend.extensions import db
from backend.models import Task
=======
from backend.models import db, Task
>>>>>>> 9690f33 (chore: normalize imports, unify auth token handling, fix jwt-decode import, Vite port and misc fixes)
from flask_mail import Message

reminder_routes = Blueprint("reminder", __name__)

@reminder_routes.route("/api/reminder/email", methods=["POST"])
def send_task_reminder():
    data = request.get_json()
    if not data or "email" not in data or "userSub" not in data:
        return jsonify({"error": "Faltan campos obligatorios: email y userSub"}), 400

    email = data["email"]
    user_sub = data["userSub"]
    days_ahead = int(data.get("daysAhead", 1))

    today = datetime.utcnow().date()
    upcoming_tasks = []

    tasks = Task.query.filter_by(user_sub=user_sub, deleted=False).all()
    for t in tasks:
        if t.due_date:
            try:
                due = datetime.fromisoformat(t.due_date).date()
                if (due - today).days <= days_ahead and t.status != "done":
                    upcoming_tasks.append(t)
            except Exception:
                continue

    if not upcoming_tasks:
        return jsonify({"message": "No hay tareas próximas a vencer."}), 200

    task_lines = "\n".join([f"- {t.title} (vence: {t.due_date or 'sin fecha'})" for t in upcoming_tasks])
    body = f"Hola 👋\n\nEstas son tus tareas próximas a vencer:\n\n{task_lines}\n\n¡No lo dejes para después!\n\n— PWA Organizador de Tareas"

    try:
        msg = Message(
            subject="📅 Recordatorio de tus tareas próximas a vencer",
            recipients=[email],
            body=body
        )
        current_app.extensions['mail'].send(msg)
        return jsonify({"status": "ok", "sent": len(upcoming_tasks), "email": email})
    except Exception as e:
        print(f"Error enviando correo: {e}")
        return jsonify({"error": "Error al enviar el correo"}), 500
