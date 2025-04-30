import pickle
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import xgboost as xgb
from flask import Flask, request, jsonify
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score
from sqlalchemy import text, exc
from flask_sqlalchemy import SQLAlchemy
import os
import logging
import random

# ========== Configuration ==========
app = Flask(__name__)
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
db = SQLAlchemy(app)

# ========== Logging ==========
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ========== Database Model ==========
class ModelStorage(db.Model):
    __tablename__ = 'model_storage'
    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.String(255), nullable=False)
    product_id = db.Column(db.Integer, nullable=False)
    model_data = db.Column(db.LargeBinary)
    scaler_data = db.Column(db.LargeBinary)
    last_trained = db.Column(db.DateTime, default=datetime.utcnow)
# ========== XGBoost Handler ==========

# ========== Data Handler ==========


# ========== API Endpoints ==========
@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "Welcome to ATOM Prediction API!"})
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)