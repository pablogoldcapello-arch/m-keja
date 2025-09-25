/*"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface PropertyFormData {
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
  rules: string[];
  availability: string;
  images: File[];
}

export default function CreateProperty() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<PropertyFormData>({
    name: '',
    type: 'apartment',
    unitType: '',
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: 'Kenya'
    },
    pricing: {
      rent: 0,
      deposit: 0,
      currency: 'KSh'
    },
    size: {
      bedrooms: 1,
      bathrooms: 1,
      area: 0,
      unit: 'sqft'
    },
    amenities: [],
    furnishing: 'unfurnished',
    rules: [],
    availability: new Date().toISOString().split('T')[0],
    images: []
  });

  const propertyTypes = [
    'apartment', 'maisonette', 'bedsitter', 'studio', 'bungalow', 
    'townhouse', 'office', 'shop', 'warehouse', 'land'
  ];

  const amenitiesList = [
    'Wi-Fi', 'Parking', 'Swimming Pool', 'Gym', 'Security', 
    'Garden', 'Balcony', 'Air Conditioning', 'Heating', 'Laundry',
    'Elevator', 'Pet Friendly', 'Furnished', 'Water Supply', 'Backup Generator'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...((prev[parent as keyof PropertyFormData] ?? {}) as object),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
    setError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, images: files }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      // helper: append a primitive value under a dotted key
const append = (key: string, val: any) => {
  if (val instanceof File) return;                 // images handled separately
  formDataToSend.append(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
};

// walk through the original formData and flatten
Object.entries(formData).forEach(([root, value]) => {
  if (root === 'images') {                         // files
    (value as File[]).forEach(f => formDataToSend.append('images', f));
    return;
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    // nested object → location, pricing, size
    Object.entries(value).forEach(([child, v]) =>
      append(`${root}.${child}`, v)
    );
  } else {
    append(root, value);
  }
});
      
      // Append all form data
      /*Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          // Append each image file
          formData.images.forEach((file) => {
            formDataToSend.append('images', file);
          });
        } else if (typeof value === 'object') {
          // Stringify objects and arrays
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value.toString());
        }
      });*

      const response = await fetch('/api/properties', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create property');
      }

      const result = await response.json();
      console.log('Property created:', result);
      
      // Redirect to properties page
      router.push('/properties');
      
    } catch (error: any) {
      console.error('Error creating property:', error);
      setError(error.message || 'Failed to create property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (!user) {
    return <div>Please log in to create a property</div>;
  }

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-10">
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
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.role === 'agent' ? 'List New Property' : 'Add Your Property'}
              </h1>
              <p className="text-gray-600">
                Fill in the details to showcase your property to potential tenants
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

        
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step >= stepNumber
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {stepNumber}
                    </div>
                    {stepNumber < 4 && (
                      <div
                        className={`w-16 h-1 mx-2 ${
                          step > stepNumber ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Basic Info</span>
                <span>Location</span>
                <span>Details</span>
                <span>Media</span>
              </div>
            </div>

          
            <form onSubmit={handleSubmit} className="space-y-6">
            
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      placeholder="e.g., Luxury Apartment in Kilimani"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Type *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        {propertyTypes.map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Type *
                      </label>
                      <input
                        type="text"
                        name="unitType"
                        value={formData.unitType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        placeholder="e.g., 2 Bedroom, Studio, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      placeholder="Describe your property in detail..."
                    />
                  </div>
                </div>
              )}

            
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="location.address"
                      value={formData.location.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        placeholder="e.g., Nairobi"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State/Region *
                      </label>
                      <input
                        type="text"
                        name="location.state"
                        value={formData.location.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        placeholder="e.g., Nairobi County"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="location.country"
                        value={formData.location.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              
              {step === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Rent (KSh) *
                      </label>
                      <input
                        type="number"
                        name="pricing.rent"
                        value={formData.pricing.rent}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Security Deposit (KSh) *
                      </label>
                      <input
                        type="number"
                        name="pricing.deposit"
                        value={formData.pricing.deposit}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bedrooms *
                      </label>
                      <input
                        type="number"
                        name="size.bedrooms"
                        value={formData.size.bedrooms}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bathrooms *
                      </label>
                      <input
                        type="number"
                        name="size.bathrooms"
                        value={formData.size.bathrooms}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Area (sqft) *
                      </label>
                      <input
                        type="number"
                        name="size.area"
                        value={formData.size.area}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Furnishing *
                    </label>
                    <select
                      name="furnishing"
                      value={formData.furnishing}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="unfurnished">Unfurnished</option>
                      <option value="semi-furnished">Semi-Furnished</option>
                      <option value="furnished">Fully Furnished</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amenities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {amenitiesList.map((amenity) => (
                        <label key={amenity} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={() => handleAmenityChange(amenity)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

             
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Images *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600 mb-2">Drag and drop images here, or click to select</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="property-images"
                      />
                      <label
                        htmlFor="property-images"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Select Images
                      </label>
                      {formData.images.length > 0 && (
                        <p className="text-sm text-gray-600 mt-4">
                          {formData.images.length} image(s) selected
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability Date *
                    </label>
                    <input
                      type="date"
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
              )}

            
              <div className="flex justify-between pt-6">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? 'Creating Property...' : 'Create Property'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}*/

