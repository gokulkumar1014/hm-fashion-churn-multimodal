import numpy as np

from app.database import lakehouse


class StrategyEngine:
    def __init__(self):
        self.db = lakehouse

    def get_customer_360(self, customer_id: str) -> dict:
        int_id = self.db.int_from_hex(customer_id)
        if int_id is None:
            return {"error": f"Customer {customer_id} not found."}

        context = self.db.get_customer_context(int_id)
        if "error" in context:
            return {"error": context["error"]}
        dossier = context.get("local_bio_stats", {})

        drift_data = self.db.calculate_style_drift(int_id)
        drift_score = float(drift_data.get("drift_score", 0.0)) if "error" not in drift_data else 0.0
        recent_articles_padded = drift_data.get("recent_articles", []) if "error" not in drift_data else []

        seq_rows = self.db._fetch_remote(
            "behavioral_sequences",
            filters={"customer_id": int_id},
            limit=1
        )
        churn_prob = 0.5
        if seq_rows:
            seq_row = seq_rows[0]
            raw_cols = [
                'article_id', 'price', 'sales_channel_id', 'month', 'day_of_week', 'is_weekend',
                'Active', 'club_member_status', 'fashion_news_frequency', 'age', 'recency',
                'frequency', 'monetary', 'product_type_no', 'product_group_name',
                'graphical_appearance_no', 'colour_group_code', 'perceived_colour_value_id',
                'perceived_colour_master_id', 'department_no', 'index_code', 'index_group_no',
                'section_no', 'garment_group_no', 'total_sales', 'total_revenue'
            ]
            feature_arrays = []
            for col in raw_cols:
                arr = np.array(seq_row.get(col) or np.zeros(27), dtype=np.float32)
                if arr.size < 27:
                    arr = np.pad(arr, (0, 27 - arr.size), mode="constant")
                elif arr.size > 27:
                    arr = arr[-27:]
                feature_arrays.append(arr)

            behavioral_matrix = np.column_stack(feature_arrays)
            behavioral_tensor = np.expand_dims(behavioral_matrix, axis=0)
            vision_vec = np.array(
                context.get("style_dna", {}).get("customer_style_dna", np.zeros(2048)),
                dtype=np.float32
            )
            if vision_vec.size < 2048:
                vision_vec = np.pad(vision_vec, (0, 2048 - vision_vec.size), mode="constant")
            vision_tensor = np.expand_dims(vision_vec, axis=0)

            outputs = self.db.visionary_champion.run(None, {
                "behavioral_input": behavioral_tensor,
                "vision_input": vision_tensor
            })
            raw_logit = float(outputs[0][0][0])
            sigmoid_prob = 1 / (1 + np.exp(-raw_logit))
            churn_prob = round(sigmoid_prob * 100, 2)

        is_high_churn = churn_prob >= 50.0
        is_high_drift = drift_score >= 0.40

        ltv = float(dossier.get("estimated_ltv", 0.0))
        total_purchases = int(dossier.get("total_purchases", 0))
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

        if total_purchases == 1 and ltv_tier == "Low-Value":
            strategy = "Brand Discovery"
            insight = "One-and-done low-value user. Providing organic recommendations without discount."
            rec_ids_padded = self._get_historical_twins(customer_id)
        else:
            if not is_high_churn:
                strategy = "Loyal Reward"
                insight = f"{ltv_tier} Customer is loyal. Recommending based on historical centroid."
                rec_ids_padded = self._get_historical_twins(customer_id)
                voucher = "LOYALTY-10: 10% Off Next Order"
            else:
                if ltv_tier == "VIP":
                    insight = "VIP Customer detected. Triggering high-value retention path."
                    voucher = "PREMIUM-SAVINGS-25: 25% Off"
                elif ltv_tier == "Standard":
                    insight = "Standard Risk Customer. Triggering moderate retention path."
                    voucher = "STAY-WITH-US-15: 15% Off"
                else:
                    insight = "Low-value user. Providing organic recommendations without discount."
                    voucher = "No Discount"

                if not is_high_drift:
                    strategy = "Re-engagement"
                    rec_ids_padded = self._get_persona_best_sellers(int_id)
                else:
                    strategy = "Evolution Support"
                    rec_ids_padded = self._get_recent_twins(recent_articles_padded)

        rec_details = self._map_article_details([int(x) for x in rec_ids_padded])

        recent_activity_rows = self.db._fetch_dicts(
            """
            SELECT article_id FROM history_narrative
            WHERE customer_id = ?
            ORDER BY t_dat DESC
            LIMIT 5
            """,
            [customer_id]
        )
        recent_activity_ints = [int(row["article_id"]) for row in recent_activity_rows]
        recent_feed_details = self._map_article_details(recent_activity_ints)

        style_persona = context.get("style_dna", {}).get("style_persona", "Unknown")

        return {
            "dossier": {
                "customer_id": customer_id,
                "age": dossier.get("age"),
                "status": dossier.get("club_member_status"),
                "ltv": ltv,
                "total_purchases": total_purchases,
                "member_since": dossier.get("member_since"),
                "last_purchase": dossier.get("last_purchase")
            },
            "risk_assessment": {
                "churn_probability": churn_prob,
                "risk_level": "High" if is_high_churn else "Low",
                "status_badge": "🚨 Action Required" if is_high_churn else "🟢 Healthy"
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
        return self.db._map_article_details(article_ints)

    def _get_historical_twins(self, hex_id: str) -> list:
        history_rows = self.db._fetch_dicts(
            "SELECT article_id FROM history_narrative WHERE customer_id = ? LIMIT 1",
            [hex_id]
        )
        if not history_rows:
            return []
        fav_article = int(history_rows[0]["article_id"])
        fav_article_str = str(fav_article).zfill(10)
        twins_rows = self.db._fetch_dicts(
            "SELECT similar_items FROM similarity_index WHERE article_id = CAST(? AS VARCHAR) LIMIT 1",
            [fav_article_str]
        )
        if not twins_rows or "similar_items" not in twins_rows[0]:
            return []
        return [int(x) for x in list(twins_rows[0]["similar_items"])[:3]]

    def _get_persona_best_sellers(self, int_id: int) -> list:
        persona_rows = self.db._fetch_remote(
            "style_profiles",
            filters={"customer_id": int_id},
            select=["style_persona"],
            limit=1
        )
        if not persona_rows:
            return []
        persona = persona_rows[0]["style_persona"]
        best_sellers = self.db._fetch_dicts(
            "SELECT article_id FROM persona_best_sellers WHERE style_persona = ? LIMIT 3",
            [persona]
        )
        return [int(row["article_id"]) for row in best_sellers]

    def _get_recent_twins(self, padded_articles: list) -> list:
        if not padded_articles:
            return []
        last_article = int(padded_articles[0])
        last_article_str = str(last_article).zfill(10)
        twins_rows = self.db._fetch_dicts(
            "SELECT similar_items FROM similarity_index WHERE article_id = CAST(? AS VARCHAR) LIMIT 1",
            [last_article_str]
        )
        if not twins_rows or "similar_items" not in twins_rows[0]:
            return []
        return [int(x) for x in list(twins_rows[0]["similar_items"])[:3]]


conductor = StrategyEngine()
