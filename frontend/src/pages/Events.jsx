import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Users, Plus, CheckCircle, Circle, MapPin } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Liturgy',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchEvents();
    fetchMembers();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/members');
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/events', formData);
      setShowModal(false);
      setFormData({ title: '', description: '', type: 'Liturgy', date: new Date().toISOString().split('T')[0] });
      fetchEvents();
    } catch (err) {
      alert('Failed to create event');
    }
  };

  const toggleAttendance = async (eventId, memberId) => {
    try {
      await axios.put(`http://localhost:5000/api/events/${eventId}/attend`, { memberId });
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Event Tracker</h1>
          <p className="text-zinc-400">Manage attendance for Liturgy, Bible study, and fellowship.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Events List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xl font-bold text-orthodox-gold mb-4">Upcoming & Past Events</h3>
          {events.map((event) => (
            <div 
              key={event._id}
              onClick={() => setSelectedEvent(event)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedEvent?._id === event._id 
                  ? 'bg-orthodox-burgundy/20 border-orthodox-gold shadow-lg shadow-orthodox-gold/10' 
                  : 'card hover:border-orthodox-gold/30'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] px-2 py-0.5 bg-zinc-800 rounded text-zinc-400 uppercase font-bold">
                  {event.type}
                </span>
                <span className="text-xs text-zinc-500">
                  {new Date(event.date).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-bold text-white mb-1">{event.title}</h4>
              <p className="text-xs text-zinc-500 line-clamp-1">{event.description}</p>
              <div className="mt-3 flex items-center gap-1 text-[10px] text-orthodox-gold font-medium">
                <Users className="w-3 h-3" /> {event.attendees.length} Attended
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="text-center py-8 text-zinc-600 italic text-sm">No events recorded yet.</div>
          )}
        </div>

        {/* Attendance Portal */}
        <div className="lg:col-span-2">
          {selectedEvent ? (
            <div className="card space-y-6">
              <div className="flex justify-between items-start border-b border-zinc-800 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedEvent.title}</h2>
                  <p className="text-zinc-400 mt-1">{selectedEvent.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(selectedEvent.date).toDateString()}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> HU Campus</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-orthodox-gold">{selectedEvent.attendees.length}</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Attendees</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-zinc-500 uppercase tracking-widest mb-4">Mark Attendance</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {members.map((member) => {
                    const isAttending = selectedEvent.attendees.includes(member._id);
                    return (
                      <button
                        key={member._id}
                        onClick={() => toggleAttendance(selectedEvent._id, member._id)}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                          isAttending 
                            ? 'bg-emerald-900/10 border-emerald-500 text-emerald-400' 
                            : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                        }`}
                      >
                        <div className="text-left">
                          <div className="text-xs font-bold leading-tight truncate w-24">{member.fullName}</div>
                          <div className="text-[10px] opacity-70 italic">{member.baptismalName}</div>
                        </div>
                        {isAttending ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center card text-zinc-600 border-dashed">
              <Calendar className="w-12 h-12 mb-4 opacity-20" />
              <p>Select an event to manage attendance</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6 text-white">Create New Event</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-field">Event Title</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Weekly Holy Liturgy"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Type</label>
                  <select 
                    className="input-field"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Liturgy">Holy Liturgy</option>
                    <option value="Bible study">Bible Study</option>
                    <option value="Fellowship">Fellowship</option>
                    <option value="Charity">Charity</option>
                    <option value="Meeting">Committe Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="label-field">Date</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label-field">Description</label>
                <textarea 
                  className="input-field min-h-[80px]" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief details about the event..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-zinc-500">Cancel</button>
                <button type="submit" className="btn-primary">Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
