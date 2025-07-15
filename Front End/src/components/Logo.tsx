import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", width = 144, height = 60 }) => {
  return (
    <div className={className}>
      <img 
        src="/Vida Motors Logo.svg" 
        alt="Vida Motors Logo" 
        width={width} 
        height={height}
        className="max-w-full h-auto"
      />
    </div>
  );
};

export default Logo;