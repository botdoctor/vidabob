import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section id="home" className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white w-full overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {t('hero.title')}
                <span className="block text-yellow-400">{t('hero.subtitle')}</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                {t('hero.description')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/inventory')}
                className="inline-flex items-center justify-center px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {t('hero.browseInventory')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 font-semibold rounded-lg transition-all duration-300"
              >
                {t('hero.contactUs')}
              </button>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-blue-200 text-sm">{t('hero.vehiclesSold')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-blue-200 text-sm">{t('hero.happyCustomers')}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold">4.9</span>
                  <Star className="h-6 w-6 text-yellow-400 fill-current ml-1" />
                </div>
                <div className="text-blue-200 text-sm">{t('hero.averageRating')}</div>
              </div>
            </div>
          </div>

          {/* Right Content - Featured Image */}
          <div className="relative">
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 shadow-2xl">
              <img
                src="/background-image.jpeg"
                alt="Premium vehicle"
                className="w-full h-80 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-lg"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-bold mb-2">Premium Collection</h3>
                <p className="text-sm text-gray-200">Luxury vehicles with exceptional quality and performance</p>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 bg-yellow-500 text-blue-900 rounded-full p-4 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;