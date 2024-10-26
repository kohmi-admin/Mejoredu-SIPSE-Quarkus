package mx.sep.dgtic.mejoredu.seguimiento.service.impl;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.Calendarizacion;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PartidaPresupuestalVO;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionPresupuesto;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.RespuestaPresupuesto;
import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionEliminarModificacion;
import mx.sep.dgtic.mejoredu.seguimiento.dao.*;
import mx.sep.dgtic.mejoredu.seguimiento.entity.AdecuacionPresupuesto;
import mx.sep.dgtic.mejoredu.seguimiento.entity.AjustadorPartida;
import mx.sep.dgtic.mejoredu.seguimiento.entity.PartidaGasto;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Presupuesto;
import mx.sep.dgtic.mejoredu.seguimiento.entity.PresupuestoCalendario;
import mx.sep.dgtic.mejoredu.seguimiento.presupuesto.*;
import mx.sep.dgtic.mejoredu.seguimiento.service.PresupuestoService;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.text.DecimalFormat;
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
  @Inject
  private AdecuacionPresupuestoRepository adecuacionPresupuestoRepository;
  @Inject
  private AjustadorPartidaRepository ajustadorPartidaRepository;

  @Override
  public List<RespuestaPresupuesto> consultaPorIdProducto(int idProducto) {
    var producto = productoRepository.findByIdOptional(idProducto)
        .orElseThrow(() -> new NotFoundException("No se encontró el producto con el id " + idProducto));
    var presupuestos = presupuestoRepository.consultarActivosPorProducto(producto.getIdProducto());

    var presupuestosVO = new ArrayList<RespuestaPresupuesto>();

    presupuestos.stream().map(this::entitieToVO).forEach(presupuestosVO::add);

    return presupuestosVO;
  }


  @Override
  public List<RespuestaPresupuesto> consultaPorProductoSolicitud(int idProducto, boolean excluirCortoPlazo,
                                                                 int idSolicitud) {
    var presupuestos = presupuestoRepository.consultarPresupuestoPorIdProducto(idProducto, excluirCortoPlazo,
        idSolicitud);

    return presupuestos.stream().map(this::entitieToVO).toList();
  }

  @Override
  @Transactional
  public List<RespuestaAdecuacionPresupuestoVO> consultarPresupuestoModificacion(int idAdecuacionSolicitud) {
    var adecuacionesPresupuesto = adecuacionPresupuestoRepository.list("""
        SELECT ap FROM AdecuacionPresupuesto ap
        JOIN FETCH ap.presupuestoModificacion
        WHERE ap.idAdecuacionSolicitud = ?1
        AND ap.idPresupuestoModificacion IS NOT NULL
        AND ap.idPresupuestoReferencia IS NOT NULL
        """, idAdecuacionSolicitud);

    return adecuacionesPresupuesto.stream().map(it -> {
      var respuesta = new RespuestaAdecuacionPresupuestoVO();

      respuesta.setIdPresupuestoModificacion(it.getIdPresupuestoModificacion());
      respuesta.setPresupuestoModificacion(entitieToVO(it.getPresupuestoModificacion()));
      if (it.getPresupuestoReferencia() != null) {
        respuesta.setIdPresupuestoReferencia(it.getIdPresupuestoReferencia());
        respuesta.setPresupuestoReferencia(entitieToVO(it.getPresupuestoReferencia()));
      }
      return respuesta;
    }).toList();
  }
  @Override
  @Transactional
  public List<RespuestaAdecuacionPresupuestoVO> consultarPresupuesto(int idAdecuacionSolicitud) {
    var adecuacionesPresupuesto = adecuacionPresupuestoRepository.list("""
        SELECT ap FROM AdecuacionPresupuesto ap
        JOIN FETCH ap.presupuestoModificacion
        WHERE ap.idAdecuacionSolicitud = ?1
        """, idAdecuacionSolicitud);

    return adecuacionesPresupuesto.stream().map(it -> {
      var respuesta = new RespuestaAdecuacionPresupuestoVO();
      if (it.getPresupuestoModificacion() != null) {


        respuesta.setIdPresupuestoModificacion(it.getIdPresupuestoModificacion());
        respuesta.setPresupuestoModificacion(entitieToVO(it.getPresupuestoModificacion()));
      }
      if (it.getPresupuestoReferencia() != null) {
        respuesta.setIdPresupuestoReferencia(it.getIdPresupuestoReferencia());
        respuesta.setPresupuestoReferencia(entitieToVO(it.getPresupuestoReferencia()));
      }
      return respuesta;
    }).toList();
  }

  @Override
  public List<RespuestaAdecuacionPresupuestoVO> consultarPresupuestoCancelacion(int idAdecuacionSolicitud) {
    var adecuacionesPresupuesto = adecuacionPresupuestoRepository.list("""
        SELECT ap FROM AdecuacionPresupuesto ap
        JOIN FETCH ap.presupuestoReferencia
        WHERE ap.idAdecuacionSolicitud = ?1
        AND ap.idPresupuestoReferencia IS NOT NULL
        AND ap.idPresupuestoModificacion IS NULL
        """, idAdecuacionSolicitud);

    return adecuacionesPresupuesto.stream().map(it -> {
      var respuesta = new RespuestaAdecuacionPresupuestoVO();

      respuesta.setIdPresupuestoModificacion(it.getIdPresupuestoModificacion());
      respuesta.setIdPresupuestoReferencia(it.getIdPresupuestoReferencia());
      respuesta.setPresupuestoReferencia(entitieToVO(it.getPresupuestoReferencia()));

      return respuesta;
    }).toList();
  }

  @Override
  public RespuestaPresupuesto consultarPorId(int idPresupuesto) {
    var presupuesto = presupuestoRepository.findByIdOptional(idPresupuesto)
        .orElseThrow(() -> new NotFoundException("No se encontró el presupuesto con el id " + idPresupuesto));

    return entitieToVO(presupuesto);
  }

  @Override
  @Transactional
  public RespuestaRegistroPresupuestoVO registrar(PeticionPresupuestoVO peticion) {
    var producto = productoRepository.findByIdOptional(peticion.getIdProducto()).orElseThrow(
        () -> new BadRequestException("No se encontró el producto con el id " + peticion.getIdProducto()));
    var usuario = usuarioRepository.findByIdOptional(peticion.getCveUsuario()).orElseThrow(
        () -> new BadRequestException("No se encontró el usuario con el id " + peticion.getCveUsuario()));

    Presupuesto presupuesto;
    AdecuacionPresupuesto adecuacionPresupuesto;
    if (peticion.getIdPresupuestoReferencia() == null) {
      adecuacionPresupuesto = new AdecuacionPresupuesto();
      presupuesto = new Presupuesto();
    } else {
      var adecuacionPresupuestoPersisted = adecuacionPresupuestoRepository
          .findByIdAdecuacionSolicitudModificacion(peticion.getIdAdecuacionSolicitud(), peticion.getIdPresupuestoReferencia());

      if (adecuacionPresupuestoPersisted.isPresent()) {
        adecuacionPresupuesto = adecuacionPresupuestoPersisted.get();
        presupuesto = adecuacionPresupuestoPersisted.get().getPresupuestoModificacion();
      } else {
        adecuacionPresupuesto = new AdecuacionPresupuesto();
        presupuesto = new Presupuesto();
      }
    }

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
    partidasGasto.forEach(partidaGasto -> {
      partidaGasto.getCalendarios()
          .forEach(calendario -> presupuestoCalendarioRepository.delete(calendario));

      partidaGastoRepository.delete(partidaGasto);
    });


    peticion.getPartidasPresupuestales().forEach(partidaPeticion -> {
      var partidaGasto = new PartidaGasto();
      partidaGasto.setIdCatalogoPartida(partidaPeticion.getIdCatalogoPartidaGasto());
      partidaGasto.setIxAnual(partidaPeticion.getAnual());
      partidaGasto.setPresupuesto(presupuesto);
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
    });

    adecuacionPresupuesto.setIdAdecuacionSolicitud(peticion.getIdAdecuacionSolicitud());
    adecuacionPresupuesto.setIdPresupuestoReferencia(peticion.getIdPresupuestoReferencia());
    adecuacionPresupuesto.setIdPresupuestoModificacion(presupuesto.getIdPresupuesto());

    adecuacionPresupuestoRepository.persist(adecuacionPresupuesto);

    var respuesta = new RespuestaRegistroPresupuestoVO();
    respuesta.setIdPresupuesto(presupuesto.getIdPresupuesto());
    return respuesta;
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
      partidaGasto.setIxAnual(partidaPeticion.getAnual());
      partidaGasto.setPresupuesto(presupuesto);
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
  public void cancelar(PeticionCancelacionPresupuestoVO peticion) {
    presupuestoRepository.findByIdOptional(peticion.getIdPresupuestoReferencia())
        .orElseThrow(() -> new NotFoundException(
            "No se encontró el presupuesto con el id " + peticion.getIdPresupuestoReferencia()));

    var adecuacionPresupuesto = adecuacionPresupuestoRepository
        .findByIdAdecuacionSolicitudCancelacion(peticion.getIdAdecuacionSolicitud(), peticion.getIdPresupuestoReferencia())
        .orElseGet(AdecuacionPresupuesto::new);

    adecuacionPresupuesto.setIdAdecuacionSolicitud(peticion.getIdAdecuacionSolicitud());
    adecuacionPresupuesto.setIdPresupuestoReferencia(peticion.getIdPresupuestoReferencia());

    adecuacionPresupuestoRepository.persist(adecuacionPresupuesto);
  }

  @Override
  @Transactional
  public void eliminar(int idPresupuesto) {
    var presupuesto = presupuestoRepository.findByIdOptional(idPresupuesto)
        .orElseThrow(() -> new NotFoundException("No se encontró el presupuesto con el id " + idPresupuesto));

    presupuesto.setCsEstatus(EstatusEnum.BLOQUEADO.getEstatus());
    presupuestoRepository.persistAndFlush(presupuesto);
  }

  @Override
  @Transactional
  public void eliminarAdecuacion(PeticionEliminarModificacion peticion) {
    var adecuacionPresupuesto = adecuacionPresupuestoRepository.find(
            "idAdecuacionSolicitud = ?1 AND idPresupuestoReferencia = ?2",
            peticion.getIdAdecuacionSolicitud(),
            peticion.getIdReferencia())
        .firstResultOptional()
        .orElseThrow(() -> new NotFoundException("No se encontró la adecuación con el id " + peticion.getIdAdecuacionSolicitud() + " y referencia " + peticion.getIdReferencia()));

    ajustadorPartidaRepository.delete("idAdecuacionSolicitud = ?1 AND idPresupuesto = ?2", peticion.getIdAdecuacionSolicitud(), peticion.getIdReferencia());

    if (adecuacionPresupuesto.getIdPresupuestoModificacion() != null) {
      var presupuesto = presupuestoRepository.findById(adecuacionPresupuesto.getIdPresupuestoModificacion());
      presupuesto.setCsEstatus(EstatusEnum.BLOQUEADO.getEstatus());
      presupuestoRepository.persistAndFlush(presupuesto);
    }

    adecuacionPresupuestoRepository.delete(adecuacionPresupuesto);
  }

  @Override
  @Transactional
  public void ampliacion(AdecuacionPresupuestoVO peticion) {
    ajustadorPartidaRepository.delete("idAdecuacionSolicitud = ?1 AND idPresupuesto = ?2", peticion.getIdAdecuacionSolictud(), peticion.getIdPresupuesto());

    var partidas = peticion.getAjustes().stream().map(partidaAjuste -> {
      AjustadorPartida ajustePartida = new AjustadorPartida();
      ajustePartida.setCvePresupuestal(partidaAjuste.getCvePresupuestal());
      ajustePartida.setCsEstatus(EstatusEnum.ACTIVO.getEstatus());
      ajustePartida.setIdAdecuacionSolicitud(peticion.getIdAdecuacionSolictud());
      ajustePartida.setIdPresupuesto(peticion.getIdPresupuesto());
      ajustePartida.setIdPartida(partidaAjuste.getIdCatalogoPartidaGasto());
      ajustePartida.setIxMonto(partidaAjuste.getMonto());
      ajustePartida.setIxMes(partidaAjuste.getMes());
      ajustePartida.setTipo(partidaAjuste.getTipo()); //Tipo de ajuste Ampliación igual a 1
      return ajustePartida;
    });//.forEach(ajustadorPartidaRepository::persistAndFlush);

    ajustadorPartidaRepository.persist(partidas);
  }

  @Override
  @Transactional
  @Deprecated
  public RespuestaGenerica reduccion(AdecuacionPresupuestoVO peticion) {

//		peticion.getAjustes().stream().map(partidaAjuste ->{
//			AjustadorPartida ajustePartida = new AjustadorPartida();
//			ajustePartida.setCvePresupuestal(partidaAjuste.getCvePresupuestal());
//			ajustePartida.setCsEstatus(EstatusEnum.ACTIVO.getEstatus());
//			ajustePartida.setId(null);
//			ajustePartida.setIdPresupuesto(partidaAjuste.getIdPresupuesto());
//			ajustePartida.setIdPartida(partidaAjuste.getIdCatalogoPartidaGasto());
//			ajustePartida.setIxMonto(partidaAjuste.getMonto());
//			ajustePartida.setIxMes(partidaAjuste.getMes());
//			ajustePartida.setTipo(2); //Tipo de ajuste reducción igual a 2
//			return ajustePartida;
//		}).forEach(ajustadorPartidaRepository::persistAndFlush);
//
//		return new RespuestaGenerica("200", "Exitoso");

    throw new BadRequestException("Método no implementado, utilizar registrarAjuste");
  }

  @Override
  @Transactional
  public void eliminarAjuste(PeticionEliminarModificacion peticion) {
    ajustadorPartidaRepository.delete("idAdecuacionSolicitud = ?1 AND idPresupuesto = ?2", peticion.getIdAdecuacionSolicitud(), peticion.getIdReferencia());
  }

  @Override

  public MensajePersonalizado<List<PartidaAdecuacionVO>> consultarAjuste(Integer idPresupuesto, Integer idAdecuacionSolicitud) {
    List<AjustadorPartida> adecuacion = ajustadorPartidaRepository.find("idPresupuesto = ?1 and idAdecuacionSolicitud = ?2", idPresupuesto, idAdecuacionSolicitud).list();
    MensajePersonalizado<List<PartidaAdecuacionVO>> respuesta = new MensajePersonalizado<List<PartidaAdecuacionVO>>();

    respuesta.setMensaje("Exitoso");
    respuesta.setCodigo("200");

    var lstPartidaAdecuacionVO = adecuacion.stream().map(partidaAjuste -> {
      PartidaAdecuacionVO ajustePartida = new PartidaAdecuacionVO();
      ajustePartida.setCvePresupuestal(partidaAjuste.getCvePresupuestal());
      ajustePartida.setCsEstatus(partidaAjuste.getCsEstatus());
      ajustePartida.setId(partidaAjuste.getId());
      ajustePartida.setIdCatalogoPartidaGasto(partidaAjuste.getIdPartida());
      ajustePartida.setMonto(partidaAjuste.getIxMonto());
      ajustePartida.setMes(partidaAjuste.getIxMes());
      ajustePartida.setTipo(partidaAjuste.getTipo()); //Tipo de ajuste reducción igual a 2
      return ajustePartida;
    }).toList();
    respuesta.setRespuesta(lstPartidaAdecuacionVO);

    return respuesta;
  }

  @Override
  @Deprecated
  public void reintegro(AdecuacionPresupuestoVO peticion) {
    throw new BadRequestException("Método no implementado, utilizar registrarAjuste");
  }

  @Override
  @Deprecated
  public void traspaso(AdecuacionPresupuestoVO peticion) {
    throw new BadRequestException("Método no implementado, utilizar registrarAjuste");
  }

  private RespuestaPresupuesto entitieToVO(Presupuesto presupuesto) {
    var presupuestoVO = new RespuestaPresupuesto();

    presupuestoVO.setIdPresupuesto(presupuesto.getIdPresupuesto());
    if (presupuesto.getProducto() != null)
      presupuestoVO.setIdProducto(presupuesto.getProducto().getIdProducto());
    presupuestoVO.setCveAccion(presupuesto.getCveAccion());
    presupuestoVO.setNombreAccion(presupuesto.getCxNombreAccion());
    presupuestoVO.setCveNivelEducativo(presupuesto.getCveNivelEducativo());
    if (presupuesto.getCatalogoCentroCosto() != null)
      presupuestoVO.setIdCentroCostos(presupuesto.getCatalogoCentroCosto().getId());
    presupuestoVO.setPresupuestoAnual(presupuesto.getCxPresupuestoAnual());
    if (presupuesto.getCatalogoFuente() != null)
      presupuestoVO.setIdFuenteFinanciamiento(presupuesto.getCatalogoFuente().getId());

    var partidasPresupuestalesVO = new ArrayList<PartidaPresupuestalVO>();
    presupuesto.getPartidasGasto().stream().map(partida -> {
      var partidaVO = new PartidaPresupuestalVO();

      partidaVO.setIdCatalogoPartidaGasto(partida.getIdCatalogoPartida());
      partidaVO.setCxNombrePartida(partida.getCatalogoPartida().getCdOpcion());

      var calendarizacion = new ArrayList<Calendarizacion>();
      partida.getCalendarios().stream().map(calendario -> {
        var calendarizacionVO = new Calendarizacion();

        calendarizacionVO.setMes(calendario.getIxMes());
        calendarizacionVO.setMonto(calendario.getIxMonto());

        return calendarizacionVO;
      }).forEach(calendarizacion::add);

      partidaVO.setCalendarizacion(calendarizacion);

      DecimalFormat df = new DecimalFormat("#.00");
      partidaVO.setAnual(
          Double.valueOf(df.format(calendarizacion.stream().mapToDouble(Calendarizacion::getMonto).sum())));
      return partidaVO;
    }).forEach(partidasPresupuestalesVO::add);
    presupuestoVO.setPartidasPresupuestales(partidasPresupuestalesVO);

    presupuestoVO.setEstatus(presupuesto.getCsEstatus());

    return presupuestoVO;
  }
}
