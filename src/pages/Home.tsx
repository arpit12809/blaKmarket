import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List } from 'lucide-react';
import { useItems } from '../contexts/ItemContext';
import ItemCard from '../components/ItemCard';

const Home: React.FC = () => {
  const { items, searchItems, filterByCategory } = useItems();
  const [searchParams] = useSearchParams();
  const [filteredItems, setFilteredItems] = useState(items);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    let filtered = items;

    if (searchQuery) {
      filtered = searchItems(searchQuery);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  }, [items, searchParams, selectedCategory, searchItems]);

  const categories = [
    { id: 'all', name: 'All Items', count: items.length },
    { id: 'service', name: 'Services', count: items.filter(i => i.category === 'service').length },
    { id: 'goods', name: 'Goods', count: items.filter(i => i.category === 'goods').length },
    { id: 'rental', name: 'Rentals', count: items.filter(i => i.category === 'rental').length }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to bla<span className="text-green-500">K</span> Market
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          The ultimate marketplace for KIIT students - Buy, Sell, Rent & Connect
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-blue-400 text-3xl font-bold mb-2">{items.filter(i => i.category === 'service').length}</div>
            <div className="text-gray-300">Services Available</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-purple-400 text-3xl font-bold mb-2">{items.filter(i => i.category === 'goods').length}</div>
            <div className="text-gray-300">Items for Sale</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-orange-400 text-3xl font-bold mb-2">{items.filter(i => i.category === 'rental').length}</div>
            <div className="text-gray-300">Rentals Available</div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Items Grid */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
      }`}>
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No items found</div>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;