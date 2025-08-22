import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';

interface HeaderProps {
  isLogin: boolean
  user: any
  logout: () => void
}

interface MenuItem {
  label: string;
  href?: string;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  icon: string;
  title: string;
  description: string;
  href?: string;
}

function Header({ isLogin, user, logout }: HeaderProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const menuItems: MenuItem[] = [
    {
      label: 'Courses',
      submenu: [
        {
          icon: '🔍',
          title: 'Explore our Courses',
          description: 'e.g. Project Management Diploma, PMP, Agile, PRINCE2, PMO, Scrum, and more.',
          href: '/courses'
        },
        {
          icon: '📅',
          title: 'Upcoming Course Dates',
          description: 'Find the perfect course date that fits your schedule and supports your career growth.',
          href: '/course-dates'
        },
        {
          icon: '🔗',
          title: 'IPM Competency Pathway',
          description: 'Follow a structured path to build essential PM skills for individuals and organisations.',
          href: '/competency-pathway'
        },
        {
          icon: '🏢',
          title: 'Corporate Training',
          description: 'Advance your organisation\'s project management with tailored solutions.',
          href: '/corporate-training'
        },
        {
          icon: '🤝',
          title: 'Partnership',
          description: 'Partner with IPM to extend your reach and impact through exclusive offers.',
          href: '/partnership'
        },
        {
          icon: '🎓',
          title: 'Academy Courses',
          description: 'Flexible, On-Demand Learning for Project Management Specialists.',
          href: '/academy'
        }
      ]
    },
    {
      label: 'Posts',
      href: '/posts'
    },
    {
      label: 'Certification',
      href: '/certification'
    },
    {
      label: 'IPM Hub',
      href: '/ipm-hub'
    },
    {
      label: 'Resources',
      href: '/resources'
    },
    {
      label: 'About',
      href: '/about'
    },
    {
      label: 'Contact',
      href: '/contact'
    }
  ];

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  const handleMouseLeave = (label: string, event: React.MouseEvent) => {
    const dropdownElement = dropdownRefs.current[label];
    const relatedTarget = event.relatedTarget;
    
    // If relatedTarget is null, it means mouse left the element entirely
    // If relatedTarget exists but is outside the dropdown, close it
    if (dropdownElement && (!relatedTarget || !isNode(relatedTarget) || !dropdownElement.contains(relatedTarget))) {
      // Add a small delay to prevent flickering when moving between elements
      setTimeout(() => {
        setActiveDropdown(null);
      }, 100);
    }
  };

  // Helper function to check if an element is a Node
  const isNode = (element: EventTarget | null): element is Node => {
    return element !== null && 'nodeType' in element;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !dropdownRefs.current[activeDropdown]?.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  return (
    <>
      {/* Top Blue Bar */}
      {/* <div className="bg-blue-600 h-1"></div> */}
      
      <header className={`bg-white shadow-sm transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Company Name */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center" style={{ width: '151px',  }}>
                <img src="/images/logo.png" alt="Project Management Experts" className="" />
              </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden lg:flex space-x-8">
              {menuItems.map((item) => (
                <div 
                  key={item.label} 
                  className="relative" 
                  ref={(el) => { dropdownRefs.current[item.label] = el; }}
                  //onMouseLeave={(e) => handleMouseLeave(item.label, e)}
                  style={{ zIndex: 1000, padding: '13px 0px' }}
                >
                  {item.submenu ? (
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      onMouseEnter={() => toggleDropdown(item.label)}
                      className="flex items-center space-x-1 text-blue-900 hover:text-blue-700 transition-colors duration-200 font-medium"
                    >
                      <span>{item.label}</span>
                      <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : (
                    <Link 
                      href={item.href || '#'} 
                      className="text-blue-900 hover:text-blue-700 transition-colors duration-200 font-medium"
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {item.submenu && (
                    <div
                      onMouseLeave={(e) => handleMouseLeave(item.label, e)}
                      className={`absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 transition-all duration-300 z-50 ${
                        activeDropdown === item.label 
                          ? 'opacity-100 translate-y-0 pointer-events-auto' 
                          : 'opacity-0 -translate-y-2 pointer-events-none'
                      }`}
                    >
                      <div className="p-4 space-y-3">
                        {item.submenu.map((subItem, index) => (
                          <Link
                            key={index}
                            href={subItem.href || '#'}
                            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
                          >
                            <span className="text-xl mt-1 group-hover:scale-110 transition-transform duration-200">
                              {subItem.icon}
                            </span>
                            <div className="flex-1">
                              <h4 className="font-semibold text-blue-900 text-sm group-hover:text-blue-700 transition-colors duration-200">
                                {subItem.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                {subItem.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Speak to an Advisor Button */}
              <button className="hidden md:flex items-center space-x-2 px-4 py-2 border border-blue-600 rounded-full text-blue-900 hover:bg-blue-50 transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm font-medium">Speak to an Advisor</span>
              </button>

              {/* Search Icon */}
              <button className="text-blue-900 hover:text-blue-700 transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* User Profile / Auth */}
              {isLogin ? (
                <div className="flex items-center space-x-3">
                  <span className="text-blue-900 text-sm font-medium">Welcome, {user?.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="text-blue-900 hover:text-red-600 transition-colors duration-200 font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (<></>
              )}

              {/* User Profile Icon */}
              <Link href="/login">
                <button className="text-blue-900 hover:text-blue-700 transition-colors duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Gradient */}
      <div className="h-1 bg-gradient-to-r from-white via-blue-50 to-blue-100"></div>
    </>
  );
}

// Map Redux state to component props
const mapStateToProps = (state: any) => ({
  isLogin: state.common.isLogin,
  user: state.common.user
})

// Map Redux dispatch to component props
const mapDispatchToProps = (dispatch: any) => ({
  logout: () => dispatch({ type: 'auth/LogOut' })
})

export default connect(mapStateToProps, mapDispatchToProps)(Header); 