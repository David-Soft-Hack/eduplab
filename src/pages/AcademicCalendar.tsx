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
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const [selectedBitacora, setSelectedBitacora] = useState<any>(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState<any[]>([]);
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
      if (b.calendar && (b.estado === 'Activo' || b.estado === 'Finalizado')) {
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
                    "h-32 p-3 border-2 transition-all group overflow-hidden relative rounded-2xl cursor-pointer flex flex-col justify-between",
                    isSameDay(day, new Date()) 
                      ? "bg-academic-50/50 border-academic-200" 
                      : (selectedDay && isSameDay(day, selectedDay))
                        ? "bg-indigo-50/40 border-indigo-200" 
                        : "bg-white border-slate-100 hover:bg-slate-50/80 hover:border-slate-200"
                  )}
                  onClick={() => {
                    setSelectedDay(day);
                    setSelectedDayEvents(dayEvents);
                    setSelectedBitacora(dayEvents[0]?.bitacora || null);
                    setShowDetailModal(true);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-sm font-black font-display",
                      isSameDay(day, new Date()) ? "text-academic-700" : "text-slate-400 group-hover:text-slate-700"
                    )}>
                      {format(day, 'd')}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-academic-500 animate-pulse" />
                    )}
                  </div>
                  
                  <div className="mt-1 space-y-1 overflow-y-auto max-h-[72px] no-scrollbar">
                    {dayEvents.slice(0, 3).map((e, idx) => (
                      <div 
                        key={idx}
                        className={cn(
                          "px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tight truncate border transition-all duration-300",
                          e.isHoliday 
                            ? "bg-amber-50 text-amber-800 border-amber-200 shadow-sm" 
                            : "bg-academic-50 text-academic-700 border-academic-100 group-hover:bg-academic-100/60"
                        )}
                        title={e.isHoliday ? `Feriado: ${e.holidayName}` : `${e.title} - Grupo ${e.group}`}
                      >
                        {e.isHoliday ? `🌴 ${e.holidayName || 'Feriado'}` : `${e.title || 'Módulo'} (${e.group})`}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[7.5px] font-bold text-slate-400 text-center uppercase tracking-wider">
                        + {dayEvents.length - 3} más
                      </div>
                    )}
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
        {showDetailModal && selectedDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20 uppercase tracking-widest font-mono">Agenda Académica</span>
                  </div>
                  <h2 className="text-2xl font-black capitalize font-display">
                    {format(selectedDay, "eeee dd 'de' MMMM, yyyy", { locale: es })}
                  </h2>
                </div>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="p-3 hover:bg-white/10 rounded-2xl transition-all duration-300"
                >
                  <X className="text-white" size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-6 flex-1">
                {selectedDayEvents.length === 0 ? (
                  <div className="text-center py-12 px-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-slate-400 text-2xl mx-auto shadow-sm">
                      🍃
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base">Sin Clases Programadas</h4>
                      <p className="text-slate-400 text-xs font-semibold mt-1">No se registran encuentros académicos o feriados para este día en las bitácoras activas.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {selectedDayEvents.map((e, idx) => {
                      if (e.isHoliday) {
                        return (
                          <div 
                            key={idx} 
                            className="p-6 bg-amber-50/40 border border-amber-200/80 rounded-3xl space-y-3 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-lg uppercase tracking-wider font-mono">🌴 Clases Suspendidas</span>
                              <span className="text-[11px] font-bold text-amber-500">Omitido</span>
                            </div>
                            <div>
                              <h4 className="text-base font-black text-amber-950 uppercase tracking-tight">Feriado / Asueto: {e.holidayName || 'Día No Laboral'}</h4>
                              <p className="text-amber-800 text-xs font-bold leading-relaxed mt-1.5">
                                Este encuentro académico para el módulo de <strong className="font-extrabold">"{e.title}"</strong> fue omitido automáticamente de la bitácora del grupo <strong className="font-extrabold">{e.group}</strong> de conformidad a la legislación laboral del INATEC.
                              </p>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div 
                          key={idx} 
                          className="p-6 bg-slate-50 hover:bg-slate-50/80 border border-slate-100 hover:border-slate-200 rounded-3xl transition-all shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/50 pb-3">
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-indigo-600 font-sans">
                              <span>Módulo: {e.bitacora?.moduloId || 'N/A'}</span>
                              <span className="text-slate-300">•</span>
                              <span className="bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded text-[9px]">{e.bitacora?.turno}</span>
                            </div>
                            <span className="text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-lg uppercase tracking-wide">
                              Grupo: {e.group}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-lg font-black text-slate-800 leading-snug">{e.title}</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase mt-1 tracking-wider">{e.bitacora?.carrera || 'Educación Técnica'}</p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 pt-1">
                            <div className="p-3 bg-white border border-slate-100 rounded-2xl flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-academic-50 text-academic-600 flex items-center justify-center font-black">
                                <Clock size={16} />
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Horas de Sesión</p>
                                <p className="text-xs font-black text-slate-700 mt-0.5">{e.horasHA || 4} HA / {e.horasHR || 3} HR</p>
                              </div>
                            </div>

                            <div className="p-3 bg-white border border-slate-100 rounded-2xl flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                                <CheckCircle2 size={16} />
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Encuentro No.</p>
                                <p className="text-xs font-black text-slate-700 mt-0.5">{e.id?.includes('S-') ? `Sesión ${e.id.split('S-')[1]}` : 'General'}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Temas y Prácticas a Impartir</p>
                            <div className="p-4 bg-white border border-slate-150 rounded-2xl space-y-1.5 shadow-sm">
                              {e.actividades && e.actividades.length > 0 ? (
                                e.actividades.map((act: any, aIdx: number) => (
                                  <div key={aIdx} className="flex gap-2 text-xs font-semibold text-slate-600 leading-snug">
                                    <span className="text-academic-500 font-extrabold shrink-0">•</span>
                                    <span>{act.desc || act.nombre || 'Contenido Programótico'} (HA: {act.hoursInSession || 4})</span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-xs text-slate-400 font-bold italic">No se especifican temas puntuales para este encuentro.</div>
                              )}
                            </div>
                          </div>

                          {e.bitacora?.docenteNombre && (
                            <div className="pt-3 border-t border-slate-250/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-black text-xs shrink-0 font-mono">
                                  {e.bitacora.docenteNombre.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-black text-slate-800 leading-tight">{e.bitacora.docenteNombre}</p>
                                  <p className="text-[10px] text-slate-400 font-bold">Docente del Módulo</p>
                                </div>
                              </div>
                              <div className="flex shrink-0 gap-2">
                                <a 
                                  href={`tel:${e.bitacora.docenteTelefono || '50588881122'}`}
                                  className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-colors flex items-center gap-1.5"
                                >
                                  Llamar
                                </a>
                                <button 
                                  onClick={() => {
                                    alert(`Enviando recordatorio automático de WhatsApp a ${e.bitacora.docenteNombre} al ${e.bitacora.docenteTelefono || '+505 8888-1122'}:\n\nEstimado Docente, le recordamos su sesión presencial programada para hoy en el módulo "${e.title}" con el grupo ${e.group}.`);
                                  }}
                                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/10 transition-all flex items-center gap-1.5 active:scale-95"
                                >
                                  Notificar Alerta
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50 shrink-0 flex gap-3">
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="w-full py-4 bg-slate-800 text-white hover:bg-slate-900 rounded-2xl font-black shadow-lg shadow-slate-900/10 transition-all text-xs uppercase tracking-widest text-center"
                >
                  Cerrar Agenda de Hoy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AcademicCalendar;
