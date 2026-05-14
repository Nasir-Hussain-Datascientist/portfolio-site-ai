import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email?.toLowerCase().endsWith('@gmail.com')) {
        setAuthorized(true);
      } else {
        if (user) console.warn('Unauthorized access attempt: non-gmail account');
        navigate('/admin/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin [border-radius:var(--radius-full)] h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
