import React from 'react';
import { services } from '../data/services';
import { Car, Key, CreditCard, Wrench, CheckCircle } from 'lucide-react';

const Services: React.FC = () => {
  const getIcon = (iconName: string) => {
    const iconProps = { className: 'h-12 w-12 text-blue-600' };
    switch (iconName) {
      case 'Car':
        return <Car {...iconProps} />;
      case 'Key':
        return <Key {...iconProps} />;
      case 'CreditCard':
        return <CreditCard {...iconProps} />;
      case 'Wrench':
        return <Wrench {...iconProps} />;
      default:
        return <Car {...iconProps} />;
    }
  };

  return (
    <section id="services" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From sales to service, we provide comprehensive automotive solutions 
            to meet all your transportation needs with professionalism and care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-blue-100 rounded-full">
                  {getIcon(service.icon)}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-2 w-full">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Why Choose Viida Motors?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                  <span>Over 20 years of automotive expertise</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                  <span>Certified technicians and quality parts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                  <span>Competitive pricing and financing options</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                  <span>Exceptional customer service and support</span>
                </div>
              </div>
            </div>
            
            <div className="text-center lg:text-right">
              <img
                src="https://images.pexels.com/photos/3766111/pexels-photo-3766111.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Service team"
                className="rounded-lg shadow-lg w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;