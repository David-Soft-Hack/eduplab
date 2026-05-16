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
  X
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
  const { modules, bitacoras, notifications, setNotifications } = useAppContext();
  const navigate = useNavigate();
  const today = new Date();

  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  const [selectedAgendaBitacora, setSelectedAgendaBitacora] = useState<any>(null);
  const [showAgendaModal, setShowAgendaModal] = useState(false);

  const data = [
    { name: 'Sem 1', avance: 20 },
    { name: 'Sem 2', avance: 35 },
    { name: 'Sem 3', avance: 55 },
    { name: 'Sem 4', avance: 45 },
    { name: 'Sem 5', avance: 75 },
    { name: 'Sem 6', avance: 90 },
  ];

  const stats = [
    { label: 'Módulos', value: modules.length, icon: BookOpen, color: 'bg-blue-500', trend: 'Activos' },
    { label: 'Bitácoras', value: bitacoras.length, icon: FileText, color: 'bg-emerald-500', trend: 'Configuradas' },
    { label: 'Estudiantes', value: 124, icon: Users, color: 'bg-indigo-500', trend: '+12 este mes' },
    { label: 'Horas Totales', value: modules.reduce((acc, m) => acc + (m.totalHoraAcademic || 0), 0), icon: Clock, color: 'bg-amber-500', trend: 'Académicas' },
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 text-pretty">Inicio Académico</h1>
          <p className="text-slate-500 mt-1 capitalize">{format(today, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-academic-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar..."
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-academic-500 transition-all text-sm font-medium outline-none"
            />
          </div>
          <button className="p-3 bg-white rounded-2xl shadow-sm text-slate-500 hover:text-academic-600 transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>
      
      {/* Notifications Ribbon if any */}
      <AnimatePresence>
        {notifications.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="overflow-hidden"
          >
            <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Bell className="animate-bounce" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter">Tienes {notifications.length} registros de asistencia pendientes</h3>
                  <p className="text-xs text-amber-700 font-bold opacity-80">Por favor regulariza la asistencia de las sesiones pasadas.</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/attendance')}
                className="px-6 py-3 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-200 hover:bg-amber-700 transition-all flex items-center gap-2 shrink-0"
              >
                Atender Ahora
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-7 rounded-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-2xl hover:shadow-academic-500/5 hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-5">
              <div className={cn("p-4 rounded-2xl text-white shadow-lg transition-all duration-300 group-hover:rotate-12", stat.color)}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-tighter rounded-full border border-slate-100">
                <TrendingUp size={12} className="text-emerald-500" />
                Live
              </div>
            </div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-display font-black text-slate-800 tracking-tight">{stat.value}</span>
              <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg uppercase">{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Active Sessions Classes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-slate-800 flex items-center gap-2">
              Sesiones de Hoy
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-md text-[10px] uppercase font-black animate-pulse">En vivo</span>
            </h2>
            <span className="text-sm font-bold text-slate-400">{todaysSessions.length} encuentros programados</span>
          </div>

          <div className="grid gap-6">
            {todaysSessions.length > 0 ? (
              todaysSessions.map((session, idx) => (
                <motion.div
                  key={`${session.bitacoraId}-${session.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 md:items-center hover:shadow-2xl hover:shadow-academic-500/5 transition-all duration-300 relative overflow-hidden group border-l-[6px] border-l-academic-600"
                >
                  <div className="flex-1 relative z-10">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="px-3.5 py-1.5 bg-academic-50 text-academic-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-academic-100/50">{session.grupo}</span>
                      <span className="text-xs font-bold text-slate-300">/</span>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">{session.carrera}</span>
                      <div className="ml-auto md:ml-0 flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">
                        <Clock size={12} />
                        {session.turno}
                      </div>
                    </div>
                    <h3 className="text-3xl font-display font-black text-slate-800 leading-[1.1] mb-6 tracking-tight">{session.moduloNombre}</h3>
                    
                    <div className="flex flex-col gap-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contenidos del día:</p>
                      <div className="flex flex-wrap gap-3">
                        {session.actividades.map((act: any) => (
                          <div key={act.id} className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-white group-hover:border-academic-100 transition-all duration-300 grow">
                            <div className="w-2 h-2 rounded-full bg-academic-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                            <span className="text-xs font-bold text-slate-700">{act.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:items-end gap-6 shrink-0 relative z-10">
                    <div className="text-left md:text-right">
                      <div className="flex items-center gap-2 md:justify-end text-academic-600 font-display font-black text-3xl italic">
                        {session.horas}
                        <span className="text-sm uppercase not-italic font-sans text-slate-400">h / ha</span>
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 shrink-0">Carga Programada</p>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedSession(session);
                        setShowSessionModal(true);
                      }}
                      className="w-full md:w-20 h-20 bg-academic-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-academic-600/30 hover:bg-slate-800 hover:shadow-slate-800/20 transition-all active:scale-90 group hover:-rotate-3"
                    >
                      <Play size={32} fill="currentColor" className="ml-1 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500" />
                    </button>
                  </div>
                  
                  {/* Decorative background element */}
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <BookOpen size={200} />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 mb-4">
                  <CalendarIcon size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No hay clases hoy</h3>
                <p className="text-slate-500 mt-2 max-w-xs px-4">Relájate o aprovecha para adelantar planificación y revisión de bitácoras.</p>
                <button 
                  onClick={() => navigate('/bitacoras')}
                  className="mt-8 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:border-academic-300 hover:text-academic-600 transition-all"
                >
                  Ver mi horario semanal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Status & Next */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-xl font-display font-bold text-slate-800 mb-6">Agenda Académica</h2>
            <div className="space-y-4">
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
                  className="flex gap-4 p-4 rounded-2xl bg-academic-50/50 hover:bg-academic-50 transition-colors cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-xl bg-white flex flex-col items-center justify-center border border-academic-100 shadow-sm group-hover:bg-academic-600 transition-all">
                    <span className="text-[10px] font-bold text-academic-400 group-hover:text-white/70 uppercase">MAY</span>
                    <span className="text-xl font-display font-bold text-academic-700 group-hover:text-white leading-none">{15 + idx}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 leading-tight truncate group-hover:text-academic-600 transition-colors">{bit.moduloNombre}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest truncate">{bit.carrera}</span>
                      <span className="text-slate-300 text-[10px]">•</span>
                      <span className="text-[10px] font-black text-indigo-600 uppercase">{bit.turno}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/bitacoras')}
              className="mt-6 w-full py-4 rounded-2xl bg-slate-50 text-slate-600 font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors group text-sm"
            >
              Ver Calendario Completo
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-academic-700 p-8 rounded-[2.5rem] shadow-xl shadow-academic-600/20 text-white overflow-hidden relative group">
            <div className="relative z-10">
              <TrendingUp size={48} className="text-white/20 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Resumen Semanal</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6">Has completado el 84% de las actividades programadas para esta semana.</p>
              <div className="flex items-center gap-2 font-black text-3xl">
                24/28
                <span className="text-sm font-bold text-white/50 bg-white/10 px-2 py-1 rounded-lg">Sesiones</span>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>

      {/* Session Detail Modal */}
      <AnimatePresence>
        {showSessionModal && selectedSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSessionModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-academic-600 text-white">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{selectedSession.grupo}</span>
                    <span className="opacity-30">•</span>
                    <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{selectedSession.carrera}</span>
                    <span className="opacity-30">•</span>
                    <span className="text-[10px] font-black text-white bg-white/10 px-2 py-0.5 rounded uppercase">{selectedSession.turno}</span>
                  </div>
                  <h2 className="text-2xl font-bold">Encuentro de Hoy</h2>
                </div>
                <button 
                  onClick={() => setShowSessionModal(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="text-white" size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Módulo Formativo</h3>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="text-xl font-bold text-slate-800">{selectedSession.moduloNombre}</h4>
                    <p className="text-slate-500 mt-1 text-sm">{selectedSession.carrera}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Actividades Programadas</h3>
                  <div className="space-y-3">
                    {selectedSession.actividades.map((act: any) => (
                      <div key={act.id} className="p-4 bg-white border-2 border-slate-50 rounded-2xl flex items-start gap-4 hover:border-academic-100 transition-all">
                        <div className="w-10 h-10 rounded-xl bg-academic-50 text-academic-600 flex items-center justify-center shrink-0 font-bold text-xs">
                          UD{act.unitId}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-700 leading-snug">{act.desc}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock size={12} className="text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{act.hoursInSession} Horas Académicas</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    onClick={() => navigate('/bitacoras')}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Ver Bitácora Completa
                  </button>
                  <button 
                    onClick={() => setShowSessionModal(false)}
                    className="flex-[2] py-4 bg-academic-600 text-white rounded-2xl font-bold shadow-lg shadow-academic-600/20 hover:bg-academic-700 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={20} />
                    Confirmar Inicio de Sesión
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Agenda/Course Detail Modal */}
      <AnimatePresence>
        {showAgendaModal && selectedAgendaBitacora && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAgendaModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-800 text-white">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{selectedAgendaBitacora.grupo}</span>
                    <span className="opacity-30">•</span>
                    <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{selectedAgendaBitacora.carrera}</span>
                    <span className="opacity-30">•</span>
                    <span className="text-[10px] font-black text-white bg-white/10 px-2 py-0.5 rounded uppercase">{selectedAgendaBitacora.turno}</span>
                  </div>
                  <h2 className="text-2xl font-bold">Detalle del Curso</h2>
                </div>
                <button 
                  onClick={() => setShowAgendaModal(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="text-white" size={24} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Módulo Formativo</h3>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-academic-600 uppercase mb-1">{selectedAgendaBitacora.moduloId}</p>
                    <h4 className="text-xl font-bold text-slate-800">{selectedAgendaBitacora.moduloNombre}</h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                      <Clock size={10} /> Horario
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                       {selectedAgendaBitacora.horario?.dias.map((d: string) => (
                         <span key={d} className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[9px] font-bold text-slate-600">{d}</span>
                       ))}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                      <TrendingUp size={10} /> Progreso
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-academic-500 rounded-full" 
                          style={{ width: `${selectedAgendaBitacora.progreso}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">{selectedAgendaBitacora.progreso}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Programa de Actividades</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {modules.find(m => m.codModule === selectedAgendaBitacora.moduloId)?.activities?.map((act: any) => (
                      <div key={act.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-academic-100 text-academic-700 flex items-center justify-center text-[10px] font-black">
                            U{act.unitId}
                          </div>
                          <span className="text-xs font-bold text-slate-700">{act.desc}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{act.ha}h</span>
                      </div>
                    )) || (
                      <p className="text-xs text-slate-400 italic">No hay actividades registradas en el programa.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Próximo Encuentro</h3>
                  <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <p className="text-sm font-bold text-indigo-900 leading-tight">
                      {selectedAgendaBitacora.actual || "Sin registrar"}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => {
                      setShowAgendaModal(false);
                      navigate('/bitacoras');
                    }}
                    className="w-full py-4 bg-academic-600 text-white rounded-2xl font-bold shadow-lg shadow-academic-600/20 hover:bg-academic-700 transition-all flex items-center justify-center gap-2"
                  >
                    Ver Bitácora Académica
                    <ArrowRight size={18} />
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
