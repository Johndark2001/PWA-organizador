from flask import Blueprint, jsonify
from datetime import datetime, timedelta
from backend.models import Task

eisenhower_routes = Blueprint("eisenhower", __name__)

@eisenhower_routes.route("/api/tasks/eisenhower/<user_sub>", methods=["GET"])
def get_eisenhower_matrix(user_sub):
    tasks = Task.query.filter_by(user_sub=user_sub, deleted=False).all()
    matrix = {
        "important_urgent": [],
        "important_not_urgent": [],
        "not_important_urgent": [],
        "not_important_not_urgent": [],
    }

    for t in tasks:
        if t.important and t.urgent:
            matrix["important_urgent"].append(t.to_dict())
        elif t.important and not t.urgent:
            matrix["important_not_urgent"].append(t.to_dict())
        elif not t.important and t.urgent:
            matrix["not_important_urgent"].append(t.to_dict())
        else:
            matrix["not_important_not_urgent"].append(t.to_dict())

    return jsonify(matrix)

@eisenhower_routes.route("/api/tasks/week/<user_sub>", methods=["GET"])
def get_week_tasks(user_sub):
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
