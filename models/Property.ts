import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
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
  images: string[];
  availability: Date;
  status: 'available' | 'occupied' | 'maintenance' | 'unavailable';
  landlord: mongoose.Types.ObjectId;
  agent?: mongoose.Types.ObjectId;
  isActive: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  rating?: number;
  reviews?: number;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    type: { 
      type: String, 
      required: true,
      enum: ['apartment', 'maisonette', 'bedsitter', 'studio', 'bungalow', 'townhouse', 'office', 'shop', 'warehouse', 'land']
    },
    unitType: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true, default: 'Kenya' }
    },
    pricing: {
      rent: { type: Number, required: true, min: 0 },
      deposit: { type: Number, required: true, min: 0 },
      currency: { type: String, default: 'KSh' }
    },
    size: {
      bedrooms: { type: Number, required: true, min: 0 },
      bathrooms: { type: Number, required: true, min: 0 },
      area: { type: Number, required: true, min: 0 },
      unit: { type: String, default: 'sqft' }
    },
    amenities: [{ 
      type: String 
    }],
    furnishing: { 
      type: String, 
      enum: ['unfurnished', 'semi-furnished', 'furnished'],
      default: 'unfurnished'
    },
    rules: [{ 
      type: String 
    }],
    images: [{ 
      type: String 
    }],
    availability: { 
      type: Date, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['available', 'occupied', 'maintenance', 'unavailable'],
      default: 'available'
    },
    landlord: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    agent: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    isFeatured: { type: Boolean, default: false },
    rating: { 
      type: Number, 
      default: 0,
      min: 0,
      max: 5
    },
    reviews: { 
      type: Number, 
      default: 0 
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
propertySchema.index({ landlord: 1 });
propertySchema.index({ agent: 1 });
propertySchema.index({ 'location.city': 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ isActive: 1 });
propertySchema.index({ isVerified: 1 });
propertySchema.index({ 'pricing.rent': 1 });

export default mongoose.models.Property || mongoose.model<IProperty>('Property', propertySchema);