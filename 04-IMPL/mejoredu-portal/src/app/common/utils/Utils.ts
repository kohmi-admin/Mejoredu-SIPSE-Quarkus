import { COLORS } from '@common/chart/enums/colors.enum';
import { DOCUMENT_TYPES } from '@common/enums/documentTypes.enum';
import { IItemCatalogoResponse } from '@common/interfaces/catalog.interface';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { IItemProjectsResponse } from '@common/interfaces/projects.interface';
import { IResponseConsultarProductos } from '@common/interfaces/seguimiento/avances.interface';
import { IItemConsultaSolicitudResponse } from '@common/interfaces/seguimiento/consultaSolicitud';
/* import { IAdecuacionesSeguimientoResponse } from '@common/interfaces/seguimiento/solicitudSeguimiento'; */
import { IRubricaPayload } from '@common/interfaces/validation.interface';
import * as moment from 'moment';
import * as SecureLS from 'secure-ls';
import { MODIFICATION_TYPE_ABBREVIATION } from 'src/app/follow/spaa/adecuaciones/requests/request/enum/modification.enum';

const getOptions = (options: any[]) => {
  const ls = new SecureLS({ encodingType: 'aes' });
  const dataUser: IDatosUsuario = ls.get('dUaStEaR');
  const idTipoUsuario = dataUser.idTipoUsuario;
  for (const item of options) {
    if (!item.roles || item.roles?.includes(idTipoUsuario)) {
      item.enable = true;
    }
  }
  return options;
};

const getGlobalStatus = (status: string, tipoUsuario?: string) => {
  let returnStatus = '';
  switch (status) {
    case 'A':
      returnStatus = 'Activo';
      break;
    case 'B':
      returnStatus = 'Bloqueado';
      break;
    case 'C':
      returnStatus = 'Completo';
      break;
    case 'D':
      returnStatus = 'Revisado';
      break;
    case 'E':
      if (tipoUsuario === 'SUPERVISOR') {
        returnStatus = 'En Proceso de Validación';
      } else {
        returnStatus = 'En Proceso de Revisión';
      }
      break;
    case 'I':
      returnStatus = 'Incompleto';
      break;
    case 'L':
      returnStatus = 'Formalizado';
      break;
    case 'O':
      returnStatus = 'Aprobado';
      break;
    case 'P':
      returnStatus = 'Por Revisar';
      break;
    case 'R':
      returnStatus = 'Rechazado';
      break;
    case 'T':
      returnStatus = 'Terminado';
      break;
    case 'U':
      returnStatus = 'Rubrica';
      break;
    case 'V':
      returnStatus = 'Validación técnica';
      break;
    case 'Z':
      returnStatus = 'Cumplido';
      break;
    case '1':
      returnStatus = '1er Revisión';
      break;
    case '2':
      returnStatus = '2da Revisión';
      break;
    case '3':
      returnStatus = '3ra Revisión';
      break;
    default:
      returnStatus = 'Otro';
      break;
  }
  return returnStatus;
};

const getGlobalStatusSeguimiento = (
  status: string | number,
  type: 'string' | 'number',
  tipoUsuario?: string
) => {
  let returnStatus;
  switch (status) {
    case 'G': // COMMENT: Guardar Avance
    case 2236: // COMMENT: Guardar Avance
      returnStatus = type === 'string' ? 'Pre-registro' : 2236;
      break;
    case 'S': // COMMENT: Finalizar Solicitud
    case 2237: // COMMENT: Finalizar Solicitud
      returnStatus = type === 'string' ? 'Registrado' : 2237;
      break;
    case 'P': // COMMENT: Por revisar la Solicitud
    case 92672: // COMMENT: Por revisar la Solicitud
      returnStatus = type === 'string' ? 'Por revisar' : 92672;
      break;
    case 'E': // COMMENT: Enviar a Revision
    case 2238: // COMMENT: Enviar a Revision
      returnStatus = type === 'string' ? 'En Revisión' : 2238;
      break;
    case 'R':
    case 2239:
      returnStatus = type === 'string' ? 'Rechazado' : 2239;
      break;
    case 'V': // COMMENT: Validado o Aprobado
    case 2240:
      returnStatus = type === 'string' ? 'Validado' : 2240;
      break;
    case 'F': // COMMENT: Formulado o Formalizado
    case 2241:
      returnStatus = type === 'string' ? 'Formalizado' : 2241;
      break;
    case 'B':
    case 2242:
      returnStatus = type === 'string' ? 'Eliminado' : 2242;
      break;
    case 'M':
    case 2243:
      returnStatus = type === 'string' ? 'Aprobación cambio de MIR' : 2243;
      break;
    case 'U':
    case 2244:
      returnStatus = type === 'string' ? 'Rubricado' : 2244;
      break;
    case 'L':
    case 2271:
      returnStatus = type === 'string' ? 'Revisado' : 2271;
      break;
    default:
      returnStatus = 'Otro';
      break;
  }
  return returnStatus;
};

