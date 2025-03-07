import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  HeartPulse, 
  Shield, 
  Clock, 
  ChevronRight,
  Users
} from "lucide-react";
import FeatureGrid from "@/components/features/FeatureGrid";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
            <div className="lg:w-1/2 space-y-4 md:space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-primary text-sm font-medium mb-2">
                Next-Generation Healthcare
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Modern <span className="text-primary">EMR Solution</span> for Healthcare Providers
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl">
                MedChainX delivers a seamless, secure, and intuitive electronic medical records system designed for hospitals, doctors, and patients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="btn-primary">
                  Get Started <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Schedule Demo
                </Button>
              </div>
            </div>
            
            <div className="lg:w-1/2 mt-8 lg:mt-0">
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-blue-400 opacity-30 blur-xl animate-pulse" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image 
                    src="/dashboard-preview.jpg" 
                    alt="MedChainX Dashboard" 
                    width={600} 
                    height={400}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Modern Healthcare
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our comprehensive platform streamlines medical record management with cutting-edge technology
            </p>
          </div>
          
          <FeatureGrid />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary/90 to-blue-600/90 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Healthcare Practice?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-white/80 text-lg">
            Join thousands of healthcare providers who have streamlined their operations with MedChainX
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
