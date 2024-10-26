package mx.sep.dgtic.sipse.presupuestal.service.impl;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.presupuestales.PeticionDatosGeneralesVO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.RespuestaDatosGeneralesVO;
import mx.sep.dgtic.sipse.presupuestal.dao.ArchivoRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.DatosGeneralesRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.MetValidacionRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.ProgramaPresupuestalRepository;
import mx.sep.dgtic.sipse.presupuestal.entity.Archivo;
import mx.sep.dgtic.sipse.presupuestal.entity.DatosGenerales;
import mx.sep.dgtic.sipse.presupuestal.entity.ProgramaPresupuestal;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;
import mx.sep.dgtic.sipse.presupuestal.service.DatosGeneralesService;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;

@Service
public class DatosGeneralesServiceImpl implements DatosGeneralesService {
  @ConfigProperty(name = "programa_presupuestal.p016")
  private Integer ID_P016;
  @Inject
  private ProgramaPresupuestalRepository programaPresupuestalRepository;
  @Inject
  private DatosGeneralesRepository datosGeneralesRepository;
  @Inject
  private ArchivoRepository archivoRepository;
  @Inject
  private MetValidacionRepository metValidacionRepository;

  private RespuestaDatosGeneralesVO getRespuestaDatosGeneralesVO(DatosGenerales datosGenerales, ProgramaPresupuestal programa, List<ArchivoDTO> archivosVo) {
    var datosGeneralesVO = new RespuestaDatosGeneralesVO();

    datosGeneralesVO.setIdDatosGenerales(datosGenerales.getIdDatosGenerales());
    datosGeneralesVO.setNombreProgramaPresupuestal(datosGenerales.getCxNombrePrograma());
    datosGeneralesVO.setCveUsuario(programa.getCveUsuario());
    datosGeneralesVO.setArchivos(archivosVo);
    datosGeneralesVO.setIdRamo(datosGenerales.getIdRamoSector());
    datosGeneralesVO.setIdUnidadResponsable(datosGenerales.getIdUnidadResponsable());
    datosGeneralesVO.setAnho(programa.getIdAnhio());
    datosGeneralesVO.setFinalidad(datosGenerales.getCxFinalidad());
    datosGeneralesVO.setFuncion(datosGenerales.getCxFuncion());
    datosGeneralesVO.setSubfuncion(datosGenerales.getCxSubfuncion());
    datosGeneralesVO.setActividadInstitucional(datosGenerales.getCxActividadInstitucional());
    datosGeneralesVO.setIdVinculacionODS(datosGenerales.getIdVinculacionODS());

    if (Objects.nonNull(programa.getCsEstatus()))
      datosGeneralesVO.setEstatusGeneral(programa.getCsEstatus());
    if (Objects.nonNull(programa.getIdValidacion()))
      datosGeneralesVO.setEstatusPresupuestal(metValidacionRepository
              .findById(programa.getIdValidacion()).getCsEstatus());
    if (Objects.nonNull(programa.getIdValidacionPlaneacion()))
      datosGeneralesVO.setEstatusPlaneacion(metValidacionRepository
              .findById(programa.getIdValidacionPlaneacion()).getCsEstatus());
    if (Objects.nonNull(programa.getIdValidacionSupervisor()))
      datosGeneralesVO.setEstatusSupervisor(metValidacionRepository
              .findById(programa.getIdValidacionSupervisor()).getCsEstatus());

    return datosGeneralesVO;
  }

  @Override
  public RespuestaDatosGeneralesVO consultarPorAnho(int anho) {
    var programa = programaPresupuestalRepository.findByAnhoPlaneacionAndTipoPrograma(anho, ID_P016).orElseThrow(() -> {
      throw new NotFoundException("No se encontró el programa presupuestal del año: " + anho);
    });
    var datosGenerales = datosGeneralesRepository.findByProgramaPresupuestal(programa.getIdPresupuestal()).orElseGet(() -> {
      var nuevoDatosGenerales = new DatosGenerales();
      nuevoDatosGenerales.setIdPresupuestal(programa.getIdPresupuestal());
      return nuevoDatosGenerales;
    });

    var archivosVo = programa.getArchivos().stream().map(it -> {
      var archivoVO = new ArchivoDTO();

      archivoVO.setIdArchivo(it.getIdArchivo());
      archivoVO.setCxNombre(it.getCxNombre());
      archivoVO.setCxUuid(it.getCxUuid());
      archivoVO.setDfFechaCarga(it.getDfFechaCarga());
      archivoVO.setDfHoraCarga(it.getDhHoraCarga());
      archivoVO.setCsEstatus(it.getCsEstatus());
      archivoVO.setCveUsuario(it.getCveUsuario());
      archivoVO.setCxUuidToPdf(it.getCxUuidToPdf());

      return archivoVO;
    }).toList();

    return getRespuestaDatosGeneralesVO(datosGenerales, programa, archivosVo);
  }

  @Override
  public RespuestaDatosGeneralesVO consultarPorProgramaPresupuestal(int idProgramaPresupuestal) {
    var programa = programaPresupuestalRepository.findByIdOptional(idProgramaPresupuestal).orElseThrow(() -> {
      throw new NotFoundException("No se encontró el programa presupuestal con id: " + idProgramaPresupuestal);
    });
    var datosGenerales = datosGeneralesRepository.findByProgramaPresupuestal(idProgramaPresupuestal).orElseGet(() -> {
      var nuevoDatosGenerales = new DatosGenerales();
      nuevoDatosGenerales.setIdPresupuestal(programa.getIdPresupuestal());
      return nuevoDatosGenerales;
    });

    var archivosVo = programa.getArchivos().stream().map(it -> {
      var archivoVO = new ArchivoDTO();

      archivoVO.setIdArchivo(it.getIdArchivo());
      archivoVO.setCxNombre(it.getCxNombre());
      archivoVO.setCxUuid(it.getCxUuid());
      archivoVO.setDfFechaCarga(it.getDfFechaCarga());
      archivoVO.setDfHoraCarga(it.getDhHoraCarga());
      archivoVO.setCsEstatus(it.getCsEstatus());
      archivoVO.setCveUsuario(it.getCveUsuario());
      archivoVO.setCxUuidToPdf(it.getCxUuidToPdf());

      return archivoVO;
    }).toList();

    return getRespuestaDatosGeneralesVO(datosGenerales, programa, archivosVo);
  }

