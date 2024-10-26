package mx.sep.dgtic.mejoredu.cortoplazo.service;

import java.io.InputStream;
import java.util.List;

import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionPorID;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionProyecto;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.RespuestaProyectos;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.RespuestaProyectosVistaGeneral;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.RespuestaProyectosVistaGeneralPorID;
import mx.edu.sep.dgtic.mejoredu.seguimiento.ApartadoProyectoEstatus;
import mx.sep.dgtic.mejoredu.cortoplazo.ActualizarProyectoAnual;

public interface ProyectoAnualService {
	RespuestaGenerica registrarProyectoAnual(PeticionProyecto peticionProyecto);

	RespuestaGenerica actualizarProyectoAnual(int idProyecto, ActualizarProyectoAnual peticionProyecto);

	RespuestaProyectos consultaProyectos(int idAnhio, int idProyecto);

	RespuestaProyectos consultaProyectosParaValidar(int idAnhio);

	RespuestaProyectos consultaProyectosCarga(int idAnhio, int idProyecto);

	void eliminarProyectoAnual(PeticionPorID peticion);

	MensajePersonalizado<Integer> secuencialProyectoAnual(Integer idAnhio, Integer idUnidad);

	String getUiidPdfAlfresco(String uuid);

	RespuestaGenerica cargaExcel(InputStream file, String cveUsuario);

	RespuestaGenerica finalizarRegistro(PeticionPorID peticion);

	RespuestaGenerica enviarRevision(PeticionPorID peticion);

	RespuestaGenerica enviarValidacionTecnica(PeticionPorID peticion);

	RespuestaGenerica registroAprobado(PeticionPorID peticion);

	RespuestaProyectosVistaGeneral consultaProyectosParaVistaGeneral(int idAnhio, String cveUsuario);

	RespuestaProyectosVistaGeneralPorID consultaProyectosParaVistaGeneralPorId(int idAnhio, String cveUsuario,
			int idProyecto);

	RespuestaProyectos consultaProyectos(int idAnhio, EstatusEnum estatus);

	List<ApartadoProyectoEstatus>  consultarProyectoCompleto(int idProyecto);
}
