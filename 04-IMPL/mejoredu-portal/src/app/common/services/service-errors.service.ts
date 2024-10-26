import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class ServiceErrorsService {
  constructor(private _alertService: AlertService) { }

  getError(url: string, status: number, error: any, internalError: boolean) {
    let messageError = '';
    if (environment.messagesModeDev) {
      messageError = `Estatus: ${status}; Mensage: ${error?.mensaje}`;
    } else {
      if (
        url.includes('autenticarUsuario') ||
        url.includes('autenticarUsuarioLDAP')
      ) {
        messageError = this.errorLogin(status, error, internalError);
      } else if (url.includes('consultarCatalogoADTO')) {
        messageError = this.errorCatalogs(status, error);
      } else if (url.includes('excelToMysql')) {
        messageError = this.errorExcelToMySql(status, error, internalError);
      } else if (url.includes('consultarRevision')) {
        messageError = this.errorConsultarRevision(
          status,
          error,
          internalError
        );
      } else if (url.includes('consultarProyectoPorID')) {
        messageError = this.errorConsultarProyectoPorID(
          status,
          error,
          internalError
        );
      } else if (url.includes('consulta-por-usuario')) {
        messageError = this.errorConsultarSeguimientoPorUsuario(
          status,
          error,
          internalError
        );
      } else if (url.includes('/solicitud/comentario')) {
        messageError = this.errorConsultarComentarios(
          url,
          status,
          error,
          internalError
        );
      } else if (url.includes('epilogo/consultarPorIdEstructura')) {
        messageError = this.errorEpilogoConsultaPorIdEstructura(
          status,
          error,
          internalError
        );
      } else if (
        url.includes('/proyecto/consultarProyectoCancelacion') ||
        url.includes('/proyecto/consultarProyectoModificacion') ||
        url.includes('/metasbienestar/consultarPorAnhio') ||
        url.includes('/medianoplazo/consultarInicioPorAnhio') ||
        url.includes('/seguimiento/proyecto/consultaProyectosPorAnhio') ||
        url.includes('/avance-programatico/consultarEvidenciaMensual') ||
        url.includes('/avance-programatico/consultarEvidenciaTrimestral') ||
        url.includes('/arbol-problema/consultaPorAnhio') ||
        url.includes('/arbol-objetivo/consultaPorAnhio') ||
        url.includes('/programas-presupuestales/consultaPorAnhio') ||
        url.includes('/diagnostico/consultaPorAnho') ||
        url.includes('/mir/consultaPorAnhio') ||
        url.includes('/datos-generales/consultaPorAnho') ||
        url.includes('/archivo-seccion/consultaPorAnhio') ||
        url.includes(
          '/seguimiento/mir-fid/planeacion/justificacion/indicador/'
        ) ||
        url.includes(
          '/formulario-analitico/consultaProyectosPorAnhioParaValidar'
        ) ||
        url.includes(
          '/metasbienestar/productos/consultarPorIdCatalogoIndicadorPI'
        )
      ) {
        messageError = this.errorGeneric(status, error);
      } else if (url.includes('consultaProyectosPorAnhio')) {
        messageError = this.errorConsultaProyectosPorAnhio(
          status,
          error,
          internalError
        );
      } else if (messageError === '') {
        // COMMENT: error generico
        messageError = 'Error, intente más tarde.';
      }
    }

    if (messageError !== '') {
      this._alertService.showAlert(messageError);
    }
  }

  errorLogin(status: number, error: any, internalError: boolean) {
    let messageError = '';
    if (!internalError) {
      switch (status) {
        case 400:
          // COMMENT: Credenciales invalidas
          messageError =
            'Las credenciales proporcionadas no son válidas. Por favor, revise sus datos de inicio de sesión e intente nuevamente.';
          break;
        case 403:
          // COMMENT: Usuario desabilitado
          messageError =
            'La autenticación ha fallado. Comuniquese a la extensión #999.';
          break;
        default:
          messageError = error?.mensaje ?? 'Error, intente más tarde.';
          break;
      }
    }
    return messageError;
  }

  errorCatalogs(status: number, error: any) {
    let messageError = '';
    switch (status) {
      case 404:
        messageError = 'El identificador consultado no existe.';
        break;
      default:
        messageError = error?.mensaje ?? 'Error, intente más tarde.';
        break;
    }
    return messageError;
  }

  errorConsultaProyectosPorAnhio(
    status: number,
    error: any,
    internalError: boolean
  ) {
    let messageError = '';
    switch (+status) {
      case 400:
        if (!internalError) {
          messageError = 'Error, intente más tarde.';
        }
        break;
      default:
        messageError = error?.mensaje ?? 'Error, intente más tarde.';
        break;
    }
    return messageError;
  }

  errorExcelToMySql(status: number, error: any, internalError: boolean) {
    let messageError = error.mensaje ?? 'Error, intente más tarde.';
    return messageError;
  }

  errorConsultarRevision(status: number, error: any, internalError: boolean) {
    let messageError = error.mensaje ?? 'Error, intente más tarde.';
    switch (+status) {
      case 400:
        messageError = '';
        break;
      default:
        messageError = error?.mensaje ?? 'Error, intente más tarde.';
        break;
    }
    return messageError;
  }

  errorConsultarProyectoPorID(
    status: number,
    error: any,
    internalError: boolean
  ) {
    let messageError = error.mensaje ?? 'Error, intente más tarde.';
    switch (+status) {
      case 400:
        messageError = '';
        break;
      default:
        messageError = error?.mensaje ?? 'Error, intente más tarde.';
        break;
    }
    return messageError;
  }

  errorConsultarSeguimientoPorUsuario(
    status: number,
    error: any,
    internalError: boolean
  ) {
    let messageError = error.mensaje ?? 'Error, intente más tarde.';
    switch (+status) {
      case 404:
        messageError = '';
        break;
      default:
        messageError = error?.mensaje ?? 'Error, intente más tarde.';
        break;
    }
    return messageError;
  }

  errorConsultarComentarios(
    url: string,
    status: number,
    error: any,
    internalError: boolean
  ) {
    let messageError = error.mensaje ?? 'Error, intente más tarde.';
    if (url.includes('consultaPorIdSolicitud')) {
      switch (+status) {
        case 404:
          messageError = '';
          break;
        default:
          messageError = error?.mensaje ?? 'Error, intente más tarde.';
          break;
      }
    }
    return messageError;
  }

  errorEpilogoConsultaPorIdEstructura(
    status: number,
    error: any,
    internalError: boolean
  ) {
    let messageError = error.mensaje ?? 'Error, intente más tarde.';
    switch (+status) {
      case 404:
        messageError = '';
        break;
      default:
        messageError = error?.mensaje ?? 'Error, intente más tarde.';
        break;
    }
    return messageError;
  }

  errorGeneric(status: number, error: any) {
    let messageError = error.mensaje ?? 'Error, intente más tarde.';
    switch (+status) {
      case 407:
      case 404:
      case 400:
        messageError = '';
        break;
      default:
        messageError = error?.mensaje ?? 'Error, intente más tarde.';
        break;
    }
    return messageError;
  }
}
