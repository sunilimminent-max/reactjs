import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
} 