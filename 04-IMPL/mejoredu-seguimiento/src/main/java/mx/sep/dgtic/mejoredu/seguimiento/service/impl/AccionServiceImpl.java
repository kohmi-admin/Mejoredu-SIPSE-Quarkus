package mx.sep.dgtic.mejoredu.seguimiento.service.impl;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionEliminarModificacion;
import mx.sep.dgtic.mejoredu.seguimiento.accion.*;
import org.springframework.stereotype.Service;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.sep.dgtic.mejoredu.seguimiento.dao.AdecuacionAccionRepository;
import mx.sep.dgtic.mejoredu.seguimiento.dao.AdecuacionRepository;
import mx.sep.dgtic.mejoredu.seguimiento.dao.PresupuestoRepository;
import mx.sep.dgtic.mejoredu.seguimiento.dao.ProductoRepository;
import mx.sep.dgtic.mejoredu.seguimiento.dao.SecuenciaAccionRepository;
import mx.sep.dgtic.mejoredu.seguimiento.entity.AdecuacionAccion;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Presupuesto;
import mx.sep.dgtic.mejoredu.seguimiento.service.AccionService;

@Service
public class AccionServiceImpl implements AccionService {
	@Inject
	private ProductoRepository productoRepository;
	@Inject
	private PresupuestoRepository presupuestoRepository;
	@Inject
	private AdecuacionRepository adecuacionRepository;
	@Inject
	private AdecuacionAccionRepository adecuacionAccionRepository;
	@Inject
	private SecuenciaAccionRepository secuenciaAccionRepository;

	@Override
	public List<RespuestaAdecuacionAccionVO> consultarAccionModificacion(int idAdcuacionSolicitud) {
		var adecuacionesAcciones = adecuacionAccionRepository.list("""
			SELECT aa FROM AdecuacionAccion aa
			JOIN FETCH aa.accionModificacion
			WHERE aa.idAdecuacionSolicitud = ?1
			AND aa.idAccionModificacion IS NOT NULL
			AND aa.idAccionReferencia IS NOT NULL
			""", idAdcuacionSolicitud);

		return adecuacionesAcciones.stream().map(it -> {
			var respuesta = new RespuestaAdecuacionAccionVO();

			respuesta.setIdAccionModificacion(it.getIdAccionModificacion());
			respuesta.setAccionModificacion(entitieToVO(it.getAccionModificacion()));
			if (it.getAccionReferencia() != null) {

				respuesta.setIdAccionReferencia(it.getIdAccionReferencia());
				respuesta.setAccionReferencia(entitieToVO(it.getAccionReferencia()));
			}
			return respuesta;
		}).toList();
	}
	@Override
	public List<RespuestaAdecuacionAccionVO> consultarAccion(int idAdcuacionSolicitud) {
		var adecuacionesAcciones = adecuacionAccionRepository.list("""
			SELECT aa FROM AdecuacionAccion aa
			JOIN FETCH aa.accionModificacion
			WHERE aa.idAdecuacionSolicitud = ?1
			""", idAdcuacionSolicitud);

		return adecuacionesAcciones.stream().map(it -> {
			var respuesta = new RespuestaAdecuacionAccionVO();

			respuesta.setIdAccionModificacion(it.getIdAccionModificacion());
			respuesta.setAccionModificacion(entitieToVO(it.getAccionModificacion()));
			if (it.getAccionReferencia() != null) {

				respuesta.setIdAccionReferencia(it.getIdAccionReferencia());
				respuesta.setAccionReferencia(entitieToVO(it.getAccionReferencia()));
			}
			return respuesta;
		}).toList();
	}

	@Override
	public List<RespuestaAdecuacionAccionVO> consultarAccionCancelacion(int idAdecuacionSolicitud) {
		var adecuacionesAcciones = adecuacionAccionRepository.list("""
			SELECT aa FROM AdecuacionAccion aa
			JOIN FETCH aa.accionReferencia
			WHERE aa.idAdecuacionSolicitud = ?1
			AND aa.idAccionReferencia IS NOT NULL
			AND aa.idAccionModificacion IS NULL
			""", idAdecuacionSolicitud);

		return adecuacionesAcciones.stream().map(it -> {
			var respuesta = new RespuestaAdecuacionAccionVO();

			respuesta.setIdAccionModificacion(it.getIdAccionModificacion());
			respuesta.setIdAccionReferencia(it.getIdAccionReferencia());
			respuesta.setAccionReferencia(entitieToVO(it.getAccionReferencia()));

			return respuesta;
		}).toList();
	}

