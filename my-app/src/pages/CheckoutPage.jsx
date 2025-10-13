import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import FormInput from '../components/forms/FormInput';
import Button from '../components/ui/Button';

const CheckoutPage = () => {
  const { cart, getTotal, clearCart, calculateItemPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
   
    address: '',
    city: '',
    postal_code: '',
    special_instructions: '',
    payment_method: 'card'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const subtotal = getTotal();
      const shipping = 9.99;
      const total = subtotal + shipping;

      // Create order in order_tbl
      const orderData = {
        customer_id: user.id,
        order_date: new Date().toISOString(),
        status: 'pending',
        total_amount: total,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postal_code,
        special_instructions: formData.special_instructions || null,
        payment_method: formData.payment_method
      };

      const { data: order, error: orderError } = await supabase
        .from('order_tbl')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items in order_item_tbl
      if (order) {
        const orderItems = cart.map(item => ({
          order_id: order.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_each: calculateItemPrice(item),
          subtotal: calculateItemPrice(item) * item.quantity
        }));

        const { error: itemsError } = await supabase
          .from('order_item_tbl')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      // Clear cart and redirect
      clearCart();
      alert('Order placed successfully! Order ID: ' + order.order_id);
      navigate('/products');
      
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = getTotal();
  const shipping = 9.99;
  const total = subtotal + shipping;

  return (
    <PageLayout>
      <div className="min-h-screen px-4 py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="Checkout"
            breadcrumb="Cart / Checkout"
          />

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-white shadow-sm rounded-3xl">
                {/* Delivery Information */}
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Delivery Information</h2>

                  <div className="space-y-4">
                    

                    <FormInput
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street Address"
                      required
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormInput
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        required
                      />

                      <FormInput
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        placeholder="Postal Code"
                        required
                      />
                    </div>

                    <div>
                      <textarea
                        name="special_instructions"
                        value={formData.special_instructions}
                        onChange={handleChange}
                        className="w-full px-6 py-4 text-gray-700 placeholder-gray-400 transition border-0 resize-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:bg-white"
                        rows="4"
                        placeholder="Special Instructions"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Payment Method</h2>
                  
                  <div className="space-y-4">
                    <label className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition ${
                      formData.payment_method === 'card' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="payment_method"
                        value="card"
                        checked={formData.payment_method === 'card'}
                        onChange={handleChange}
                        className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                      />
                      <div className="ml-4">
                        <div className="text-lg font-bold text-gray-900">Credit/Debit Card</div>
                        <div className="text-sm text-gray-600">Pay securely with your card</div>
                      </div>
                    </label>

                    <label className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition ${
                      formData.payment_method === 'paypal' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="payment_method"
                        value="paypal"
                        checked={formData.payment_method === 'paypal'}
                        onChange={handleChange}
                        className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                      />
                      <div className="ml-4">
                        <div className="text-lg font-bold text-gray-900">PayPal</div>
                        <div className="text-sm text-gray-600">Pay with your PayPal account</div>
                      </div>
                    </label>

                    <label className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition ${
                      formData.payment_method === 'cod' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="payment_method"
                        value="cod"
                        checked={formData.payment_method === 'cod'}
                        onChange={handleChange}
                        className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                      />
                      <div className="ml-4">
                        <div className="text-lg font-bold text-gray-900">Cash on Delivery</div>
                        <div className="text-sm text-gray-600">Pay when you receive your order</div>
                      </div>
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="p-4 text-red-600 rounded-2xl bg-red-50">
                    {error}
                  </div>
                )}
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky p-8 bg-white shadow-sm top-20 rounded-3xl">
                <h2 className="mb-6 text-3xl font-bold text-gray-900">Order Summary</h2>
                
                <div className="mb-6 space-y-4 overflow-y-auto max-h-80">
                  {cart.map(item => (
                    <div key={item.product_id} className="flex gap-4">
                      <img 
                        src={item.image_url || 'https://via.placeholder.com/80'} 
                        alt={item.product}
                        className="object-cover w-20 h-20 rounded-2xl"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{item.product}</div>
                        <div className="text-sm text-gray-600">
                          {item.quantity} × LKR {calculateItemPrice(item).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 space-y-3 border-t border-gray-200">
                  <div className="flex justify-between text-lg text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">LKR {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-gray-900">LKR {shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-3 text-2xl font-bold text-gray-900 border-t border-gray-200">
                    <span>Total</span>
                    <span>LKR {total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  loading={loading}
                  className="w-full mt-6"
                >
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CheckoutPage;