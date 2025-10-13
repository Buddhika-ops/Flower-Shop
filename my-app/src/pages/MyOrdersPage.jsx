import React, { useState, useEffect } from 'react';
import { Package, Calendar, MapPin, CreditCard, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import BackButton from '../components/common/BackButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
const MyOrdersPage = () => {
  const { customerData } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (customerData?.customer_id) {
      fetchOrders();
    }
  }, [customerData]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('order_tbl')
        .select(`
          order_id,
          order_date,
          status,
          total_amount,
          address,
          city,
          postal_code,
          payment_method,
          special_instructions,
          order_item_tbl (
            order_item_id,
            quantity,
            price_each,
            subtotal,
            product_id,
            product_tbl (
              product,
              image_url
            )
          )
        `)
        .eq('customer_id', customerData.customer_id)
        .order('order_date', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return <LoadingSpinner message="Loading your orders..." />;
  }

  return (
    <PageLayout>
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="container px-6 mx-auto">
          <BackButton onClick={() => navigate('/products')} />
          <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="mt-2 text-gray-600">View and track your order history</p>
          </div>

          {orders.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No orders yet"
              description="Start shopping to see your orders here!"
              actionText="Start Shopping"
              onAction={() => navigate('/products')}
              className="p-12 bg-white rounded-lg shadow-md"
            />
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.order_id} className="overflow-hidden bg-white rounded-lg shadow-md">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-lg">
                          <Package className="text-pink-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Order #{order.order_id}</h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                            <Calendar size={14} />
                            <span>{formatDate(order.order_date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <p className="mt-2 text-lg font-bold text-gray-900">
                          LKR {parseFloat(order.total_amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4">
                    <div className="flex items-center gap-4 overflow-x-auto">
                      {order.order_item_tbl?.slice(0, 3).map((item) => (
                        <div key={item.order_item_id} className="flex items-center flex-shrink-0 gap-3">
                          <img
                            src={item.product_tbl?.image_url || '/placeholder-image.jpg'}
                            alt={item.product_tbl?.product || 'Product'}
                            className="object-cover w-16 h-16 rounded-lg"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.product_tbl?.product}</p>
                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.order_item_tbl?.length > 3 && (
                        <span className="flex-shrink-0 text-sm text-gray-600">
                          +{order.order_item_tbl.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200">
                    <button
                      onClick={() => toggleOrderDetails(order.order_id)}
                      className="flex items-center justify-between w-full px-6 py-3 transition hover:bg-gray-50"
                    >
                      <span className="text-sm font-medium text-pink-600">
                        {expandedOrder === order.order_id ? 'Hide Details' : 'View Details'}
                      </span>
                      {expandedOrder === order.order_id ? (
                        <ChevronUp className="text-pink-600" size={20} />
                      ) : (
                        <ChevronDown className="text-pink-600" size={20} />
                      )}
                    </button>

                    {expandedOrder === order.order_id && (
                      <div className="px-6 pb-6 space-y-6">
                        <div>
                          <h4 className="mb-3 font-semibold text-gray-900">Order Items</h4>
                          <div className="space-y-3">
                            {order.order_item_tbl?.map((item) => (
                              <div key={item.order_item_id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={item.product_tbl?.image_url || '/placeholder-image.jpg'}
                                    alt={item.product_tbl?.product || 'Product'}
                                    className="object-cover w-12 h-12 rounded"
                                  />
                                  <div>
                                    <p className="font-medium text-gray-900">{item.product_tbl?.product}</p>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">LKR {parseFloat(item.subtotal).toFixed(2)}</p>
                                  <p className="text-xs text-gray-600">LKR {parseFloat(item.price_each).toFixed(2)} each</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="mb-3 font-semibold text-gray-900">Delivery Information</h4>
                          <div className="p-4 space-y-2 rounded-lg bg-gray-50">
                            <div className="flex items-start gap-2">
                              <MapPin className="text-gray-600 mt-0.5" size={18} />
                              <div>
                                <p className="text-gray-900">{order.address}</p>
                                <p className="text-gray-600">{order.city}, {order.postal_code}</p>
                              </div>
                            </div>
                            {order.special_instructions && (
                              <div className="pt-2 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Special Instructions:</span> {order.special_instructions}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="mb-3 font-semibold text-gray-900">Payment Method</h4>
                          <div className="flex items-center gap-2 p-4 rounded-lg bg-gray-50">
                            <CreditCard className="text-gray-600" size={18} />
                            <span className="text-gray-900">{order.payment_method}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default MyOrdersPage;