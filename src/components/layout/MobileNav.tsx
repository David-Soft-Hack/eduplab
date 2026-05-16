import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileText, Calendar, Users, CheckSquare } from 'lucide-react';
import { cn } from '../../lib/utils';

const MobileNav: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Módulos', path: '/modules' },
    { icon: FileText, label: 'Bitácoras', path: '/bitacoras' },
    { icon: Calendar, label: 'Agenda', path: '/calendar' },
    { icon: Users, label: 'Alumnos', path: '/students' },
    { icon: CheckSquare, label: 'Asist.', path: '/attendance' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-3 z-40 flex justify-between items-center safe-area-bottom">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-all duration-300",
            isActive ? "text-academic-600" : "text-slate-400"
          )}
        >
          <div className={cn(
            "p-1.5 rounded-xl transition-all duration-300",
            "group-active:scale-95",
            // Use a background indicator for active state if preferred
          )}>
            <item.icon size={26} strokeWidth={2.2} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default MobileNav;
