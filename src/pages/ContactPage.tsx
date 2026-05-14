import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Phone, Github, Linkedin, Twitter, Send, CheckCircle, Instagram, Facebook } from 'lucide-react';
import { firestoreService } from '../lib/firestore-service';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    { id: 'linkedin', icon: Linkedin, url: settings?.linkedin },
    { id: 'github', icon: Github, url: settings?.github },
    { id: 'instagram', icon: Instagram, url: settings?.instagram },
    { id: 'facebook', icon: Facebook, url: settings?.facebook },
    { id: 'tiktok', icon: ({ size, className }: any) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
      </svg>
    ), url: settings?.tiktok },
    { id: 'whatsapp', icon: ({ size, className }: any) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17.5 19l4.5 3-4.5-3zM21 11.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0z"></path>
      </svg>
    ), url: settings?.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` : null },
  ].filter(link => link.url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      await firestoreService.create('inquiries', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-24"
      >
        <span className="text-[var(--brand-main)] font-semibold uppercase tracking-[0.4em] text-[10px] mb-4 block">Let's Talk</span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-[family-name:var(--font-heading)] mb-6 text-white tracking-tighter drop-shadow-lg">Contact</h1>
        <p className="text-[var(--text-sub)] max-w-2xl mx-auto font-light text-lg lg:text-xl leading-relaxed">Have a project in mind or just want to chat? I'm always open to new connections and interesting collaborations.</p>
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-[var(--brand-main)] to-transparent mx-auto mt-12 opacity-50"></div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--brand-main)]/5 blur-[120px] rounded-full pointer-events-none" />
         
        {/* Contact Info */}
        <div className="space-y-12 relative z-10">
          <div className="bg-[#09090B] border border-white/5 p-12 rounded-3xl shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
             <h3 className="text-2xl font-[family-name:var(--font-heading)] text-white mb-10 tracking-tight relative z-10">Contact Information</h3>
             <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 text-white shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <Mail size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-[var(--brand-main)] text-[9px] uppercase tracking-[0.3em] font-semibold mb-1 mt-1">Email</div>
                    <div className="text-white font-light text-sm">{settings?.email || "nasir.swat.hussain@gmail.com"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 text-white shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg delay-75">
                    <MapPin size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                     <div className="text-[var(--brand-main)] text-[9px] uppercase tracking-[0.3em] font-semibold mb-1 mt-1">Location</div>
                    <div className="text-white font-light text-sm">{settings?.location || "Swat / London / Remote"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 text-white shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg delay-150">
                    <Phone size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                     <div className="text-[var(--brand-main)] text-[9px] uppercase tracking-[0.3em] font-semibold mb-1 mt-1">Phone</div>
                    <div className="text-white font-light text-sm">{settings?.phone || "+92 345 1251789"}</div>
                  </div>
                </div>
             </div>

             <div className="mt-16 pt-8 border-t border-white/5 relative z-10">
                <h4 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50 mb-6">Follow Intelligence</h4>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social) => (
                    <a key={social.id} href={social.url!} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-lg hover:scale-110">
                      <social.icon size={18} strokeWidth={1.5} />
                    </a>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 relative z-10">
          {submitted ? (
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
              className="bg-[#09090B] border border-white/5 p-12 rounded-3xl text-center flex flex-col items-center justify-center h-full min-h-[500px] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--brand-main)]/10 via-transparent to-transparent opacity-50" />
              <div className="w-20 h-20 rounded-full border border-white/10 text-[var(--brand-main)] flex items-center justify-center mb-8 bg-white/5 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.1)] relative z-10">
                 <CheckCircle size={36} strokeWidth={1.5} />
              </div>
              <h2 className="text-4xl font-[family-name:var(--font-heading)] text-white mb-6 tracking-tight relative z-10">Transmission Sent</h2>
              <p className="text-[var(--text-sub)] font-light mb-12 max-w-sm text-lg relative z-10">Thank you for reaching out. I'll analyze your request and return contact shortly.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-white/70 text-xs uppercase tracking-[0.2em] font-semibold hover:text-white transition-colors relative z-10 flex items-center gap-2 group"
              >
                Initiate New Message <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#09090B] border border-white/5 p-8 md:p-14 rounded-3xl shadow-2xl relative"
            >
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.3em] ml-2">Full Name</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-white/5 border border-white/5 px-6 py-5 rounded-2xl text-sm outline-none focus:bg-white/10 focus:border-white/20 transition-all text-white placeholder:text-white/20 font-light"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.3em] ml-2">Email Address</label>
                    <input
                      required
                      type="email"
                      className="w-full bg-white/5 border border-white/5 px-6 py-5 rounded-2xl text-sm outline-none focus:bg-white/10 focus:border-white/20 transition-all text-white placeholder:text-white/20 font-light"
                      placeholder="jane@domain.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.3em] ml-2">Subject</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-white/5 border border-white/5 px-6 py-5 rounded-2xl text-sm outline-none focus:bg-white/10 focus:border-white/20 transition-all text-white placeholder:text-white/20 font-light"
                    placeholder="Project Inquiry / Consultation"
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.3em] ml-2">Message</label>
                  <textarea
                    required
                    rows={6}
                    className="w-full bg-white/5 border border-white/5 px-6 py-5 rounded-2xl text-sm outline-none focus:bg-white/10 focus:border-white/20 transition-all text-white resize-none placeholder:text-white/20 font-light"
                    placeholder="Provide details about your objectives..."
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                {error && <div className="text-red-400 text-sm bg-red-400/10 p-4 border border-red-400/20 rounded-xl">{error}</div>}

                <button
                  disabled={submitting}
                  className="w-full bg-white text-black hover:bg-gray-200 py-6 rounded-2xl disabled:opacity-50 transition-all flex items-center justify-center gap-4 group mt-8 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="text-[11px] uppercase tracking-[0.3em] font-bold">Transmit Message</span>
                      <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
