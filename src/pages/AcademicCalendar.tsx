import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  MoreVertical,
  X,
  FileText,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { useAppContext } from '../context/AppContext';

const AcademicCalendar: React.FC = () => {
  const { bitacoras } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedBitacora, setSelectedBitacora] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const daysInMonth = useMemo(() => eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  }), [currentDate]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Extract events from bitacoras
  const allEvents = useMemo(() => {
    const events: any[] = [];
    bitacoras.forEach(b => {
      if (b.calendar && b.estado === 'Activo') {
        b.calendar.forEach((s: any) => {
          events.push({
            ...s,
            id: `${b.id}-${s.id}`,
            bitacora: b,
            title: b.moduloNombre,
            group: b.grupo,
            type: 'clase'
          });
        });
      }
    });
    return events;
  }, [bitacoras]);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800">Planificador Académico</h1>
          <p className="text-slate-500 mt-1">Gestión centralizada de encuentros y módulos</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center gap-2 px-10 py-4 bg-academic-600 text-white rounded-2xl font-bold shadow-lg shadow-academic-500/20 hover:bg-academic-700 transition-all">
            Imprimir Reporte
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between mb-10 px-4">
            <h2 className="text-2xl font-display font-bold text-slate-800 capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="px-5 py-3 bg-academic-50 text-academic-600 font-bold rounded-xl text-sm transition-all hover:bg-academic-100">
                Hoy
              </button>
              <button onClick={nextMonth} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-4">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-4">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="h-32 bg-slate-50/30 rounded-xl m-0.5" />
            ))}
            
            {daysInMonth.map((day, i) => {
              const dayEvents = allEvents.filter(e => isSameDay(parseISO(e.fecha), day));
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "h-32 p-3 border-2 border-transparent transition-all group overflow-hidden relative rounded-2xl cursor-pointer",
                    isSameDay(day, new Date()) ? "bg-academic-50/50 border-academic-100" : "hover:bg-slate-50/80 hover:border-slate-100"
                  )}
                  onClick={() => {
                    if (dayEvents.length > 0) {
                      setSelectedBitacora(dayEvents[0].bitacora);
                      setShowDetailModal(true);
                    }
                  }}
                >
                  <span className={cn(
                    "text-sm font-bold",
                    isSameDay(day, new Date()) ? "text-academic-600" : "text-slate-400"
                  )}>
                    {format(day, 'd')}
                  </span>
                  
                  <div className="mt-2 space-y-1">
                    {dayEvents.map((e, idx) => (
                      <div 
                        key={idx}
                        className={cn(
                          "px-2 py-1.5 rounded-lg text-[9px] font-bold truncate transition-transform hover:scale-[1.02] border bg-academic-50 text-academic-700 border-academic-100"
                        )}
                      >
                        {e.title}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Filter size={18} className="text-academic-600" />
              Estado de Bitácoras
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Impartido', count: 12, color: 'bg-emerald-500' },
                { label: 'Pendiente', count: 5, color: 'bg-academic-500' },
                { label: 'En Curso', count: bitacoras.length, color: 'bg-amber-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", item.color)} />
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-tight">{item.label}</span>
                  </div>
                  <span className="text-lg font-display font-black text-slate-800">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-academic-600 to-blue-500 p-8 rounded-[2.5rem] shadow-xl shadow-academic-600/20 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Clock size={120} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Carga Horaria Semanal</h3>
              <p className="text-blue-100 text-sm mb-6">Faltan 12 horas académicas para completar la meta semanal.</p>
              <div className="h-2 w-full bg-white/20 rounded-full mb-8">
                <div className="h-full bg-white rounded-full w-2/3" />
              </div>
              <button className="w-full py-4 bg-white text-academic-700 rounded-2xl font-bold transform active:scale-95 transition-all shadow-lg hover:shadow-xl">
                Optimizar Calendario
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedBitacora && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailModal(false)}
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
                    <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{selectedBitacora.grupo}</span>
                    <span className="opacity-30">•</span>
                    <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{selectedBitacora.carrera}</span>
                    <span className="opacity-30">•</span>
                    <span className="text-[10px] font-black text-white bg-white/10 px-2 py-0.5 rounded uppercase">{selectedBitacora.turno}</span>
                  </div>
                  <h2 className="text-2xl font-bold">Detalle de Sesión</h2>
                </div>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="text-white" size={24} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 col-span-2">
                    <p className="text-xs font-bold text-academic-600 uppercase mb-1">{selectedBitacora.moduloId}</p>
                    <h4 className="text-xl font-bold text-slate-800">{selectedBitacora.moduloNombre}</h4>
                    <p className="text-sm font-bold text-indigo-600 mt-1 uppercase tracking-widest">{selectedBitacora.turno} - {selectedBitacora.carrera}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                      <Clock size={10} /> Horario
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                       {selectedBitacora.horario?.dias.map((d: string) => (
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
                          style={{ width: `${selectedBitacora.progreso}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">{selectedBitacora.progreso}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                   <button 
                    onClick={() => setShowDetailModal(false)}
                    className="w-full py-4 bg-academic-600 text-white rounded-2xl font-bold shadow-lg shadow-academic-600/20 hover:bg-academic-700 transition-all flex items-center justify-center gap-2"
                  >
                    Confirmar Disponibilidad
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

export default AcademicCalendar;
