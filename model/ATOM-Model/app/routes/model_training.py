from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from sklearn.metrics import r2_score, mean_absolute_error
import random

from app import db
from app.services.datahandler import DataHandler
from app.services.predictor import XGBoostPredictor
from app.models.model_storage import ModelStorage
from app.utils.logger import logger

train_bp = Blueprint("train", __name__, url_prefix="/atom/train")

@train_bp.route("", methods=["POST"])
def train_endpoint():
    try:
        logger.info("\n" + "="*50 + "\n TRAINING STARTED")
        req = request.json
        business_id = req.get("business_id")
        
        # Validate business_id
        if not business_id:
            logger.error(" Missing business_id")
            return jsonify({
                "success": False,
                "error": "Missing business_id in request"
            }), 400
        
        logger.info(f"Processing business: {business_id}")
        
        # Fetch all product data for training
        data = DataHandler.fetch_product_data(business_id)
        if data.empty:
            logger.error(" No training data found")
            return jsonify({
                "success": False,
                "error": "No data available for training"
            }), 404
        
        # Extract unique product IDs used in training
        trained_products = data['product_id'].unique().tolist()
        count = len(trained_products)
        
        # Preprocess the dataset
        processed = DataHandler.preprocess_data(data)
        if processed['features'].empty:
            logger.warning(" Empty processed data")
            return jsonify({
                "success": False,
                "error": "Empty processed data"
            }), 400
        
        # Train the model using the entire dataset
        X = processed['features']
        y = data['total_units_sold'].iloc[-len(X):]
        predictor = XGBoostPredictor().train(X, y)
        
        # Save the combined model with product_id=0
        predictor.save(business_id, 0)
        trained_products = sorted(trained_products)
        return jsonify({
            "success": True,
            "trained_products": trained_products,
            "count": count
        })
    
    except Exception as e:
        logger.error(f" Critical training error: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": "Internal server error"
        }), 500