const getTotalRubrics = (listRubrics: IRubricaPayload[]): string => {
  if (listRubrics?.length > 0) {
    const total = listRubrics.reduce(
      (acumulador, actual) => acumulador + actual.ixPuntuacion,
      0
    );
    return `${Math.trunc((total * 100) / 15)}%`;
  } else {
    return '0%';
  }
};

const getBeautifulDate = (date: string) => {
  return moment(date).format('L');
};

const getPorcentaje = (
  totalList: any[] | number,
  key: string,
  totalCalcularPorcentaje: number
): number => {
  let response = 0;
  if (typeof totalList === 'number') {
    response = (totalCalcularPorcentaje * 100) / totalList;
  } else if (totalList?.length) {
    const total = totalList.reduce(
      (acumulador, actual) => acumulador + (actual[key] ?? 0),
      0
    );
    response = (totalCalcularPorcentaje * 100) / total;
  }
  return +response.toFixed(2);
  // return Math.trunc(response);
};

const getListColors = () => {
  return [
    COLORS.blue,
    COLORS.golden,
    COLORS.green,
    COLORS.orange,
    COLORS.purple,
    COLORS.red,
    COLORS.yellow,
  ];
};

const parseMoneyFormat = (value: number): string => {
  return value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
};

const getCveProyecto = ({
  yearNav,
  cveUnidad,
  cveProyecto,
}: {
  yearNav?: string;
  cveUnidad?: string;
  cveProyecto: number;
}) => {
  const ls = new SecureLS({ encodingType: 'aes' });
  let year = '';
  if (yearNav) {
    year = yearNav.length === 2 ? `00${yearNav}` : yearNav;
  } else {
    const yearNavLs = ls.get('yearNav');
    year = yearNavLs;
  }
  let cve = '';
  if (cveUnidad) {
    cve = cveUnidad;
  } else {
    const dataUser = ls.get('dUaStEaR');
    cve = dataUser?.perfilLaboral?.cveUnidad ?? '';
  }
  year = String(year).substring(2, 4);
  cve = String(cve).substring(0, 1);
  return `${year}${cve}${cveProyecto}`;
};

const getNumeroActividad = (number: number): string => {
  return number?.toString().padStart(2, '0');
};

const getNumeroProducto = (number: number): string => {
  return number?.toString().padStart(2, '0');
};

const getNumeroAccion = (number: number): string => {
  return number?.toString().padStart(2, '0');
};

const getNumeroNivelEducativo = (number: number): string => {
  return number?.toString().padStart(2, '0');
};

const getCveActividad = ({
  numeroActividad,
  cveProyecto,
  projectSelected,
  cveUnidad,
}: {
  projectSelected?: any;
  cveProyecto?: number;
  cveUnidad?: string;
  numeroActividad: number;
}) => {
  let cveProyectoFull = '';
  const cveProyectoL = cveProyecto ?? projectSelected?.clave;
  const cveUnidadL = cveUnidad ?? projectSelected?.claveUnidad;
  if (cveProyectoL && cveUnidadL) {
    cveProyectoFull = getCveProyecto({
      cveProyecto: +cveProyectoL,
      cveUnidad: cveUnidadL,
    });
  }
  return `${cveProyectoFull}-${getNumeroActividad(numeroActividad)}`;
};

