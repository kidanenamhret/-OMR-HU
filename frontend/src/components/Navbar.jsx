import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, UserPlus, LogOut, MessageSquare, Calendar, Heart, Settings as SettingsIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-orthodox-burgundy text-white shadow-2xl border-b border-orthodox-gold/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-orthodox-gold p-0.5 rounded-full overflow-hidden w-9 h-9 flex items-center justify-center">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-wide">
                የኦርቶዶክስ ተዋህዶ ተማሪዎች <span className="text-orthodox-gold hidden md:inline ml-2">| OMR HU</span>
              </span>
              <span className="text-[10px] text-orthodox-gold/70 font-medium uppercase tracking-[0.2em]">Hawassa University Fellowship</span>
            </div>
          </div>

          <div className="flex items-center space-x-1 md:space-x-4">
            {user ? (
              <>
                <Link to="/" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link to="/members" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Members</span>
                </Link>
                <Link to="/prayers" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Prayer Wall</span>
                </Link>
                <Link to="/events" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Events</span>
                </Link>
                <Link to="/mentorship" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Mentorship</span>
                </Link>
                <Link to="/settings" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
                  <SettingsIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>
                <Link to="/add-member" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Register</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-red-200 hover:bg-red-900/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 border border-orthodox-gold text-orthodox-gold rounded-lg hover:bg-orthodox-gold hover:text-black transition-all">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
