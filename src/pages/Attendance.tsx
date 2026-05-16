import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  ChevronRight, 
  Filter,
  Save,
  FileSpreadsheet,
  ArrowLeft,
  GraduationCap,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';
import { format, parseISO, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

const Attendance: React.FC = () => {
  const { bitacoras, students, attendanceRecords, setAttendanceRecords, setNotifications } = useAppContext();
  const [selectedBitacora, setSelectedBitacora] = useState<any>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<Record<string, 'P' | 'A' | 'J'>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const saveAttendance = () => {
    const recordId = `${selectedBitacora.id}-${selectedSession.id}`;
    
    const newRecord = {
      id: recordId,
      bitacoraId: selectedBitacora.id,
      sessionId: selectedSession.id,
      data: attendanceData,
      savedAt: new Date().toISOString()
    };

    setAttendanceRecords(prev => {
      const filtered = prev.filter(r => r.id !== recordId);
      return [...filtered, newRecord];
    });

    // Clear notification if exists
    setNotifications(prev => prev.filter(n => n.id !== `pending-${recordId}`));

    alert("Asistencia guardada correctamente");
  };

  // Mock sessions if bitacora is selected
  const sessions = selectedBitacora?.calendar || [];
  
  // Filter students by group/carrera matching the bitacora
  const groupStudents = students.filter(s => 
    s.grupo === selectedBitacora?.grupo || s.carrera === selectedBitacora?.carrera
  );

  const handleToggleAttendance = (studentId: string, status: 'P' | 'A' | 'J') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const [showTodaySelector, setShowTodaySelector] = useState(false);
  const [todayModules, setTodayModules] = useState<any[]>([]);

  const handleSelectTodaySession = () => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const activeToday = bitacoras.map(b => {
      const session = b.calendar?.find((s: any) => s.fecha.startsWith(todayStr));
      return session ? { bitacora: b, session } : null;
    }).filter(Boolean);

    if (activeToday.length === 0) {
      alert("No se encontró ninguna sesión programada para hoy en tus bitácoras.");
      return;
    }

    if (activeToday.length === 1) {
      const item: any = activeToday[0];
      startAttendance(item.bitacora, item.session);
    } else {
      setTodayModules(activeToday);
      setShowTodaySelector(true);
    }
  };

  const startAttendance = (bitacora: any, session: any) => {
    setSelectedBitacora(bitacora);
    setSelectedSession(session);
    setShowTodaySelector(false);
    
    const recordId = `${bitacora.id}-${session.id}`;
    const existingRecord = attendanceRecords.find(r => r.id === recordId);

    if (existingRecord) {
      setAttendanceData(existingRecord.data);
    } else {
      const initialData: Record<string, 'P' | 'A' | 'J'> = {};
      const studentsInGroup = students.filter(s => 
        s.grupo === bitacora.grupo || s.carrera === bitacora.carrera
      );
      studentsInGroup.forEach(s => {
        initialData[s.id] = 'P';
      });
      setAttendanceData(initialData);
    }
  };

  const markAll = (status: 'P' | 'A' | 'J') => {
    const newData: Record<string, 'P' | 'A' | 'J'> = {};
    groupStudents.forEach(s => {
      newData[s.id] = status;
    });
    setAttendanceData(newData);
  };

  const recordId = selectedBitacora && selectedSession ? `${selectedBitacora.id}-${selectedSession.id}` : '';
  const currentRecord = attendanceRecords.find(r => r.id === recordId);
  const isRegistered = !!currentRecord;
  const canEdit = !isRegistered || isSameDay(parseISO(currentRecord.savedAt), new Date());
  const isLateRegistration = !isRegistered && !selectedSession?.fecha.startsWith(format(new Date(), 'yyyy-MM-dd'));

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-slate-800 tracking-tight">Control de Asistencia</h1>
          <p className="text-slate-500 mt-1 font-medium">Registro diario y seguimiento de participación estudiantil</p>
        </div>
        {!selectedSession && (
          <div className="flex flex-wrap items-center gap-3">
             <div className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-2xl flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
               <Clock size={14} />
               Frecuencia: Diaria
             </div>
             <button 
              onClick={handleSelectTodaySession}
              className="px-6 py-2 bg-academic-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-academic-600/20 hover:bg-academic-700 transition-all active:scale-95 flex items-center gap-2"
             >
                <Calendar size={14} />
                Registrar Sesión de Hoy
             </button>
          </div>
        )}
      </header>

      <AnimatePresence>
        {showTodaySelector && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowTodaySelector(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Sesiones para Hoy</h2>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{format(new Date(), "EEEE dd 'de' MMMM", { locale: es })}</p>
                </div>
                <button onClick={() => setShowTodaySelector(false)} className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors flex items-center justify-center">
                  <XCircle size={20} />
                </button>
              </div>
              <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <p className="text-xs font-black text-academic-500 uppercase tracking-widest mb-4">Selecciona el módulo para registrar asistencia:</p>
                {todayModules.map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => startAttendance(item.bitacora, item.session)}
                    className="w-full p-6 rounded-3xl border border-slate-100 hover:border-academic-500 hover:bg-academic-50/30 transition-all flex items-center gap-6 group text-left"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-academic-50 text-academic-600 flex items-center justify-center font-black group-hover:bg-academic-600 group-hover:text-white transition-all shadow-sm border border-academic-100">
                      <GraduationCap size={28} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-slate-800 leading-tight uppercase group-hover:text-academic-600 transition-colors line-clamp-1">{item.bitacora.moduloNombre}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.bitacora.grupo}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{item.bitacora.turno}</span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-academic-600 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!selectedBitacora ? (
          <motion.div 
            key="selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative group flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-academic-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar bitácora o módulo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-academic-500 transition-all font-medium outline-none"
                />
              </div>
              <button className="flex items-center gap-2 px-5 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-600 font-bold hover:bg-slate-50 transition-all shrink-0">
                <Filter size={18} />
                <span>Filtrar por Carrera</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bitacoras.filter(b => b.moduloNombre.toLowerCase().includes(searchTerm.toLowerCase())).map((b, idx) => (
                <motion.div
                  key={b.id}
                  layoutId={b.id}
                  onClick={() => setSelectedBitacora(b)}
                  className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-academic-200 transition-all cursor-pointer group flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-academic-50 text-academic-600 flex items-center justify-center font-black group-hover:bg-academic-600 group-hover:text-white transition-colors border border-academic-100 shadow-sm">
                      <GraduationCap size={24} />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{b.grupo}</span>
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg uppercase mt-1 inline-block">{b.turno}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-black text-slate-800 leading-tight group-hover:text-academic-600 transition-colors uppercase tracking-tight line-clamp-2">
                       {b.moduloNombre}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 truncate uppercase tracking-widest">{b.carrera}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                       <Users size={14} className="text-slate-300" />
                       32 Alumnos
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-academic-600 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : !selectedSession ? (
          <motion.div 
            key="session_selector"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <button 
              onClick={() => setSelectedBitacora(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-[0.2em] transition-colors"
            >
              <ArrowLeft size={16} />
              Volver a Bitácoras
            </button>

            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col md:flex-row md:items-center gap-8 border-l-[8px] border-l-academic-600">
               <div className="flex-1">
                 <span className="text-[10px] font-black text-academic-500 uppercase tracking-widest mb-1 block">Módulo Seleccionado</span>
                 <h2 className="text-3xl font-display font-black text-slate-800 leading-tight tracking-tight uppercase">{selectedBitacora.moduloNombre}</h2>
                 <div className="flex items-center gap-4 mt-4">
                    <div className="px-3 py-1 bg-slate-50 rounded-xl text-[10px] font-black text-slate-500 uppercase border border-slate-100 tracking-widest">
                      Grupo: {selectedBitacora.grupo}
                    </div>
                    <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase border border-indigo-100 tracking-widest">
                      Turno: {selectedBitacora.turno}
                    </div>
                 </div>
               </div>
               <div className="flex items-center gap-3 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shrink-0">
                  <div className="text-center px-4">
                    <span className="block text-2xl font-black text-slate-800">92%</span>
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Asistencia Avg</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div className="text-center px-4">
                    <span className="block text-2xl font-black text-slate-800">{sessions.length}</span>
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Sesiones</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sessions.map((session: any, idx: number) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedSession(session)}
                  className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg hover:border-academic-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center font-black group-hover:bg-academic-600 group-hover:text-white transition-all transform group-hover:scale-110">
                      {idx + 1}
                    </div>
                    <Calendar size={18} className="text-slate-200 group-hover:text-academic-300" />
                  </div>
                  <p className="text-sm font-black text-slate-800">{session.fecha.split(',')[0]}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sesión Programada</p>
                  
                  <button className="w-full mt-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-academic-600 bg-academic-50 rounded-xl group-hover:bg-academic-600 group-hover:text-white transition-all">
                    Registrar
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-800 p-8 rounded-[3rem] text-white shadow-2xl">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSelectedSession(null)}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">{selectedSession.fecha.split(',')[0]}</h2>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mt-1">{selectedBitacora.moduloNombre}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => canEdit && markAll('P')}
                  disabled={!canEdit}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    canEdit
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white"
                      : "bg-slate-700 text-slate-500 border border-slate-600 cursor-not-allowed opacity-50"
                  )}
                >
                  Asistencia Total
                </button>
                <button 
                  onClick={saveAttendance}
                  disabled={!canEdit}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all",
                    canEdit
                      ? "bg-academic-600 text-white shadow-academic-600/20 hover:bg-academic-700 active:scale-95"
                      : "bg-slate-700 text-slate-500 shadow-none cursor-not-allowed opacity-50"
                  )}
                >
                  <Save size={14} />
                  {isRegistered ? 'Actualizar Registro' : 'Guardar Registro'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Lista de Estudiantes ({groupStudents.length})</h3>
                  <div className={cn(
                    "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border w-fit",
                    canEdit
                      ? isLateRegistration 
                         ? "bg-amber-50 text-amber-600 border-amber-100"
                         : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  )}>
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full", 
                       canEdit ? isLateRegistration ? "bg-amber-500" : "bg-emerald-500 animate-pulse" : "bg-slate-400"
                    )} />
                    {canEdit 
                       ? isLateRegistration ? 'Registro Extemporáneo Disponible' : 'Sesión Abierta para Registro' 
                       : 'Registro Finalizado (Solo Lectura)'}
                  </div>
                  {!canEdit && isRegistered && (
                    <p className="text-[9px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                      <History size={10} />
                      Registrado el: {format(parseISO(currentRecord.savedAt), "dd/MM/yyyy HH:mm")}
                    </p>
                  )}
                </div>
                <div className="relative group max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text" 
                      placeholder="Buscar alumno..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-academic-100 border-none"
                    />
                 </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left border-b border-slate-100">Estudiante</th>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-100">Estado de Asistencia</th>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right border-b border-slate-100">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {groupStudents.map((student, idx) => {
                      return (
                        <tr key={student.id} className="group hover:bg-slate-50/30 transition-colors">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs text-center">
                                  {student.nombre.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-black text-slate-800 leading-none">{student.nombre}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{student.id}</p>
                                </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => canEdit && handleToggleAttendance(student.id, 'P')}
                                disabled={!canEdit}
                                className={cn(
                                  "flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all min-w-[70px]",
                                  attendanceData[student.id] === 'P' 
                                    ? "bg-emerald-50 border-emerald-500 text-emerald-600" 
                                    : "bg-white border-slate-100 text-slate-300",
                                  canEdit ? "hover:border-emerald-200 hover:text-emerald-400 cursor-pointer" : "opacity-50 cursor-not-allowed"
                                )}
                              >
                                <CheckCircle2 size={18} />
                                <span className="text-[8px] font-black uppercase">Presente</span>
                              </button>
                              <button 
                                onClick={() => canEdit && handleToggleAttendance(student.id, 'A')}
                                disabled={!canEdit}
                                className={cn(
                                  "flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all min-w-[70px]",
                                  attendanceData[student.id] === 'A' 
                                    ? "bg-rose-50 border-rose-500 text-rose-600" 
                                    : "bg-white border-slate-100 text-slate-300",
                                  canEdit ? "hover:border-rose-200 hover:text-rose-400 cursor-pointer" : "opacity-50 cursor-not-allowed"
                                )}
                              >
                                <XCircle size={18} />
                                <span className="text-[8px] font-black uppercase">Ausente</span>
                              </button>
                              <button 
                                onClick={() => canEdit && handleToggleAttendance(student.id, 'J')}
                                disabled={!canEdit}
                                className={cn(
                                  "flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all min-w-[70px]",
                                  attendanceData[student.id] === 'J' 
                                    ? "bg-amber-50 border-amber-500 text-amber-600" 
                                    : "bg-white border-slate-100 text-slate-300",
                                  canEdit ? "hover:border-amber-200 hover:text-amber-400 cursor-pointer" : "opacity-50 cursor-not-allowed"
                                )}
                              >
                                <Clock size={18} />
                                <span className="text-[8px] font-black uppercase">Justif.</span>
                              </button>
                            </div>
                          </td>
                          <td className="p-6 text-right">
                            <button className="text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-academic-600 transition-colors">
                              Ver Historial
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                <button className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-600 transition-colors">
                  <FileSpreadsheet size={16} />
                  Descargar Reporte Word/Excel
                </button>
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Presentes: {Object.values(attendanceData).filter(v => v === 'P').length}</span>
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500" /> Ausentes: {Object.values(attendanceData).filter(v => v === 'A').length}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Attendance;
