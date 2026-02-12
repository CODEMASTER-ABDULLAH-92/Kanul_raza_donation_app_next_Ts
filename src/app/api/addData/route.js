import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import Staff from "../../models/staff.model";
import Donation from "../../models/donation.model";
import dbConnect from "../../lib/mongodb";
import emailService from "../../api/sendEmail/route";

export async function POST(request) {
  try {
    await dbConnect();

    /* =======================
       AUTHORIZATION
    ======================= */
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Token missing" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token", err},
        { status: 401 }
      );
    }

    const staff = await Staff.findById(decoded.staffId);
    if (!staff || !staff.active) {
      return NextResponse.json(
        { success: false, error: "Staff not authorized" },
        { status: 403 }
      );
    }

    /* =======================
       REQUEST BODY
    ======================= */
    const body = await request.json();
    const {
      donorName,
      email,
      phone,
      amount,
      charityType,
      category,
      notes = "",
      sendEmail = true,
    } = body;

    if (
      !donorName ||
      !email ||
      !phone ||
      !amount ||
      !charityType ||
      !category
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* =======================
       CREATE DONATION
    ======================= */
    const donation = new Donation({
      donorName,
      email,
      phone,
      amount: Number(amount),
      charityType,
      category,
      notes,
      staffName: staff.name,
      staffId: staff._id,
      sendEmail,
      sendSMS: false,
      status: "confirmed",
    });

    await donation.save();

    /* =======================
       EMAIL NOTIFICATION
    ======================= */
    let emailStatus = {
      emailSent: false,
      emailError: null,
    };

    if (sendEmail && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await emailService.sendDonationConfirmation(donation);
        donation.emailSent = true;
        emailStatus.emailSent = true;
        await donation.save();
      } catch (emailError) {
        emailStatus.emailError = emailError.message;
        console.error("Email failed:", emailError);
      }
    }

    /* =======================
       RESPONSE
    ======================= */
    return NextResponse.json(
      {
        success: true,
        message: "Donation recorded successfully",
        data: {
          donation: {
            id: donation._id,
            receiptNumber: donation.receiptNumber,
            donorName: donation.donorName,
            amount: donation.amount,
            charityType: donation.charityType,
            category: donation.category,
            createdAt: donation.createdAt,
            emailSent: donation.emailSent || false,
          },
          notifications: emailStatus,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Donation API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
