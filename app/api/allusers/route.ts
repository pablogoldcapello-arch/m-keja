import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Check if user is admin (you might want to add proper authentication)
    // For now, we'll just return all users
    
    const users = await User.find({})
      .select('firstName lastName email role phone avatar isVerified createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const mappedUsers = users.map((user: any) => ({
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone || 'Not provided',
      avatar: user.avatar || '/api/placeholder/100/100',
      isVerified: user.isVerified,
      joinDate: user.createdAt,
      status: user.isVerified ? 'Active' : 'Pending'
    }));

    return NextResponse.json({ users: mappedUsers });
  } catch (err) {
    console.error('Users API error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}