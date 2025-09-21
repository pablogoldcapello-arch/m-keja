import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Property from '@/models/Property';
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

    // Check if user is a landlord or agent
    const user = await User.findById(decoded.userId);
    if (!user || (user.role !== 'landlord' && user.role !== 'agent')) {
      return NextResponse.json({ 
        message: 'Only landlords and agents can create properties' 
      }, { status: 403 });
    }

    // Parse form data
    const formData = await req.formData();
    
    // Extract and validate form data
    const propertyData = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      unitType: formData.get('unitType') as string,
      description: formData.get('description') as string,
      location: {
        address: formData.get('location.address') as string,
        city: formData.get('location.city') as string,
        state: formData.get('location.state') as string,
        country: formData.get('location.country') as string || 'Kenya'
      },
      pricing: {
        rent: Number(formData.get('pricing.rent')),
        deposit: Number(formData.get('pricing.deposit')),
        currency: formData.get('pricing.currency') as string || 'KSh'
      },
      size: {
        bedrooms: Number(formData.get('size.bedrooms')),
        bathrooms: Number(formData.get('size.bathrooms')),
        area: Number(formData.get('size.area')),
        unit: formData.get('size.unit') as string || 'sqft'
      },
      amenities: JSON.parse(formData.get('amenities') as string || '[]'),
      furnishing: formData.get('furnishing') as string,
      rules: JSON.parse(formData.get('rules') as string || '[]'),
      availability: new Date(formData.get('availability') as string),
      landlord: decoded.userId,
      agent: user.role === 'agent' ? decoded.userId : undefined
    };

    // Validate required fields
    const requiredFields = [
      'name', 'type', 'unitType', 'description',
      'location.address', 'location.city', 'location.state',
      'pricing.rent', 'pricing.deposit',
      'size.bedrooms', 'size.bathrooms', 'size.area',
      'furnishing', 'availability'
    ];

    for (const field of requiredFields) {
      const value = field.includes('.') 
        ? field.split('.').reduce((obj: any, key) => obj?.[key], propertyData)
        : (propertyData as any)[field];
      
      if (value === undefined || value === null || value === '') {
        return NextResponse.json({ 
          message: `Missing required field: ${field}` 
        }, { status: 400 });
      }
    }

    // Handle image uploads (placeholder implementation)
    const images: string[] = [];
    const imageFiles = formData.getAll('images') as File[];
    
    // Simulate image upload - in real app, upload to cloud storage
    for (let i = 0; i < imageFiles.length; i++) {
      if (imageFiles[i] instanceof File) {
        images.push(`/api/placeholder/property-image-${Date.now()}-${i}`);
      }
    }

    // Create property
    const property = await Property.create({
      ...propertyData,
      images,
      status: 'available',
      isActive: true,
      isVerified: false // Admin verification required
    });

    // Populate landlord/agent information
    await property.populate('landlord', 'firstName lastName email phone');
    if (property.agent) {
      await property.populate('agent', 'firstName lastName email phone');
    }

    return NextResponse.json(
      { 
        message: 'Property created successfully', 
        property 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const type = searchParams.get('type');
    const city = searchParams.get('city');
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '10000000');
    const bedrooms = parseInt(searchParams.get('bedrooms') || '0');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';

    // Build query
    const query: any = { 
      isActive: true, 
      status: 'available' 
    };
    
    if (type && type !== 'all') query.type = type;
    if (city && city !== 'all') query['location.city'] = new RegExp(city, 'i');
    if (bedrooms > 0) query['size.bedrooms'] = { $gte: bedrooms };
    
    query['pricing.rent'] = { $gte: minPrice, $lte: maxPrice };

    // Add search functionality
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') },
        { 'location.address': new RegExp(search, 'i') }
      ];
    }

    // Build sort options
    let sortOptions: any = { createdAt: -1 };
    switch (sort) {
      case 'price-low':
        sortOptions = { 'pricing.rent': 1 };
        break;
      case 'price-high':
        sortOptions = { 'pricing.rent': -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1, reviews: -1 };
        break;
      case 'bedrooms':
        sortOptions = { 'size.bedrooms': -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Get properties with pagination
    const properties = await Property.find(query)
      .populate('landlord', 'firstName lastName email phone avatar rating')
      .populate('agent', 'firstName lastName email phone avatar rating')
      .sort(sortOptions)
      .limit(limit)
      .skip((page - 1) * limit);

    const lean = properties.map((p: any) => ({
      id: p._id.toString(),
      name: p.name,
      type: p.type,
      location: `${p.location.address}, ${p.location.city}`, 
      price: p.pricing.rent,
      image: p.images?.[0] || '/api/placeholder/400/300',
      bedrooms: p.size.bedrooms,
      bathrooms: p.size.bathrooms,
      area: p.size.area,
      rating: p.rating || 0,
      featured: p.isFeatured,          
      }));  

    const total = await Property.countDocuments(query);

    return NextResponse.json({
      properties: lean,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}