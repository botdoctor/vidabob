import React from 'react';
import Hero from '../components/Hero';
import VehicleCarousel from '../components/VehicleCarousel';
import VidaMotorsBenefits from '../components/VidaMotorsBenefits';

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <VehicleCarousel />
      <VidaMotorsBenefits />
    </div>
  );
};

export default Home;