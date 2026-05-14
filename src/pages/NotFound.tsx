import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-brand-500/10 [border-radius:var(--radius-full)] flex items-center justify-center mx-auto mb-8"
        >
          <AlertCircle size={48} className="text-brand-500" />
        </motion.div>
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-[var(--text-muted)] mb-12 max-w-md mx-auto">
          The page you are looking for might have been moved, deleted, or never existed in this dimension.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-[var(--text-main)] font-bold px-8 py-4 rounded-xl transition-all hover:scale-105"
        >
          <Home size={20} /> Back to Earth
        </Link>
      </div>
    </div>
  );
}
