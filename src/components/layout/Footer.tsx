import { Github, Linkedin, Twitter, Mail, Globe, MapPin, Shield, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { firestoreService } from '../../lib/firestore-service';

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
    { id: 'linkedin', icon: Linkedin, url: settings?.linkedin, label: 'LinkedIn' },
    { id: 'github', icon: Github, url: settings?.github, label: 'GitHub' },
    { id: 'instagram', icon: Instagram, url: settings?.instagram, label: 'Instagram' },
    { id: 'facebook', icon: Facebook, url: settings?.facebook, label: 'Facebook' },
    { id: 'tiktok', icon: ({ size, className }: any) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
      </svg>
    ), url: settings?.tiktok, label: 'TikTok' },
    { id: 'whatsapp', icon: ({ size, className }: any) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17.5 19l4.5 3-4.5-3zM21 11.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0z"></path>
      </svg>
    ), url: settings?.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` : null, label: 'WhatsApp' },
    { id: 'email', icon: Mail, url: settings?.email ? `mailto:${settings.email}` : null, label: 'Email' },
  ].filter(link => link.url);

  return (
    <footer className="relative z-10 border-t border-[var(--border-light)] py-20 bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-8 group inline-flex">
              <div className="w-8 h-8 bg-[var(--brand-main)] text-[var(--brand-text)] flex items-center justify-center font-[family-name:var(--font-heading)] font-bold text-lg group-hover:rotate-6 transition-transform">
                {settings?.name?.[0] || 'N'}
              </div>
              <span className="font-[family-name:var(--font-heading)] font-bold text-lg text-[var(--text-main)] tracking-tight">{settings?.name || "Nasir Hussain"}</span>
            </Link>
            <p className="text-[var(--text-sub)] max-w-sm mb-10 leading-relaxed font-normal text-sm">
              {settings?.bio || "Data Scientist and AI Engineer dedicated to transforming complex data into meaningful insights and building the next generation of intelligent systems."}
            </p>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border-[length:var(--border-width)] border-[style:var(--border-style)] border-[var(--border-light)] bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-sub)] hover:text-[var(--text-main)] hover:border-[var(--border-light)] transition-all"
                  title={link.label}
                >
                  <link.icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-8 text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Navigation</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/" className="text-[var(--text-main)] hover:text-[var(--text-sub)] transition-colors">Home</Link></li>
              <li><Link to="/projects" className="text-[var(--text-main)] hover:text-[var(--text-sub)] transition-colors">Projects</Link></li>
              <li><Link to="/services" className="text-[var(--text-main)] hover:text-[var(--text-sub)] transition-colors">Services</Link></li>
              <li><Link to="/certifications" className="text-[var(--text-main)] hover:text-[var(--text-sub)] transition-colors">Certifications</Link></li>
              <li><Link to="/blog" className="text-[var(--text-main)] hover:text-[var(--text-sub)] transition-colors">Journal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-8 text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Contact</h4>
            <ul className="space-y-4 text-sm text-[var(--text-main)] font-medium">
              <li className="flex items-center gap-3"><MapPin size={14} strokeWidth={1.5} className="text-[var(--text-muted)]"/> {settings?.location || "Swat / London / Remote"}</li>
              <li className="flex items-center gap-3 overflow-hidden overflow-ellipsis"><Mail size={14} strokeWidth={1.5} className="text-[var(--text-muted)]"/> {settings?.email || "nasir.swat.hussain@gmail.com"}</li>
              <li className="flex items-center gap-3"><Globe size={14} strokeWidth={1.5} className="text-[var(--text-muted)]"/> {settings?.website || "nasir-hussain.me"}</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border-light)] flex flex-col md:flex-row justify-between items-center gap-4 text-[var(--text-muted)] text-[10px] uppercase tracking-[0.1em] font-bold">
          <p>© {new Date().getFullYear()} {settings?.name || "Nasir Hussain"}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/admin/login" className="hover:text-[var(--text-main)] transition-colors flex items-center gap-1.5"><Shield size={12} strokeWidth={1.5} /> Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