const getCveProducto = ({
  projectSelected,
  activitySelected,
  productSelected,
  catCategoria,
  catTipoProducto,
  idCategorizacion,
  idTipoProducto,
  cveProducto,
  cveActividad,
  cveProyecto,
  cveUnidad,
  formatCveProducto,
}: {
  catTipoProducto: IItemCatalogoResponse[];
  catCategoria: IItemCatalogoResponse[];
  formatCveProducto?: string;
  projectSelected?: IItemProjectsResponse;
  activitySelected?: any;
  productSelected?: any;
  cveProyecto?: number; // agregar en caso que no se envie projectSelected o que no lo contenga
  cveUnidad?: string; // agregar en caso que no se envie projectSelected o que no lo contenga
  cveActividad?: number; // agregar en caso que no se envie activitySelected o que no lo contenga
  cveProducto?: number; // agregar en caso que no se envie productSelected o que no lo contenga
  idCategorizacion?: number; // agregar en caso que no se envie productSelected o que no lo contenga
  idTipoProducto?: number; // agregar en caso que no se envie productSelected o que no lo contenga
}) => {
  const formatClaveProducto = formatCveProducto ?? '0000-00-00-0-00';
  const arrClaveProducto = formatClaveProducto.split('-');

  // COMMENT: Clave del proyecto
  const cveProyectoL = cveProyecto ?? projectSelected?.clave;
  const cveUnidadL = cveUnidad ?? projectSelected?.claveUnidad;
  if (cveProyectoL && cveUnidadL) {
    const claveProyecto = getCveProyecto({
      cveProyecto: +cveProyectoL,
      cveUnidad: cveUnidadL,
    });
    arrClaveProducto[0] = String(claveProyecto);
  }

  // COMMENT: Clave de la actividad
  const claveActividad = cveActividad ?? activitySelected?.cveActividad;
  if (activitySelected || claveActividad) {
    arrClaveProducto[1] = getNumeroActividad(claveActividad);
  }

  // COMMENT: Clave del producto
  const cveProductoL = cveProducto ?? productSelected?.cveProducto;
  if (cveProductoL) {
    arrClaveProducto[2] = getNumeroProducto(cveProductoL);
  }

  // COMMENT: Categorización del producto
  const idCategorizacionProductoL =
    idCategorizacion ?? productSelected.idCategorizacion;
  if (idCategorizacionProductoL) {
    const findedCategorizacion = catCategoria.filter(
      (item) => item.idCatalogo === idCategorizacionProductoL
    );
    if (findedCategorizacion?.length > 0) {
      arrClaveProducto[3] = `${findedCategorizacion[0].ccExterna}`;
    }
  }

  // COMMENT: Tipo del producto
  const idTipoProductoL = idTipoProducto ?? productSelected.idTipoProducto;
  if (idTipoProductoL) {
    const findedTipoProducto = catTipoProducto.filter(
      (item) => item.idCatalogo === idTipoProductoL
    );
    if (findedTipoProducto?.length > 0) {
      arrClaveProducto[4] = `${findedTipoProducto[0].ccExterna}`;
    }
  }

  return arrClaveProducto.join('-');
};

const getCveProductoSequimiento = ({
  projectSelected,
  activitySelected,
  productSelected,
  catCategoria,
  catTipoProducto,
  idCategorizacion,
  idTipoProducto,
  cveProducto,
  cveActividad,
  cveProyecto,
  cveUnidad,
  formatCveProducto,
}: {
  catTipoProducto: IItemCatalogoResponse[];
  catCategoria: IItemCatalogoResponse[];
  formatCveProducto?: string;
  projectSelected?: IItemProjectsResponse;
  activitySelected?: any;
  productSelected?: IResponseConsultarProductos;
  cveProyecto?: number; // agregar en caso que no se envie projectSelected o que no lo contenga
  cveUnidad?: string; // agregar en caso que no se envie projectSelected o que no lo contenga
  cveActividad?: number; // agregar en caso que no se envie activitySelected o que no lo contenga
  cveProducto?: number; // agregar en caso que no se envie productSelected o que no lo contenga
  idCategorizacion?: number; // agregar en caso que no se envie productSelected o que no lo contenga
  idTipoProducto?: number; // agregar en caso que no se envie productSelected o que no lo contenga
}) => {
  const formatClaveProducto = formatCveProducto ?? '0000-000-00-0-00';
  const arrClaveProducto = formatClaveProducto.split('-');

  // COMMENT: Clave del proyecto
  const cveProyectoL = cveProyecto ?? projectSelected?.clave;
  const cveUnidadL = cveUnidad ?? projectSelected?.claveUnidad;
  if (cveProyectoL && cveUnidadL) {
    const claveProyecto = getCveProyecto({
      cveProyecto: +cveProyectoL,
      cveUnidad: cveUnidadL,
    });
    arrClaveProducto[0] = String(claveProyecto);
  }

  // COMMENT: Clave de la actividad
  const claveActividad = cveActividad ?? activitySelected?.cveActividad;
  if (activitySelected) {
    arrClaveProducto[1] = getNumeroActividad(claveActividad);
  }

  // COMMENT: Clave del producto
  const cveProductoL = cveProducto ?? productSelected?.cveProducto;
  if (cveProductoL) {
    arrClaveProducto[2] = `${cveProductoL}`;
  }

  // COMMENT: Categorización del producto
  const idCategorizacionProductoL =
    idCategorizacion ?? productSelected?.idCategorizacion;
  if (idCategorizacionProductoL) {
    const findedCategorizacion = catCategoria.filter(
      (item) => item.idCatalogo === idCategorizacionProductoL
    );
    if (findedCategorizacion?.length > 0) {
      arrClaveProducto[3] = `${findedCategorizacion[0].ccExterna}`;
    }
  }

  // COMMENT: Tipo del producto
  const idTipoProductoL = idTipoProducto ?? productSelected?.idTipoProducto;
  if (idTipoProductoL) {
    const findedTipoProducto = catTipoProducto.filter(
      (item) => item.idCatalogo === idTipoProductoL
    );
    if (findedTipoProducto?.length > 0) {
      arrClaveProducto[4] = `${findedTipoProducto[0].ccExterna}`;
    }
  }

  return arrClaveProducto.join('-');
};

