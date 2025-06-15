import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Calendar, Tag, MessageCircle, CreditCard, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useItems } from '../contexts/ItemContext';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';

const ItemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getItemById } = useItems();
  const { user, isAuthenticated } = useAuth();
  const { createOrGetChat } = useChat();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const item = id ? getItemById(id) : null;

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Item not found</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-green-400 hover:text-green-300"
        >
          Back to marketplace
        </button>
      </div>
    );
  }

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Create or get existing chat with the seller
    const chatId = createOrGetChat(item.sellerId, item.sellerName);
    
    // Navigate to chat page
    navigate('/chat');
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/payment', { state: { item } });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'service':
        return 'text-blue-400 bg-blue-600/20 border-blue-600/50';
      case 'goods':
        return 'text-purple-400 bg-purple-600/20 border-purple-600/50';
      case 'rental':
        return 'text-orange-400 bg-orange-600/20 border-orange-600/50';
      default:
        return 'text-gray-400 bg-gray-600/20 border-gray-600/50';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'service':
        return 'Service';
      case 'goods':
        return 'For Sale';
      case 'rental':
        return 'For Rent';
      default:
        return category;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden">
            <img
              src={item.images[currentImageIndex]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {item.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {item.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            {!item.isAvailable && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">NOT AVAILABLE</span>
              </div>
            )}
          </div>
          
          {/* Thumbnail Images */}
          {item.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? 'border-green-500'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${item.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="space-y-6">
          {/* Category Badge */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(item.category)}`}>
            {getCategoryText(item.category)}
          </div>

          {/* Title and Price */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">{item.title}</h1>
            <div className="text-4xl font-bold text-green-400">
              ₹{item.price.toLocaleString()}
              {item.category === 'rental' && (
                <span className="text-lg text-gray-400 ml-2">/{item.rentalDuration}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
            <p className="text-gray-300 leading-relaxed">{item.description}</p>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Seller Information</h3>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-700 p-3 rounded-full">
                <User className="h-6 w-6 text-gray-300" />
              </div>
              <div>
                <div className="font-medium text-white">{item.sellerName}</div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{item.sellerRating} rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>Posted {new Date(item.datePosted).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                >
                  <Tag className="h-3 w-3" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Rental Agreement */}
          {item.category === 'rental' && (
            <div className="bg-orange-600/20 border border-orange-600/50 rounded-lg p-4">
              <h3 className="text-orange-400 font-medium mb-2">Rental Terms</h3>
              <p className="text-gray-300 text-sm">
                By renting this item, you agree to ensure no damage occurs during your use. 
                You will be fully liable for any damages caused and may be required to pay 
                for repairs or replacement.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {item.isAvailable && user?.id !== item.sellerId && (
            <div className="space-y-3">
              <button
                onClick={handleBuyNow}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-5 w-5" />
                <span>
                  {item.category === 'rental' ? 'Rent Now' : 'Buy Now'}
                </span>
              </button>
              <button
                onClick={handleContactSeller}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Contact Seller</span>
              </button>
            </div>
          )}

          {user?.id === item.sellerId && (
            <div className="bg-blue-600/20 border border-blue-600/50 rounded-lg p-4 text-center">
              <p className="text-blue-400 font-medium">This is your listing</p>
            </div>
          )}

          {!item.isAvailable && (
            <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-4 text-center">
              <p className="text-red-400 font-medium">This item is no longer available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;