package mx.mejoredu.dgtic.service.impl;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.evaluacion.PeticionRegistroAspectosSusceptiblesVO;
import mx.edu.sep.dgtic.mejoredu.evaluacion.PeticionRegistroInformeEvaluacionExternaVO;
import mx.edu.sep.dgtic.mejoredu.evaluacion.RespuestaAspectosSusceptiblesVO;
import mx.edu.sep.dgtic.mejoredu.evaluacion.RespuestaInformeEvaluacionExternaVO;
import mx.mejoredu.dgtic.dao.*;
import mx.mejoredu.dgtic.entity.Archivo;
import mx.mejoredu.dgtic.entity.AspectosSusceptibles;
import mx.mejoredu.dgtic.entity.InformeExterno;
import mx.mejoredu.dgtic.service.EvaluacionExternaService;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class EvaluacionExternaServiceImpl implements EvaluacionExternaService {
  @Inject
  private InformeExternoRepository informeExternoRepository;
  @Inject
  private AspectosSusceptiblesRepository aspectosSusceptiblesRepository;
  @Inject
  private UsuarioRepository usuarioRepository;
  @Inject
  private ArchivoRepository archivoRepository;
  @Inject
  private TipoDocumentoRepository tipoDocumentoRepository;

  @Override
  public List<RespuestaInformeEvaluacionExternaVO> consultarInformesEvaluacionExterna(Integer anhio) {
    var informes = informeExternoRepository.list("""
            SELECT i
            FROM InformeExterno i
            WHERE i.anhio = ?1
            AND i.estatus NOT IN ('B')
        """, anhio);

    return informes.stream().map(InformeExterno::toRespuestaInformeEvaluacionExternaVO).toList();
  }

  @Override
  @Transactional
  public void registrarInformeEvaluacionExterna(PeticionRegistroInformeEvaluacionExternaVO peticion) {
    var usuario = usuarioRepository.findByIdOptional(peticion.getCveUsuario()).orElseThrow(
        () -> new BadRequestException("El usuario con la clave " + peticion.getCveUsuario() + " no está registrado")
    );
    var tipoDocumento = tipoDocumentoRepository.find("cxExtension", "pdf").firstResultOptional().orElseThrow(
        () -> new BadRequestException("El tipo de documento con la extensión pdf no está registrado")
    );

    var informe = getInforme(peticion.getIdInformeExterno());

    informe.setAnhio(peticion.getAnhio());
    informe.setTipoEvaluacion(peticion.getTipoEvaluacion());
    informe.setNombreEvaluacion(peticion.getNombreEvaluacion());
    informe.setTipoInforme(peticion.getTipoInforme());
    informe.setPosicionInstitucional(peticion.getPosicionInstitucional());
    informe.setAspectosSusceptiblesMejora(peticion.getAspectosSusceptiblesMejora());
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

    informeExternoRepository.persist(informe);
  }

  @Override
  @Transactional
  public void eliminarInformeEvaluacionExterna(Long id) {
    var informe = informeExternoRepository.findByIdOptional(id).orElseThrow(
        () -> new NotFoundException("El informe con el id " + id + " no está registrado")
    );

    informe.setEstatus('B');

    informeExternoRepository.persist(informe);
  }

  private InformeExterno getInforme(Long idInforme) {
    if (idInforme != null) {
      return informeExternoRepository.findByIdOptional(idInforme).orElseThrow(
          () -> new NotFoundException("El informe con el id " + idInforme + " no está registrado")
      );
    }
    return new InformeExterno();
  }

  @Override
  public List<RespuestaAspectosSusceptiblesVO> consultarAspectosSusceptibles(Integer anhio) {
    var aspectos = aspectosSusceptiblesRepository.list("""
            SELECT a
            FROM AspectosSusceptibles a
            WHERE a.anhio = ?1
            AND a.estatus NOT IN ('B')
        """, anhio);

    return aspectos.stream().map(AspectosSusceptibles::toRespuestaAspectosSusceptiblesVO).toList();
  }

  @Override
  @Transactional
  public void registrarAspectosSusceptibles(PeticionRegistroAspectosSusceptiblesVO peticion) {
    var usuario = usuarioRepository.findByIdOptional(peticion.getCveUsuario()).orElseThrow(
        () -> new BadRequestException("El usuario con la clave " + peticion.getCveUsuario() + " no está registrado")
    );
    var tipoDocumento = tipoDocumentoRepository.find("cxExtension", "pdf").firstResultOptional().orElseThrow(
        () -> new BadRequestException("El tipo de documento con la extensión zip no está registrado")
    );

    var aspectos = getAspectosSusceptibles(peticion.getIdAspectosSusceptibles());

    aspectos.setAnhio(peticion.getAnhio());
    aspectos.setCvePrograma(peticion.getCvePrograma());
    aspectos.setAspectosSusceptiblesMejora(peticion.getAspectosSusceptiblesMejora());
    aspectos.setActividades(peticion.getActividades());
    aspectos.setIdAreaResponsable(peticion.getIdAreaResponsable());
    aspectos.setFechaTermino(Date.valueOf(peticion.getFechaTermino()));
    aspectos.setResultadosEsperados(peticion.getResultadosEsperados());
    aspectos.setProductosEvidencias(peticion.getProductosEvidencias());
    aspectos.setPorcentajeAvance(peticion.getPorcentajeAvance());
    aspectos.setObservaciones(peticion.getObservaciones());
    aspectos.setEstatus('C');
    aspectos.setNo(peticion.getNo());

    if (peticion.getDocumentoProbatorio() != null) {
      var archivo = archivoRepository
          .find("uuid", peticion.getDocumentoProbatorio().getUuid())
          .firstResultOptional()
          .orElse(new Archivo());

      archivo.setEstatus("C");
      archivo.setNombre(peticion.getDocumentoProbatorio().getNombre());
      archivo.setUuid(peticion.getDocumentoProbatorio().getUuid());
      archivo.setFechaCarga(Date.valueOf(LocalDate.now()));
      archivo.setHoraCarga(Time.valueOf(LocalTime.now()));

      archivo.setUsuario(usuario);
      archivo.setIdTipoDocumento(tipoDocumento.getIdTipoDocumento());

      archivoRepository.persist(archivo);

      aspectos.setArchivo(archivo);
    }

    aspectos.setUsuario(usuario);

    aspectosSusceptiblesRepository.persist(aspectos);
  }

  @Override
  @Transactional
  public void eliminarAspectosSusceptibles(Long id) {
    var aspectos = aspectosSusceptiblesRepository.findByIdOptional(id).orElseThrow(
        () -> new NotFoundException("Los aspectos susceptibles con el id " + id + " no están registrados")
    );

    aspectos.setEstatus('B');

    aspectosSusceptiblesRepository.persist(aspectos);
  }

  private AspectosSusceptibles getAspectosSusceptibles(Long idAspectosSusceptibles) {
    if (idAspectosSusceptibles != null) {
      return aspectosSusceptiblesRepository.findByIdOptional(idAspectosSusceptibles).orElseThrow(
          () -> new NotFoundException("Los aspectos susceptibles con el id " + idAspectosSusceptibles + " no están registrados")
      );
    }
    return new AspectosSusceptibles();
  }
}