const getCveAccion = ({
  cveAccion,
  projectSelected,
  activitySelected,
  productSelected,
  catCategoria,
  catTipoProducto,
  idCategorizacion,
  idTipoProducto,
  cveProducto,
  cveActividad,
  cveProyecto,
  cveUnidad,
}: {
  cveAccion: number;
  catTipoProducto: IItemCatalogoResponse[];
  catCategoria: IItemCatalogoResponse[];
  projectSelected?: IItemProjectsResponse;
  activitySelected?: any;
  productSelected?: any;
  cveProyecto?: number; // agregar en caso que no se envie projectSelected o que no lo contenga
  cveUnidad?: string; // agregar en caso que no se envie projectSelected o que no lo contenga
  cveActividad?: number; // agregar en caso que no se envie activitySelected o que no lo contenga
  cveProducto?: number; // agregar en caso que no se envie productSelected o que no lo contenga
  idCategorizacion?: number; // agregar en caso que no se envie productSelected o que no lo contenga
  idTipoProducto?: number; // agregar en caso que no se envie productSelected o que no lo contenga
}) => {
  const cveProductoTmp = getCveProducto({
    projectSelected,
    activitySelected,
    productSelected,
    catCategoria,
    catTipoProducto,
    idCategorizacion,
    idTipoProducto,
    cveProducto,
    cveActividad,
    cveProyecto,
    cveUnidad,
  });
  return `${cveProductoTmp}-${getNumeroAccion(cveAccion)}`;
};

const getIdAdecuancionSolicitud = ({
  selectedSolicitud,
  tipoApartado,
  tipoModificacion,
}: {
  selectedSolicitud?: IItemConsultaSolicitudResponse;
  tipoApartado: number;
  tipoModificacion: number;
}): number => {
  const ls = new SecureLS({ encodingType: 'aes' });
  let tmpSelectedSolicitud!: IItemConsultaSolicitudResponse;
  if (selectedSolicitud) {
    tmpSelectedSolicitud = selectedSolicitud;
  } else {
    tmpSelectedSolicitud = ls.get('selectedSolicitud');
  }
  let idAdecuacionSolicitud = 0;
  const finded = tmpSelectedSolicitud.adecuaciones.filter(
    (item) => item.idTipoApartado === tipoApartado
  );
  if (finded.length) {
    const findedHijo = finded[0].tiposModificaciones.filter(
      (item) => item.idTipoModificacion === tipoModificacion
    );
    if (findedHijo.length) {
      idAdecuacionSolicitud = findedHijo[0].idAdecuacionSolicitud;
    }
  }
  return idAdecuacionSolicitud;
};

const getTiposModificacion = (adecuaciones: any[]): string => {
  let tmpTypes: any[] = [];
  for (const item of adecuaciones) {
    for (const key in MODIFICATION_TYPE_ABBREVIATION) {
      if (Object.hasOwn(MODIFICATION_TYPE_ABBREVIATION, key)) {
        const element = MODIFICATION_TYPE_ABBREVIATION[key];
        const finded = item.tiposModificaciones.filter(
          (itemFilter) => itemFilter.idTipoModificacion === element.status
        );
        if (finded.length) {
          tmpTypes.push(element.abreviation);
        }
      }
    }
  }
  tmpTypes = [...new Set(tmpTypes)];
  return tmpTypes.join('-');
};

