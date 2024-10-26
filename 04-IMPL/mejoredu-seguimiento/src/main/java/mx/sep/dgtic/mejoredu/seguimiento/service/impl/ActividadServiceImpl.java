package mx.sep.dgtic.mejoredu.seguimiento.service.impl;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionEliminarModificacion;
import mx.sep.dgtic.mejoredu.seguimiento.ActividadVO;
import mx.sep.dgtic.mejoredu.seguimiento.EstrategiaAcciones;
import mx.sep.dgtic.mejoredu.seguimiento.FechaTentativaVO;
import mx.sep.dgtic.mejoredu.seguimiento.PeticionActividadVO;
import mx.sep.dgtic.mejoredu.seguimiento.actividad.PeticionCancelacionActividadVO;
import mx.sep.dgtic.mejoredu.seguimiento.actividad.RespuestaAdecuacionActividadVO;
import mx.sep.dgtic.mejoredu.seguimiento.actividad.RespuestaRegistroActividadVO;
import mx.sep.dgtic.mejoredu.seguimiento.dao.*;
import mx.sep.dgtic.mejoredu.seguimiento.entity.*;
import mx.sep.dgtic.mejoredu.seguimiento.service.ActividadService;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ActividadServiceImpl implements ActividadService {
  @Inject
  private ActividadRepository actividadRepository;
  @Inject
  private ProyectoAnualRepository proyectoAnualRepository;
  @Inject
  private UsuarioRepository usuarioRepository;
  @Inject
  private MasterCatalogoRepository masterCatalogoRepository;
  @Inject
  private FechaTentativaRepository fechaTentativaRepository;
  @Inject
  private EstrategiaAccionesRepository estrategiaAccionesRepository;
  @Inject
  private AdecuacionActividadRepository adecuacionActividadRepository;
  @Inject
  private SecuenciaActividadRepository secuenciaActividadRepository;
  @Inject
  private AvanceRepository avanceRepository;

  @Override
  public List<RespuestaAdecuacionActividadVO> consultarActividadModificacion(int idAdecuacionSolicitud) {
    var adecuacionActividades = adecuacionActividadRepository.list("""
        SELECT a FROM AdecuacionActividad a
        JOIN FETCH a.actividadModificacion
        WHERE a.idAdecuacionSolicitud = ?1
        AND a.idActividadModificacion IS NOT NULL
        AND a.idActividadReferencia IS NOT NULL
        """, idAdecuacionSolicitud);

    return adecuacionActividades.stream().map(it -> {
      var adecuacionActividadVO = new RespuestaAdecuacionActividadVO();
      adecuacionActividadVO.setIdActividadModificacion(it.getIdActividadModificacion());
      adecuacionActividadVO.setActividadModificacion(entitieToVO(it.getActividadModificacion()));
      if (it.getActividadReferencia() != null) {
        adecuacionActividadVO.setIdActividadReferencia(it.getIdActividadReferencia());
        adecuacionActividadVO.setActividadReferencia(entitieToVO(it.getActividadReferencia()));
      }
      return adecuacionActividadVO;
    }).toList();
  }
  @Override
  public List<RespuestaAdecuacionActividadVO> consultarActividad(int idAdecuacionSolicitud) {
    var adecuacionActividades = adecuacionActividadRepository.list("""
        SELECT a FROM AdecuacionActividad a
        JOIN FETCH a.actividadModificacion
        WHERE a.idAdecuacionSolicitud = ?1
        """, idAdecuacionSolicitud);

    return adecuacionActividades.stream().map(it -> {
      var adecuacionActividadVO = new RespuestaAdecuacionActividadVO();
      adecuacionActividadVO.setIdActividadModificacion(it.getIdActividadModificacion());
      adecuacionActividadVO.setActividadModificacion(entitieToVO(it.getActividadModificacion()));
      if (it.getActividadReferencia() != null) {
        adecuacionActividadVO.setIdActividadReferencia(it.getIdActividadReferencia());
        adecuacionActividadVO.setActividadReferencia(entitieToVO(it.getActividadReferencia()));
      }
      return adecuacionActividadVO;
    }).toList();
  }

  @Override
  public List<RespuestaAdecuacionActividadVO> consultarActividadCancelacion(int idAdecuacionSolicitud) {
    var adecuacionActividades = adecuacionActividadRepository.list("""
        SELECT a FROM AdecuacionActividad a
        JOIN FETCH a.actividadReferencia
        WHERE a.idAdecuacionSolicitud = ?1
        AND a.idActividadModificacion IS NULL
        AND a.idActividadReferencia IS NOT NULL
        """, idAdecuacionSolicitud);

    return adecuacionActividades.stream().map(it -> {
      var adecuacionActividadVO = new RespuestaAdecuacionActividadVO();
      adecuacionActividadVO.setIdActividadModificacion(it.getIdActividadModificacion());
      adecuacionActividadVO.setIdActividadReferencia(it.getIdActividadReferencia());
      adecuacionActividadVO.setActividadReferencia(entitieToVO(it.getActividadReferencia()));
      return adecuacionActividadVO;
    }).toList();
  }

  @Override
  public List<ActividadVO> consultarPorIdProyectoSolicitud(int idProyecto, boolean excluirCortoPlazo, int idSolicitud) {
    proyectoAnualRepository.findByIdOptional(idProyecto).orElseThrow(() -> new NotFoundException("No existe el proyecto con id " + idProyecto));
    var actividades = actividadRepository.consultarActivasPorProyectoSolicitud(idProyecto, excluirCortoPlazo, idSolicitud);

    return actividades.stream().map(this::entitieToVO).toList();
  }

  @Override
  public List<ActividadVO> consultarPorIdProyecto(int idProyecto, String csStatus) {
    var proyecto = proyectoAnualRepository.find("idProyecto = ?1 and csEstatus in (".concat(csStatus.isEmpty() ? "'C','I'" : csStatus).concat(")"), idProyecto);
    if (proyecto == null) {
      throw new NotFoundException("No existe el proyecto con id " + idProyecto);
    }
    var actividades = actividadRepository.consultarActivasPorProyecto(idProyecto);

    return actividades.stream().map(this::entitieToVO).toList();
  }

  @Override
  public ActividadVO consultarPorIdActividad(int idActividad) {
    var actividad = actividadRepository.findById(idActividad);
    if (actividad == null) {
      throw new NotFoundException("No existe la actividad con id " + idActividad);
    }
    var vo = new ActividadVO();
    vo.setIdActividad(actividad.getIdActividad());
    vo.setCveActividad(actividad.getCveActividad());
    vo.setCxNombreActividad(actividad.getCxNombreActividad());
    vo.setCxDescripcion(actividad.getCxDescripcion());
    vo.setCxArticulacionActividad(actividad.getCxArticulacionActividad());
    vo.setCveUsuario(actividad.getUsuario().getCveUsuario());
    vo.setDfActividad(actividad.getDfActividad().toString());
    vo.setDhActividad(actividad.getDhActividad().toString());
    vo.setIdProyecto(actividad.getProyectoAnual().getIdProyecto());
    // Estrategia Acciones

    vo.setIcActividadTransversal(actividad.getIcActividadTransversal());
    vo.setIxReunion(actividad.getIxRequireReunion());
    vo.setCxTema(actividad.getCxTema());
    if (actividad.getCatalogoAlcance() != null) vo.setIdAlcance(actividad.getCatalogoAlcance().getId());
    vo.setCxLugar(actividad.getCxLugar());
    vo.setCxActores(actividad.getCxActores());
    var fechasTentativas = actividad.getFechaTentativa().stream().map(it -> {
      var vo2 = new FechaTentativaVO();
      vo2.setIdActividad(actividad.getIdActividad());
      vo2.setIdFechaTentativa(it.getIdFechaTentativa());
      vo2.setIdMes(it.getCidCatalogoMes());
      return vo2;
    }).toList();
    var estrategiasDto = actividad.getEstrategiaAccion().stream().filter(estrategias -> estrategias.getIxTipo() == 1).map(ea -> {
      EstrategiaAcciones estrategiaAccionDto = new EstrategiaAcciones();
      estrategiaAccionDto.setIdEstaci(ea.getIdEstaci());
      estrategiaAccionDto.setIxTipo(1);
      MasterCatalogoDTO catalogoAccion = new MasterCatalogoDTO();
      catalogoAccion.setIdCatalogo(ea.getMasterCatalogo().getId());
      estrategiaAccionDto.setMasterCatalogo(catalogoAccion);
      return estrategiaAccionDto;
    }).toList();
    vo.setEstrategia(estrategiasDto);

    var accionesDto = actividad.getEstrategiaAccion().stream().filter(estrategias -> estrategias.getIxTipo() == 2).map(ea -> {
      EstrategiaAcciones estrategiaAccionDto = new EstrategiaAcciones();
      estrategiaAccionDto.setIdEstaci(ea.getIdEstaci());
      estrategiaAccionDto.setIxTipo(2);

      MasterCatalogoDTO catalogoAccion = new MasterCatalogoDTO();
      catalogoAccion.setIdCatalogo(ea.getMasterCatalogo().getId());
      estrategiaAccionDto.setMasterCatalogo(catalogoAccion);
      return estrategiaAccionDto;
    }).toList();

    vo.setAccion(accionesDto);
    var objetivoDto = actividad.getEstrategiaAccion().stream().filter(estrategias -> estrategias.getIxTipo() == 3).map(ea -> {
      EstrategiaAcciones estrategiaAccionDto = new EstrategiaAcciones();
      estrategiaAccionDto.setIdEstaci(ea.getIdEstaci());
      estrategiaAccionDto.setIxTipo(3);

      MasterCatalogoDTO catalogoAccion = new MasterCatalogoDTO();
      catalogoAccion.setIdCatalogo(ea.getMasterCatalogo().getId());
      estrategiaAccionDto.setMasterCatalogo(catalogoAccion);
      return estrategiaAccionDto;
    }).toList();

    vo.setObjetivo(objetivoDto);

    vo.setFechaTentativa(fechasTentativas);
    vo.setCsEstatus(actividad.getCsEstatus());
    return vo;
  }
  @Override
  public List<Actividad> consultarPorIdActividadList(int idActividad) {
    var list = actividadRepository.find("idActividad", idActividad).list();
    return list;
  }

  @Override
  @Transactional
  public void modificar(int idActividad, PeticionActividadVO registroActividad) {
    var actividad = actividadRepository.findById(idActividad);
    if (actividad == null) {
      throw new NotFoundException("No existe la actividad con id " + idActividad);
    }
    var proyecto = proyectoAnualRepository.findById(registroActividad.getIdProyecto());
    if (proyecto == null) {
      throw new NotFoundException("No existe el proyecto con id " + registroActividad.getIdProyecto());
    }
    var usuario = usuarioRepository.findById(registroActividad.getCveUsuario());
    if (usuario == null) {
      throw new NotFoundException("No existe el usuario con id " + registroActividad.getCveUsuario());
    }
    var alcance = masterCatalogoRepository.findById(registroActividad.getAlcance());

    actividad.setCveActividad(registroActividad.getCveActividad());
    actividad.setCxNombreActividad(registroActividad.getNombreActividad());
    actividad.setCxDescripcion(registroActividad.getDescripcion());
    actividad.setCxArticulacionActividad(registroActividad.getArticulacionActividad());
    actividad.setUsuario(usuario);
    actividad.setProyectoAnual(proyecto);

    actividad.setIcActividadTransversal(registroActividad.getActividadTransversal());
    actividad.setIxRequireReunion(registroActividad.getReuniones());
    actividad.setCxTema(registroActividad.getTema());
    actividad.setCatalogoAlcance(alcance);
    actividad.setCxLugar(registroActividad.getLugar());
    actividad.setCxActores(registroActividad.getActores());
    actividad.setFechaTentativa(new ArrayList<>());
    // Delete all FechaTentativa from Actividad before adding new ones
    fechaTentativaRepository.delete("actividad", actividad);
    registroActividad.getFechaTentativa().stream().map(it -> {
      var entidad2 = new FechaTentativa();
      entidad2.setCidCatalogoMes(it.getIdCatalogoFecha());
      entidad2.setActividad(actividad);
      return entidad2;
    }).forEach(actividad::addFechaTentativa);

    // Delete all Estrategias acciones from Actividad before adding new ones

    estrategiaAccionesRepository.delete("actividad", actividad);
    // Objetivos
    if (registroActividad.getObjetivo() != null) registroActividad.getObjetivo().stream().map(it -> {
      EstrategiaAccion estrategiaAccionEnt = new EstrategiaAccion();
      estrategiaAccionEnt.setActividad(actividad);
      MasterCatalogo catalogo = new MasterCatalogo();
      catalogo.setId(it.getMasterCatalogo().getIdCatalogo());
      catalogo.setLockFlag(0);
      estrategiaAccionEnt.setMasterCatalogo(catalogo);
      estrategiaAccionEnt.setIxTipo(3);
      return estrategiaAccionEnt;
    }).forEach(actividad::addEstrategiaAccion);
    // Estrategias
    if (registroActividad.getEstrategia() != null) registroActividad.getEstrategia().stream().map(it -> {
      EstrategiaAccion estrategiaAccionEnt = new EstrategiaAccion();
      estrategiaAccionEnt.setActividad(actividad);
      MasterCatalogo catalogo = new MasterCatalogo();
      catalogo.setId(it.getMasterCatalogo().getIdCatalogo());
      catalogo.setLockFlag(0);
      estrategiaAccionEnt.setMasterCatalogo(catalogo);
      estrategiaAccionEnt.setIxTipo(1);
      return estrategiaAccionEnt;
    }).forEach(actividad::addEstrategiaAccion);
//  acciones
    if (registroActividad.getAction() != null) registroActividad.getAction().stream().map(it -> {
      EstrategiaAccion estrategiaAccionEnt = new EstrategiaAccion();
      estrategiaAccionEnt.setActividad(actividad);
      MasterCatalogo catalogo = new MasterCatalogo();
      catalogo.setLockFlag(0);
      catalogo.setId(it.getMasterCatalogo().getIdCatalogo());
      estrategiaAccionEnt.setMasterCatalogo(catalogo);
      estrategiaAccionEnt.setIxTipo(2);
      return estrategiaAccionEnt;
    }).forEach(actividad::addEstrategiaAccion);

    actividad.setCsEstatus(registroActividad.getEstatus());

    actividadRepository.persistAndFlush(actividad);
  }

  @Override
  @Transactional
  public void eliminar(int idActividad) {
    var actividad = actividadRepository.findById(idActividad);
    if (actividad == null) {
      throw new NotFoundException("No existe la actividad con id " + idActividad);
    }
    actividad.setCsEstatus(EstatusEnum.BLOQUEADO.getEstatus());
    actividadRepository.persistAndFlush(actividad);

    List<Actividad> actividades = actividadRepository.consultarActivasPorProyecto(actividad.getProyectoAnual().getIdProyecto());
    int secuenciaAux = 1;
    for (Actividad a : actividades) {
      a.setCveActividad(secuenciaAux++);
    }
    actividadRepository.persist(actividades);
  }

  @Override
  @Transactional
  public void eliminarAdecuacion(PeticionEliminarModificacion peticion) {
    var adecuacionActividad = adecuacionActividadRepository.find(
            "idAdecuacionSolicitud = ?1 AND idActividadReferencia = ?2",
            peticion.getIdAdecuacionSolicitud(),
            peticion.getIdReferencia())
        .firstResultOptional()
        .orElseThrow(() -> new NotFoundException("No existe la adecuación con id " + peticion.getIdAdecuacionSolicitud() + " y referencia " + peticion.getIdReferencia()));

    if (adecuacionActividad.getIdActividadModificacion() != null) {
      var actividad = actividadRepository.findById(adecuacionActividad.getIdActividadModificacion());
      actividad.setCsEstatus(EstatusEnum.BLOQUEADO.getEstatus());
      actividadRepository.persist(actividad);
    }

    adecuacionActividadRepository.delete(adecuacionActividad);
  }

  @Override
  @Transactional
  public void cancelarActividad(PeticionCancelacionActividadVO peticion) {
    actividadRepository.findByIdOptional(peticion.getIdActividadReferencia()).orElseThrow(() -> new NotFoundException("No existe la actividad con id " + peticion.getIdActividadReferencia()));

    // Debo validar que la actividad no tenga productos con avances
    var avance = avanceRepository.find("""
        SELECT a FROM Avance a
        JOIN a.productoCalendario pc
        JOIN pc.producto p
        JOIN p.actividad act
        WHERE act.idActividad = ?1
        """, peticion.getIdActividadReferencia())
        .firstResultOptional();

    if (avance.isPresent()) {
      throw new BadRequestException("La actividad no puede ser cancelada porque tiene productos con avances programáticos presentados");
    }

    var adecuacionActividad = adecuacionActividadRepository.find("""
            idAdecuacionSolicitud = ?1
            AND idActividadModificacion IS NULL
            AND idActividadReferencia = ?2
            """, peticion.getIdAdecuacionSolicitud(), peticion.getIdActividadReferencia())
        .firstResultOptional()
        .orElseGet(AdecuacionActividad::new);

    adecuacionActividad.setIdActividadReferencia(peticion.getIdActividadReferencia());
    adecuacionActividad.setIdAdecuacionSolicitud(peticion.getIdAdecuacionSolicitud());

    adecuacionActividadRepository.persist(adecuacionActividad);
  }

  @Override
  @Transactional
  public RespuestaRegistroActividadVO registrar(PeticionActividadVO registroActividad) {
    var proyecto = proyectoAnualRepository.findById(registroActividad.getIdProyecto());
    if (proyecto == null) {
      throw new NotFoundException("No existe el proyecto con id " + registroActividad.getIdProyecto());
    }
    var usuario = usuarioRepository.findById(registroActividad.getCveUsuario());
    if (usuario == null) {
      throw new NotFoundException("No existe el usuario con id " + registroActividad.getCveUsuario());
    }

    var alcance = masterCatalogoRepository.findById(registroActividad.getAlcance());

    AdecuacionActividad adecuacionActividad = new AdecuacionActividad();
    Actividad actividad = new Actividad();

    if (registroActividad.getIdActividadReferencia() != null) {
      var adecuacionActividadPersisted = adecuacionActividadRepository.find("""
              SELECT aa FROM AdecuacionActividad aa
              JOIN FETCH aa.actividadModificacion am
              WHERE aa.idAdecuacionSolicitud = ?1
              AND aa.idActividadModificacion IS NOT NULL
              AND aa.idActividadReferencia = ?2
              """, registroActividad.getIdAdecuacionSolicitud(), registroActividad.getIdActividadReferencia())
          .firstResultOptional();

      if (adecuacionActividadPersisted.isPresent()) {
        adecuacionActividad = adecuacionActividadPersisted.get();
        actividad = adecuacionActividad.getActividadModificacion();
      }
    }
    // transform 0301 string to 1 int
    actividad.setCveActividad(registroActividad.getCveActividad());
    actividad.setCxNombreActividad(registroActividad.getNombreActividad());
    actividad.setCxDescripcion(registroActividad.getDescripcion());
    actividad.setCxArticulacionActividad(registroActividad.getArticulacionActividad());
    actividad.setUsuario(usuario);
    actividad.setDfActividad(Date.valueOf(LocalDate.now()));
    actividad.setDhActividad(Time.valueOf(LocalTime.now()));
    actividad.setProyectoAnual(proyecto);

    actividad.setIcActividadTransversal(registroActividad.getActividadTransversal());
    actividad.setIxRequireReunion(registroActividad.getReuniones());
    actividad.setCxTema(registroActividad.getTema());
    actividad.setCatalogoAlcance(alcance);
    actividad.setCxLugar(registroActividad.getLugar());
    actividad.setCxActores(registroActividad.getActores());
    if (registroActividad.getFechaTentativa() != null) {
      Actividad finalActividad = actividad;
      registroActividad.getFechaTentativa().stream().map(it -> {
        var entidad2 = new FechaTentativa();
        entidad2.setCidCatalogoMes(it.getIdCatalogoFecha());
        entidad2.setActividad(finalActividad);
        return entidad2;
      }).forEach(actividad::addFechaTentativa);
    }
    actividad.setCsEstatus(registroActividad.getEstatus());

    // Estrategias acciones
    actividad.setEstrategiaAccion(new ArrayList<EstrategiaAccion>());
    if (registroActividad.getObjetivo() != null) {
      Actividad finalActividad = actividad;
      registroActividad.getObjetivo().stream().map(it -> {
        EstrategiaAccion estrategiaAccionEnt = new EstrategiaAccion();
        estrategiaAccionEnt.setIxTipo(3); // Objetivos prioritarios

        MasterCatalogo estrategiaCat = masterCatalogoRepository.findById(it.getMasterCatalogo().getIdCatalogo());
        estrategiaAccionEnt.setActividad(finalActividad);
        estrategiaAccionEnt.setMasterCatalogo(estrategiaCat);
        return estrategiaAccionEnt;
      }).forEach(actividad::addEstrategiaAccion);
    }

    // Estrategias acciones
    if (registroActividad.getEstrategia() != null) {
      Actividad finalActividad = actividad;
      registroActividad.getEstrategia().stream().map(it -> {
        EstrategiaAccion estrategiaAccionEnt = new EstrategiaAccion();
        estrategiaAccionEnt.setIxTipo(1);

        MasterCatalogo estrategiaCat = masterCatalogoRepository.findById(it.getMasterCatalogo().getIdCatalogo());
        estrategiaAccionEnt.setActividad(finalActividad);
        estrategiaAccionEnt.setMasterCatalogo(estrategiaCat);
        return estrategiaAccionEnt;
      }).forEach(actividad::addEstrategiaAccion);
    }

    if (registroActividad.getAction() != null) {
      Actividad finalActividad = actividad;
      registroActividad.getAction().stream().map(it -> {
        EstrategiaAccion estrategiaAccionEnt = new EstrategiaAccion();
        estrategiaAccionEnt.setIxTipo(2);
        estrategiaAccionEnt.setActividad(finalActividad);
        MasterCatalogo accionCat = masterCatalogoRepository.findById(it.getMasterCatalogo().getIdCatalogo());
        estrategiaAccionEnt.setMasterCatalogo(accionCat);
        return estrategiaAccionEnt;
      }).forEach(actividad::addEstrategiaAccion);
    }

    actividadRepository.persistAndFlush(actividad);

    adecuacionActividad.setIdAdecuacionSolicitud(registroActividad.getIdAdecuacionSolicitud());
    adecuacionActividad.setIdActividadModificacion(actividad.getIdActividad());
    adecuacionActividad.setIdActividadReferencia(registroActividad.getIdActividadReferencia());

    adecuacionActividadRepository.persist(adecuacionActividad);

    var respuesta = new RespuestaRegistroActividadVO();
    respuesta.setIdActividad(actividad.getIdActividad());
    return respuesta;
  }

  private ActividadVO entitieToVO(Actividad it) {
    var vo = new ActividadVO();
    vo.setIdActividad(it.getIdActividad());
    vo.setCveActividad(it.getCveActividad());
    vo.setCxNombreActividad(it.getCxNombreActividad());
    vo.setCxDescripcion(it.getCxDescripcion());
    vo.setCxArticulacionActividad(it.getCxArticulacionActividad());
    vo.setCveUsuario(it.getUsuario().getCveUsuario());
    if (it.getDfActividad() != null) vo.setDfActividad(it.getDfActividad().toString());
    if (it.getDhActividad() != null) vo.setDhActividad(it.getDhActividad().toString());
    vo.setIdProyecto(it.getProyectoAnual().getIdProyecto());

    vo.setIcActividadTransversal(it.getIcActividadTransversal());
    vo.setIxReunion(it.getIxRequireReunion());
    vo.setCxTema(it.getCxTema());
    if (it.getCatalogoAlcance() != null) vo.setIdAlcance(it.getCatalogoAlcance().getId());
    vo.setCxLugar(it.getCxLugar());
    vo.setCxActores(it.getCxActores());
    var fechasTentativas = it.getFechaTentativa().stream().map(at -> {
      var vo2 = new FechaTentativaVO();
      vo2.setIdActividad(it.getIdActividad());
      vo2.setIdFechaTentativa(at.getIdFechaTentativa());
      vo2.setIdMes(at.getCidCatalogoMes());
      return vo2;
    }).toList();

    var estrategiasDto = it.getEstrategiaAccion().stream().filter(estrategias -> estrategias.getIxTipo() == 1).map(ea -> {
      EstrategiaAcciones estrategiaAccionDto = new EstrategiaAcciones();
      estrategiaAccionDto.setIdEstaci(ea.getIdEstaci());
      estrategiaAccionDto.setIxTipo(1);
      MasterCatalogoDTO catalogoAccion = new MasterCatalogoDTO();
      catalogoAccion.setIdCatalogo(ea.getMasterCatalogo().getId());
      estrategiaAccionDto.setMasterCatalogo(catalogoAccion);
      return estrategiaAccionDto;
    }).toList();
    vo.setEstrategia(estrategiasDto);

    var accionesDto = it.getEstrategiaAccion().stream().filter(estrategias -> estrategias.getIxTipo() == 2).map(ea -> {
      EstrategiaAcciones estrategiaAccionDto = new EstrategiaAcciones();
      estrategiaAccionDto.setIdEstaci(ea.getIdEstaci());
      estrategiaAccionDto.setIxTipo(2);

      MasterCatalogoDTO catalogoAccion = new MasterCatalogoDTO();
      catalogoAccion.setIdCatalogo(ea.getMasterCatalogo().getId());
      estrategiaAccionDto.setMasterCatalogo(catalogoAccion);
      return estrategiaAccionDto;
    }).toList();
    vo.setAccion(accionesDto);

    var objetivoDto = it.getEstrategiaAccion().stream().filter(estrategias -> estrategias.getIxTipo() == 3).map(ea -> {
      EstrategiaAcciones estrategiaAccionDto = new EstrategiaAcciones();
      estrategiaAccionDto.setIdEstaci(ea.getIdEstaci());
      estrategiaAccionDto.setIxTipo(3);

      MasterCatalogoDTO catalogoAccion = new MasterCatalogoDTO();
      catalogoAccion.setIdCatalogo(ea.getMasterCatalogo().getId());
      estrategiaAccionDto.setMasterCatalogo(catalogoAccion);
      return estrategiaAccionDto;
    }).toList();
    vo.setObjetivo(objetivoDto);

    vo.setFechaTentativa(fechasTentativas);
    vo.setCsEstatus(it.getCsEstatus());

    vo.setItSemantica(1);

    it.getAdecuacionActividad().stream()
        .filter(adecuacion -> {
          var adecuacionSolicitud = adecuacion.getAdecuacionSolicitud();
          if (adecuacionSolicitud == null) return false;
          var solicitud = adecuacionSolicitud.getSolicitud();
          return solicitud != null;
        })
        .findFirst()
        .ifPresent(adecuacion -> vo.setItSemantica(2));

    return vo;
  }

  @Override
  public MensajePersonalizado<Integer> secuencialPorProyecto(Integer idProyecto) {

    proyectoAnualRepository.findByIdOptional(idProyecto).orElseThrow(() -> new NotFoundException("No existe el proyecto con id " + idProyecto));
    var secuenciaPorProyecto = secuenciaActividadRepository.find("proyecto.idProyecto", idProyecto).firstResult();

    Integer secActividad = secuenciaPorProyecto == null || secuenciaPorProyecto.getIdSecuencia() == null || secuenciaPorProyecto.getIxSecuencia() == null ? 1 : secuenciaPorProyecto.getIxSecuencia();
    MensajePersonalizado<Integer> respuesta = new MensajePersonalizado<Integer>();
    try {
      respuesta.setCodigo("200");
      respuesta.setMensaje("Exitoso");
      respuesta.setRespuesta(secActividad);
    } catch (Exception e) {
      respuesta.setCodigo("500");
      respuesta.setMensaje("Error al calcular y pesistir la secuencia por proyecto");
      e.printStackTrace();
    }
    return respuesta;
  }
}
