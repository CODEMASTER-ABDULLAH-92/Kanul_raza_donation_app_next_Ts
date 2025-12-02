import Link from "next/link";


export default function AdminLogin() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-white to-green-100 flex items-center justify-center p-8">
      <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-10 w-full max-w-md border border-green-200">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">Admin Login</h1>

        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Admin Email"
            className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Back to <Link href="/" className="text-green-600 font-semibold">Home</Link>
        </p>
      </div>
    </main>
  );
}