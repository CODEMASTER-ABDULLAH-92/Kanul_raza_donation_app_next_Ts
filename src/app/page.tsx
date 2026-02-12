import Link from "next/link";
import { 
  FiBookOpen, 
  FiHome, 
  FiUsers, 
  FiMail, 
  FiMapPin, 
  FiGlobe, 
  FiHeart,
  FiShield,
  FiLock
} from "react-icons/fi";
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube, 
  FaWhatsapp,
  FaMosque,
  FaSchool,
  FaBook,
  FaHandHoldingHeart
} from "react-icons/fa";

export default function Home() {
  const services = [
    { icon: <FaSchool className="text-blue-600" />, title: "Boys & Girls Madrasas", description: "Islamic education for youth" },
    { icon: <FaMosque className="text-green-600" />, title: "Masjid Construction", description: "Building houses of worship" },
    { icon: <FaBook className="text-yellow-600" />, title: "Islamic Literature", description: "Books and educational materials" },
    { icon: <FaHandHoldingHeart className="text-red-500" />, title: "Welfare Programs", description: "Community support services" },
  ];

  const socialMedia = [
    { icon: <FaFacebook />, name: "Facebook", color: "text-blue-600", hover: "hover:text-blue-700" },
    { icon: <FaInstagram />, name: "Instagram", color: "text-pink-600", hover: "hover:text-pink-700" },
    { icon: <FaTwitter />, name: "Twitter", color: "text-sky-500", hover: "hover:text-sky-600" },
    { icon: <FaYoutube />, name: "YouTube", color: "text-red-600", hover: "hover:text-red-700" },
    { icon: <FaWhatsapp />, name: "WhatsApp", color: "text-green-600", hover: "hover:text-green-700" },
  ];

  return (
    <main className="min-h-screen w-full bg-linear-to-r from-green-50 via-white to-emerald-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-green-200 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-linear-to-r from-green-500 to-green-600 flex items-center justify-center">
                <FaMosque className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-green-700">Darul Raza Institute</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">About Us</a>
              <a href="#services" className="text-gray-700 hover:text-green-600 transition-colors">Services</a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-green-100 text-green-700 px-6 py-3 rounded-full mb-8">
            <FiShield className="h-5 w-5" />
            <span className="font-medium">Islamic Educational & Welfare Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to <span className="bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Darul Raza Institute</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Dedicated to spreading the teachings of Islam and supporting the Muslim community through education, construction, and welfare services.
          </p>

          {/* Login Options */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/staff_login"
              className="group px-8 py-4 rounded-xl bg-linear-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg hover:from-green-600 hover:to-green-700 hover:shadow-xl transition-all flex items-center justify-center gap-3"
            >
              <FiLock className="h-5 w-5" />
              <span>Staff Login Portal</span>
              <FiHeart className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              href="/admin_login"
              className="group px-8 py-4 rounded-xl bg-white text-green-600 font-semibold border-2 border-green-600 shadow-lg hover:bg-green-50 hover:shadow-xl transition-all flex items-center justify-center gap-3"
            >
              <FiShield className="h-5 w-5" />
              <span>Admin Dashboard</span>
              <FiGlobe className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-md border border-green-100">
              <div className="text-3xl font-bold text-green-600">50+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-green-100">
              <div className="text-3xl font-bold text-green-600">10+</div>
              <div className="text-gray-600">Completed Projects</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-green-100">
              <div className="text-3xl font-bold text-green-600">1000+</div>
              <div className="text-gray-600">Books Distributed</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-green-100">
              <div className="text-3xl font-bold text-green-600">24/7</div>
              <div className="text-gray-600">Welfare Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission & Vision</h2>
              <div className="w-24 h-1 bg-linear-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="bg-linear-to-r from-green-50 to-emerald-50 p-8 md:p-12 rounded-2xl shadow-lg border border-green-200">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <span className="font-semibold text-green-700">Darul Raza Institute</span> is a comprehensive Islamic platform dedicated to serving the Muslim community through education, spiritual guidance, and social welfare. We strive to create a society deeply rooted in Islamic values while addressing contemporary challenges.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <FiBookOpen className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">Providing authentic Islamic education through structured madrasa programs</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <FiHome className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">Constructing and maintaining masjids as centers of community worship</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <FiUsers className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">Supporting Muslim families through welfare programs and financial assistance</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <FiGlobe className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">Spreading Islamic knowledge through publications and digital platforms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="py-16 bg-linear-to-r from-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive Islamic services for the betterment of our community</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="group bg-white p-6 rounded-xl shadow-md border border-green-100 hover:shadow-xl hover:border-green-300 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-lg bg-green-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-linear-to-r from-green-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Support Our Mission</h2>
            <p className="text-green-100 mb-8 max-w-2xl mx-auto">
              Your donations help us continue our important work in education, construction, and community welfare. Every contribution makes a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/donation_form"
                className="px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-all shadow-lg"
              >
                Make a Donation
              </Link>
              <Link
                href="#contact"
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
              >
                Become a Volunteer
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Social Section */}
      <div id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Connect With Us</h2>
              <p className="text-gray-600">Stay updated with our activities and connect with our community</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="bg-green-50 p-8 rounded-2xl border border-green-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <FiMapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-600">Lahore, Pakistan</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <FiMail className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">info@DarulRaza.org</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Social Media */}
              <div className="bg-white p-8 rounded-2xl border border-green-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Follow Our Journey</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all ${social.hover}`}
                    >
                      <div className={`text-2xl mb-2 ${social.color}`}>
                        {social.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-linear-to-r from-white to-green-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-linear-to-r from-green-500 to-green-600 flex items-center justify-center">
                <FaMosque className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-green-700">Darul Raza Institute</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              {/* <Link href="/privacy" className="hover:text-green-600 transition-colors">Privacy Policy</Link> */}
              {/* <Link href="/terms" className="hover:text-green-600 transition-colors">Terms of Service</Link> */}
              {/* <span className="text-gray-400">•</span> */}
              <p className="flex items-center gap-2">
                <FiHeart className="h-4 w-4 text-red-400" />
                Serving the Muslim Ummah with dedication
              </p>
            </div>
            
            <div className="text-sm text-gray-500">
              <span>&copy; {new Date().getFullYear()} All rights reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}