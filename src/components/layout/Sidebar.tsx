import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Calendar, 
  Users,
  Settings, 
  LogOut,
  GraduationCap
} from 'lucide-react';
import { cn } from '../../lib/utils';

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Inicio', path: '/' },
    { icon: BookOpen, label: 'Módulos', path: '/modules' },
    { icon: FileText, label: 'Bitácoras', path: '/bitacoras' },
    { icon: Calendar, label: 'Calendario', path: '/calendar' },
    { icon: Users, label: 'Estudiantes', path: '/students' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 fixed h-full z-10 transition-all duration-300">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-academic-600 rounded-xl shadow-lg shadow-academic-600/20">
            <GraduationCap className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold font-display text-slate-800">EduPlan</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group text-slate-500 font-medium",
              isActive 
                ? "bg-academic-50 text-academic-600 shadow-sm" 
                : "hover:bg-slate-50 hover:text-slate-800"
            )}
          >
            <item.icon size={22} className={cn("transition-colors")} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-50 space-y-2">
        <button className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all font-medium">
          <Settings size={22} />
          <span>Ajustes</span>
        </button>
        <button className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-medium">
          <LogOut size={22} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
