import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';
import { Users, GraduationCap, UserCheck, UserPlus, FileSpreadsheet, Quote, Calendar, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import * as XLSX from 'xlsx';
import { toEthiopian } from 'ethiopian-date';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="card flex items-center justify-between">
    <div>
      <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-bold mt-1 text-white">{value}</h3>
    </div>
    <div className={`p-3 rounded-full ${color} bg-opacity-10 text-opacity-100`}>
      <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [feasts, setFeasts] = useState([]);
  const [loading, setLoading] = useState(true);

  const scriptureVerses = [
    { text: "Be watchful, stand firm in the faith, act like men, be strong.", amharic: "ንቁ፥ በሃይማኖት ቁሙ፥ ጎልምሱ፥ ጠንክሩ።", ref: "1 Corinthians 16:13" },
    { text: "But you, brethren, do not grow weary in doing good.", amharic: "እናንተ ግን፥ ወንድሞች ሆይ፥ በጎ ሥራ በመሥራት አትታክቱ።", ref: "2 Thessalonians 3:13" },
    { text: "Pray without ceasing.", amharic: "ሳታቋርጡ ጸልዩ።", ref: "1 Thessalonians 5:17" },
    { text: "Bear one another's burdens, and so fulfill the law of Christ.", amharic: "ከእናንተ እያንዳንዱ የአንዱን ሸክም ይሸከም እንዲሁም የክርስቶስን ሕግ ፈጽሙ።", ref: "Galatians 6:2" }
  ];

  const dailyVerse = scriptureVerses[new Date().getDate() % scriptureVerses.length];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resStats, resFeasts] = await Promise.all([
          axios.get(`${API_BASE_URL}/stats`),
          axios.get(`${API_BASE_URL}/feasts`)
        ]);
        setStats(resStats.data);
        setFeasts(resFeasts.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const exportAll = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/members`);
      const ws = XLSX.utils.json_to_sheet(res.data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Members");
      XLSX.writeFile(wb, `Orthodox_Members_Export_${new Date().toLocaleDateString()}.xlsx`);
    } catch (err) {
      alert('Export failed');
    }
  };

  if (loading) return <div className="p-8 text-center text-orthodox-gold">Loading fellowship data...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Scripture Banner */}
      <div className="card border-l-4 border-orthodox-gold bg-orthodox-burgundy/10 !p-4 flex items-center gap-4">
        <div className="text-orthodox-gold opacity-50"><Quote className="w-8 h-8" /></div>
        <div>
          <p className="text-orthodox-gold text-lg font-amharic mb-1 leading-relaxed">
            "{dailyVerse.amharic}"
          </p>
          <p className="text-orthodox-cream font-medium italic text-sm">"{dailyVerse.text}"</p>
          <p className="text-orthodox-gold text-[10px] font-bold mt-2 uppercase tracking-widest">— {dailyVerse.ref}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-orthodox-cream">Fellowship Overview</h1>
            <div className="hidden md:block h-6 w-[1px] bg-zinc-800" />
            <div className="flex flex-col">
              <span className="text-orthodox-gold text-xs font-bold uppercase tracking-widest leading-none mb-1">Ethiopian Date</span>
              <span className="text-zinc-400 text-sm font-amharic">
                {(() => {
                  const now = new Date();
                  const et = toEthiopian(now.getFullYear(), now.getMonth() + 1, now.getDate());
                  const months = ["መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜን"];
                  return `${months[et[1]-1]} ${et[2]}, ${et[0]} ዓ.ም`;
                })()}
              </span>
            </div>
          </div>
          <p className="text-zinc-500 mt-1">Managing {stats?.totalActive} active Orthodox students on campus.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={exportAll} className="btn-secondary flex-1 md:flex-none flex items-center justify-center gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Members" value={stats?.totalActive} icon={UserCheck} color="bg-blue-500" />
        <StatCard title="New This Term" value={stats?.newMembers} icon={UserPlus} color="bg-emerald-500" />
        <StatCard title="Total Graduated" value={stats?.totalGraduated} icon={GraduationCap} color="bg-orthodox-gold" />
        <StatCard title="Current Freshers" value={stats?.freshers} icon={Users} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-xl font-bold mb-6 text-white border-b border-orthodox-gold/20 pb-2">Academic Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.deptDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #FFD700', borderRadius: '8px' }}
                  itemStyle={{ color: '#FFD700' }}
                />
                <Bar dataKey="value" fill="#800000" radius={[4, 4, 0, 0]}>
                  {stats?.deptDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#800000' : '#FFD700'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card flex flex-col justify-center space-y-4">
          <div className="p-4 bg-orthodox-burgundy/20 rounded-lg border border-orthodox-gold/30">
            <h4 className="font-bold text-orthodox-gold mb-2">Succession Tracker</h4>
            <p className="text-sm text-zinc-300">Tracking upcoming graduates to ensure smooth leadership transition. <strong>{stats?.totalGraduated}</strong> students have successfully moved to alumni status this year.</p>
          </div>
          <div className="card bg-orthodox-burgundy/10 border-orthodox-gold/30">
            <h4 className="font-bold text-orthodox-gold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Upcoming Feast Days
            </h4>
            <div className="space-y-3">
              {feasts?.slice(0, 3).map((feast, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs border-b border-zinc-800 pb-2 last:border-0">
                  <span className="text-orthodox-cream font-medium">{feast.name}</span>
                  <span className="text-zinc-500">{new Date(feast.date).toLocaleDateString()}</span>
                </div>
              ))}
              <div className="pt-2 text-[10px] text-zinc-500 italic">
                Dates according to the Ethiopian Orthodox Tewahedo Church calendar.
              </div>
            </div>
          </div>
          <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
            <h4 className="font-bold text-white mb-2">Privacy & Ethics Notice</h4>
            <p className="text-xs text-zinc-500 leading-relaxed italic">
              "This registry helps us care for our Orthodox brothers and sisters. No data is shared with university administration or external parties. Data is for pastoral care and fellowship support only."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
