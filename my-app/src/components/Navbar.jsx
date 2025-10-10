import React, { useEffect, useState, useRef } from 'react';
import { ShoppingCart, User, LogOut, Package, UserCircle, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, customerData, signOut } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll observer - ONLY on home page
  useEffect(() => {
    // Only set up observer on home page
    if (location.pathname !== '/home') {
      setActiveSection(''); // Reset active section on other pages
      return;
    }

    const sections = ['about', 'contact', 'home'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [location.pathname]);

  const handleScrollToSection = (sectionId) => {
    if (location.pathname !== '/home') {
      navigate('/home');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleDropdownClick = (action) => {
    setShowDropdown(false);
    if (action === 'orders') {
      navigate('/my-orders');
    } else if (action === 'profile') {
      navigate('/profile');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-pink-100 shadow-sm">
      <div className="container px-6 py-4 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2">
            <span className="w-6 h-6 bg-pink-600 rounded-full"></span>
            <span className="font-serif text-xl font-bold text-gray-900">Petal & Bloom</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            {/* Home */}
            <button
              onClick={() => handleScrollToSection('home')}
              className={`text-sm font-medium transition ${
                location.pathname === '/home' && activeSection === 'home' 
                  ? 'text-pink-600' 
                  : 'text-gray-700 hover:text-pink-600'
              }`}
            >
              Home
            </button>

            {/* Products */}
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `font-medium transition border border-pink-400 rounded-lg py-1 px-2 ${
                  isActive ? 'text-pink-600' : 'text-pink-400 hover:text-pink-600'
                }`
              }
            >
              Shop Now
            </NavLink>

            {/* About Us */}
            <button
              onClick={() => handleScrollToSection('about')}
              className={`text-sm font-medium transition ${
                location.pathname === '/home' && activeSection === 'about' 
                  ? 'text-pink-600' 
                  : 'text-gray-700 hover:text-pink-600'
              }`}
            >
              About Us
            </button>

            {/* Contact */}
            <button
              onClick={() => handleScrollToSection('contact')}
              className={`text-sm font-medium transition ${
                location.pathname === '/home' && activeSection === 'contact' 
                  ? 'text-pink-600' 
                  : 'text-gray-700 hover:text-pink-600'
              }`}
            >
              Contact
            </button>

            {/* Dashboard (admin only) */}
            {customerData?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 px-3 py-1 text-sm font-semibold text-white transition bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="px-6 py-2 text-sm font-semibold text-white transition bg-pink-400 rounded-lg hover:bg-pink-500"
            >
              Cart {getItemCount() > 0 && `(${getItemCount()})`}
            </Link>

            {/* Auth Section */}
            <div className="flex items-center gap-2 pl-4 border-l">
              {!user ? (
                <div className="px-3 py-2 bg-green-500 rounded-full hover:bg-green-600">
                  <Link to="/login" className="flex items-center gap-2 text-white transition">
                    <User size={18} />
                    <span className="px-1 font-sm">Login</span>
                  </Link>
                </div>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-3 py-2 transition bg-green-500 rounded-lg hover:bg-green-600"
                  >
                    <User className="text-white" size={20} />
                    <span className="text-sm font-medium text-white">
                      {customerData?.customer_name || 'User'}
                    </span>
                    <div className="w-px h-4 mx-1 bg-white opacity-30"></div>
                    <ChevronDown className="text-white" size={16} />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 w-48 mt-2 bg-white rounded-lg shadow-lg">
                      <div className="py-1">
                        <button
                          onClick={() => handleDropdownClick('orders')}
                          className="flex items-center w-full gap-3 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                        >
                          <Package size={18} />
                          <span>View My Orders</span>
                        </button>
                        <button
                          onClick={() => handleDropdownClick('profile')}
                          className="flex items-center w-full gap-3 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                        >
                          <UserCircle size={18} />
                          <span>Profile</span>
                        </button>
                        <div className="border-t border-gray-200"></div>
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            signOut();
                          }}
                          className="flex items-center w-full gap-3 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;