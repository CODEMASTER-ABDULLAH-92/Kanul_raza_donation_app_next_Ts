import jwt from "jsonwebtoken";
import dbConnect from "../../../lib/mongodb";
import Admin from "../../../models/admin";
import User from "../../../models/staff.model";

export async function DELETE(req) {
  try {
    await dbConnect();

    // 📦 Get body
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "User ID is required",
        }),
        { status: 400 }
      );
    }

    // 🔐 Get token
    const token = req.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Authorization token required",
        }),
        { status: 401 }
      );
    }

    // 🔍 Verify token
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key-change-in-production"
      );
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid or expired token",
        }),
        { status: 401 }
      );
    }

    // 👑 Verify admin
    const admin = await Admin.findOne({
      _id: decoded.id,
      token,
      role: "admin",
    });

    if (!admin) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unauthorized access",
        }),
        { status: 403 }
      );
    }

    // 🧑 Find user
    const user = await User.findById(userId);

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "User not found",
        }),
        { status: 404 }
      );
    }

    // ❌ Delete user
    await User.findByIdAndDelete(userId);

    console.log(
      `🗑️ [Admin Delete User] Admin ${admin.email} deleted user ${userId}`
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "User deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ [Admin Delete User] Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to delete user",
      }),
      { status: 500 }
    );
  }
}
