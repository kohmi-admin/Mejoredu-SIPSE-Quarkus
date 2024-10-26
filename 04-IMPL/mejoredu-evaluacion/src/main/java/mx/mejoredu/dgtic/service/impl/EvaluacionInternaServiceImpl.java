package mx.mejoredu.dgtic.service.impl;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.evaluacion.*;
import mx.mejoredu.dgtic.dao.*;
import mx.mejoredu.dgtic.entity.*;
import mx.mejoredu.dgtic.service.EvaluacionInternaService;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EvaluacionInternaServiceImpl implements EvaluacionInternaService {
  @Inject
  private EvidenciaInternaRepository evidenciaInternaRepository;
  @Inject
  private InformeInternoRepository informeInternoRepository;
  @Inject
  private DesempenhioInternoRepository desempenhioInternoRepository;
  @Inject
  private UsuarioRepository usuarioRepository;
  @Inject
  private ArchivoRepository archivoRepository;
  @Inject
  private TipoDocumentoRepository tipoDocumentoRepository;

  @Override
  public List<RespuestaInformeAutoevaluacionVO> consultarInformesAutoevaluacion(Integer anhio, Integer trimestre) {
    var informes = informeInternoRepository.list("""
            SELECT i
            FROM InformeInterno i
            WHERE i.anhio = ?1 AND i.periodo = ?2 AND i.estatus NOT IN ('B')
        """, anhio, trimestre);

    return informes.stream().map(InformeInterno::entitieToRespuestaVO).toList();
  }

  @Override
  @Transactional
  public void registrarInformeAutoevaluacion(PeticionRegistroInformeAutoevaluacionVO peticion) {
    var usuario = usuarioRepository.findByIdOptional(peticion.getCveUsuario()).orElseThrow(
        () -> new BadRequestException("El usuario con la clave " + peticion.getCveUsuario() + " no está registrado")
    );
    var tipoDocumento = tipoDocumentoRepository.find("cxExtension", "pdf").firstResultOptional().orElseThrow(
        () -> new BadRequestException("El tipo de documento con la extensión zip no está registrado")
    );

    var informe = getInforme(peticion.getIdInforme());
    informe.setAnhio(peticion.getAnhio());
    informe.setPeriodo(peticion.getPeriodo());
    informe.setNombreInforme(peticion.getNombreInforme());
    informe.setEstatus('C');
    informe.setUsuario(usuario);

    if (peticion.getDocumentoZip() != null) {
      var archivo = archivoRepository
          .find("uuid", peticion.getDocumentoZip().getUuid())
          .firstResultOptional()
          .orElse(new Archivo());
      archivo.setEstatus("C");
      archivo.setNombre(peticion.getDocumentoZip().getNombre());
      archivo.setUuid(peticion.getDocumentoZip().getUuid());
      archivo.setFechaCarga(Date.valueOf(LocalDate.now()));
      archivo.setHoraCarga(Time.valueOf(LocalTime.now()));

      archivo.setUsuario(usuario);
      archivo.setIdTipoDocumento(tipoDocumento.getIdTipoDocumento());

      archivoRepository.persist(archivo);
      informe.setArchivo(archivo);
    }

    informeInternoRepository.persist(informe);
  }

  @Override
  @Transactional
  public void eliminarInformeAutoevaluacion(Long id) {
    var informe = informeInternoRepository.findByIdOptional(id).orElseThrow(
        () -> new NotFoundException("El informe con el id " + id + " no está registrado")
    );
    informe.setEstatus('B');

    informeInternoRepository.persist(informe);
  }

  private InformeInterno getInforme(Long idInforme) {
    if (idInforme != null) {
      return informeInternoRepository.findByIdOptional(idInforme).orElseThrow(
          () -> new NotFoundException("El informe con el id " + idInforme + " no está registrado")
      );
    }
    return new InformeInterno();
  }

  @Override
  public List<RespuestaEvidenciaAutoevaluacionVO> consultarEvidenciasAutoevaluacion(Integer anhio, Integer trimestre) {
    var evidencias = evidenciaInternaRepository.list("""
            SELECT e
            FROM EvidenciaInterna e
            WHERE e.anhio = ?1 AND e.periodo = ?2 AND e.estatus NOT IN ('B')
        """, anhio, trimestre);

    return evidencias.stream().map(EvidenciaInterna::toRespuestaEvidenciaAutoevaluacionVO).toList();
  }

  @Override
  @Transactional
  public void registrarEvidenciasAutoevaluacion(PeticionRegistroEvidenciaAutoevaluacionVO peticion) {
    var usuario = usuarioRepository.findByIdOptional(peticion.getCveUsuario()).orElseThrow(
        () -> new BadRequestException("El usuario con la clave " + peticion.getCveUsuario() + " no está registrado")
    );

    var tipoDocumento = tipoDocumentoRepository.find("cxExtension", "pdf").firstResultOptional().orElseThrow(
        () -> new BadRequestException("El tipo de documento con la extensión pdf no está registrado")
    );

    var evidencia = getEvidencia(peticion.getIdEvidencia());

    evidencia.setIdApartado(peticion.getIdApartado());
    evidencia.setAnhio(peticion.getAnhio());
    evidencia.setPeriodo(peticion.getPeriodo());
    evidencia.setEstatus('C');
    evidencia.setUsuario(usuario);

    var archivos = peticion.getDocumentos().stream().map(archivo -> {
      var archivoEntity = archivoRepository
          .find("uuid", archivo.getUuid())
          .firstResultOptional()
          .orElse(new Archivo());
      archivoEntity.setEstatus("C");
      archivoEntity.setNombre(archivo.getNombre());
      archivoEntity.setUuid(archivo.getUuid());
      archivoEntity.setFechaCarga(Date.valueOf(LocalDate.now()));
      archivoEntity.setHoraCarga(Time.valueOf(LocalTime.now()));
      archivoEntity.setUsuario(usuario);
      archivoEntity.setIdTipoDocumento(tipoDocumento.getIdTipoDocumento());
      archivoRepository.persist(archivoEntity);
      return archivoEntity;
    }).collect(Collectors.toSet());

    evidencia.setArchivos(archivos);

    evidenciaInternaRepository.persist(evidencia);
  }

  @Override
  @Transactional
  public void eliminarEvidenciasAutoevaluacion(Long id) {
    var evidencia = evidenciaInternaRepository.findByIdOptional(id).orElseThrow(
        () -> new NotFoundException("La evidencia con el id " + id + " no está registrada")
    );
    evidencia.setEstatus('B');

    evidenciaInternaRepository.persist(evidencia);
  }

  private EvidenciaInterna getEvidencia(Long idEvidencia) {
    if (idEvidencia != null) {
      return evidenciaInternaRepository.findByIdOptional(idEvidencia).orElseThrow(
          () -> new NotFoundException("La evidencia con el id " + idEvidencia + " no está registrada")
      );
    }
    return new EvidenciaInterna();
  }

  @Override
  public List<RespuestaEvaluacionVO> consultarEvaluaciones(Integer anhio) {
    var evaluaciones = desempenhioInternoRepository.list("""
            SELECT d
            FROM DesempenhioInterno d
            WHERE d.anhio = ?1 AND d.estatus NOT IN ('B')
        """, anhio);

    return evaluaciones.stream().map(DesempenhioInterno::toRespuestaEvaluacionVO).toList();
  }

  @Override
  @Transactional
  public void registrarEvaluacion(PeticionRegistroEvaluacionVO peticion) {
    var usuario = usuarioRepository.findByIdOptional(peticion.getCveUsuario()).orElseThrow(
        () -> new BadRequestException("El usuario con la clave " + peticion.getCveUsuario() + " no está registrado")
    );
    var tipoDocumento = tipoDocumentoRepository.find("cxExtension", "pdf").firstResultOptional().orElseThrow(
        () -> new BadRequestException("El tipo de documento con la extensión pdf no está registrado")
    );

    var desempenhio = getDesempenhio(peticion.getIdEvaluacion());

    desempenhio.setAnhio(peticion.getAnhio());
    desempenhio.setActor(peticion.getActor());
    desempenhio.setNombreEvaluacion(peticion.getNombreEvaluacion());
    desempenhio.setTipoInforme(peticion.getTipoInforme());
    desempenhio.setObservaciones(peticion.getObservaciones());
    desempenhio.setAtencionObservaciones(peticion.getAtencionObservaciones());
    desempenhio.setEstatus('C');

    if (peticion.getDocumentoZip() != null) {
      var archivo = archivoRepository
          .find("uuid", peticion.getDocumentoZip().getUuid())
          .firstResultOptional()
          .orElse(new Archivo());

      archivo.setEstatus("C");
      archivo.setNombre(peticion.getDocumentoZip().getNombre());
      archivo.setUuid(peticion.getDocumentoZip().getUuid());
      archivo.setFechaCarga(Date.valueOf(LocalDate.now()));
      archivo.setHoraCarga(Time.valueOf(LocalTime.now()));

      archivo.setUsuario(usuario);
      archivo.setIdTipoDocumento(tipoDocumento.getIdTipoDocumento());

      archivoRepository.persist(archivo);

      desempenhio.setArchivo(archivo);
    }

    desempenhio.setUsuario(usuario);

    desempenhioInternoRepository.persist(desempenhio);
  }

  @Override
  @Transactional
  public void eliminarEvaluacion(Long id) {
    var desempenhio = desempenhioInternoRepository.findByIdOptional(id).orElseThrow(
        () -> new NotFoundException("El desempeño con el id " + id + " no está registrado")
    );
    desempenhio.setEstatus('B');

    desempenhioInternoRepository.persist(desempenhio);
  }

  private DesempenhioInterno getDesempenhio(Long idDesempenhio) {
    if (idDesempenhio != null) {
      return desempenhioInternoRepository.findByIdOptional(idDesempenhio).orElseThrow(
          () -> new NotFoundException("El desempeño con el id " + idDesempenhio + " no está registrado")
      );
    }
    return new DesempenhioInterno();
  }
}
