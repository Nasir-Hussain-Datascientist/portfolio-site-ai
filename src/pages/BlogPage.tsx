import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { firestoreService } from '../lib/firestore-service';
import { Blog } from '../types';
import { Search, Clock, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { query, where, orderBy } from 'firebase/firestore';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await firestoreService.list<Blog>('blogs', [
        where('published', '==', true),
        orderBy('publishedAt', 'desc')
      ]);
      setBlogs(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <div className="min-h-screen pt-32 text-center text-[var(--text-sub)] font-medium tracking-[0.3em] uppercase text-[10px]">Loading Insights...</div>;

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20 border-b border-white/5 pb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <span className="text-[var(--brand-main)] font-semibold uppercase tracking-[0.4em] text-[10px] mb-4 block">Journal</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-[family-name:var(--font-heading)] mb-6 text-white tracking-tighter drop-shadow-lg">Insights</h1>
          <p className="text-[var(--text-sub)] font-light text-lg lg:text-xl">Thoughts, tutorials, and investigations into the world of Data Science and Artificial Intelligence.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full md:w-96"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
             <Search className="text-[var(--brand-main)]" size={16} strokeWidth={1.5} />
          </div>
          <input
            type="text"
            placeholder="Search tags or titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[var(--brand-main)] rounded-full py-4 pl-12 pr-6 outline-none transition-all duration-300 text-sm text-white placeholder:text-white/30 backdrop-blur-md"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-20">
        {filteredBlogs.map((blog, i) => (
          <motion.article
            key={blog.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-8 group"
          >
            <Link to={`/blog/${blog.slug}`} className="block overflow-hidden rounded-[2rem] aspect-[16/10] bg-[#09090B] border border-white/5 relative group-hover:border-white/20 transition-colors duration-700">
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
              <img 
                src={blog.featuredImage} 
                alt={blog.title} 
                className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s] ease-[0.16,1,0.3,1]"
              />
            </Link>
            <div className="flex flex-col px-2">
              <div className="flex items-center gap-4 text-[9px] uppercase font-semibold tracking-[0.3em] text-[var(--brand-main)] mb-6">
                <span className="flex items-center gap-1.5"><Calendar size={12} strokeWidth={1.5} /> {blog.publishedAt?.toDate ? new Date(blog.publishedAt.toDate()).toLocaleDateString() : 'Draft'} </span>
                <div className="w-1 h-1 bg-white/30 rounded-full" />
                <span className="flex items-center gap-1.5 text-white/50"><Clock size={12} strokeWidth={1.5} /> 5 min read</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-[family-name:var(--font-heading)] text-white mb-6 font-light group-hover:text-[var(--brand-hover)] transition-colors duration-500 leading-tight">
                <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
              </h2>
              <p className="text-[var(--text-sub)] font-light text-base lg:text-lg mb-8 line-clamp-3 leading-relaxed">
                {blog.excerpt || blog.content.substring(0, 150) + '...'}
              </p>
              <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-6">
                 <div className="flex flex-wrap gap-2">
                  {blog.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-mono border border-white/10 bg-white/5 rounded-full px-3 py-1 text-white/70 uppercase tracking-widest">#{tag}</span>
                  ))}
                 </div>
                 <Link to={`/blog/${blog.slug}`} className="inline-flex items-center gap-2 text-white/80 hover:text-white text-[10px] font-semibold uppercase tracking-[0.3em] group/btn transition-colors">
                  Read Article <ChevronRight size={14} strokeWidth={1.5} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.article>
        ))}

        {filteredBlogs.length === 0 && (
          <div className="col-span-full py-32 text-center text-white/50 font-[family-name:var(--font-heading)] text-2xl font-light">
            No journals found answering your query.
          </div>
        )}
      </div>
    </div>
  );
}
