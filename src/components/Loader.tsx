import React from 'react';

interface LoaderProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'wave' | 'ring';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  type = 'spinner',
  size = 'medium',
  color = '#2b8ebf',
  text = 'Loading...',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const SpinnerLoader = () => (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]}`} 
         style={{ borderTopColor: color }}></div>
  );

  const DotsLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`rounded-full animate-bounce ${sizeClasses[size]}`}
          style={{
            backgroundColor: color,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s'
          }}
        ></div>
      ))}
    </div>
  );

  const PulseLoader = () => (
    <div className={`animate-pulse rounded-full ${sizeClasses[size]}`} 
         style={{ backgroundColor: color }}></div>
  );

  const WaveLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-1 bg-current rounded-full animate-pulse"
          style={{
            color: color,
            animationDelay: `${i * 0.1}s`,
            height: size === 'small' ? '12px' : size === 'medium' ? '16px' : '24px'
          }}
        ></div>
      ))}
    </div>
  );

  const RingLoader = () => (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full border-4 border-gray-200`}></div>
      <div 
        className={`absolute top-0 left-0 ${sizeClasses[size]} rounded-full border-4 border-transparent border-t-current animate-spin`}
        style={{ borderTopColor: color }}
      ></div>
    </div>
  );

  const getLoaderComponent = () => {
    switch (type) {
      case 'dots':
        return <DotsLoader />;
      case 'pulse':
        return <PulseLoader />;
      case 'wave':
        return <WaveLoader />;
      case 'ring':
        return <RingLoader />;
      default:
        return <SpinnerLoader />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {getLoaderComponent()}
      {text && (
        <p className="text-sm font-medium text-gray-600" style={{ color }}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader; 