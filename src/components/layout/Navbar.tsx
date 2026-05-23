import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Database, User, Briefcase, FileText, Mail, Shield, Award } from 'lucide-react';
import { auth } from '../../lib/firebase';

const navLinks = [
  { name: 'Home', path: '/', icon: User },
  { name: 'Projects', path: '/projects', icon: Briefcase },
  { name: 'Services', path: '/services', icon: Database },
  { name: 'Certifications', path: '/certifications', icon: Award },
  { name: 'Blog', path: '/blog', icon: FileText },
  { name: 'Contact', path: '/contact', icon: Mail },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Load Settings
    import('../../lib/firestore-service').then(({ firestoreService }) => {
      firestoreService.list('settings').then((data) => {
        if (data.length > 0) setSettings(data[0]);
      }).catch(console.error);
    });

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email?.toLowerCase().endsWith('@gmail.com')) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
      <div className="mx-auto px-4 md:px-8 transition-all" style={{ maxWidth: 'var(--container-width)' }}>
        <div 
          className={`transition-all duration-500 flex items-center justify-between ${scrolled ? '[border-radius:var(--radius-main)] px-8 py-4 border-b border-[var(--border-light)]' : 'bg-transparent px-2 py-2'}`}
          style={{ 
            backdropFilter: scrolled ? 'blur(var(--header-blur))' : 'none',
            backgroundColor: scrolled ? 'var(--bg-card)' : 'transparent',
            boxShadow: scrolled ? 'var(--card-shadow)' : 'none'
          }}
        >
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-[family-name:var(--font-heading)] font-bold text-lg rounded-full transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-110">
              {settings?.name ? settings.name[0] : 'N'}
            </div>
            <div className="hidden sm:block">
              <span className="font-[family-name:var(--font-heading)] font-semibold text-sm block leading-none text-white tracking-[0.2em] uppercase">{settings?.name || "Nasir Hussain"}</span>
              <span className="text-[9px] text-[var(--brand-main)] uppercase tracking-[0.3em] font-semibold mt-1.5 block opacity-70 group-hover:opacity-100 transition-opacity">{settings?.role || "Senior Data Scientist"}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[9px] font-bold uppercase tracking-[0.3em] transition-all duration-300 relative ${
                  location.pathname === link.path ? 'text-white' : 'text-white/40 hover:text-white'
                }`}
              >
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute -bottom-2 left-0 right-0 h-px bg-[var(--brand-main)]"
                    transition={{ type: "spring", bounce: 0, duration: 0.8 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className="ml-4 p-2 text-white/30 hover:text-white transition-all">
                <Shield size={14} strokeWidth={1} />
              </Link>
            )}
          </div>


          {/* Mobile Toggle */}
          <button className="md:hidden text-white/70 hover:text-white transition-colors p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} strokeWidth={1} /> : <Menu size={20} strokeWidth={1} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-24 left-4 right-4 z-40"
          >
            <div className="bg-[#0C0C0E]/95 backdrop-blur-2xl p-6 border border-white/5 shadow-2xl rounded-2xl">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 p-4 transition-all uppercase tracking-[0.1em] text-xs font-semibold rounded-xl mb-2 ${
                    location.pathname === link.path ? 'bg-white text-black' : 'text-[var(--text-sub)] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon size={16} strokeWidth={1.5} />
                  <span>{link.name}</span>
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-4 border border-white/10 text-white hover:bg-white hover:text-black transition-all uppercase tracking-[0.1em] text-xs font-semibold rounded-xl mt-4"
                >
                  <Shield size={16} strokeWidth={1.5} />
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
