import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Search,
  Bell,
  FileText,
  Calendar as CalendarIcon,
  Play,
  X,
  Award,
  Calendar,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { format, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const { modules, bitacoras, teachers } = useAppContext();
  const navigate = useNavigate();
  const today = new Date();

  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  const [selectedAgendaBitacora, setSelectedAgendaBitacora] = useState<any>(null);
  const [showAgendaModal, setShowAgendaModal] = useState(false);

  const data = [
    { name: 'Sem 1', avance: 20 },
    { name: 'Sem 2', avance: 38 },
    { name: 'Sem 3', avance: 52 },
    { name: 'Sem 4', avance: 48 },
    { name: 'Sem 5', avance: 78 },
    { name: 'Sem 6', avance: 94 },
  ];

  const stats = [
    { label: 'Módulos', value: modules.length, icon: BookOpen, color: 'bg-indigo-600', trend: 'Activos' },
    { label: 'Bitácoras', value: bitacoras.length, icon: FileText, color: 'bg-emerald-600', trend: 'Configuradas' },
    { label: 'Docentes', value: teachers.length, icon: Users, color: 'bg-blue-600', trend: 'Registrados' },
    { label: 'Horas Totales', value: modules.reduce((acc, m) => acc + (m.totalHoraAcademic || 0), 0), icon: Clock, color: 'bg-amber-600', trend: 'Académicas' },
  ];

  // Find sessions for today
  const todaysSessions = useMemo(() => {
    const sessions: any[] = [];
    bitacoras.forEach(b => {
      if (b.calendar && b.estado === 'Activo') {
        const sessionToday = b.calendar.find((s: any) => isSameDay(parseISO(s.fecha), today));
        if (sessionToday) {
          sessions.push({
            ...sessionToday,
            bitacoraId: b.id,
            moduloNombre: b.moduloNombre,
            grupo: b.grupo,
            carrera: b.carrera,
            estado: b.estado,
            turno: b.turno
          });
        }
      }
    });
    return sessions;
  }, [bitacoras, today]);

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500 pb-16 px-1 sm:px-0">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <span className="px-2 py-0.5 text-[8px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full tracking-widest uppercase inline-flex items-center gap-1 mb-1">
            <Sparkles size={9} /> Consola General
          </span>
          <h1 className="text-xl sm:text-2xl font-display font-black text-slate-800 tracking-tight leading-none">
            Inicio Académico
          </h1>
          <p className="text-slate-400 text-[10px] sm:text-xs font-semibold capitalize mt-1 flex items-center gap-1">
            <CalendarIcon size={12} className="text-slate-400 shrink-0" />
            {format(today, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
          </p>
        </div>
        
        {/* Actions Row */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="relative group flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={13} />
            <input 
              type="text" 
              placeholder="Buscar contenido..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:bg-white transition-all text-xs font-semibold placeholder-slate-400"
            />
          </div>
          <button className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-slate-500 transition-all relative shrink-0">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
          </button>
        </div>
      </header>
      


      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.04 }}
            className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-100.5 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300 relative group shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
          >
            <div className="flex items-center justify-between mb-3.5">
              <div className={cn("p-2 sm:p-2.5 rounded-xl text-white transition-all duration-350 group-hover:scale-105", stat.color)}>
                <stat.icon size={16} />
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 text-[8px] font-black text-slate-450 uppercase tracking-widest rounded-full border border-slate-100">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </div>
            </div>
            <h3 className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{stat.label}</h3>
            <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
              <span className="text-xl sm:text-2xl font-display font-black text-slate-800 tracking-tight leading-none">{stat.value}</span>
              <span className="text-[8px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase font-mono tracking-tighter">{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
        
        {/* Active Sessions Classes (Takes 2 cols on Desktop) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-display font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                Sesiones de Hoy
              </h2>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-[8px] font-black uppercase tracking-wider animate-pulse">
                En vivo
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-400">{todaysSessions.length} programados</span>
          </div>

          <div className="grid gap-3.5">
            {todaysSessions.length > 0 ? (
              todaysSessions.map((session, idx) => (
                <motion.div
                  key={`${session.bitacoraId}-${session.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-4 md:items-center hover:border-slate-200 transition-all duration-200 relative overflow-hidden group border-l-[4px] border-l-indigo-600 shadow-sm"
                >
                  <div className="flex-1 relative z-10 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-wider border border-indigo-100/50">
                        {session.grupo}
                      </span>
                      <span className="text-slate-300 text-[10px] font-light">|</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest max-w-[140px] truncate">
                        {session.carrera}
                      </span>
                      <div className="ml-auto flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[8px] font-black uppercase tracking-widest leading-none border border-slate-150 shadow-sm">
                        <Clock size={10} className="text-slate-400" />
                        {session.turno}
                      </div>
                    </div>
                    
                    <h3 className="text-base sm:text-lg font-display font-black text-slate-800 leading-snug tracking-tight">
                      {session.moduloNombre}
                    </h3>
                    
                    <div className="space-y-2 pt-1 border-t border-slate-50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contenido del día:</p>
                      <div className="flex flex-wrap gap-2">
                        {session.actividades.map((act: any) => (
                          <div key={act.id} className="flex items-center gap-2 px-3 py-1 bg-slate-50/80 border border-slate-100 rounded-xl hover:bg-slate-100 transition-colors">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm shrink-0" />
                            <span className="text-[11px] font-semibold text-slate-600 leading-tight block truncate max-w-[200px] sm:max-w-none">
                              {act.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Dynamic side action block */}
                  <div className="flex flex-row md:flex-col items-center justify-between md:items-end gap-3 shrink-0 relative mt-3 md:mt-0 pt-3 md:pt-0 border-t border-slate-50 md:border-t-0 z-10 w-full md:w-auto">
                    <div className="text-left md:text-right">
                      <div className="flex items-center gap-1 md:justify-end text-indigo-600 font-display font-black text-xl italic leading-none">
                        {session.horas}
                        <span className="text-[9px] uppercase not-italic font-sans text-slate-400 font-bold ml-1">h / ha</span>
                      </div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Carga del Día</p>
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedSession(session);
                        setShowSessionModal(true);
                      }}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest gap-1.5 shadow-sm shadow-indigo-600/10 shrink-0 w-auto md:w-full"
                    >
                      <Play size={10} fill="currentColor" />
                      Empezar
                    </button>
                  </div>
                  
                  {/* Subtle design vector layout */}
                  <div className="absolute top-0 right-0 p-8 opacity-[0.015] pointer-events-none group-hover:scale-105 transition-transform duration-700">
                    <BookOpen size={160} />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl py-12 flex flex-col items-center justify-center text-center p-5">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-350 mb-3 border border-slate-100">
                  <CalendarIcon size={20} />
                </div>
                <h3 className="text-xs font-bold text-slate-700">No hay encuentros programados para hoy</h3>
                <p className="text-slate-400 mt-1 max-w-xs text-[10px] leading-relaxed font-semibold">
                  Relájate o aprovecha para actualizar la planificación semanal de bitácoras.
                </p>
                <button 
                  onClick={() => navigate('/bitacoras')}
                  className="mt-4 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-[10px] uppercase tracking-wider text-slate-650 hover:bg-slate-50 transition-all shadow-sm"
                >
                  Ver mi horario semanal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Status & Next (Takes 1 col) */}
        <div className="space-y-4 md:space-y-6">
          
          {/* Progress Area Chart Card (Highly polished) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Reporte de Avance</span>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">Progreso Semanal</h3>
              </div>
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                +15% Completo
              </span>
            </div>
            
            <div className="h-28 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAvance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '9px', padding: '6px' }}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="avance" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAvance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Agenda Académica Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Agenda Académica</h2>
            
            <div className="space-y-2.5">
              {bitacoras
                .filter(b => b.estado === 'Activo')
                .slice(0, 3)
                .map((bit, idx) => (
                <div 
                  key={`${bit.id}-${idx}`} 
                  onClick={() => {
                    setSelectedAgendaBitacora(bit);
                    setShowAgendaModal(true);
                  }}
                  className="flex gap-3 p-3 rounded-xl bg-slate-50/55 hover:bg-indigo-50/40 transition-colors cursor-pointer group border border-slate-100"
                >
                  <div className="w-10 h-10 rounded-lg bg-white flex flex-col items-center justify-center border border-slate-100 shadow-sm shrink-0 group-hover:bg-indigo-600 transition-all">
                    <span className="text-[8px] font-black text-slate-400 group-hover:text-white/75 uppercase leading-none">MAY</span>
                    <span className="text-base font-display font-black text-indigo-700 group-hover:text-white leading-none mt-0.5">{15 + idx}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-[#111827] text-xs leading-snug truncate group-hover:text-indigo-650 transition-colors">
                      {bit.moduloNombre}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5 mt-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[100px] block">
                        {bit.carrera}
                      </span>
                      <span className="text-slate-300 text-[10px] font-light">•</span>
                      <span className="text-[8px] font-extrabold text-indigo-600 uppercase font-mono tracking-tighter">
                        {bit.turno}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => navigate('/bitacoras')}
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors group"
            >
              Ver Calendario Completo
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Quick Gradient Resumen Info */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-4 sm:p-5 rounded-2xl shadow-md text-white overflow-hidden relative group">
            <div className="relative z-10 space-y-1.5">
              <TrendingUp size={36} className="text-white/20 mb-2 group-hover:scale-105 transition-transform" />
              <h3 className="text-sm font-black uppercase tracking-tight">Estatus Metodológico</h3>
              <p className="text-white/70 text-[11px] leading-relaxed max-w-[200px]">
                Has completado la revisión del 84% de las planificaciones y bitácoras para esta semana.
              </p>
              <div className="flex items-center gap-1.5 font-black text-xl pt-1">
                24 / 28
                <span className="text-[8px] font-black uppercase text-white/75 bg-white/10 px-1.5 py-0.5 rounded">Módulos Conformes</span>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
          </div>

        </div>
      </div>

      {/* Session Detail Modal (Responsive and Scrollable inside Viewport) */}
      <AnimatePresence>
        {showSessionModal && selectedSession && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSessionModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] focus:outline-none"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-50 flex items-center justify-between bg-indigo-600 text-white shrink-0">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[8px] font-black uppercase tracking-widest text-indigo-100 bg-white/15 px-1.5 py-0.5 rounded">
                      {selectedSession.grupo}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-indigo-100">
                      {selectedSession.carrera}
                    </span>
                    <span className="text-indigo-300 select-none">•</span>
                    <span className="text-[8px] font-black text-white bg-white/15 px-1.5 py-0.5 rounded uppercase">
                      {selectedSession.turno}
                    </span>
                  </div>
                  <h2 className="text-base font-black text-white uppercase tracking-tight mt-1.5">Encuentro de Hoy</h2>
                </div>
                <button 
                  onClick={() => setShowSessionModal(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body (Scrollable inside overlay popup) */}
              <div className="p-4 sm:p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1 pb-16 sm:pb-5">
                <div>
                  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Módulo Formativo</h3>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <h4 className="font-extrabold text-slate-850 text-sm leading-tight">{selectedSession.moduloNombre}</h4>
                    <p className="text-slate-450 mt-1 text-[10px] font-semibold">{selectedSession.carrera}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Actividades Programadas</h3>
                  <div className="space-y-2">
                    {selectedSession.actividades.map((act: any) => (
                      <div key={act.id} className="p-3 bg-white border border-slate-100 rounded-xl flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center font-black text-[10px] shrink-0 border border-indigo-100">
                          UD{act.unitId}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-extrabold text-slate-750 text-xs leading-tight">{act.desc}</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Clock size={10} className="text-slate-400" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase">{act.hoursInSession} Horas Académicas</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex gap-2 w-full shrink-0">
                  <button 
                    onClick={() => {
                      setShowSessionModal(false);
                      navigate('/bitacoras');
                    }}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    Ver Horas
                  </button>
                  <button 
                    onClick={() => setShowSessionModal(false)}
                    className="flex-[2] py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md shadow-indigo-600/10 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={13} />
                    Confirmar Inicio
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Agenda/Course Detail Modal (Scroll safety on tiny screens) */}
      <AnimatePresence>
        {showAgendaModal && selectedAgendaBitacora && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAgendaModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] focus:outline-none"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-50 flex items-center justify-between bg-slate-800 text-white shrink-0">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-300 bg-white/10 px-1.5 py-0.5 rounded">
                      {selectedAgendaBitacora.grupo}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">
                      {selectedAgendaBitacora.carrera}
                    </span>
                    <span className="text-slate-500 select-none">•</span>
                    <span className="text-[8px] font-black text-white bg-white/10 px-1.5 py-0.5 rounded uppercase">
                      {selectedAgendaBitacora.turno}
                    </span>
                  </div>
                  <h2 className="text-base font-black text-white uppercase tracking-tight mt-1.5">Detalle del Curso</h2>
                </div>
                <button 
                  onClick={() => setShowAgendaModal(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1 pb-16 sm:pb-5">
                <div>
                  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Módulo Formativo</h3>
                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="text-[9px] font-mono text-indigo-600 font-bold mb-0.5">{selectedAgendaBitacora.moduloId}</p>
                    <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{selectedAgendaBitacora.moduloNombre}</h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                      <Clock size={10} /> Horario
                    </p>
                    <div className="flex flex-wrap gap-1">
                       {selectedAgendaBitacora.horario?.dias.map((d: string) => (
                         <span key={d} className="px-1.5 py-0.5 bg-white border border-slate-100 rounded text-[8px] font-extrabold text-slate-500">{d}</span>
                       ))}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                      <TrendingUp size={10} /> Progreso
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full" 
                          style={{ width: `${selectedAgendaBitacora.progreso}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-extrabold text-slate-600">{selectedAgendaBitacora.progreso}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Programa de Actividades</h3>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                    {modules.find(m => m.codModule === selectedAgendaBitacora.moduloId)?.activities?.map((act: any) => (
                      <div key={act.id} className="p-2.5 bg-slate-50/80 border border-slate-100 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-700 flex items-center justify-center text-[9px] font-black shrink-0 border border-indigo-100">
                            U{act.unitId}
                          </div>
                          <span className="text-xs font-bold text-slate-600 truncate">{act.desc}</span>
                        </div>
                        <span className="text-[9px] font-black text-slate-400 shrink-0 uppercase">{act.ha}h</span>
                      </div>
                    )) || (
                      <p className="text-[10px] text-slate-400 italic">No hay actividades de planeación registradas.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Unidad Temática</h3>
                  <div className="flex items-center gap-2.5 p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                      <FileText size={15} />
                    </div>
                    <p className="text-[11px] font-bold text-indigo-950 leading-tight">
                      {selectedAgendaBitacora.actual || "Planeación general estandarizada"}
                    </p>
                  </div>
                </div>

                <div className="pt-2 shrink-0">
                  <button 
                    onClick={() => {
                      setShowAgendaModal(false);
                      navigate('/bitacoras');
                    }}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10"
                  >
                    Ver Bitácora Académica
                    <ArrowRight size={13} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
