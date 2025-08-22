import React, { useState } from 'react';
import Head from 'next/head';
import Loader from '@/components/Loader';
import LoaderExamples from '@/components/LoaderExamples';
import MainLayout from './layouts/MainLayout';

const LoaderDemo = () => {
  const [selectedType, setSelectedType] = useState<'spinner' | 'dots' | 'pulse' | 'wave' | 'ring'>('spinner');
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [selectedColor, setSelectedColor] = useState('#2b8ebf');
  const [showText, setShowText] = useState(true);

  const loaderTypes = [
    { value: 'spinner', label: 'Spinner' },
    { value: 'dots', label: 'Dots' },
    { value: 'pulse', label: 'Pulse' },
    { value: 'wave', label: 'Wave' },
    { value: 'ring', label: 'Ring' }
  ];

  const sizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];

  const colors = [
    { value: '#2b8ebf', label: 'Blue' },
    { value: '#10b981', label: 'Green' },
    { value: '#f59e0b', label: 'Yellow' },
    { value: '#ef4444', label: 'Red' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#000000', label: 'Black' }
  ];

  return (
    <>
      <Head>
        <title>Loader Demo - Project Management</title>
        <meta name="description" content="Loader component demo" />
      </Head>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Loader Component Demo</h1>
          
          {/* Controls */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Customize Loader</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {loaderTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sizes.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {colors.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Show Text Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Show Text</label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showText}
                    onChange={(e) => setShowText(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Display loading text</span>
                </label>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="flex items-center justify-center min-h-[200px] bg-gray-50 rounded-lg">
              <Loader
                type={selectedType}
                size={selectedSize}
                color={selectedColor}
                text={showText ? "Loading..." : undefined}
              />
            </div>
          </div>

          {/* All Loader Types */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-semibold mb-6">All Loader Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loaderTypes.map((type) => (
                <div key={type.value} className="text-center">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">{type.label}</h3>
                  <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
                    <Loader
                      type={type.value as any}
                      size="medium"
                      color="#2b8ebf"
                      text="Loading..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Examples */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold mb-6">Usage Examples</h2>
            <LoaderExamples />
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default LoaderDemo; 