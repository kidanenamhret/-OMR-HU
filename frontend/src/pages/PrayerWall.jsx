import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Heart, Send, Ghost, User, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api';

const PrayerWall = () => {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Spiritual',
    isAnonymous: false,
    memberId: '' // In real app, this would be the logged-in member's ID
  });

  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchPrayers();
    fetchMembers();
  }, []);

  const fetchPrayers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/prayers`);
      setPrayers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/members`);
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/prayers`, formData);
      setShowModal(false);
      setFormData({ title: '', content: '', category: 'Spiritual', isAnonymous: false, memberId: '' });
      fetchPrayers();
    } catch (err) {
      alert('Failed to post prayer request');
    }
  };

  const handleReply = async (id, content) => {
    if (!content.trim()) return;
    try {
      await axios.post(`${API_BASE_URL}/prayers/${id}/reply`, { content: 'Amen 🙏' });
      fetchPrayers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Prayer Wall</h1>
          <p className="text-zinc-400">Share burdens and support one another in spirit.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Request Prayer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prayers.map((prayer) => (
          <div key={prayer._id} className="card flex flex-col justify-between border-l-4 border-l-orthodox-gold">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="px-2 py-1 bg-zinc-800 text-orthodox-gold text-[10px] rounded uppercase tracking-widest font-bold">
                  {prayer.category}
                </span>
                <span className="text-[10px] text-zinc-600">
                  {new Date(prayer.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{prayer.title}</h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-4 italic">
                "{prayer.content}"
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                {prayer.isAnonymous ? (
                  <div className="flex items-center gap-1 text-zinc-500 text-xs">
                    <Ghost className="w-3 h-3" /> Anonymous
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-orthodox-gold text-xs font-medium">
                    <User className="w-3 h-3" /> {prayer.memberId?.baptismalName || 'Member'}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleReply(prayer._id, 'Amen')}
                  className="flex items-center gap-1 text-zinc-500 hover:text-red-400 transition-colors text-xs"
                >
                  <Heart className="w-4 h-4" /> {prayer.replies.length} Support
                </button>
              </div>
            </div>
          </div>
        ))}
        {prayers.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-zinc-500 italic">
            The prayer wall is currently quiet. Be the first to share a request.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-lg animate-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-6 text-white">Share Prayer Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-field">Requesting Member</label>
                <select 
                  className="input-field"
                  value={formData.memberId}
                  onChange={(e) => setFormData({...formData, memberId: e.target.value})}
                  required
                >
                  <option value="">Select Member</option>
                  {members.map(m => <option key={m._id} value={m._id}>{m.fullName} ({m.baptismalName})</option>)}
                </select>
              </div>
              <div>
                <label className="label-field">Title</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Strength for Exams"
                  required
                />
              </div>
              <div>
                <label className="label-field">Requests Details</label>
                <textarea 
                  className="input-field min-h-[100px]" 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Tell us what we can pray for..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Category</label>
                  <select 
                    className="input-field"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Spiritual">Spiritual</option>
                    <option value="Health">Health</option>
                    <option value="Academic">Academic</option>
                    <option value="Family">Family</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <input 
                    type="checkbox" 
                    id="anonymous"
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
                    className="w-4 h-4 bg-zinc-900 border-zinc-800 rounded checked:bg-orthodox-gold"
                  />
                  <label htmlFor="anonymous" className="text-zinc-400 text-sm cursor-pointer select-none">Post Anonymously</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-zinc-500 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Post to Wall
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrayerWall;
