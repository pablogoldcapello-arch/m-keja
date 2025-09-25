"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface Property {
  _id: string;
  name: string;
  type: string;
  unitType: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  pricing: {
    rent: number;
    deposit: number;
    currency: string;
  };
  size: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    unit: string;
  };
  amenities: string[];
  furnishing: string;
  images: string[];
  availability: string;
  status: string;
  landlord: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar?: string;
    rating?: number;
  };
  agent?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar?: string;
    rating?: number;
  };
  rating?: number;
  reviews?: number;
  isFeatured: boolean;
  isVerified: boolean;
}

export default function PropertyDetails() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${params.id}`);
        if (!response.ok) {
          throw new Error('Property not found');
        }
        const data = await response.json();
        setProperty(data.property);
      } catch (error) {
        setError('Failed to load property details');
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProperty();
    }
  }, [params.id]);

  const handleContactAgent = () => {
    // Implement contact functionality
    console.log('Contact agent:', property?.agent || property?.landlord);
  };

  const handleScheduleTour = () => {
    // Implement tour scheduling
    console.log('Schedule tour for property:', property?._id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Property not found'}</h2>
          <Link 
            href="/properties"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = property.images[selectedImage] || '/api/placeholder/800/600';
  const contactPerson = property.agent || property.landlord;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Go back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <Link href="/" className="text-xl font-bold text-indigo-600">
                M-keja
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Property Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span>›</span>
          <Link href="/properties" className="hover:text-indigo-600">Properties</Link>
          <span>›</span>
          <span className="text-gray-900">{property.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="rounded-xl overflow-hidden mb-6">
              <div className="relative h-96 bg-gray-200">
                <img 
                  src={mainImage} 
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex space-x-2">
                  {property.isFeatured && (
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  )}
                  {property.isVerified && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Verified
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
                >
                  <svg
                    className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                    fill={isFavorite ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
              
              {/* Thumbnail Images */}
              {property.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 rounded-lg overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-indigo-600' : ''
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${property.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {property.location.address}, {property.location.city}, {property.location.state}
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  KSh {property.pricing.rent.toLocaleString()}
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <div className="text-gray-600">
                  Security Deposit: KSh {property.pricing.deposit.toLocaleString()}
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">{property.size.bedrooms}</div>
                  <div className="text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">{property.size.bathrooms}</div>
                  <div className="text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">{property.size.area}</div>
                  <div className="text-gray-600">Area ({property.size.unit})</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600 capitalize">{property.furnishing}</div>
                  <div className="text-gray-600">Furnishing</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Actions */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Contact Agent</h3>
              
              {/* Agent/Landlord Info */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold mr-3">
                  {contactPerson.firstName.charAt(0)}{contactPerson.lastName.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">
                    {contactPerson.firstName} {contactPerson.lastName}
                  </div>
                  <div className="text-sm text-gray-600">{property.agent ? 'Agent' : 'Landlord'}</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {contactPerson.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {contactPerson.phone}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleContactAgent}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Contact Now
                </button>
                <button
                  onClick={handleScheduleTour}
                  className="w-full border border-indigo-600 text-indigo-600 py-3 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                >
                  Schedule Tour
                </button>
              </div>

              {/* Quick Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Property Type:</span>
                  <span className="font-medium capitalize">{property.type}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Availability:</span>
                  <span className="font-medium">
                    {new Date(property.availability).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Status:</span>
                  <span className={`font-medium capitalize ${
                    property.status === 'available' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {property.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}