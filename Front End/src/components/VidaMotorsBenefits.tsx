import React from 'react';
import { Shield, Eye, Heart, Zap, Smartphone, Car, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const VidaMotorsBenefits: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const benefits = [
    {
      title: t('benefits.inspection.title'),
      description: t('benefits.inspection.desc'),
      icon: Shield,
      image: 'https://images.pexels.com/photos/3807226/pexels-photo-3807226.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: t('benefits.pricing.title'),
      description: t('benefits.pricing.desc'),
      icon: Eye,
      image: 'https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: t('benefits.satisfaction.title'),
      description: t('benefits.satisfaction.desc'),
      icon: Heart,
      image: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: t('benefits.noHaggle.title'),
      description: t('benefits.noHaggle.desc'),
      icon: Zap,
      image: 'https://images.pexels.com/photos/3807344/pexels-photo-3807344.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const processSteps = [
    {
      title: t('benefits.step1.title'),
      description: t('benefits.step1.desc'),
      action: t('benefits.step1.action'),
      icon: Car,
      image: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      title: t('benefits.step2.title'),
      description: t('benefits.step2.desc'),
      action: t('benefits.step2.action'),
      icon: Smartphone,
      image: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      title: t('benefits.step3.title'),
      description: t('benefits.step3.desc'),
      action: t('benefits.step3.action'),
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
            {t('benefits.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('benefits.subtitle')}
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
            {t('benefits.howItWorks')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('benefits.howItWorksDesc')}
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
            <h3 className="text-2xl font-bold mb-4">{t('benefits.cta.title')}</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {t('benefits.cta.desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/inventory')}
                className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                {t('benefits.cta.browse')}
              </button>
              <a
                href="https://wa.me/50661657093"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                {t('benefits.cta.whatsapp')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VidaMotorsBenefits;