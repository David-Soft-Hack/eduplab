import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileText, Award } from 'lucide-react';
import { cn } from '../../lib/utils';

const MobileNav: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Módulos', path: '/modules' },
    { icon: FileText, label: 'Bitácoras', path: '/bitacoras' },
    { icon: Award, label: 'Programas', path: '/programs' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-2 py-1.5 z-40 grid grid-cols-4 justify-items-center items-center shadow-lg safe-bottom">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1.5 transition-all duration-300 w-full text-center py-1",
            isActive ? "text-academic-600 scale-105" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <div className={cn(
            "p-1 rounded-lg transition-all duration-300",
            "active:scale-95"
          )}>
            <item.icon size={18} strokeWidth={2.4} />
          </div>
          <span className="text-[8px] font-black uppercase tracking-wider block truncate w-full">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default MobileNav;
