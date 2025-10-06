from flask import Flask
from flask_cors import CORS
from .db import db, migrate
from .routes import gamers_bp
from .config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS with specific configuration
    CORS(app, resources={
        r"/gamers/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Initialize DB and migrations
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    app.register_blueprint(gamers_bp, url_prefix='/gamers')

    return app