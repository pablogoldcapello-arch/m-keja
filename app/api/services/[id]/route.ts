/*import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Service from '@/models/Service';
import User from '@/models/User';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const service = await Service.findById(params.id)
      .populate('serviceProvider', 'firstName lastName email phone avatar rating')
      .exec();

    if (!service) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ service });

  } catch (error) {
    console.error('Error fetching service:', error);
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

    // Check if user owns the service or is admin
    const service = await Service.findById(params.id);
    if (!service) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    const user = await User.findById(decoded.userId);
    if (service.serviceProvider.toString() !== decoded.userId && user?.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const updates = await req.json();
    const updatedService = await Service.findByIdAndUpdate(
      params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('serviceProvider', 'firstName lastName email phone avatar');

    return NextResponse.json({
      message: 'Service updated successfully',
      service: updatedService
    });

  } catch (error) {
    console.error('Error updating service:', error);
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

    // Check if user owns the service or is admin
    const service = await Service.findById(params.id);
    if (!service) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    const user = await User.findById(decoded.userId);
    if (service.serviceProvider.toString() !== decoded.userId && user?.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    // Soft delete by setting isActive to false
    await Service.findByIdAndUpdate(params.id, { isActive: false });

    return NextResponse.json({ message: 'Service deleted successfully' });

  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}*/


import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Service from '@/models/Service';
import User from '@/models/User';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await dbConnect();

    const service = await Service.findById(id)
      .populate('serviceProvider', 'firstName lastName email phone avatar rating')
      .exec();

    if (!service) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json({ service });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    const user = await User.findById(decoded.userId);
    if (service.serviceProvider.toString() !== decoded.userId && user?.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const updates = await req.json();
    const updatedService = await Service.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('serviceProvider', 'firstName lastName email phone avatar');

    return NextResponse.json({
      message: 'Service updated successfully',
      service: updatedService,
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    const user = await User.findById(decoded.userId);
    if (service.serviceProvider.toString() !== decoded.userId && user?.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await Service.findByIdAndUpdate(id, { isActive: false });
    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}