import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import Donation from '../../models/donation.model';

export async function GET() {
  try {
    console.log('🔵 [API] Get All Donations endpoint called');
    
    // Connect to database
    await dbConnect();
    console.log('✅ [API] Database connected');

    // Fetch all donations, sort latest first, exclude __v
    const donations = await Donation.find()
      .select('-__v')
      .sort({ createdAt: -1 });

    console.log(`📊 [API] Total donations found: ${donations.length}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Donations retrieved successfully',
        data: {
          donations
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('❌ [API] Error fetching donations:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch donations: ' + error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
