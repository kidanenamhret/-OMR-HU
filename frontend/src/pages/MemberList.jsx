import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../api';
import { Search, Filter, Edit, Trash2, UserPlus, Phone, MapPin, FileUp, Loader2 } from 'lucide-react';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    yearOfStudy: ''
  });

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search: searchTerm, ...filters });
      const res = await axios.get(`${API_BASE_URL}/members?${params}`);
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setImporting(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/import`, formData);
      alert(`Import complete! Success: ${res.data.success}, Errors: ${res.data.errors}`);
      fetchMembers();
    } catch (err) {
      alert('Import failed. Ensure your Excel follows the template.');
    } finally {
      setImporting(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMembers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filters]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await axios.delete(`${API_BASE_URL}/members/${id}`);
        fetchMembers();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const departments = [...new Set(members.map(m => m.department))].filter(Boolean);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Member Registry</h1>
          <p className="text-zinc-400">Manage student records and succession data.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".xlsx, .xls, .csv"
            onChange={handleImport}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="btn-secondary flex-1 md:flex-none flex items-center justify-center gap-2"
          >
            {importing ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileUp className="w-5 h-5" />}
            Bulk Import
          </button>
          <Link to="/add-member" className="btn-primary flex-1 md:flex-none flex items-center justify-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add Member
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search by name, ID, or baptismal name..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <select 
            className="input-field pl-10"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Graduated">Graduated</option>
            <option value="Transferred">Transferred</option>
          </select>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <select 
            className="input-field pl-10"
            value={filters.yearOfStudy}
            onChange={(e) => setFilters({...filters, yearOfStudy: e.target.value})}
          >
            <option value="">All Years</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
            <option value="5">Year 5+</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-900 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Member Info</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Academic</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Spiritual</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {members.map((member) => (
                <tr key={member._id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orthodox-burgundy/20 flex items-center justify-center text-orthodox-gold font-bold">
                        {member.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium flex items-center gap-2">
                          {member.fullName}
                          {member.role !== 'Member' && (
                            <span className="text-[10px] bg-orthodox-gold/20 text-orthodox-gold px-1.5 py-0.5 rounded border border-orthodox-gold/30">
                              {member.role}
                            </span>
                          )}
                        </div>
                        <div className="text-zinc-500 text-xs flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {member.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-zinc-300">{member.department}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-zinc-800 py-0.5 px-2 rounded-full text-zinc-400">ID: {member.universityId}</span>
                      <span className={`text-[10px] py-0.5 px-2 rounded-full ${
                        member.status === 'Active' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-orange-900/30 text-orange-400'
                      }`}>Year {member.yearOfStudy}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-orthodox-gold font-medium flex items-center gap-1">
                      {member.baptismalName}
                    </div>
                    {member.homeParish && (
                      <div className="text-[10px] text-zinc-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {member.homeParish}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/edit-member/${member._id}`} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-orthodox-gold transition-all">
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button onClick={() => handleDelete(member._id)} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-red-400 transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {members.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-zinc-500 italic">
                    No members found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemberList;
