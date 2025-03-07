import { HeartPulse, Shield, Clock, Users } from "lucide-react";

const features = [
  {
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
    title: "Comprehensive Records",
    description: "Store complete patient histories in one secure location"
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Advanced Security",
    description: "HIPAA-compliant data protection and encryption"
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Real-time Updates",
    description: "Instant synchronization across all devices"
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Team Collaboration",
    description: "Seamless coordination between healthcare providers"
  }
];

export default function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="glass-container p-6 text-center hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px]"
        >
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center mb-4">
            {feature.icon}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
} 