import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Phone, Github, Linkedin, Instagram, Facebook, MessageCircle, ExternalLink } from 'lucide-react';
import { firestoreService } from '../lib/firestore-service';
import SEO from '../components/SEO';

export default function ContactPage() {
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
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      url: 'https://www.linkedin.com/in/nasirhussain-datascience/?skipRedirect=true',
      label: 'Professional Network',
      color: 'from-blue-600 to-blue-400'
    },
    { 
      name: 'GitHub', 
      icon: Github, 
      url: 'https://github.com/nasir-hussain-datascientist',
      label: 'Open Source Projects',
      color: 'from-gray-800 to-gray-600'
    },
    { 
      name: 'WhatsApp', 
      icon: MessageCircle, 
      url: 'https://wa.me/923451251789',
      label: 'Quick Message',
      color: 'from-green-600 to-green-400'
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      url: 'https://www.instagram.com/im.nasirhussain/',
      label: 'Visual Journey',
      color: 'from-purple-600 to-pink-500'
    },
    { 
      name: 'Facebook', 
      icon: Facebook, 
      url: 'https://web.facebook.com/nasir.hussain.819767',
      label: 'Social Connect',
      color: 'from-blue-700 to-blue-500'
    },
    { 
      name: 'TikTok', 
      icon: ({ size, className }: any) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
        </svg>
      ), 
      url: 'https://www.tiktok.com/@nasir_hussain06',
      label: 'Short Insights',
      color: 'from-black to-gray-800'
    },
    { 
      name: 'Email', 
      icon: Mail, 
      url: 'mailto:nasir.swat.hussain@gmail.com',
      label: 'Official Inquiry',
      color: 'from-red-600 to-orange-500'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <SEO 
        title="Contact"
        description="Connect with Nasir Hussain across various social platforms for collaborations or data science consultations."
        keywords="Contact Nasir Hussain, Social Media, LinkedIn, GitHub, Hire Data Scientist"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-16"
      >
        <span className="text-[var(--brand-main)] font-semibold uppercase tracking-[0.4em] text-[10px] mb-4 block">Connections</span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-[family-name:var(--font-heading)] mb-6 text-white tracking-tighter drop-shadow-lg">Get in Touch</h1>
        <p className="text-[var(--text-sub)] max-w-2xl mx-auto font-light text-lg lg:text-xl leading-relaxed">
          I'm currently available for freelance work, consulting, and collaborations. 
          Choose your preferred platform and let's start a conversation.
        </p>
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-[var(--brand-main)] to-transparent mx-auto mt-12 opacity-50"></div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
      >
        {socialLinks.map((social) => (
          <motion.a
              key={social.name}
              variants={itemVariants}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="group relative bg-[#09090B] border border-white/5 p-8 rounded-3xl transition-all duration-500 hover:border-white/20 overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${social.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]`}>
                    <social.icon size={24} strokeWidth={1.5} />
                  </div>
                  <ExternalLink size={14} className="text-white/20 group-hover:text-white/60 transition-colors" />
                </div>
                
                <h4 className="text-xl font-[family-name:var(--font-heading)] text-white mb-1">{social.name}</h4>
                <p className="text-white/40 text-xs font-light mb-6">{social.label}</p>
                
                <div className="mt-auto pt-4 flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand-main)] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  Connect Now <span className="ml-2">→</span>
                </div>
              </div>
            </motion.a>
          ))}
      </motion.div>
      
      {/* Decorative background */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[var(--brand-main)]/5 blur-[150px] rounded-full pointer-events-none -z-10" />
    </div>
  );
}
