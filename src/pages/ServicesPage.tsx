import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { firestoreService } from '../lib/firestore-service';
import { Service } from '../types';
import * as LucideIcons from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // If collection is empty, I'll show some default ones
      const data = await firestoreService.list<Service>('services');
      setServices(data.length > 0 ? data : defaultServices);
      setLoading(false);
    }
    loadData();
  }, []);

  const defaultServices: Service[] = [
    {
      id: 's1',
      title: 'Advanced Analytics',
      description: 'Leveraging statistical analysis and experimental design to extract deep insights from complex datasets and drive strategic business growth.',
      iconName: 'BarChart3',
      benefits: ['Hypothesis Testing', 'Statistical Modeling', 'Predictive Trends']
    },
    {
      id: 's2',
      title: 'ML Engineering & MLOps',
      description: 'End-to-end development of robust Machine Learning models and automated deployment pipelines using Docker, Kubernetes, and Cloud platforms.',
      iconName: 'Cpu',
      benefits: ['Cloud-Native Deployment', 'Automated Pipelines', 'Model Monitoring']
    },
    {
      id: 's3',
      title: 'Business Intelligence',
      description: 'Architecting intelligent dashboards and reporting systems using Power BI and Tableau to visualize metrics and monitor performance in real-time.',
      iconName: 'Database',
      benefits: ['Interactive Visuals', 'Actionable Insights', 'Real-time Reporting']
    },
    {
      id: 's4',
      title: 'Big Data & Governance',
      description: 'Processing massive datasets with Apache Spark and Hadoop while ensuring strict adherence to data security standards like GDPR and ISO 27001.',
      iconName: 'Shield',
      benefits: ['Spark/Hadoop Architecture', 'Security Compliance', 'Data Lineage']
    }
  ];

  if (loading) return <div className="min-h-screen pt-32 text-center text-[var(--text-sub)] font-medium tracking-[0.3em] uppercase text-[10px]">Loading services...</div>;

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-24"
      >
        <span className="text-[var(--brand-main)] font-semibold uppercase tracking-[0.4em] text-[10px] mb-4 block">Competencies & Impact</span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-[family-name:var(--font-heading)] mb-6 text-white tracking-tighter drop-shadow-lg">Intelligence Services</h1>
        <p className="text-[var(--text-sub)] max-w-2xl mx-auto font-light text-lg lg:text-xl leading-relaxed">
          Delivering advanced analytics and scalable machine learning solutions for global financial institutions and major technology companies.
        </p>
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-[var(--brand-main)] to-transparent mx-auto mt-12 opacity-50"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, i) => {
          const IconComponent = (LucideIcons as any)[service.iconName] || LucideIcons.Layers;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative group p-12 overflow-hidden rounded-3xl bg-[#09090B] border border-white/5 hover:border-white/10 transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--brand-main)]/20 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full items-start">
                <div className="text-white/60 group-hover:text-white transition-colors duration-500 mb-8 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
                   <IconComponent size={32} strokeWidth={1} />
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-3xl font-[family-name:var(--font-heading)] text-white mb-4 tracking-tight group-hover:text-[var(--brand-hover)] transition-colors duration-500">{service.title}</h3>
                  <p className="text-[var(--text-sub)] font-light leading-relaxed mb-10 text-lg">{service.description}</p>
                  
                  <div className="space-y-4 pt-8 mt-auto w-full border-t border-white/5">
                    {service.benefits.map((benefit, j) => (
                      <div key={j} className="flex items-center gap-4 text-xs uppercase tracking-widest text-white/80 font-medium">
                        <div className="w-1 h-1 bg-[var(--brand-main)] rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                         {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-32 text-center py-24 relative overflow-hidden rounded-3xl border border-white/5 bg-[#09090B]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent pointer-events-none" />
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-heading)] text-white mb-8 tracking-tight">Consulting & Strategy</h2>
        <p className="text-[var(--text-sub)] font-light mb-12 max-w-xl mx-auto text-lg md:text-xl leading-relaxed">I'm always open to discussing custom solutions tailored to your unique data needs. Let's build something intelligent together.</p>
        <a href="/contact" className="bg-white text-black hover:bg-gray-200 px-10 py-5 text-xs tracking-[0.2em] uppercase font-bold transition-transform rounded-full inline-flex items-center gap-3 hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          Initiate Request <LucideIcons.ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}
