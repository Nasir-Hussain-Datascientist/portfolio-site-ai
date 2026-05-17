import { Github, Linkedin, Mail, Instagram, Facebook, ArrowUpRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { firestoreService } from '../../lib/firestore-service';
import { motion } from 'motion/react';

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const settingsData = await firestoreService.list('settings');
        if (settingsData.length > 0) {
          setSettings(settingsData[0]);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, url: settings?.linkedin || 'https://www.linkedin.com/in/nasirhussain-datascience/?skipRedirect=true', color: 'hover:text-blue-400' },
    { name: 'GitHub', icon: Github, url: settings?.github || 'https://github.com/nasir-hussain-datascientist', color: 'hover:text-gray-400' },
    { name: 'WhatsApp', icon: ({ size, className }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>, url: settings?.whatsapp || 'https://wa.me/923265707981', color: 'hover:text-green-500' },
    { name: 'Facebook', icon: Facebook, url: settings?.facebook || 'https://web.facebook.com/nasir.hussain.819767', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: Instagram, url: settings?.instagram || 'https://www.instagram.com/im.nasirhussain/', color: 'hover:text-pink-500' },
    { 
      name: 'TikTok', 
      icon: ({ size, className }: any) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
        </svg>
      ), 
      url: settings?.tiktok || 'https://www.tiktok.com/@nasir_hussain06',
      color: 'hover:text-white'
    },
  ];

  const footNav = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/projects' },
    { name: 'Expertise', path: '/services' },
    { name: 'Credentials', path: '/certifications' },
    { name: 'Insights', path: '/blog' },
  ];

  return (
    <footer className="relative z-10 pt-10 pb-6 bg-[#060608] border-t border-white/5 overflow-hidden perspective-1000 mt-auto">
      {/* Decorative background element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100%] h-[150px] bg-gradient-to-t from-[var(--brand-main)]/5 to-transparent blur-[100px] pointer-events-none opacity-40" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 font-[family-name:var(--font-sans)]">
        <div className="flex flex-col items-center text-center justify-center mb-8">
          <div className="space-y-6 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, rotateX: 20, z: -100 }}
              whileInView={{ opacity: 1, rotateX: 0, z: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
              className="flex flex-col items-center"
            >
              <Link to="/" className="flex items-center justify-center gap-4 group mb-6">
                <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-[family-name:var(--font-heading)] font-bold text-xl rounded-full transition-all duration-500 shadow-[0_20px_40px_rgba(255,255,255,0.1)] group-hover:scale-110 group-hover:rotate-6">
                  {settings?.name?.[0] || 'N'}
                </div>
                <div className="text-left">
                  <span className="font-[family-name:var(--font-heading)] font-bold text-xl text-white tracking-tight block leading-tight">{settings?.name || "Nasir Hussain"}</span>
                  <span className="text-[10px] text-[var(--brand-main)] font-bold uppercase tracking-[0.3em] block opacity-70">Data Scientist</span>
                </div>
              </Link>
              <p className="text-[var(--text-sub)] max-w-md leading-relaxed font-light text-sm mb-6">
                {settings?.bio || "Expert Data Scientist and Machine Learning Specialist dedicated to transforming complex challenges into intelligent analytical solutions."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {socialLinks.map((link, idx) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -4, rotateZ: 5, scale: 1.1 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, type: 'spring', stiffness: 300 }}
                    className={`w-10 h-10 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center text-white/50 transition-all duration-300 ${link.color} hover:bg-white/10 hover:border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}
                    title={link.name}
                  >
                    <link.icon size={18} strokeWidth={1.5} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/30 text-[10px] uppercase tracking-[0.4em] font-bold">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            © {new Date().getFullYear()} {settings?.name || "Nasir Hussain"}. Engineered for the Future
          </motion.p>
          <div className="flex gap-10">
            <Link to="/admin/login" className="hover:text-[var(--brand-main)] transition-colors flex items-center gap-2 group">
              <Shield size={14} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" /> 
              Authentication
            </Link>
          </div>
        </div>
      </div>

      {/* Extreme Bottom Accent */}
      <div className="w-full h-[2px] mt-8 bg-gradient-to-r from-transparent via-[var(--brand-main)]/40 to-transparent" />
    </footer>
  );
}
