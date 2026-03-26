import polars as pl
import os

def generate_persona_details():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    persona_path = os.path.join(base_dir, "assets", "persona_best_sellers.parquet")
    legend_path = os.path.join(base_dir, "assets", "article_legend.parquet")
    out_path = os.path.join(base_dir, "assets", "persona_details.txt")

    print(f"Loading {persona_path}...")
    df_personas = pl.read_parquet(persona_path)
    print(f"Loading {legend_path}...")
    df_legend = pl.read_parquet(legend_path)

    # df_personas likely has 'cluster' and 'article_id'
    # df_legend likely has 'article_id', 'prod_name', 'product_type_name', 'product_group_name', 'graphical_appearance_name', 'colour_group_name', 'department_name', 'index_name', 'section_name', 'garment_group_name', 'detail_desc'
    
    # Left join to get the article details for each cluster
    joined = df_personas.join(df_legend, on="article_id", how="left")
    
    # Group by style_persona and get top articles
    with open(out_path, 'w', encoding='utf-8') as f:
        # Sort by style_persona to have it ordered 0 to 9
        personas = sorted(joined['style_persona'].unique().to_list())
        for p in personas:
            f.write(f"=== PERSONA ID: {p} ===\n")
            cluster_data = joined.filter(pl.col("style_persona") == p)
            
            # Sort by count descending within the cluster
            cluster_data = cluster_data.sort("count", descending=True)
            
            # Write out the top 10 articles for this cluster to give a good sense
            for row in cluster_data.head(10).iter_rows(named=True):
                art_id = row.get('article_id', 'N/A')
                name = row.get('prod_name', 'Unknown')
                idx_group = row.get('index_group_name', 'Unknown')
                ptype = row.get('product_type_name', 'Unknown')
                color = row.get('colour_group_name', 'Unknown')
                desc = row.get('detail_desc', 'No description.')
                
                f.write(f" - [{art_id}] {name} ({idx_group} > {ptype} > {color})\n")
                f.write(f"   Desc: {desc}\n")
            f.write("\n")
            
    print(f"Success! Output written to {out_path}")

if __name__ == "__main__":
    generate_persona_details()
