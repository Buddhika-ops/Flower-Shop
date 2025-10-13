import React, { useEffect, useState } from 'react'
import { supabase } from '../../../../supabase';
import ImageField from '../Insert/ImageField';

const UpdateForm = ({productId = 1, onBack}) => {
    
  const [product, setProduct] = useState({
    product_id: '',
    product: '',
    description: '',
    category: '',
    price: '',
    discount: '',
    size: '',
    flowers_included: '',
    vase_included: '',
    care_instructions: '',
    stocks:'',
    image_url: '',
    created_at: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const {data, error} = await supabase
        .from('product_tbl')
        .select('*')
        .eq('product_id', productId)
        .single()

      if (error) throw error;
      if (data) setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setMessage(`Error fetching product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.product || !product.description || !product.category || !product.price || !product.discount) {
      setMessage('Please fill all the fields')
      return;
    }
    
    setUpdating(true);
    setMessage('');

    try {
      let imageUrl = product.image_url;

      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const {data: uploadingData, error: storageError} = await supabase.storage
          .from('productImages')
          .upload(fileName, imageFile);

        if (storageError) {
          console.error('Storage error:', storageError)
          throw storageError
        } else {
          console.log('Image upload successfully!', uploadingData)
        }

        const {data} = supabase.storage.from('productImages').getPublicUrl(fileName);
        imageUrl = data.publicUrl; 
      }

      const {data: updateData, error: dbError} = await supabase
        .from('product_tbl')
        .update({
          product: product.product,
          description: product.description,
          category: product.category,
          price: product.price,
          discount: product.discount,
          size: product.size,
          flowers_included: product.flowers_included,
          vase_included: product.vase_included,
          care_instructions: product.care_instructions,
          stocks:product.stocks,
          image_url: imageUrl
        })
        .eq('product_id', productId)
        .select();

      if (dbError) {
        console.error('database updating error:', dbError);
        throw dbError;
      }
      
      setMessage('Product updated successfully!');
      console.log('update data', updateData);
      setImageFile(null);
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage(`Error updating product: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-5 text-2xl font-bold">Update Product</div>
      
      <div className="grid grid-cols-2 gap-5">
        {/* Left Column - Form Fields */}
        <div className="ml-5">
          <label htmlFor="product" className="block mb-2">Product Name</label>
          <input
            type="text"
            name='product'
            value={product.product}
            onChange={handleInputChange}
            className="flex w-full p-2 mb-8 border rounded"
            placeholder="Enter Product Name Here.."
          />

          <label htmlFor="description" className="block mb-2">Description</label>
          <textarea
            value={product.description}
            onChange={handleInputChange}
            name="description"
            id="description"
            placeholder="Enter Product Description Here..."
            className="flex w-full p-2 mb-4 border rounded"
            rows="4"
          />
          
          <label htmlFor="category" className="block mb-2">Category</label>
          <select
            name="category"
            id="category"
            className="flex w-full p-2 mb-4 border rounded appearance-none"
            value={product.category}
            onChange={handleInputChange}
          >
            <option value="">Select Category</option>
            <option value="Bouquets">Bouquets</option>
            <option value="Seasonal">Seasonal</option>
            <option value="Wedding">Wedding</option>
            <option value="Gift">Gift</option>
          </select>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block mb-2">Price</label>
              <input
                type="text"
                name="price"
                className="flex w-full p-2 mb-4 border rounded"
                placeholder="Rs.0.00"
                value={product.price}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="discount" className="block mb-2">Discount</label>
              <select
                name="discount"
                id="discount"
                className="flex w-full p-2 mb-4 border rounded appearance-none"
                value={product.discount}
                onChange={handleInputChange}
              >
                <option value="">Select Discount</option>
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="15">15%</option>
                <option value="20">20%</option>
                <option value="25">25%</option>
              </select>
            </div>
          </div>

          <label htmlFor="size" className="block mb-2">Arrangement Size</label>
          <input
            name="size"
            type="text"
            value={product.size}
            onChange={handleInputChange}
            className="flex w-full p-2 mb-4 border rounded"
            placeholder="Enter Product Arrangement Size Here.."
          />

          <label htmlFor="flowers_included" className="block mb-2">Flowers Included</label>
          <input
            name="flowers_included"
            type="text"
            value={product.flowers_included}
            onChange={handleInputChange}
            className="flex w-full p-2 mb-4 border rounded"
            placeholder="Enter Product Flowers Included Here.."
          />

          <label htmlFor="vase_included" className="block mb-2">Vase Included</label>
          <input
            name="vase_included"
            type="text"
            value={product.vase_included}
            onChange={handleInputChange}
            className="flex w-full p-2 mb-4 border rounded"
            placeholder="Enter Product Vase Included Here.."
          />

          <label htmlFor="care_instructions" className="block mb-2">Care Instructions</label>
          <input
            name="care_instructions"
            type="text"
            value={product.care_instructions}
            onChange={handleInputChange}
            className="flex w-full p-2 mb-4 border rounded"
            placeholder="Enter Product Care Instructions Here.."
          />
          <label htmlFor="stocks" className="grid grid-cols-2 gap-5">
           Stocks
          </label>
          <input
            name="stocks"
            type="text"
            value={product.stocks}
            onChange={handleInputChange}
            className="flex w-full p-2 mt-2 mb-4 border rounded"
            placeholder="Enter Product Stocks Here.."
          />

        </div>
        
        {/* Right Column - Image Field and Buttons */}
        <div className="mr-5 space-y-6">
          <ImageField 
            onImageSelect={setImageFile} 
            initialImageUrl={product.image_url}
          />
          
          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 h-12 text-gray-700 transition-colors bg-gray-200 border rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className={`flex-1 h-12 text-white bg-blue-400 border rounded-lg hover:bg-blue-600 ${
                updating ? 'cursor-not-allowed bg-blue-200 hover:bg-blue-200' : ''
              }`}
              onClick={handleSubmit}
              disabled={updating}
            >
              {updating ? "Updating..." : "Update Product"}
            </button>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`mt-6 mx-5 py-3 px-4 rounded-md ${
            message.includes('Error') || message.includes('Please fill')
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}
        >
          <span className="font-medium">{message}</span>
        </div>
      )}
    </div>
  );
}

export default UpdateForm