  @Override
  public RespuestaDatosGeneralesVO consultarPorId(int id) {
    var datosGenerales = datosGeneralesRepository.findByIdOptional(id).orElseThrow(() -> {
      throw new NotFoundException("No se encontró el programa presupuestal con id: " + id);
    });

    var archivosVo = datosGenerales.getProgramaPresupuestal().getArchivos().stream().map(it -> {
      var archivoVO = new ArchivoDTO();

      archivoVO.setIdArchivo(it.getIdArchivo());
      archivoVO.setCxNombre(it.getCxNombre());
      archivoVO.setCxUuid(it.getCxUuid());
      archivoVO.setDfFechaCarga(it.getDfFechaCarga());
      archivoVO.setDfHoraCarga(it.getDhHoraCarga());
      archivoVO.setCsEstatus(it.getCsEstatus());
      archivoVO.setCveUsuario(it.getCveUsuario());
      archivoVO.setCxUuidToPdf(it.getCxUuidToPdf());

      return archivoVO;
    }).toList();

    return getRespuestaDatosGeneralesVO(datosGenerales, datosGenerales.getProgramaPresupuestal(), archivosVo);
  }

  @Override
  public List<ArchivoDTO> consultarArchivosPorId(int id) {
    var datosGenerales = datosGeneralesRepository.findByIdOptional(id).orElseThrow(() -> {
      throw new NotFoundException("No se encontró el programa presupuestal con id: " + id);
    });

    var archivosVo = datosGenerales.getProgramaPresupuestal().getArchivos().stream().map(it -> {
      var archivoVO = new ArchivoDTO();

      archivoVO.setIdArchivo(it.getIdArchivo());
      archivoVO.setCxNombre(it.getCxNombre());
      archivoVO.setCxUuid(it.getCxUuid());
      archivoVO.setDfFechaCarga(it.getDfFechaCarga());
      archivoVO.setDfHoraCarga(it.getDhHoraCarga());
      archivoVO.setCsEstatus(it.getCsEstatus());
      archivoVO.setCveUsuario(it.getCveUsuario());
      archivoVO.setCxUuidToPdf(it.getCxUuidToPdf());

      return archivoVO;
    }).toList();

    return archivosVo;
  }

  @Override
  @Transactional
  public void registrar(PeticionDatosGeneralesVO datosGeneralesPeticion) {
    var programa = programaPresupuestalRepository.findByAnhoPlaneacionAndTipoPrograma(datosGeneralesPeticion.getAnho(), ID_P016).orElseGet(() -> {
      var programaPresupuestal = new ProgramaPresupuestal();
      programaPresupuestal.setIdTipoPrograma(ID_P016);
      programaPresupuestal.setIdAnhio(datosGeneralesPeticion.getAnho());
      programaPresupuestal.setCsEstatus("A");
      return programaPresupuestal;
    });

    programa.setCveUsuario(datosGeneralesPeticion.getCveUsuario());
    programa.getArchivos().clear();
    datosGeneralesPeticion.getArchivos().forEach(archivo -> {
      var archivoVO = archivoRepository.consultarPorUUID(archivo.getUuid()).orElseGet(() -> {
        var nuevoArchivo = new Archivo();
        nuevoArchivo.setCxNombre(archivo.getNombre());
        nuevoArchivo.setCxUuid(archivo.getUuid());
        nuevoArchivo.setIdTipoDocumento(archivo.getTipoArchivo());
        nuevoArchivo.setDfFechaCarga(LocalDate.now());
        nuevoArchivo.setDhHoraCarga(LocalTime.now());
        nuevoArchivo.setCsEstatus("A");
        nuevoArchivo.setCveUsuario(datosGeneralesPeticion.getCveUsuario());

        archivoRepository.persist(nuevoArchivo);
        return nuevoArchivo;
      });
      programa.getArchivos().add(archivoVO);
    });

    programaPresupuestalRepository.persist(programa);

    var datosGenerales = datosGeneralesRepository.findByProgramaPresupuestal(programa.getIdPresupuestal()).orElseGet(() -> {
      var nuevoDatosGenerales = new DatosGenerales();
      nuevoDatosGenerales.setIdPresupuestal(programa.getIdPresupuestal());
      return nuevoDatosGenerales;
    });

    datosGenerales.setCxNombrePrograma(datosGeneralesPeticion.getNombreProgramaPresupuestal());
    datosGenerales.setIdRamoSector(datosGeneralesPeticion.getIdRamo());
    datosGenerales.setIdUnidadResponsable(datosGeneralesPeticion.getIdUnidadResponsable());
    datosGenerales.setCxFinalidad(datosGeneralesPeticion.getFinalidad());
    datosGenerales.setCxFuncion(datosGeneralesPeticion.getFuncion());
    datosGenerales.setCxSubfuncion(datosGeneralesPeticion.getSubfuncion());
    datosGenerales.setCxActividadInstitucional(datosGeneralesPeticion.getActividadInstitucional());
    datosGenerales.setIdVinculacionODS(datosGeneralesPeticion.getIdVinculacionODS());

    datosGeneralesRepository.persist(datosGenerales);
  }
}
