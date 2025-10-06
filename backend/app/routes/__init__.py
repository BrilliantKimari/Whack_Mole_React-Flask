from flask import Blueprint, request, jsonify
from app.db import db
from app.models.gamer import Gamer

gamers_bp = Blueprint("gamers", __name__)

# Handle preflight OPTIONS requests
@gamers_bp.route("/", methods=["OPTIONS"])
@gamers_bp.route("/<int:gamer_id>", methods=["OPTIONS"])
@gamers_bp.route("/login", methods=["OPTIONS"])
def options_handler(gamer_id=None):
    return "", 200

# Get all gamers
@gamers_bp.route("/", methods=["GET"])
def get_gamers():
    gamers = Gamer.query.all()
    return jsonify([g.to_dict() for g in gamers])

# Create gamer (register)
@gamers_bp.route("/", methods=["POST"])
def create_gamer():
    data = request.get_json()
    if not data or not all(k in data for k in ("username", "email", "password")):
        return jsonify({"error": "username, email, and password are required"}), 400

    if Gamer.query.filter((Gamer.username == data["username"]) | (Gamer.email == data["email"])).first():
        return jsonify({"error": "Username or email already exists"}), 409

    gamer = Gamer(username=data["username"], email=data["email"])
    gamer.set_password(data["password"])
    db.session.add(gamer)
    db.session.commit()
    return jsonify(gamer.to_dict()), 201

# Login gamer
@gamers_bp.route("/login", methods=["POST"])
def login_gamer():
    data = request.get_json()
    if not data or not all(k in data for k in ("email", "password")):
        return jsonify({"error": "email and password are required"}), 400

    gamer = Gamer.query.filter_by(email=data["email"]).first()
    if gamer and gamer.check_password(data["password"]):
        return jsonify({"message": "Login successful", "gamer": gamer.to_dict()})
    return jsonify({"error": "Invalid email or password"}), 401

# Update gamer (PATCH)
@gamers_bp.route("/<int:gamer_id>", methods=["PATCH"])
def update_gamer(gamer_id):
    gamer = Gamer.query.get_or_404(gamer_id)
    data = request.get_json()

    if "username" in data:
        gamer.username = data["username"]
    if "email" in data:
        gamer.email = data["email"]
    if "password" in data:
        gamer.set_password(data["password"])
    if "score" in data:
        gamer.score = data["score"]

    db.session.commit()
    return jsonify(gamer.to_dict())

# Delete gamer
@gamers_bp.route("/<int:gamer_id>", methods=["DELETE"])
def delete_gamer(gamer_id):
    gamer = Gamer.query.get_or_404(gamer_id)
    db.session.delete(gamer)
    db.session.commit()
    return jsonify({"message": f"Gamer {gamer_id} deleted"})