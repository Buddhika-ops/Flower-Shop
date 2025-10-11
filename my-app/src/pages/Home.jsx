import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import PageLayout from '../components/layout/PageLayout';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';

const HomePage = () => {
  const navigate = useNavigate();
  const [freshBouquets, setFreshBouquets] = useState([]);
  const [seasonalSpecials, setSeasonalSpecials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetch 3 products from "Bouquets" category
      const { data: bouquets, error: bouquetsError } = await supabase
        .from('product_tbl')
        .select('*')
        .eq('category', 'Bouquets')
        .limit(3);

      if (bouquetsError) throw bouquetsError;

      // Fetch 3 products from "Seasonal" category
      const { data: seasonal, error: seasonalError } = await supabase
        .from('product_tbl')
        .select('*')
        .eq('category', 'Seasonal')
        .limit(3);

      if (seasonalError) throw seasonalError;

      setFreshBouquets(bouquets || []);
      setSeasonalSpecials(seasonal || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    // This would need to be implemented with cart context
    console.log('Add to cart:', product);
  };

  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section id='home'   className="relative flex items-center justify-center overflow-hidden rounded-3xl shadow-lg  mx-6 sm:mx-10 lg:mx-20 xl:mx-32 2xl:mx-40 h-[500px] mt-8 scroll-mt-28">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1487070183336-b863922373d4?w=1920&h=1080&fit=crop"
              alt="Beautiful flower arrangement"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          <div className="relative z-10 px-4 text-center text-white">
            <h1 className="mb-4 text-5xl font-bold md:text-6xl">
              Exquisite Blooms for Every Occasion
            </h1>
            <p className="max-w-2xl mx-auto mb-8 text-lg md:text-xl">
              Discover our curated collection of fresh, hand-crafted bouquets and arrangements, perfect for celebrations, love, and moments.
            </p>
            <Button onClick={() => navigate('/products')}>
              Shop Now
            </Button>
          </div>
        </section>

        {/* Fresh Bouquets Section */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-12 text-4xl font-bold text-center text-gray-900">Fresh Bouquets</h2>
            
            {loading ? (
              <div className="text-center text-gray-600">Loading...</div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {freshBouquets.map(product => (
                  <ProductCard 
                    key={product.product_id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                    showAddToCart={false}
                    className="transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  />
                ))}
              </div>
            )}

            {!loading && freshBouquets.length === 0 && (
              <p className="text-center text-gray-600">No bouquets available at the moment.</p>
            )}
          </div>
        </section>

        {/* Seasonal Specials Section */}
        <section className="px-4 py-16 bg-white">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-12 text-4xl font-bold text-center text-gray-900">Seasonal Specials</h2>
            
            {loading ? (
              <div className="text-center text-gray-600">Loading...</div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {seasonalSpecials.map(product => (
                  <ProductCard 
                    key={product.product_id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                    showAddToCart={false}
                    className="transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  />
                ))}
              </div>
            )}

            {!loading && seasonalSpecials.length === 0 && (
              <p className="text-center text-gray-600">No seasonal specials available at the moment.</p>
            )}
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="px-4 py-12 bg-white scroll-mt-20">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-10 text-center">
              
              <h2 className="mb-4 text-4xl font-bold text-gray-900">Where Flowers Tell a Story</h2>
              <p className="text-base leading-relaxed text-gray-600">
                At Petal & Bloom, we believe that flowers are more than just decorations; they are 
                expressions of emotion, symbols of love, and messengers of joy.
              </p>
            </div>

            {/* Story & Mission */}
            <div className="grid max-w-6xl gap-8 mx-auto mb-12 lg:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">Our Story</h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    Founded in 2018 by Amelia Hayes, Petal & Bloom started as a small, local flower shop 
                    with a big dream. Amelia's love for flowers and her desire to create meaningful connections 
                    through floral arrangements led her to establish a business that prioritizes quality, 
                    creativity, and customer satisfaction.
                  </p>
                </div>

                <div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">Our Mission</h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    Our mission is to inspire and delight our customers with the freshest, most beautiful 
                    flowers, arranged with care and artistry. We strive to exceed expectations, providing 
                    exceptional service and creating memorable experiences.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-full overflow-hidden shadow-lg h-80 rounded-3xl bg-gradient-to-br from-orange-200 to-rose-200">
                  <img
                    src="https://media.istockphoto.com/id/1289220545/photo/beautiful-woman-smiling-with-crossed-arms.jpg?s=612x612&w=0&k=20&c=qmOTkGstKj1qN0zPVWj-n28oRA6_BHQN8uVLIXg0TF8="
                    alt="Founder"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Why Choose Us */}
            <div>
              <h3 className="mb-8 text-3xl font-bold text-center text-gray-900">Why Choose Us</h3>
              
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full">
                    <div className="w-8 h-8 text-pink-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="mb-2 text-lg font-bold text-gray-900">Quality & Freshness</h4>
                  <p className="text-sm text-gray-600">
                    We source only the finest, freshest flowers, ensuring that every arrangement is vibrant 
                    and long-lasting.
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full">
                    <div className="w-8 h-8 text-pink-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="mb-2 text-lg font-bold text-gray-900">Artistry & Creativity</h4>
                  <p className="text-sm text-gray-600">
                    Our skilled florists bring a unique touch to each design, creating stunning arrangements 
                    that reflect your personal style.
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full">
                    <div className="w-8 h-8 text-pink-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="mb-2 text-lg font-bold text-gray-900">Customer Care</h4>
                  <p className="text-sm text-gray-600">
                    We are dedicated to providing exceptional customer service, from personalized consultations 
                    to timely delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
         </section>



        {/* Contact Section */}
        <section id="contact" className="min-h-screen px-4 py-16 bg-gray-50">
          <div className="grid max-w-6xl gap-12 mx-auto mt-8 lg:grid-cols-2">
            {/* Left Side - Contact Form */}
            <div>
              <h2 className="mb-4 text-5xl font-bold text-gray-900">Get in Touch</h2>
              <p className="mb-8 text-gray-600">
                We'd love to hear from you. Whether you have a question about our arrangements, 
                events, or anything else, our team is ready to answer all your questions.
              </p>

              <form className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="(415) 555-1234"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    rows="6"
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                  ></textarea>
                </div>

                <Button type="submit">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Right Side - Map & Info */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <div className="w-full max-w-2xl mx-auto overflow-hidden border-4 border-pink-200 rounded-3xl">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d988.7758938987253!2d80.58829237452791!3d7.563685378239468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2slk!4v1759734360719!5m2!1sen!2slk"
    width="100%"
    height="254"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Petal & Bloom Location"
  ></iframe>
</div>

              {/* Visit Our Shop */}
              <div>
                <h3 className="mb-3 text-3xl font-bold text-gray-900">Visit Our Shop</h3>
                <p className="text-gray-600">123 Rose Lane, San Francisco, CA 94102</p>
              </div>

              {/* Contact Us */}
              <div>
                <h3 className="mb-3 text-3xl font-bold text-gray-900">Contact Us</h3>
                <p className="text-gray-600">hello@petalandbloom.com</p>
                <p className="text-gray-600">(415) 555-1234</p>
              </div>
            </div>
          </div>
        </section>
      </div>

               
                {/* Footer CTA */}
                <section className="px-4 py-16 mt-6 mb-10 bg-gradient-to-br from-rose-100 via-pink-50 to-orange-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Ready to Brighten Someone's Day?</h2>
            <p className="mb-8 text-lg text-gray-600">
              Browse our full collection and find the perfect arrangement
            </p>
            <Button onClick={() => navigate('/products')}>
              View All Products
            </Button>
          </div>
        </section>
    </PageLayout>
  );
};

export default HomePage;