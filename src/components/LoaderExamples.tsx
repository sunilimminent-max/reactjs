import React, { useState } from 'react';
import Loader from './Loader';
import LoadingOverlay from './LoadingOverlay';
import ButtonLoader from './ButtonLoader';

const LoaderExamples = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleButtonClick = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 2000);
  };

  const handleOverlayClick = () => {
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Button Loading Example */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Button Loading States</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleButtonClick}
            disabled={buttonLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {buttonLoading && <ButtonLoader size="small" />}
            {buttonLoading ? 'Processing...' : 'Submit Form'}
          </button>

          <button
            onClick={handleButtonClick}
            disabled={buttonLoading}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {buttonLoading && <ButtonLoader size="medium" />}
            {buttonLoading ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            onClick={handleButtonClick}
            disabled={buttonLoading}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {buttonLoading && <ButtonLoader size="large" />}
            {buttonLoading ? 'Deleting...' : 'Delete Item'}
          </button>
        </div>
      </div>

      {/* Inline Loading Examples */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Inline Loading States</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Small Spinner</h4>
            <Loader type="spinner" size="small" color="#2b8ebf" />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Medium Dots</h4>
            <Loader type="dots" size="medium" color="#10b981" />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Large Ring</h4>
            <Loader type="ring" size="large" color="#f59e0b" />
          </div>
        </div>
      </div>

      {/* Content Loading Examples */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Content Loading States</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Loader type="pulse" size="small" color="#8b5cf6" />
              <span className="text-gray-700">Loading user data...</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Loader type="wave" size="medium" color="#ef4444" />
              <span className="text-gray-700">Fetching project details...</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Loader type="spinner" size="small" color="#2b8ebf" />
              <span className="text-gray-700">Updating task status...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay Loading Example */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Full Screen Overlay</h3>
        <button
          onClick={handleOverlayClick}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
        >
          Show Loading Overlay (3 seconds)
        </button>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={showOverlay}
        type="ring"
        size="large"
        color="#8b5cf6"
        text="Processing your request..."
      />
    </div>
  );
};

export default LoaderExamples; 