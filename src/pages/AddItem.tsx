import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus } from 'lucide-react';
import { useItems } from '../contexts/ItemContext';
import { useAuth } from '../contexts/AuthContext';

const AddItem: React.FC = () => {
  const { addItem } = useItems();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'goods' as 'service' | 'goods' | 'rental',
    subcategory: '',
    location: '',
    rentalDuration: '',
    tags: ['']
  });
  const [images, setImages] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);

  const categoryOptions = {
    service: [
      { value: 'assignments', label: 'Assignment Help' },
      { value: 'tutoring', label: 'Tutoring' },
      { value: 'projects', label: 'Project Work' },
      { value: 'other', label: 'Other Services' }
    ],
    goods: [
      { value: 'tech', label: 'Technology' },
      { value: 'books', label: 'Books & Notes' },
      { value: 'apparel', label: 'Clothing & Apparel' },
      { value: 'snacks', label: 'Food & Snacks' },
      { value: 'other', label: 'Other Items' }
    ],
    rental: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'books', label: 'Books & Notes' },
      { value: 'equipment', label: 'Equipment' },
      { value: 'other', label: 'Other Rentals' }
    ]
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const newItem = {
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price),
        category: formData.category,
        subcategory: formData.subcategory,
        images: images.filter(img => img.trim()),
        sellerId: user.id,
        sellerName: user.name,
        sellerRating: user.rating,
        location: formData.location,
        isAvailable: true,
        tags: formData.tags.filter(tag => tag.trim()),
        ...(formData.category === 'rental' && { rentalDuration: formData.rentalDuration })
      };
      
      addItem(newItem);
      navigate('/');
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageField = () => {
    setImages([...images, '']);
  };

  const removeImageField = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const addTagField = () => {
    setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }));
  };

  const removeTagField = (index: number) => {
    if (formData.tags.length > 1) {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.filter((_, i) => i !== index)
      }));
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Please log in to add an item.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Add New Item</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter item title"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your item in detail"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="goods">For Sale</option>
              <option value="service">Service</option>
              <option value="rental">For Rent</option>
            </select>
          </div>

          {/* Subcategory */}
          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-300 mb-2">
              Subcategory *
            </label>
            <select
              id="subcategory"
              name="subcategory"
              required
              value={formData.subcategory}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select subcategory</option>
              {categoryOptions[formData.category].map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
              Price (₹) *
              {formData.category === 'rental' && (
                <span className="text-gray-400 text-xs ml-2">per rental period</span>
              )}
            </label>
            <input
              id="price"
              name="price"
              type="number"
              required
              min="0"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Rental Duration */}
          {formData.category === 'rental' && (
            <div>
              <label htmlFor="rentalDuration" className="block text-sm font-medium text-gray-300 mb-2">
                Rental Duration *
              </label>
              <select
                id="rentalDuration"
                name="rentalDuration"
                required
                value={formData.rentalDuration}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select duration</option>
                <option value="per hour">Per Hour</option>
                <option value="per day">Per Day</option>
                <option value="per week">Per Week</option>
                <option value="per month">Per Month</option>
              </select>
            </div>
          )}

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
              Location *
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Hostel A, Library, Campus"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Images (URLs) *
            </label>
            {images.map((image, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required={index === 0}
                />
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add another image</span>
            </button>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  placeholder="e.g., programming, electronics, textbook"
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {formData.tags.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTagField(index)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTagField}
              className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add another tag</span>
            </button>
          </div>

          {/* Rental Agreement */}
          {formData.category === 'rental' && (
            <div className="bg-orange-600/20 border border-orange-600/50 rounded-lg p-4">
              <h3 className="text-orange-400 font-medium mb-2">Rental Agreement</h3>
              <p className="text-gray-300 text-sm">
                By listing this item for rent, you agree that the renter will be fully liable for any damages 
                caused during their use. Please ensure you communicate clear terms with the renter regarding 
                the condition and expected care of the item.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {isLoading ? 'Adding Item...' : 'Add Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;