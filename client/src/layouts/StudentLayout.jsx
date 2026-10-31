import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserCheck, FileText, Briefcase, Clock, Calendar, LogOut } from 'lucide-react';

export const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Profile', path: '/student/profile', icon: UserCheck },
    { label: 'Resume', path: '/student/resume', icon: FileText },
    { label: 'Explore Jobs', path: '/student/jobs', icon: Briefcase },
    { label: 'My Applications', path: '/student/applications', icon: Clock },
    { label: 'Interviews', path: '/student/interviews', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-2.5 px-3 py-4 mb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
              CL
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">CampusLink</h2>
              <span className="text-[11px] font-medium text-brand-600">Student Portal</span>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <div className="px-3 py-2 mb-2">
            <div className="text-xs font-semibold text-slate-800 truncate">{user.name || 'Student'}</div>
            <div className="text-[11px] text-slate-400 truncate">{user.email || ''}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;