const blobToB64 = (blob: any) => {
  return new Promise<string>((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      let base64String: any = reader.result ?? '';
      resolve(base64String.substring(base64String.indexOf(', ') + 1));
    };
    reader.onerror = (error: any) => reject(error);
  });
};

const downloadBlob = (blob: any, fileName: string) => {
  const link = window.document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const fileToBlob = (file: File) => {
  return new Blob([file], { type: file.type });
};

const downloadInputFile = (file: File) => {
  const newBlob = fileToBlob(file);
  downloadBlob(newBlob, file.name);
};

const getBase64Image = (url: string): Promise<any> => {
  return fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
};

const getFileType = (fileName: string): number => {
  const arrayExt = ['jpg', 'png', 'gif', 'jpeg'];
  const arrayName = fileName.split('.');
  const fileExt = arrayName[arrayName.length - 1];
  if (fileExt) {
    return arrayExt.includes(fileExt)
      ? DOCUMENT_TYPES.image
      : DOCUMENT_TYPES.document;
  } else {
    return 0;
  }
};

const getTxtFileContent = (file: any) => {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = (e: any) => {
      const contenido = e.target.result;
      resolve(contenido);
    };
    lector.readAsText(file);
    lector.onerror = (e: any) => {
      reject(e);
    };
  });
};

const getCanEdit = (year?: number): boolean => {
  const ls = new SecureLS({ encodingType: 'aes' });
  const yearNav = year ?? ls.get('yearNav');
  const previousYearToEdit = 2;
  const nextYearToEdit = 2;
  let canEdit: boolean = false;
  const yearDate: number = new Date().getFullYear();
  if (
    yearNav >= yearDate - previousYearToEdit &&
    yearNav <= yearDate + nextYearToEdit
  ) {
    canEdit = true;
  }
  return canEdit;
};

const getFormatDataForGeneralView = ({
  proyectoService,
  selectedProject,
  catAlcance,
  catCategoria,
  catTipoProducto,
}: {
  proyectoService: any;
  selectedProject: any;
  catAlcance: IItemCatalogoResponse[];
  catCategoria: IItemCatalogoResponse[];
  catTipoProducto: IItemCatalogoResponse[];
}) => {
  const tmpArr: any[] = [];
  if (proyectoService.cveProgramaInstitucional?.length) {
    for (const item of proyectoService.cveProgramaInstitucional) {
      const tmpActivities: any[] = [];
      if (item.actividad?.length) {
        for (const itemActivity of item.actividad) {
          const tmpProduts: any[] = [];
          if (itemActivity.productos?.length) {
            for (const itemProduct of itemActivity.productos) {
              const tmpBudges: any[] = [];
              if (itemProduct.presupuestos?.length) {
                for (const itemBudges of itemProduct.presupuestos) {
                  let tmpPartidasGasto: any[] = [];
                  if (itemBudges.cxPartidaGasto?.calendarizacion?.length) {
                    tmpPartidasGasto = getPartidasGasto(
                      itemBudges.cxPartidaGasto.calendarizacion
                    );
                  }

                  tmpBudges.push({
                    clave: getNumeroAccion(itemBudges.cveAccion),
                    nombre: itemBudges.cxNombrePresupuesto,
                    partidasGasto: tmpPartidasGasto,
                  });
                }
              }

              tmpProduts.push({
                numeroProducto: itemProduct.cveProducto,
                claveCompleta: getCveProducto({
                  catCategoria: catCategoria,
                  catTipoProducto: catTipoProducto,
                  projectSelected: selectedProject,
                  activitySelected: itemActivity,
                  cveProducto: +itemProduct.cveProducto,
                  idCategorizacion: itemProduct.cveCategorizacionProducto,
                  idTipoProducto: itemProduct.cveTipoProducto,
                }),
                nombre: itemProduct.cxNombreProducto,
                categoria: itemProduct.categoria,
                tipo: itemProduct.tipo,
                cveIndicadorMIR:
                  itemProduct.cveIndicadorMIR === '0'
                    ? ''
                    : itemProduct.cveIndicadorMIR,
                indicadorMIR:
                  itemProduct.indicadorMIR === '0'
                    ? ''
                    : itemProduct.indicadorMIR,
                ...getCalendarizacion(itemProduct.calendario),
                potic: itemProduct.potic,
                acciones: tmpBudges,
              });
            }
          }

          tmpActivities.push({
            clave: getCveActividad({
              cveProyecto: proyectoService.cveProyecto,
              cveUnidad: proyectoService.cveUnidad,
              numeroActividad: itemActivity.cveActividad,
            }),
            nombreActividad: itemActivity.cxNombreActividad,
            agendaAutoridades: getAgenda(itemActivity.agenda, catAlcance),
            productos: tmpProduts,
          });
        }
      }

      tmpArr.push({
        programaInstitucional: item.clave,
        actividades: tmpActivities,
      });
    }
  }
  let dataVistaGeneral = {
    ...proyectoService,
    nombreUnidad: selectedProject.nombreUnidad,
    cveProyectoFull: getCveProyecto({
      cveProyecto: proyectoService.cveProyecto,
      cveUnidad: proyectoService.cveUnidad,
      yearNav: String(proyectoService.anhio),
    }),
    programas: tmpArr,
  };
  delete dataVistaGeneral.cveProgramaInstitucional;
  return dataVistaGeneral;
};

