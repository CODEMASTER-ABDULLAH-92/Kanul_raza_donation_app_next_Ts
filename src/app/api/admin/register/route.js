import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "../../../lib/mongodb";
import Admin from "../../../models/admin";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    console.log("📩 [Admin Register API] Received data:", body);

    const { adminId, name, email, phone, password } = body;

    // -------------------- Validation -------------------- //
    if (!adminId || !name || !email || !phone || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "All fields are required",
        }),
        { status: 400 }
      );
    }

    // -------------------- Check Existence -------------------- //
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { adminId }],
    });

    if (existingAdmin) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            existingAdmin.email === email
              ? "Email already registered"
              : "Admin ID already exists",
        }),
        { status: 400 }
      );
    }

    // -------------------- Hash Password -------------------- //
    const hashedPassword = await bcrypt.hash(password, 10);

    // -------------------- Create Admin -------------------- //
    const admin = new Admin({
      adminId,
      name,
      email,
      phone,
      password: hashedPassword,
      role: "admin",
    });

    // Save admin *before* generating token
    await admin.save();

    // -------------------- Generate JWT -------------------- //
    const token = jwt.sign(
      {
        id: admin._id,
        adminId: admin.adminId,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET || "your-secret-key-change-in-production",
      { expiresIn: "7d" }
    );

    // Save token in database (optional)
    admin.token = token;
    await admin.save();

    console.log("✅ [Admin Register API] Admin registered:", admin.email);

    // IMPORTANT: ❌ DO NOT use localStorage on the server.

    return new Response(
      JSON.stringify({
        success: true,
        message: "Admin registered successfully",
        data: {
          admin: admin.toJSON(),
          token,
        },
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ [Admin Register API] Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Registration failed",
      }),
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------
// GET: List all admins (protected)
// ---------------------------------------------------------
export async function GET(req) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Authorization token required",
        }),
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key-change-in-production"
    );

    const admin = await Admin.findOne({ _id: decoded.id, token });

    if (!admin || admin.role !== "admin") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Admin access required",
        }),
        { status: 403 }
      );
    }

    const admins = await Admin.find({}).select("-password -token");

    return new Response(
      JSON.stringify({
        success: true,
        data: admins,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ [Admin Register API] GET Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to fetch admins",
      }),
      { status: 500 }
    );
  }
}
