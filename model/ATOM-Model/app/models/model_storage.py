from app import db
from datetime import datetime, timedelta

class ModelStorage(db.Model):
    __tablename__ = 'model_storage'
    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.String(255), nullable=False)
    product_id = db.Column(db.Integer, nullable=False)
    model_data = db.Column(db.LargeBinary)
    scaler_data = db.Column(db.LargeBinary)
    last_trained = db.Column(db.DateTime, default=datetime.utcnow)
