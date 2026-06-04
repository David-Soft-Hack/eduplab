import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_MODULES } from '../lib/utils';

interface AppContextType {
  modules: any[];
  setModules: React.Dispatch<React.SetStateAction<any[]>>;
  bitacoras: any[];
  setBitacoras: React.Dispatch<React.SetStateAction<any[]>>;
  teachers: any[];
  setTeachers: React.Dispatch<React.SetStateAction<any[]>>;
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
  const [teachers, setTeachers] = useState<any[]>([
    { id: 'DOC-001', nombre: 'Ing. Carlos Mendoza', email: 'carlos.mendoza@instituto.edu', telefono: '50683019284', carrera: 'Análisis de Sistemas', especialidad: 'Bases de Datos', estado: 'Activo', fechaRegistro: '2025-01-10' },
    { id: 'DOC-002', nombre: 'MSc. Elena Rostova', email: 'elena.rostova@instituto.edu', telefono: '50688776655', carrera: 'Ingeniería de Sistemas', especialidad: 'Arquitectura de Software', estado: 'Activo', fechaRegistro: '2023-05-15' },
    { id: 'DOC-003', nombre: 'Lic. Roberto Quirós', email: 'roberto.quiros@instituto.edu', telefono: '50670123456', carrera: 'Análisis de Sistemas', especialidad: 'Metodología Ágil', estado: 'Activo', fechaRegistro: '2024-03-20' },
    { id: 'DOC-004', nombre: 'Dra. Sylvia Salazar', email: 'sylvia.salazar@instituto.edu', telefono: '50687654321', carrera: 'Ciencia de Datos', especialidad: 'Inteligencia Artificial', estado: 'Activo', fechaRegistro: '2024-08-01' },
  ]);

  return (
    <AppContext.Provider value={{ 
      modules, setModules, 
      bitacoras, setBitacoras, 
      teachers, setTeachers,
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
