import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Calendar, Tag } from 'lucide-react';
import { Item } from '../contexts/ItemContext';

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'service':
        return 'bg-blue-600';
      case 'goods':
        return 'bg-purple-600';
      case 'rental':
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
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
    <Link to={`/item/${item.id}`} className="block group">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full text-white ${getCategoryColor(item.category)}`}>
            {getCategoryText(item.category)}
          </div>
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">SOLD OUT</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
            {item.title}
          </h3>
          
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {item.description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl font-bold text-green-400">
              ₹{item.price.toLocaleString()}
              {item.category === 'rental' && (
                <span className="text-sm text-gray-400 ml-1">/{item.rentalDuration}</span>
              )}
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
            <div className="flex items-center space-x-1">
              <span>{item.sellerName}</span>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span>{item.sellerRating}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{item.location}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded-full">
                  <Tag className="h-2 w-2" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>{new Date(item.datePosted).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;