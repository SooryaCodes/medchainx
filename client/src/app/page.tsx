import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  HeartPulse, 
  Shield, 
  Clock, 
  ChevronRight,
  Users,
  Cloud,
  Brain,
  Link2,
  QrCode,
  Hospital,
  Stethoscope,
  Pill,
  Building2,
  Sparkles
} from "lucide-react";
import FeatureGrid from "@/components/features/FeatureGrid";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-900" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Animated shapes */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 right-1/4 w-56 h-56 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
            <div className="lg:w-1/2 space-y-5 md:space-y-7">
              <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-3">
                The Future of Digital Healthcare
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Revolutionizing Healthcare with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">MedChainX</span>
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl">
                Fast, Secure, and AI-Powered electronic medical records system designed for modern healthcare providers and patients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                  Schedule Demo
                </Button>
              </div>
            </div>
            
            <div className="lg:w-1/2 mt-8 lg:mt-0">
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-indigo-500 to-purple-500 opacity-30 blur-xl animate-pulse" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 p-6">
                  <div className="aspect-video relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
                    {/* Abstract EMR Dashboard Visualization */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-3 p-4">
                      <div className="bg-blue-100 dark:bg-blue-900/40 rounded-lg"></div>
                      <div className="bg-indigo-100 dark:bg-indigo-900/40 rounded-lg col-span-2"></div>
                      <div className="bg-purple-100 dark:bg-purple-900/40 rounded-lg col-span-2 row-span-2"></div>
                      <div className="bg-green-100 dark:bg-green-900/40 rounded-lg"></div>
                      <div className="bg-cyan-100 dark:bg-cyan-900/40 rounded-lg col-span-3"></div>
                    </div>
                    <div className="relative z-10 text-center">
                      <Sparkles className="h-16 w-16 text-primary mx-auto mb-3 opacity-80" />
                      <p className="text-lg font-medium text-gray-800 dark:text-white">Smart EMR Dashboard</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">AI-Powered Insights</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
            <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">TRUSTED BY LEADING HEALTHCARE PROVIDERS</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center justify-items-center">
              <div className="text-gray-400 dark:text-gray-500 font-semibold">Apollo Hospitals</div>
              <div className="text-gray-400 dark:text-gray-500 font-semibold">Fortis Healthcare</div>
              <div className="text-gray-400 dark:text-gray-500 font-semibold">AIIMS Delhi</div>
              <div className="text-gray-400 dark:text-gray-500 font-semibold">Narayana Health</div>
              <div className="text-gray-400 dark:text-gray-500 font-semibold">Manipal Hospitals</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-50 to-transparent dark:from-blue-950/30 dark:to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our EMR System?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our comprehensive platform combines cutting-edge technology with user-friendly design
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="bg-blue-100 dark:bg-blue-800/30 p-3 rounded-lg inline-block mb-4">
                <Cloud className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Cloud-Based & Secure</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access medical records from anywhere with bank-level encryption and data protection.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="bg-indigo-100 dark:bg-indigo-800/30 p-3 rounded-lg inline-block mb-4">
                <Brain className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get automated diagnosis suggestions, treatment history, and predictive health analytics.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="bg-purple-100 dark:bg-purple-800/30 p-3 rounded-lg inline-block mb-4">
                <Link2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Blockchain Integration</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ensuring tamper-proof records, data transparency, and decentralized access.
              </p>
            </div>
            
            {/* Card 4 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="bg-green-100 dark:bg-green-800/30 p-3 rounded-lg inline-block mb-4">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Doctor & Patient Portal</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Easy collaboration between doctors, hospitals, and patients for seamless care.
              </p>
            </div>
            
            {/* Card 5 */}
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="bg-cyan-100 dark:bg-cyan-800/30 p-3 rounded-lg inline-block mb-4">
                <QrCode className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Smart Health Cards</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Store all medical records, prescriptions, and reports in a single QR-based card.
              </p>
            </div>
            
            {/* Card 6 */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="bg-pink-100 dark:bg-pink-800/30 p-3 rounded-lg inline-block mb-4">
                <Hospital className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Interoperability</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connected with top hospitals, pharmacies, and diagnostic labs for instant data sharing.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features That Make a Difference
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our comprehensive platform streamlines medical record management with cutting-edge technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature items */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <HeartPulse className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Instant Patient Record Access</h3>
              <p className="text-gray-600 dark:text-gray-300">
                All health data, from allergies to chronic diseases, in one place.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <Pill className="h-8 w-8 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Automated Prescriptions</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get medication recommendations and avoid harmful drug interactions.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <QrCode className="h-8 w-8 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Smart Health Cards</h3>
              <p className="text-gray-600 dark:text-gray-300">
                No more paperwork! Carry all your medical history in a single scannable card.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <Hospital className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Doctor-Hospital-Pharmacy Sync</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get instant access to test results, prescriptions, and treatment history.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <Clock className="h-8 w-8 text-cyan-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Real-Time Vitals & Monitoring</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track patient vitals remotely and detect early warning signs.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <Shield className="h-8 w-8 text-pink-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Smart Billing & Insurance Claims</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Hassle-free claims processing with integrated insurance partners.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Who Can Benefit Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Who Can Benefit?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform is designed to serve the entire healthcare ecosystem
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl text-center">
              <Stethoscope className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Doctors & Hospitals</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Save time, reduce errors, and improve patient care.
              </p>
            </div>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl text-center">
              <Hospital className="h-10 w-10 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Clinics & Diagnostic Centers</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Fast, accurate, and automated medical data processing.
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl text-center">
              <Users className="h-10 w-10 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Patients</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Carry your entire medical history with our Smart Health Card.
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl text-center">
              <Pill className="h-10 w-10 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pharmacies</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Verify digital prescriptions instantly and prevent fraud.
              </p>
            </div>
            
            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-xl text-center">
              <Building2 className="h-10 w-10 text-cyan-600 dark:text-cyan-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Insurance Providers</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Secure and automated claims processing with instant approvals.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get started with our platform in three simple steps
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl text-center w-full md:w-1/3 relative">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Register & Get Your Smart Health Card</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sign up and receive your personalized QR-based health card.
              </p>
              
              {/* Connector */}
              <div className="hidden md:block absolute top-1/2 right-0 w-12 h-2 bg-primary transform translate-x-6"></div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl text-center w-full md:w-1/3 relative z-10 md:mx-6">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connect with Hospitals & Doctors</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Link your profile with healthcare providers for seamless data sharing.
              </p>
              
              {/* Connector */}
              <div className="hidden md:block absolute top-1/2 right-0 w-12 h-2 bg-primary transform translate-x-6"></div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl text-center w-full md:w-1/3">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Access Your Records Anytime</h3>
              <p className="text-gray-600 dark:text-gray-300">
                View and share your medical history securely from any device.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/90 via-indigo-600/90 to-purple-600/90 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Future of Healthcare Today!</h2>
          <p className="max-w-2xl mx-auto mb-8 text-white/80 text-lg">
            Experience the most advanced EMR system now. Sign up and get your Smart Health Card for FREE!
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300">
              Create Your Account
            </Button>
          </Link>
          
          <div className="mt-10 pt-10 border-t border-white/20 flex flex-col md:flex-row items-center justify-center gap-6 text-sm">
            <div className="flex items-center">
              <span className="mr-2">📩</span> Contact Us
            </div>
            <div className="flex items-center">
              <span className="mr-2">📞</span> Support: +91-XXXX-XXXXXX
            </div>
            <div className="flex items-center">
              <span className="mr-2">🌍</span> www.youremrapp.com
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
