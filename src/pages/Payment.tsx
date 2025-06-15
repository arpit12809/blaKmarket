import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Coins, Truck, ShieldCheck, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const item = location.state?.item;

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No item selected for payment</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-green-400 hover:text-green-300"
        >
          Back to marketplace
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Please log in to make a purchase</p>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
    }, 2000);
  };

  const handleComplete = () => {
    navigate('/');
  };

  if (paymentComplete) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
          <div className="bg-green-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Order Confirmed!</h1>
          <p className="text-gray-300 mb-6">
            Your {item.category === 'rental' ? 'rental' : 'purchase'} of "{item.title}" has been confirmed.
          </p>
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Payment Method:</span>
              <span className="text-green-400 font-medium">
                {paymentMethod === 'points' ? 'Points' : 'Cash on Delivery'}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Amount:</span>
              <span className="text-green-400 font-bold">₹{item.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Order ID:</span>
              <span className="text-white font-mono text-sm">#ORD{Date.now()}</span>
            </div>
          </div>
          {paymentMethod === 'cash' && (
            <div className="bg-orange-600/20 border border-orange-600/50 rounded-lg p-4 mb-6">
              <p className="text-orange-400 font-medium mb-2">Cash on Delivery</p>
              <p className="text-gray-300 text-sm">
                Please have the exact amount ready when the seller contacts you for delivery.
              </p>
            </div>
          )}
          <p className="text-gray-400 text-sm mb-6">
            The seller has been notified and will contact you shortly with delivery details.
          </p>
          <button
            onClick={handleComplete}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const platformFee = Math.round(item.price * 0.05);
  const totalAmount = item.price + platformFee;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-white">Complete Order</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
          
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-white font-medium">{item.title}</h3>
              <p className="text-gray-400 text-sm">by {item.sellerName}</p>
              <p className="text-gray-400 text-sm">{item.location}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">
                {item.category === 'rental' ? 'Rental Price' : 'Item Price'}:
              </span>
              <span className="text-white">₹{item.price.toLocaleString()}</span>
            </div>
            {item.category === 'rental' && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white">{item.rentalDuration}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Platform Fee:</span>
              <span className="text-white">₹{platformFee}</span>
            </div>
            <hr className="border-gray-600" />
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-white">Total:</span>
              <span className="text-green-400">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {item.category === 'rental' && (
            <div className="bg-orange-600/20 border border-orange-600/50 rounded-lg p-4">
              <h3 className="text-orange-400 font-medium mb-2">Rental Agreement</h3>
              <p className="text-gray-300 text-sm">
                By proceeding with this rental, you agree to take full responsibility 
                for the item during the rental period and will be liable for any damages.
              </p>
            </div>
          )}
        </div>

        {/* Payment Options */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Payment Method</h2>

          {/* Payment Methods */}
          <div className="space-y-4 mb-6">
            <div className="border border-gray-600 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <input
                  type="radio"
                  id="cash"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-green-600 focus:ring-green-500"
                />
                <label htmlFor="cash" className="flex items-center space-x-2 text-white font-medium">
                  <Truck className="h-5 w-5 text-orange-400" />
                  <span>Cash on Delivery</span>
                </label>
              </div>
              <p className="text-gray-400 text-sm ml-8">
                Pay with cash when the item is delivered to you. Most convenient and secure option.
              </p>
            </div>

            <div className="border border-gray-600 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <input
                  type="radio"
                  id="points"
                  name="payment"
                  value="points"
                  checked={paymentMethod === 'points'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-green-600 focus:ring-green-500"
                  disabled={user.points < totalAmount}
                />
                <label htmlFor="points" className={`flex items-center space-x-2 font-medium ${
                  user.points < totalAmount ? 'text-gray-500' : 'text-white'
                }`}>
                  <Coins className="h-5 w-5 text-green-400" />
                  <span>Use Points</span>
                </label>
              </div>
              <div className="ml-8">
                <p className={`text-sm mb-2 ${user.points < totalAmount ? 'text-gray-500' : 'text-gray-400'}`}>
                  Available: {user.points} points | Required: {totalAmount} points
                </p>
                {user.points < totalAmount && (
                  <p className="text-red-400 text-sm">
                    Insufficient points. You need {totalAmount - user.points} more points.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Points Payment Details */}
          {paymentMethod === 'points' && user.points >= totalAmount && (
            <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4 mb-6">
              <p className="text-green-400 font-medium mb-2">Pay with Points</p>
              <p className="text-gray-300 text-sm mb-2">
                You will use {totalAmount} points for this {item.category === 'rental' ? 'rental' : 'purchase'}.
              </p>
              <p className="text-gray-300 text-sm">
                Remaining balance: {user.points - totalAmount} points
              </p>
            </div>
          )}

          {/* Cash on Delivery Details */}
          {paymentMethod === 'cash' && (
            <div className="bg-orange-600/20 border border-orange-600/50 rounded-lg p-4 mb-6">
              <p className="text-orange-400 font-medium mb-2">Cash on Delivery</p>
              <p className="text-gray-300 text-sm mb-2">
                The seller will contact you to arrange delivery. Please have the exact amount ready.
              </p>
              <p className="text-gray-300 text-sm">
                Amount to pay: ₹{totalAmount.toLocaleString()}
              </p>
            </div>
          )}

          {/* Security */}
          <div className="flex items-center space-x-2 mb-6">
            <ShieldCheck className="h-5 w-5 text-green-400" />
            <span className="text-gray-300 text-sm">Your transaction is protected by blaK Market's buyer protection policy</span>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing || (paymentMethod === 'points' && user.points < totalAmount)}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing Order...</span>
              </div>
            ) : (
              `Confirm Order - ${paymentMethod === 'points' ? `${totalAmount} Points` : `₹${totalAmount.toLocaleString()}`}`
            )}
          </button>

          {paymentMethod === 'points' && user.points < totalAmount && (
            <p className="text-center text-gray-400 text-sm mt-3">
              Earn more points by providing services or receiving good ratings!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;