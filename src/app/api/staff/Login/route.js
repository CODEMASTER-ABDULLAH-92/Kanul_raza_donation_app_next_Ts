import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '../../../lib/mongodb';
import Staff from '../../../models/staff.model';


export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { staffId, email, password } = body;

    // Validation
    if (!password || (!staffId && !email)) {
      return NextResponse.json(
        { success: false, error: 'Staff ID/Email and password are required' },
        { status: 400 }
      );
    }

    // Find staff by staffId or email
    const query = staffId ? { staffId } : { email };
    const staff = await Staff.findOne(query);

    if (!staff) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if staff is active
    if (!staff.active) {
      return NextResponse.json(
        { success: false, error: 'Account is deactivated' },
        { status: 401 }
      );
    }

    // Verify password (simple hash comparison for now)
    const hashedPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
    
    if (hashedPassword !== staff.password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate new token
    const token = crypto.randomBytes(32).toString('hex');
    staff.token = token;
    staff.lastLogin = new Date();
    await staff.save();

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        staff: staff.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to login' },
      { status: 500 }
    );
  }
}