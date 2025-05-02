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
# ========== Data Handler ==========
class DataHandler:
    @staticmethod
    def fetch_product_data(business_id, product_id=None):
        try:
            logger.info(f"Fetching data for {business_id}/{product_id or 'all'}")
            base_query = """
                SELECT 
                    d."fullDate" AS date,
                    prf."productId" AS product_id,
                    prf."totalUnitsSold" AS total_units_sold,
                    EXTRACT(DOW FROM d."fullDate") AS day_of_week,
                    EXTRACT(MONTH FROM d."fullDate") AS month
                FROM "ProductRevenueFact" prf
                JOIN "DateDimension" d ON prf."dateId" = d."dateId"
                WHERE prf."businessId" = :business_id
            """
            if product_id:
                base_query += " AND prf.\"productId\" = :product_id"
            df = DataHandler._fetch_batched(
                query=text(base_query),
                params={'business_id': business_id, 'product_id': product_id},
                batch_size=5000
            )
            return df
        except exc.SQLAlchemyError as e:
            logger.error(f"Database error: {str(e)}")
            return pd.DataFrame()

    @staticmethod
    def _fetch_batched(query, params, batch_size=5000):
        results = []
        last_date = None
        while True:
            batch_query = query.text + \
                (" AND d.\"fullDate\" > :last_date" if last_date else "") + \
                f" ORDER BY d.\"fullDate\" ASC LIMIT {batch_size}"
            batch_params = params.copy()
            if last_date:
                batch_params['last_date'] = last_date
            result = db.session.execute(text(batch_query), batch_params)
            batch = result.fetchall()
            if not batch:
                break
            results.extend(batch)
            last_date = batch[-1].date
        if not results:
            return pd.DataFrame()
        df = pd.DataFrame(results, columns=result.keys())
        return df.sort_values('date').reset_index(drop=True)

    @staticmethod
    def preprocess_data(df):
        try:
            if df.empty:
                return {'features': pd.DataFrame(), 'product_mapping': pd.DataFrame()}
            
            processed_df = df.copy()
            numeric_cols = ['total_units_sold', 'day_of_week', 'month']
            for col in numeric_cols:
                processed_df[col] = pd.to_numeric(processed_df[col], errors='coerce').fillna(0).astype(np.float64)
            
            processed_df['is_weekend'] = processed_df['day_of_week'].isin([5.0, 6.0]).astype(np.int8)
            
            # Create lag and rolling features
            processed_df['lag_7'] = processed_df.groupby('product_id')['total_units_sold'].transform(lambda x: x.shift(7).fillna(0))
            processed_df['rolling_7d'] = processed_df.groupby('product_id')['total_units_sold'].transform(lambda x: x.rolling(7, min_periods=1).mean()).fillna(0)
            
            # Cyclical features
            processed_df['day_sin'] = np.sin(2 * np.pi * processed_df['day_of_week'] / 7)
            processed_df['day_cos'] = np.cos(2 * np.pi * processed_df['day_of_week'] / 7)
            processed_df['month_sin'] = np.sin(2 * np.pi * (processed_df['month'] - 1) / 12)
            processed_df['month_cos'] = np.cos(2 * np.pi * (processed_df['month'] - 1) / 12)
            
            # Product-specific features
            processed_df['product_popularity'] = processed_df.groupby('product_id')['total_units_sold'].transform('mean')
            processed_df['product_volatility'] = processed_df.groupby('product_id')['total_units_sold'].transform('std').fillna(0)
            processed_df['product_max_sales'] = processed_df.groupby('product_id')['total_units_sold'].transform('max')
            processed_df['product_weekday_avg'] = processed_df.groupby(['product_id', 'day_of_week'])['total_units_sold'].transform('mean')
            
            # Trend features
            processed_df['sales_diff'] = processed_df.groupby('product_id')['total_units_sold'].transform(lambda x: x.diff().fillna(0))
            processed_df['sales_diff_7d'] = processed_df.groupby('product_id')['total_units_sold'].transform(lambda x: x.diff(7).fillna(0))
            
            # Convert product_id to categorical type for XGBoost
            processed_df['product_id'] = processed_df['product_id'].astype('category')
            
            # Create product mapping before dropping product_id (if needed)
            product_mapping = processed_df[['product_id', 'date']].copy()
            
            # Define feature columns with product_id as categorical
            feature_columns = [
                'lag_7', 'rolling_7d', 'is_weekend', 
                'day_sin', 'day_cos', 'month_sin', 'month_cos', 
                'product_id', 
                'product_popularity', 'product_volatility', 'product_max_sales',
                'product_weekday_avg', 'sales_diff', 'sales_diff_7d'
            ]
            
            final_features = processed_df[feature_columns]
            
            return {
                'features': final_features,
                'product_mapping': product_mapping
            }
        except Exception as e:
            logger.error(f"Preprocessing failed: {str(e)}")
            return {'features': pd.DataFrame(), 'product_mapping': pd.DataFrame()}
    @staticmethod
    def fetch_product_count(business_id):
        try:
            logger.info(f"Fetching product count for business {business_id}")

            base_query = """
                SELECT COUNT(DISTINCT prf."productId") AS product_count
                FROM "ProductDimension" prf
                WHERE prf."businessId" = :business_id
            """

            result = db.session.execute(text(base_query), {'business_id': business_id}).fetchone()

            product_count = result[0] if result else 0
            logger.info(f"Product count for business {business_id}: {product_count}")

            return product_count

        except exc.SQLAlchemyError as e:
            logger.error(f"Database error: {str(e)}", exc_info=True)
            db.session.rollback()  # Rollback in case of failure
            return 0

# ========== API Endpoints ==========
@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "Welcome to ATOM Prediction API!"})
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)