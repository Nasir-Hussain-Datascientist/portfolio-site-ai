import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { firestoreService } from '../lib/firestore-service';
import { Project, Category } from '../types';
import { ExternalLink, Github, Layers, X, Info } from 'lucide-react';
import { orderBy } from 'firebase/firestore';
import SEO from '../components/SEO';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const defaultProjects: Project[] = [
    {
      id: 'p1',
      title: 'Institutional Risk Analytics Engine',
      description: 'Predictive modeling for high-frequency trading risk assessment at Tier-1 financial institutions.',
      fullDescription: 'Architected a real-time risk assessment engine utilizing XGBoost and Apache Spark to process massive transaction volumes. Implemented for major financial institutions, improving anomaly detection precision by 32%.',
      category: 'Machine Learning',
      technologies: ['Python', 'XGBoost', 'Apache Spark', 'AWS', 'SQL'],
      thumbnail: 'https://images.unsplash.com/photo-1611974717424-3608d380bb96?q=80&w=2070&auto=format&fit=crop',
      results: '32% Increase in Detection Precision',
      order: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: 'p2',
      title: 'Global Supply Chain Intelligence',
      description: 'AI-driven forecasting and optimization for international tech conglomerates.',
      fullDescription: 'Developed deep learning models (TensorFlow/Keras) for demand forecasting and inventory optimization. Leveraged Google Cloud Platform to build scalable data pipelines that reduced logistics overhead for major e-commerce leaders.',
      category: 'Machine Learning',
      technologies: ['TensorFlow', 'Kubernetes', 'GCP', 'BigQuery', 'Python'],
      thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=2070&auto=format&fit=crop',
      results: '18% Reduction in Logistics Costs',
      order: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: 'p3',
      title: 'Monetary Data Infrastructure',
      description: 'Secure, high-availability data pipelines for national regulatory bodies.',
      fullDescription: 'Designed enterprise-grade ETL pipelines and data lakes for national banking regulators, ensuring 99.9% data integrity and compliance with strict standards like GDPR and ISO 27001. Optimized data retrieval speeds by 45%.',
      category: 'Data Engineering',
      technologies: ['PySpark', 'Hadoop', 'Azure', 'Docker', 'PostgreSQL'],
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
      results: '45% Faster Data Processing',
      order: 3,
      createdAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const projs = await firestoreService.list<Project>('projects', [orderBy('order', 'asc')]);
        const cats = await firestoreService.list<Category>('categories');
        setProjects(projs.length > 0 ? projs : defaultProjects);
        setCategories(cats);
      } catch (e) {
        setProjects(defaultProjects);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  if (loading) return <div className="min-h-screen pt-32 text-center text-[var(--text-muted)] font-medium tracking-widest text-sm uppercase">Loading Catalog...</div>;

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 mx-auto w-full flex-grow flex flex-col" style={{ maxWidth: 'var(--container-width)' }}>
      <SEO 
        title="Projects"
        description="Explore the portfolio of data science and AI projects by Nasir Hussain. From risk analytics to predictive modeling."
        keywords="Data Science Projects, Machine Learning Portfolio, AI Solutions, Predictive Modeling, Risk Analytics"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-20"
      >
        <span className="text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Selected Works</span>
        <h1 className="font-[family-name:var(--font-heading)] mb-6 text-[var(--text-main)] tracking-tight" style={{ fontSize: 'var(--font-size-hero)', lineHeight: '0.9' }}>Portfolio</h1>
        <p className="text-[var(--text-sub)] max-w-2xl mx-auto font-normal text-lg">A selection of my professional work in Machine Learning, Data Analytics, and Advanced Engineering.</p>
        <div className="w-16 h-[1px] bg-[var(--brand-main)] text-[var(--brand-text)] mx-auto mt-10"></div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-6 mb-16 border-b border-[var(--border-light)] pb-4">
        <button
          onClick={() => setActiveCategory('All')}
          className={`text-[11px] font-bold tracking-[0.15em] uppercase transition-all pb-4 border-b-2 -mb-[18px] ${
            activeCategory === 'All' ? 'border-[var(--border-light)] text-[var(--text-main)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          All ({projects.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.name)}
            className={`text-[11px] font-bold tracking-[0.15em] uppercase transition-all pb-4 border-b-2 -mb-[18px] ${
              activeCategory === cat.name ? 'border-[var(--border-light)] text-[var(--text-main)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            {cat.name} ({projects.filter(p => p.category === cat.name).length})
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ 
                rotateY: 5, 
                rotateX: -5,
                scale: 1.02,
                translateZ: 20
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedProject(project)}
              className="bg-[#0C0C0E] overflow-hidden group cursor-pointer flex flex-col items-center transition-all duration-700 hover:z-30 relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] rounded-2xl border border-white/5 hover:border-white/20 shadow-2xl preserve-3d"
            >
              {/* Image Container with smooth zoom */}
              <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
                <img 
                  src={project.thumbnail} 
                  alt={project.title} 
                  className="w-full h-full object-cover opacity-50 mix-blend-luminosity group-hover:scale-110 group-hover:opacity-80 group-hover:mix-blend-normal transition-all duration-[1.5s] ease-[0.16,1,0.3,1] blur-[2px] group-hover:blur-0"
                />
                {/* Gradient from bottom for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/50 to-transparent pointer-events-none" />
                {/* Subtle top glow on hover */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-main)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>

              {/* Content Panel (Animated Metadata Reveal) */}
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]">
                <div className="text-[var(--brand-main)] text-[9px] font-semibold uppercase tracking-[0.3em] mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                  {project.category}
                </div>
                <h3 className="text-2xl sm:text-3xl font-[family-name:var(--font-heading)] text-white mb-2 font-light tracking-tight group-hover:text-[var(--brand-hover)] transition-colors duration-500">{project.title}</h3>
                
                {/* Description fades in */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200 h-0 group-hover:h-auto overflow-hidden">
                  <p className="text-[var(--text-sub)] text-sm line-clamp-2 mt-4 leading-relaxed font-light">{project.description}</p>
                </div>
                
                {/* Tech pills slide up faintly */}
                <div className="flex flex-wrap gap-2 mt-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-300">
                  {project.technologies.slice(0, 3).map(tech => (
                    <span 
                      key={tech} 
                      className="text-[9px] border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1 text-white/70 uppercase tracking-widest rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-[9px] text-white/40 py-1">+{project.technologies.length - 3}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-[#060608]/95 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-[#0C0C0E] max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl"
            >
              <div className="sticky top-0 right-0 z-50 flex justify-end p-6 pointer-events-none">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="bg-white/5 border border-white/10 p-3 text-white hover:bg-white hover:text-black transition-all rounded-full pointer-events-auto backdrop-blur-md"
                >
                  <X size={20} strokeWidth={1} />
                </button>
              </div>

              {/* Cinematic Hero Image in Modal */}
              <div className="w-full h-[40vh] md:h-[50vh] relative -mt-20 overflow-hidden">
                <img src={selectedProject.thumbnail} alt={selectedProject.title} className="w-full h-full object-cover object-center mix-blend-luminosity opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/50 to-transparent" />
                <div className="absolute bottom-8 left-8 md:bottom-16 md:left-16 right-8">
                   <div className="text-[var(--brand-main)] font-semibold uppercase tracking-[0.3em] text-[10px] mb-4">{selectedProject.category}</div>
                   <h2 className="text-4xl md:text-6xl lg:text-7xl font-[family-name:var(--font-heading)] text-white mb-6 leading-tight tracking-tight shadow-black drop-shadow-lg">{selectedProject.title}</h2>
                </div>
              </div>

              <div className="p-8 md:p-16 pt-8">
                <div className="flex flex-col lg:flex-row gap-16 mb-20">
                  <div className="flex-1">
                    <div className="prose prose-invert prose-lg max-w-none mb-12">
                      <p className="text-[var(--text-sub)] font-light leading-relaxed text-xl">{selectedProject.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-8">
                      {selectedProject.liveUrl && (
                        <a href={selectedProject.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white text-black hover:bg-gray-200 px-8 py-4 text-xs lg:text-sm uppercase tracking-[0.2em] font-semibold transition-all rounded-full hover:scale-105">
                          Live Platform <ExternalLink size={16} />
                        </a>
                      )}
                      {selectedProject.githubUrl && (
                        <a href={selectedProject.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 border border-white/20 text-white hover:bg-white/10 px-8 py-4 text-xs lg:text-sm uppercase tracking-[0.2em] font-semibold transition-all rounded-full hover:scale-105">
                          Research Source <Github size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="lg:w-1/4">
                    <h4 className="text-[var(--text-muted)] text-[10px] uppercase font-semibold tracking-[0.3em] mb-6 border-b border-white/10 pb-4">Tech Stack</h4>
                    <ul className="flex flex-col gap-4">
                       {selectedProject.technologies.map(tech => (
                         <li key={tech} className="text-sm font-mono text-white/80 flex items-center gap-3">
                           <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-main)]/50" />
                           {tech}
                         </li>
                       ))}
                    </ul>
                  </div>
                </div>

                <div className="grid lg:grid-cols-[2fr_1fr] gap-16 mb-20">
                    <div className="prose prose-invert max-w-none">
                      <h3 className="text-2xl font-[family-name:var(--font-heading)] text-white mb-8 border-b border-white/10 pb-4">Architectural Overview</h3>
                      <p className="text-[var(--text-sub)] font-light leading-relaxed text-lg whitespace-pre-wrap">{selectedProject.fullDescription || selectedProject.description}</p>
                    </div>
                    
                    <div className="">
                      <h3 className="text-2xl font-[family-name:var(--font-heading)] text-white mb-8 border-b border-white/10 pb-4">Impact</h3>
                      <div className="p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10">
                        <Info className="text-[var(--brand-main)] mb-6" size={32} strokeWidth={1} />
                        <p className="text-white font-light text-lg leading-relaxed">{selectedProject.results}</p>
                      </div>
                    </div>
                </div>

                {selectedProject.embedUrl && (
                  <div className="mb-24">
                    <h3 className="text-2xl font-[family-name:var(--font-heading)] text-white mb-8">Intelligence Dashboard</h3>
                    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      <iframe 
                        src={selectedProject.embedUrl} 
                        title="Dashboard Embed"
                        className="w-full h-full"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                {selectedProject.screenshots && selectedProject.screenshots.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-[family-name:var(--font-heading)] text-white mb-8 border-b border-white/10 pb-4">Visualization Gallery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {selectedProject.screenshots.map((s, i) => (
                        <div key={i} className="aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 shadow-xl group/img relative">
                           <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E]/80 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                          <img src={s} alt={`${selectedProject.title} screen ${i}`} className="w-full h-full object-cover mix-blend-luminosity opacity-60 group-hover/img:mix-blend-normal group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-[1.5s] ease-[0.16,1,0.3,1]" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
