"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  priceType: 'fixed' | 'hourly' | 'negotiable';
  location: string;
  coverage: string[];
  availability: string[];
  experience: string;
  qualifications: string[];
  images: string[];
  serviceProvider: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  rating: number;
  reviews: number;
  isVerified: boolean;
  createdAt: string;
}

interface ServicesResponse {
  services: Service[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function ServicesTab() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const serviceCategories = [
    'all',
    'Plumbing', 'Electrical', 'Cleaning', 'Painting', 'Carpentry',
    'HVAC', 'Landscaping', 'Moving', 'Pest Control', 'Appliance Repair',
    'Internet', 'Security', 'Baby Sitting', 'Cooking', 'Driving'
  ];

  const locations = [
    'all',
    'Nairobi', 'Westlands', 'Kilimani', 'Karen', 'Langata',
    'Eastleigh', 'South B', 'South C', 'Parklands', 'Upper Hill'
  ];

  useEffect(() => {
    fetchServices();
  }, [searchTerm, selectedCategory, selectedLocation, sortBy]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedLocation !== 'all') params.append('location', selectedLocation);
      params.append('sort', sortBy);

      const response = await fetch(`/api/services?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      const data: ServicesResponse = await response.json();
      setServices(data.services);
    } catch (err) {
      setError('Failed to load services. Please try again.');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, priceType: string) => {
    switch (priceType) {
      case 'hourly':
        return `KSh ${price.toLocaleString()}/hour`;
      case 'negotiable':
        return `KSh ${price.toLocaleString()} (Negotiable)`;
      default:
        return `KSh ${price.toLocaleString()}`;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services Marketplace</h1>
          <p className="text-gray-600 mt-2">Find trusted service providers for all your needs</p>
        </div>
        
        {(user?.role === 'tenant' || user?.role === 'landlord' || user?.role === 'agent') && (
          <Link
            href="/services/request"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Request a Service
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Services</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by service name, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {serviceCategories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location === 'all' ? 'All Locations' : location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort and Results */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            {services.length} {services.length === 1 ? 'service' : 'services'} found
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Service Image */}
              <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 relative">
                {service.images.length > 0 ? (
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m2-10h-2m2-2h-2m-2 2H9m2-2H9m2 2H9m2-2H9m2 2H9m2-2H9" />
                    </svg>
                  </div>
                )}
                
                {/* Verified Badge */}
                {service.isVerified && (
                  <div className="absolute top-3 right-3 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Verified
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {service.category}
                </div>
              </div>

              {/* Service Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                    {service.title}
                  </h3>
                  <div className="text-2xl font-bold text-indigo-600">
                    {formatPrice(service.price, service.priceType)}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>

                {/* Provider Info *
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {service.serviceProvider.firstName.charAt(0)}{service.serviceProvider.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {service.serviceProvider.firstName} {service.serviceProvider.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{service.location}</p>
                  </div>
                </div>*/}

                {/* Provider Info */}
                <div className="flex items-center gap-3 mb-4">
                  {service.serviceProvider ? (
                    <>
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {service.serviceProvider.firstName?.charAt(0) ?? ''}
                        {service.serviceProvider.lastName?.charAt(0) ?? ''}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {service.serviceProvider.firstName} {service.serviceProvider.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{service.location}</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500">Provider information unavailable</div>
                  )}
                </div>

                {/* Rating and Experience */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(service.rating)}
                    <span className="ml-1">({service.reviews})</span>
                  </div>
                  <span>{service.experience} experience</span>
                </div>

                {/* Availability */}
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700">Available: </span>
                  <span className="text-sm text-gray-600">
                    {service.availability.slice(0, 2).join(', ')}
                    {service.availability.length > 2 && '...'}
                  </span>
                </div>

                {/* Qualifications */}
                {service.qualifications.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {service.qualifications.slice(0, 3).map((qualification) => (
                        <span
                          key={qualification}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {qualification}
                        </span>
                      ))}
                      {service.qualifications.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{service.qualifications.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
                    Contact Provider
                  </button>
                  <button className="flex-1 border border-indigo-600 text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-50 transition text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button (for pagination) */}
      {services.length > 0 && (
        <div className="text-center">
          <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition">
            Load More Services
          </button>
        </div>
      )}
    </div>
  );
}