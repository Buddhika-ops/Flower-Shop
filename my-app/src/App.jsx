import React, { Suspense, lazy, memo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import LoadingSpinner from './components/common/LoadingSpinner';

// 🚀 Optimized lazy loading with preload hints
const createLazyComponent = (importFunc, componentName) => {
  const LazyComponent = lazy(importFunc);
  
  // Preload component for better UX
  LazyComponent.preload = importFunc;
  
  // Add display name for better debugging
  LazyComponent.displayName = componentName;
  
  return LazyComponent;
};

// Lazy load pages with preload optimization
const LoginPage = createLazyComponent(() => import('./pages/LoginPage'), 'LoginPage');
const ProductsPage = createLazyComponent(() => import('./pages/ProductsPage'), 'ProductsPage');
const ProductDetailPage = createLazyComponent(() => import('./pages/ProductDetailPage'), 'ProductDetailPage');
const CartPage = createLazyComponent(() => import('./pages/CartPage'), 'CartPage');
const CheckoutPage = createLazyComponent(() => import('./pages/CheckoutPage'), 'CheckoutPage');
const Home = createLazyComponent(() => import('./pages/Home'), 'Home');
const ProfilePage = createLazyComponent(() => import('./pages/ProfilePage'), 'ProfilePage');
const MyOrdersPage = createLazyComponent(() => import('./pages/MyOrdersPage'), 'MyOrdersPage');
const AdminDashboardPage = createLazyComponent(() => import('./pages/AdminDashboardPage'), 'AdminDashboardPage');

// 🔒 Optimized Protected Route Component
const ProtectedRoute = memo(({ children, adminOnly = false }) => {
  const { user, customerData, loading } = useAuth();
  
  if (loading) return <LoadingSpinner message="Authenticating..." />;
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (adminOnly && customerData?.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }
  
  return children;
});

ProtectedRoute.displayName = 'ProtectedRoute';

// 🌐 Optimized Public Route Component
const PublicRoute = memo(({ children }) => {
  const { user, customerData, loading } = useAuth();
  
  if (loading) return <LoadingSpinner message="Loading..." />;
  
  if (user) {
    const redirectTo = customerData?.role === 'admin' ? '/admin' : '/home';
    return <Navigate to={redirectTo} replace />;
  }
  
  return children;
});

PublicRoute.displayName = 'PublicRoute';

// 🎯 Route Configuration for better maintainability
const routeConfig = [
  // Public Routes
  { path: '/login', element: <LoginPage />, public: true },
  { path: '/home', element: <Home />, public: true },
  { path: '/products', element: <ProductsPage />, public: true },
  { path: '/product/:id', element: <ProductDetailPage />, public: true },
  { path: '/cart', element: <CartPage />, public: true },
  
  // Protected Routes
  { path: '/profile', element: <ProfilePage />, protected: true },
  { path: '/my-orders', element: <MyOrdersPage />, protected: true },
  { path: '/checkout', element: <CheckoutPage />, protected: true },
  
  // Admin Routes
  { path: '/admin', element: <AdminDashboardPage />, admin: true },
];

// 🚀 Optimized App Component
const App = memo(() => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<LoadingSpinner message="Loading application..." />}>
            <Routes>
              {/* Render routes from configuration */}
              {routeConfig.map(({ path, element, public: isPublic, protected: isProtected, admin }) => {
                if (isPublic) {
                  return (
                    <Route key={path} path={path} element={element} />
                  );
                }
                
                if (isProtected) {
                  return (
                    <Route 
                      key={path} 
                      path={path} 
                      element={
                        <ProtectedRoute>
                          {element}
                        </ProtectedRoute>
                      } 
                    />
                  );
                }
                
                if (admin) {
                  return (
                    <Route 
                      key={path} 
                      path={path} 
                      element={
                        <ProtectedRoute adminOnly>
                          {element}
                        </ProtectedRoute>
                      } 
                    />
                  );
                }
                
                return null;
              })}
              
              {/* Default redirects */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
});

App.displayName = 'App';

export default App;