	@Override
	public List<RespuestaAccionVO> consultarPorProductoSolicitud(int idProducto, boolean excluirCortoPlazo,
			int idSolicitud) {
		var acciones = presupuestoRepository.consultarAccionPorIdProducto(idProducto, excluirCortoPlazo, idSolicitud);

		return acciones.stream().map(this::entitieToVO).toList();
	}

	@Override
	public List<RespuestaAccionVO> consultarPorProducto(int idProducto) {
		var acciones = presupuestoRepository.list("""
				SELECT p FROM Presupuesto p
				INNER JOIN FETCH p.producto pr
				WHERE pr.idProducto = ?1
				""", idProducto);

		return acciones.stream().map(this::entitieToVO).toList();
	}

	@Override
	public RespuestaAccionVO consultarPorId(int idAccion) {
		var accion = presupuestoRepository.findByIdOptional(idAccion)
				.orElseThrow(() -> new NotFoundException("No se encontró la acción con el id " + idAccion));

		return entitieToVO(accion);
	}
	@Override
	public List<Presupuesto> consultarPorIdList(int idAccion) {
		var accion = presupuestoRepository.find("idPresupuesto", idAccion).list();

		return accion;
	}

	@Override
	@Transactional
	public RespuestaRegistroAccionVO registrar(PeticionAccionVO peticion) {
		var producto = productoRepository.findByIdOptional(peticion.getIdProducto()).orElseThrow(
				() -> new NotFoundException("No se encontró el producto con el id " + peticion.getIdProducto()));
		var adecuacionSolicitud = adecuacionRepository.findByIdAdecuacionSolictud(peticion.getIdAdecuacionSolicitud())
				.orElseThrow(() -> new NotFoundException(
						"No se encontró la solicitud con el id " + peticion.getIdAdecuacionSolicitud()));
		var solicitud = adecuacionSolicitud.getSolicitud();

		Presupuesto presupuesto;
		AdecuacionAccion adecuacionAccion;
		if (peticion.getIdAccionReferencia() == null) {
			adecuacionAccion = new AdecuacionAccion();
			presupuesto = new Presupuesto();
		} else {
			var adecuacionAccionPersisted = adecuacionAccionRepository
					.consultarPorIdAdecuacionSolicitudModificacion(peticion.getIdAdecuacionSolicitud(), peticion.getIdAccionReferencia());
			if (adecuacionAccionPersisted.isPresent()) {
				adecuacionAccion = adecuacionAccionPersisted.get();
				presupuesto = adecuacionAccionPersisted.get().getAccionModificacion();
			} else {
				adecuacionAccion = new AdecuacionAccion();
				presupuesto = new Presupuesto();
			}
		}

		presupuesto.setCveAccion(peticion.getClaveAccion());
		presupuesto.setCxNombreAccion(peticion.getNombre());
		presupuesto.setProducto(producto);
		presupuesto.setUsuario(solicitud.getUsuario());
		presupuesto.setDfPresupuesto(Date.valueOf(LocalDate.now()));
		presupuesto.setDhPresupuesto(Time.valueOf(LocalTime.now()));
		presupuesto.setCsEstatus(peticion.getCsEstatus());
		presupuesto.setCveUnidad(peticion.getCveUnidad());

		presupuestoRepository.persistAndFlush(presupuesto);

		adecuacionAccion.setIdAdecuacionSolicitud(peticion.getIdAdecuacionSolicitud());
		adecuacionAccion.setIdAccionReferencia(peticion.getIdAccionReferencia());
		adecuacionAccion.setIdAccionModificacion(presupuesto.getIdPresupuesto());

		adecuacionAccionRepository.persist(adecuacionAccion);

		var respuesta = new RespuestaRegistroAccionVO();
		respuesta.setIdAccion(presupuesto.getIdPresupuesto());
		return respuesta;
	}

	@Override
	@Transactional
	public void modificar(int idAccion, PeticionAccionVO peticion) {
		var producto = productoRepository.findByIdOptional(peticion.getIdProducto()).orElseThrow(
				() -> new NotFoundException("No se encontró el producto con el id " + peticion.getIdProducto()));
		var presupuesto = presupuestoRepository.findByIdOptional(idAccion)
				.orElseThrow(() -> new NotFoundException("No se encontró la acción con el id " + idAccion));
		var adecuacionSolicitud = adecuacionRepository.findByIdAdecuacionSolictud(peticion.getIdAdecuacionSolicitud())
				.orElseThrow(() -> new NotFoundException(
						"No se encontró la solicitud con el id " + peticion.getIdAdecuacionSolicitud()));
		var solicitud = adecuacionSolicitud.getSolicitud();

		presupuesto.setCveAccion(peticion.getClaveAccion());
		presupuesto.setCxNombreAccion(peticion.getNombre());
		presupuesto.setProducto(producto);
		presupuesto.setUsuario(solicitud.getUsuario());

		presupuestoRepository.persist(presupuesto);
	}

