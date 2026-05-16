import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  BookOpen, 
  GraduationCap, 
  ChevronRight,
  Clock,
  Layers,
  Edit2,
  Trash2,
  Filter,
  Upload,
  FileText,
  X,
  FileSignature,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';

const Modules: React.FC = () => {
  const { modules, setModules } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [activeUnitInDetail, setActiveUnitInDetail] = useState<string | null>(null);
  const [creationTab, setCreationTab] = useState<'manual' | 'upload'>('manual');
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Stepper Form States
  const [moduleForm, setModuleForm] = useState({
    nombre: '',
    codModule: '',
    carrera: 'Ing. Sistemas',
    horaAcademic: 0,
    horaReloj: 0
  });

  const [units, setUnits] = useState([{ id: '1', nombre: '', hr: 0, ha: 0, ponderacion: 0 }]);
  const [activities, setActivities] = useState([{ id: '1', unitId: '1', desc: '', hr: 0, ha: 0 }]);

  const addUnit = () => setUnits([...units, { id: String(Date.now()), nombre: '', hr: 0, ha: 0, ponderacion: 0 }]);
  const addActivity = () => setActivities([...activities, { id: String(Date.now()), unitId: activeUnitInDetail || units[0].id, desc: '', hr: 0, ha: 0 }]);

  const deleteUnit = (id: string) => {
    setUnits(units.filter(u => u.id !== id));
    if (activeUnitInDetail === id) setActiveUnitInDetail(null);
  };

  const deleteActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);

  // Sync changes back to the main modules list
  useEffect(() => {
    if (showDetailModal && selectedModule) {
      setModules(prev => prev.map(m => 
        m.codModule === selectedModule.codModule 
          ? { ...m, ...selectedModule, units, activities } 
          : m
      ));
    }
  }, [selectedModule, units, activities, showDetailModal]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const simulateImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Mock data extracted from the provided PDF "Planeación Didáctica"
      setModuleForm({
        nombre: 'Infraestructura de red',
        codModule: 'MF 180_2',
        carrera: 'Técnico General en Computación',
        horaAcademic: 96,
        horaReloj: 72
      });
      
      const importedUnits = [
        { id: '1', nombre: 'Elementos Básicos de Redes', hr: 12, ha: 16, ponderacion: 15 },
        { id: '2', nombre: 'Modelos de Comunicación', hr: 12, ha: 16, ponderacion: 15 },
        { id: '3', nombre: 'Protocolos de Comunicación', hr: 15, ha: 20, ponderacion: 30 },
        { id: '4', nombre: 'Configuración de Componentes de red', hr: 33, ha: 44, ponderacion: 40 }
      ];
      setUnits(importedUnits);
      
      setActivities([
        { id: '1', unitId: '1', desc: 'A0: Presentación del docente, estudiante y módulo formativo', hr: 1, ha: 1 },
        { id: '2', unitId: '1', desc: 'A1: Clasificación de las redes según su cobertura', hr: 2, ha: 3 },
        { id: '3', unitId: '1', desc: 'A2: Identificación de la topologías de la red', hr: 3, ha: 4 },
        { id: '4', unitId: '1', desc: 'A3: Identificación de los dispositivos de conexiones de la red', hr: 6, ha: 8 },
        { id: '5', unitId: '2', desc: 'A1: Identificación de la arquitectura de los modelos OSI y TCP/IP', hr: 2, ha: 3 },
        { id: '6', unitId: '2', desc: 'A2: Identificación de las capas inferiores del modelo OSI', hr: 2, ha: 3 }
      ]);

      setIsProcessing(false);
      setCreationTab('manual');
      setStep(1); // Return to manual steps to allow review
    }, 2000);
  };

  const handleFinalize = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Create new module object
      const newModule = {
        codModule: moduleForm.codModule || `MOD-00${modules.length + 1}`,
        nombre: moduleForm.nombre || 'Nuevo Módulo',
        totalHoraAcademic: moduleForm.horaAcademic,
        totalHoraReloj: moduleForm.horaReloj || Math.floor(moduleForm.horaAcademic * 0.8),
        carrera: moduleForm.carrera,
        fechaCreacion: new Date().toISOString().split('T')[0]
      };

      setModules([newModule, ...modules]); // Prepend new module
      setIsProcessing(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        closeModal();
      }, 1500);
    }, 1000);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setStep(1);
    setSelectedFile(null);
    setCreationTab('manual');
    setIsSuccess(false);
    // Reset form
    setModuleForm({
      nombre: '',
      codModule: '',
      carrera: 'Ing. Sistemas',
      horaAcademic: 0,
      horaReloj: 0
    });
    setUnits([{ id: '1', nombre: '', hr: 0, ha: 0, ponderacion: 0 }]);
    setActivities([{ id: '1', unitId: '1', desc: '', hr: 0, ha: 0 }]);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800">Módulos Formativos</h1>
          <p className="text-slate-500 mt-1">Gestión centralizada de contenidos y carga horaria</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-academic-600 hover:bg-academic-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-academic-600/20 active:scale-95 sm:w-auto"
        >
          <Plus size={20} />
          Nuevo Módulo
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative group flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-academic-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar módulo o carrera..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-academic-500 transition-all font-medium outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-600 font-bold hover:bg-slate-50 transition-all">
          <Filter size={18} />
          <span>Filtros</span>
        </button>
      </div>

      {/* Modules Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {modules.filter(m => 
          m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
          m.carrera.toLowerCase().includes(searchTerm.toLowerCase())
        ).map((module, idx) => (
          <motion.div
            key={module.codModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-academic-100 transition-all overflow-hidden flex flex-col h-full"
          >
            <div className="p-6 flex-1 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black text-academic-500 uppercase tracking-widest block mb-1">{module.codModule}</span>
                  <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-academic-600 transition-colors uppercase tracking-tight">
                    {module.nombre}
                  </h3>
                </div>
                <div className="shrink-0 p-2.5 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-100">
                  <MoreHorizontal size={18} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100/50 flex items-center gap-2">
                  <GraduationCap size={14} className="text-academic-600" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight truncate max-w-[150px]">
                    {module.carrera}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 flex flex-col gap-1 transition-all group-hover:bg-white group-hover:shadow-sm">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Horas Acad.</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-slate-800">{module.totalHoraAcademic}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">ha</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 flex flex-col gap-1 transition-all group-hover:bg-white group-hover:shadow-sm">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Horas Reloj</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-slate-800">{module.totalHoraReloj}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">hr</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-7 h-7 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center text-[9px] font-black text-slate-400 shadow-sm group-hover:border-academic-50 transition-colors">
                      U{i}
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full bg-academic-600 border-2 border-slate-50 flex items-center justify-center text-[9px] font-black text-white shadow-md">
                    UDs
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50/50 rounded-lg text-[9px] font-black text-indigo-400 uppercase tracking-widest italic border border-indigo-50">
                  <Clock size={10} />
                  Plan {module.fechaCreacion || '24'}
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                setSelectedModule(module);
                setShowDetailModal(true);
                if (module.units && module.units.length > 0) {
                  setUnits(module.units);
                  setActivities(module.activities || []);
                  setActiveUnitInDetail(module.units[0].id);
                } else {
                  const initialUnits = [
                    { id: '1', nombre: 'Unidad 1: Fundamentos', hr: 12, ha: 16, ponderacion: 20 },
                    { id: '2', nombre: 'Unidad 2: Desarrollo', hr: 18, ha: 24, ponderacion: 30 }
                  ];
                  setUnits(initialUnits);
                  setActivities([]);
                  setActiveUnitInDetail('1');
                }
              }}
              className="w-full py-4 bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:bg-academic-600 hover:text-white transition-all flex items-center justify-center gap-2 border-t border-slate-100"
            >
              Gestionar Unidades
              <ChevronRight size={14} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Add Module Modal - MultiStep Stepper */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden shadow-slate-900/20"
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Plan de Módulo Académico</h2>
                    <p className="text-slate-400 text-sm mt-1">Completa los pasos para generar la estructura didáctica</p>
                  </div>
                  <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <X className="text-slate-400" size={24} />
                  </button>
                </div>

                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">¡Módulo Creado!</h2>
                    <p className="text-slate-500 mt-2">La planeación ha sido registrada correctamente.</p>
                  </div>
                ) : (
                  <>
                    {/* Step Indicators */}
                    <div className="flex items-center justify-between mb-12 relative px-4">
                      <div className="absolute top-5 left-8 right-8 h-0.5 bg-slate-100 -z-0" />
                      {[
                        { s: 1, l: 'Módulo' },
                        { s: 2, l: 'Unidades (UD)' },
                        { s: 3, l: 'Actividades' }
                      ].map((item) => (
                        <div key={item.s} className="flex flex-col items-center relative z-10">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all border-4 border-white",
                            step >= item.s ? "bg-academic-600 text-white shadow-lg shadow-academic-600/30" : "bg-slate-100 text-slate-400"
                          )}>
                            {step > item.s ? <CheckCircle2 size={18} /> : item.s}
                          </div>
                          <span className={cn(
                            "mt-2 text-[10px] font-bold uppercase tracking-wider",
                            step >= item.s ? "text-academic-600" : "text-slate-400"
                          )}>{item.l}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Step 1: Module Info */}
                    {step === 1 && (
                      <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-300">
                        <div className="flex gap-2 p-1.5 bg-slate-100/50 w-full rounded-2xl">
                          <button 
                            onClick={() => setCreationTab('manual')}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all",
                              creationTab === 'manual' ? "bg-white text-academic-600 shadow-sm" : "text-slate-400 h-10 hover:text-slate-600"
                            )}
                          >
                            <FileSignature size={18} />
                            Registro Manual
                          </button>
                          <button 
                            onClick={() => setCreationTab('upload')}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all",
                              creationTab === 'upload' ? "bg-white text-academic-600 shadow-sm" : "text-slate-400 h-10 hover:text-slate-600"
                            )}
                          >
                            <Upload size={18} />
                            Importar PDF
                          </button>
                        </div>

                        {creationTab === 'manual' ? (
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Nombre del Módulo</label>
                              <input 
                                type="text" 
                                value={moduleForm.nombre}
                                onChange={(e) => setModuleForm({ ...moduleForm, nombre: e.target.value })}
                                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-academic-600 outline-none font-medium text-slate-700" 
                                placeholder="Ej: Infraestructura de red" 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Código</label>
                              <input 
                                type="text" 
                                value={moduleForm.codModule}
                                onChange={(e) => setModuleForm({ ...moduleForm, codModule: e.target.value })}
                                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-academic-600 outline-none font-medium text-slate-700" 
                                placeholder="MF 180_2" 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Carga Horaria H/A</label>
                              <input 
                                type="number" 
                                value={moduleForm.horaAcademic}
                                onChange={(e) => setModuleForm({ ...moduleForm, horaAcademic: Number(e.target.value) })}
                                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-academic-600 outline-none font-medium text-slate-700" 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Carrera / Programa</label>
                              <select 
                                value={moduleForm.carrera}
                                onChange={(e) => setModuleForm({ ...moduleForm, carrera: e.target.value })}
                                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-academic-600 outline-none font-medium text-slate-700 appearance-none shadow-inner"
                              >
                                <option value="Análisis de Sistemas">Análisis de Sistemas</option>
                                <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                                <option value="Arquitectura de Redes">Arquitectura de Redes</option>
                                <option value="Ciberseguridad">Ciberseguridad</option>
                                <option value="Técnico General en Computación">Técnico General en Computación</option>
                              </select>
                            </div>
                          </div>
                        ) : (
                          <div className="h-64 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:border-academic-500 hover:bg-academic-50 transition-all font-bold" onClick={() => document.getElementById('file-pdf')?.click()}>
                            <input id="file-pdf" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                            {selectedFile ? (
                              <>
                                <FileText size={48} className="text-academic-500 mb-4" />
                                <h4 className="font-bold text-slate-800">{selectedFile.name}</h4>
                                <button onClick={(e) => { e.stopPropagation(); simulateImport(); }} disabled={isProcessing} className="mt-4 px-8 py-3 bg-academic-600 text-white rounded-xl font-bold flex items-center gap-2">
                                  {isProcessing && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                  {isProcessing ? 'Procesando...' : 'Confirmar Importación'}
                                </button>
                              </>
                            ) : (
                              <>
                                <Upload size={48} className="text-slate-200 mb-4" />
                                <h4 className="font-bold text-slate-400">Suelta tu planeación PDF aquí</h4>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 2: Units */}
                    {step === 2 && (
                      <div className="space-y-6 animate-in slide-in-from-right-5 duration-300 max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-slate-700">Listado de Unidades (UD)</h3>
                          <button onClick={addUnit} className="text-academic-600 font-bold text-sm flex items-center gap-1 hover:underline">
                            <Plus size={16} /> Agregar Unidad
                          </button>
                        </div>
                        {units.map((unit, idx) => (
                          <div key={unit.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                            <div className="md:col-span-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">UD {idx + 1}: Denominación</label>
                              <input 
                                type="text" 
                                value={unit.nombre}
                                onChange={(e) => {
                                  const newUnits = [...units];
                                  newUnits[idx].nombre = e.target.value;
                                  setUnits(newUnits);
                                }}
                                className="w-full p-3 bg-white rounded-xl border-none focus:ring-1 focus:ring-academic-500 text-sm font-bold text-slate-700" 
                                placeholder="Ej: Elementos Básicos de Redes"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">H/R</label>
                              <input 
                                type="number" 
                                value={unit.hr}
                                onChange={(e) => {
                                  const newUnits = [...units];
                                  newUnits[idx].hr = Number(e.target.value);
                                  setUnits(newUnits);
                                }}
                                className="w-full p-3 bg-white rounded-xl border-none focus:ring-1 focus:ring-academic-500 text-sm font-bold text-slate-700" 
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Ponderación %</label>
                              <input 
                                type="number" 
                                value={unit.ponderacion}
                                onChange={(e) => {
                                  const newUnits = [...units];
                                  newUnits[idx].ponderacion = Number(e.target.value);
                                  setUnits(newUnits);
                                }}
                                className="w-full p-3 bg-white rounded-xl border-none focus:ring-1 focus:ring-academic-500 text-sm font-bold text-slate-700" 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Step 3: Activities */}
                    {step === 3 && (
                      <div className="space-y-6 animate-in slide-in-from-right-5 duration-300 max-h-[50vh] overflow-y-auto pr-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-slate-700">Actividades de Aprendizaje</h3>
                          <button onClick={addActivity} className="text-academic-600 font-bold text-sm flex items-center gap-1 hover:underline">
                            <Plus size={16} /> Nueva Actividad
                          </button>
                        </div>
                        {activities.map((act, idx) => (
                          <div key={act.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-academic-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                                A{idx + 1}
                              </div>
                              <div className="flex-1">
                                <select 
                                  value={act.unitId}
                                  onChange={(e) => {
                                    const newActs = [...activities];
                                    newActs[idx].unitId = e.target.value;
                                    setActivities(newActs);
                                  }}
                                  className="w-full p-3 bg-white rounded-xl border-none focus:ring-1 focus:ring-academic-500 text-sm font-bold text-slate-700"
                                >
                                  {units.map(u => <option key={u.id} value={u.id}>UD {u.id}: {u.nombre || 'Sin nombre'}</option>)}
                                </select>
                              </div>
                            </div>
                            <input 
                              type="text" 
                              value={act.desc}
                              onChange={(e) => {
                                const newActs = [...activities];
                                newActs[idx].desc = e.target.value;
                                setActivities(newActs);
                              }}
                              className="w-full p-3 bg-white rounded-xl border-none focus:ring-1 focus:ring-academic-500 text-sm font-medium text-slate-700" 
                              placeholder="Descripción de la actividad"
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-white rounded-xl flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Horas H/A</span>
                                <input 
                                  type="number" 
                                  value={act.ha}
                                  onChange={(e) => {
                                    const newActs = [...activities];
                                    newActs[idx].ha = Number(e.target.value);
                                    setActivities(newActs);
                                  }}
                                  className="w-12 text-right font-bold text-academic-600 outline-none" 
                                />
                              </div>
                              <div className="p-3 bg-white rounded-xl flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Horas H/R</span>
                                <input 
                                  type="number" 
                                  value={act.hr}
                                  onChange={(e) => {
                                    const newActs = [...activities];
                                    newActs[idx].hr = Number(e.target.value);
                                    setActivities(newActs);
                                  }}
                                  className="w-12 text-right font-bold text-academic-600 outline-none" 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer Controls */}
                <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-50">
                  <button 
                    onClick={() => setStep(s => Math.max(1, s - 1))}
                    disabled={step === 1}
                    className={cn(
                      "px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all",
                      step === 1 ? "opacity-0 pointer-events-none" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    Anterior
                  </button>
                  <div className="flex items-center gap-4">
                    {step < 3 ? (
                      <button 
                        onClick={() => setStep(s => s + 1)}
                        className="px-10 py-4 bg-academic-600 text-white rounded-2xl font-bold shadow-xl shadow-academic-600/20 active:scale-[0.98] transition-all flex items-center gap-2"
                      >
                        Siguiente Paso
                        <ChevronRight size={18} />
                      </button>
                    ) : (
                      <button 
                        onClick={handleFinalize}
                        disabled={isProcessing}
                        className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
                      >
                        {isProcessing ? 'Guardando...' : 'Finalizar Planeación'}
                        {!isProcessing && <CheckCircle2 size={18} />}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Module Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedModule && (
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
              className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden shadow-slate-900/20 flex flex-col max-h-[90vh]"
            >
              <div className="p-8 md:p-10 border-b border-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 bg-academic-100 rounded-2xl text-academic-700">
                    <BookOpen size={24} />
                  </div>
                  <div className="flex-1">
                    {editingUnitId === 'header' ? (
                      <div className="flex flex-wrap gap-4 items-end animate-in fade-in zoom-in-95">
                        <div className="flex-1 min-w-[300px]">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Nombre del Módulo</label>
                          <input 
                            autoFocus
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-academic-500"
                            value={selectedModule.nombre}
                            onChange={(e) => setSelectedModule({ ...selectedModule, nombre: e.target.value })}
                          />
                        </div>
                        <div className="w-32">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Código</label>
                          <input 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-academic-500"
                            value={selectedModule.codModule}
                            onChange={(e) => setSelectedModule({ ...selectedModule, codModule: e.target.value })}
                          />
                        </div>
                        <button 
                          onClick={() => setEditingUnitId(null)}
                          className="px-4 py-2 bg-academic-600 text-white rounded-xl text-xs font-bold"
                        >
                          Listo
                        </button>
                      </div>
                    ) : (
                      <div className="group flex items-start gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-academic-500 uppercase tracking-widest">{selectedModule.codModule}</span>
                          <h2 className="text-2xl font-bold text-slate-800 leading-tight">{selectedModule.nombre}</h2>
                        </div>
                        <button onClick={() => setEditingUnitId('header')} className="p-2 text-slate-300 hover:text-academic-600 opacity-0 group-hover:opacity-100 transition-all">
                          <Edit2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
                >
                  <X className="text-slate-400" size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                {/* Units List Sidebar */}
                <div className="w-full md:w-96 bg-slate-50/50 border-r border-slate-100 overflow-y-auto p-6 space-y-4">
                  <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Unidades Didácticas</h3>
                    <span className="px-2 py-0.5 bg-academic-100 text-academic-600 rounded text-[9px] font-black">{units.length} Uds</span>
                  </div>
                  {units.map((unit) => (
                    <div key={unit.id} className="group/unit relative">
                      <div
                        onClick={() => setActiveUnitInDetail(unit.id)}
                        className={cn(
                          "w-full text-left p-5 rounded-[2rem] transition-all border-2 pr-12 cursor-pointer relative overflow-hidden",
                          activeUnitInDetail === unit.id 
                            ? "bg-white border-academic-600 shadow-xl shadow-academic-500/10" 
                            : "bg-white border-slate-100 hover:border-academic-200 text-slate-500 hover:shadow-lg"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                            activeUnitInDetail === unit.id 
                              ? "bg-academic-600 text-white border-academic-600" 
                              : "bg-slate-50 text-slate-400 border-slate-100"
                          )}>
                            UD • {unit.ponderacion}%
                          </div>
                          <div className="flex items-center gap-1">
                             <Clock size={10} className="text-slate-300" />
                             <span className="text-[10px] font-black font-mono">{unit.hr}h</span>
                          </div>
                        </div>

                        {editingUnitId === unit.id ? (
                          <div className="space-y-3 animate-in slide-in-from-top-2 relative z-10" onClick={(e) => e.stopPropagation()}>
                            <input 
                              autoFocus
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-academic-500 text-slate-800"
                              value={unit.nombre}
                              onChange={(e) => {
                                const newUnits = units.map(u => u.id === unit.id ? { ...u, nombre: e.target.value } : u);
                                setUnits(newUnits);
                              }}
                            />
                            <div className="flex gap-3">
                              <div className="flex-1">
                                <label className="text-[7px] font-black text-slate-400 uppercase mb-1 block">Horas Reloj</label>
                                <input 
                                  type="number"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] font-black text-academic-600"
                                  value={unit.hr}
                                  onChange={(e) => {
                                    const newUnits = units.map(u => u.id === unit.id ? { ...u, hr: Number(e.target.value) } : u);
                                    setUnits(newUnits);
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <label className="text-[7px] font-black text-slate-400 uppercase mb-1 block">Ponderación %</label>
                                <input 
                                  type="number"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] font-black text-academic-600"
                                  value={unit.ponderacion}
                                  onChange={(e) => {
                                    const newUnits = units.map(u => u.id === unit.id ? { ...u, ponderacion: Number(e.target.value) } : u);
                                    setUnits(newUnits);
                                  }}
                                />
                              </div>
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setEditingUnitId(null); }} 
                              className="w-full py-2 bg-academic-600 hover:bg-academic-700 text-white rounded-xl text-[10px] font-black shadow-lg shadow-academic-500/20 active:scale-95 transition-all"
                            >
                              Guardar Cambios
                            </button>
                          </div>
                        ) : (
                          <p className={cn(
                            "font-black text-sm leading-tight line-clamp-2",
                            activeUnitInDetail === unit.id ? "text-slate-800" : "text-slate-600"
                          )}>
                            {unit.nombre || 'Nueva Unidad Didáctica'}
                          </p>
                        )}
                        
                        {activeUnitInDetail === unit.id && (
                          <motion.div 
                            layoutId="unit-active-indicator"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-academic-600"
                          />
                        )}
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover/unit:opacity-100 transition-all transform translate-x-2 group-hover/unit:translate-x-0 z-20">
                        <button onClick={(e) => { e.stopPropagation(); setEditingUnitId(unit.id); }} className="p-2 bg-white shadow-md border border-slate-100 rounded-xl text-slate-400 hover:text-academic-600 hover:scale-110 transition-all">
                          <Edit2 size={12} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); deleteUnit(unit.id); }} className="p-2 bg-white shadow-md border border-slate-100 rounded-xl text-slate-400 hover:text-rose-500 hover:scale-110 transition-all">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button onClick={addUnit} className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 text-xs font-black uppercase tracking-widest hover:border-academic-300 hover:text-academic-500 hover:bg-academic-50/30 transition-all flex items-center justify-center gap-2">
                    <Plus size={16} />
                    Agregar Nueva Unidad
                  </button>
                </div>

                {/* Activities Content */}
                <div className="flex-1 overflow-y-auto p-8 md:p-10">
                  {activeUnitInDetail ? (
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">
                            Actividades: {units.find(u => u.id === activeUnitInDetail)?.nombre}
                          </h3>
                          <p className="text-sm text-slate-400 mt-1">Carga horaria asignada para esta unidad</p>
                        </div>
                        <button onClick={addActivity} className="p-3 bg-academic-600 text-white rounded-xl shadow-lg shadow-academic-600/20 hover:bg-academic-700 transition-all">
                          <Plus size={20} />
                        </button>
                      </div>

                      <div className="grid gap-4">
                        {activities.filter(a => a.unitId === activeUnitInDetail).length > 0 ? (
                          activities.filter(a => a.unitId === activeUnitInDetail).map((act, idx) => (
                            <motion.div 
                              key={act.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={cn(
                                "p-5 bg-white border rounded-[2rem] shadow-sm flex items-center gap-6 transition-all",
                                editingActivityId === act.id ? "border-academic-400 ring-2 ring-academic-50 shadow-lg" : "border-slate-100"
                              )}
                            >
                              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-slate-400 shrink-0">
                                A{idx + 1}
                              </div>
                              <div className="flex-1">
                                {editingActivityId === act.id ? (
                                  <div className="space-y-3">
                                    <input 
                                      className="w-full p-2 bg-slate-50 rounded-lg text-sm font-bold outline-none border border-slate-200 focus:border-academic-400"
                                      value={act.desc}
                                      onChange={(e) => {
                                        const newActs = activities.map(a => a.id === act.id ? { ...a, desc: e.target.value } : a);
                                        setActivities(newActs);
                                      }}
                                    />
                                    <div className="flex gap-4">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">H/A</span>
                                        <input 
                                          type="number" 
                                          className="w-12 p-1 bg-slate-50 rounded border border-slate-200 text-xs font-bold text-academic-600"
                                          value={act.ha}
                                          onChange={(e) => {
                                            const newActs = activities.map(a => a.id === act.id ? { ...a, ha: Number(e.target.value) } : a);
                                            setActivities(newActs);
                                          }}
                                        />
                                      </div>
                                      <button onClick={() => setEditingActivityId(null)} className="ml-auto px-4 py-1.5 bg-academic-600 text-white rounded-lg text-[10px] font-bold">
                                        Listo
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <p className="font-bold text-slate-700">{act.desc || 'Actividad sin descripción'}</p>
                                    <div className="flex gap-4 mt-2">
                                      <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                        <Clock size={12} /> {act.ha}h Académicas
                                      </span>
                                      <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                        <Clock size={12} /> {act.hr}h Reloj
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => setEditingActivityId(act.id)} className="p-2 text-slate-300 hover:text-academic-600 transition-colors">
                                  <Edit2 size={16} />
                                </button>
                                <button onClick={() => deleteActivity(act.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="py-20 flex flex-col items-center text-center opacity-40">
                            <Layers size={48} className="mb-4" />
                            <p className="font-bold text-slate-400">Sin actividades registradas</p>
                            <button onClick={addActivity} className="mt-4 text-academic-600 font-bold text-sm underline">
                              Comenzar a planificar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                      <Layers size={64} />
                      <p className="font-bold">Selecciona una unidad para ver su planeación</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Modules;
