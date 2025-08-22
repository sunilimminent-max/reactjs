import React from 'react';
import Loader from './Loader';

interface LoadingOverlayProps {
  isVisible: boolean;
  type?: 'spinner' | 'dots' | 'pulse' | 'wave' | 'ring';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  backdrop?: boolean;
  zIndex?: number;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  type = 'ring',
  size = 'large',
  color = '#2b8ebf',
  text = 'Loading...',
  backdrop = true,
  zIndex = 50
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        backdrop ? 'bg-black bg-opacity-50 backdrop-blur-sm' : 'bg-transparent'
      }`}
      style={{ zIndex }}
    >
      <div className="bg-white rounded-lg shadow-xl p-8">
        <Loader
          type={type}
          size={size}
          color={color}
          text={text}
        />
      </div>
    </div>
  );
};

export default LoadingOverlay; 