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
    <footer className="relative z-10 pt-32 pb-12 bg-[#060608] border-t border-white/5 overflow-hidden perspective-1000">
      {/* Decorative background element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-gradient-to-t from-[var(--brand-main)]/5 to-transparent blur-[120px] pointer-events-none opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 font-[family-name:var(--font-sans)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-24 items-center">
          <div className="md:col-span-6 space-y-8">
            <motion.div
              initial={{ opacity: 0, rotateX: 20, z: -100 }}
              whileInView={{ opacity: 1, rotateX: 0, z: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Link to="/" className="flex items-center gap-4 group inline-flex mb-8">
                <div className="w-14 h-14 bg-white text-black flex items-center justify-center font-[family-name:var(--font-heading)] font-bold text-2xl rounded-full transition-all duration-500 shadow-[0_20px_40px_rgba(255,255,255,0.1)] group-hover:scale-110 group-hover:rotate-6">
                  {settings?.name?.[0] || 'N'}
                </div>
                <div>
                  <span className="font-[family-name:var(--font-heading)] font-bold text-2xl text-white tracking-tight block leading-tight">{settings?.name || "Nasir Hussain"}</span>
                  <span className="text-[10px] text-[var(--brand-main)] font-bold uppercase tracking-[0.3em] block opacity-70">Data Scientist</span>
                </div>
              </Link>
              <p className="text-[var(--text-sub)] max-w-md leading-relaxed font-light text-lg mb-10">
                {settings?.bio || "Expert Data Scientist and Machine Learning Specialist dedicated to transforming complex challenges into intelligent analytical solutions."}
              </p>
              <div className="flex flex-wrap gap-5">
                {socialLinks.map((link, idx) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -8, rotateZ: 5, scale: 1.1 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, type: 'spring', stiffness: 300 }}
                    className={`w-14 h-14 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center text-white/50 transition-all duration-300 ${link.color} hover:bg-white/10 hover:border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}
                    title={link.name}
                  >
                    <link.icon size={24} strokeWidth={1.5} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="md:col-span-6">
            <motion.div
              initial={{ opacity: 0, rotateY: -20, rotateX: 10, x: 50 }}
              whileInView={{ opacity: 1, rotateY: 0, rotateX: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
              className="bg-white/5 border border-white/10 p-10 md:p-14 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group backdrop-blur-3xl"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                <Mail size={120} strokeWidth={1} />
              </div>
              <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.5em] text-white/40 relative z-10">Collaboration</h4>
              <h3 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] text-white mb-8 tracking-tight relative z-10">Start your Journey</h3>
              <p className="text-white/60 font-light text-lg mb-10 leading-relaxed relative z-10 max-w-sm">
                Interested in high-impact data solutions or professional consulting? Reach out for major business inquiries.
              </p>
              <Link 
                to="/contact" 
                className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-black bg-white hover:bg-[var(--brand-main)] hover:text-white px-10 py-5 rounded-2xl transition-all duration-500 relative z-10 group shadow-[0_15px_35px_rgba(255,255,255,0.1)] active:scale-95"
              >
                Launch Inquiry <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-white/30 text-[10px] uppercase tracking-[0.4em] font-bold">
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
      <div className="w-full h-[2px] mt-12 bg-gradient-to-r from-transparent via-[var(--brand-main)]/40 to-transparent" />
    </footer>
  );
}
