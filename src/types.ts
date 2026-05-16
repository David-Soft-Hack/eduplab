export enum TipoCarrera {
  TECNICA = "Técnica",
  CURSO = "Curso",
}

export enum EstadoBitacora {
  ACTIVO = "Activo",
  FINALIZADO = "Finalizado",
  SIN_CALENDARIO = "Sin Calendario",
}

export interface Module {
  codModule: string;
  nombre: string;
  totalHoraAcademic: number;
  totalHoraReloj: number;
  carrera: string;
  fechaCreacion: string;
}

export interface Unit {
  codUnit: string;
  nombre: string;
  totalHoraAcademic: number;
  totalHoraReloj: number;
  ponderacion: number;
  idModule: string;
}

export interface Activity {
  codActivity: string;
  descripcion: string;
  totalHoraAcademic: number;
  totalHoraReloj: number;
  idUnit: string;
}

export interface Bitacora {
  id: string;
  frecuenciaClase: string;
  fechaInicio: string;
  fechaFinal: string;
  fechasFeriadas: string[];
  codigoGrupo: string;
  diasClase: string[];
  carrera: string;
  tipoCarrera: TipoCarrera;
  idModule: string;
  estado: EstadoBitacora;
}

export interface CalendarioBitacora {
  id: string;
  idBitacora: string;
  codUnidad: string;
  codActividad: string;
  fechaProgramada: string;
  estadoImpartido: boolean;
  horaImpartir: string;
}
