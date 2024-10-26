package mx.sep.dgtic.mejoredu.seguimiento.service.impl;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import mx.sep.dgtic.mejoredu.cortoplazo.PeticionRegistroArchivosSeccion;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;
import mx.sep.dgtic.mejoredu.seguimiento.dao.ArchivoRepository;
import mx.sep.dgtic.mejoredu.seguimiento.dao.ArchivoSeccionRepository;
import mx.sep.dgtic.mejoredu.seguimiento.dao.TipoDocumentoRepository;
import mx.sep.dgtic.mejoredu.seguimiento.dao.UsuarioRepository;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Archivo;
import mx.sep.dgtic.mejoredu.seguimiento.entity.ArchivoSeccion;
import mx.sep.dgtic.mejoredu.seguimiento.service.ArchivoSeccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class ArchivoSeccionServiceImpl implements ArchivoSeccionService {
  @Autowired
  private ArchivoSeccionRepository archivoSeccionRepository;
  @Autowired
  private ArchivoRepository archivoRepository;
  @Autowired
  private TipoDocumentoRepository tipoDocumentoRepository;
  @Autowired
  private UsuarioRepository usuarioRepository;

  private static final Integer SECCION_SEGUIMIENTO_MEDIANO_PLAZO = 2;

  @Override
  public List<ArchivoDTO> consultarArchivos(Integer idAnhio) {
    var archivosSecciones = archivoSeccionRepository.find("""
            SELECT as FROM ArchivoSeccion as
            JOIN FETCH as.archivo
            WHERE as.ixSeccion = ?1 AND as.idAnhio = ?2
        """, SECCION_SEGUIMIENTO_MEDIANO_PLAZO, idAnhio).list();

    return archivosSecciones.stream().map(archivoSeccion -> {
      var archivo = archivoSeccion.getArchivo();
      var archivoDTO = new ArchivoDTO();
      archivoDTO.setIdArchivo(archivo.getIdArchivo());
      archivoDTO.setIdTipoDocumento(archivo.getTipoDocumento().getIdTipoDocumento());
      archivoDTO.setCxNombre(archivo.getNombre());
      archivoDTO.setCxUuid(archivo.getUuid());
      archivoDTO.setDfFechaCarga(archivo.getFechaCarga());
      archivoDTO.setDfHoraCarga(archivo.getHoraCarga());
      archivoDTO.setCsEstatus(archivo.getEstatus());
      archivoDTO.setCveUsuario(archivo.getUsuario().getCveUsuario());
      archivoDTO.setCxUuidToPdf(archivo.getUuidToPdf());

      return archivoDTO;
    }).toList();
  }

  @Override
  @Transactional
  public void registrar(PeticionRegistroArchivosSeccion peticion) {
    var usuario = usuarioRepository.findByIdOptional(peticion.getUsuario())
        .orElseThrow(() -> new BadRequestException("El usuario con la clave " + peticion.getUsuario() + " no está registrado"));
    var tipoDocumento = tipoDocumentoRepository.find("cxExtension", "pdf")
        .firstResultOptional()
        .orElseThrow(() -> new BadRequestException("El tipo de documento con la extensión pdf no está registrado"));

    archivoSeccionRepository.delete("""
        ixSeccion = ?1 AND idAnhio = ?2
        """, SECCION_SEGUIMIENTO_MEDIANO_PLAZO, peticion.getIdAnhio());

    for(var archivoBase : peticion.getArchivos()) {
      var archivo = archivoRepository
          .find("uuid", archivoBase.getUuid())
          .firstResultOptional()
          .orElse(new Archivo());

      archivo.setEstatus("C");
      archivo.setNombre(archivoBase.getNombre());
      archivo.setUuid(archivoBase.getUuid());
      archivo.setFechaCarga(LocalDate.now());
      archivo.setHoraCarga(LocalTime.now());

      archivo.setTipoDocumento(tipoDocumento);
      archivo.setUsuario(usuario);

      archivoRepository.persist(archivo);

      var archivoSeccion = new ArchivoSeccion();
      archivoSeccion.setIdArchivo(archivo.getIdArchivo());
      archivoSeccion.setIdAnhio(peticion.getIdAnhio());
      archivoSeccion.setIxSeccion(SECCION_SEGUIMIENTO_MEDIANO_PLAZO);
      archivoSeccionRepository.persist(archivoSeccion);
    }
  }
}
