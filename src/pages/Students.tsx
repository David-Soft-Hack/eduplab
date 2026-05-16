import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Plus, 
  MoreHorizontal, 
  UserPlus, 
  Mail, 
  GraduationCap,
  X,
  Edit2,
  Trash2,
  CheckCircle2,
  UserCheck,
  UserMinus,
  Filter,
  FileSpreadsheet,
  Upload,
  AlertCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';
import * as XLSX from 'xlsx';

const Students: React.FC = () => {
  const { students, setStudents } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [form, setForm] = useState({ id: '', nombre: '', email: '', carrera: '', grupo: '', estado: 'Activo' });
  const [isImporting, setIsImporting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        const newStudents = data.map((item: any, idx: number) => ({
          id: item.ID || `STU-IMP-${students.length + idx + 1}`,
          nombre: item.Nombre || item.nombre || 'Sin nombre',
          email: item.Email || item.email || '',
          carrera: item.Carrera || item.carrera || '',
          grupo: item.Grupo || item.grupo || '',
          estado: 'Activo',
          fechaRegistro: new Date().toISOString().split('T')[0]
        }));

        setStudents([...students, ...newStudents]);
        alert(`¡Éxito! Se han importado ${newStudents.length} estudiantes.`);
      } catch (error) {
        console.error("Error al procesar Excel:", error);
        alert("Error al procesar el archivo. Asegúrate de que sea un formato válido.");
      } finally {
        setIsImporting(false);
        e.target.value = ''; // Reset input
      }
    };
    reader.readAsBinaryString(file);
  };

  const filteredStudents = students.filter(s => 
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? { ...form } : s));
    } else {
      const newStudent = {
        ...form,
        id: `STU-00${students.length + 1}`,
        fechaRegistro: new Date().toISOString().split('T')[0]
      };
      setStudents([...students, newStudent]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingStudent(null);
    setForm({ id: '', nombre: '', email: '', carrera: '', grupo: '', estado: 'Activo' });
  };

  const openEdit = (student: any) => {
    setEditingStudent(student);
    setForm({ ...student });
    setShowAddModal(true);
  };

  const toggleStatus = (id: string) => {
    setStudents(students.map(s => {
      if (s.id === id) {
        return { ...s, estado: s.estado === 'Activo' ? 'Baja' : 'Activo' };
      }
      return s;
    }));
  };

  const deleteStudent = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este estudiante?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800">Directorio de Estudiantes</h1>
          <p className="text-slate-500 mt-1">Gestión académica y seguimiento de matriculados</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative group">
            <label className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95 cursor-pointer">
              <Upload size={20} className="text-academic-600" />
              <span>Importar Excel</span>
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                className="hidden" 
                onChange={handleFileUpload}
                disabled={isImporting}
              />
            </label>
            <div className="absolute top-full left-0 mt-2 w-64 p-3 bg-slate-800 text-white text-[10px] rounded-xl font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl">
              Columnas requeridas: <span className="text-academic-400">Nombre, Email, Carrera, Grupo</span>. El ID es opcional.
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-academic-600 text-white rounded-2xl font-bold shadow-lg shadow-academic-600/20 hover:bg-academic-700 transition-all active:scale-95"
          >
            <UserPlus size={20} />
            <span>Registrar Estudiante</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre, ID o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-academic-500/20 focus:border-academic-500 transition-all font-medium text-slate-700"
                />
              </div>
              <div className="flex gap-2">
                <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
                  <Filter size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estudiante</th>
                    <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grupo</th>
                    <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Carrera</th>
                    <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fecha Registro</th>
                    <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</th>
                    <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.map((student, idx) => (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-academic-50 text-academic-600 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-110 transition-transform">
                            {student.nombre.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-none">{student.nombre}</p>
                            <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">{student.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="px-3 py-1 bg-academic-50 text-academic-700 rounded-lg text-xs font-bold border border-academic-100">
                          {student.grupo || 'N/A'}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className="text-sm font-bold text-slate-600">{student.carrera}</span>
                      </td>
                      <td className="p-5 text-sm text-slate-500 font-medium">
                        {student.fechaRegistro}
                      </td>
                      <td className="p-5">
                        <span className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                          student.estado === 'Activo' 
                            ? "bg-emerald-50 text-emerald-600" 
                            : "bg-rose-50 text-rose-600"
                        )}>
                          {student.estado}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => openEdit(student)}
                            className="p-2 text-slate-400 hover:text-academic-600 hover:bg-academic-50 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => toggleStatus(student.id)}
                            className={cn(
                              "p-2 rounded-lg transition-all",
                              student.estado === 'Activo' 
                                ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50" 
                                : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                            )}
                            title={student.estado === 'Activo' ? 'Dar de Baja' : 'Reincorporar'}
                          >
                            {student.estado === 'Activo' ? <UserMinus size={16} /> : <UserCheck size={16} />}
                          </button>
                          <button 
                            onClick={() => deleteStudent(student.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredStudents.length === 0 && (
              <div className="p-12 text-center text-slate-400 italic">
                No se encontraron estudiantes para "{searchTerm}"
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-academic-50 text-academic-600 rounded-[1.5rem] flex items-center justify-center mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{students.length}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Estudiantes Totales</p>
          </div>

          <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-[1.5rem] flex items-center justify-center mb-4">
              <UserCheck size={32} />
            </div>
            <h3 className="text-2xl font-bold text-emerald-800">{students.filter(s => s.estado === 'Activo').length}</h3>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">Activos</p>
          </div>

          <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2.5rem] flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-[1.5rem] flex items-center justify-center mb-4">
              <UserMinus size={32} />
            </div>
            <h3 className="text-2xl font-bold text-rose-800">{students.filter(s => s.estado === 'Baja').length}</h3>
            <p className="text-xs font-bold text-rose-600 uppercase tracking-widest mt-1">Baja Laboral/Estud.</p>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{editingStudent ? 'Editar Estudiante' : 'Nuevo Estudiante'}</h2>
                  <p className="text-slate-500 text-sm">Completa la información del alumno</p>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-2xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                    <input 
                      required
                      type="text"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      className="w-full px-5 py-4 mt-2 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-academic-500 focus:bg-white transition-all font-bold text-slate-700"
                      placeholder="Ej. Juan Pérez García"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                    <input 
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-5 py-4 mt-2 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-academic-500 focus:bg-white transition-all font-bold text-slate-700"
                      placeholder="alumno@instituto.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Carrera / Programa</label>
                      <select
                        required
                        value={form.carrera}
                        onChange={(e) => setForm({ ...form, carrera: e.target.value })}
                        className="w-full px-5 py-4 mt-2 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-academic-500 focus:bg-white transition-all font-bold text-slate-700 appearance-none"
                      >
                        <option value="">Carrera</option>
                        <option value="Análisis de Sistemas">Análisis de Sistemas</option>
                        <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                        <option value="Arquitectura de Redes">Arquitectura de Redes</option>
                        <option value="Ciberseguridad">Ciberseguridad</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Grupo Académico</label>
                      <input 
                        required
                        type="text"
                        value={form.grupo}
                        onChange={(e) => setForm({ ...form, grupo: e.target.value })}
                        className="w-full px-5 py-4 mt-2 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-academic-500 focus:bg-white transition-all font-bold text-slate-700"
                        placeholder="Ej. 32323"
                      />
                    </div>
                  </div>
                  {editingStudent && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Estado Administrativo</label>
                      <div className="flex gap-2 mt-2">
                        {['Activo', 'Baja'].map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setForm({ ...form, estado: st })}
                            className={cn(
                              "flex-1 py-3 rounded-xl font-bold transition-all border-2",
                              form.estado === st 
                                ? "bg-academic-600 text-white border-academic-600 shadow-md" 
                                : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                            )}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full py-5 bg-academic-600 text-white rounded-[1.5rem] font-bold shadow-xl shadow-academic-600/20 hover:bg-academic-700 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={20} />
                    {editingStudent ? 'Actualizar Datos' : 'Registrar Estudiante'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Students;
