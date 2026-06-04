import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Layers,
  Users,
  ShieldCheck,
  FolderTree,
  CalendarDays,
  Bell,
  Sliders,
  Terminal,
  Activity,
  Send,
  Download,
  AlertTriangle,
  Flame,
  CheckCircle,
  HelpCircle,
  FileText,
  CalendarRange,
  Smartphone,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  BookOpen,
  Scale
} from 'lucide-react';
import { cn } from '../lib/utils';
import { addDays, isWeekend, format, parseISO, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface Holiday {
  dateStr: string; // MM-DD formatted
  name: string;
}

const PRECONFIGURED_HOLIDAYS: Holiday[] = [
  { dateStr: '01-01', name: 'Año Nuevo' },
  { dateStr: '01-18', name: 'Día de la Autonomía de la Costa Caribe' },
  { dateStr: '02-02', name: 'Día de la Candelaria' },
  { dateStr: '02-21', name: 'Día de la Rebeldía' },
  { dateStr: '05-01', name: 'Día del Trabajador' },
  { dateStr: '05-30', name: 'Día de las Madres' },
  { dateStr: '07-19', name: 'Día del Triunfo de la Revolución' },
  { dateStr: '09-14', name: 'Batalla de San Jacinto' },
  { dateStr: '09-15', name: 'Día de la Independencia de Centroamérica' },
  { dateStr: '11-08', name: 'Aniversario de los Héroes de la Patria' },
  { dateStr: '12-08', name: 'Día de la Gritería / Inmaculada Concepción' },
  { dateStr: '12-25', name: 'Día de Navidad' },
];

interface InatecCase {
  modulo: string;
  codigoGrupo: string;
  horas: number;
  tipo: 'Técnico' | 'Curso';
  horasPorDias: number;
  frecuencia: string;
  periodoStr: string;
  defaultDate: string;
  diasClase: string[]; // (e.g. ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
}

// Scanned document presets (INATEC Masaya 2026)
const INATEC_PRESETS: InatecCase[] = [
  {
    modulo: 'ADMINISTRACION DE SERVICIOS DE RED',
    codigoGrupo: 'TG-15081-02-2026',
    horas: 133,
    tipo: 'Técnico',
    horasPorDias: 7, // 7 horas académicas
    frecuencia: 'Lunes a Viernes 07:00 AM - 12:30 PM (7h / acad)',
    periodoStr: '01/06/2026 Al 25/06/2026',
    defaultDate: '2026-06-01',
    diasClase: ['1', '2', '3', '4', '5'] // Mon=1, Tue=2, ...
  },
  {
    modulo: 'TECNOLOGIAS DIGITALES PARA EL APRENDIZAJE, EL TRABAJO Y LA VIDA',
    codigoGrupo: 'TG-15081-02-2026',
    horas: 98,
    tipo: 'Técnico',
    horasPorDias: 7,
    frecuencia: 'Lunes a Viernes (7h / acad)',
    periodoStr: '03/02/2026 Al 20/02/2026',
    defaultDate: '2026-02-03',
    diasClase: ['1', '2', '3', '4', '5']
  },
  {
    modulo: 'REPARACION DE EQUIPOS DE COMPUTOS',
    codigoGrupo: 'TG-15081-02-2026',
    horas: 180,
    tipo: 'Técnico',
    horasPorDias: 7,
    frecuencia: 'Lunes a Viernes (7h / acad)',
    periodoStr: '03/03/2026 Al 14/04/2026',
    defaultDate: '2026-03-03',
    diasClase: ['1', '2', '3', '4', '5']
  },
  {
    modulo: 'INFRAESTRUCTURA DE RED',
    codigoGrupo: 'TG-14485-02-2026',
    horas: 96,
    tipo: 'Técnico',
    horasPorDias: 10, // Sabatino 10h
    frecuencia: 'Sabados 07:30 AM - 04:15 PM (10h / sab)',
    periodoStr: '07/03/2026 Al 16/05/2026',
    defaultDate: '2026-03-07',
    diasClase: ['6'] // Sat
  },
  {
    modulo: 'SERVICIO DE RED DE AREA LOCAL',
    codigoGrupo: 'TG-14485-02-2026',
    horas: 30,
    tipo: 'Curso',
    horasPorDias: 10,
    frecuencia: 'Sábado (10h / reloj)',
    periodoStr: '07/02/2026 Al 28/02/2026',
    defaultDate: '2026-02-07',
    diasClase: ['6']
  }
];

export default function Planificacion() {
  const [activeSegment, setActiveSegment] = useState<'fases' | 'motor' | 'notificaciones'>('motor');

  // Custom Holidays
  const [customHolidays, setCustomHolidays] = useState<{ date: string; label: string }[]>([
    { date: '2026-06-15', label: 'Asueto Municipal Patronal de Masaya' },
    { date: '2026-07-23', label: 'Efeméride Estudiantil Regional' }
  ]);
  const [newHolidayLabel, setNewHolidayLabel] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState('');

  // Selector Form state (initialized with first Preset: Administración de Servicios de Red)
  const [selectedPresetId, setSelectedPresetId] = useState<number>(0);
  const [customModulo, setCustomModulo] = useState(INATEC_PRESETS[0].modulo);
  const [customGrupo, setCustomGrupo] = useState(INATEC_PRESETS[0].codigoGrupo);
  const [customHoras, setCustomHoras] = useState(INATEC_PRESETS[0].horas);
  const [customTipo, setCustomTipo] = useState<'Técnico' | 'Curso'>(INATEC_PRESETS[0].tipo);
  const [customHorasDia, setCustomHorasDia] = useState(INATEC_PRESETS[0].horasPorDias);
  const [customStartDate, setCustomStartDate] = useState(INATEC_PRESETS[0].defaultDate);
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>(INATEC_PRESETS[0].diasClase);

  // Cascading rule tests
  const [unitCount, setUnitCount] = useState<number>(3);
  const [unitPonderaciones, setUnitPonderaciones] = useState<string[]>(['40', '30', '30']);

  // Notifications Simulator state
  const [notifTeacher, setNotifTeacher] = useState('Ing. Uriel David Picado');
  const [notifModulo, setNotifModulo] = useState('Administración de Servicios de Red');
  const [notifUnit, setNotifUnit] = useState('Unidad I: Conceptos Generales de Enrutamiento');
  const [notifLimitDate, setNotifLimitDate] = useState('2026-06-10');
  const [notifStatus, setNotifStatus] = useState<'🟢 al_dia' | '🟡 proximo' | '🔴 vencido'>('🔴 vencido');
  const [notifSentLog, setNotifSentLog] = useState<{ date: string; channel: string; dest: string; state: string; msg: string }[]>([
    { date: '04/06/2026 09:12 AM', channel: 'WhatsApp', dest: '+505 8888-1122', state: 'Entregado', msg: 'Aviso de vencimiento previo enviado con éxito.' }
  ]);

  // Methods
  const applyPreset = (idx: number) => {
    setSelectedPresetId(idx);
    const p = INATEC_PRESETS[idx];
    setCustomModulo(p.modulo);
    setCustomGrupo(p.codigoGrupo);
    setCustomHoras(p.horas);
    setCustomTipo(p.tipo);
    setCustomHorasDia(p.horasPorDias);
    setCustomStartDate(p.defaultDate);
    setSelectedWeekdays(p.diasClase);
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayDate || !newHolidayLabel) return;
    setCustomHolidays(prev => [...prev, { date: newHolidayDate, label: newHolidayLabel }]);
    setNewHolidayDate('');
    setNewHolidayLabel('');
  };

  const removeHoliday = (index: number) => {
    setCustomHolidays(prev => prev.filter((_, i) => i !== index));
  };

  const toggleWeekday = (day: string) => {
    if (selectedWeekdays.includes(day)) {
      if (selectedWeekdays.length > 1) {
        setSelectedWeekdays(prev => prev.filter(d => d !== day));
      }
    } else {
      setSelectedWeekdays(prev => [...prev, day]);
    }
  };

  // Ponderaciones methods
  const changePonderacion = (idx: number, val: string) => {
    const updated = [...unitPonderaciones];
    updated[idx] = val;
    setUnitPonderaciones(updated);
  };

  const totalPonderacion = useMemo(() => {
    return unitPonderaciones.reduce((sum, p) => sum + (parseFloat(p) || 0), 0);
  }, [unitPonderaciones]);

  // Core intelligence calculation: schedule & holiday skipping
  const checkIsHoliday = (date: Date) => {
    const mmDd = format(date, 'MM-dd');
    const isPreconfigured = PRECONFIGURED_HOLIDAYS.some(h => h.dateStr === mmDd);
    if (isPreconfigured) {
      const match = PRECONFIGURED_HOLIDAYS.find(h => h.dateStr === mmDd);
      return { isHoliday: true, name: match?.name || 'Feriado Nacional' };
    }

    const yyyyMmDd = format(date, 'yyyy-MM-dd');
    const isCustom = customHolidays.some(h => h.date === yyyyMmDd);
    if (isCustom) {
      const match = customHolidays.find(h => h.date === yyyyMmDd);
      return { isHoliday: true, name: match?.label || 'Asueto Metodológico' };
    }

    // Easter (Holy Thursday & Friday in 2026 fall in early April: April 2 & April 3)
    if (date.getFullYear() === 2026) {
      if (mmDd === '04-02') return { isHoliday: true, name: 'Jueves Santo (Feriado Nacional)' };
      if (mmDd === '04-03') return { isHoliday: true, name: 'Viernes Santo (Feriado Nacional)' };
    }

    return { isHoliday: false, name: '' };
  };

  const calculatedSchedule = useMemo(() => {
    let current = parseISO(customStartDate);
    let hoursRemaining = Number(customHoras);
    const hoursPerDay = Number(customHorasDia);
    const schedule: any[] = [];
    let limit = 700; // anti infinite loop

    while (hoursRemaining > 0 && limit > 0) {
      limit--;
      // What day of week? (0-6 representation, where 0=Sunday, 1=Monday, 6=Saturday)
      const dayOfWeek = current.getDay().toString();
      const isWeekendDay = isWeekend(current);
      const isConfiguredDay = selectedWeekdays.includes(dayOfWeek);

      // Check holidays
      const holidayStatus = checkIsHoliday(current);

      if (holidayStatus.isHoliday) {
        schedule.push({
          date: new Date(current),
          type: 'Holiday',
          label: holidayStatus.name,
          used: 0,
          left: hoursRemaining
        });
        current = addDays(current, 1);
        continue;
      }

      if (isWeekendDay && !isConfiguredDay) {
        current = addDays(current, 1);
        continue;
      }

      if (!isConfiguredDay) {
        current = addDays(current, 1);
        continue;
      }

      // Valid session day!
      const sessionsHours = Math.min(hoursPerDay, hoursRemaining);
      hoursRemaining -= sessionsHours;
      schedule.push({
        date: new Date(current),
        type: 'Class',
        label: `Encuentro Docente Académico`,
        used: sessionsHours,
        left: hoursRemaining
      });
      current = addDays(current, 1);
    }

    return schedule;
  }, [customStartDate, customHoras, customHorasDia, selectedWeekdays, customHolidays]);

  // Derive estimated deliveries (e.g. at 30% and 100% of duration)
  const documentMilestones = useMemo(() => {
    if (calculatedSchedule.length === 0) return [];
    const classDaysOnly = calculatedSchedule.filter(s => s.type === 'Class');
    if (classDaysOnly.length === 0) return [];

    const midIdx = Math.floor(classDaysOnly.length * 0.35);
    const endIdx = classDaysOnly.length - 1;

    return [
      {
        documento: 'Cuaderno Metodológico de Unidad I',
        fechaEstimada: classDaysOnly[midIdx]?.date,
        tipo: 'Unidad',
        estado: 'Automático'
      },
      {
        documento: 'Portafolio e Instrumento de Evaluación Parcial',
        fechaEstimada: classDaysOnly[Math.min(midIdx + 3, endIdx)]?.date,
        tipo: 'Unidad / Evaluación',
        estado: 'Pendiente'
      },
      {
        documento: 'Entrega de Cuaderno de Módulo Completo',
        fechaEstimada: classDaysOnly[endIdx]?.date,
        tipo: 'Cierre de Módulo',
        estado: 'Sugerido por el sistema'
      }
    ];
  }, [calculatedSchedule]);

  const handleSimulateWhatsApp = () => {
    const timestamp = format(new Date(), 'dd/MM/yyyy h:mm a');
    setNotifSentLog(prev => [
      {
        date: timestamp,
        channel: 'WhatsApp Directo',
        dest: '+505 8888-1122',
        state: 'Enviado',
        msg: `Recordatorio enviado a ${notifTeacher} para el módulo de "${notifModulo}".`
      },
      ...prev
    ]);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-16 px-1 sm:px-0">
      
      {/* Header Widget */}
      <header className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(99,102,241,0.12),_transparent_50%)]" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <span className="px-2.5 py-1 text-[9px] font-black tracking-widest text-[#a5b4fc] bg-indigo-500/15 border border-indigo-500/30 rounded-full uppercase inline-flex items-center gap-1">
              <Sparkles size={10} className="animate-pulse" /> PLAN DE CONSTRUCCIÓN & MEJORA METODOLÓGICA
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white leading-none">
              EduPlan Docente
            </h1>
            <p className="text-slate-400 text-xs font-semibold max-w-3xl leading-relaxed">
              Consola interactiva que integra el plan de trabajo metodológico estructurado en 8 fases, junto al algoritmo inteligente de dosificación docente que procesa asuetos y genera cronogramas de asimilación del centro tecnológico.
            </p>
          </div>

          <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 p-4 rounded-2xl flex items-center gap-3 shrink-0">
            <Activity className="text-emerald-400 animate-pulse" size={20} />
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Coordinador Principal</p>
              <p className="text-xs font-black text-white truncate">Metodólogo INATEC</p>
            </div>
          </div>
        </div>
      </header>

      {/* Nav Segments */}
      <div className="flex bg-white p-1 border border-slate-150 rounded-2xl gap-1 overflow-x-auto justify-start shadow-sm">
        <button
          onClick={() => setActiveSegment('motor')}
          className={cn(
            "px-4 py-2.5 text-[10.5px] font-black uppercase tracking-widest rounded-xl transition-all shrink-0 flex items-center gap-1.5",
            activeSegment === 'motor' 
              ? "bg-slate-900 text-white shadow" 
              : "text-slate-500 hover:text-slate-705 hover:bg-slate-50"
          )}
        >
          <CalendarDays size={13} />
          Dosificación Académica & Frecuencias
        </button>

        <button
          onClick={() => setActiveSegment('notificaciones')}
          className={cn(
            "px-4 py-2.5 text-[10.5px] font-black uppercase tracking-widest rounded-xl transition-all shrink-0 flex items-center gap-1.5",
            activeSegment === 'notificaciones' 
              ? "bg-slate-900 text-white shadow" 
              : "text-slate-500 hover:text-slate-705 hover:bg-slate-50"
          )}
        >
          <Bell size={13} />
          Alertas, WhatsApp & Requisitos
        </button>

        <button
          onClick={() => setActiveSegment('fases')}
          className={cn(
            "px-4 py-2.5 text-[10.5px] font-black uppercase tracking-widest rounded-xl transition-all shrink-0 flex items-center gap-1.5",
            activeSegment === 'fases' 
              ? "bg-slate-900 text-white shadow" 
              : "text-slate-500 hover:text-slate-705 hover:bg-slate-50"
          )}
        >
          <Layers size={13} />
          Fases de Implementación (Plan)
        </button>
      </div>

      {/* Segment Rendering */}
      <AnimatePresence mode="wait">
        
        {/* Segment fases: Visual Builder Flow Tracker of Phase 1 - 8 */}
        {activeSegment === 'fases' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Estructura del Proyecto y Fases Técnicas</h2>
                <p className="text-slate-500 text-xs font-semibold mt-0.5">El camino hacia la automatización metodológica del área escolar.</p>
              </div>

              {/* Progress and status summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Capas Arquitectura</p>
                  <p className="text-xs font-bold text-slate-800 mt-1.5">Clean Architecture (Dominio, Capas, Datos)</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Gestor de Estado</p>
                  <p className="text-xs font-bold text-indigo-700 mt-1.5">Riverpod / React Context asíncrono</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Principios Core</p>
                  <p className="text-xs font-bold text-emerald-700 mt-1.5">Offline-first con Drift + Cache Activo</p>
                </div>
              </div>

              {/* Step-by-Step interactive Roadmap */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Phase 1 */}
                <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase">Fase 1</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">Análisis y Definición</h3>
                  <p className="text-[11px] text-slate-500 font-semibold leading-normal">
                    Lista final de requerimientos, reglas del negocio metodológico y definición del modelo relacional preliminar de docentes e INATEC.
                  </p>
                </div>

                {/* Phase 2 */}
                <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase">Fase 2</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">Diseño Funcional</h3>
                  <p className="text-[11px] text-slate-500 font-semibold leading-normal">
                    Mapa de pantallas interactivas para login, bitácoras académicas semanales, catálogo de módulos y semáforo visual de retrasos.
                  </p>
                </div>

                {/* Phase 3 */}
                <div className="p-4 rounded-2xl border border-slate-100 bg-indigo-55/15 border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-full uppercase">Fase 3</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                  </div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">Base de Datos & Repositorios</h3>
                  <p className="text-[11px] text-indigo-900 font-semibold leading-normal">
                    Esquemas de tablas para docentes, programas académicos, cursos, módulos, unidades directas y bitácora inmutable de envíos de alerta.
                  </p>
                </div>

                {/* Phase 4 */}
                <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">Fase 4</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  </div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">Desarrollo del Núcleo Operativo</h3>
                  <p className="text-[11px] text-slate-500 font-semibold leading-normal">
                    Implementación de las reglas de dosificación de clases por oferta, relacionando las unidades a su respectiva carrera.
                  </p>
                </div>

                {/* Phase 5 */}
                <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">Fase 5</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  </div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">Automatización de Alertas</h3>
                  <p className="text-[11px] text-slate-500 font-semibold leading-normal">
                    Programación asíncrona de recordatorios y pasarela piloto de conexión directa vía API a WhatsApp Business local.
                  </p>
                </div>

                {/* Phase 6 */}
                <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">Fase 6</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  </div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">Informes & Exportaciones</h3>
                  <p className="text-[11px] text-slate-500 font-semibold leading-normal">
                    Generación de PDF con filtros cruzados y exportación a Excel del estado de entregas y mora de la plantilla metodológica.
                  </p>
                </div>
              </div>
            </div>

            {/* Crucial Improvements Checkpoints */}
            <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                <ShieldCheck size={18} className="text-indigo-600" /> Mejoras recomendadas incorporadas al plan
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100 space-y-1">
                  <h4 className="text-xs font-black text-indigo-950 uppercase tracking-tight">1. Distinción Técnico / Curso</h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Permite parametrizar de forma separada horas de 45 minutos (Técnicos) de las horas de 60 minutos (Cursos cortos).</p>
                </div>
                <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 space-y-1">
                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-tight">2. Estados de Control Integrados</h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Mapeo del ciclo de vida de cada docente (Activo/Inactivo) y estado del cuaderno de módulo (Pendiente/Entregado/Aprobado).</p>
                </div>
                <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-100 space-y-1">
                  <h4 className="text-xs font-black text-amber-950 uppercase tracking-tight">3. Trazabilidad de Auditoría</h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Los registros graban el identificador del metodólogo que aprueba, previniendo alteraciones de fechas del calendario.</p>
                </div>
                <div className="p-3 bg-rose-50/40 rounded-xl border border-rose-100 space-y-1">
                  <h4 className="text-xs font-black text-rose-950 uppercase tracking-tight">4. Validaciones Cascadas</h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Bloqueo inmediato si la suma de ponderación de las unidades del módulo no es exactamente de 100%, ó excede las horas reloj totales.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Segment motor: Core schedule calculator using real image presets */}
        {activeSegment === 'motor' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-6"
          >
            {/* Presets Grid representing INATEC Masaya Scanned Document */}
            <div className="bg-white p-5 rounded-3xl border border-slate-150 shadow-sm space-y-3.5">
              <div>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-750 text-[8px] font-black uppercase tracking-widest rounded-md border border-indigo-100 inline-block mb-1">
                  Casos Reales Extraídos: INATEC Centro Tecnológico de Masaya
                </span>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Documentación Oficial de Asignación de Horas (2026)</h3>
                <p className="text-xs text-slate-450 font-bold">Haga clic en cualquiera de estas filas del memorándum real para auto-cargar sus configuraciones y correr la simulación metodológica:</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {INATEC_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(idx)}
                    className={cn(
                      "p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 hover:shadow-md",
                      selectedPresetId === idx 
                        ? "bg-indigo-50/60 border-indigo-500 ring-1 ring-indigo-500/20" 
                        : "bg-slate-50/50 border-slate-200/80 hover:bg-slate-50"
                    )}
                  >
                    <div className="space-y-1.5 w-full">
                      <div className="flex justify-between items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tight",
                          p.tipo === 'Técnico' ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-850"
                        )}>
                          {p.tipo}
                        </span>
                        <span className="font-mono text-[8px] font-black text-slate-400">{p.codigoGrupo}</span>
                      </div>
                      <h4 className="font-extrabold text-[11px] text-slate-805 leading-tight truncate uppercase block w-full">{p.modulo}</h4>
                      <p className="text-[10px] text-slate-450 font-bold leading-none">{p.frecuencia}</p>
                    </div>

                    <div className="flex justify-between items-center w-full pt-2 border-t border-slate-100 mt-2.5">
                      <span className="text-[10px] font-black text-slate-500">{p.horas} Horas Totales</span>
                      <span className="text-[9px] font-bold text-indigo-650 font-mono tracking-tighter">{p.periodoStr}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* The Dynamic Configurator & Simulator Side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Config Panel (5 cols) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4 lg:col-span-5">
                <div>
                  <h3 className="text-xs font-black text-slate-850 uppercase tracking-tight mb-0.5">Parámetros del Simulador de Calendario</h3>
                  <p className="text-[9.5px] text-slate-450 font-bold uppercase tracking-wider">Ajuste manualmente o refine la exclusión</p>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-450 uppercase block">Nombre del Módulo o Asignatura</label>
                    <input
                      type="text"
                      value={customModulo}
                      onChange={(e) => setCustomModulo(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-450 uppercase block">Código Grupo / Código</label>
                      <input
                        type="text"
                        value={customGrupo}
                        onChange={(e) => setCustomGrupo(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-450 uppercase block">Tipo Modalidad</label>
                      <select
                        value={customTipo}
                        onChange={(e) => setCustomTipo(e.target.value as any)}
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-bold text-slate-705"
                      >
                        <option value="Técnico">Técnico (Académicos)</option>
                        <option value="Curso">Curso (Reloj)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-450 uppercase block">Horas Totales Módulo</label>
                      <input
                        type="number"
                        min="5"
                        max="350"
                        value={customHoras}
                        onChange={(e) => setCustomHoras(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-black text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-450 uppercase block">Dosis diaria (Horas/Día)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={customHorasDia}
                        onChange={(e) => setCustomHorasDia(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-black text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-450 uppercase block">Fecha de Inicio del Módulo</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-bold text-slate-8次"
                    />
                  </div>

                  {/* Frequencies Weekdays selector */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-450 uppercase block">Días de Clase de la Frecuencia</label>
                    <div className="flex gap-1 flex-wrap pt-0.5">
                      {[
                        { key: '1', label: 'Lun' },
                        { key: '2', label: 'Mar' },
                        { key: '3', label: 'Mié' },
                        { key: '4', label: 'Jue' },
                        { key: '5', label: 'Vie' },
                        { key: '6', label: 'Sáb' }
                      ].map(d => {
                        const active = selectedWeekdays.includes(d.key);
                        return (
                          <button
                            key={d.key}
                            type="button"
                            onClick={() => toggleWeekday(d.key)}
                            className={cn(
                              "flex-1 min-w-[42px] py-2 text-[10px] font-black rounded-lg transition-all border",
                              active 
                                ? "bg-slate-900 border-slate-900 text-white shadow-sm" 
                                : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            )}
                          >
                            {d.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Municipal Holidays Manager */}
                  <div className="pt-3.5 border-t border-slate-100 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-slate-450 uppercase">Asuetos Locales / Feriados</span>
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-[8px] font-bold rounded text-emerald-700 uppercase">Procesados</span>
                    </div>

                    <form onSubmit={handleAddHoliday} className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Ej. Pausa Patronal"
                        value={newHolidayLabel}
                        onChange={(e) => setNewHolidayLabel(e.target.value)}
                        className="flex-1 px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold placeholder:text-slate-400"
                      />
                      <input
                        type="date"
                        required
                        value={newHolidayDate}
                        onChange={(e) => setNewHolidayDate(e.target.value)}
                        className="w-28 px-2 py-1 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold"
                      />
                      <button
                        type="submit"
                        className="p-1 px-2.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0"
                      >
                        <Plus size={14} />
                      </button>
                    </form>

                    {/* Quick chips holiday list */}
                    <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto pr-1">
                      {customHolidays.map((h, i) => (
                        <div key={i} className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-xl border border-emerald-150 flex items-center gap-1">
                          <span className="truncate max-w-[100px]">{h.label}</span>
                          <span className="text-[8px] font-mono opacity-80 shrink-0">({h.date.split('-').slice(1).join('/')})</span>
                          <button
                            type="button"
                            onClick={() => removeHoliday(i)}
                            className="text-emerald-950 font-bold hover:text-rose-600 transition-colors shrink-0 ml-0.5"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {customHolidays.length === 0 && (
                        <span className="text-[10px] text-slate-400 italic">No hay asuetos registrados previamente.</span>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Output Results Panel (7 cols) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4 lg:col-span-7">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-black text-slate-850 uppercase tracking-tight">Cronograma de Encuentros Resultantes</h3>
                    <p className="text-[10px] text-indigo-600 font-bold uppercase mt-0.5">El motor omite automáticamente fines de semana y feriados</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-slate-400 uppercase block">Cierre Calculado</span>
                    <span className="text-xs font-black font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 inline-block mt-0.5">
                      {calculatedSchedule.length > 0 
                        ? format(calculatedSchedule[calculatedSchedule.length - 1].date, 'dd/MM/yyyy') 
                        : '--/--/----'
                      }
                    </span>
                  </div>
                </div>

                {/* Timeline Slots */}
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                  {calculatedSchedule.map((slot, index) => {
                    const isClass = slot.type === 'Class';
                    const isHoliday = slot.type === 'Holiday';

                    return (
                      <div
                        key={index}
                        className={cn(
                          "p-2.5 rounded-xl border flex items-center justify-between transition-all",
                          isClass && "bg-white border-slate-150 shadow-sm first:ring-1 first:ring-indigo-500/30",
                          isHoliday && "bg-rose-50/55 border-rose-100 text-rose-800"
                        )}
                      >
                        <div className="min-w-0">
                          <span className="font-extrabold text-[11px] text-slate-800 block">
                            {format(slot.date, "EEEE, dd 'de' MMMM", { locale: es })}
                          </span>
                          <span className="text-[9px] text-slate-450 font-bold block mt-0.5">
                            {isClass ? `Encuentro acadético #${calculatedSchedule.slice(0, index + 1).filter(s => s.type === 'Class').length}` : `Saltado por Feriado: ${slot.label}`}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          {isClass ? (
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-150 rounded text-[9.5px] font-black font-mono">
                              +{slot.used}h ({slot.left} pend.)
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 border border-rose-150 rounded text-[8px] font-black uppercase tracking-wider">
                              OMITIDO
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {calculatedSchedule.length === 0 && (
                    <p className="text-center text-slate-400 italic text-xs py-8">Configure al menos un día a la semana para iniciar el motor de dosificación.</p>
                  )}
                </div>

                {/* Derived expected Requisitos Documentales */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex justify-between items-center flex-wrap gap-1">
                    <span className="text-[9.5px] font-black text-slate-800 uppercase tracking-tight">Hitos Documentales Programados Automáticamente:</span>
                    <span className="px-1.5 py-0.5 bg-amber-50 text-[8px] font-bold rounded text-amber-700 border border-amber-100">Diferenciador Exclusivo</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {documentMilestones.map((m, i) => (
                      <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col justify-between space-y-2">
                        <div>
                          <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">{m.tipo}</p>
                          <h4 className="font-extrabold text-[10px] text-slate-800 leading-tight mt-1">{m.documento}</h4>
                        </div>
                        <div className="pt-1.5 border-t border-slate-150">
                          <p className="text-[8px] font-black text-slate-400 uppercase leading-none">Fecha de Entrega</p>
                          <p className="text-[10px] font-mono font-black text-slate-700 mt-0.5">
                            {m.fechaEstimada ? format(m.fechaEstimada, 'dd/MM/yyyy') : 'N/A'}
                          </p>
                        </div>
                      </div>
                    ))}
                    {documentMilestones.length === 0 && (
                      <p className="text-[10px] text-slate-400 italic">No hay hitos disponibles.</p>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* Segment notificaciones: WhatsApp testing template & early warnings */}
        {activeSegment === 'notificaciones' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-6"
          >
            {/* Semantic early warnings indicators */}
            <div className="bg-white p-5 rounded-3xl border border-slate-150 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Reglas de Alerta Temprana (Semáforo Metodológico)</h3>
                <p className="text-slate-450 text-xs font-semibold mt-0.5">Definición de estados para el control de entrega oportuna de Cuadernos Metodológicos.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex gap-3.5 items-start">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 shadow-emerald-500/20 shadow-md shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-emerald-950 uppercase">🟢 Entrega al día</h4>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">La fecha esperada está a más de 3 días calendarios o ya se registró el cuaderno de unidad como recibido.</p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex gap-3.5 items-start">
                  <span className="w-4 h-4 rounded-full bg-amber-400 shadow-amber-400/20 shadow-md shrink-0 mt-0.5 animate-pulse" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-amber-950 uppercase">🟡 Próxima a Vencer</h4>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Faltan menos de 72 horas para la fecha planeada por el motor, disparando alertas automáticas preventivas.</p>
                  </div>
                </div>

                <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex gap-3.5 items-start">
                  <span className="w-4 h-4 rounded-full bg-rose-500 shadow-rose-500/20 shadow-md shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-rose-950 uppercase">🔴 Entrega Vencida</h4>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">La fecha límite calculada ha expirado sin carga de cuaderno. El docente queda marcado en mora institucional.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Omnichannel simulation playground */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* WhatsApp Config parameters (7 cols) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4 lg:col-span-7">
                <div>
                  <h3 className="text-xs font-black text-slate-850 uppercase tracking-tight">Control del Canal WhatsApp Business</h3>
                  <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Configure variables de alerta y envíe mensajes virtuales</p>
                </div>

                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-450 uppercase block">Nombre Docente Destinatario</label>
                      <input
                        type="text"
                        value={notifTeacher}
                        onChange={(e) => setNotifTeacher(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-450 uppercase block">Módulo Asociado</label>
                      <input
                        type="text"
                        value={notifModulo}
                        onChange={(e) => setNotifModulo(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-bold text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-450 uppercase block">Requisito a Recordar</label>
                      <input
                        type="text"
                        value={notifUnit}
                        onChange={(e) => setNotifUnit(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-450 uppercase block">Fecha Clave de Entrega</label>
                      <input
                        type="date"
                        value={notifLimitDate}
                        onChange={(e) => setNotifLimitDate(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-bold text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-450 uppercase block">Estado Alerta Semáforo</label>
                    <div className="flex gap-2">
                      {(['🟢 al_dia', '🟡 proximo', '🔴 vencido'] as const).map(st => {
                        const active = notifStatus === st;
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setNotifStatus(st)}
                            className={cn(
                              "flex-1 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all",
                              active && st === '🟢 al_dia' && "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm",
                              active && st === '🟡 proximo' && "bg-amber-50 border-amber-300 text-amber-800 shadow-sm",
                              active && st === '🔴 vencido' && "bg-rose-50 border-rose-300 text-rose-800 shadow-sm",
                              !active && "bg-slate-50 border-slate-200 text-slate-450 hover:bg-slate-100"
                            )}
                          >
                            {st.replace('_', ' ')}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulateWhatsApp}
                    className="w-full py-2.5 bg-[#25d366] hover:bg-[#20ba59] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5"
                  >
                    <Send size={12} fill="currentColor" />
                    Enviar Recordatorio Directo WhatsApp
                  </button>
                </div>

                {/* Simulated transmission log */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Registros de Envíos (Bitácora Inmutable)</span>
                    <span className="text-[8px] text-slate-400 font-mono font-bold">Respuesta del Servidor API</span>
                  </div>

                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {notifSentLog.map((log, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-400 space-y-1">
                        <div className="flex justify-between items-center text-[9px] text-slate-405 font-bold">
                          <span>{log.date}</span>
                          <span className="text-emerald-500">CANAL: {log.channel}</span>
                        </div>
                        <p className="text-slate-200 leading-snug">{log.msg}</p>
                        <p className="text-[9px] text-slate-500 font-bold">Destino: {log.dest} | Estado: {log.state}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Smartphone Mock (5 cols) */}
              <div className="bg-[#f0f2f5] border border-slate-200 p-4 rounded-[40px] flex flex-col justify-between max-w-[340px] mx-auto lg:col-span-5 aspect-[9/18] shadow-lg relative overflow-hidden shrink-0">
                
                {/* Simulated Camera & Speaker bar */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-2xl flex justify-center items-center gap-1.5 z-20">
                  <div className="w-1.5 h-1.5 bg-slate-850 rounded-full" />
                  <div className="w-10 h-1 bg-slate-850 rounded" />
                </div>

                {/* WhatsApp header */}
                <div className="bg-[#075e54] text-white p-3 pt-7 pb-2.5 flex items-center gap-2 border-b border-emerald-900 shrink-0 z-10">
                  <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-black text-[9px] uppercase shadow">
                    IN
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black leading-none uppercase">Área de Metodología</h4>
                    <p className="text-[8px] text-emerald-100 mt-1 font-semibold">Técnico General Masaya - INATEC</p>
                  </div>
                </div>

                {/* Chat feed */}
                <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 bg-[#efeae2]">
                  
                  {/* System message */}
                  <p className="text-center text-[8px] text-slate-450 font-bold bg-[#e1f3fc] p-1.5 px-3 rounded-xl max-w-[85%] mx-auto shadow-sm leading-normal">
                    Este chat simula el recordatorio directo al celular del metodólogo e INATEC.
                  </p>

                  {/* Incoming template message mock */}
                  <div className="p-3 bg-white text-slate-800 rounded-xl shadow-sm text-[11px] font-semibold space-y-2 max-w-[90%] border-l-[3px] border-l-[#25d366]">
                    <p className="font-extrabold text-[#075e54] text-[10.5px]">Estimado docente {notifTeacher}:</p>
                    
                    <p className="text-slate-650 leading-relaxed font-semibold">
                      Se le recuerda que el <span className="font-black text-slate-900">{notifUnit}</span> de la asignatura de <span className="underline decoration-indigo-200 decoration-2 font-black">{notifModulo}</span> debe ser entregado antes del <span className="text-rose-600 font-extrabold font-mono tracking-tight">{notifLimitDate.split('-').reverse().join('/')}</span>.
                    </p>

                    <p className="text-slate-500 font-bold text-[9px]">
                      Estado del Semáforo Académico: {notifStatus === '🟢 al_dia' ? '🟢 AL DÍA' : notifStatus === '🟡 proximo' ? '🟡 PRÓXIMO A VENCER' : '🔴 VENCIDO EN SISTEMA'}
                    </p>

                    <p className="text-[10px] italic font-black text-slate-750 font-sans border-t border-slate-100 pt-1"> ÁREA DE METODOLOGÍA INATEC </p>
                  </div>

                </div>

                {/* Mock keyboard placeholder */}
                <div className="bg-[#f0f2f5] p-2 flex gap-1.5 items-center justify-between border-t border-slate-200 shrink-0">
                  <div className="flex-1 bg-white p-1.5 rounded-3xl text-[9px] text-slate-400 font-semibold px-3 border border-slate-100">
                    Mensaje redactado...
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#075e54] text-white flex items-center justify-center shadow">
                    <Send size={11} fill="currentColor" />
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
