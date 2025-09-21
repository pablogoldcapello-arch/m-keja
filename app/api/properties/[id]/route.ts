import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Property from '@/models/Property';
import User from '@/models/User';

/*export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const property = await Property.findById(params.id)
      .populate('landlord', 'firstName lastName email phone avatar rating')
      .populate('agent', 'firstName lastName email phone avatar rating')
      .exec();

    if (!property) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ property });

  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if user owns the property or is admin
    const property = await Property.findById(params.id);
    if (!property) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    const user = await User.findById(decoded.userId);
    const isOwner = property.landlord.toString() === decoded.userId || 
                   (property.agent && property.agent.toString() === decoded.userId);
    
    if (!isOwner && user?.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const updates = await req.json();
    const updatedProperty = await Property.findByIdAndUpdate(
      params.id,
      updates,
      { new: true, runValidators: true }
    )
    .populate('landlord', 'firstName lastName email phone avatar')
    .populate('agent', 'firstName lastName email phone avatar');

    return NextResponse.json({
      message: 'Property updated successfully',
      property: updatedProperty
    });

  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if user owns the property or is admin
    const property = await Property.findById(params.id);
    if (!property) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    const user = await User.findById(decoded.userId);
    const isOwner = property.landlord.toString() === decoded.userId || 
                   (property.agent && property.agent.toString() === decoded.userId);
    
    if (!isOwner && user?.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    // Soft delete by setting isActive to false
    await Property.findByIdAndUpdate(params.id, { isActive: false });

    return NextResponse.json({ message: 'Property deleted successfully' });

  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}*/


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ Await the promise
  try {
    await dbConnect();

    const property = await Property.findById(id)
      .populate('landlord', 'firstName lastName email phone avatar rating')
      .populate('agent', 'firstName lastName email phone avatar rating')
      .exec();

    if (!property) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ property });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ Await the promise
  try {
    await dbConnect();

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    const user = await User.findById(decoded.userId);
    const isOwner = property.landlord.toString() === decoded.userId ||
                   (property.agent && property.agent.toString() === decoded.userId);

    if (!isOwner && user?.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const updates = await req.json();
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
    .populate('landlord', 'firstName lastName email phone avatar')
    .populate('agent', 'firstName lastName email phone avatar');

    return NextResponse.json({
      message: 'Property updated successfully',
      property: updatedProperty
    });

  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ Await the promise
  try {
    await dbConnect();

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    const user = await User.findById(decoded.userId);
    const isOwner = property.landlord.toString() === decoded.userId ||
                   (property.agent && property.agent.toString() === decoded.userId);

    if (!isOwner && user?.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await Property.findByIdAndUpdate(id, { isActive: false });

    return NextResponse.json({ message: 'Property deleted successfully' });

  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}