import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "../../../lib/mongodb";
import Admin from "../../../models/admin";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const { email, password } = body;

    console.log("🔐 [Admin Login API] Login attempt:", email);

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email and password are required",
        }),
        { status: 400 }
      );
    }

    // Find admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid credentials",
        }),
        { status: 401 }
      );
    }

    // Check if account is active
    if (!admin.active) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Account is deactivated",
        }),
        { status: 401 }
      );
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid credentials",
        }),
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: admin._id,
        adminId: admin.adminId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET || "your-secret-key-change-in-production",
      { expiresIn: "7d" }
    );

    // Update admin record
    admin.token = token;
    admin.lastLogin = new Date();
    await admin.save();

    console.log("✅ [Admin Login API] Login successful:", email);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Login successful",
        data: {
          admin: admin.toJSON(),
          token,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ [Admin Login API] Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || "Login failed",
      }),
      { status: 500 }
    );
  }
}

// LOGOUT
export async function DELETE(req) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Token required",
        }),
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ token });

    if (admin) {
      admin.token = null;
      await admin.save();
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Logged out successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ [Admin Logout API] Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Logout failed",
      }),
      { status: 500 }
    );
  }
}
