/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import CertificationsPage from './pages/CertificationsPage';
import ServicesPage from './pages/ServicesPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import ProtectedRoute from './components/admin/ProtectedRoute';
import NotFound from './pages/NotFound';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeGraphicOverlay } from './components/ThemeGraphicOverlay';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen relative overflow-x-hidden bg-[var(--bg-main)] flex flex-col">
        <ThemeGraphicOverlay />
        <div className="fixed inset-0 atmosphere pointer-events-none" />
        <Navbar />
        <main className="relative z-50 flex-grow flex flex-col">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/certifications" element={<CertificationsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={user ? <Navigate to="/admin" /> : <AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
