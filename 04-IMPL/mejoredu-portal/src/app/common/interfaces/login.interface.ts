import { IResponseApi } from './response-api.interface';

export interface ILoginPayload {
  clave: string;
  contrasenha: string;
}

export interface ILoginResponse extends IResponseApi {
  datosUsuario: IDatosUsuario;
}

export interface IDatosUsuario {
  cveUsuario: string;
  csStatus: string;
  correoElectronico: string;
  df_baja: null;
  idTipoUsuario: string; // ADMINISTRADOR, CONSULTOR, ENLACE, PRESUPUESTO, SUPERVISOR
  persona: IPersona;
  roles: IRole[];
  perfilLaboral: IPerfilLaboral;
}

export interface IPersona {
  idPersona: number;
  cxNombre: string;
  cxPrimerApellido: string;
  cxSegundoApellido: string;
  cxCorreo: string;
  dfNacimiento: null;
}

export interface IRole {
  cveFacultad: string;
}

export interface IPerfilLaboral {
  archivoFirma: IArchivoFirma;
  idPerfilLaboral: number;
  ciNumeroEmpledo: string;
  cxPuesto: string;
  cxTelefonoOficina: string;
  cxExtension: string;
  cxDgAdministracion: string;
  cveUsuario: string;
  idCatalogoArea: number;
  csEstatus: string;
  cdNombreUnidad: string;
  cveUnidad: string;
  idCatalogoUnidad: number;
  ixNivel: number;
}

export interface IArchivoFirma {
  idArchivo: number;
  uuid: string;
  uuidToPdf: null;
  nombre: string;
  estatus: string;
  usuario: string;
}
