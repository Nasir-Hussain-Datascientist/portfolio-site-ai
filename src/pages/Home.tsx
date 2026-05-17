import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Github, Linkedin, Brain, Database, BarChart, Award, Instagram, Facebook, Mail, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { firestoreService } from '../lib/firestore-service';
import { useTheme } from '../contexts/ThemeContext';
import SEO from '../components/SEO';

export default function Home() {
  const [stats, setStats] = useState({ projects: 0, certs: 0, years: 5 });
  const [settings, setSettings] = useState<any>(null);
  const { theme } = useTheme();

  const isCenter = ['art-deco', 'coquette', 'tenebrism', 'chinoiserie'].includes(theme);

  useEffect(() => {
    async function loadData() {
      try {
        const [proj, certs, settingsData] = await Promise.all([
          firestoreService.list('projects'),
          firestoreService.list('certifications'),
          firestoreService.list('settings')
        ]);
        setStats({ projects: proj.length, certs: certs.length, years: 5 });
        if (settingsData.length > 0) {
          setSettings(settingsData[0]);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const statsData = [
    { label: 'Intelligent Assets', value: stats.projects, icon: Database },
    { label: 'Validated Credentials', value: stats.certs, icon: Brain },
    { label: 'Academic Merit', value: 'Gold Medalist', icon: Award },
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, url: settings?.linkedin || 'https://www.linkedin.com/in/nasirhussain-datascience/?skipRedirect=true' },
    { name: 'GitHub', icon: Github, url: settings?.github || 'https://github.com/nasir-hussain-datascientist' },
    { name: 'WhatsApp', icon: ({ size, className }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>, url: settings?.whatsapp || 'https://wa.me/923265707981' },
    { name: 'Facebook', icon: Facebook, url: settings?.facebook || 'https://web.facebook.com/nasir.hussain.819767' },
    { name: 'Instagram', icon: Instagram, url: settings?.instagram || 'https://www.instagram.com/im.nasirhussain/' },
    { name: 'TikTok', icon: ({ size, className }: any) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
      </svg>
    ), url: settings?.tiktok || 'https://www.tiktok.com/@nasir_hussain06' },
    { name: 'Email', icon: Mail, url: settings?.email ? `mailto:${settings.email}` : 'mailto:nasir.swat.hussain@gmail.com' },
  ];

  return (
    <div className="flex-grow flex flex-col bg-[#060608] text-white">
      <SEO 
        title="Home"
        description="Turning data into actionable insights and building intelligent systems. Explore the portfolio of Nasir Hussain."
      />
      {/* Cinematic Hero */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[var(--brand-main)]/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10 preserve-3d">
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: 20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="inline-flex items-center gap-4 mb-8"
            >
              <span className="w-12 h-px bg-[var(--brand-main)]"></span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--brand-main)]">{settings?.role || "Senior Data Scientist"}</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-[family-name:var(--font-heading)] mb-8 leading-[0.9] tracking-tighter text-white">
              {settings?.name?.split(' ')[0] || "Nasir"} <br/>
              <span className="text-white/30 text-7xl md:text-8xl lg:text-9xl">{settings?.name?.split(' ').slice(1).join(' ') || "Hussain."}</span>
            </h1>
            
            <p className="text-[var(--text-sub)] font-light text-xl md:text-2xl mb-12 leading-relaxed max-w-xl">
              Specializing in <span className="text-white">advanced analytics</span>, predictive modelling, and business intelligence for global fintech and tech leaders.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-8 mb-20">
              <Link
                to="/projects"
                className="group relative px-12 py-5 bg-white text-black text-xs font-bold uppercase tracking-[0.3em] overflow-hidden rounded-full transition-all hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Explore Solutions <ArrowRight size={16} />
                </span>
              </Link>
            </div>

            <div className="flex items-center flex-wrap gap-8 pt-12 border-t border-white/5">
              <span className="text-white/30 text-[9px] uppercase tracking-[0.4em] font-semibold">Connect Intelligence</span>
              <div className="flex flex-wrap gap-6">
                {socialLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-white/40 hover:text-white transition-all transform hover:scale-110"
                    title={link.name}
                  >
                    <link.icon size={22} strokeWidth={1} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Profile Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -20, rotateX: 10, translateZ: -100 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0, translateZ: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] w-full max-w-[540px] ml-auto group preserve-3d"
          >
            {/* Artistic Frame */}
            <div className="absolute inset-4 border border-white/10 rounded-[3rem] z-20 pointer-events-none group-hover:inset-0 transition-all duration-700 shadow-2xl" />
            <div className="absolute inset-0 bg-[#0C0C0E] rounded-[3rem] overflow-hidden shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)] border border-white/5 flex items-center justify-center">
              {settings?.profilePhotoUrl ? (
                <img 
                  src={settings.profilePhotoUrl}
                  alt={settings?.name || "Nasir Hussain"}
                  className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-[2s] ease-[0.16,1,0.3,1] scale-105 group-hover:scale-100"
                />
              ) : (
                <div className="flex flex-col items-center gap-6 text-white/10 group-hover:text-brand-500/30 transition-colors duration-700">
                  <User size={120} strokeWidth={0.5} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-50">Profile Identity</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-transparent opacity-80" />
            </div>
            
            {/* Floating Intelligence Badge */}
            <motion.div 
               animate={{ y: [0, -15, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -bottom-10 -right-10 bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl z-30 shadow-2xl hidden md:block"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-[var(--brand-main)]/20 rounded-2xl flex items-center justify-center">
                  <Brain className="text-[var(--brand-main)]" size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-white text-xl font-[family-name:var(--font-heading)] leading-none mb-1">98.4%</div>
                  <div className="text-white/40 text-[9px] uppercase tracking-widest">Model Precision</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Numerical Impact */}
      <section className="py-20 md:py-32 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 gap-16 md:gap-20 md:grid-cols-3">
          {statsData.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, rotateX: 30 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center group preserve-3d"
            >
              <div className="mb-6 flex justify-center">
                <div className="w-px h-8 md:h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent group-hover:h-12 md:group-hover:h-16 transition-all duration-700" />
              </div>
              <div className="text-5xl md:text-7xl font-[family-name:var(--font-heading)] text-white mb-4 tracking-tighter font-light scale-110 group-hover:scale-125 transition-transform duration-700 drop-shadow-2xl">{stat.value}</div>
              <div className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience Timeline Summary */}
      <section className="py-20 md:py-32 border-t border-white/5 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-[var(--brand-main)] font-semibold uppercase tracking-[0.4em] text-[10px] mb-6 block">Career Trajectory</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-heading)] text-white mb-8 md:mb-10 tracking-tight leading-tight">
                Architecting solutions for <br/>
                <span className="text-white/40">Complex Data Challenges.</span>
              </h2>
              <p className="text-[var(--text-sub)] font-light text-base md:text-lg mb-8 md:mb-12 leading-relaxed">
                As a Data Scientist, I have engineered sophisticated analytical frameworks and robust data architectures, bridging the gap between raw data and strategic intelligence for global organizations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5">
                <BarChart className="w-32 h-32 md:w-40 md:h-40 text-white" strokeWidth={0.5} />
              </div>
              
              <div className="relative z-10">
                <div className="text-[var(--brand-main)] text-[10px] uppercase tracking-[0.3em] font-bold mb-6 md:mb-8">Current Engagement</div>
                <h3 className="text-2xl md:text-3xl font-[family-name:var(--font-heading)] text-white mb-2">Data Scientist</h3>
                <div className="text-white/60 mb-6 md:mb-8 font-light italic text-sm md:text-base">FirstNetSystems • London, UK</div>
                
                <ul className="space-y-4 md:space-y-6 text-[var(--text-sub)] font-light text-sm md:text-base leading-relaxed">
                  <li className="flex gap-4">
                    <span className="text-[var(--brand-main)]">•</span>
                    Deployed machine learning models into production using Docker & Kubernetes on AWS/GCP.
                  </li>
                  <li className="flex gap-4">
                    <span className="text-[var(--brand-main)]">•</span>
                    Architected end-to-end data pipelines for real-time risk assessment and predictive analytics.
                  </li>
                  <li className="flex gap-4">
                    <span className="text-[var(--brand-main)]">•</span>
                    Collaborated with cross-functional teams to translate complex findings into actionable business strategy.
                  </li>
                </ul>
                
                <Link to="/projects" className="inline-flex items-center gap-3 text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mt-8 md:mt-12 group/link">
                  View Full Portfolio <ArrowRight size={16} className="group-hover/link:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 md:py-32 overflow-hidden relative border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--brand-main)]/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-[family-name:var(--font-heading)] mb-10 md:mb-16 text-white leading-[0.9] tracking-tighter">
              Analytical Precision. <br/> 
              <span className="text-white/20">Actionable Intelligence.</span>
            </h2>
            <p className="text-[var(--text-sub)] font-light text-lg md:text-xl leading-relaxed mx-auto max-w-2xl mb-16 md:mb-24">
              I have over 3 years of experience in Data Science, specializing in delivering advanced analytics, <span className="text-white italic">predictive modelling</span>, and business intelligence solutions for high-stakes environments.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
              {['Python', 'R', 'SQL', 'TensorFlow', 'Scikit-learn', 'PyTorch', 'Apache Spark', 'Power BI', 'Tableau', 'AWS', 'GCP', 'Azure', 'MLOps', 'ETL Pipelines', 'Cyber Security'].map((tech) => (
                <span 
                  key={tech} 
                  className="px-6 py-2 md:px-8 md:py-3 bg-white/5 border border-white/5 rounded-full text-[9px] md:text-[10px] font-semibold tracking-[0.2em] uppercase text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
