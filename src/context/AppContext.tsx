import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_MODULES } from '../lib/utils';

interface AppContextType {
  modules: any[];
  setModules: React.Dispatch<React.SetStateAction<any[]>>;
  bitacoras: any[];
  setBitacoras: React.Dispatch<React.SetStateAction<any[]>>;
  students: any[];
  setStudents: React.Dispatch<React.SetStateAction<any[]>>;
  attendanceRecords: any[];
  setAttendanceRecords: React.Dispatch<React.SetStateAction<any[]>>;
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<any[]>(MOCK_MODULES);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [bitacoras, setBitacoras] = useState<any[]>([
    { 
      id: 'B-2026-1', 
      grupo: '32323', 
      moduloId: 'MOD-002',
      moduloNombre: 'Base de Datos I',
      carrera: 'Análisis de Sistemas',
      turno: 'Mañana',
      estado: 'Activo',
      progreso: 0,
      actual: 'Fundamentos de BD y Modelo E-R',
      fechaInicio: '2026-05-14',
      horario: { dias: ['Jueves', 'Viernes', 'Lunes'], horasSesion: 4 },
      calendar: [
        {
          id: 'S-1',
          fecha: '2026-05-14',
          horas: 4,
          actividades: [
            { id: '1', unitId: 1, desc: 'Fundamentos de BD y Modelo E-R', hoursInSession: 4 }
          ]
        },
        {
          id: 'S-2',
          fecha: '2026-05-15',
          horas: 4,
          actividades: [
            { id: '1', unitId: 1, desc: 'Fundamentos de BD y Modelo E-R', hoursInSession: 4 }
          ]
        },
        {
          id: 'S-3',
          fecha: '2026-05-18',
          horas: 4,
          actividades: [
            { id: '1', unitId: 1, desc: 'Fundamentos de BD y Modelo E-R', hoursInSession: 4 }
          ]
        },
        {
          id: 'S-4',
          fecha: '2026-05-19',
          horas: 4,
          actividades: [
            { id: '1', unitId: 1, desc: 'Fundamentos de BD y Modelo E-R', hoursInSession: 4 }
          ]
        }
      ]
    }
  ]);
  const [students, setStudents] = useState<any[]>([
    { id: 'STU-001', nombre: 'Juan Pérez', email: 'juan.perez@example.com', carrera: 'Análisis de Sistemas', grupo: '32323', estado: 'Activo', fechaRegistro: '2024-01-10' },
    { id: 'STU-002', nombre: 'María García', email: 'maria.garcia@example.com', carrera: 'Ingeniería de Sistemas', grupo: '32323', estado: 'Activo', fechaRegistro: '2024-02-15' },
    { id: 'STU-003', nombre: 'Carlos Rodríguez', email: 'carlos.rodriguez@example.com', carrera: 'Análisis de Sistemas', grupo: 'G-200', estado: 'Baja', fechaRegistro: '2024-03-20' },
  ]);

  return (
    <AppContext.Provider value={{ 
      modules, setModules, 
      bitacoras, setBitacoras, 
      students, setStudents,
      attendanceRecords, setAttendanceRecords,
      notifications, setNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
