from flask import Blueprint, request, jsonify

import numpy as np

from sklearn.metrics import r2_score, mean_absolute_error
from datetime import datetime, timedelta

from app import db
from app.services.datahandler import DataHandler
from app.services.predictor import XGBoostPredictor
from app.models.model_storage import ModelStorage
from app.utils.logger import logger

predict_bp = Blueprint("predict", __name__, url_prefix="/atom/predict")

@predict_bp.route("", methods=["POST"])
def predict_endpoint():
    try:
        req = request.json
        business_id = req.get("business_id")
        days = min(req.get("days_of_forecasting", 7), 365)
        top_x = min(req.get("top_number_of_product", 10), DataHandler.fetch_product_count(business_id))
        logger.info(f"Processing business: {business_id} for {days} days and top {top_x} products")
        if not business_id:
            return jsonify({"success": False, "error": "Missing business_id"}), 400
        predictor = XGBoostPredictor.load(business_id, 0)
        if not predictor:
            return jsonify({"success": False, "error": "No model found"}), 404
        data = DataHandler.fetch_product_data(business_id)
        if data.empty:
            return jsonify({"success": False, "error": "No data available"}), 404
        processed_result = DataHandler.preprocess_data(data)
        if processed_result['features'].empty:
            return jsonify({"success": False, "error": "Empty processed data"}), 400
        processed = processed_result['features']
        product_mapping = processed_result['product_mapping']
        product_ids = product_mapping['product_id'].unique()
        high_demand_products = []
        for product_id in product_ids:
            product_indices = product_mapping[product_mapping['product_id'] == product_id].index
            if len(product_indices) < 7:
                continue
            X_product = processed.loc[product_indices[-days:]]
            preds = predictor.predict(X_product)
            forecast = np.round(preds[:days]).clip(0).astype(int).tolist()
            total = sum(forecast)
            high_demand_products.append({
                "product_id": int(product_id),
                "forecast": forecast,
                "total_forecast": total
            })
        high_demand_products.sort(key=lambda x: x["total_forecast"], reverse=True)
        return jsonify({
            "success": True,
            "high_demand_products": high_demand_products[:top_x],
            "number_of_products": top_x,
            "total_products": len(high_demand_products),
            "days": days,
        })
    except Exception as e:
        return jsonify({"success": False, "error": "Internal server error"}), 500