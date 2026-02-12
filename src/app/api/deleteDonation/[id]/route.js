import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb'; // Using @ alias is cleaner
import Donation from '../../../models/donation.model';

export async function DELETE({ params }) {
  console.log('🔴 [API] Delete donation endpoint called');
  
  try {
    // 1. Get the ID from params
    const { id: donationId } = await params; 

    if (!donationId) {
      return NextResponse.json(
        { success: false, error: 'Donation ID is required' },
        { status: 400 }
      );
    }

    console.log(`🔵 [API] Attempting to delete donation: ${donationId}`);
    await dbConnect();
    
    // 2. Check if donation exists
    const existingDonation = await Donation.findById(donationId);
    
    if (!existingDonation) {
      console.error('❌ [API] Donation not found');
      return NextResponse.json(
        { success: false, error: 'Donation not found' },
        { status: 404 }
      );
    }
    
    // 3. Delete the donation
    const deletedDonation = await Donation.findByIdAndDelete(donationId);
    console.log('✅ [API] Donation deleted successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Donation deleted successfully',
      data: {
        id: deletedDonation._id,
        donorName: deletedDonation.donorName,
        deletedAt: new Date().toISOString()
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('❌ [API] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete donation',
        details: error.message 
      },
      { status: 500 }
    );
  }
}