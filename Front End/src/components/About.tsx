import React from 'react';
import { Award, Users, Car, Heart, Shield, Star, Target, Handshake } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { icon: Car, number: '1,000+', label: 'Vehicles Sold' },
    { icon: Users, number: '500+', label: 'Happy Customers' },
    { icon: Award, number: '20+', label: 'Years Experience' },
    { icon: Heart, number: '4.9', label: 'Customer Rating' }
  ];

  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our business, from vehicle quality to customer service, ensuring you receive nothing but the best.'
    },
    {
      icon: Shield,
      title: 'Trust & Reliability',
      description: 'Our commitment to transparency and clear communication builds lasting trust with our customers and community partners.'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Every automotive journey is unique, and we take pride in tailoring our services to fit your individual needs and exceed expectations.'
    },
    {
      icon: Handshake,
      title: 'Long-term Relationships',
      description: 'We\'re dedicated to building lasting relationships that extend far beyond the initial purchase or rental experience.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">Vida Motors</span>
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your premier destination for exceptional automotive services in Costa Rica
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="h-8 w-8 text-blue-600 mr-3" />
                  Our Mission
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  As we embark on this new chapter, our commitment to delivering unparalleled experiences 
                  to our valued customers remains at the heart of everything we do. At Vida Motors, we're 
                  more than just a dealership; we're your trusted partner in automotive excellence.
                </p>
              </div>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Our dedication to quality, reliability, and customer satisfaction drives us to continually 
                  raise the bar for service in the automotive industry. What truly sets us apart is our 
                  personalized approach.
                </p>
                <p>
                  From the moment you walk through our doors to the day you drive away in your ideal vehicle, 
                  we are committed to exceeding your expectations. We understand that every automotive journey 
                  is unique, and we take pride in tailoring our services to fit your individual needs.
                </p>
                <p>
                  Our carefully curated selection of vehicles reflects our commitment to offering the finest 
                  in automotive craftsmanship. Whether you're looking for a sleek sedan, a rugged SUV, or a 
                  high-performance model, Vida Motors provides a diverse range of top-quality automobiles to 
                  match your lifestyle.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex justify-center mb-3">
                    <div className="bg-blue-100 rounded-full p-3">
                      <stat.icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-2xl shadow-lg group">
                  <img
                    src="https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Car showroom"
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-semibold">Premium Showroom</h4>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-2xl shadow-lg group">
                  <img
                    src="https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Customer service"
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-semibold">Expert Service</h4>
                  </div>
                </div>
              </div>
              <div className="space-y-6 mt-8">
                <div className="relative overflow-hidden rounded-2xl shadow-lg group">
                  <img
                    src="https://images.pexels.com/photos/3807344/pexels-photo-3807344.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Team at work"
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-semibold">Professional Team</h4>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-2xl shadow-lg group">
                  <img
                    src="https://images.pexels.com/photos/3807226/pexels-photo-3807226.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Vehicle inspection"
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-semibold">Quality Inspection</h4>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -top-6 -right-6 bg-yellow-500 text-white rounded-full p-6 shadow-xl">
              <div className="text-center">
                <Star className="h-8 w-8 mx-auto mb-2 fill-current" />
                <div className="text-sm font-bold">Costa Rica's</div>
                <div className="text-xs">Trusted Choice</div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Excellence Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-white mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Beyond the Showroom</h3>
            <p className="text-blue-100 text-lg max-w-3xl mx-auto">
              Our commitment extends to ensuring your ownership experience is seamless. Our expert technicians 
              are here to keep your vehicle running at its best with meticulous maintenance and repair services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Transparency</h4>
              <p className="text-blue-100 text-sm">
                We prioritize transparency and clear communication, keeping you informed at every stage.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Quality Assurance</h4>
              <p className="text-blue-100 text-sm">
                Every vehicle undergoes rigorous inspection to meet our high standards of excellence.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Handshake className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Lifetime Partnership</h4>
              <p className="text-blue-100 text-sm">
                We're dedicated to building long-lasting relationships that extend beyond the purchase.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide every interaction and drive our commitment to automotive excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-xl p-3 flex-shrink-0">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Statement */}
        <div className="text-center bg-gray-50 rounded-3xl p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Your Automotive Dreams Become Reality
          </h3>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8">
            At Vida Motors, we're dedicated to building long-lasting relationships. As we continue to grow, 
            we invite you to experience the next level of automotive excellence with us. Trust Vida Motors 
            to be your partner on the road, delivering not just vehicles, but a commitment to exceptional 
            service that lasts a lifetime.
          </p>
          <div className="bg-blue-600 text-white rounded-2xl p-6 inline-block">
            <p className="text-xl font-semibold">
              Thank you for choosing Vida Motors—where the journey is as memorable as the destination.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;