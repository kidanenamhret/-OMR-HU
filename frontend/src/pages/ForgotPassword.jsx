import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';
import { Mail, ChevronLeft, Send, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { username: email });
      setMessage(res.data.msg);
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
        <Link to="/login" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-orthodox-gold/60 hover:text-orthodox-gold mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Login
        </Link>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-orthodox-cream mb-2">Reset Password</h2>
          <p className="text-zinc-500 text-sm">We'll send a recovery link to your Gmail</p>
        </div>

        {message ? (
          <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-orthodox-cream font-medium mb-2">Check your email!</p>
            <p className="text-zinc-400 text-sm">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-orthodox-gold/80 ml-1">Admin Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orthodox-gold transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  className="w-full bg-orthodox-dark/50 border border-zinc-800 rounded-2xl px-12 py-4 focus:outline-none focus:border-orthodox-gold transition-all text-white placeholder:text-zinc-700 shadow-inner" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orthodox-burgundy hover:bg-red-900 text-orthodox-cream py-4 rounded-2xl font-bold mt-4 flex justify-center items-center gap-2 group transition-all active:scale-[0.98] shadow-xl shadow-orthodox-burgundy/10 disabled:opacity-50"
            >
              {loading ? (
                <span>Sending link...</span>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
