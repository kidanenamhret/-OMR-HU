import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Save, ChevronLeft, Info, Cross } from 'lucide-react';
import API_BASE_URL from '../api';

const MemberForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    universityId: '',
    department: '',
    yearOfStudy: 1,
    phone: '',
    baptismalName: '',
    homeParish: '',
    denomination: 'Orthodox',
    status: 'Active',
    fastingCommitment: 'Not yet',
    interests: [],
    notes: ''
  });

  useEffect(() => {
    if (id) {
      const fetchMember = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/members/${id}`);
          setFormData(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchMember();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (interest) => {
    setFormData(prev => {
      const newInterests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: newInterests };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await axios.put(`${API_BASE_URL}/members/${id}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/members`, formData);
      }
      navigate('/members');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error saving member');
    } finally {
      setLoading(false);
    }
  };

  const interestOptions = ['Bible study', 'Choir', 'Liturgy service', 'Sunday school', 'Charity'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-zinc-400" />
        </button>
        <h1 className="text-3xl font-bold text-white">{id ? 'Edit Member' : 'New Member Registration'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6 text-orthodox-gold">
            <Info className="w-5 h-5" />
            <h3 className="font-bold text-lg">Academic & Personal Info</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-field">Full Name (Legal)</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label-field">University ID</label>
              <input type="text" name="universityId" value={formData.universityId} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label-field">Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label-field">Year of Study</label>
              <select name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange} className="input-field">
                {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num}>Year {num}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label-field">Academic Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                <option value="Active">Active Student</option>
                <option value="Graduated">Graduated</option>
                <option value="Transferred">Transferred</option>
                <option value="Left">Left Campus</option>
              </select>
            </div>
            <div>
              <label className="label-field">Fellowship Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="input-field">
                <option value="Member">Regular Member</option>
                <option value="Leader">Fellowship Leader</option>
                <option value="Prayer Coordinator">Prayer Coordinator</option>
                <option value="Committee">Committee Member</option>
              </select>
            </div>
          </div>
        </div>

        {/* Spiritual Context */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6 text-orthodox-gold">
            <Cross className="w-5 h-5" />
            <h3 className="font-bold text-lg">Spiritual Profile</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-field">Baptismal Name</label>
              <input type="text" name="baptismalName" value={formData.baptismalName} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label-field">Home Parish</label>
              <input type="text" name="homeParish" value={formData.homeParish} onChange={handleChange} className="input-field" placeholder="Parish name/location" />
            </div>
            <div>
              <label className="label-field">Denomination (Contextual)</label>
              <select name="denomination" value={formData.denomination} onChange={handleChange} className="input-field">
                <option value="Orthodox">Ethiopian Orthodox Tewahedo</option>
                <option value="Other">Other Christian</option>
                <option value="Not specified">Not specified</option>
              </select>
            </div>
            <div>
              <label className="label-field">Fasting Commitment</label>
              <select name="fastingCommitment" value={formData.fastingCommitment} onChange={handleChange} className="input-field">
                <option value="Observes all fasts">Observes all fasts</option>
                <option value="Partial">Partial</option>
                <option value="Not yet">Not yet</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="label-field mb-3">Interested In (Select Multiple)</label>
            <div className="flex flex-wrap gap-3">
              {interestOptions.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleInterestChange(option)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    formData.interests.includes(option)
                      ? 'bg-orthodox-burgundy border-orthodox-gold text-white shadow-lg'
                      : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate('/members')} className="px-6 py-2 text-zinc-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : (id ? 'Update Member' : 'Register Member')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;
