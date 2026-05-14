import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { firestoreService } from '../lib/firestore-service';
import { Blog } from '../types';
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { query, where, limit } from 'firebase/firestore';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      const results = await firestoreService.list<Blog>('blogs', [where('slug', '==', slug), limit(1)]);
      if (results.length > 0) {
        setBlog(results[0]);
      }
      setLoading(false);
    }
    loadData();
  }, [slug]);

  if (loading) return <div className="min-h-screen pt-32 text-center text-[var(--text-sub)] font-medium tracking-[0.3em] uppercase text-[10px]">Retrieving Journal...</div>;
  if (!blog) return <div className="min-h-screen pt-32 text-center text-[var(--text-muted)] font-[family-name:var(--font-heading)]  text-lg">Journal entry not found.</div>;

  return (
    <article className="pt-32 pb-20 relative">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[var(--brand-main)]/5 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
        <Link to="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-16 transition-colors text-[10px] uppercase tracking-[0.3em] font-semibold group">
          <ArrowLeft size={14} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" /> Back to Journal
        </Link>

        <header className="mb-16">
          <div className="flex flex-wrap items-center gap-6 text-[10px] uppercase tracking-[0.3em] font-semibold text-[var(--brand-main)] mb-8">
            <span className="flex items-center gap-2.5"><Calendar size={14} strokeWidth={1.5} className="text-white"/> {blog.publishedAt?.toDate ? new Date(blog.publishedAt.toDate()).toLocaleDateString() : 'Draft'}</span>
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="flex items-center gap-2.5"><Clock size={14} strokeWidth={1.5} className="text-white"/> 5 min read</span>
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="flex items-center gap-2.5"><User size={14} strokeWidth={1.5} className="text-white"/> {blog.author}</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-[family-name:var(--font-heading)] text-white mb-8 leading-tight tracking-tight drop-shadow-md">{blog.title}</h1>
          <div className="flex flex-wrap gap-2 mb-16">
            {blog.tags.map(tag => (
              <span key={tag} className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-white/70 text-[9px] font-mono uppercase tracking-widest">#{tag}</span>
            ))}
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="aspect-[21/9] w-full overflow-hidden rounded-[2rem] border border-white/5 bg-[#09090B] relative shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E]/80 to-transparent z-10 pointer-events-none" />
            <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover mix-blend-luminosity opacity-80" />
          </motion.div>
        </header>

        <div className="prose prose-invert prose-lg md:prose-xl max-w-none prose-headings:font-[family-name:var(--font-heading)] prose-headings:text-white prose-headings:font-light prose-p:text-[var(--text-sub)] prose-p:font-light prose-p:leading-relaxed prose-a:text-[var(--brand-main)] prose-a:no-underline hover:prose-a:underline prose-li:text-[var(--text-sub)] prose-li:font-light prose-blockquote:border-[var(--brand-main)] prose-blockquote:bg-white/5 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:font-[family-name:var(--font-heading)] prose-blockquote:not-italic prose-blockquote:text-white">
           <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>

        <footer className="mt-32 pt-16 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-[#09090B] p-8 rounded-3xl border border-white/5 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white flex items-center justify-center font-[family-name:var(--font-heading)] font-semibold text-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">Nh</div>
              <div>
                <div className="font-[family-name:var(--font-heading)] text-2xl text-white tracking-tight mb-1">{blog.author}</div>
                <div className="text-[10px] uppercase font-semibold tracking-[0.3em] text-[var(--brand-main)]">Data Scientist & AI Researcher</div>
              </div>
            </div>
            <div className="flex items-center gap-6 relative z-10">
               <span className="text-[10px] uppercase font-semibold tracking-[0.3em] text-white/50 hidden md:block">Share Knowledge</span>
               <button className="p-4 bg-white/5 rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition-all shadow-lg hover:shadow-xl hover:scale-105">
                 <Share2 size={18} strokeWidth={1.5} />
               </button>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}
