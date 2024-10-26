package mx.sep.dgtic.mejoredu.seguimiento.service;

import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionPorID;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.ProyectoVO;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.RespuestaProyectos;
import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionEliminarModificacion;
import mx.sep.dgtic.mejoredu.seguimiento.ActualizarProyectoAnual;
import mx.sep.dgtic.mejoredu.seguimiento.PeticionProyectoVO;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Proyecto;
import mx.sep.dgtic.mejoredu.seguimiento.proyecto.PeticionCancelacionProyectoVO;
import mx.sep.dgtic.mejoredu.seguimiento.proyecto.RespuestaAdecuacionProyectoVO;
import mx.sep.dgtic.mejoredu.seguimiento.proyecto.RespuestaRegistroProyectoVO;

import java.io.InputStream;
import java.util.List;

public interface ProyectoService {
  RespuestaAdecuacionProyectoVO consultaProyectoModificacion(int idAdecuacionSolictud, int idProyectoReferencia);
  List<RespuestaAdecuacionProyectoVO> consultaProyectoModificacion(int idAdecuacionSolictud);

  List<RespuestaAdecuacionProyectoVO> consultarSolicitudAdecuacionList(int idAdecuacionSolicitud);

  List<RespuestaAdecuacionProyectoVO> consultaProyectoCancelacion(int idAdecuacionSolictud);
  List<ProyectoVO> consultaProyectos(int idAnhio, int itSemantica);
  List<ProyectoVO> consultaProyectos(int idAnhio, List<String> estatus, boolean excluirCortoPlazo, Integer idSolicitud, boolean priorizarProyectoAsociado);
  ProyectoVO consultaProyectoPorId(int idProyecto);
  RespuestaProyectos consultaProyectosParaValidar(int idAnhio, int itSemantica);
  RespuestaProyectos consultaProyectosCarga(int idAnhio, int idProyecto);
  RespuestaRegistroProyectoVO registrarProyectoAnual(PeticionProyectoVO peticionProyecto);
  RespuestaGenerica actualizarProyectoAnual(int idProyecto, ActualizarProyectoAnual peticionProyecto);
  void eliminarProyectoAnual(PeticionPorID peticion);
  void eliminarAdecuacionProyectoAnual(PeticionEliminarModificacion peticion);
  MensajePersonalizado<Integer> secuencialProyectoAnual(Integer idAnhio);
  MensajePersonalizado<String> covertirAPdf(String uuid);
  RespuestaGenerica cargaExcel(InputStream file, String cveUsuario);
  RespuestaGenerica finalizarRegistro(PeticionPorID peticion);
  RespuestaGenerica enviarRevision(PeticionPorID peticion);
  RespuestaGenerica enviarValidacionTecnica(PeticionPorID peticion);
  RespuestaGenerica registroAprobado(PeticionPorID peticion);
  void cancelarProyecto(PeticionCancelacionProyectoVO peticion);
  List<Proyecto> consultaProyectoAprobado(int idAnhio, int trimestre);
  RespuestaAdecuacionProyectoVO consultarSolicitudAdecuacion(int idAdecuacionSolicitud);
  String getUiidPdfAlfresco(String uuid);
}