const getPartidasGasto = (array: any[]) => {
  let tmpTypes: any[] = array.map((item) => item.nombrePartida);
  tmpTypes = [...new Set(tmpTypes)];

  const groupedArray: any[] = [];
  for (const item of tmpTypes) {
    const calendarizacion = getCalendarizacionWithAnual(
      array.filter((itemFilter) => itemFilter.nombrePartida === item)
    );
    groupedArray.push({
      nombrePartidaGasto: item,
      ...calendarizacion,
    });
  }

  return groupedArray;
};

const getCalendarizacionWithAnual = (arrCalendario: any[]) => {
  let totalAnual = 0;
  const tmpObject = {};
  const meses = [
    {
      mes: 1,
      name: 'ene',
      value: '',
    },
    {
      mes: 2,
      name: 'feb',
      value: '',
    },
    {
      mes: 3,
      name: 'mar',
      value: '',
    },
    {
      mes: 4,
      name: 'abr',
      value: '',
    },
    {
      mes: 5,
      name: 'may',
      value: '',
    },
    {
      mes: 6,
      name: 'jun',
      value: '',
    },
    {
      mes: 7,
      name: 'jul',
      value: '',
    },
    {
      mes: 8,
      name: 'ago',
      value: '',
    },
    {
      mes: 9,
      name: 'sep',
      value: '',
    },
    {
      mes: 10,
      name: 'oct',
      value: '',
    },
    {
      mes: 11,
      name: 'nov',
      value: '',
    },
    {
      mes: 12,
      name: 'dic',
      value: '',
    },
  ];
  if (arrCalendario?.length) {
    for (const item of meses) {
      item.value = String(
        arrCalendario.filter((itemFilter) => itemFilter.mes === item.mes)?.[0]
          ?.monto ?? ''
      );
      totalAnual += item.value ? +item.value : 0;
    }
  }
  for (const item of meses) {
    tmpObject[item.name] = item.value;
  }
  return { anual: totalAnual, ...tmpObject };
};

const getCalendarizacion = (arrCalendario: any[]) => {
  const tmpObject = {};
  const meses = [
    {
      mes: 1,
      name: 'ene',
      value: '',
    },
    {
      mes: 2,
      name: 'feb',
      value: '',
    },
    {
      mes: 3,
      name: 'mar',
      value: '',
    },
    {
      mes: 4,
      name: 'abr',
      value: '',
    },
    {
      mes: 5,
      name: 'may',
      value: '',
    },
    {
      mes: 6,
      name: 'jun',
      value: '',
    },
    {
      mes: 7,
      name: 'jul',
      value: '',
    },
    {
      mes: 8,
      name: 'ago',
      value: '',
    },
    {
      mes: 9,
      name: 'sep',
      value: '',
    },
    {
      mes: 10,
      name: 'oct',
      value: '',
    },
    {
      mes: 11,
      name: 'nov',
      value: '',
    },
    {
      mes: 12,
      name: 'dic',
      value: '',
    },
  ];
  if (arrCalendario?.length) {
    for (const item of meses) {
      item.value = String(
        arrCalendario.filter((itemFilter) => itemFilter.mes === item.mes)?.[0]
          ?.monto ?? ''
      );
    }
  }
  for (const item of meses) {
    tmpObject[item.name] = item.value;
  }
  return tmpObject;
};

