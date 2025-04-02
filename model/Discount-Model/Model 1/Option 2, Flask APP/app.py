from flask import Flask, request, jsonify
import pandas as pd
import datetime

app = Flask(__name__)

def suggest_discount(row, min_margin_pct=5):
    # No discount logic for fast-selling & healthy products
    if (
        row['sales_velocity'] >= 1.5 and
        row['stock_left'] <= 5 and
        row['days_on_shelf'] < 30
    ):
        return 0.0

    base_discount = 0

    # Base discount from sales velocity
    if row['sales_velocity'] >= 3:
        base_discount = 0
    elif row['sales_velocity'] >= 2:
        base_discount = 5
    elif row['sales_velocity'] >= 1.5:
        base_discount = 10
    elif row['sales_velocity'] >= 1:
        base_discount = 15
    elif row['sales_velocity'] >= 0.7:
        base_discount = 20
    elif row['sales_velocity'] >= 0.4:
        base_discount = 25
    elif row['sales_velocity'] >= 0.2:
        base_discount = 30
    else:
        base_discount = 35

    # Aging inventory boosts discount
    if row['days_on_shelf'] > 360:
        base_discount += 10
    elif row['days_on_shelf'] > 180:
        base_discount += 7
    elif row['days_on_shelf'] > 90:
        base_discount += 4

    # Overstocked inventory boosts discount
    if row['stock_left'] >= 100:
        base_discount += 10
    elif row['stock_left'] >= 50:
        base_discount += 7
    elif row['stock_left'] >= 25:
        base_discount += 5

    # Extra boost for slow sellers that are aging & overstocked
    if row['sales_velocity'] < 0.3 and row['days_on_shelf'] > 180 and row['stock_left'] > 30:
        base_discount += 5

    # Cap maximum discount
    base_discount = min(base_discount, 60)

    # Ensure profitability
    if row['sellingPrice'] > 0:
        min_profit_required = row['sellingPrice'] * (min_margin_pct / 100)
        max_discount_pct = ((row['profit_margin'] - min_profit_required) / row['sellingPrice']) * 100
        max_discount_pct = max(0, max_discount_pct)
    else:
        max_discount_pct = 0

    final_discount = min(base_discount, max_discount_pct)
    return round(final_discount, 2)

@app.route('/predict_discount', methods=['POST'])
def predict_discount():
    try:
        purchase_file = request.files.get('purchase')
        sales_file = request.files.get('sales')

        if not purchase_file or not sales_file:
            return jsonify({'status': 'error', 'message': 'Missing files'}), 400

        purchase_df = pd.read_csv(purchase_file)
        sales_df = pd.read_csv(sales_file)

        # Parse dates
        sales_df['date'] = pd.to_datetime(sales_df['date'], errors='coerce')
        purchase_df['dateOfReceipt'] = pd.to_datetime(purchase_df['dateOfReceipt'], errors='coerce')

        # Aggregate sales
        sales_agg = sales_df.groupby('batchId').agg({
            'amount': 'sum', 'date': ['min', 'max']
        })
        sales_agg.columns = ['total_units_sold', 'first_sale_date', 'last_sale_date']
        sales_agg = sales_agg.reset_index()

        # Merge datasets
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

        # Filter valid rows
        merged_df = merged_df[(merged_df['quantity'] > 0) & (merged_df['sellingPrice'] > 0)]

        # Apply discount logic
        merged_df['suggested_discount'] = merged_df.apply(suggest_discount, axis=1)

        # Final response
        result = {
            'status': 'success',
            'generated_at': datetime.datetime.utcnow().isoformat() + 'Z',
            'discounts': merged_df[['batchId', 'productName', 'suggested_discount']].to_dict(orient='records')
        }

        return jsonify(result)

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({'status': 'error', 'message': 'Server error', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
