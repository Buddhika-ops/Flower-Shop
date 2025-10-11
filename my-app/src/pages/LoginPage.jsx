import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/forms/FormInput';
import Button from '../components/ui/Button';

const LoginPage = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await signIn(email, password);
        if (error) throw error;
        navigate('/home');
      } else {
        if (!name.trim()) throw new Error('Name is required');
        const { data, error } = await signUp(email, password, name, phone);
        if (error) throw error;
        navigate('/home');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-orange-50">
      {/* Decorative Floral Background */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <img 
          src="https://images.pexels.com/photos/1369280/pexels-photo-1369280.jpeg" 
          alt="Floral background"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="p-10 bg-white shadow-2xl backdrop-blur-sm rounded-3xl bg-opacity-95">
          <h1 className="mb-2 text-4xl font-bold text-center text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mb-8 text-center text-gray-600">
            {isLogin ? 'Login to continue your floral journey.' : 'Sign up to start your floral journey.'}
          </p>

          {error && (
            <div className="p-4 mb-6 text-red-600 rounded-2xl bg-red-50">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <FormInput
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Name"
                  required
                />
                <FormInput
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Phone (Optional)"
                />
              </>
            )}

            <FormInput
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email or Username"
              required
            />

            <FormInput
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={6}
            />

            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              className="w-full mt-4"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="font-semibold text-pink-600 hover:text-pink-700"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;