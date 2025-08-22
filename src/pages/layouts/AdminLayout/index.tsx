import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { connect } from 'react-redux';
import { useRouter } from 'next/router'

const AdminLayout = (props: any) => {
  const { currentUser, children } = props;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const router = useRouter()


  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    }
  }, [currentUser, router])

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <ProtectedRoute currentUser={currentUser} accessfor={['super_admin','admin']}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={toggleSidebar}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <AdminHeader 
            onSidebarToggle={toggleSidebar}
          />
          
          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  );
}

const mapStateToProps = (state: any) => ({
  currentUser: state.common.currentUser,
})

// Map Redux dispatch to component props
const mapDispatchToProps = (dispatch: any) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminLayout) 