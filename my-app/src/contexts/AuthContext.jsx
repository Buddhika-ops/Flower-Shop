import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check user on mount & listen for auth state changes
  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await handleUser(session.user);
        } else {
          setUser(null);
          setCustomerData(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ✅ Verify user session and fetch data
  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await handleUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle user record loading (no redirect here!)
  const handleUser = async (user) => {
    try {
      const { data, error } = await supabase
        .from('customer_tbl')
        .select('*')
        .eq('customer_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data && data.status === 'disable') {
        await supabase.auth.signOut();
        setUser(null);
        setCustomerData(null);
        throw new Error('Your account has been suspended. Please contact support.');
      }

      setUser(user);
      setCustomerData(
        data || { status: 'active', role: 'customer', customer_name: user.email.split('@')[0] }
      );
    } catch (error) {
      console.error('User data load error:', error.message);
    }
  };

  // ✅ Sign Up new user
  const signUp = async (email, password, name, phone) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;

      if (data.user) {
        const { error: upsertError } = await supabase
          .from('customer_tbl')
          .upsert(
            {
              customer_id: data.user.id,
              customer_name: name,
              email,
              phone_number: phone || null,
              status: 'active',
              role: 'customer', // Default role
            },
            { onConflict: 'customer_id' }
          );

        if (upsertError) throw upsertError;

        setUser(data.user);
        setCustomerData({ status: 'active', customer_name: name, role: 'customer' });
      }

      return { data, error: null };
    } catch (error) {
      console.error('Signup error:', error.message);
      return { data: null, error };
    }
  };

  // ✅ Sign In user + redirect based on role
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { data: customerData, error: customerError } = await supabase
        .from('customer_tbl')
        .select('status, customer_name, role')
        .eq('customer_id', data.user.id)
        .single();

      if (customerError && customerError.code !== 'PGRST116') throw customerError;

      if (customerData && customerData.status === 'disable') {
        await supabase.auth.signOut();
        return {
          data: null,
          error: new Error('Your account has been suspended. Please contact support.'),
        };
      }

      setUser(data.user);
      setCustomerData(
        customerData || {
          status: 'active',
          role: 'customer',
          customer_name: data.user.email.split('@')[0],
        }
      );

      // ✅ Redirect based on role
      if (customerData?.role === 'admin') {
        window.location.replace('/home');
      } else {
        window.location.replace('/home');
      }

      return { data, error: null };
    } catch (error) {
      console.error('SignIn error:', error.message);
      return { data: null, error };
    }
  };

  // ✅ Sign Out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setCustomerData(null);

      // Go back to home after logout
      window.location.replace('/home');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };
  supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    localStorage.setItem('supabase.auth.token', JSON.stringify(session));
  } else {
    localStorage.removeItem('supabase.auth.token');
  }
});


  return (
    <AuthContext.Provider value={{ user, customerData, signUp, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};