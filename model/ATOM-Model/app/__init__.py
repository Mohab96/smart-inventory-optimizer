from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from app.utils.logger import logger
import os


db = SQLAlchemy()

def create_app():

    app = Flask(__name__)

    with app.app_context():
        from .routes.Atom import atom_bp
        from .routes.model_training import train_bp
        from .routes.model_prediction import predict_bp
        from .routes.model_testing import test_predict_bp
        # Register blueprints
        app.register_blueprint(atom_bp)
        app.register_blueprint(train_bp)
        app.register_blueprint(predict_bp)
        app.register_blueprint(test_predict_bp)

    app.config.update(
        SQLALCHEMY_DATABASE_URI=os.getenv('DWH_DIRECT_URL'),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SQLALCHEMY_ENGINE_OPTIONS={
            "pool_size": 5,
            "max_overflow": 10,
            "pool_timeout": 30,
            "pool_recycle": 3600
        }
    )
    db.init_app(app)

    return app