import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MainLayout from './layouts/MainLayout';

interface PageData {
  id: number;
  title: string;
  content: string;
  name: string;
  status: string;
  type: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  meta?: any[];
}

const DynamicPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPageData(slug as string);
    }
  }, [slug]);

  const fetchPageData = async (pageSlug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/pages/${pageSlug}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.isSuccess && data.data) {
          setPageData(data.data);
        } else {
          setError('Page not found');
        }
      } else if (response.status === 404) {
        setError('Page not found');
      } else {
        setError('Failed to load page');
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      setError('Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !pageData) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <>
      <Head>
        <title>{pageData.title} - Your Site</title>
        <meta name="description" content={pageData.content.substring(0, 160)} />
      </Head>
      
      <MainLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Page Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-4xl mx-auto px-4 py-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {pageData.title}
              </h1>
              
              {/* Page Meta */}
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>By {pageData.author_name}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(pageData.created_at).toLocaleDateString()}</span>
                </div>
                
                {pageData.updated_at !== pageData.created_at && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Updated {new Date(pageData.updated_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white shadow-sm rounded-lg p-8">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: pageData.content }}
              />
              
              {/* Page Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span>Page ID: {pageData.id}</span>
                    <span className="mx-2">•</span>
                    <span>Type: {pageData.type}</span>
                    <span className="mx-2">•</span>
                    <span>Status: {pageData.status}</span>
                  </div>
                  
                  <button
                    onClick={() => router.back()}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    ← Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default DynamicPage; 