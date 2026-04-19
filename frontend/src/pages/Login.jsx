import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, User, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.msg);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 min-h-screen flex items-center justify-center p-4 bg-orthodox-dark overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orthodox-burgundy/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orthodox-gold/10 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-orthodox-gold/20 shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-700">
        
        {/* Left Side: Visual Branding */}
        <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-orthodox-burgundy/10 border-r border-orthodox-gold/10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10 text-center space-y-8">
            <div className="w-48 h-48 mx-auto p-2 bg-orthodox-gold rounded-full shadow-2xl shadow-orthodox-gold/20 flex items-center justify-center overflow-hidden">
               <img src="/logo.jpg" alt="HU Orthodox Fellowship Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold text-orthodox-cream leading-tight">
                የኦርቶዶክስ ተዋህዶ ተማሪዎች <br/>
                <span className="text-orthodox-gold font-medium text-2xl tracking-widest uppercase">Member Registry</span>
              </h1>
              <div className="h-1 w-24 bg-orthodox-gold mx-auto rounded-full" />
              <div className="space-y-2">
                <p className="text-orthodox-gold text-lg font-amharic leading-tight px-4">
                  "እናንተ ግን፥ ወንድሞች ሆይ፥ በጎ ሥራ በመሥራት አትታክቱ።"
                </p>
                <p className="text-zinc-400 text-xs max-w-xs mx-auto italic">
                  "But you, brethren, do not grow weary in doing good." <br/>
                  <span className="text-orthodox-gold font-bold not-italic">— 2 Thessalonians 3:13</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden w-20 h-20 mx-auto mb-6 p-1 bg-orthodox-gold rounded-full shadow-lg">
               <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <h2 className="text-3xl font-bold text-orthodox-cream mb-2">Welcome Back</h2>
            <p className="text-zinc-500 text-sm">Fellowship Administrative Dashboard Access</p>
          </div>

          {error && (
            <div className="bg-red-900/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8 animate-in shake duration-300">
              <p className="text-xs font-medium uppercase tracking-wider mb-1">Authorization Failed</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-orthodox-gold/80 ml-1">Manager ID</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orthodox-gold transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  className="w-full bg-orthodox-dark/50 border border-zinc-800 rounded-2xl px-12 py-4 focus:outline-none focus:border-orthodox-gold transition-all text-white placeholder:text-zinc-700 shadow-inner" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-orthodox-gold/80 ml-1">Security Key</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orthodox-gold transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  className="w-full bg-orthodox-dark/50 border border-zinc-800 rounded-2xl px-12 py-4 focus:outline-none focus:border-orthodox-gold transition-all text-white placeholder:text-zinc-700 shadow-inner" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pr-2">
              <Link to="/forgot-password" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-orthodox-gold/60 hover:text-orthodox-gold transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orthodox-burgundy hover:bg-red-900 text-orthodox-cream py-4 rounded-2xl font-bold mt-4 flex justify-center items-center gap-2 group transition-all active:scale-[0.98] shadow-xl shadow-orthodox-burgundy/10 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">Verifying Protocol...</span>
              ) : (
                <>
                  <span>Initialize Access</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-zinc-800 text-center lg:text-left flex flex-col md:flex-row md:justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-orthodox-gold" />
              Secured for pastoral care only
            </div>
            <p className="text-[10px] text-zinc-600 italic">HU Orthodox Tewahedo Fellowship &copy; 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
