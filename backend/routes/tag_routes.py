from flask import Blueprint, request, jsonify, abort
<<<<<<< HEAD
from backend.extensions import db
=======
from backend.models import db
>>>>>>> 9690f33 (chore: normalize imports, unify auth token handling, fix jwt-decode import, Vite port and misc fixes)
from backend.models.tag import Tag
from backend.models.task import Task

tag_routes = Blueprint("tag_routes", __name__)

# ==============================================================
# ENDPOINTS DE TAGS (Etiquetas)
# ==============================================================

@tag_routes.route("/api/tags", methods=["GET"])
def get_tags():
    """Lista todas las etiquetas de un usuario."""
    user_sub = request.args.get("user_sub")
    if not user_sub:
        return abort(400, "Falta parámetro user_sub")

    tags = Tag.query.filter_by(user_sub=user_sub).all()
    return jsonify([t.to_dict() for t in tags])


@tag_routes.route("/api/tags", methods=["POST"])
def create_tag():
    """Crea una nueva etiqueta."""
    data = request.get_json()
    if not data or "userSub" not in data or "name" not in data:
        return abort(400, "Faltan campos: userSub y name")

    new_tag = Tag(
        user_sub=data["userSub"],
        name=data["name"],
        color=data.get("color")
    )
    db.session.add(new_tag)
    db.session.commit()
    return jsonify({"status": "ok", "tag": new_tag.to_dict()})


@tag_routes.route("/api/tags/<int:tag_id>", methods=["DELETE"])
def delete_tag(tag_id):
    """Elimina una etiqueta por ID."""
    tag = Tag.query.get(tag_id)
    if not tag:
        return jsonify({"error": "Etiqueta no encontrada"}), 404

    db.session.delete(tag)
    db.session.commit()
    return jsonify({"status": "ok", "deleted_id": tag_id})


@tag_routes.route("/api/tasks/<task_id>/tags", methods=["POST"])
def assign_tags_to_task(task_id):
    """
    Asigna etiquetas a una tarea.
    Espera: { "tagIds": [1, 2, 3] }
    """
    data = request.get_json()
    if not data or "tagIds" not in data:
        return abort(400, "Faltan tagIds en el cuerpo")

    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Tarea no encontrada"}), 404

    tags = Tag.query.filter(Tag.id.in_(data["tagIds"])).all()
    task.tags = tags
    db.session.commit()
    return jsonify({"status": "ok", "task": task.to_dict()})


@tag_routes.route("/api/tasks/<task_id>/tags", methods=["GET"])
def get_tags_for_task(task_id):
    """Devuelve las etiquetas asociadas a una tarea."""
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Tarea no encontrada"}), 404

    return jsonify([t.to_dict() for t in task.tags])
