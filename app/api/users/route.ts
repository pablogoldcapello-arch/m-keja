import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
export async function GET(req: NextRequest) {
try {
await dbConnect();
const { searchParams } = new URL(req.url);
const role = searchParams.get('role');          // landlord | agent | service-provider
if (!role || !['landlord','agent','service-provider'].includes(role)) {
  return NextResponse.json({ message:'Invalid or missing role' },{ status:400 });
}

const users = await User
  .find({ role, isVerified:true })
  .select('firstName lastName avatar rating isVerified')
  .lean();

// Map to the exact shape the frontend already consumes
const mapped = users.map((u:any) => ({
  id:   u._id.toString(),
  name: `${u.firstName} ${u.lastName}`,
  // ---- agents ----
  properties: 0,        // will be populated later
  rating:     u.rating || 0,
  image:      u.avatar || '/api/placeholder/100/100',
  experience: 'N/A',    // will be populated later
  // ---- landlords ----
  // (properties & rating already covered)
  // ---- service-providers ----
  service:    'Service provider', // placeholder
  reviews:    0,
  verified:   u.isVerified,
}));

return NextResponse.json({ users: mapped });
} catch (err) {
console.error(err);
return NextResponse.json({ message:'Internal server error' },{ status:500 });
}
}