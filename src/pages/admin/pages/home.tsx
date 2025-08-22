import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../layouts/AdminLayout';
import { connect } from 'react-redux';
import agent from '@/agent'

interface HomePageData {
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroButtonText: string;
  heroButtonLink: string;
  aboutButtonText: string;
  aboutButtonLink: string;
  heroImage: string;
  
  // Company Logos
  companyLogos: string[];
  
  // History Section
  historyTitle: string;
  historyDescription: string;
  historyStats: {
    years: string;
    professionals: string;
    certified: string;
    recognition: string;
  };
  
  // Courses Section
  coursesTitle: string;
  coursesSubtitle: string;
  courseCards: Array<{
    title: string;
    description: string;
    price: string;
    image: string;
    badge?: string;
    features: string[];
  }>;
  
  // Newsletter Section
  newsletterTitle: string;
  newsletterDescription: string;
  
}

interface AgentResponse {
  data: any;
  isSuccess: boolean;
  message: string;
  outParam: any;
  status: number;
  statusText: string;
}

const AdminHomePage: React.FC = ({ currentUser }: any) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pageData, setPageData] = useState<HomePageData>({
    heroTitle: 'Learn from the Global Leading Experts in Project Management',
    heroSubtitle: 'Global Leading Experts',
    heroDescription: 'Courses, Certification, Membership, and Research in Project Management since 1989.',
    heroButtonText: 'Explore Courses',
    heroButtonLink: '/courses',
    aboutButtonText: 'About Us',
    aboutButtonLink: '/about',
    heroImage: '', // Placeholder, will be updated
    companyLogos: [], // Placeholder, will be updated
    historyTitle: 'Our History',
    historyDescription: 'Over the past 35 years, the Institute has dedicated itself to creating the highest quality project management education, certification and member services in Project Management – resulting in international recognition for excellence.',
    historyStats: {
      years: '35+',
      professionals: '100,000+',
      certified: '10,000+',
      recognition: 'International Recognition'
    },
    coursesTitle: 'Most Popular Project Management Courses',
    coursesSubtitle: 'Transform from Project Manager to Project Director with IPMA® Certification',
    courseCards: [
      {
        title: 'IPMA® Level A Certification',
        description: 'Advanced project management knowledge and skills for senior project managers.',
        price: '$2,999',
        image: '/images/ipma-a.jpg', // Placeholder
        features: ['Comprehensive study materials', 'Mock exams', 'Access to exam simulator']
      },
      {
        title: 'IPMA® Level B Certification',
        description: 'Intermediate project management knowledge and skills for project managers.',
        price: '$1,999',
        image: '/images/ipma-b.jpg', // Placeholder
        features: ['Study materials', 'Mock exams', 'Access to exam simulator']
      },
      {
        title: 'IPMA® Level C Certification',
        description: 'Basic project management knowledge and skills for project managers.',
        price: '$999',
        image: '/images/ipma-c.jpg', // Placeholder
        features: ['Study materials', 'Mock exams', 'Access to exam simulator']
      }
    ],
    newsletterTitle: 'Get the latest news and Insights In project management.',
    newsletterDescription: 'Stay updated with the latest trends and insights in project management.',
  });

  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    // Load existing page data if available
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      setIsLoading(true);
      const response = await agent.Page.getHomePage() as unknown as AgentResponse;
      if (response.isSuccess && response.data) {
        if (response.data.customFields) {
          // Map custom fields to page data
          const customFields = response.data.customFields;
          setPageData(prev => ({
            ...prev,
            heroTitle: customFields.heroTitle || prev.heroTitle,
            heroSubtitle: customFields.heroSubtitle || prev.heroSubtitle,
            heroDescription: customFields.heroDescription || prev.heroDescription,
            heroButtonText: customFields.heroButtonText || prev.heroButtonText,
            heroButtonLink: customFields.heroButtonLink || prev.heroButtonLink,
            aboutButtonText: customFields.aboutButtonText || prev.aboutButtonText,
            aboutButtonLink: customFields.aboutButtonLink || prev.aboutButtonLink,
            heroImage: customFields.heroImage || prev.heroImage,
            companyLogos: customFields.companyLogos || prev.companyLogos,
            historyTitle: customFields.historyTitle || prev.historyTitle,
            historyDescription: customFields.historyDescription || prev.historyDescription,
            historyStats: customFields.historyStats || prev.historyStats,
            coursesTitle: customFields.coursesTitle || prev.coursesTitle,
            coursesSubtitle: customFields.coursesSubtitle || prev.coursesSubtitle,
            courseCards: customFields.courseCards || prev.courseCards,
            newsletterTitle: customFields.newsletterTitle || prev.newsletterTitle,
            newsletterDescription: customFields.newsletterDescription || prev.newsletterDescription
          }));
        }
      }
    } catch (error) {
      console.error('Error loading page data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const response = await agent.Page.saveHomePage({
        customFields: pageData
      }) as unknown as AgentResponse; 
      
      if (response.isSuccess) {
        alert('Home page updated successfully!');
      } else {
        alert('Error updating home page: ' + response.message);
      }
    } catch (error: any) {
      console.error('Error saving page data:', error);
      alert('Error saving page data: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof HomePageData, value: string) => {
    if (field === 'historyStats' || field === 'courseCards' || field === 'socialLinks') {
      try {
        const parsedValue = JSON.parse(value);
        setPageData(prev => ({
          ...prev,
          [field]: parsedValue
        }));
      } catch (error) {
        console.error(`Invalid JSON for ${field}:`, error);
        // Keep the old value if JSON is invalid
      }
    } else {
      setPageData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const renderHeroSection = () => (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Hero Section</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hero Title
          </label>
          <input
            type="text"
            value={pageData.heroTitle}
            onChange={(e) => handleInputChange('heroTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter hero title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hero Subtitle (Highlighted Text)
          </label>
          <input
            type="text"
            value={pageData.heroSubtitle}
            onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter hero subtitle"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hero Description
          </label>
          <textarea
            value={pageData.heroDescription}
            onChange={(e) => handleInputChange('heroDescription', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter hero description"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Button Text
            </label>
            <input
              type="text"
              value={pageData.heroButtonText}
              onChange={(e) => handleInputChange('heroButtonText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Button text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Button Link
            </label>
            <input
              type="text"
              value={pageData.heroButtonLink}
              onChange={(e) => handleInputChange('heroButtonLink', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="/courses"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Button Text
            </label>
            <input
              type="text"
              value={pageData.aboutButtonText}
              onChange={(e) => handleInputChange('aboutButtonText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Button text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Button Link
            </label>
            <input
              type="text"
              value={pageData.aboutButtonLink}
              onChange={(e) => handleInputChange('aboutButtonLink', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="/about"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hero Image URL
          </label>
          <input
            type="text"
            value={pageData.heroImage}
            onChange={(e) => handleInputChange('heroImage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter hero image URL"
          />
        </div>
      </div>
    </div>
  );

  const renderCompanyLogosSection = () => (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Company Logos</h3>
      <div className="space-y-4">
        {pageData.companyLogos.map((logo, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={logo}
              onChange={(e) => {
                const newLogos = [...pageData.companyLogos];
                newLogos[index] = e.target.value;
                setPageData(prev => ({ ...prev, companyLogos: newLogos }));
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter logo URL"
            />
            <button
              onClick={() => {
                const newLogos = pageData.companyLogos.filter((_, i) => i !== index);
                setPageData(prev => ({ ...prev, companyLogos: newLogos }));
              }}
              className="px-3 py-2 text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            setPageData(prev => ({
              ...prev,
              companyLogos: [...prev.companyLogos, '']
            }));
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Logo
        </button>
      </div>
    </div>
  );

  const renderHistorySection = () => (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">History Section</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Title
          </label>
          <input
            type="text"
            value={pageData.historyTitle}
            onChange={(e) => handleInputChange('historyTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter section title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Description
          </label>
          <textarea
            value={pageData.historyDescription}
            onChange={(e) => handleInputChange('historyDescription', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter section description"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience
            </label>
            <input
              type="text"
              value={pageData.historyStats.years}
              onChange={(e) => {
                const newStats = { ...pageData.historyStats, years: e.target.value };
                setPageData(prev => ({ ...prev, historyStats: newStats }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="35+"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professionals Trained
            </label>
            <input
              type="text"
              value={pageData.historyStats.professionals}
              onChange={(e) => {
                const newStats = { ...pageData.historyStats, professionals: e.target.value };
                setPageData(prev => ({ ...prev, historyStats: newStats }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="100,000+"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certified Project Managers
            </label>
            <input
              type="text"
              value={pageData.historyStats.certified}
              onChange={(e) => {
                const newStats = { ...pageData.historyStats, certified: e.target.value };
                setPageData(prev => ({ ...prev, historyStats: newStats }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="10,000+"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recognition
            </label>
            <input
              type="text"
              value={pageData.historyStats.recognition}
              onChange={(e) => {
                const newStats = { ...pageData.historyStats, recognition: e.target.value };
                setPageData(prev => ({ ...prev, historyStats: newStats }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="International Recognition"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCoursesSection = () => (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Courses Section</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Title
          </label>
          <input
            type="text"
            value={pageData.coursesTitle}
            onChange={(e) => handleInputChange('coursesTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter section title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Subtitle
          </label>
          <input
            type="text"
            value={pageData.coursesSubtitle}
            onChange={(e) => handleInputChange('coursesSubtitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter section subtitle"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Cards (JSON)
          </label>
          <textarea
            value={JSON.stringify(pageData.courseCards, null, 2)}
            onChange={(e) => handleInputChange('courseCards', e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder='[{"title": "IPMA® Level A Certification", "description": "Advanced project management knowledge and skills for senior project managers.", "price": "$2,999", "image": "/images/ipma-a.jpg", "features": ["Comprehensive study materials", "Mock exams", "Access to exam simulator"]}, {"title": "IPMA® Level B Certification", "description": "Intermediate project management knowledge and skills for project managers.", "price": "$1,999", "image": "/images/ipma-b.jpg", "features": ["Study materials", "Mock exams", "Access to exam simulator"]}, {"title": "IPMA® Level C Certification", "description": "Basic project management knowledge and skills for project managers.", "price": "$999", "image": "/images/ipma-c.jpg", "features": ["Study materials", "Mock exams", "Access to exam simulator"]}]'
          />
        </div>
      </div>
    </div>
  );

  const renderNewsletterSection = () => (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Newsletter Section</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Title
          </label>
          <input
            type="text"
            value={pageData.newsletterTitle}
            onChange={(e) => handleInputChange('newsletterTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter section title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Description
          </label>
          <textarea
            value={pageData.newsletterDescription}
            onChange={(e) => handleInputChange('newsletterDescription', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter section description"
          />
        </div>
      </div>
    </div>
  );

  

  const renderPreview = () => (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Live Preview</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700">Hero Section:</h4>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Title:</span> {pageData.heroTitle}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Subtitle:</span> {pageData.heroSubtitle}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Description:</span> {pageData.heroDescription}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Image:</span> {pageData.heroImage ? 'Available' : 'Not set'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Company Logos:</h4>
            {pageData.companyLogos.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {pageData.companyLogos.map((logo, index) => (
                  <img key={index} src={logo} alt={`Company Logo ${index + 1}`} className="h-10" />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No company logos added.</p>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">History Section:</h4>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Title:</span> {pageData.historyTitle}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Description:</span> {pageData.historyDescription}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Stats:</span> {JSON.stringify(pageData.historyStats)}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Courses Section:</h4>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Title:</span> {pageData.coursesTitle}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Subtitle:</span> {pageData.coursesSubtitle}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Course Cards:</span>
            </p>
            {pageData.courseCards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pageData.courseCards.map((card, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-md">
                    <h5 className="font-semibold text-gray-800">{card.title}</h5>
                    <p className="text-sm text-gray-600">{card.description}</p>
                    <p className="text-sm text-gray-600">Price: {card.price}</p>
                    <p className="text-sm text-gray-600">Features: {card.features.join(', ')}</p>
                    <img src={card.image} alt={card.title} className="mt-2 h-20 object-contain" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No course cards added.</p>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Newsletter Section:</h4>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Title:</span> {pageData.newsletterTitle}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Description:</span> {pageData.newsletterDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <AdminLayout currentUser={currentUser}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentUser={currentUser}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Home Page</h1>
          <p className="text-gray-600">Customize your home page content and settings</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'hero', label: 'Hero Section' },
              { id: 'company-logos', label: 'Company Logos' },
              { id: 'history', label: 'History Section' },
              { id: 'courses', label: 'Courses Section' },
              { id: 'newsletter', label: 'Newsletter Section' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeSection === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Sections */}
        <div className="mb-6">
          {activeSection === 'hero' && renderHeroSection()}
          {activeSection === 'company-logos' && renderCompanyLogosSection()}
          {activeSection === 'history' && renderHistorySection()}
          {activeSection === 'courses' && renderCoursesSection()}
          {activeSection === 'newsletter' && renderNewsletterSection()}
          {activeSection === 'preview' && renderPreview()}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => router.push('/admin/pages')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

// Map Redux state to component props
const mapStateToProps = (state: any) => ({
  currentUser: state.common.currentUser,
});

export default connect(mapStateToProps)(AdminHomePage); 