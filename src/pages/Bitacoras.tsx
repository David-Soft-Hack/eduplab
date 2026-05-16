import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Calendar as CalendarIcon, 
  Users, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Plus,
  MoreVertical,
  Activity,
  ChevronDown,
  X,
  ChevronRight,
  Info,
  Printer
} from 'lucide-react';
import { EstadoBitacora, TipoCarrera } from '../types';
import { cn } from '../lib/utils';
import { useAppContext } from '../context/AppContext';
import { format, addDays, getDay, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const Bitacoras: React.FC = () => {
  const { modules, bitacoras, setBitacoras } = useAppContext();
  const [activeTab, setActiveTab] = useState<'A' | 'P'>('A');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBitacora, setSelectedBitacora] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [form, setForm] = useState({
    moduloId: '',
    grupo: '',
    fechaInicio: format(new Date(), 'yyyy-MM-dd'),
    diasSemana: [] as string[],
    horasSesion: 4,
    turno: 'Mañana',
  });

  const [showPrintModal, setShowPrintModal] = useState(false);

  const selectedModule = modules.find(m => m.codModule === form.moduloId);

  const generateCalendar = () => {
    if (!selectedModule) return [];
    
    let currentDate = parseISO(form.fechaInicio);
    let remainingHA = selectedModule.totalHoraAcademic;
    const sessions = [];
    const activities = [...(selectedModule.activities || [])];
    let currentActivityIndex = 0;
    let accumulatedHoursForActivity = 0;

    // Safety limit to prevent infinite loop
    let iterations = 0;
    while (remainingHA > 0 && iterations < 300) {
      iterations++;
      const dayName = DIAS[getDay(currentDate)];
      
      if (form.diasSemana.includes(dayName)) {
        const sessionHours = Math.min(form.horasSesion, remainingHA);
        
        // Find which activities fit in this session
        const sessionActivities = [];
        let sessionHoursLeft = sessionHours;

        while (sessionHoursLeft > 0 && currentActivityIndex < activities.length) {
          const activity = activities[currentActivityIndex];
          const activityRemainingHA = activity.ha - accumulatedHoursForActivity;
          
          if (activityRemainingHA <= sessionHoursLeft) {
            // Activity fits and maybe more
            sessionActivities.push({ ...activity, hoursInSession: activityRemainingHA });
            sessionHoursLeft -= activityRemainingHA;
            currentActivityIndex++;
            accumulatedHoursForActivity = 0;
          } else {
            // Activity is too long, takes the rest of the session
            sessionActivities.push({ ...activity, hoursInSession: sessionHoursLeft });
            accumulatedHoursForActivity += sessionHoursLeft;
            sessionHoursLeft = 0;
          }
        }

        sessions.push({
          id: `S-${sessions.length + 1}`,
          fecha: format(currentDate, 'yyyy-MM-dd'),
          horasHA: sessionHours,
          horasHR: Number((sessionHours * (selectedModule.totalHoraReloj / selectedModule.totalHoraAcademic)).toFixed(2)),
          actividades: sessionActivities
        });
        
        remainingHA -= sessionHours;
      }
      
      currentDate = addDays(currentDate, 1);
    }

    return sessions;
  };

  const handleCreate = () => {
    const calendar = generateCalendar();
    const newBitacora = {
      id: `B-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      grupo: form.grupo,
      moduloId: selectedModule?.codModule,
      moduloNombre: selectedModule?.nombre,
      carrera: selectedModule?.carrera,
      turno: form.turno,
      estado: EstadoBitacora.ACTIVO,
      progreso: 0,
      actual: calendar.length > 0 ? calendar[0].actividades[0]?.desc : 'Sin iniciar',
      fechaInicio: form.fechaInicio,
      horario: { dias: form.diasSemana, horasSesion: form.horasSesion },
      calendar
    };

    setBitacoras([newBitacora, ...bitacoras]);
    setIsSuccess(true);
    setTimeout(() => {
      setShowAddModal(false);
      setIsSuccess(false);
      setStep(1);
    }, 1500);
  };

  const toggleDia = (dia: string) => {
    setForm(prev => ({
      ...prev,
      diasSemana: prev.diasSemana.includes(dia) 
        ? prev.diasSemana.filter(d => d !== dia) 
        : [...prev.diasSemana, dia]
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800">Bitácoras Académicas</h1>
          <p className="text-slate-500 mt-1">Planificación y seguimiento de ejecución por grupo</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-academic-600 hover:bg-academic-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-academic-600/20 active:scale-95"
        >
          <Plus size={20} />
          Configurar Nueva Bitácora
        </button>
      </div>

      <div className="flex gap-2 p-1.5 bg-slate-100/50 w-fit rounded-2xl mx-auto md:mx-0">
        <button 
          onClick={() => setActiveTab('A')}
          className={cn(
            "px-6 py-3 rounded-xl font-bold text-sm transition-all",
            activeTab === 'A' ? "bg-white text-academic-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Activas
        </button>
        <button 
          onClick={() => setActiveTab('P')}
          className={cn(
            "px-6 py-3 rounded-xl font-bold text-sm transition-all",
            activeTab === 'P' ? "bg-white text-academic-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Finalizadas
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {bitacoras.map((b, idx) => (
          <motion.div
            key={`${b.id}-${idx}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all overflow-hidden flex flex-col"
          >
            <div className="p-7 flex-1">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-academic-50 rounded-2xl text-academic-600">
                  <FileText size={22} />
                </div>
                <div className={cn(
                  "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider",
                  b.estado === EstadoBitacora.ACTIVO ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                )}>
                  {b.estado}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-800 leading-tight group-hover:text-academic-600 transition-colors uppercase tracking-tight">
                    {b.moduloNombre || b.modulo}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 mt-2">
                    <span className="text-xs font-bold uppercase tracking-widest">Grupo:</span>
                    <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{b.grupo}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-bold text-slate-500">{b.carrera}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{b.turno}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avance Académico</span>
                    <span className="text-xs font-bold text-academic-600">{b.progreso}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${b.progreso}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-academic-500 to-blue-400 rounded-full" 
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    <Activity size={12} className="text-academic-500" />
                    Ejecutando actualmente
                  </div>
                  <p className="text-sm font-bold text-slate-600 truncate">{b.actual}</p>
                </div>
              </div>
            </div>

            <div className="px-7 py-5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-500">
                  {b.horario?.dias?.[0]}... {b.horario?.horasSesion}h/sesión
                </span>
              </div>
              <button 
                onClick={() => {
                  setSelectedBitacora(b);
                  setShowDetailModal(true);
                }}
                className="p-2 bg-white rounded-xl shadow-sm text-academic-600 hover:bg-academic-600 hover:text-white transition-all transform hover:rotate-12"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bitacora Detail Modal */}
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
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="relative w-full max-w-6xl bg-white rounded-[3rem] shadow-2xl overflow-hidden shadow-slate-900/20 flex flex-col max-h-[90vh]"
            >
              <div className="p-8 md:p-10 border-b border-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-academic-100 rounded-2xl text-academic-700">
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-academic-500 uppercase tracking-widest">{selectedBitacora.id}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedBitacora.grupo}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 leading-tight">{selectedBitacora.moduloNombre}</h2>
                  </div>
                </div>
                <div className="ml-auto mr-6">
                  <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                    Turno: {selectedBitacora.turno || 'Mañana'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setShowPrintModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    <Printer size={14} />
                    Imprimir Plan
                  </button>
                  <button 
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <X className="text-slate-400" size={24} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-10">
                <div className="grid lg:grid-cols-4 gap-8">
                  {/* Stats Sidebar */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 px-1">Resumen del Plan</h3>
                      <div className="space-y-6">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 px-1">Progreso</p>
                          <div className="flex items-end justify-between mb-2 px-1">
                            <span className="text-2xl font-black text-slate-800">{selectedBitacora.progreso}%</span>
                            <span className="text-xs font-bold text-academic-600">Ejecutado</span>
                          </div>
                          <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-200">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${selectedBitacora.progreso}%` }}
                              className="h-full bg-academic-600"
                            />
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200 flex flex-col gap-4">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Carga Horaria Total</p>
                            <p className="font-bold text-slate-700">{modules.find(m => m.codModule === selectedBitacora.moduloId)?.totalHoraAcademic || 96} Horas Académicas</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Turno Impartido</p>
                            <p className="font-bold text-indigo-600">{selectedBitacora.turno || 'Mañana'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Horario del Grupo</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedBitacora.horario?.dias.map((d: string) => (
                                <span key={d} className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600">{d}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Sesiones Programadas</p>
                            <p className="font-bold text-slate-700">{selectedBitacora.calendar?.length || 0} sesiones totales</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-academic-600 rounded-[2rem] shadow-xl shadow-academic-600/20 text-white">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 text-white rounded-xl">
                          <Activity size={18} />
                        </div>
                        <h4 className="font-bold text-white text-sm">Sesión Actual</h4>
                      </div>
                      <div className="space-y-3">
                        <p className="text-xs font-medium text-white/80 leading-relaxed">
                          {selectedBitacora.calendar?.[0] ? format(parseISO(selectedBitacora.calendar[0].fecha), "EEEE dd 'de' MMMM", { locale: es }) : 'No programada'}
                        </p>
                        <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                          <p className="text-[10px] font-bold text-white/50 uppercase mb-1 uppercase">Contenidos:</p>
                          <p className="text-xs font-bold text-white leading-tight">
                            {selectedBitacora.calendar?.[0]?.actividades[0]?.desc || 'Sin iniciar'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calendar Content */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-slate-800">Calendario de Ejecución</h3>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {selectedBitacora.calendar?.length || 0} Sesiones
                        </span>
                      </div>
                    </div>

                    <div className="border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sesión</th>
                            <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fecha</th>
                            <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contenido / Actividades</th>
                            <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hora Acad.</th>
                            <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hora Reloj</th>
                            <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(selectedBitacora.calendar || []).map((session: any, idx: number) => (
                            <tr key={session.id} className="border-b border-slate-50 group hover:bg-slate-50/50 transition-colors">
                              <td className="p-5">
                                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-500">
                                  {idx + 1}
                                </div>
                              </td>
                              <td className="p-5">
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-700">{format(parseISO(session.fecha), 'dd MMM, yyyy', { locale: es })}</span>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">{DIAS[getDay(parseISO(session.fecha))]}</span>
                                </div>
                              </td>
                              <td className="p-5">
                                <div className="space-y-3">
                                  {session.actividades.map((act: any) => (
                                    <div key={act.id} className="group/act p-3 bg-white border border-slate-50 rounded-2xl hover:border-academic-200 transition-all shadow-sm">
                                      <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-academic-50 text-academic-600 flex items-center justify-center shrink-0 font-bold text-[10px]">
                                          UD{act.unitId}
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm font-bold text-slate-700 leading-snug group-hover/act:text-academic-700 transition-colors">{act.desc}</p>
                                          <div className="flex items-center gap-3 mt-1.5">
                                            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded uppercase">
                                              <Clock size={10} />
                                              {act.hoursInSession} HA
                                            </div>
                                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">Teórico-Práctico</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  {session.actividades.length === 0 && (
                                    <span className="text-xs text-slate-400 italic">Sin actividades asignadas</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-5">
                                <span className="text-sm font-bold text-slate-600">{session.horasHA || session.horas}h</span>
                              </td>
                              <td className="p-5">
                                <span className="text-sm font-bold text-slate-400">{session.horasHR || (session.horas * 0.83).toFixed(1)}h</span>
                              </td>
                              <td className="p-5">
                                <div className="flex justify-center">
                                  {idx < 2 ? (
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                      <CheckCircle2 size={16} />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center">
                                      <Clock size={16} />
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Bitacora Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden shadow-slate-900/20 flex flex-col max-h-[90vh]"
            >
              <div className="p-8 md:p-10 border-b border-slate-50 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Generar Calendario de Bitácora</h2>
                  <p className="text-sm text-slate-400">Vincula un módulo y planifica las sesiones del grupo</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="text-slate-400" size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-10">
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in-95">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">Calendario Generado</h3>
                    <p className="text-slate-500 mt-2 text-center">La bitácora y su plan calendarizado han sido creados con éxito.</p>
                  </div>
                ) : (
                  <div className="space-y-10">
                    {/* Step Indicators */}
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all",
                        step === 1 ? "bg-academic-600 text-white shadow-lg shadow-academic-600/20" : "bg-slate-100 text-slate-400"
                      )}>
                        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">1</span>
                        Configuración Base
                      </div>
                      <ChevronRight size={16} className="text-slate-300" />
                      <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all",
                        step === 2 ? "bg-academic-600 text-white shadow-lg shadow-academic-600/20" : "bg-slate-100 text-slate-400"
                      )}>
                        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">2</span>
                        Revisión de Calendario
                      </div>
                    </div>

                    {step === 1 ? (
                      <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="space-y-6">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Seleccionar Módulo Formativo</label>
                            <select 
                              value={form.moduloId}
                              onChange={(e) => setForm({ ...form, moduloId: e.target.value })}
                              className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-academic-600 font-bold text-slate-700"
                            >
                              <option value="">Seleccione un módulo...</option>
                              {modules.map(m => (
                                <option key={m.codModule} value={m.codModule}>{m.nombre} ({m.totalHoraAcademic}h)</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Nombre del Grupo</label>
                            <input 
                              type="text" 
                              placeholder="Ej: S-24A"
                              value={form.grupo}
                              onChange={(e) => setForm({ ...form, grupo: e.target.value })}
                              className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-academic-600 font-bold text-slate-700"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Turno de Clase</label>
                            <div className="flex gap-2">
                              {['Mañana', 'Tarde', 'Noche'].map(t => (
                                <button
                                  key={t}
                                  onClick={() => setForm({ ...form, turno: t })}
                                  className={cn(
                                    "flex-1 py-3 rounded-xl border-2 font-bold text-xs transition-all",
                                    form.turno === t 
                                      ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20" 
                                      : "bg-white border-slate-100 text-slate-400 hover:border-indigo-200"
                                  )}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Fecha Inicio</label>
                              <input 
                                type="date" 
                                value={form.fechaInicio}
                                onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
                                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-academic-600 font-bold text-slate-700"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Horas por Sesión</label>
                              <input 
                                type="number" 
                                value={form.horasSesion}
                                onChange={(e) => setForm({ ...form, horasSesion: Number(e.target.value) })}
                                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-academic-600 font-bold text-slate-700"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">Frecuencia Semanal</label>
                            <div className="grid grid-cols-2 gap-3">
                              {DIAS.map(dia => (
                                <button
                                  key={dia}
                                  onClick={() => toggleDia(dia)}
                                  className={cn(
                                    "px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all",
                                    form.diasSemana.includes(dia)
                                      ? "bg-academic-600 border-academic-600 text-white shadow-md shadow-academic-600/20"
                                      : "bg-white border-slate-100 text-slate-400 hover:border-academic-200"
                                  )}
                                >
                                  {dia}
                                </button>
                              ))}
                            </div>
                            <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                              <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                              <p className="text-xs font-medium text-amber-700 leading-relaxed">
                                El sistema distribuirá automáticamente las actividades del módulo entre los días seleccionados hasta completar la carga horaria.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 animate-in slide-in-from-right-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-slate-800">Vista Previa de Dosificación</h3>
                          <div className="flex items-center gap-4">
                            <span className="px-3 py-1 bg-academic-50 text-academic-600 rounded-lg text-xs font-bold font-mono">
                              Total: {selectedModule?.totalHoraAcademic}h
                            </span>
                          </div>
                        </div>
                        
                        <div className="border border-slate-100 rounded-[2rem] overflow-hidden">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sesión</th>
                                <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fecha Programada</th>
                                <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actividades a Desarrollar</th>
                                <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hora Acad.</th>
                                <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hora Reloj</th>
                              </tr>
                            </thead>
                            <tbody>
                              {generateCalendar().map((session, idx) => (
                                <tr key={session.id} className="border-b border-slate-50 group hover:bg-slate-50/50 transition-colors">
                                  <td className="p-5">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                      {idx + 1}
                                    </div>
                                  </td>
                                  <td className="p-5">
                                    <span className="font-bold text-slate-700">{format(parseISO(session.fecha), 'EEE dd MMM, yyyy', { locale: es })}</span>
                                  </td>
                                  <td className="p-5 max-w-md">
                                    <div className="space-y-1">
                                      {session.actividades.map((act: any) => (
                                        <div key={act.id} className="flex items-center gap-2">
                                          <span className="text-[10px] font-bold text-academic-600 bg-academic-50 px-1.5 py-0.5 rounded">UD{act.unitId}</span>
                                          <p className="text-sm text-slate-600 font-medium truncate">{act.desc}</p>
                                          <span className="text-[10px] font-bold text-slate-400 ml-auto">{act.hoursInSession}h</span>
                                        </div>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="p-5">
                                    <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{session.horasHA}h</span>
                                  </td>
                                  <td className="p-5">
                                    <span className="font-mono text-sm font-bold text-slate-400">{session.horasHR}h</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                      <button 
                        onClick={() => setStep(1)}
                        className={cn(
                          "px-8 py-4 rounded-2xl font-bold transition-all",
                          step === 1 ? "opacity-0 pointer-events-none" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                        )}
                      >
                        Anterior
                      </button>
                      
                      {step === 1 ? (
                        <button 
                          onClick={() => setStep(2)}
                          disabled={!form.moduloId || !form.grupo || form.diasSemana.length === 0}
                          className="px-10 py-4 bg-academic-600 text-white rounded-2xl font-bold shadow-xl shadow-academic-600/20 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                          Generar Calendario
                          <ArrowRight size={18} />
                        </button>
                      ) : (
                        <button 
                          onClick={handleCreate}
                          className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
                        >
                          Crear Bitácora
                          <CheckCircle2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Print Preview Modal - Excel Style */}
      <AnimatePresence>
        {showPrintModal && selectedBitacora && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-[1000px] bg-white shadow-2xl p-0 min-h-screen my-8"
            >
              {/* Toolbar */}
              <div className="sticky top-0 z-10 p-4 bg-slate-800 text-white flex items-center justify-between no-print shadow-lg">
                <div className="flex items-center gap-4">
                  <Printer size={20} />
                  <span className="font-bold">Vista Previa de Impresión</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-academic-600 hover:bg-academic-700 text-white rounded-lg font-bold transition-colors flex items-center gap-2"
                  >
                    <Printer size={16} />
                    Imprimir
                  </button>
                  <button 
                    onClick={() => setShowPrintModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Excel Content */}
              <div className="p-8 print:p-0 print-content" id="printable-area">
                <style>{`
                  @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                    .print-content { padding: 0 !important; width: 100% !important; }
                    @page { margin: 1cm; }
                  }
                  .excel-table { border-collapse: collapse; width: 100%; border: 2px solid black; }
                  .excel-table th, .excel-table td { border: 1px solid #777; padding: 6px 10px; font-family: 'Times New Roman', serif; font-size: 11px; }
                  .excel-bg-yellow { background-color: #ffe699 !important; }
                  .excel-header-center { text-align: center; font-weight: bold; }
                `}</style>

                {/* Header Section */}
                <div className="flex items-stretch border-2 border-black mb-0 overflow-hidden">
                  <div className="w-1/4 border-r border-black p-4 flex flex-col items-center justify-center">
                    <img src="https://www.inatec.edu.ni/media/logo_original.png" alt="INATEC" className="h-12 object-contain" />
                    <div className="mt-2 flex gap-1">
                      <div className="w-4 h-4 bg-academic-600 rounded-full" />
                      <div className="w-4 h-4 bg-rose-600 rounded-full" />
                      <div className="w-4 h-4 bg-emerald-600 rounded-full" />
                    </div>
                  </div>
                  <div className="w-3/4 flex flex-col font-black italic uppercase tracking-widest text-center py-4 justify-center leading-tight">
                    <p className="text-sm border-b border-black pb-2 mb-2">DIRECCIÓN GENERAL DE FORMACIÓN PROFESIONAL</p>
                    <p className="text-lg">PLAN CALENDARIO/BITÁCORA</p>
                  </div>
                </div>

                {/* I. Datos Generales */}
                <table className="excel-table border-t-0">
                  <tbody>
                    <tr className="excel-bg-yellow">
                      <td colSpan={10} className="font-bold">I.- Datos Generales</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="excel-bg-yellow font-bold">Nombre del Centro</td>
                      <td colSpan={8} className="uppercase font-medium">CENTRO TECNOLOGICO DE MASAYA</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="excel-bg-yellow font-bold">Carrera Técnica/ Curso</td>
                      <td colSpan={5} className="uppercase font-medium">{selectedBitacora.carrera}</td>
                      <td colSpan={1} className="excel-bg-yellow font-bold">Código del Grupo</td>
                      <td colSpan={2} className="uppercase font-medium">{selectedBitacora.grupo}</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="excel-bg-yellow font-bold">Módulo Formativo/ Asignatura</td>
                      <td colSpan={8} className="uppercase font-medium text-blue-700">{selectedBitacora.moduloNombre}</td>
                    </tr>
                    <tr className="excel-header-center">
                      <td className="excel-bg-yellow">Carga Horaria</td>
                      <td className="font-medium">{modules.find(m => m.codModule === selectedBitacora.moduloId)?.totalHoraAcademic || 96}H</td>
                      <td className="excel-bg-yellow">Fecha de Inicio</td>
                      <td colSpan={2} className="font-medium">{selectedBitacora.calendar?.[0]?.fecha || 'N/A'}</td>
                      <td className="excel-bg-yellow" colSpan={2}>Fecha de Finalización</td>
                      <td colSpan={3} className="font-medium">{selectedBitacora.calendar?.[selectedBitacora.calendar.length - 1]?.fecha || 'N/A'}</td>
                    </tr>
                    <tr className="excel-header-center">
                      <td rowSpan={2} className="excel-bg-yellow">Horario</td>
                      <td className="excel-bg-yellow font-bold">Días</td>
                      <td className="excel-bg-yellow">Lunes</td>
                      <td className="excel-bg-yellow">Martes</td>
                      <td className="excel-bg-yellow">Miércoles</td>
                      <td className="excel-bg-yellow">Jueves</td>
                      <td className="excel-bg-yellow">Viernes</td>
                      <td className="excel-bg-yellow">Sábado</td>
                      <td className="excel-bg-yellow" colSpan={2}>Domingo</td>
                    </tr>
                    <tr className="excel-header-center h-8">
                       <td className="excel-bg-yellow">Hora de inicio y fin</td>
                       <td className={cn(selectedBitacora.horario?.dias.includes('Lunes') && "bg-slate-100 font-bold")}>{selectedBitacora.horario?.dias.includes('Lunes') ? 'X' : ''}</td>
                       <td className={cn(selectedBitacora.horario?.dias.includes('Martes') && "bg-slate-100 font-bold")}>{selectedBitacora.horario?.dias.includes('Martes') ? 'X' : ''}</td>
                       <td className={cn(selectedBitacora.horario?.dias.includes('Miércoles') && "bg-slate-100 font-bold")}>{selectedBitacora.horario?.dias.includes('Miércoles') ? 'X' : ''}</td>
                       <td className={cn(selectedBitacora.horario?.dias.includes('Jueves') && "bg-slate-100 font-bold")}>{selectedBitacora.horario?.dias.includes('Jueves') ? 'X' : ''}</td>
                       <td className={cn(selectedBitacora.horario?.dias.includes('Viernes') && "bg-slate-100 font-bold")}>{selectedBitacora.horario?.dias.includes('Viernes') ? 'X' : ''}</td>
                       <td className={cn(selectedBitacora.horario?.dias.includes('Sábado') && "bg-slate-100 font-bold")}>{selectedBitacora.horario?.dias.includes('Sábado') ? 'X' : ''}</td>
                       <td className={cn(selectedBitacora.horario?.dias.includes('Domingo') && "bg-slate-100 font-bold")} colSpan={2}>{selectedBitacora.horario?.dias.includes('Domingo') ? 'X' : ''}</td>
                    </tr>
                  </tbody>
                </table>

                {/* II. Dosificación de Actividades */}
                <table className="excel-table border-t-0">
                  <thead>
                    <tr className="excel-bg-yellow">
                      <td colSpan={10} className="font-bold">II.- Dosificación de Actividades</td>
                    </tr>
                    <tr className="excel-bg-yellow excel-header-center">
                      <td rowSpan={2} width="8%">Unidad Didáctica</td>
                      <td rowSpan={2} width="15%">Actividades</td>
                      <td rowSpan={2} width="8%">Horas Asignadas</td>
                      <td rowSpan={2} width="10%">Fecha Programada</td>
                      <td colSpan={2} width="10%">Se impartió en la fecha programada</td>
                      <td rowSpan={2} width="20%">Descripción de las Incidencias</td>
                      <td rowSpan={2} width="24%" colSpan={3}>Estrategia de Recuperación</td>
                    </tr>
                    <tr className="excel-bg-yellow excel-header-center">
                      <td>Si</td>
                      <td>No</td>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBitacora.calendar?.map((session: any, sIdx: number) => {
                      return session.actividades.map((act: any, aIdx: number) => (
                        <tr key={`${sIdx}-${aIdx}`}>
                          {aIdx === 0 && <td rowSpan={session.actividades.length} className="excel-header-center font-bold">UD {act.unitId}</td>}
                          <td>{act.desc}</td>
                          <td className="excel-header-center">{act.hoursInSession}</td>
                          {aIdx === 0 && <td rowSpan={session.actividades.length} className="excel-header-center">{session.fecha}</td>}
                          <td className="excel-header-center">X</td>
                          <td className="excel-header-center"></td>
                          <td></td>
                          <td colSpan={3}></td>
                        </tr>
                      ));
                    })}
                    {/* Add empty rows to complete page feel if needed */}
                    {Array.from({ length: 15 - (selectedBitacora.calendar?.length || 0) }).map((_, i) => (
                      <tr key={`empty-${i}`} className="h-6">
                        <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td colSpan={3}></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bitacoras;
