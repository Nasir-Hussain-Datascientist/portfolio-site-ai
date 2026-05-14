/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { AIChatbot } from './components/AIChatbot';
import { ThemeGraphicOverlay } from './components/ThemeGraphicOverlay';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden bg-[var(--bg-main)]">
        <ThemeGraphicOverlay />
        <div className="fixed inset-0 atmosphere pointer-events-none" />
        <Navbar />
        <main className="relative z-10">
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
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <AIChatbot />
      </div>
    </Router>
  );
}
