import xgboost as xgb
import numpy as np
import pickle
from sklearn.preprocessing import StandardScaler
from datetime import datetime

from app.models.model_storage import ModelStorage
from app.services.datahandler import DataHandler
from app.utils.logger import logger
from app import db

class XGBoostPredictor:
    def __init__(self):
        self.model = xgb.XGBRegressor(
            objective='count:poisson',
            n_estimators=150,
            max_depth=5,
            reg_alpha=0.3,
            reg_lambda=0.3,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            enable_categorical=True  # Added to enable categorical support
        )
        self.scaler = StandardScaler()

    def train(self, X, y):
        try:
            logger.info(f"Training model with {X.shape[0]} samples")
            X_scaled = self.scaler.fit_transform(X)
            self.model.fit(X_scaled, y)
            return self
        except Exception as e:
            logger.error(f"Training failed: {str(e)}")
            raise

    def predict(self, X):
        try:
            logger.info(f"Predicting on {X.shape[0]} samples")
            X_scaled = self.scaler.transform(X)
            preds = self.model.predict(X_scaled)
            return np.round(preds).clip(0).astype(int)
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            raise

    def save(self, business_id, product_id):
        try:
            logger.info(f"Saving model for {business_id}/{product_id}")
            record = ModelStorage.query.filter_by(
                business_id=business_id,
                product_id=int(product_id)
            ).first()
            if record:
                record.model_data = pickle.dumps(self.model)
                record.scaler_data = pickle.dumps(self.scaler)
                record.last_trained = datetime.utcnow()
            else:
                record = ModelStorage(
                    business_id=business_id,
                    product_id=int(product_id),
                    model_data=pickle.dumps(self.model),
                    scaler_data=pickle.dumps(self.scaler)
                )
                db.session.add(record)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            logger.error(f"Model save failed: {str(e)}")
            raise

    @staticmethod
    def load(business_id, product_id):
        try:
            logger.info(f"Loading model for {business_id}/{product_id}")
            record = ModelStorage.query.filter_by(
                business_id=business_id,
                product_id=int(product_id)
            ).first()
            if record:
                predictor = XGBoostPredictor()
                predictor.model = pickle.loads(record.model_data)
                predictor.scaler = pickle.loads(record.scaler_data)
                return predictor
            return None
        except Exception as e:
            logger.error(f"Model load failed: {str(e)}")
            return None
