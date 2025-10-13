import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import BackButton from '../components/common/BackButton';
import FormInput from '../components/forms/FormInput';
import Button from '../components/ui/Button';

const ProfilePage = () => {
  const { user, customerData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone_number: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customerData) {
      setFormData({
        customer_name: customerData.customer_name || '',
        email: customerData.email || '',
        phone_number: customerData.phone_number || '',
      });
    }
  }, [customerData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
     
      const { error } = await supabase
        .from('customer_tbl')
        .update({
          customer_name: formData.customer_name,
          phone_number: formData.phone_number,
        })
        .eq('customer_id', customerData.customer_id);
      
      if (error) throw error;
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      customer_name: customerData.customer_name || '',
      email: customerData.email || '',
      phone_number: customerData.phone_number || '',
    });
    setIsEditing(false);
  };

  return (
    <PageLayout>
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="container px-6 mx-auto">
          <BackButton onClick={() => navigate('/products')} />
          <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-2 text-gray-600">Manage your account information</p>
          </div>

          {/* Profile Card */}
          <div className="overflow-hidden bg-white rounded-lg shadow-md">
            {/* Profile Header */}
            <div className="px-8 py-12 bg-gradient-to-r from-pink-500 to-pink-600">
              <div className="flex items-center gap-6">
                <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full">
                  <User className="text-pink-500" size={48} />
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{customerData?.customer_name}</h2>
                  <p className="mt-1 text-pink-100">{customerData?.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="px-8 py-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="small"
                  >
                    <Edit2 size={18} className="mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCancel}
                      variant="secondary"
                      size="small"
                    >
                      <X size={18} className="mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      loading={loading}
                      size="small"
                    >
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Customer Name */}
                <FormInput
                  label="Full Name"
                  icon={User}
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  className={!isEditing ? "bg-gray-50" : ""}
                  disabled={!isEditing}
                />

                {/* Email */}
                <FormInput
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  value={formData.email}
                  className="bg-gray-50"
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>

                {/* Phone Number */}
                <FormInput
                  label="Phone Number"
                  icon={Phone}
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className={!isEditing ? "bg-gray-50" : ""}
                  disabled={!isEditing}
                />

                {/* Account Status */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Account Status
                  </label>
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                    {customerData?.status || 'Active'}
                  </span>
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

export default ProfilePage;
