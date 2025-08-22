import React from 'react';

interface ButtonLoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const ButtonLoader: React.FC<ButtonLoaderProps> = ({
  size = 'small',
  color = 'currentColor',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  };

  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full animate-spin`}
        style={{ color }}
      ></div>
    </div>
  );
};

export default ButtonLoader; 