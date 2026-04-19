import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../api';
import { Lock, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/reset-password/${token}`, { password });
      setMessage(res.data.msg);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 min-h-screen flex items-center justify-center p-4 bg-orthodox-dark overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orthodox-burgundy/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orthodox-gold/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-orthodox-gold/20 shadow-2xl p-8 relative z-10 animate-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-orthodox-cream mb-2">New Password</h2>
          <p className="text-zinc-500 text-sm">Secure your administrative access</p>
        </div>

        {message ? (
          <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-orthodox-cream font-medium mb-4">{message}</p>
            <p className="text-zinc-500 text-xs italic">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-orthodox-gold/80 ml-1">New Password</label>
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

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-orthodox-gold/80 ml-1">Confirm Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orthodox-gold transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  className="w-full bg-orthodox-dark/50 border border-zinc-800 rounded-2xl px-12 py-4 focus:outline-none focus:border-orthodox-gold transition-all text-white placeholder:text-zinc-700 shadow-inner" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs justify-center animate-in shake duration-300">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orthodox-burgundy hover:bg-red-900 text-orthodox-cream py-4 rounded-2xl font-bold mt-4 flex justify-center items-center gap-2 group transition-all active:scale-[0.98] shadow-xl shadow-orthodox-burgundy/10 disabled:opacity-50"
            >
              {loading ? (
                <span>Resetting...</span>
              ) : (
                <>
                  <span>Update Password</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