const getAgenda = (
  idAgenda: number | null,
  catAlcance: IItemCatalogoResponse[]
) => {
  let returnAgenda = '';
  if (idAgenda) {
    const finded = catAlcance.filter((item) => item.idCatalogo === idAgenda);
    if (finded.length) {
      returnAgenda = finded[0].cdOpcion;
    }
  }
  return returnAgenda;
};

const getFormatDataFromGeneralDataForExcel = (dataVistaGeneral: any): any[] => {
  const tmpProgramas: any[] = [];
  if (dataVistaGeneral.programas) {
    for (const programa of dataVistaGeneral.programas) {
      if (programa.actividades.length) {
        for (const actividad of programa.actividades) {
          if (actividad.productos.length) {
            for (const producto of actividad.productos) {
              if (producto.acciones.length) {
                for (const accion of producto.acciones) {
                  if (accion.partidasGasto.length) {
                    for (const partida of accion.partidasGasto) {
                      tmpProgramas.push({
                        programaInstitucional: programa.programaInstitucional,
                        ActividadesClave: actividad.clave,
                        ActividadesNombre: actividad.nombreActividad,
                        ActividadesAgenda: actividad.agendaAutoridades,
                        productosNo: producto.numeroProducto,
                        productosClave: producto.claveCompleta,
                        productosNombre: producto.nombre,
                        productosCategoria: producto.categoria,
                        productosTipo: producto.tipo,
                        productosIndicadorMir: producto.cveIndicadorMIR,
                        productosEne: producto.ene,
                        productosFeb: producto.feb,
                        productosMar: producto.mar,
                        productosAbr: producto.abr,
                        productosMay: producto.may,
                        productosJun: producto.jun,
                        productosJul: producto.jul,
                        productosAgo: producto.ago,
                        productosSep: producto.sep,
                        productosOct: producto.oct,
                        productosNom: producto.nov,
                        productosDic: producto.dic,
                        productosPotic: producto.potic,
                        accionesClave: accion.clave,
                        accionesNombre: accion.nombre,
                        accionesPartida: partida.nombrePartidaGasto,
                        accionesAnual: partida.anual,
                        accionesEne: partida.ene,
                        accionesFeb: partida.feb,
                        accionesMar: partida.mar,
                        accionesAbr: partida.abr,
                        accionesMay: partida.may,
                        accionesJun: partida.jun,
                        accionesJul: partida.jul,
                        accionesAgo: partida.ago,
                        accionesSep: partida.sep,
                        accionesOct: partida.oct,
                        accionesNov: partida.nov,
                        accionesDic: partida.dic,
                      });
                    }
                  } else {
                    tmpProgramas.push({
                      programaInstitucional: programa.programaInstitucional,
                      ActividadesClave: actividad.clave,
                      ActividadesNombre: actividad.nombreActividad,
                      ActividadesAgenda: actividad.agendaAutoridades,
                      productosNo: producto.numeroProducto,
                      productosClave: producto.claveCompleta,
                      productosNombre: producto.nombre,
                      productosCategoria: producto.categoria,
                      productosTipo: producto.tipo,
                      productosIndicadorMir: producto.cveIndicadorMIR,
                      productosEne: producto.ene,
                      productosFeb: producto.feb,
                      productosMar: producto.mar,
                      productosAbr: producto.abr,
                      productosMay: producto.may,
                      productosJun: producto.jun,
                      productosJul: producto.jul,
                      productosAgo: producto.ago,
                      productosSep: producto.sep,
                      productosOct: producto.oct,
                      productosNom: producto.nov,
                      productosDic: producto.dic,
                      productosPotic: producto.potic,
                      accionesClave: accion.clave,
                      accionesNombre: accion.nombre,
                      accionesPartida: '',
                      accionesAnual: '',
                      accionesEne: '',
                      accionesFeb: '',
                      accionesMar: '',
                      accionesAbr: '',
                      accionesMay: '',
                      accionesJun: '',
                      accionesJul: '',
                      accionesAgo: '',
                      accionesSep: '',
                      accionesOct: '',
                      accionesNov: '',
                      accionesDic: '',
                    });
                  }
                }
              } else {
                tmpProgramas.push({
                  programaInstitucional: programa.programaInstitucional,
                  ActividadesClave: actividad.clave,
                  ActividadesNombre: actividad.nombreActividad,
                  ActividadesAgenda: actividad.agendaAutoridades,
                  productosNo: producto.numeroProducto,
                  productosClave: producto.claveCompleta,
                  productosNombre: producto.nombre,
                  productosCategoria: producto.categoria,
                  productosTipo: producto.tipo,
                  productosIndicadorMir: producto.cveIndicadorMIR,
                  productosEne: producto.ene,
                  productosFeb: producto.feb,
                  productosMar: producto.mar,
                  productosAbr: producto.abr,
                  productosMay: producto.may,
                  productosJun: producto.jun,
                  productosJul: producto.jul,
                  productosAgo: producto.ago,
                  productosSep: producto.sep,
                  productosOct: producto.oct,
                  productosNom: producto.nov,
                  productosDic: producto.dic,
                  productosPotic: producto.potic,
                  accionesClave: '',
                  accionesNombre: '',
                  accionesPartida: '',
                  accionesAnual: '',
                  accionesEne: '',
                  accionesFeb: '',
                  accionesMar: '',
                  accionesAbr: '',
                  accionesMay: '',
                  accionesJun: '',
                  accionesJul: '',
                  accionesAgo: '',
                  accionesSep: '',
                  accionesOct: '',
                  accionesNov: '',
                  accionesDic: '',
                });
              }
            }
          } else {
            tmpProgramas.push({
              programaInstitucional: programa.programaInstitucional,
              ActividadesClave: actividad.clave,
              ActividadesNombre: actividad.nombreActividad,
              ActividadesAgenda: actividad.agendaAutoridades,
              productosNo: '',
              productosClave: '',
              productosNombre: '',
              productosCategoria: '',
              productosTipo: '',
              productosIndicadorMir: '',
              productosEne: '',
              productosFeb: '',
              productosMar: '',
              productosAbr: '',
              productosMay: '',
              productosJun: '',
              productosJul: '',
              productosAgo: '',
              productosSep: '',
              productosOct: '',
              productosNom: '',
              productosDic: '',
              productosPotic: '',
              accionesClave: '',
              accionesNombre: '',
              accionesPartida: '',
              accionesAnual: '',
              accionesEne: '',
              accionesFeb: '',
              accionesMar: '',
              accionesAbr: '',
              accionesMay: '',
              accionesJun: '',
              accionesJul: '',
              accionesAgo: '',
              accionesSep: '',
              accionesOct: '',
              accionesNov: '',
              accionesDic: '',
            });
          }
        }
      } else {
        tmpProgramas.push({
          programaInstitucional: programa.programaInstitucional,
          ActividadesClave: '',
          ActividadesNombre: '',
          ActividadesAgenda: '',
          productosNo: '',
          productosClave: '',
          productosNombre: '',
          productosCategoria: '',
          productosTipo: '',
          productosIndicadorMir: '',
          productosEne: '',
          productosFeb: '',
          productosMar: '',
          productosAbr: '',
          productosMay: '',
          productosJun: '',
          productosJul: '',
          productosAgo: '',
          productosSep: '',
          productosOct: '',
          productosNom: '',
          productosDic: '',
          productosPotic: '',
          accionesClave: '',
          accionesNombre: '',
          accionesPartida: '',
          accionesAnual: '',
          accionesEne: '',
          accionesFeb: '',
          accionesMar: '',
          accionesAbr: '',
          accionesMay: '',
          accionesJun: '',
          accionesJul: '',
          accionesAgo: '',
          accionesSep: '',
          accionesOct: '',
          accionesNov: '',
          accionesDic: '',
        });
      }
    }
  }
  return tmpProgramas;
};

const getRandomNumber = (number: number) => {
  return Math.floor(Math.random() * (number ?? 5));
};

export {
  getOptions,
  getGlobalStatus,
  getGlobalStatusSeguimiento,
  getTotalRubrics,
  getBeautifulDate,
  getPorcentaje,
  getListColors,
  parseMoneyFormat,
  getCveProyecto,
  getIdAdecuancionSolicitud,
  getTiposModificacion,
  blobToB64,
  downloadBlob,
  fileToBlob,
  downloadInputFile,
  getNumeroActividad,
  getNumeroProducto,
  getNumeroAccion,
  getNumeroNivelEducativo,
  getCveActividad,
  getCveProducto,
  getCveProductoSequimiento,
  getCveAccion,
  getBase64Image,
  getFileType,
  getTxtFileContent,
  getCanEdit,
  getFormatDataForGeneralView,
  getFormatDataFromGeneralDataForExcel,
  getRandomNumber,
};