	@Override
	@Transactional
	public void eliminar(int idAccion) {
		var accion = presupuestoRepository.findByIdOptional(idAccion)
				.orElseThrow(() -> new NotFoundException("No se encontró la accion con id " + idAccion));

		accion.setCsEstatus(EstatusEnum.BLOQUEADO.getEstatus());
		presupuestoRepository.persistAndFlush(accion);

		List<Presupuesto> acciones = presupuestoRepository.consultarAccionPorIdProducto(accion.getProducto().getIdProducto());
		int secuenciaAux = 1;
		for (Presupuesto acc : acciones) {
			acc.setCveAccion(secuenciaAux++);
		}
		presupuestoRepository.persist(acciones);
	}

	@Override
	@Transactional
	public void eliminarAdecuacion(PeticionEliminarModificacion peticion) {
		var adecuacionAccion = adecuacionAccionRepository.find(
				"idAdecuacionSolicitud = ?1 AND idAccionReferencia = ?2",
						peticion.getIdAdecuacionSolicitud(),
						peticion.getIdReferencia())
				.firstResultOptional()
				.orElseThrow(() -> new NotFoundException(
						"No se encontró la adecuación con id " + peticion.getIdAdecuacionSolicitud() + " y referencia " + peticion.getIdReferencia()));

		if (adecuacionAccion.getIdAccionModificacion() != null) {
			var accion = presupuestoRepository.findById(adecuacionAccion.getIdAccionModificacion());
			accion.setCsEstatus(EstatusEnum.BLOQUEADO.getEstatus());
			presupuestoRepository.persist(accion);
		}

		adecuacionAccionRepository.delete(adecuacionAccion);
	}

	@Override
	@Transactional
	public void cancelarAccion(PeticionCancelacionAccionVO peticion) {
		presupuestoRepository.findByIdOptional(peticion.getIdAccionReferencia()).orElseThrow(
				() -> new NotFoundException("No se encontró la acción con el id " + peticion.getIdAccionReferencia()));

		var adecuacionAccion = adecuacionAccionRepository
				.consultarPorIdAdecuacionSolicitudCancelacion(peticion.getIdAdecuacionSolicitud(), peticion.getIdAccionReferencia())
				.orElseGet(AdecuacionAccion::new);

		adecuacionAccion.setIdAdecuacionSolicitud(peticion.getIdAdecuacionSolicitud());
		adecuacionAccion.setIdAccionReferencia(peticion.getIdAccionReferencia());

		adecuacionAccionRepository.persist(adecuacionAccion);
	}

	@Override
	public MensajePersonalizado<Integer> secuencialPorProducto(Integer idProducto) {

		productoRepository.findByIdOptional(idProducto)
				.orElseThrow(() -> new NotFoundException("No existe el producto con id " + idProducto));
		var secuenciaPorProducto = secuenciaAccionRepository.find("producto.idProducto", idProducto).firstResult();

		Integer secAccion = secuenciaPorProducto == null || secuenciaPorProducto.getIdSecuencia() == null
				|| secuenciaPorProducto.getIxSecuencia() == null ? 1 : secuenciaPorProducto.getIxSecuencia();

		MensajePersonalizado<Integer> respuesta = new MensajePersonalizado<Integer>();
		try {
			respuesta.setCodigo("200");
			respuesta.setMensaje("Exitoso");
			respuesta.setRespuesta(secAccion);
		} catch (Exception e) {
			respuesta.setCodigo("500");
			respuesta.setMensaje("Error al calcular y pesistir la secuencia por unidad admiva");
			e.printStackTrace();
		}
		return respuesta;
	}

	private RespuestaAccionVO entitieToVO(Presupuesto presupuesto) {
		var respuesta = new RespuestaAccionVO();

		respuesta.setIdAccion(presupuesto.getIdPresupuesto());
		respuesta.setClaveAccion(presupuesto.getCveAccion());
		respuesta.setNombre(presupuesto.getCxNombreAccion());
		respuesta.setIdProducto(presupuesto.getProducto().getIdProducto());
		respuesta.setCsEstatus(presupuesto.getCsEstatus());

		/*if (presupuesto.getAdecuacionAccion() != null) {
			respuesta.setIdAdecuacionSolicitud(presupuesto.getAdecuacionAccion().getIdAdecuacionSolicitud());
			respuesta.setIdAccionReferencia(presupuesto.getAdecuacionAccion().getIdAccionReferencia());
		}*/

		return respuesta;
	}
}
