import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { firestoreService } from '../lib/firestore-service';
import { Certification } from '../types';
import { ExternalLink, Award, Calendar, X } from 'lucide-react';
import { orderBy } from 'firebase/firestore';
import SEO from '../components/SEO';

export default function CertificationsPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [loading, setLoading] = useState(true);

  const defaultCerts: Certification[] = [
    {
      id: 'aws-ml-specialty',
      title: 'AWS Certified Machine Learning - Specialty',
      organization: 'Amazon Web Services',
      issueDate: '2024',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
      verificationUrl: '#',
      skills: ['SageMaker', 'Computer Vision', 'NLP', 'Deep Learning'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'google-pde',
      title: 'Google Professional Data Engineer',
      organization: 'Google Cloud',
      issueDate: '2024',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop',
      verificationUrl: '#',
      skills: ['BigQuery', 'Dataflow', 'Vertex AI', 'TensorFlow'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'microsoft-azure-ds',
      title: 'Azure Data Scientist Associate (DP-100)',
      organization: 'Microsoft',
      issueDate: '2024',
      image: 'https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=2070&auto=format&fit=crop',
      verificationUrl: '#',
      skills: ['Azure ML', 'Python', 'MLOps', 'Feature Engineering'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'ibm-ds-prof',
      title: 'IBM Data Science Professional Certificate',
      organization: 'IBM',
      issueDate: '2023',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
      verificationUrl: '#',
      skills: ['Python', 'Data Analysis', 'SQL', 'Machine Learning'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'python-institute-pcpp',
      title: 'Certified Professional in Python Programming (PCPP)',
      organization: 'Python Institute',
      issueDate: '2023',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
      verificationUrl: '#',
      skills: ['Advanced Python', 'OOP', 'GUI', 'Networking'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'aws-data-analytics',
      title: 'AWS Certified Data Analytics - Specialty',
      organization: 'Amazon Web Services',
      issueDate: '2023',
      image: 'https://images.unsplash.com/photo-1504868584819-f8e90ece2cd3?q=80&w=2070&auto=format&fit=crop',
      verificationUrl: '#',
      skills: ['Redshift', 'Kinesis', 'QuickSight', 'ETL'],
      createdAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const data = await firestoreService.list<Certification>('certifications', [orderBy('createdAt', 'desc')]);
        setCerts(data.length > 0 ? data : defaultCerts);
      } catch (e) {
        setCerts(defaultCerts);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="min-h-screen pt-32 text-center text-white/50 font-medium tracking-[0.3em] uppercase text-[10px]">Loading credentials...</div>;

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full flex-grow flex flex-col">
      <SEO 
        title="Certifications"
        description="View professional certifications and credentials achieved by Nasir Hussain in Data Science, Cloud, and AI."
        keywords="Certifications, Data Science Credentials, AI Certificates, AWS ML Specialty, Professional Development"
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-24"
      >
        <span className="text-[var(--brand-main)] font-semibold uppercase tracking-[0.4em] text-[10px] mb-4 block">Credentials</span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-[family-name:var(--font-heading)] mb-6 text-white tracking-tighter drop-shadow-lg">Certifications</h1>
        <p className="text-[var(--text-sub)] max-w-2xl mx-auto font-light text-lg lg:text-xl leading-relaxed">Verified skills and professional milestones in Artificial Intelligence and Data Science.</p>
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-[var(--brand-main)] to-transparent mx-auto mt-12 opacity-50"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certs.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group cursor-pointer relative"
          >
            {/* Card Background & Border */}
            <div className="absolute inset-0 bg-[#0C0C0E] rounded-2xl border border-white/5 group-hover:border-white/20 transition-colors duration-700" />
            
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-main)]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative flex flex-col items-center h-full max-w-[95%] mx-auto py-6 z-10">
              <div className="aspect-[4/3] w-full overflow-hidden relative rounded-xl border border-white/5 bg-black" onClick={() => setSelectedCert(cert)}>
                <img 
                  src={cert.image} 
                  alt={cert.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-md rounded-full p-4 border border-white/20 scale-90 group-hover:scale-100 transition-transform duration-700">
                    <Award className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
              
              <div className="pt-8 px-4 text-center w-full flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-center gap-2 text-[var(--brand-main)] text-[9px] uppercase tracking-[0.3em] font-semibold mb-4">
                    <Calendar size={12} strokeWidth={1.5} /> {cert.issueDate}
                  </div>
                  <h3 className="text-2xl font-[family-name:var(--font-heading)] text-white mb-2 font-light group-hover:text-[var(--brand-hover)] transition-colors duration-500">{cert.title}</h3>
                  <p className="text-[var(--text-sub)] text-sm mb-8 font-light">{cert.organization}</p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {cert.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-white/70 text-[9px] uppercase tracking-widest font-mono">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex w-full mt-auto">
                  <a 
                    href={cert.verificationUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full text-white font-semibold py-4 text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white hover:text-black transition-all duration-500"
                  >
                    Verify Credential <ExternalLink size={14} strokeWidth={1.5} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedCert(null)}
              className="absolute inset-0 bg-[#060608]/95 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-4xl w-full bg-[#0C0C0E] border border-white/10 rounded-2xl p-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => setSelectedCert(null)}
                  className="bg-black/50 backdrop-blur-md border border-white/10 p-3 rounded-full text-white hover:bg-white hover:text-black transition-all shadow-xl"
                >
                  <X size={20} strokeWidth={1} />
                </button>
              </div>
              <div className="rounded-xl overflow-hidden bg-black/50 border border-white/5 aspect-[4/3] flex items-center justify-center p-4">
                 <img src={selectedCert.image} alt={selectedCert.title} className="max-h-full w-auto object-contain shadow-2xl" />
              </div>
              <div className="mt-10 mb-8 text-center px-8">
                <h2 className="text-3xl md:text-5xl font-[family-name:var(--font-heading)] text-white font-light tracking-tight mb-4">{selectedCert.title}</h2>
                <div className="flex items-center justify-center gap-4 text-[10px] lg:text-xs uppercase tracking-[0.3em] font-semibold text-[var(--brand-main)]">
                  <span>{selectedCert.organization}</span>
                  <div className="w-1 h-1 bg-white/30 rounded-full" />
                  <span className="text-[var(--text-muted)]">{selectedCert.issueDate}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
