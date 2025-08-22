import React, { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import agent from '@/agent';
import Link from 'next/link';

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
  
  // Footer
  footerText: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

interface AgentResponse {
  data: any;
  isSuccess: boolean;
  message: string;
  outParam: any;
  status: number;
  statusText: string;
}

export default function Home() {
  const [pageData, setPageData] = useState<HomePageData>({
    // Hero Section
    heroTitle: 'Learn from the Global Leading Experts in Project Management',
    heroSubtitle: 'Global Leading Experts',
    heroDescription: 'Courses, Certification, Membership, and Research in Project Management since 1989.',
    heroButtonText: 'Explore Courses',
    heroButtonLink: '/courses',
    aboutButtonText: 'About Us',
    aboutButtonLink: '/about',
    heroImage: '/images/Hero-Banner-Homepage.webp',
    
    // Company Logos
    companyLogos: [
      '/images/scrum-org-homepage-logo-84x80-1.webp',
      '/images/ipma-homepage-logo-184x80-1.webp',
      '/images/pmi-homepage-logo-152x80-1.webp',
      '/images/tu-dublin-homepage-logo-109x80-1.webp',
      '/images/prince2-homepage-logo-240x80-1.webp',
    ],
    
    // History Section
    historyTitle: 'Our History',
    historyDescription: 'Over the past 35 years, the Institute has dedicated itself to creating the highest quality project management education, certification and member services in Project Management – resulting in international recognition for excellence.',
    historyStats: {
      years: '35+',
      professionals: '50k',
      certified: '10,000',
      recognition: 'Internationally',
    },
    
    // Courses Section
    coursesTitle: 'Most Popular Project Management Courses',
    coursesSubtitle: 'Transform from Project Manager to Project Director with IPMA® Certification',
    courseCards: [
      {
        title: 'Certified Project Management Diploma',
        description: 'Learn to confidently manage projects and drive successful outcomes.',
        price: '€2,395',
        image: 'https://cdn-dilge.nitrocdn.com/CEoyLRJrMZkvcZHgfQFGOitFXuUyzTkm/assets/images/optimized/rev-245ee0b/projectmanagement.ie/wp-content/uploads/2021/09/CPMD-Thumbnail-Compressed-1020-jpg.webp',
        features: ['For PMs, project team members and aspiring PMs.', 'IPMA-D®, NFQ Level 8, CPM Dip.', '42 Hours'],
      },
      {
        title: 'Strategic Project Programme Management Diploma',
        description: 'Develop advanced skills in managing programmes and strategic PMOs.',
        price: '€2,500',
        image: 'https://cdn-dilge.nitrocdn.com/CEoyLRJrMZkvcZHgfQFGOitFXuUyzTkm/assets/images/optimized/rev-245ee0b/projectmanagement.ie/wp-content/uploads/2022/02/SPPMD-Thumbnail-Compressed-1020-jpg.webp',
        features: ['For those who have approx. 3 years working on projects.', 'IPMA-C®, NFQ Level 9, SPPM Dip.', '42 Hours'],
      },
      {
        title: 'Project Leadership & Management Diploma',
        description: 'Master leadership skills to lead complex projects as a Project Director.',
        price: '€2,750',
        image: 'https://cdn-dilge.nitrocdn.com/CEoyLRJrMZkvcZHgfQFGOitFXuUyzTkm/assets/images/optimized/rev-245ee0b/projectmanagement.ie/wp-content/uploads/2021/07/PLD-Thumbnail-Compressed-1020-jpg.webp',
        features: ['For those who have over 4 years managing complex projects.', 'IPMA-B/A®, NFQ Level 9, PLM Dip.', '42 Hours'],
      },
    ],
    
    // Newsletter Section
    newsletterTitle: 'Get the latest news and Insights In project management.',
    newsletterDescription: 'Stay updated with the latest trends and insights in project management.',
    
    // Footer
    footerText: '© 2023 Project Management Institute. All rights reserved.',
    socialLinks: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDynamicContent();
  }, []);

  const loadDynamicContent = async () => {
    try {
      const response = await agent.Page.getHomePage() as unknown as AgentResponse;
      if (response.isSuccess && response.data.customFields) {
        const customFields = response.data.customFields;
        setPageData(prev => ({
          ...prev,
          // Hero Section
          heroTitle: customFields.heroTitle || prev.heroTitle,
          heroSubtitle: customFields.heroSubtitle || prev.heroSubtitle,
          heroDescription: customFields.heroDescription || prev.heroDescription,
          heroButtonText: customFields.heroButtonText || prev.heroButtonText,
          heroButtonLink: customFields.heroButtonLink || prev.heroButtonLink,
          aboutButtonText: customFields.aboutButtonText || prev.aboutButtonText,
          aboutButtonLink: customFields.aboutButtonLink || prev.aboutButtonLink,
          heroImage: customFields.heroImage || prev.heroImage,
          
          // Company Logos
          companyLogos: customFields.companyLogos || prev.companyLogos,
          
          // History Section
          historyTitle: customFields.historyTitle || prev.historyTitle,
          historyDescription: customFields.historyDescription || prev.historyDescription,
          historyStats: {
            years: customFields.historyStatsYears || prev.historyStats.years,
            professionals: customFields.historyStats.professionals || prev.historyStats.professionals,
            certified: customFields.historyStatsCertified || prev.historyStats.certified,
            recognition: customFields.historyStatsRecognition || prev.historyStats.recognition,
          },
          
          // Courses Section
          coursesTitle: customFields.coursesTitle || prev.coursesTitle,
          coursesSubtitle: customFields.coursesSubtitle || prev.coursesSubtitle,
          courseCards: customFields.courseCards || prev.courseCards,
          
          // Newsletter Section
          newsletterTitle: customFields.newsletterTitle || prev.newsletterTitle,
          newsletterDescription: customFields.newsletterDescription || prev.newsletterDescription,
          
          // Footer
          footerText: customFields.footerText || prev.footerText,
          socialLinks: {
            facebook: customFields.socialLinksFacebook || prev.socialLinks.facebook,
            twitter: customFields.socialLinksTwitter || prev.socialLinks.twitter,
            linkedin: customFields.socialLinksLinkedin || prev.socialLinks.linkedin,
            instagram: customFields.socialLinksInstagram || prev.socialLinks.instagram,
          },
        }));
      }
    } catch (error) {
      console.error('Error loading dynamic content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="home-section-1 py-20">
    
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                {pageData.heroTitle.split(pageData.heroSubtitle).map((part, index, array) => (
                  <React.Fragment key={index}>
                    {part}
                    {index < array.length - 1 && (
                      <span className="text-blue-600">{pageData.heroSubtitle}</span>
                    )}
                  </React.Fragment>
                ))}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {pageData.heroDescription}
              </p>
              <div className="flex items-center mb-8">
                <span className="text-gray-500 text-lg">Google Reviews (100+)</span>
                <div className="flex text-blue-500 ml-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="flex space-x-4">
                <Link href={pageData.heroButtonLink} className="btn-hover-white text-white px-8 py-3 rounded-lg font-semibold flex items-center bg-[#084d92]">
                    <span>{pageData.heroButtonText}</span>
                </Link>
                <Link href={pageData.aboutButtonLink} className='flex'>
                  <button className=" px-8 font-semibold flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" style={{ height: '40px', width: '40px' }}>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    {pageData.aboutButtonText}
                  </button>
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center items-center">
              
              <div className="relative z-10">
                <img
                  src={pageData.heroImage}
                  alt="Project Management Experts"
                  className=" object-cover rounded-lg"
                />
              </div>
            </div>
            
          </div>
          <div className="absolute left-circle">
            <svg 
              viewBox="0 0 281 211" 
              version="1.1" 
              width="281px" 
              height="211px" 
              xmlns="http://www.w3.org/2000/svg" 
              xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g id="Homepage" stroke="none" fill="none" strokeWidth="1" fillRule="evenodd"><g transform="translate(-28.000000, -111.000000)" id="Homepage-woman_hero-02"><g transform="translate(28.000000, 111.000000)" id="Group-7"> <path d="M279.872086,131.913824 C279.223377,131.218665 217.476416,65.9083905 149.680727,59.1452945 C149.624527,59.1380448 149.569129,59.1324062 149.512929,59.1251566 C148.998298,59.0639375 148.486075,58.9938578 147.967429,58.9431104 C147.175812,58.8649756 146.38018,58.8134227 145.583745,58.7602587 C145.140568,58.7304547 144.700602,58.6877625 144.255016,58.6660136 C143.36545,58.6225158 142.47187,58.6088221 141.57829,58.5959339 L141.423338,58.5919063 C141.118252,58.5814346 140.812364,58.5709629 140.504066,58.5709629 C140.251166,58.5709629 140.00228,58.5878787 139.74938,58.5902953 C139.342332,58.5854622 138.936086,58.5709629 138.528234,58.5709629 C103.252285,58.5709629 67.7226328,78.5726826 44.1306676,95.3515405 C18.7515417,113.399889 1.31428145,131.721306 1.1569214,131.890464 C-0.383761988,133.513575 -0.383761988,136.057388 1.14568139,137.669222 C1.31428145,137.849657 18.7515417,156.17188 44.1306676,174.220228 C86.8764023,204.619523 119.057336,211 138.528234,211 C138.936889,211 139.345543,210.985501 139.753395,210.981473 C140.004689,210.98389 140.251969,211 140.504066,211 C143.587039,211 146.621037,210.792983 149.609272,210.433724 C217.433864,203.708487 279.222574,138.353103 279.872889,137.657139 C281.375838,136.046916 281.375838,133.524852 279.872086,131.913824 L63.531095,0" id="Shape_01-Copy-2" fill="#afdff63b"></path> <ellipse id="Shape_02-Copy" fill="#afdff659" cx="206.014045" cy="80.6773182" rx="45.7808989" ry="45.4355784"></ellipse> <path d="M164.484484,61.4885345 C195.896866,68.4167396 225.065876,86.3551852 246.218469,102.387841 C238.44866,116.49899 223.357621,126.070501 206.014045,126.070501 C180.729953,126.070501 160.233146,105.7283 160.233146,80.634923 C160.233146,73.8597112 161.727363,67.4308601 164.406587,61.6552479 Z" id="Combined-Shape" fill="#afdff621"></path> </g></g></g></svg>
          </div>
          <div className="absolute right-circle">
              <svg width="240px" height="242px" viewBox="0 0 240 242" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <g id="Homepage" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g id="Homepage-woman_hero-02" transform="translate(-1191.000000, -409.000000)">
                    <g id="Hero" transform="translate(0.000000, 104.000000)">
                      <g id="BG_Shapes" transform="translate(1311.000000, 426.000000) rotate(-270.000000) translate(-1311.000000, -426.000000) translate(1190.000000, 306.000000)">
                        <g id="Group-8" transform="translate(0.000000, 0.000000)">
                          <ellipse id="Shape_02-Copy-5" fill="#AFDFF6" cx="138.5" cy="137.5" rx="103.5" ry="102.5"></ellipse>
                          <path d="M138,5.68434189e-14 L138,136.999686 L-2.26659485e-12,136.999772 C0.0359765952,61.3307575 61.8068944,5.68434189e-14 138,5.68434189e-14 L138,5.68434189e-14 Z" id="Combined-Shape-Copy" fill="#AFDFF6"></path>
                          <path d="M137.999212,35.004 L138,136.999686 L35.0012119,136.998609 C35.2738631,80.6200898 81.5073837,35 138.5,35 L137.999212,35.004 Z" id="Combined-Shape" fill="#A2D7F4"></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>

          {/* Partner Logos */}
          <div className="mt-10 pt-4">
            <div className="flex justify-center items-center space-x-8">
             <div className="profesional-body__logos">
               {pageData.companyLogos.map((logo, index) => (
                 <div key={index} className="profesional-body__logo">
                   <a
                     href="#"
                     target="_blank"
                     rel="noopener noreferrer"
                   >
                     <img
                       alt={`partner-logo-${index + 1}`}
                       src={logo}
                       className="img-header lazyloaded"
                       decoding="async"
                       id={`Njg0OjQzNw==-${index + 1}`}
                     />
                   </a>
                 </div>
               ))}
             </div>
            </div>
          </div>
        </div>
      </section>
       {/* Our History Section */}
       <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">{pageData.historyTitle}</h2>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {pageData.historyDescription}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', transform: 'translate3d(0px, 0px, 0px)' }}><defs><clipPath id="__lottie_element_5"><rect width="200" height="200" x="0" y="0"></rect></clipPath><clipPath id="__lottie_element_7"><path d="M0,0 L600,0 L600,600 L0,600z"></path></clipPath></defs><g clipPath="url(#__lottie_element_5)"><g clipPath="url(#__lottie_element_7)" transform="matrix(0.5,0,0,0.5,-50,-49.5)" opacity="1" style={{ display: 'block' }}><g transform="matrix(1,0,0,1,167.75,149.75)" opacity="1" style={{ display: 'block' }}><g opacity="1" transform="matrix(1,0,0,1,132.25,132.25)"><path fill="rgb(8,77,146)" fillOpacity="1" d=" M0,-132 C-72.9010009765625,-132 -132,-72.9010009765625 -132,0 C-132,72.9010009765625 -72.9010009765625,132 0,132 C72.9010009765625,132 132,72.9010009765625 132,0 C132,0 0,0 0,0 C0,0 0,-132 0,-132z"></path></g></g><g transform="matrix(1,0,0,1,340.0099792480469,149.98899841308594)" opacity="0.8" style={{ mixBlendMode: 'multiply', display: 'block' }}><path fill="rgb(70,177,228)" fillOpacity="1" d=" M23.790504455566406,41.927589416503906 C10.830504417419434,41.927589416503906 0.32350412011146545,52.433589935302734 0.32350412011146545,65.39459228515625 C0.32350412011146545,65.39459228515625 0.25,257.86700439453125 0.25,257.86700439453125 C17.77199935913086,252.25900268554688 33.698001861572266,243.09100341796875 47.183998107910156,231.2100067138672 C47.183998107910156,231.2100067138672 47.257503509521484,65.39459228515625 47.257503509521484,65.39459228515625 C47.257503509521484,52.433589935302734 36.75050354003906,41.927589416503906 23.790504455566406,41.927589416503906z" style={{ mixBlendMode: 'multiply' }}></path></g><g transform="matrix(1,0,0,1,275.47698974609375,232.16098022460938)" opacity="1" style={{ display: 'block' }}><path fill="rgb(70,177,228)" fillOpacity="1" d=" M24.523000717163086,181.96099853515625 C32.250999450683594,181.96099853515625 39.81999969482422,181.2899932861328 47.18299865722656,180.01600646972656 C47.18299865722656,180.01600646972656 47.32030487060547,14.91585636138916 47.32030487060547,14.91585636138916 C47.32030487060547,1.9548566341400146 36.81330490112305,-8.551143646240234 23.853303909301758,-8.551143646240234 C10.893303871154785,-8.551143646240234 0.38730359077453613,1.9548566341400146 0.38730359077453613,14.91585636138916 C0.38730359077453613,14.91585636138916 0.25,179.72500610351562 0.25,179.72500610351562 C8.119000434875488,181.18800354003906 16.229999542236328,181.96099853515625 24.523000717163086,181.96099853515625z"></path></g><g transform="matrix(1,0,0,1,210.94400024414062,279.114990234375)" opacity="1" style={{ display: 'block' }}><path fill="rgb(202,225,240)" fillOpacity="1" d=" M23.764739990234375,-27.029878616333008 C10.804739952087402,-27.029878616333008 0.29773977398872375,-16.52387809753418 0.29773977398872375,-3.562877893447876 C0.29773977398872375,-3.562877893447876 0.25,100.6500015258789 0.25,100.6500015258789 C13.661999702453613,112.85900115966797 29.599000930786133,122.33699798583984 47.18299865722656,128.2169952392578 C47.18299865722656,128.2169952392578 47.23073959350586,-3.562877893447876 47.23073959350586,-3.562877893447876 C47.23073959350586,-16.52387809753418 36.72473907470703,-27.029878616333008 23.764739990234375,-27.029878616333008z"></path></g></g></g></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{pageData.historyStats.years}</h3>
              <p className="text-gray-600">Years of Experience</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', transform: 'translate3d(0px, 0px, 0px)' }}><defs><clipPath id="__lottie_element_22"><rect width="200" height="200" x="0" y="0"></rect></clipPath><clipPath id="__lottie_element_24"><path d="M0,0 L600,0 L600,600 L0,600z"></path></clipPath></defs><g clipPath="url(#__lottie_element_22)"><g clipPath="url(#__lottie_element_24)" transform="matrix(0.5,0,0,0.5,-50,-70)" opacity="1" style={{ display: 'block' }}><g transform="matrix(1,0,0,1,107.45401000976562,142.00100708007812)" opacity="1" style={{ display: 'block' }}><g opacity="1" transform="matrix(1,0,0,1,192.20599365234375,182.43299865722656)"><path fill="rgb(8,77,146)" fillOpacity="1" d=" M0,-132 C72.9020004272461,-132 132,-72.9020004272461 132,0 C132,72.9020004272461 72.9020004272461,132 0,132 C-72.9010009765625,132 -132,72.9020004272461 -132,0 C-132,-72.9020004272461 -72.9010009765625,-132 0,-132z"></path></g><g opacity="1" transform="matrix(1,0,0,1,191.38800048828125,175.42999267578125)"><path fill="rgb(202,225,240)" fillOpacity="1" d=" M-91.2229995727539,-30.127216339111328 C-91.2229995727539,-30.127216339111328 0.8180000185966492,18.336000442504883 0.8180000185966492,18.336000442504883 C0.8180000185966492,18.336000442504883 91.2229995727539,-26.500389099121094 91.2229995727539,-26.500389099121094 C91.2229995727539,-26.500389099121094 77.33063507080078,64.89507293701172 77.33063507080078,64.89507293701172 C65.01272583007812,73.89794921875 32.27039337158203,84.44007110595703 0.7163926362991333,84.44007110595703 C-30.838607788085938,84.44007110595703 -61.77058792114258,74.86022186279297 -77.86384582519531,64.89507293701172 C-77.86384582519531,64.89507293701172 -91.2229995727539,-30.127216339111328 -91.2229995727539,-30.127216339111328z"></path></g></g><g transform="matrix(1,0,0,1,107.4540023803711,162)" opacity="1" style={{ mixBlendMode: 'multiply', display: 'block' }}><g opacity="1" transform="matrix(1,0,0,1,192.20599365234375,161.64700317382812)" style={{ mixBlendMode: 'multiply' }}><path fill="rgb(70,177,228)" fillOpacity="1" d=" M0,-161.64700317382812 C0,-161.64700317382812 163.33871459960938,-74.76399993896484 163.33871459960938,-74.76399993896484 C163.33871459960938,-74.76399993896484 69.572998046875,-21.738689422607422 69.572998046875,-21.738689422607422 C69.572998046875,-21.738689422607422 69.59998321533203,94.56123352050781 69.59998321533203,94.56123352050781 C69.59998321533203,98.13523864746094 66.70098114013672,101.03419494628906 63.12697982788086,101.03419494628906 C59.552982330322266,101.03419494628906 56.65497970581055,98.13523864746094 56.65497970581055,94.56123352050781 C56.65497970581055,94.56123352050781 56.62799835205078,-15.587459564208984 56.62799835205078,-15.587459564208984 C56.62799835205078,-15.587459564208984 0,12.119000434875488 0,12.119000434875488 C0,12.119000434875488 -163.3377227783203,-74.76399993896484 -163.3377227783203,-74.76399993896484 C-163.3377227783203,-74.76399993896484 0,-161.64700317382812 0,-161.64700317382812z"></path></g></g></g></g></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{pageData.historyStats.professionals}</h3>
              <p className="text-gray-600">Professionals Trained</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', transform: 'translate3d(0px, 0px, 0px)' }}><defs><clipPath id="__lottie_element_33"><rect width="200" height="200" x="0" y="0"></rect></clipPath><clipPath id="__lottie_element_35"><path d="M0,0 L600,0 L600,600 L0,600z"></path></clipPath></defs><g clipPath="url(#__lottie_element_33)"><g clipPath="url(#__lottie_element_35)" transform="matrix(0.5,0,0,0.5,-50,-50)" opacity="1" style={{ display: 'block' }}><g transform="matrix(1,0,0,1,0,0)" opacity="1" style={{ display: 'block' }}><rect width="600" height="600" fill="#ffffff"></rect></g><g transform="matrix(1,0,0,1,167.75,167.75)" opacity="1" style={{ display: 'block' }}><g opacity="1" transform="matrix(1,0,0,1,132.25,114.58699798583984)"><path fill="rgb(8,77,146)" fillOpacity="1" d=" M0,-132 C-72.9010009765625,-132 -132,-72.9010009765625 -132,0 C-132,72.9010009765625 -72.9010009765625,132 0,132 C72.9010009765625,132 132,72.9010009765625 132,0 C132,0 0,0 0,0 C0,0 0,-132 0,-132z"></path><g opacity="1" transform="matrix(1,0,0,1,0,0)"></g></g></g><g transform="matrix(1.149794578552246,0,0,1.149794578552246,147.93966674804688,129.88919067382812)" opacity="1" style={{ display: 'block' }}><path fill="rgb(202,225,240)" fillOpacity="1" d=" M132.25,210.25 C113.81999969482422,210.25 96.8949966430664,203.84300231933594 83.5459976196289,193.1540069580078 C83.5459976196289,193.1540069580078 83.55199432373047,282.0166015625 83.55199432373047,282.0166015625 C83.55199432373047,282.0166015625 131.12799072265625,247.83961486816406 131.12799072265625,247.83961486816406 C131.12799072265625,247.83961486816406 180.95799255371094,282.0166015625 180.95799255371094,282.0166015625 C180.95799255371094,282.0166015625 180.95399475097656,193.1540069580078 180.95399475097656,193.1540069580078 C167.60499572753906,203.84300231933594 150.68099975585938,210.25 132.25,210.25z"></path></g><g transform="matrix(1.149794578552246,0,0,1.149794578552246,147.93966674804688,129.88919067382812)" opacity="1" style={{ display: 'block' }}><path fill="rgb(70,177,228)" fillOpacity="0.8" d=" M210.25,132.25 C210.25,175.3280029296875 175.3280029296875,210.25 132.25,210.25 C89.1719970703125,210.25 54.25,175.3280029296875 54.25,132.25 C54.25,89.1719970703125 89.1719970703125,54.25 132.25,54.25 C175.3280029296875,54.25 210.25,89.1719970703125 210.25,132.25z" style={{ mixBlendMode: 'multiply' }}></path></g></g></g></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{pageData.historyStats.certified}</h3>
              <p className="text-gray-600">Certified Project Managers</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', transform: 'translate3d(0px, 0px, 0px)' }}><defs><clipPath id="__lottie_element_50"><rect width="200" height="200" x="0" y="0"></rect></clipPath><clipPath id="__lottie_element_52"><path d="M0,0 L600,0 L600,600 L0,600z"></path></clipPath></defs><g clipPath="url(#__lottie_element_50)"><g clipPath="url(#__lottie_element_52)" transform="matrix(0.5,0,0,0.5,-51,-67)" opacity="1" style={{ display: 'block' }}><g style={{ display: 'block' }} transform="matrix(0.6362090706825256,0,0,0.6362090706825256,278.4146728515625,170.92259216308594)" opacity="0.8"><path fill="rgb(70,177,228)" fillOpacity="1" d=" M126.55400085449219,63.64400100708008 C126.55400085449219,98.64299774169922 98.28099822998047,127.01899719238281 63.4109992980957,127.01899719238281 C28.52199935913086,127.01899719238281 0.25,98.64099884033203 0.25,63.64400100708008 C0.25,28.625999450683594 28.52400016784668,0.25 63.4109992980957,0.25 C98.28299713134766,0.25 126.55400085449219,28.62700080871582 126.55400085449219,63.64400100708008z"></path></g><g transform="matrix(1,0,0,1,171.19200134277344,184.4199981689453)" opacity="1" style={{ display: 'block' }}><g opacity="1" transform="matrix(1,0,0,1,132.4290008544922,132.9149932861328)"><path fill="rgb(20,86,151)" fillOpacity="1" d=" M-132.1790008544922,0 C-132.1790008544922,-73.26899719238281 -73,-132.6649932861328 0,-132.6649932861328 C73.0009994506836,-132.6649932861328 132.1790008544922,-73.26899719238281 132.1790008544922,0 C132.1790008544922,73.26899719238281 73.0009994506836,132.6649932861328 0,132.6649932861328 C-73,132.6649932861328 -132.1790008544922,73.26899719238281 -132.1790008544922,0z"></path></g><g opacity="1" transform="matrix(1,0,0,1,167.4739990234375,202.13900756835938)"><path fill="rgb(79,181,229)" fillOpacity="1" d=" M-33.49700164794922,0.0010000000474974513 C-33.49700164794922,0.0010000000474974513 -33.49700164794922,0.0010000000474974513 -33.49700164794922,0.0010000000474974513 C-33.49700164794922,-7.265999794006348 -27.60700035095215,-13.156000137329102 -20.341999053955078,-13.156000137329102 C-20.341999053955078,-13.156000137329102 20.341999053955078,-13.156000137329102 20.341999053955078,-13.156000137329102 C27.60700035095215,-13.156000137329102 33.49700164794922,-7.265999794006348 33.49700164794922,0.0010000000474974513 C33.49700164794922,7.267000198364258 27.60700035095215,13.156000137329102 20.340999603271484,13.156000137329102 C20.340999603271484,13.156000137329102 -20.341999053955078,13.156000137329102 -20.341999053955078,13.156000137329102 C-27.60700035095215,13.156000137329102 -33.49700164794922,7.267000198364258 -33.49700164794922,0.0010000000474974513z"></path></g><g opacity="1" transform="matrix(1,0,0,1,53.09199905395508,93.13300323486328)"><path fill="rgb(204,226,240)" fillOpacity="1" d=" M13.366000175476074,-39.46799850463867 C13.366000175476074,-39.46799850463867 -26.67099952697754,-39.46799850463867 -26.67099952697754,-39.46799850463867 C-43.04999923706055,-17.433000564575195 -52.763999938964844,9.878999710083008 -52.83300018310547,39.46799850463867 C-52.83300018310547,39.46799850463867 13.366000175476074,39.46799850463867 13.366000175476074,39.46799850463867 C35.16299819946289,39.46799850463867 52.83300018310547,21.797000885009766 52.83300018310547,0 C52.83300018310547,-21.79800033569336 35.16299819946289,-39.46799850463867 13.366000175476074,-39.46799850463867z"></path></g><g opacity="1" transform="matrix(1,0,0,1,219.9759979248047,147.63600158691406)"><path fill="rgb(204,226,240)" fillOpacity="1" d=" M-44.632999420166016,-0.0010000000474974513 C-44.632999420166016,12.454999923706055 -34.53499984741211,22.55299949645996 -22.07900047302246,22.55299949645996 C-22.07900047302246,22.55299949645996 39.30500030517578,22.55299949645996 39.30500030517578,22.55299949645996 C42.750999450683594,10.723999977111816 44.632999420166016,-1.7740000486373901 44.632999420166016,-14.720999717712402 C44.632999420166016,-17.351999282836914 44.53499984741211,-19.958999633789062 44.38399887084961,-22.55299949645996 C44.38399887084961,-22.55299949645996 -22.07900047302246,-22.55299949645996 -22.07900047302246,-22.55299949645996 C-34.53499984741211,-22.55299949645996 -44.632999420166016,-12.456000328063965 -44.632999420166016,-0.0010000000474974513z"></path></g></g><g transform="matrix(0.70015549659729,0,0,0.70015549659729,125.53487396240234,393.08624267578125)" opacity="1" style={{ mixBlendMode: 'multiply', display: 'none' }}><path fill="rgb(70,177,228)" fillOpacity="1" d=" M126.55400085449219,63.64400100708008 C126.55400085449219,98.64299774169922 98.28099822998047,127.01899719238281 63.4109992980957,127.01899719238281 C28.52199935913086,127.01899719238281 0.25,98.64099884033203 0.25,63.64400100708008 C0.25,28.625999450683594 28.52400016784668,0.25 63.4109992980957,0.25 C98.28299713134766,0.25 126.55400085449219,28.62700080871582 126.55400085449219,63.64400100708008z" style={{ mixBlendMode: 'multiply' }}></path></g></g></g></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{pageData.historyStats.recognition}</h3>
              <p className="text-gray-600">Recognised</p>
            </div>
          </div>
          
          <div className="text-center d-flex justify-content-center">
            <button className="btn-hover-white text-white px-8 py-3 rounded-full font-semibold flex items-center bg-[#084d92]">
              <span>{pageData.aboutButtonText}</span>
            </button>
          </div>
        </div>
      </section>

        {/* Courses Section */}
        <section className="py-20 bg-gray-50 relative overflow-hidden">
          {/* Abstract background shape */}
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-100 to-transparent"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{pageData.coursesTitle}</h2>
              <p className="text-xl text-gray-600 mb-6">{pageData.coursesSubtitle}</p>
              <div className="w-24 h-1 bg-blue-400 mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {pageData.courseCards.map((card, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden relative group">
                  {/* Top section with profile image and circular graphic */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 p-6">
                    {/* Badge for first course */}
                    {index === 0 && (
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span className="bg-blue-800 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
                        <span className="bg-blue-800 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                          </svg>
                          AI INCLUDED
                        </span>
                      </div>
                    )}
                    <div className="flex justify-center items-center h-full">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="h-32 w-auto object-contain rounded-lg"
                      />
                    </div>
                  </div>
                  
                  {/* Course content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                    <p className="text-gray-600 mb-4">{card.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      {card.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Footer with price and button */}
                  <div className="bg-gray-200 p-4 flex justify-between items-center relative overflow-hidden group-hover:bg-[#084d92] transition-colors duration-600">
                    {/* Sliding overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-[#084d92] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-600 ease-out z-0"></div>
                    <span className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors duration-600 relative z-10">{card.price}</span>
                    <button className="bg-[#084d92] text-white border border-[#084d92] px-4 py-2 rounded-lg text-sm font-semibold relative overflow-hidden z-10 group-hover:text-white group-hover:border-white transition-colors duration-600">
                      <span className="relative z-10">View course</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mb-12 d-flex justify-content-center">
              <button className="btn-hover-white text-white px-8 py-3 rounded-full font-semibold flex items-center bg-[#084d92]">
                <span className="relative z-10 group-hover:text-[#084d92] transition-colors duration-600">View All Courses</span>
              </button>
            </div>
            
            {/* Company Logos */}
            <div className="flex justify-center items-center space-x-8 opacity-60">
              {pageData.companyLogos.map((logo, index) => (
                <div key={index} className="profesional-body__logo">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      alt={`partner-logo-${index + 1}`}
                      src={logo}
                      className="img-header lazyloaded"
                      decoding="async"
                      id={`Njg0OjQzNw==-${index + 1}`}
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{pageData.newsletterTitle}</h2>
            <p className="text-xl text-gray-600 mb-6">{pageData.newsletterDescription}</p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-r-lg font-semibold hover:bg-blue-700">
                Subscribe
              </button>
            </div>
          </div>
        </section>


         
    </MainLayout>
  );
}