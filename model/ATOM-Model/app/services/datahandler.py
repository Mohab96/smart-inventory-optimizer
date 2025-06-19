import pandas as pd
import numpy as np
from sqlalchemy import text, exc
from app.utils.logger import logger
from app import db


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
            
        
            processed_df['lag_7'] = processed_df.groupby('product_id')['total_units_sold'].transform(lambda x: x.shift(7).fillna(0))
            processed_df['rolling_7d'] = processed_df.groupby('product_id')['total_units_sold'].transform(lambda x: x.rolling(7, min_periods=1).mean()).fillna(0)
            

            processed_df['day_sin'] = np.sin(2 * np.pi * processed_df['day_of_week'] / 7)
            processed_df['day_cos'] = np.cos(2 * np.pi * processed_df['day_of_week'] / 7)
            processed_df['month_sin'] = np.sin(2 * np.pi * (processed_df['month'] - 1) / 12)
            processed_df['month_cos'] = np.cos(2 * np.pi * (processed_df['month'] - 1) / 12)
            

            processed_df['product_popularity'] = processed_df.groupby('product_id')['total_units_sold'].transform('mean')
            processed_df['product_volatility'] = processed_df.groupby('product_id')['total_units_sold'].transform('std').fillna(0)
            processed_df['product_max_sales'] = processed_df.groupby('product_id')['total_units_sold'].transform('max')
            processed_df['product_weekday_avg'] = processed_df.groupby(['product_id', 'day_of_week'])['total_units_sold'].transform('mean')
            

            processed_df['sales_diff'] = processed_df.groupby('product_id')['total_units_sold'].transform(lambda x: x.diff().fillna(0))
            processed_df['sales_diff_7d'] = processed_df.groupby('product_id')['total_units_sold'].transform(lambda x: x.diff(7).fillna(0))
            
            processed_df['product_id'] = processed_df['product_id'].astype('category')
            
            product_mapping = processed_df[['product_id', 'date']].copy()
            

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
            db.session.rollback()  
            return 0
