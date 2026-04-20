-- Performance optimization indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_products_active_category ON products(active, category_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at_desc ON products(created_at DESC);
