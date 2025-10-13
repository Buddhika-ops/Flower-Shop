import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../supabase';

function AdminDashboard() {
    const [dashboardData, setDashboardData] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        totalProducts: 0,
        recentOrders: [],
        topProducts: [],
        monthlyRevenue: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch orders
            const { data: orders, error: ordersError } = await supabase
                .from('order_tbl')
                .select('*')
                .order('order_date', { ascending: false });

            if (ordersError) throw ordersError;

            // Fetch customers
            const { data: customers, error: customersError } = await supabase
                .from('customer_tbl')
                .select('*');

            if (customersError) throw customersError;

            // Fetch products
            const { data: products, error: productsError } = await supabase
                .from('product_tbl')
                .select('*');

            if (productsError) throw productsError;

            // Fetch order items with product info
            const { data: orderItems, error: itemsError } = await supabase
                .from('order_item_tbl')
                .select(`
                    *,
                    product:product_id (
                        product
                    )
                `);

            if (itemsError) throw itemsError;

            // Fetch recent orders with customer info
            const { data: recentOrders, error: recentError } = await supabase
                .from('order_tbl')
                .select(`
                    *,
                    customer:customer_id (
                        customer_name
                    )
                `)
                .order('order_date', { ascending: false })
                .limit(5);

            if (recentError) throw recentError;

            // Process data
            const processedData = processData(orders, customers, products, orderItems, recentOrders);
            setDashboardData(processedData);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const processData = (orders, customers, products, orderItems, recentOrders) => {
        // Calculate order statistics
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(order => order.status === 'pending').length;
        const completedOrders = orders.filter(order => order.status === 'completed').length;
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

        // Calculate monthly revenue (current month)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = orders
            .filter(order => {
                const orderDate = new Date(order.order_date);
                return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
            })
            .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

        // Get top products
        const completedOrderIds = orders
            .filter(order => order.status === 'completed')
            .map(order => order.order_id);

        const productStats = {};
        orderItems
            .filter(item => completedOrderIds.includes(item.order_id))
            .forEach(item => {
                const productName = item.product?.product || 'Unknown Product';
                if (!productStats[productName]) {
                    productStats[productName] = {
                        name: productName,
                        quantity: 0,
                        revenue: 0
                    };
                }
                productStats[productName].quantity += item.quantity;
                productStats[productName].revenue += parseFloat(item.subtotal || 0);
            });

        const topProducts = Object.values(productStats)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        return {
            totalOrders,
            pendingOrders,
            completedOrders,
            totalRevenue,
            totalCustomers: customers.length,
            totalProducts: products.length,
            monthlyRevenue,
            topProducts,
            recentOrders: recentOrders || []
        };
    };

    if (loading) { 
        return(
            <div className='col-span-3 mx-auto mt-72'>
              <div className='w-16 h-16 border-b-2 border-blue-500 rounded-full animate-spin'></div>
            </div>       
        );
    };

    if (error) {
        return (
            <div className="h-full col-span-2 p-5 bg-white">
                <div className="max-w-md px-4 py-3 text-red-700 bg-red-100 border border-red-700 rounded">
                    <p className="text-center text-md">Error loading dashboard</p>
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="px-4 py-2 mt-3 text-white bg-red-400 rounded-lg hover:bg-red-500"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full col-span-2 p-6 bg-gray-50">
            {/* Header */}
            <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 bg-white border-l-4 border-blue-500 rounded-lg shadow-sm">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <h2 className="mb-1 text-sm font-medium text-gray-600">Total Orders</h2>
                            <p className="text-2xl font-bold text-gray-900">{dashboardData.totalOrders}</p>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border-l-4 border-green-500 rounded-lg shadow-sm">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <h2 className="mb-1 text-sm font-medium text-gray-600">Total Revenue</h2>
                            <p className="text-2xl font-bold text-gray-900">Rs {dashboardData.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border-l-4 border-orange-500 rounded-lg shadow-sm">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <h2 className="mb-1 text-sm font-medium text-gray-600">Pending Orders</h2>
                            <p className="text-2xl font-bold text-gray-900">{dashboardData.pendingOrders}</p>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border-l-4 border-purple-500 rounded-lg shadow-sm">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <h2 className="mb-1 text-sm font-medium text-gray-600">Total Customers</h2>
                            <p className="text-2xl font-bold text-gray-900">{dashboardData.totalCustomers}</p>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Stats Row */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">This Month</h3>
                    <p className="text-2xl font-bold text-blue-600">Rs {dashboardData.monthlyRevenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">Completed Orders</h3>
                    <p className="text-2xl font-bold text-green-600">{dashboardData.completedOrders}</p>
                    <p className="text-sm text-gray-600">Successfully fulfilled</p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-sm">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">Products</h3>
                    <p className="text-2xl font-bold text-indigo-600">{dashboardData.totalProducts}</p>
                    <p className="text-sm text-gray-600">Total in inventory</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                    </div>
                    <div className="p-6">
                        {dashboardData.recentOrders.length === 0 ? (
                            <p className="py-4 text-center text-gray-500">No recent orders</p>
                        ) : (
                            <div className="space-y-4">
                                {dashboardData.recentOrders.map((order) => (
                                    <div key={order.order_id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                Order #{order.order_id}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {order.customer?.customer_name || 'Unknown Customer'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(order.order_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                Rs {parseFloat(order.total_amount || 0).toLocaleString()}
                                            </p>
                                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                                order.status === 'completed' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-orange-100 text-orange-800'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Top Products</h2>
                    </div>
                    <div className="p-6">
                        {dashboardData.topProducts.length === 0 ? (
                            <p className="py-4 text-center text-gray-500">No product data available</p>
                        ) : (
                            <div className="space-y-4">
                                {dashboardData.topProducts.map((product, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                                <span className="text-sm font-semibold text-blue-600">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{product.name}</p>
                                                <p className="text-sm text-gray-600">{product.quantity} sold</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-green-600">
                                            Rs {product.revenue.toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;