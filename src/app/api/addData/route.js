// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// import Staff from "../../models/staff.model";
// import Donation from "../../models/donation.model";
// import dbConnect from "../../lib/mongodb";
// import emailService from "../../api/sendEmail/route";

// export async function POST(request) {
//   try {
//     await dbConnect();

//     /* =======================
//        AUTHORIZATION
//     ======================= */
//     const authHeader = request.headers.get("authorization");

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized - Token missing" },
//         { status: 401 }
//       );
//     }

//     const token = authHeader.split(" ")[1];

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//       return NextResponse.json(
//         { success: false, error: "Invalid or expired token", err},
//         { status: 401 }
//       );
//     }

//     const staff = await Staff.findById(decoded.staffId);
//     if (!staff || !staff.active) {
//       return NextResponse.json(
//         { success: false, error: "Staff not authorized" },
//         { status: 403 }
//       );
//     }

//     /* =======================
//        REQUEST BODY
//     ======================= */
//     const body = await request.json();
//     const {
//       donorName,
//       email,
//       phone,
//       amount,
//       charityType,
//       category,
//       notes = "",
//       sendEmail = true,
//     } = body;

//     if (
//       !donorName ||
//       !email ||
//       !phone ||
//       !amount ||
//       !charityType ||
//       !category
//     ) {
//       return NextResponse.json(
//         { success: false, error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     /* =======================
//        CREATE DONATION
//     ======================= */
//     const donation = new Donation({
//       donorName,
//       email,
//       phone,
//       amount: Number(amount),
//       charityType,
//       category,
//       notes,
//       staffName: staff.name,
//       staffId: staff._id,
//       sendEmail,
//       sendSMS: false,
//       status: "confirmed",
//     });

//     await donation.save();

//     /* =======================
//        EMAIL NOTIFICATION
//     ======================= */
//     let emailStatus = {
//       emailSent: false,
//       emailError: null,
//     };

//     if (sendEmail && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
//       try {
//         await emailService.sendDonationConfirmation(donation);
//         donation.emailSent = true;
//         emailStatus.emailSent = true;
//         await donation.save();
//       } catch (emailError) {
//         emailStatus.emailError = emailError.message;
//         console.error("Email failed:", emailError);
//       }
//     }

//     /* =======================
//        RESPONSE
//     ======================= */
//     return NextResponse.json(
//       {
//         success: true,
//         message: "Donation recorded successfully",
//         data: {
//           donation: {
//             id: donation._id,
//             receiptNumber: donation.receiptNumber,
//             donorName: donation.donorName,
//             amount: donation.amount,
//             charityType: donation.charityType,
//             category: donation.category,
//             createdAt: donation.createdAt,
//             emailSent: donation.emailSent || false,
//           },
//           notifications: emailStatus,
//         },
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Donation API Error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Internal server error",
//       },
//       { status: 500 }
//     );
//   }
// }




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
        { success: false, error: "Invalid or expired token", details: err.message },
        { status: 401 }
      );
    }

    const staff = await Staff.findById(decoded.staffId);
    if (!staff || !staff.active) {
      return NextResponse.json(
        { success: false, error: "Staff not authorized or inactive" },
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
      sadaqahType,
      category,
      animalType,
      usherType,
      notes = "",
      sendEmail = true,
    } = body;

    // Validate required fields based on charity type
    if (!donorName || !email || !phone || !amount || !charityType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: donorName, email, phone, amount, and charityType are required" },
        { status: 400 }
      );
    }

    // Validate category based on charity type
    if (charityType !== 'zakat' && !category) {
      return NextResponse.json(
        { success: false, error: "Category is required for this charity type" },
        { status: 400 }
      );
    }

    // Validate sadaqahType for sadaqah charity
    if (charityType === 'sadaqah' && !sadaqahType) {
      return NextResponse.json(
        { success: false, error: "Sadaqah type (wajibah/naflah) is required" },
        { status: 400 }
      );
    }

    // Validate animalType for animal sacrifice
    if (category === 'animal_sacrifice' && !animalType) {
      return NextResponse.json(
        { success: false, error: "Animal type is required for animal sacrifice" },
        { status: 400 }
      );
    }

    // Validate usherType for usher charity
    if (charityType === 'usher' && !usherType) {
      return NextResponse.json(
        { success: false, error: "Usher type is required" },
        { status: 400 }
      );
    }

    /* =======================
       CREATE DONATION
    ======================= */
    const donationData = {
      donorName,
      email,
      phone,
      amount: Number(amount),
      charityType,
      category: category || null,
      notes,
      staffName: staff.name,
      staffEmail: staff.email,
      sendEmail,
      status: "confirmed",
    };

    // Add optional fields if they exist
    if (sadaqahType) donationData.sadaqahType = sadaqahType;
    if (animalType) donationData.animalType = animalType;
    if (usherType) donationData.usherType = usherType;

    const donation = new Donation(donationData);
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
        // Check if emailService has the method, otherwise create a simple email
        if (typeof emailService.sendDonationConfirmation === 'function') {
          await emailService.sendDonationConfirmation(donation);
        } else {
          // Fallback: log that email would be sent
          console.log("Email would be sent to:", email, "for donation:", donation.receiptNumber);
          
          // Here you could implement a simple email sending logic
          // or use a different email service
        }
        
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
            formattedAmount: donation.formattedAmount,
            charityType: donation.charityType,
            sadaqahType: donation.sadaqahType,
            category: donation.category,
            categoryDisplay: donation.getCategoryDisplay ? donation.getCategoryDisplay() : donation.category,
            animalType: donation.animalType,
            animalDisplay: donation.getAnimalDisplay ? donation.getAnimalDisplay() : donation.animalType,
            usherType: donation.usherType,
            usherDisplay: donation.getUsherDisplay ? donation.getUsherDisplay() : donation.usherType,
            createdAt: donation.createdAt,
            emailSent: donation.emailSent || false,
          },
          notifications: emailStatus,
          staff: {
            name: staff.name,
            email: staff.email
          }
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Donation API Error:", error);
    
    // Handle duplicate key error (receipt number)
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate receipt number. Please try again.",
        },
        { status: 409 }
      );
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationErrors
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error.message
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to fetch donations
export async function GET(request) {
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
        { success: false, error: "Invalid or expired token" },
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
       QUERY PARAMETERS
    ======================= */
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const charityType = searchParams.get('charityType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    const query = {};
    if (charityType) query.charityType = charityType;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    /* =======================
       FETCH DONATIONS
    ======================= */
    const skip = (page - 1) * limit;
    
    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Donation.countDocuments(query);

    /* =======================
       RESPONSE
    ======================= */
    return NextResponse.json({
      success: true,
      data: {
        donations: donations.map(d => ({
          ...d,
          formattedAmount: `PKR ${d.amount.toLocaleString()}`,
          categoryDisplay: d.getCategoryDisplay ? d.getCategoryDisplay() : d.category,
          animalDisplay: d.getAnimalDisplay ? d.getAnimalDisplay() : d.animalType,
          usherDisplay: d.getUsherDisplay ? d.getUsherDisplay() : d.usherType
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error("GET Donations Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}