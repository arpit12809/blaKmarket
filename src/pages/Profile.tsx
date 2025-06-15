import React from 'react';
import { Star, Award, ShoppingBag, MessageCircle, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useItems } from '../contexts/ItemContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { items } = useItems();

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  const userItems = items.filter(item => item.sellerId === user.id);
  const activeItems = userItems.filter(item => item.isAvailable);
  const soldItems = userItems.filter(item => !item.isAvailable);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
        <div className="flex items-center space-x-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-full">
            <span className="text-2xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
            <p className="text-gray-400 mb-4">{user.email}</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-white font-medium">
                  {user.rating > 0 ? user.rating : 'No ratings yet'}
                </span>
                {user.reviewCount > 0 && (
                  <span className="text-gray-400">({user.reviewCount} reviews)</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-green-400" />
                <span className="text-white font-medium">{user.points} Points</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-600/20 p-3 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{activeItems.length}</div>
              <div className="text-gray-400">Active Listings</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-600/20 p-3 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{soldItems.length}</div>
              <div className="text-gray-400">Sold Items</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600/20 p-3 rounded-lg">
              <MessageCircle className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-gray-400">Messages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Points System */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Points & Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Current Points</h3>
            <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 rounded-lg">
              <div className="text-3xl font-bold text-white">{user.points}</div>
              <div className="text-green-100">Available Points</div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Earn More Points</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Complete a service</span>
                <span className="text-green-400">+50 points</span>
              </div>
              <div className="flex justify-between">
                <span>Receive 5-star rating</span>
                <span className="text-green-400">+25 points</span>
              </div>
              <div className="flex justify-between">
                <span>Refer a friend</span>
                <span className="text-green-400">+100 points</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Listings */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">My Listings</h2>
        {userItems.length > 0 ? (
          <div className="space-y-4">
            {userItems.map(item => (
              <div key={item.id} className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-white font-medium">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.description.slice(0, 100)}...</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(item.datePosted).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">₹{item.price.toLocaleString()}</div>
                    <div className={`text-sm px-2 py-1 rounded-full ${
                      item.isAvailable 
                        ? 'bg-green-600/20 text-green-400'
                        : 'bg-red-600/20 text-red-400'
                    }`}>
                      {item.isAvailable ? 'Active' : 'Sold'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">No listings yet</div>
            <p className="text-gray-500">Start selling to see your listings here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;