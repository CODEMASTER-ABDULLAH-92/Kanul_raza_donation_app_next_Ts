import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Staff from "../../../models/staff.model";

export async function GET() {
  console.log("🔵 [API] Get All Staff endpoint called");

  try {
    console.log("🔵 [API] Connecting to database...");
    await dbConnect();
    console.log("✅ [API] Database connected");

    console.log("📥 [API] Fetching staff list...");
    const staffList = await Staff.find().select("-password -__v");

    console.log(`📊 [API] Total staff found: ${staffList.length}`);

    return NextResponse.json(
      {
        success: true,
        message: "Staff list retrieved successfully",
        data: {
          staff: staffList,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ [API] Error fetching staff:", error);
    console.error("❌ [API] Stack Trace:", error.stack);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch staff: " + error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
