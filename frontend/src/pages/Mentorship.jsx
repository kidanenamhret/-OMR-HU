import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCheck, Heart, Users, Star, ArrowRight, Shield } from 'lucide-react';

const Mentorship = () => {
  const [pairs, setPairs] = useState([]);
  const [eligible, setEligible] = useState({ mentors: [], mentees: [] });
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState({ mentorId: '', menteeId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resPairs, resEligible] = await Promise.all([
        axios.get('http://localhost:5000/api/mentorship'),
        axios.get('http://localhost:5000/api/mentorship/eligible')
      ]);
      setPairs(resPairs.data);
      setEligible(resEligible.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePairing = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/members/${selection.menteeId}`, { mentor: selection.mentorId });
      setSelection({ mentorId: '', menteeId: '' });
      fetchData();
    } catch (err) {
      alert('Pairing failed');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white">Spiritual Mentorship</h1>
        <p className="text-zinc-400">Pairing senior students and alumni with freshers for guidance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pairing Tool */}
        <div className="card lg:col-span-1 border-orthodox-gold/30 h-fit">
          <div className="flex items-center gap-2 mb-6 text-orthodox-gold font-bold uppercase tracking-widest text-xs">
            <Heart className="w-4 h-4" /> New Pairing
          </div>
          <form onSubmit={handlePairing} className="space-y-6">
            <div>
              <label className="label-field">Select Mentor (Senior/Alumni)</label>
              <select 
                className="input-field"
                value={selection.mentorId}
                onChange={(e) => setSelection({...selection, mentorId: e.target.value})}
                required
              >
                <option value="">-- Choose Mentor --</option>
                {eligible.mentors.map(m => (
                  <option key={m._id} value={m._id}>{m.fullName} ({m.baptismalName}) - {m.status}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-center py-2">
              <ArrowRight className="w-6 h-6 text-orthodox-gold rotate-90 lg:rotate-0" />
            </div>

            <div>
              <label className="label-field">Select Mentee (Freshmen)</label>
              <select 
                className="input-field"
                value={selection.menteeId}
                onChange={(e) => setSelection({...selection, menteeId: e.target.value})}
                required
              >
                <option value="">-- Choose Mentee --</option>
                {eligible.mentees.map(m => (
                  <option key={m._id} value={m._id}>{m.fullName} ({m.baptismalName}) - Yr {m.yearOfStudy}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="w-full btn-primary py-3">
              Establish Mentorship
            </button>
          </form>
        </div>

        {/* Established Pairs */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-orthodox-gold mb-6 mt-2">Active Mentorship Bonds</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pairs.map((pair) => (
              <div key={pair._id} className="card bg-orthodox-burgundy/5 border-orthodox-gold/10 flex items-center justify-between group">
                <div className="flex flex-col">
                  <span className="text-[10px] text-orthodox-gold uppercase tracking-[0.2em] font-bold mb-1">Mentor</span>
                  <p className="text-white font-bold">{pair.mentor?.fullName}</p>
                  <p className="text-[10px] text-zinc-500 italic">{pair.mentor?.baptismalName}</p>
                </div>
                <div className="px-4 opacity-30 group-hover:opacity-100 transition-opacity">
                   <Users className="w-5 h-5 text-orthodox-gold" />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-1">Mentee</span>
                  <p className="text-white font-bold">{pair.fullName}</p>
                  <p className="text-[10px] text-zinc-500 italic">{pair.baptismalName}</p>
                </div>
              </div>
            ))}
            {pairs.length === 0 && (
              <div className="col-span-full py-12 text-center text-zinc-600 border border-dashed border-zinc-800 rounded-xl">
                 <Star className="w-12 h-12 mx-auto mb-4 opacity-10" />
                 <p>No formal mentorship bonds established yet.</p>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-orthodox-dark border border-orthodox-gold/20 rounded-xl">
            <div className="flex items-center gap-2 text-orthodox-gold mb-2">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Purpose of Mentorship</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed italic">
              "This spiritual bond ensures that new students find wisdom and support through their elder brothers and sisters in Christ, matching academic experience with spiritual maturity."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentorship;
