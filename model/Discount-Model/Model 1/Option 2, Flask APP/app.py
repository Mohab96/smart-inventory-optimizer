from flask import Flask, request, jsonify
import pandas as pd
from sqlalchemy import create_engine
from datetime import datetime

app = Flask(__name__)

# DWH connection string
DWH_URL = "postgresql://postgres.zgwfomfkbgkyuikkrurr:fOMKSwZI2oofTWfh@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
engine = create_engine(DWH_URL)


def suggest_discount(row, min_margin_pct=5):
    if row['sales_velocity'] >= 1.5 and row['stock_left'] <= 5 and row['days_on_shelf'] < 30:
        return 0.0

    if row['sales_velocity'] >= 3:
        base = 0
    elif row['sales_velocity'] >= 2:
        base = 5
    elif row['sales_velocity'] >= 1.5:
        base = 10
    elif row['sales_velocity'] >= 1:
        base = 15
    elif row['sales_velocity'] >= 0.7:
        base = 20
    elif row['sales_velocity'] >= 0.4:
        base = 25
    elif row['sales_velocity'] >= 0.2:
        base = 30
    else:
        base = 35

    if row['days_on_shelf'] > 360:
        base += 10
    elif row['days_on_shelf'] > 180:
        base += 7
    elif row['days_on_shelf'] > 90:
        base += 4

    if row['stock_left'] >= 100:
        base += 10
    elif row['stock_left'] >= 50:
        base += 7
    elif row['stock_left'] >= 25:
        base += 5

    if row['sales_velocity'] < 0.3 and row['days_on_shelf'] > 180 and row['stock_left'] > 30:
        base += 5

    base = min(base, 60)

    if row['sellingPrice'] > 0:
        min_profit = row['sellingPrice'] * (min_margin_pct / 100)
        max_discount = ((row['profit_margin'] - min_profit) / row['sellingPrice']) * 100
        max_discount = max(0, max_discount)
    else:
        max_discount = 0

    return round(min(base, max_discount), 2)


@app.route('/predict_discount', methods=['GET'])
def predict_discount():
    try:
        business_id = request.args.get("businessId")

        if not business_id:
            return jsonify({'status': 'error', 'message': 'Missing businessId in query params'}), 400

        # Filtered Purchase Data
        purchase_query = f"""
        SELECT 
            b."batchId", 
            p."name" AS "productName",
            b."quantity",
            b."purchasePrice" AS "costOfGoods",
            b."sellingPrice",
            b."expiryDate",
            b."businessId",
            d."fullDate" AS "dateOfReceipt"
        FROM "BatchInfo" b
        JOIN "ProductDimension" p ON p."productId" = b."productId"
        LEFT JOIN "DateDimension" d ON d."fullDate" = b."expiryDate"
        WHERE b."businessId" = '{business_id}'
        """

        # All Sales Data (filter by batches only from this business)
        sales_query = f"""
        SELECT 
            t."batchId",
            t."amount",
            d."fullDate" AS "date"
        FROM "TransactionFact" t
        JOIN "DateDimension" d ON d."dateId" = t."dateId"
        JOIN "BatchInfo" b ON b."batchId" = t."batchId"
        WHERE b."businessId" = '{business_id}'
        """

        purchase_df = pd.read_sql(purchase_query, engine)
        sales_df = pd.read_sql(sales_query, engine)

        # Handle dates
        purchase_df['dateOfReceipt'] = pd.to_datetime(purchase_df['dateOfReceipt'], errors='coerce')
        sales_df['date'] = pd.to_datetime(sales_df['date'], errors='coerce')

        # Aggregate sales
        sales_agg = sales_df.groupby('batchId').agg({
            'amount': 'sum',
            'date': ['min', 'max']
        }).reset_index()
        sales_agg.columns = ['batchId', 'total_units_sold', 'first_sale_date', 'last_sale_date']

        # Merge data
        merged_df = pd.merge(purchase_df, sales_agg, on='batchId', how='left')
        merged_df['total_units_sold'] = merged_df['total_units_sold'].fillna(0)
        merged_df['first_sale_date'] = pd.to_datetime(merged_df['first_sale_date'])
        merged_df['last_sale_date'] = pd.to_datetime(merged_df['last_sale_date'])

        today = pd.Timestamp.now()
        merged_df['days_on_shelf'] = (today - merged_df['dateOfReceipt']).dt.days.clip(lower=1)
        merged_df['sales_period'] = (merged_df['last_sale_date'] - merged_df['first_sale_date']).dt.days.fillna(1).clip(lower=1)
        merged_df['sales_velocity'] = merged_df['total_units_sold'] / merged_df['sales_period']
        merged_df['stock_left'] = merged_df['quantity'] - merged_df['total_units_sold']
        merged_df['profit_margin'] = merged_df['sellingPrice'] - merged_df['costOfGoods']

        # Clean invalid rows
        merged_df = merged_df[(merged_df['quantity'] > 0) & (merged_df['sellingPrice'] > 0)]

        # Apply discount logic
        merged_df['suggested_discount'] = merged_df.apply(suggest_discount, axis=1)

        # Output JSON
        output_data = merged_df[['batchId', 'productName', 'suggested_discount']]
        result = {
            'status': 'success',
            'businessId': business_id,
            'generated_at': datetime.utcnow().isoformat() + 'Z',
            'discounts': output_data.to_dict(orient='records')
        }

        return jsonify(result)

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({'status': 'error', 'message': 'Server error', 'details': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
