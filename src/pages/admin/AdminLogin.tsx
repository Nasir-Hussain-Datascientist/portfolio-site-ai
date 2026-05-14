import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { LogIn, Mail, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      if (!email.toLowerCase().endsWith('@gmail.com')) {
        setError('Only Gmail accounts are permitted for admin access.');
        setLoading(false);
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid credentials. Access is restricted to manually approved accounts.');
      } else {
        setError('Login failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg-main)]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-2xl w-full max-auto max-w-md"
        style={{ borderRadius: 'var(--border-radius-card)', transform: 'rotate(var(--card-tilt))' }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--brand-main)]/10 [border-radius:var(--radius-full)] flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-[var(--brand-main)]" />
          </div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-2">Admin Portal</h1>
          <p className="text-[var(--text-muted)]">Secure access only</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-[var(--text-muted)] mb-2 px-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--brand-main)] transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-[var(--bg-sub)] border-[length:var(--border-width)] border-[style:var(--border-style)] border-[var(--border-light)] focus:border-[var(--brand-main)] text-[var(--text-main)] pl-12 pr-4 py-3 outline-none transition-all"
                style={{ borderRadius: 'var(--radius-main)' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-[var(--text-muted)] mb-2 px-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--brand-main)] transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[var(--bg-sub)] border-[length:var(--border-width)] border-[style:var(--border-style)] border-[var(--border-light)] focus:border-[var(--brand-main)] text-[var(--text-main)] pl-12 pr-4 py-3 outline-none transition-all"
                style={{ borderRadius: 'var(--radius-main)' }}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--brand-main)] hover:bg-[var(--brand-hover)] disabled:opacity-50 text-[var(--brand-text)] font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 mt-8 shadow-[var(--button-shadow)]"
            style={{ borderRadius: 'var(--radius-main)', transform: 'var(--button-transform)' }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[var(--brand-text)] border-t-transparent [border-radius:var(--radius-full)] animate-spin" />
            ) : (
              <>
                <LogIn size={20} />
                <span>Enter Dashboard</span>
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-medium">
          Authorized Access Only
        </p>
      </motion.div>
    </div>
  );
}
