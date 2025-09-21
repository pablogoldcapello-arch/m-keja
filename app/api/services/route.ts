import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Service from '@/models/Service';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Check authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Check if user is a service provider
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'service-provider') {
      return NextResponse.json({ message: 'Only service providers can create services' }, { status: 403 });
    }

    // Parse request body
    const formData = await req.formData();
    
    // Extract form data
    const serviceData = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      priceType: formData.get('priceType') as 'fixed' | 'hourly' | 'negotiable',
      location: formData.get('location') as string,
      coverage: JSON.parse(formData.get('coverage') as string || '[]'),
      availability: JSON.parse(formData.get('availability') as string || '[]'),
      experience: formData.get('experience') as string,
      qualifications: JSON.parse(formData.get('qualifications') as string || '[]'),
      serviceProvider: decoded.userId
    };

    // Validate required fields
    if (!serviceData.title || !serviceData.category || !serviceData.description || 
        !serviceData.price || !serviceData.location || !serviceData.experience) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Handle image uploads (in a real app, you'd upload to cloud storage)
    const images: string[] = [];
    const imageFiles = formData.getAll('images') as File[];
    
    // For now, we'll just store placeholder URLs
    // In production, you'd upload to S3, Cloudinary, etc.
    for (let i = 0; i < imageFiles.length; i++) {
      if (imageFiles[i] instanceof File) {
        // Simulate image upload - in real app, upload to cloud storage
        images.push(`/api/placeholder/service-image-${Date.now()}-${i}`);
      }
    }

    // Create service
    const service = await Service.create({
      ...serviceData,
      images,
      isActive: true,
      isVerified: false // Admin verification required
    });

    return NextResponse.json(
      { 
        message: 'Service created successfully', 
        service 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Check authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const location = searchParams.get('location');

    // Build query
    const query: any = { isActive: true };
    
    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');

    // Get services with pagination
    const services = await Service.find(query)
      .populate('serviceProvider', 'firstName lastName email phone avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Service.countDocuments(query);

    return NextResponse.json({
      services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}