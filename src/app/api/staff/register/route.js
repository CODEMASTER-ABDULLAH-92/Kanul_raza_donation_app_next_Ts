import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '../../../lib/mongodb';
import Staff from '../../../models/staff.model';

export async function POST(request) {
  console.log('🔵 [API] Staff registration endpoint called');
  
  try {
    console.log('🔵 [API] Attempting to connect to database...');
    await dbConnect();
    console.log('✅ [API] Database connected successfully');
    
    const body = await request.json();
    console.log('📦 [API] Request body received:', JSON.stringify(body, null, 2));
    
    const { staffId, name, email, phone, password, role = 'collector' } = body;

    // Detailed validation
    console.log('🔍 [API] Validating fields...');
    const missingFields = [];
    if (!staffId) missingFields.push('staffId');
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!phone) missingFields.push('phone');
    if (!password) missingFields.push('password');
    
    if (missingFields.length > 0) {
      console.error('❌ [API] Missing fields:', missingFields);
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    console.log('✅ [API] All fields validated');

    // Check if staff already exists
    console.log('🔍 [API] Checking for existing staff...');
    const existingStaff = await Staff.findOne({ 
      $or: [{ email }, { staffId }, { phone }] 
    });

    if (existingStaff) {
      console.error('❌ [API] Staff already exists:', {
        email: existingStaff.email,
        staffId: existingStaff.staffId,
        phone: existingStaff.phone
      });
      
      let errorMessage = 'Staff already exists';
      if (existingStaff.email === email) errorMessage = 'Email already registered';
      else if (existingStaff.staffId === staffId) errorMessage = 'Staff ID already exists';
      else if (existingStaff.phone === phone) errorMessage = 'Phone number already registered';
      
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }
    
    console.log('✅ [API] No existing staff found');

    // Create a simple hash for password
    console.log('🔒 [API] Hashing password...');
    const hashedPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    // Create new staff
    console.log('👤 [API] Creating new staff document...');
    const staff = new Staff({
      staffId,
      name,
      email,
      phone,
      password: hashedPassword,
      role
    });

    console.log('💾 [API] Saving staff to database...');
    await staff.save();
    console.log('✅ [API] Staff saved successfully');

    // Generate simple token
    console.log('🔑 [API] Generating authentication token...');
    const token = crypto.randomBytes(32).toString('hex');
    staff.token = token;
    await staff.save();
    console.log('✅ [API] Token saved');

    const staffResponse = staff.toJSON();
    console.log('📤 [API] Returning success response');
    
    return NextResponse.json({
      success: true,
      message: 'Staff registered successfully',
      data: {
        staff: staffResponse,
        token
      }
    }, { status: 201 });

  } catch (error) {
    console.error('❌ [API] Error in registration:', error);
    console.error('❌ [API] Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to register staff: ' + error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}