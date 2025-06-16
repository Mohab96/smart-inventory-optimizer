from flask import Blueprint, request, jsonify
from app.utils.logger import logger

atom_bp = Blueprint("Atom", __name__, url_prefix="/")

@atom_bp.route("", methods=["GET"])
def index():
    logger.info("Index endpoint accessed")
    return jsonify({"message": "Welcome to ATOM Prediction API!"})