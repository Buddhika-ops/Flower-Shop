import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { supabase } from '../supabase';
import { useCart } from '../contexts/CartContext';
import PageLayout from '../components/layout/PageLayout';
import BackButton from '../components/common/BackButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      // Main product
      const { data: prod, error } = await supabase
        .from('product_tbl')
        .select('*')
        .eq('product_id', id)
        .single();

      if (error) throw error;
      setProduct(prod);

      // Related products
      const { data: others } = await supabase
        .from('product_tbl')
        .select('*')
        .neq('product_id', id)
        .limit(3);

      setRelatedProducts(others || []);
    } catch (err) {
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalPrice = (price, discount) => {
    const p = parseFloat(price);
    const d = parseFloat(discount || 0);
    return (p - (p * d / 100)).toFixed(2);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading product..." />;
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="container px-4 py-16 mx-auto text-center">
          <div className="text-xl text-gray-600">Product not found</div>
          <Button
            onClick={() => navigate('/products')}
            variant="outline"
            className="mt-4"
          >
            Back to Shop
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container px-4 py-12 mx-auto">
        <BackButton onClick={() => navigate('/products')} />

        {/* Product Section */}
        <div className="grid gap-12 md:grid-cols-2">
          {/* Image */}
          <div>
            <img 
              src={product.image_url || 'https://via.placeholder.com/600'} 
              alt={product.product}
              className="object-cover w-full rounded-2xl shadow h-[500px]"
            />
          </div>

          {/* Details */}
          <div>
            <h1 className="mb-3 font-serif text-4xl font-bold text-gray-900">
              {product.product}
            </h1>
            <p className="mb-6 text-lg text-gray-600">{product.description}</p>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-pink-600">
                LKR {calculateFinalPrice(product.price, product.discount)}
              </span>
              {parseFloat(product.discount) > 0 && (
                <span className="ml-3 text-xl text-gray-400 line-through">
                  LKR {parseFloat(product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <Minus size={18} />
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(parseInt(product.stocks), quantity + 1))}
                disabled={quantity >= parseInt(product.stocks)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              disabled={parseInt(product.stocks) === 0}
              className="w-full"
            >
              <ShoppingCart size={22} className="mr-2 flex items-center" />
              {parseInt(product.stocks) === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>

            {/* Extra Product Details */}
            <div className="mt-10">
              <h2 className="mb-4 font-serif text-xl font-bold text-gray-800">Details</h2>
              <div className="grid gap-4 text-gray-700">
                <p><span className="font-semibold">Arrangement Size:</span> {product.size || "N/A"}</p>
                <p><span className="font-semibold">Flowers Included:</span> {product.flowers_included || "N/A"}</p>
                <p><span className="font-semibold">Vase Included:</span> {product.vase_included || "N/A"}</p>
                <p><span className="font-semibold">Care Instructions:</span> {product.care_instructions || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="mb-6 font-serif text-2xl font-bold text-gray-800">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map(item => (
              <ProductCard
                key={item.product_id}
                product={item}
                showAddToCart={false}
                imageHeight="h-64"
              />
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductDetailPage;
