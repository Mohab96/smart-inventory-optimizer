import pickle
from datetime import datetime, timedelta
import pandas as pd
import xgboost as xgb
from flask import Flask, request, jsonify
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score
from sqlalchemy import text, exc
from flask_sqlalchemy import SQLAlchemy
import os
import numpy as np
import logging

# ========== configuration ==========
app = Flask(__name__)
app.config.update(
    SQLALCHEMY_DATABASE_URI=os.getenv('DWH_DIRECT_URL'),
    SQLALCHEMY_TRACK_MODIFICATIONS=False
)
db = SQLAlchemy(app)

# ========== logging ==========
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ========== database model ==========
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
    def __init__(self, n_estimators=1000, learning_rate=0.05):
        self.model = xgb.XGBRegressor(
            objective='reg:squarederror',
            n_estimators=n_estimators,
            learning_rate=learning_rate,
            max_depth=6,
            subsample=0.8
        )
        self.scaler = StandardScaler()
    
    def train(self, X, y):
        try:
            if X.empty or y.empty:
                raise ValueError("Empty training data")
            X_scaled = self.scaler.fit_transform(X)
            self.model.fit(X_scaled, y)
            return self
        except Exception as e:
            logger.error(f"Training failed: {str(e)}")
            raise

    def predict(self, X):
        try:
            if X.empty:
                raise ValueError("Empty prediction data")
            return self.model.predict(self.scaler.transform(X))
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            raise
    
    def save(self, business_id, product_id):
        try:
            db_record = ModelStorage(
                business_id=business_id,
                product_id=product_id,
                model_data=pickle.dumps(self.model),
                scaler_data=pickle.dumps(self.scaler)
            )
            db.session.add(db_record)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            logger.error(f"Model save failed: {str(e)}")
            raise
    
    @staticmethod
    def load(business_id, product_id):
        try:
            record = ModelStorage.query.filter_by(
                business_id=business_id,
                product_id=product_id
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

# ========== data handling ==========
class DataHandler:
    @staticmethod
    def fetch_product_data(business_id, product_id=None):
        try:
            query = text(f"""
                SELECT 
                    d."fullDate" AS date,
                    p."productId" AS product_id,
                    AVG(b."sellingPrice") AS selling_price,
                    AVG(b."purchasePrice") AS purchase_price,
                    COALESCE(SUM(t."amount"), 0) AS total_units_sold,
                    EXTRACT(DOW FROM d."fullDate") AS day_of_week,
                    CASE WHEN EXTRACT(DOW FROM d."fullDate") IN (0, 6) THEN 1 ELSE 0 END AS is_weekend,
                    EXTRACT(MONTH FROM d."fullDate") AS month,
                    EXTRACT(WEEK FROM d."fullDate") AS week_of_year,
                    EXTRACT(QUARTER FROM d."fullDate") AS quarter
                FROM "BatchInfo" b
                JOIN "ProductDimension" p ON b."productId" = p."productId"
                JOIN "DateDimension" d ON b."dateId" = d."dateId"
                LEFT JOIN "TransactionFact" t 
                    ON p."productId" = t."productId" 
                    AND p."businessId" = t."businessId" 
                    AND d."dateId" = t."dateId"
                WHERE p."businessId" = :business_id
                {'AND p."productId" = :product_id' if product_id else ''}
                GROUP BY d."fullDate", p."productId"
                ORDER BY d."fullDate" ASC
            """)

            params = {'business_id': business_id}
            if product_id:
                params['product_id'] = product_id
            
            result = db.session.execute(query, params)
            df = pd.DataFrame(result.fetchall(), columns=result.keys())
            
            if df.empty:
                logger.warning(f"No data found for business_id: {business_id}, product_id: {product_id}")
            
            return df
            
        except exc.SQLAlchemyError as e:
            logger.error(f"Database error: {str(e)}")
            return pd.DataFrame()
        except Exception as e:
            logger.error(f"Unexpected error in fetch_product_data: {str(e)}")
            return pd.DataFrame()

    @staticmethod
    def preprocess_data(df):
        try:
            required_columns = {'date', 'product_id', 'selling_price', 'purchase_price', 'total_units_sold'}
            missing = required_columns - set(df.columns)
            if missing:
                raise ValueError(f"Missing required columns: {missing}")
            
            processed = (df
                .assign(
                    date=lambda x: pd.to_datetime(x['date'], errors='coerce'),
                    lag_7=lambda x: x.groupby('product_id')['total_units_sold'].shift(7),
                    rolling_7d=lambda x: x.groupby('product_id')['total_units_sold']
                                    .transform(lambda s: s.rolling(7, 1).mean()),
                    price_ratio=lambda x: np.divide(
                        (x['selling_price'] - x['purchase_price']),
                        x['purchase_price'],
                        out=np.zeros_like(x['purchase_price']),
                        where=x['purchase_price'] != 0
                    )
                )
                .dropna()
                .pipe(lambda x: x[['lag_7', 'rolling_7d', 'price_ratio', 
                                  'day_of_week', 'month', 'total_units_sold']])
            )
            return processed
        except Exception as e:
            logger.error(f"Preprocessing failed: {str(e)}")
            raise

# ========== API endpoints ==========
@app.route("/atom/train", methods=["POST"])
def train_endpoint():
    try:
        if not request.json or 'business_id' not in request.json:
            return jsonify({"success": False, "error": "Missing business_id in request"}), 400
            
        business_id = request.json["business_id"]
        data = DataHandler.fetch_product_data(business_id)
        
        if data.empty:
            return jsonify({"success": False, "error": "No data available for training"}), 404
        
        trained = []
        for product_id in data['product_id'].unique():
            try:
                product_data = data[data['product_id'] == product_id]
                processed_data = DataHandler.preprocess_data(product_data)
                
                if processed_data.empty:
                    logger.warning(f"Skipping product {product_id} - empty processed data")
                    continue
                    
                X = processed_data.drop(columns=['total_units_sold'])
                y = processed_data['total_units_sold']
                
                predictor = XGBoostPredictor().train(X, y)
                predictor.save(business_id, product_id)
                trained.append(int(product_id))
                
            except Exception as e:
                logger.error(f"training failed for product {product_id}: {str(e)}")
                continue
        
        return jsonify({
            "success": True,
            "trained_products": trained,
            "count": len(trained)
        })
        
    except Exception as e:
        logger.error(f"Train endpoint error: {str(e)}")
        return jsonify({"success": False, "error": "Internal server error"}), 500

@app.route("/atom/predict", methods=["POST"])
def predict_endpoint():
    try:
        if not request.json:
            return jsonify({"success": False, "error": "Empty request body"}), 400
            
        req = request.json
        business_id = req.get("business_id")
        days = req.get("days_of_forcasting", 7)
        top_x = req.get("top_number_of_product", 10)

        if not business_id:
            return jsonify({"success": False, "error": "Missing business_id"}), 400
            
        if days <= 0 or top_x <= 0:
            return jsonify({"success": False, "error": "Invalid parameter values"}), 400

        products = ModelStorage.query.filter_by(business_id=business_id).all()
        if not products:
            return jsonify({"success": False, "error": "No trained models found"}), 404

        demand_predictions = []
        roi_predictions = []
        
        for product in products:
            try:
                predictor = XGBoostPredictor.load(business_id, product.product_id)
                if not predictor:
                    continue
                
                data = DataHandler.fetch_product_data(business_id, product.product_id)
                processed_data = DataHandler.preprocess_data(data)
                
                if processed_data.empty:
                    continue
                    
                X = processed_data.drop(columns=['total_units_sold'])
                
                if len(X) < days:
                    logger.warning(f"insufficient data for product {product.product_id}")
                    continue
                    
                forecast = predictor.predict(X[-days:]).tolist()
                total_forecast = sum(forecast)
                
                try:
                    last_row = processed_data.iloc[-1]
                    price_ratio = last_row.get("price_ratio", 0)
                except (IndexError, KeyError):
                    price_ratio = 0
                
                demand_predictions.append({
                    "product_id": product.product_id,
                    "forecast": [round(num, 2) for num in forecast],
                    "total_forecast": round(total_forecast, 2)
                })
                
                roi_predictions.append({
                    "product_id": product.product_id,
                    # "total_forecast": round(total_forecast, 2),
                    # "price_ratio": round(price_ratio, 4),
                    "roi_score": round(total_forecast * price_ratio, 4)
                })
                
            except Exception as e:
                logger.error(f"prediction failed for product {product.product_id}: {str(e)}")
                continue


        demand_predictions.sort(key=lambda x: x["total_forecast"], reverse=True)
        roi_predictions.sort(key=lambda x: x["roi_score"], reverse=True)
        top_x = min(top_x, len(demand_predictions))

        return jsonify({
            "success": True,
            "high_demand_products": demand_predictions[:top_x],
            "high_roi_products": roi_predictions[:top_x]
        })
        
    except Exception as e:
        logger.error(f"predict endpoint error: {str(e)}")
        return jsonify({"success": False, "error": "internal server error"}), 500

@app.route("/test-predict", methods=["POST"])
def test_predict_endpoint():
    try:
        if not request.json or 'business_id' not in request.json:
            return jsonify({"success": False, "error": "missing business_id"}), 400
            
        business_id = request.json["business_id"]
        data = DataHandler.fetch_product_data(business_id)
        
        if data.empty or 'product_id' not in data.columns:
            return jsonify({"success": False, "error": "no valid data available"}), 404
            
        results = []
        
        for product_id in data['product_id'].unique():
            try:
                product_data = data[data['product_id'] == product_id]
                processed_data = DataHandler.preprocess_data(product_data)
                
                if len(processed_data) < 30:
                    results.append({
                        "product_id": int(product_id),
                        "error": "insufficient data (min 30 days required)"
                    })
                    continue
                    
                X = processed_data.drop(columns=['total_units_sold'])
                y = processed_data['total_units_sold']
                
                split_idx = int(len(X) * 0.8)
                X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
                y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]
                
                predictor = XGBoostPredictor().train(X_train, y_train)
                preds = predictor.predict(X_test)
                
                metrics = {
                    "training_r2": r2_score(y_train, predictor.predict(X_train)),
                    "testing_r2": r2_score(y_test, preds),
                    "mae": mean_absolute_error(y_test, preds),
                    "accuracy_percent": max(0, r2_score(y_test, preds)) * 100
                }
                
                results.append({
                    "product_id": int(product_id),
                    **{k: round(v, 4) if isinstance(v, float) else v for k, v in metrics.items()}
                })
                
            except Exception as e:
                results.append({
                    "product_id": int(product_id),
                    "error": str(e)
                })
                logger.error(f"test predict failed for product {product_id}: {str(e)}")

        return jsonify({"success": True, "results": results})
        
    except Exception as e:
        logger.error(f"test predict endpoint error: {str(e)}")
        return jsonify({"success": False, "error": "internal server error"}), 500


if __name__ == "__main__":
    try:
        with app.app_context():
            db.create_all()
        app.run(debug=False, host='0.0.0.0', port=5000)
    except Exception as e:
        logger.error(f"application startup failed: {str(e)}")
        raise