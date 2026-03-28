import numpy as np
import polars as pl
from app.database import lakehouse

class StrategyEngine:
    def __init__(self):
        # Attach the initialized singleton lakehouse for data access
        self.db = lakehouse

    def get_customer_360(self, customer_id: str) -> dict:
        """
        Takes the raw customer_id (hex string) and orchestrates the CRM Strategy Engine.
        Returns the holistic Customer 360 'Dream View' Object.
        """
        # 1. Provide routing ID
        int_id = self.db.int_from_hex(customer_id)
        if int_id is None:
            return {"error": f"Customer {customer_id} not found."}

        # 2. Get Dossier & Bio Stats
        context = self.db.get_customer_context(int_id)
        if "error" in context:
            return {"error": context["error"]}
        dossier = context.get("local_bio_stats", {})
        
        # 3. Get Style Drift Analysis
        drift_data = self.db.calculate_style_drift(int_id)
        if "error" in drift_data:
            drift_score = 0.0
            recent_articles_padded = []
        else:
            drift_score = drift_data.get("drift_score", 0.0)
            recent_articles_padded = drift_data.get("recent_articles", [])

        # 4. Fetch the ONNX features
        # Sequence input: behavioral_sequences (Requires integer ID)
        seq_df = (
            self.db.behavioral_sequences_df
            .filter(pl.col("customer_id") == int_id)
        )
        
        churn_prob = 0.5  # Neutral default baseline
        if not seq_df.is_empty():
            seq_row = seq_df.to_dicts()[0]
            
            raw_cols = [
                'article_id', 'price', 'sales_channel_id', 'month', 'day_of_week', 'is_weekend', 
                'Active', 'club_member_status', 'fashion_news_frequency', 'age', 'recency', 
                'frequency', 'monetary', 'product_type_no', 'product_group_name', 
                'graphical_appearance_no', 'colour_group_code', 'perceived_colour_value_id', 
                'perceived_colour_master_id', 'department_no', 'index_code', 'index_group_no', 
                'section_no', 'garment_group_no', 'total_sales', 'total_revenue'
            ]
            
            # Extract features ensuring we maintain order and correct shape
            # ONNX expects behavioral_input: (1, 27, 26) [batch, seq_len, num_features]
            feature_arrays = []
            for col in raw_cols:
                if col in seq_row and seq_row[col] is not None:
                    # Convert to float numpy array and explicitly pad/truncate sequence to exactly length 27
                    arr = np.array(seq_row[col], dtype=np.float32)
                    if len(arr) < 27:
                        arr = np.pad(arr, (0, 27 - len(arr)), mode='constant')
                    elif len(arr) > 27:
                        arr = arr[-27:]
                    feature_arrays.append(arr)
                else:
                    feature_arrays.append(np.zeros(27, dtype=np.float32))
            
            # Form behavioral tensor: (26, 27) -> column stacked to (27, 26), then expanded.
            behavioral_matrix = np.column_stack(feature_arrays)  # (27, 26)
            behavioral_tensor = np.expand_dims(behavioral_matrix, axis=0)  # (1, 27, 26)
            
            # Form vision tensor: vision_input requires (1, 2048) structure
            vision_vec = np.array(context.get("style_dna", {}).get("customer_style_dna", np.zeros(2048)), dtype=np.float32)
            if len(vision_vec) < 2048:
                vision_vec = np.pad(vision_vec, (0, 2048 - len(vision_vec)), mode='constant')
            vision_tensor = np.expand_dims(vision_vec, axis=0)  # (1, 2048)
            
            # Inference
            inputs = {
                "behavioral_input": behavioral_tensor,
                "vision_input": vision_tensor
            }
            outputs = self.db.visionary_champion.run(None, inputs)
            
            # Probability extraction (apply sigmoid -> percentage)
            raw_logit = float(outputs[0][0][0])
            sigmoid_prob = 1 / (1 + np.exp(-raw_logit))
            churn_prob = round(sigmoid_prob * 100, 2)
            
        # 5. The Business Intelligence & Decision Tree
        is_high_churn = churn_prob >= 50.0
        is_high_drift = drift_score >= 0.40
        
        ltv = float(dossier.get("estimated_ltv", 0.0))
        total_purchases = int(dossier.get("total_purchases", 0))
        
        # Define LTV Tiers
        if ltv > 150.0 or total_purchases > 10:
            ltv_tier = "VIP"
        elif 50.0 <= ltv <= 150.0:
            ltv_tier = "Standard"
        else:
            ltv_tier = "Low-Value"
            
        voucher = "No Discount"
        strategy = ""
        insight = ""
        rec_ids_padded = []
        
        # 'One-and-Done' Guardrail
        if total_purchases == 1 and ltv_tier == "Low-Value":
            strategy = "Brand Discovery"
            insight = "One-and-done low-value user. Providing organic recommendations without discount."
            voucher = "No Discount"
            rec_ids_padded = self._get_historical_twins(customer_id)
        else:
            if not is_high_churn:
                # Loyal Reward
                strategy = "Loyal Reward"
                insight = f"{ltv_tier} Customer is loyal. Recommending based on historical centroid."
                rec_ids_padded = self._get_historical_twins(customer_id)
                voucher = "LOYALTY-10: 10% Off Next Order"
            else:
                # High Risk paths - Tiered Vouchers
                if ltv_tier == "VIP":
                    insight = "VIP Customer detected. Triggering high-value retention path."
                    voucher = "PREMIUM-SAVINGS-25: 25% Off"
                elif ltv_tier == "Standard":
                    insight = "Standard Risk Customer. Triggering moderate retention path."
                    voucher = "STAY-WITH-US-15: 15% Off"
                else:
                    insight = "Low-value user. Providing organic recommendations without discount."
                    voucher = "No Discount"
                
                # Apply Style Drift Strategy
                if not is_high_drift:
                    strategy = "Re-engagement"
                    rec_ids_padded = self._get_persona_best_sellers(int_id)
                else:
                    strategy = "Evolution Support"
                    rec_ids_padded = self._get_recent_twins(recent_articles_padded)
                
        # 6. Translate article IDs out of their padded strings into i64 representations via map
        rec_details = self._map_article_details([int(x) for x in rec_ids_padded])
        
        recent_activity_ints = []
        hist_df = self.db.history_narrative.filter(pl.col("customer_id") == customer_id).sort("t_dat", descending=True).head(5)
        if not hist_df.is_empty():
            recent_activity_ints = hist_df["article_id"].to_list()
        recent_feed_details = self._map_article_details(recent_activity_ints)
        
        style_persona = context.get("style_dna", {}).get("style_persona", "Unknown")

        # Compile Dream View
        return {
            "dossier": {
                "customer_id": customer_id,
                "age": dossier.get("age"),
                "status": dossier.get("club_member_status"),
                "ltv": float(dossier.get("estimated_ltv", 0.0)),
                "total_purchases": int(dossier.get("total_purchases", 0)),
                "member_since": dossier.get("member_since"),
                "last_purchase": dossier.get("last_purchase")
            },
            "risk_assessment": {
                "churn_probability": churn_prob,
                "risk_level": "High" if is_high_churn else "Low",
                "status_badge": "🔴 Action Required" if is_high_churn else "🟢 Healthy"
            },
            "style_analysis": {
                "persona_id": style_persona,
                "drift_score": drift_score,
                "trend_summary": "Evolving" if is_high_drift else "Consistent"
            },
            "strategy": {
                "name": strategy,
                "insight": insight,
                "voucher": voucher
            },
            "recent_activity_feed": recent_feed_details,
            "orchestrated_recommendations": rec_details
        }
        
    def _map_article_details(self, article_ints: list) -> list:
        if not article_ints:
            return []
        # Join with article_legend using the native i64 article_id
        df = self.db.article_legend.filter(pl.col("article_id").is_in(article_ints))
        return df.to_dicts()

    def _get_historical_twins(self, hex_id: str) -> list:
        # Grabs oldest known favored item and finds twins
        history = self.db.history_narrative.filter(pl.col("customer_id") == hex_id)
        if history.is_empty():
            return []
        fav_article = history["article_id"][0]
        twins_row = self.db.similarity_index.filter(pl.col("article_id") == fav_article)
        if twins_row.is_empty() or "similar_items" not in twins_row.columns:
            return []
        # similar_items might be stored as strings in the index, so convert back to int
        twins = [int(x) for x in list(twins_row["similar_items"][0])[:3]]
        return twins

    def _get_persona_best_sellers(self, int_id: int) -> list:
        dna_df = self.db.style_profiles_df.filter(pl.col("customer_id") == int_id).select("style_persona")
        if dna_df.is_empty():
            return []
        persona = dna_df["style_persona"][0]
        best_sellers_df = self.db.persona_best_sellers.filter(pl.col("style_persona") == persona).head(3)
        return best_sellers_df["article_id"].to_list()

    def _get_recent_twins(self, padded_articles: list) -> list:
        if not padded_articles:
            return []
        last_article = int(padded_articles[0])
        twins_row = self.db.similarity_index.filter(pl.col("article_id") == last_article)
        if twins_row.is_empty() or "similar_items" not in twins_row.columns:
            return []
        twins = [int(x) for x in list(twins_row["similar_items"][0])[:3]]
        return twins

# Export Singleton
conductor = StrategyEngine()
