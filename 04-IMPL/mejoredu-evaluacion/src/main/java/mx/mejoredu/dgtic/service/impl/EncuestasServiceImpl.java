package mx.mejoredu.dgtic.service.impl;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.evaluacion.PeticionRegistroEncuestaVO;
import mx.edu.sep.dgtic.mejoredu.evaluacion.RespuestaEncuentaVO;
import mx.mejoredu.dgtic.dao.ArchivoRepository;
import mx.mejoredu.dgtic.dao.EvaluacionConsultaRepository;
import mx.mejoredu.dgtic.dao.TipoDocumentoRepository;
import mx.mejoredu.dgtic.dao.UsuarioRepository;
import mx.mejoredu.dgtic.entity.Archivo;
import mx.mejoredu.dgtic.entity.EvaluacionConsulta;
import mx.mejoredu.dgtic.service.EncuestasService;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class EncuestasServiceImpl implements EncuestasService {
  @Inject
  private EvaluacionConsultaRepository evaluacionConsultaRepository;
  @Inject
  private UsuarioRepository usuarioRepository;
  @Inject
  private ArchivoRepository archivoRepository;
  @Inject
  private TipoDocumentoRepository tipoDocumentoRepository;

  @Override
  public List<RespuestaEncuentaVO> consultarEncuestas(Integer anhio) {
    var encuestas = evaluacionConsultaRepository.list("""
            SELECT e
            FROM EvaluacionConsulta e
            WHERE e.anhio = ?1
            AND e.estatus NOT IN ('B')
        """, anhio);

    return encuestas.stream().map(EvaluacionConsulta::toRespuestaEncuentaVO).toList();
  }

  @Override
  @Transactional
  public void registrarEncuesta(PeticionRegistroEncuestaVO peticion) {
    var usuario = usuarioRepository.findByIdOptional(peticion.getCveUsuario()).orElseThrow(
        () -> new BadRequestException("El usuario con la clave " + peticion.getCveUsuario() + " no está registrado")
    );
    var tipoDocumento = tipoDocumentoRepository.find("cxExtension", "pdf").firstResultOptional().orElseThrow(
        () -> new BadRequestException("El tipo de documento con la extensión pdf no está registrado")
    );

    var encuesta = getEncuesta(peticion.getIdEncuesta());
    encuesta.setAnhio(peticion.getAnhio());
    encuesta.setAreaResponsable(peticion.getAreaResponsable());
    encuesta.setTipoInstrumento(peticion.getTipoInstrumento());
    encuesta.setNombreInstrumento(peticion.getNombreInstrumento());
    encuesta.setObjetivo(peticion.getObjetivo());
    encuesta.setEstatus('C');

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

      encuesta.setArchivo(archivo);
    }

    encuesta.setUsuario(usuario);

    evaluacionConsultaRepository.persist(encuesta);
  }

  @Override
  @Transactional
  public void eliminarEncuesta(Long idEncuesta) {
    var encuesta = evaluacionConsultaRepository.findByIdOptional(idEncuesta).orElseThrow(
        () -> new NotFoundException("La encuesta con el id " + idEncuesta + " no está registrada")
    );

    encuesta.setEstatus('B');

    evaluacionConsultaRepository.persist(encuesta);
  }

  private EvaluacionConsulta getEncuesta(Long idEncuesta) {
    if (idEncuesta != null) {
      return evaluacionConsultaRepository.findByIdOptional(idEncuesta).orElseThrow(
          () -> new NotFoundException("La encuesta con el id " + idEncuesta + " no está registrada")
      );
    }
    return new EvaluacionConsulta();
  }
}
