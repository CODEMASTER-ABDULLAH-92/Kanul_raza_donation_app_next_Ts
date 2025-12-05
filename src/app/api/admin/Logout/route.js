export async function POST() {
  try {
    localStorage.removeItem("admin_token");
    return new Response(
      JSON.stringify({ message: "Logged out successfully" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Logout failed. ", err }), { status: 500 });
  }
}
