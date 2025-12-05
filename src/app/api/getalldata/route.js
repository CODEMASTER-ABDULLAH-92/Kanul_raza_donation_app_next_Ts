// import { NextResponse } from 'next/server';
// import dbConnect from '../../lib/mongodb';
// import Donation from '../../models/donation.model';
// import Staff from '../../models/staff.model';

// export async function GET(request) {
//   console.log('🔵 [API] Get All Donations endpoint called');

//   try {
//     console.log('🔵 [API] Connecting to database...');
//     await dbConnect();
//     console.log('✅ [API] Database connected');

//     // Optional: Staff token validation
//     const authHeader = request.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json(
//         { success: false, error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }
//     const token = authHeader.replace('Bearer ', '');
//     const staff = await Staff.findOne({ token });
//     if (!staff) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid token' },
//         { status: 401 }
//       );
//     }

//     console.log('📥 [API] Fetching all donations...');
//     const donations = await Donation.find()
//       .select('-__v') // Exclude internal version field
//       .sort({ createdAt: -1 }); // Latest first

//     console.log(`📊 [API] Total donations found: ${donations.length}`);

//     return NextResponse.json(
//       {
//         success: true,
//         message: 'Donations retrieved successfully',
//         data: {
//           donations
//         }
//       },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error('❌ [API] Error fetching donations:', error);
//     console.error('❌ [API] Stack trace:', error.stack);

//     return NextResponse.json(
//       {
//         success: false,
//         error: 'Failed to fetch donations: ' + error.message,
//         details: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       },
//       { status: 500 }
//     );
//   }
// }


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
