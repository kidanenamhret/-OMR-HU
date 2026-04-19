import React, { useState } from 'react';
import axios from 'axios';
import { Send, Bell, Settings as SettingsIcon, Info, ShieldCheck } from 'lucide-react';

const Settings = () => {
  const [broadcast, setBroadcast] = useState({
    message: '',
    type: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      await axios.post(`${API_BASE_URL}/notifications/broadcast`, broadcast);
      setStatus('Success! Broadcast sent to Telegram group.');
      setBroadcast({ ...broadcast, message: '' });
    } catch (err) {
      setStatus('Failed: Ensure Bot Token and Chat ID are set in backend .env');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white">Fellowship Management</h1>
        <p className="text-zinc-400">Configure notifications and system settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Telegram Broadcast */}
        <div className="card border-orthodox-gold/20">
          <div className="flex items-center gap-2 mb-6 text-orthodox-gold font-bold uppercase tracking-widest text-xs">
            <Bell className="w-4 h-4" /> Telegram Broadcast
          </div>
          
          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="label-field">Message Type</label>
              <select 
                className="input-field"
                value={broadcast.type}
                onChange={(e) => setBroadcast({...broadcast, type: e.target.value})}
              >
                <option value="general">📢 General Announcement</option>
                <option value="prayer">🙏 Prayer Request</option>
                <option value="event">📅 Upcoming Event</option>
              </select>
            </div>
            
            <div>
              <label className="label-field">Message Content</label>
              <textarea 
                className="input-field min-h-[120px]"
                value={broadcast.message}
                onChange={(e) => setBroadcast({...broadcast, message: e.target.value})}
                placeholder="Type the message to send to the group..."
                required
              />
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2">
               <Send className="w-4 h-4" />
               {loading ? 'Sending...' : 'Broadcast to Group'}
            </button>
            {status && <p className={`text-[10px] text-center mt-2 ${status.startsWith('Success') ? 'text-emerald-400' : 'text-red-400'}`}>{status}</p>}
          </form>
        </div>

        {/* System Info */}
        <div className="space-y-6">
          <div className="card bg-orthodox-burgundy/5">
            <h4 className="font-bold text-orthodox-cream mb-4 flex items-center gap-2">
              <SettingsIcon className="w-4 h-4 text-orthodox-gold" /> Configuration Help
            </h4>
            <div className="space-y-4 text-sm text-zinc-400">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-orthodox-gold/10 text-orthodox-gold flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                <p>Create a bot via <strong>@BotFather</strong> on Telegram to get your <strong>Token</strong>.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-orthodox-gold/10 text-orthodox-gold flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                <p>Add the bot to your Fellowship Group and get the <strong>Chat ID</strong>.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-orthodox-gold/10 text-orthodox-gold flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                <p>Add these to your <code>backend/.env</code> file to enable instant alerts.</p>
              </div>
            </div>
          </div>

          <div className="card border-dashed border-zinc-800">
             <div className="flex items-center gap-2 text-zinc-500 mb-2">
               <Info className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">Admin Notice</span>
             </div>
             <p className="text-xs text-zinc-600 italic leading-relaxed">
               "This module bridges the physical fellowship with digital presence. Use broadcasts responsibly to encourage and support members."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
