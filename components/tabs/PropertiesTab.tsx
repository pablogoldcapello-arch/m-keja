"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import PropertiesGrid from '../property/PropertiesGrid';

/* ---------- interfaces ---------- */
interface Property {
  id: string;
  name: string;
  type: string;
  location: string;
  price: number;
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  rating: number;
  featured: boolean;
  //images?: string[];
}

interface PropertiesResponse {
  properties: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/* ---------- component ---------- */
export default function PropertiesTab() {
  const { user } = useAuth();

  /* data */
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* filters */
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const propertyTypes = [
    'all',
    'apartment', 'maisonette', 'bedsitter', 'studio', 'bungalow',
    'townhouse', 'office', 'shop', 'warehouse', 'land'
  ];

  const cities = [
    'all',
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
    'Thika', 'Malindi', 'Kitale', 'Kakamega', 'Nyeri'
  ];

  const bedroomOptions = ['all', '1', '2', '3', '4', '5+'];

  /* fetch properties */
  useEffect(() => {
    fetchProperties();
  }, [searchTerm, selectedType, selectedCity, minPrice, maxPrice, bedrooms, sortBy]);

  /*const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchTerm) params.append('search', searchTerm);
      if (selectedType !== 'all') params.append('type', selectedType);
      if (selectedCity !== 'all') params.append('city', selectedCity);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (bedrooms !== 'all') params.append('bedrooms', bedrooms);
      params.append('sort', sortBy);

      const response = await fetch(`/api/properties?${params}`);

      if (!response.ok) throw new Error('Failed to fetch properties');

      const data: PropertiesResponse = await response.json();
      setProperties(data.properties);
    } catch (err) {
      setError('Failed to load properties. Please try again.');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };*/
const fetchProperties = async () => {
  try {
    setLoading(true);
    const params = new URLSearchParams();

    if (searchTerm) params.append('search', searchTerm);
    if (selectedType !== 'all') params.append('type', selectedType);
    if (selectedCity !== 'all') params.append('city', selectedCity);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (bedrooms !== 'all') params.append('bedrooms', bedrooms);
    params.append('sort', sortBy);

    const response = await fetch(`/api/properties?${params}`);

    if (!response.ok) throw new Error('Failed to fetch properties');

    const data: PropertiesResponse = await response.json();

    // 🔥 Log the raw data from the API
    console.log('Raw API response:', data);

    setProperties(data.properties);
  } catch (err) {
    setError('Failed to load properties. Please try again.');
    console.error('Error fetching properties:', err);
  } finally {
    setLoading(false);
  }
};



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties Marketplace</h1>
          <p className="text-gray-600 mt-2">Discover your perfect home from our curated listings</p>
        </div>

        {(user?.role === 'landlord' || user?.role === 'agent') && (
          <Link
            href="/create-property"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            List Property
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Properties</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by property name, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city === 'all' ? 'All Cities' : city}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Additional Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {/* Bedrooms Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {bedroomOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'all' ? 'Any Bedrooms' : `${option} ${option === '5+' ? '' : 'Bedrooms'}`}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="md:col-span-3 flex items-end justify-end">
            <div className="flex items-center gap-2 w-full">
              <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="bedrooms">Most Bedrooms</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setSelectedCity('all');
              setMinPrice('');
              setMaxPrice('');
              setBedrooms('all');
              setSortBy('newest');
            }}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m2-10h-2m2-2h-2m-2 2H9m2-2H9m2 2H9m2-2H9m2 2H9m2-2H9" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or check back later.</p>
          {(user?.role === 'landlord' || user?.role === 'agent') && (
            <Link
              href="/create-property"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              List Your First Property
            </Link>
          )}
        </div>
      ) : (
        <PropertiesGrid properties={properties} /> 
      )}
    </div>
  );
}