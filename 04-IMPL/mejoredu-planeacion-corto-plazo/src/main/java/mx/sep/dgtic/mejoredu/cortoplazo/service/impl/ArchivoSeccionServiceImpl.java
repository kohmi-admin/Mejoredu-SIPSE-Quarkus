package mx.sep.dgtic.mejoredu.cortoplazo.service.impl;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import mx.edu.sep.dgtic.mejoredu.comun.ArchivoBase;
import mx.sep.dgtic.mejoredu.cortoplazo.PeticionRegistroArchivosSeccion;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.ArchivoRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.ArchivoSeccionRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.TipoDocumentoRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.UsuarioRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.Archivo;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.ArchivoSeccion;
import mx.sep.dgtic.mejoredu.cortoplazo.service.ArchivoSeccionService;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;
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

  private static final Integer SECCION_CORTO_PLAZO = 1;

  @Override
  public List<ArchivoDTO> consultarArchivos(Integer idAnhio, Integer subseccion) {
    var archivosSecciones = archivoSeccionRepository.find("""
            SELECT as FROM ArchivoSeccion as
            JOIN FETCH as.archivo
            WHERE as.ixSeccion = ?1 AND as.idAnhio = ?2 AND as.ixSubseccion = ?3
        """, SECCION_CORTO_PLAZO, idAnhio, subseccion).list();

    return archivosSecciones.stream().map(archivoSeccion -> {
      var archivo = archivoSeccion.getArchivo();
      var archivoDTO = new ArchivoDTO();
      archivoDTO.setIdArchivo(archivo.getIdArchivo());
      archivoDTO.setIdTipoDocumento(archivo.getTipoDocumento().getIdTipoDocumento());
      archivoDTO.setCxNombre(archivo.getCxNombre());
      archivoDTO.setCxUuid(archivo.getCxUuid());
      archivoDTO.setDfFechaCarga(archivo.getDfFechaCarga());
      archivoDTO.setDfHoraCarga(archivo.getDfHoraCarga());
      archivoDTO.setCsEstatus(archivo.getCsEstatus());
      archivoDTO.setCveUsuario(archivo.getUsuario().getCveUsuario());
      archivoDTO.setCxUuidToPdf(archivo.getCxUuidToPdf());

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
        ixSeccion = ?1 AND idAnhio = ?2 AND ixSubseccion = ?3
        """, SECCION_CORTO_PLAZO, peticion.getIdAnhio(), peticion.getSubseccion());

    for(var archivoBase : peticion.getArchivos()) {
      var archivo = archivoRepository
          .find("cxUuid", archivoBase.getUuid())
          .firstResultOptional()
          .orElse(new Archivo());

      archivo.setCsEstatus("C");
      archivo.setCxNombre(archivoBase.getNombre());
      archivo.setCxUuid(archivoBase.getUuid());
      archivo.setDfFechaCarga(LocalDate.now());
      archivo.setDfHoraCarga(LocalTime.now());

      archivo.setTipoDocumento(tipoDocumento);
      archivo.setUsuario(usuario);

      archivoRepository.persist(archivo);

      var archivoSeccion = new ArchivoSeccion();
      archivoSeccion.setIdArchivo(archivo.getIdArchivo());
      archivoSeccion.setIdAnhio(peticion.getIdAnhio());
      archivoSeccion.setIxSeccion(SECCION_CORTO_PLAZO);
      archivoSeccion.setIxSubseccion(peticion.getSubseccion());
      archivoSeccionRepository.persist(archivoSeccion);
    }
  }
}
