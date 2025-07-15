import React, { useEffect } from 'react';
import { Car, DollarSign, Clock, CheckCircle, Star, Users, Award } from 'lucide-react';

const SellCarPage: React.FC = () => {
  useEffect(() => {
    // Load the form embed script
    const script = document.createElement('script');
    script.src = 'https://link.ascendscaling.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  const benefits = [
    {
      icon: DollarSign,
      title: 'Best Market Price',
      description: 'Get the highest value for your vehicle with our competitive pricing and market expertise.'
    },
    {
      icon: Clock,
      title: 'Quick Process',
      description: 'Fast and efficient evaluation process. Get your quote within 24 hours.'
    },
    {
      icon: CheckCircle,
      title: 'Hassle-Free',
      description: 'We handle all the paperwork and legal requirements for a smooth transaction.'
    },
    {
      icon: Star,
      title: 'Trusted Service',
      description: 'Over 20 years of experience in the automotive industry with thousands of satisfied customers.'
    }
  ];

  const testimonials = [
    {
      name: 'Maria Rodriguez',
      text: 'Vida Motors gave me the best price for my car. The process was incredibly smooth and professional.',
      rating: 5
    },
    {
      name: 'Carlos Mendez',
      text: 'I was amazed at how quick and easy it was to sell my vehicle. Highly recommend their service!',
      rating: 5
    },
    {
      name: 'Ana Gutierrez',
      text: 'Excellent customer service and fair pricing. They made selling my car stress-free.',
      rating: 5
    }
  ];

  const steps = [
    {
      step: 1,
      title: 'Submit Your Information',
      description: 'Fill out our simple form with your vehicle details and contact information.'
    },
    {
      step: 2,
      title: 'Vehicle Evaluation',
      description: 'Our experts will evaluate your vehicle and provide you with a competitive quote.'
    },
    {
      step: 3,
      title: 'Complete the Sale',
      description: 'Accept our offer and we\'ll handle all the paperwork for a smooth transaction.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Sell Your Car to <span className="text-yellow-400">Vida Motors</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              Get the best value for your vehicle with Costa Rica's most trusted car dealership. 
              Quick, fair, and hassle-free car selling experience.
            </p>
            <div className="flex items-center justify-center space-x-8 text-blue-100">
              <div className="text-center">
                <div className="text-3xl font-bold">24hrs</div>
                <div className="text-sm">Quick Quote</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">20+</div>
                <div className="text-sm">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-sm">Cars Purchased</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Sell to Vida Motors?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make selling your car simple, fast, and profitable with our proven process and expert team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <benefit.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Your Free Quote Today
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fill out the form below and our team will contact you within 24 hours with a competitive offer for your vehicle.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-2 text-blue-600 mb-4">
                <Car className="h-6 w-6" />
                <span className="font-semibold">Secure Vehicle Consignment Form</span>
              </div>
              <div className="text-center text-sm text-gray-600">
                Your information is protected and will only be used to provide you with a quote.
              </div>
            </div>

            {/* Iframe Container */}
            <div className="bg-white rounded-lg overflow-hidden shadow-inner" style={{ minHeight: '664px' }}>
              <iframe
                src="https://link.ascendscaling.com/widget/form/K4noqxPsgo5usWBmKQrx"
                style={{ width: '100%', height: '664px', border: 'none', borderRadius: '3px' }}
                id="inline-K4noqxPsgo5usWBmKQrx"
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="Consignment"
                data-height="664"
                data-layout-iframe-id="inline-K4noqxPsgo5usWBmKQrx"
                data-form-id="K4noqxPsgo5usWBmKQrx"
                title="Consignment"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say about selling their cars to Vida Motors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-900">{testimonial.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="h-16 w-16 mx-auto mb-6 text-yellow-400" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Sell Your Car?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have sold their vehicles to Vida Motors. 
            Get your free quote today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('inline-K4noqxPsgo5usWBmKQrx')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
            >
              Get Free Quote
            </button>
            <a
              href="https://wa.me/50661657093"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SellCarPage;