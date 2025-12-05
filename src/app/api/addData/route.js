import { NextResponse } from 'next/server';
import Staff from '../../models/staff.model';
import dbConnect from '../../lib/mongodb';
import Donation from '../../models/donation.model';
import emailService from '../../api/sendEmail/route';

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const {
      donorName,
      email,
      phone,
      amount,
      charityType,
      category,
      notes = '',
      sendEmail = true
    } = body;

    // Get token from authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Find staff by token
    const staff = await Staff.findOne({ token });
    if (!staff) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Validation
    if (!donorName || !email || !phone || !amount || !charityType || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create donation record
    const donation = new Donation({
      donorName,
      email,
      phone,
      amount: parseFloat(amount),
      charityType,
      category,
      notes,
      staffId: staff.staffId,
      staffName: staff.name,
      sendEmail,
      sendSMS: false, // SMS disabled
      status: 'confirmed'
    });

    await donation.save();

    // Send email notification
    const notifications = {
      emailSent: false,
      emailError: null
    };

    if (sendEmail && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await emailService.sendDonationConfirmation(donation);
        donation.emailSent = true;
        notifications.emailSent = true;
      } catch (emailError) {
        notifications.emailError = emailError.message;
        console.error('Email sending failed:', emailError);
      }
      await donation.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Donation recorded successfully',
      data: {
        donation: {
          id: donation._id,
          receiptNumber: donation.receiptNumber,
          donorName: donation.donorName,
          amount: donation.amount,
          charityType: donation.charityType,
          category: donation.category,
          createdAt: donation.createdAt,
          emailSent: donation.emailSent
        },
        notifications
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error processing donation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}