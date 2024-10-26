package mx.sep.dgtic.mejoredu.cortoplazo.service.impl;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.Calendarizacion;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PartidaPresupuestalVO;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionPresupuesto;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.RespuestaPresupuesto;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.*;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.PartidaGasto;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.Presupuesto;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.PresupuestoCalendario;
import mx.sep.dgtic.mejoredu.cortoplazo.service.PresupuestoService;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PresupuestoServiceImpl implements PresupuestoService {
	@Inject
	private PresupuestoRepository presupuestoRepository;
	@Inject
	private ProductoRepository productoRepository;
	@Inject
	private UsuarioRepository usuarioRepository;
	@Inject
	private PartidaGastoRepository partidaGastoRepository;
	@Inject
	private PresupuestoCalendarioRepository presupuestoCalendarioRepository;

	@Override
	public List<RespuestaPresupuesto> consultaPorIdProducto(int idProducto) {
		var producto = productoRepository.findByIdOptional(idProducto)
				.orElseThrow(() -> new NotFoundException("No se encontró el producto con el id " + idProducto));
		var presupuestos = presupuestoRepository.consultarActivosPorProducto(producto.getIdProducto());

		List<RespuestaPresupuesto> presupuestosVO = new ArrayList<RespuestaPresupuesto>();

		presupuestos.stream().map(presupuesto -> {
			var presupuestoVO = new RespuestaPresupuesto();

			presupuestoVO.setIdPresupuesto(presupuesto.getIdPresupuesto());
			presupuestoVO.setIdProducto(presupuesto.getProducto().getIdProducto());
			presupuestoVO.setCveUsuario(presupuesto.getUsuario().getCveUsuario());

			presupuestoVO.setDfPresupuesto(presupuesto.getDfPresupuesto().toString());
			presupuestoVO.setDhPresupuesto(presupuesto.getDhPresupuesto().toString());
			
			presupuestoVO.setCveAccion(presupuesto.getCveAccion());
			presupuestoVO.setNombreAccion(presupuesto.getCxNombreAccion());
      if (producto.getNivelEducativo().isPresent())
        presupuestoVO.setCveNivelEducativo(producto.getNivelEducativo().get().getCcExterna());
			//presupuestoVO.setCveNivelEducativo(presupuesto.getCveNivelEducativo());
			if (presupuesto.getCatalogoCentroCosto() != null)
				presupuestoVO.setIdCentroCostos(presupuesto.getCatalogoCentroCosto().getIdCatalogo());
			presupuestoVO.setPresupuestoAnual(presupuesto.getCxPresupuestoAnual());
			if (presupuesto.getCatalogoFuente() != null)
				presupuestoVO.setIdFuenteFinanciamiento(presupuesto.getCatalogoFuente().getIdCatalogo());

			var partidasPresupuestalesVO = new ArrayList<PartidaPresupuestalVO>();

			presupuesto.getPartidasGasto().stream().map(partida -> {
				var partidaVO = new PartidaPresupuestalVO();
				partidaVO.setCxNombrePartida(partida.getCatalogoPartida().getCdOpcion());
				partidaVO.setIdCatalogoPartidaGasto(partida.getCatalogoPartida().getIdCatalogo());
				var calendarizacion = new ArrayList<Calendarizacion>();
				partidaVO.setAnual(partida.getIxAnual());
				/*partidaVO.setAnual(0.0);*/
				//partidaVO.setAnual(partidaVO.getAnual()+calendario.getIxMonto());
				partida.getCalendarios().stream().map(calendario -> {
					var calendarizacionVO = new Calendarizacion();
					calendarizacionVO.setMes(calendario.getIxMes());
					calendarizacionVO.setMonto(calendario.getIxMonto());
					calendarizacionVO.setActivo(1);
					
					return calendarizacionVO;
				}).forEach(calendarizacion::add);

				partidaVO.setCalendarizacion(calendarizacion);

				return partidaVO;
			}).forEach(partidasPresupuestalesVO::add);

			presupuestoVO.setPartidasPresupuestales(partidasPresupuestalesVO);
			presupuestoVO.setEstatus(presupuesto.getCsEstatus());

			return presupuestoVO;
		}).forEach(presupuestosVO::add);

		return presupuestosVO;
	}

	@Override
	public RespuestaPresupuesto consultarPorId(int idPresupuesto) {
		var presupuesto = presupuestoRepository.findByIdOptional(idPresupuesto)
				.orElseThrow(() -> new NotFoundException("No se encontró el presupuesto con el id " + idPresupuesto));

		var presupuestoVO = new RespuestaPresupuesto();

		presupuestoVO.setIdPresupuesto(presupuesto.getIdPresupuesto());
		presupuestoVO.setIdProducto(presupuesto.getProducto().getIdProducto());
		presupuestoVO.setCveUsuario(presupuesto.getUsuario().getCveUsuario());
		presupuestoVO.setDfPresupuesto(presupuesto.getDfPresupuesto().toString());
		presupuestoVO.setDhPresupuesto(presupuesto.getDhPresupuesto().toString());
		presupuestoVO.setCveAccion(presupuesto.getCveAccion());
		presupuestoVO.setNombreAccion(presupuesto.getCxNombreAccion());
		presupuestoVO.setCveNivelEducativo(presupuesto.getCveNivelEducativo());
		presupuestoVO.setIdCentroCostos(presupuesto.getCatalogoCentroCosto().getIdCatalogo());
		presupuestoVO.setPresupuestoAnual(presupuesto.getCxPresupuestoAnual());
		presupuestoVO.setIdFuenteFinanciamiento(presupuesto.getCatalogoFuente().getIdCatalogo());

		var partidasPresupuestalesVO = new ArrayList<PartidaPresupuestalVO>();

		presupuesto.getPartidasGasto().stream().map(partida -> {
			var partidaVO = new PartidaPresupuestalVO();

			partidaVO.setIdCatalogoPartidaGasto(partida.getCatalogoPartida().getIdCatalogo());
			partidaVO.setCxNombrePartida(partida.getCatalogoPartida().getCdOpcion());
			partidaVO.setAnual(partida.getIxAnual());
			
			var calendarizacion = new ArrayList<Calendarizacion>();

			Log.info("Partida: " + partida);
			Log.info("Calendarios: " + partida.getCalendarios().toString());

			partida.getCalendarios().stream().map(calendario -> {
				var calendarizacionVO = new Calendarizacion();

				calendarizacionVO.setMes(calendario.getIxMes());
				calendarizacionVO.setMonto(calendario.getIxMonto());
				calendarizacionVO.setActivo(1);

				return calendarizacionVO;
			}).forEach(calendarizacion::add);

			partidaVO.setCalendarizacion(calendarizacion);

			return partidaVO;
		}).forEach(partidasPresupuestalesVO::add);

		presupuestoVO.setPartidasPresupuestales(partidasPresupuestalesVO);
		presupuestoVO.setEstatus(presupuesto.getCsEstatus());

		return presupuestoVO;
	}

	@Override
	@Transactional
	public void registrar(PeticionPresupuesto peticion) {
		var producto = productoRepository.findByIdOptional(peticion.getIdProducto()).orElseThrow(
				() -> new BadRequestException("No se encontró el producto con el id " + peticion.getIdProducto()));
		var usuario = usuarioRepository.findByIdOptional(peticion.getCveUsuario()).orElseThrow(
				() -> new BadRequestException("No se encontró el usuario con el id " + peticion.getCveUsuario()));

		var presupuesto = new Presupuesto();
		presupuesto.setCveAccion(peticion.getCveAccion());
		presupuesto.setCxNombreAccion(peticion.getNombreAccion());
		presupuesto.setCveNivelEducativo(peticion.getCveNivelEducativo());
		presupuesto.setCxPresupuestoAnual(peticion.getPresupuestoAnual());
		presupuesto.setDfPresupuesto(Date.valueOf(LocalDate.now()));
		presupuesto.setDhPresupuesto(Time.valueOf(LocalTime.now()));
		presupuesto.setUsuario(usuario);
		presupuesto.setProducto(producto);
		presupuesto.setIdCatalogoCentroCosto(peticion.getIdCentroCostos());
		presupuesto.setIdCatalogoFuente(peticion.getIdFuenteFinanciamiento());
		presupuesto.setCsEstatus(peticion.getEstatus());

		presupuestoRepository.persistAndFlush(presupuesto);
		var partidasGasto = presupuesto.getPartidasGasto();
		peticion.getPartidasPresupuestales().stream().map(partidaPeticion -> {
			var partidaGasto = new PartidaGasto();
			partidaGasto.setIdCatalogoPartida(partidaPeticion.getIdCatalogoPartidaGasto());
			partidaGasto.setPresupuesto(presupuesto);
			partidaGasto.setIxAnual(partidaPeticion.getAnual());
			Log.info("partidaGasto.setIxAnual: " + partidaGasto.getIxAnual());
			var calendarizacion = partidaGasto.getCalendarios();

			partidaGastoRepository.persistAndFlush(partidaGasto);

			partidaPeticion.getCalendarizacion().stream().map(calendarioPeticion -> {
				var calendario = new PresupuestoCalendario();
				calendario.setIxMes(calendarioPeticion.getMes());
				calendario.setIxMonto(calendarioPeticion.getMonto());
				
				calendario.setPartidaGasto(partidaGasto);

				presupuestoCalendarioRepository.persist(calendario);
				Log.info("Se guardó el calendario: " + calendario);
				return calendario;
			}).forEach(calendarizacion::add);
			return partidaGasto;
		}).forEach(partidasGasto::add);
	}

	@Override
	@Transactional
	public void modificar(int idPresupuesto, PeticionPresupuesto peticion) {
		var producto = productoRepository.findByIdOptional(peticion.getIdProducto()).orElseThrow(
				() -> new BadRequestException("No se encontró el producto con el id " + peticion.getIdProducto()));
		var usuario = usuarioRepository.findByIdOptional(peticion.getCveUsuario()).orElseThrow(
				() -> new BadRequestException("No se encontró el usuario con el id " + peticion.getCveUsuario()));
		var presupuesto = presupuestoRepository.findByIdOptional(idPresupuesto)
				.orElseThrow(() -> new NotFoundException("No se encontró el presupuesto con el id " + idPresupuesto));

		presupuesto.setCveAccion(peticion.getCveAccion());
		presupuesto.setCxNombreAccion(peticion.getNombreAccion());
		presupuesto.setCveNivelEducativo(peticion.getCveNivelEducativo());
		presupuesto.setCxPresupuestoAnual(peticion.getPresupuestoAnual());
		presupuesto.setDfPresupuesto(Date.valueOf(LocalDate.now()));
		presupuesto.setDhPresupuesto(Time.valueOf(LocalTime.now()));
		presupuesto.setUsuario(usuario);
		presupuesto.setProducto(producto);
		presupuesto.setIdCatalogoCentroCosto(peticion.getIdCentroCostos());
		presupuesto.setIdCatalogoFuente(peticion.getIdFuenteFinanciamiento());
		presupuesto.setCsEstatus(peticion.getEstatus());

		partidaGastoRepository.delete("presupuesto", presupuesto);
		var partidasGasto = presupuesto.getPartidasGasto();
		peticion.getPartidasPresupuestales().stream().map(partidaPeticion -> {
			var partidaGasto = new PartidaGasto();
			partidaGasto.setIdCatalogoPartida(partidaPeticion.getIdCatalogoPartidaGasto());
			partidaGasto.setPresupuesto(presupuesto);
			partidaGasto.setIxAnual(partidaPeticion.getAnual());
			var calendarizacion = partidaGasto.getCalendarios();

			partidaGastoRepository.persist(partidaGasto);

			partidaPeticion.getCalendarizacion().stream().map(calendarioPeticion -> {
				var calendario = new PresupuestoCalendario();
				calendario.setIxMes(calendarioPeticion.getMes());
				calendario.setIxMonto(calendarioPeticion.getMonto());
				calendario.setPartidaGasto(partidaGasto);

				presupuestoCalendarioRepository.persist(calendario);
				Log.info("Se guardó el calendario: " + calendario);
				return calendario;
			}).forEach(calendarizacion::add);
			return partidaGasto;
		}).forEach(partidasGasto::add);
		presupuestoRepository.persistAndFlush(presupuesto);
	}

	@Override
	@Transactional
	public void eliminar(int idPresupuesto) {
		var presupuesto = presupuestoRepository.findByIdOptional(idPresupuesto)
				.orElseThrow(() -> new NotFoundException("No se encontró el presupuesto con el id " + idPresupuesto));

		presupuesto.setCsEstatus(EstatusEnum.BLOQUEADO.getEstatus());
		presupuestoRepository.persistAndFlush(presupuesto);
	}
}