"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { uploadMultipleToCloudinary } from '@/lib/cloudinary';


interface PropertyFormData {
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
  rules: string[];
  availability: string;
  images: File[];
}

interface FormErrors {
  [key: string]: string;
}

export default function CreateProperty() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<PropertyFormData>({
    name: '',
    type: 'apartment',
    unitType: '',
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: 'Kenya'
    },
    pricing: {
      rent: 0,
      deposit: 0,
      currency: 'KSh'
    },
    size: {
      bedrooms: 1,
      bathrooms: 1,
      area: 0,
      unit: 'sqft'
    },
    amenities: [],
    furnishing: 'unfurnished',
    rules: [],
    availability: new Date().toISOString().split('T')[0],
    images: []
  });

  const propertyTypes = [
    'apartment', 'maisonette', 'bedsitter', 'studio', 'bungalow', 
    'townhouse', 'office', 'shop', 'warehouse', 'land'
  ];

  const amenitiesList = [
    'Wi-Fi', 'Parking', 'Swimming Pool', 'Gym', 'Security', 
    'Garden', 'Balcony', 'Air Conditioning', 'Heating', 'Laundry',
    'Elevator', 'Pet Friendly', 'Furnished', 'Water Supply', 'Backup Generator'
  ];

  const validateStep = (step: number): boolean => {
    const errors: FormErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) errors.name = 'Property name is required';
      if (!formData.unitType.trim()) errors.unitType = 'Unit type is required';
      if (!formData.description.trim()) errors.description = 'Description is required';
    }

    if (step === 2) {
      if (!formData.location.address.trim()) errors.address = 'Address is required';
      if (!formData.location.city.trim()) errors.city = 'City is required';
      if (!formData.location.state.trim()) errors.state = 'State is required';
    }

    if (step === 3) {
      if (formData.pricing.rent <= 0) errors.rent = 'Rent must be greater than 0';
      if (formData.pricing.deposit < 0) errors.deposit = 'Deposit cannot be negative';
      if (formData.size.bedrooms < 0) errors.bedrooms = 'Bedrooms cannot be negative';
      if (formData.size.bathrooms < 0) errors.bathrooms = 'Bathrooms cannot be negative';
      if (formData.size.area <= 0) errors.area = 'Area must be greater than 0';
    }

    if (step === 4) {
      if (formData.images.length === 0) errors.images = 'At least one image is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...((prev[parent as keyof PropertyFormData] ?? {}) as object),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError('');
    
    // Clear specific error when field is modified
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
    setError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, images: files }));
    setError('');
    setFormErrors(prev => ({ ...prev, images: '' }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Final validation
    if (!validateStep(4)) {
      setLoading(false);
      return;
    }

    try {
      // Upload images to Cloudinary first
      let imageUrls: string[] = [];
      if (formData.images.length > 0) {
        imageUrls = await uploadMultipleToCloudinary(formData.images);
      }

      // Prepare the data for API submission
      const propertyData = {
        ...formData,
        images: imageUrls,
        availability: new Date(formData.availability).toISOString(),
        // Remove the File objects since we now have URLs
      };

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create property');
      }

      const result = await response.json();
      console.log('Property created:', result);
      
      // Redirect to properties page
      router.push('/properties');
      
    } catch (error: any) {
      console.error('Error creating property:', error);
      setError(error.message || 'Failed to create property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to create a property</h2>
          <button 
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-10">
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
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.role === 'agent' ? 'List New Property' : 'Add Your Property'}
              </h1>
              <p className="text-gray-600">
                Fill in the details to showcase your property to potential tenants
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step >= stepNumber
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {stepNumber}
                    </div>
                    {stepNumber < 4 && (
                      <div
                        className={`w-16 h-1 mx-2 ${
                          step > stepNumber ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Basic Info</span>
                <span>Location</span>
                <span>Details</span>
                <span>Media</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                      placeholder="e.g., Luxury Apartment in Kilimani"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Type *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        {propertyTypes.map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Type *
                      </label>
                      <input
                        type="text"
                        name="unitType"
                        value={formData.unitType}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          formErrors.unitType ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                        placeholder="e.g., 2 Bedroom, Studio, etc."
                      />
                      {formErrors.unitType && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.unitType}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        formErrors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                      placeholder="Describe your property in detail..."
                    />
                    {formErrors.description && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="location.address"
                      value={formData.location.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        formErrors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                      placeholder="Street address"
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          formErrors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                        placeholder="e.g., Nairobi"
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State/Region *
                      </label>
                      <input
                        type="text"
                        name="location.state"
                        value={formData.location.state}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          formErrors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                        placeholder="e.g., Nairobi County"
                      />
                      {formErrors.state && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="location.country"
                        value={formData.location.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Details */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Rent (KSh) *
                      </label>
                      <input
                        type="number"
                        name="pricing.rent"
                        value={formData.pricing.rent}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          formErrors.rent ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                        min="0"
                      />
                      {formErrors.rent && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.rent}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Security Deposit (KSh) *
                      </label>
                      <input
                        type="number"
                        name="pricing.deposit"
                        value={formData.pricing.deposit}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          formErrors.deposit ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                        min="0"
                      />
                      {formErrors.deposit && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.deposit}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bedrooms *
                      </label>
                      <input
                        type="number"
                        name="size.bedrooms"
                        value={formData.size.bedrooms}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          formErrors.bedrooms ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                        min="0"
                      />
                      {formErrors.bedrooms && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.bedrooms}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bathrooms *
                      </label>
                      <input
                        type="number"
                        name="size.bathrooms"
                        value={formData.size.bathrooms}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          formErrors.bathrooms ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                        min="0"
                      />
                      {formErrors.bathrooms && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.bathrooms}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Area (sqft) *
                      </label>
                      <input
                        type="number"
                        name="size.area"
                        value={formData.size.area}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          formErrors.area ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                        min="0"
                      />
                      {formErrors.area && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.area}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Furnishing *
                    </label>
                    <select
                      name="furnishing"
                      value={formData.furnishing}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="unfurnished">Unfurnished</option>
                      <option value="semi-furnished">Semi-Furnished</option>
                      <option value="furnished">Fully Furnished</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amenities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {amenitiesList.map((amenity) => (
                        <label key={amenity} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={() => handleAmenityChange(amenity)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Media */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Images *
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
                      formErrors.images ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600 mb-2">Drag and drop images here, or click to select</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="property-images"
                      />
                      <label
                        htmlFor="property-images"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Select Images
                      </label>
                      {formErrors.images && (
                        <p className="text-red-500 text-sm mt-2">{formErrors.images}</p>
                      )}
                    </div>
                    
                    {/* Selected Images Preview */}
                    {formData.images.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Selected Images ({formData.images.length})
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {formData.images.map((file, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability Date *
                    </label>
                    <input
                      type="date"
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? 'Creating Property...' : 'Create Property'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}