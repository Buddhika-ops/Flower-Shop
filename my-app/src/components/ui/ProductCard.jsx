import React, { memo, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = memo(({ 
  product, 
  onAddToCart, 
  showAddToCart = true, 
  className = "",
  imageHeight = "h-96"
}) => {
  const navigate = useNavigate();

  // Memoize price calculation to prevent recalculation
  const finalPrice = useMemo(() => {
    const p = parseFloat(product.price);
    const d = parseFloat(product.discount || 0);
    return (p - (p * d / 100)).toFixed(2);
  }, [product.price, product.discount]);

  // Memoize stock status
  const isOutOfStock = useMemo(() => 
    parseInt(product.stocks) === 0, 
    [product.stocks]
  );

  // Memoize click handlers
  const handleCardClick = useCallback(() => {
    navigate(`/product/${product.product_id}`);
  }, [navigate, product.product_id]);

  const handleAddToCart = useCallback((e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  }, [onAddToCart, product]);

  return (
    <div
      onClick={handleCardClick}
      className={`overflow-hidden transition bg-white shadow cursor-pointer rounded-2xl hover:shadow-lg ${className}`}
    >
      {/* Product Image */}
      <img
        src={product.image_url || 'https://via.placeholder.com/400'}
        alt={product.product}
        className={`object-cover w-full ${imageHeight}`}
        loading="lazy"
      />

      {/* Card Content */}
      <div className="p-5">
        <h3 className="mb-2 font-serif text-lg font-medium text-gray-800">
          {product.product}
        </h3>

        {/* Price */}
        <div className="mb-4">
          <span className="text-lg font-bold text-pink-600">
            LKR {finalPrice}
          </span>
          {parseFloat(product.discount) > 0 && (
            <span className="ml-2 text-sm text-gray-400 line-through">
              LKR {parseFloat(product.price).toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full py-2 text-white transition bg-pink-600 rounded-full hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;