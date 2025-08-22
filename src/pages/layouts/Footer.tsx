import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-900 font-bold text-sm">IPM</span>
              </div>
              <span className="ml-2 text-lg font-semibold">Institute of Project Management</span>
            </div>
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm">Google 4.6 stars</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">IPM</h3>
            <ul className="space-y-2 text-blue-100">
              <li><a href="/courses" className="hover:text-white">Professional Diplomas</a></li>
              <li><a href="/membership" className="hover:text-white">IPM Membership</a></li>
              <li><a href="/corporate" className="hover:text-white">Corporate Training</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-blue-100">
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/careers" className="hover:text-white">Careers</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Join Our Community</h3>
            <div className="flex space-x-4 mb-6">
              {['Facebook', 'Twitter', 'LinkedIn', 'Instagram', 'YouTube', 'TikTok'].map((platform) => (
                <a key={platform} href="#" className="text-blue-100 hover:text-white">
                  <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-xs">
                    {platform.charAt(0)}
                  </div>
                </a>
              ))}
            </div>
            
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-blue-100 text-sm">
              <p>info@ipm.ie</p>
              <p>+353 1 234 5678</p>
              <p>Dublin, Ireland</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-100 text-sm">© 2025 Institute of Project Management. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="/privacy" className="text-blue-100 hover:text-white text-sm">Privacy Policy</a>
              <a href="/terms" className="text-blue-100 hover:text-white text-sm">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 