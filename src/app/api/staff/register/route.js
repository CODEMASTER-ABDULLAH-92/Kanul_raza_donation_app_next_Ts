import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Staff from "../../../models/staff.model";
import { sendStaffRegistrationEmail } from "../../../lib/email";
import dbConnect from "../../../lib/mongodb";

export async function POST(request) {
  try {
    await dbConnect();
    
    // Get token from header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - Token required" },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(" ")[1];
    
    // Verify admin token (you'll need to implement your token verification logic)
    // For now, we'll assume the token is valid
    
    const { name, email, phone, role, password } = await request.json();
    
    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required" },
        { status: 400 }
      );
    }
    
    // Check if staff already exists
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return NextResponse.json(
        { error: "Staff with this email already exists" },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate staff ID
    const staffId = `STAFF${Date.now().toString().slice(-6)}`;
    
    // Create new staff
    const newStaff = new Staff({
      name,
      email,
      phone: phone || "",
      role,
      staffId,
      password: hashedPassword,
      active: true,
      token,
      createdBy: "admin", // You can get admin ID from token
    });
    console.log(token);
    
    await newStaff.save();
    
    // Send registration email
    await sendStaffRegistrationEmail(email, name, password, role);
    return NextResponse.json({
      success: true,
      message: "Staff registered successfully",
      data: {
        id: newStaff._id,
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
        staffId: newStaff.staffId,
      },
    });
    
  } catch (error) {
    console.error("Staff registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}