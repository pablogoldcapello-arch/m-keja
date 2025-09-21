import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
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
  serviceProvider: mongoose.Types.ObjectId;
  rating?: number;
  reviews?: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    category: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true,
      min: 0
    },
    priceType: { 
      type: String, 
      enum: ['fixed', 'hourly', 'negotiable'],
      default: 'fixed'
    },
    location: { 
      type: String, 
      required: true 
    },
    coverage: [{ 
      type: String 
    }],
    availability: [{ 
      type: String 
    }],
    experience: { 
      type: String, 
      required: true 
    },
    qualifications: [{ 
      type: String 
    }],
    images: [{ 
      type: String 
    }],
    serviceProvider: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    rating: { 
      type: Number, 
      default: 0,
      min: 0,
      max: 5
    },
    reviews: { 
      type: Number, 
      default: 0 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);

// Index for better query performance
serviceSchema.index({ serviceProvider: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ location: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ isVerified: 1 });

export default mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema);