import React from 'react';
import { Shield, Eye, Heart, Zap, Smartphone, Car, MessageCircle } from 'lucide-react';

const VidaMotorsBenefits: React.FC = () => {
  const benefits = [
    {
      title: '200 POINT INSPECTION',
      description: 'Every vehicle undergoes our comprehensive 200-point inspection for quality assurance',
      icon: Shield,
      image: 'https://images.pexels.com/photos/3807226/pexels-photo-3807226.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'TRANSPARENT PRICING',
      description: 'No hidden fees or surprises. Clear, upfront pricing on all our vehicles',
      icon: Eye,
      image: 'https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'SATISFACTION GUARANTEE',
      description: '100% satisfaction guarantee with our quality vehicles and service',
      icon: Heart,
      image: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'NO HAGGLE EXPERIENCE',
      description: 'Fair, fixed pricing means no stressful negotiations - just honest deals',
      icon: Zap,
      image: 'https://images.pexels.com/photos/3807344/pexels-photo-3807344.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const processSteps = [
    {
      title: 'Choose from the best pre-owned or new vehicles',
      description: 'Browse our inventory of fully inspected cars online. Buy with full confidence.',
      action: 'View All Cars >',
      icon: Car,
      image: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      title: 'Book a free test drive online, or through Whatsapp',
      description: 'Make sure your dream car suits you before you purchase.',
      action: 'Book Test Drive >',
      icon: Smartphone,
      image: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      title: 'Easy Whatsapp communication. Easy transaction process.',
      description: 'Fast and easy transaction 100% satisfaction guarantee.',
      action: 'Buy a Car >',
      icon: MessageCircle,
      image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Benefits Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Vida Motors Assured® Benefits
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your dream car also comes with these benefits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg mb-4">
                <img
                  src={benefit.image}
                  alt={benefit.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Vida Motors Logo Overlay */}
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white text-sm font-bold">VIDA MOTORS</span>
                </div>
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center mb-3">
                    <benefit.icon className="h-6 w-6 mr-2" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 leading-tight">
                    {benefit.title}
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm text-center px-2">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Vida Motors Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            You won't just love our cars, you'll love the way you buy them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {processSteps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto mb-4 relative overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-blue-600/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                      <step.icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                {step.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {step.description}
              </p>
              
              <button className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 group-hover:underline">
                {step.action}
              </button>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Find Your Perfect Vehicle?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Experience the Vida Motors difference with our assured benefits and seamless buying process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Browse Inventory
              </button>
              <a
                href="https://wa.me/50661657093"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Contact Us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VidaMotorsBenefits;