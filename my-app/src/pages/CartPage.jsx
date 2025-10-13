import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import PageLayout from '../components/layout/PageLayout';
import EmptyState from '../components/common/EmptyState';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, getTotal, calculateItemPrice } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Looks like you haven't picked any flowers yet. Let's find something beautiful for you."
            actionText="Start Shopping"
            onAction={() => navigate('/products')}
          />
        </div>
      </PageLayout>
    );
  }

  const subtotal = getTotal();
  const shipping = 5.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <PageLayout>
      <div className="min-h-screen px-4 py-12 bg-gray-50">
        <div className="container mx-auto">
          <h1 className="mb-8 text-5xl font-bold text-gray-900">Your Cart</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {cart.map(item => (
                <div key={item.product_id} className="flex items-center gap-6 p-6 transition bg-white shadow-sm rounded-3xl hover:shadow-md">
                  <img 
                    src={item.image_url || 'https://via.placeholder.com/120'} 
                    alt={item.product}
                    className="object-cover w-32 h-32 cursor-pointer rounded-2xl"
                    onClick={() => navigate(`/product/${item.product_id}`)}
                  />
                  
                  <div className="flex-1">
                    <h3 
                      className="mb-1 text-xl font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                      onClick={() => navigate(`/product/${item.product_id}`)}
                    >
                      {item.product}
                    </h3>
                    <p className="text-lg font-bold text-gray-900">
                      LKR {calculateItemPrice(item).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="p-2 text-red-600 transition rounded-full hover:bg-red-50"
                      title="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>

                    <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-full">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="flex items-center justify-center w-8 h-8 text-gray-700 transition bg-white rounded-full hover:bg-gray-200"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 font-semibold text-center text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="flex items-center justify-center w-8 h-8 text-gray-700 transition bg-white rounded-full hover:bg-gray-200"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/products')}
                  className="px-8 py-4 font-semibold text-gray-700 transition bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => navigate('/checkout')}
                  className="px-8 py-4 font-semibold text-white transition rounded-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky overflow-hidden shadow-lg top-20 rounded-3xl">
                <div className="relative p-8 text-white bg-gradient-to-br from-orange-200 via-rose-200 to-amber-200">
                  <div className="absolute inset-0 opacity-20">
                    <img 
                      src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=600&fit=crop" 
                      alt="Floral background"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  
                  <div className="relative z-10">
                    <h2 className="mb-6 text-3xl font-bold text-white drop-shadow-lg">Order Summary</h2>
                    
                    <div className="mb-6 space-y-3 text-white">
                      <div className="flex justify-between">
                        <span className="text-lg drop-shadow">Subtotal</span>
                        <span className="text-lg font-semibold drop-shadow">LKR {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-lg drop-shadow">Shipping</span>
                        <span className="text-lg font-semibold drop-shadow">LKR {shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-lg drop-shadow">Tax</span>
                        <span className="text-lg font-semibold drop-shadow">LKR {tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-4 mt-4 border-t border-white border-opacity-30">
                        <span className="text-2xl font-bold drop-shadow">Total</span>
                        <span className="text-2xl font-bold drop-shadow">LKR {total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                 
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CartPage;