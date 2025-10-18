from flask import Blueprint, jsonify

# ==============================================================
# RUTAS PRINCIPALES
# ==============================================================

main_routes = Blueprint("main_routes", __name__)

@main_routes.route("/", methods=["GET"])
def index():
    """
    Ruta raíz del backend.
    """
    return jsonify({
        "status": "ok",
        "message": "Backend PWA Organizador activo"
    }), 200
