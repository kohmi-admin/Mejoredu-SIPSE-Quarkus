package mx.sep.dgtic.mejoredu.seguimiento.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import mx.sep.dgtic.mejoredu.seguimiento.SolicitudFirmaDTO;
import mx.sep.dgtic.mejoredu.seguimiento.dao.ArchivoRepository;
import mx.sep.dgtic.mejoredu.seguimiento.dao.PerfilLaboralRepository;
import mx.sep.dgtic.mejoredu.seguimiento.dao.SolicitudFirmaRepository;
import mx.sep.dgtic.mejoredu.seguimiento.dao.SolicitudRepository;
import mx.sep.dgtic.mejoredu.seguimiento.dao.UsuarioRepository;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Archivo;
import mx.sep.dgtic.mejoredu.seguimiento.entity.PerfilLaboral;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Solicitud;
import mx.sep.dgtic.mejoredu.seguimiento.entity.SolicitudFirma;
import mx.sep.dgtic.mejoredu.seguimiento.entity.TipoDocumento;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Usuario;
import mx.sep.dgtic.mejoredu.seguimiento.service.SolicitudFirmaService;

@Service
public class SolicitudFirmaServiceImpl implements SolicitudFirmaService {

  @Inject
  private SolicitudFirmaRepository firmaRepository;
  @Inject
  private UsuarioRepository usuarioRepository;
  @Inject
  private SolicitudRepository solicitudRepository;
  @Inject
  private ArchivoRepository archivoRepository;
  
  @Inject
  private PerfilLaboralRepository perfilLaboralRepository;

  @Override
  @Transactional
  public Integer registrar(SolicitudFirmaDTO firmaDTO) {
    SolicitudFirma nuevaFirma = convert(firmaDTO);
    nuevaFirma.setDfFirma(LocalDate.now());
    nuevaFirma.setDhFirma(LocalTime.now());
    firmaRepository.persistAndFlush(nuevaFirma);
    //Registrar firma al usuario
    PerfilLaboral perfilLaboral = perfilLaboralRepository.find("usuario.cveUsuario",firmaDTO.getUsuario()).firstResult();
    perfilLaboral.setIdArchivo(nuevaFirma.getArchivo().getIdArchivo());
    perfilLaboralRepository.persistAndFlush(perfilLaboral);
    return nuevaFirma.getIdFirma();
  }

  @Override
  public SolicitudFirmaDTO consultaPorId(Integer id) {
    var firma = firmaRepository.findById(id);
    if (firma == null) {
      throw new NotFoundException("No existe la firma con id " + id);
    }
    return convert(firma);
  }

  @Override
  @Transactional
  public void actualizaPorId(Integer id, SolicitudFirmaDTO firmaUpdate) {
    var firma = firmaRepository.findById(id);
    if (firma == null) {
      throw new NotFoundException("No existe la firma con id " + id);
    }

    SolicitudFirma update = convert(firmaUpdate);

    firma.setArchivo(update.getArchivo());
    firma.setUsuario(update.getUsuario());
    firma.setSolicitud(update.getSolicitud());
    firma.setDfFirma(LocalDate.now());
    firma.setDhFirma(LocalTime.now());

    firmaRepository.persistAndFlush(firma);
  }

  @Override
  @Transactional
  public void eliminar(Integer id) {
    if (firmaRepository.findById(id) == null) {
      throw new NotFoundException("No existe la firma con id: " + id);
    }
    firmaRepository.deleteById(id);
  }

  private ModelMapper mapperDTO() {
    ModelMapper modelMapper = new ModelMapper();
    modelMapper.typeMap(SolicitudFirma.class, SolicitudFirmaDTO.class).addMappings(mapper -> {
      mapper.map(src -> src.getUsuario().getCveUsuario(), SolicitudFirmaDTO::setUsuario);
      mapper.map(src -> src.getSolicitud().getIdSolicitud(), SolicitudFirmaDTO::setIdSolicitud);

    });

    return modelMapper;
  }

  private SolicitudFirmaDTO convert(SolicitudFirma comentario) {
    return mapperDTO().map(comentario, SolicitudFirmaDTO.class);
  }

  private SolicitudFirma convert(SolicitudFirmaDTO firmaVO) {
    ModelMapper modelMapper = new ModelMapper();
    SolicitudFirma firma = modelMapper.map(firmaVO, SolicitudFirma.class);

    Usuario usuario = usuarioRepository.findById(firmaVO.getUsuario());
    if (usuario == null) {
      throw new NotFoundException("No existe el usuario con id: " + firmaVO.getUsuario());
    }
    Solicitud solicitud = solicitudRepository.findById(firmaVO.getIdSolicitud());
    if (solicitud == null) {
      throw new NotFoundException("No existe la solicitud con id: " + firmaVO.getIdSolicitud());
    }
    Archivo firmaUsuario = archivoRepository.find("uuid", firmaVO.getArchivo().getCxUuid()).firstResultOptional().orElseGet(() -> {
      var archivo = new Archivo();

      archivo.setEstatus(firmaVO.getArchivo().getCsEstatus() == null ? "C" : firmaVO.getArchivo().getCsEstatus());
      archivo.setNombre(firmaVO.getArchivo().getCxNombre());
      archivo.setUsuario(usuario);
      archivo.setUuid(firmaVO.getArchivo().getCxUuid());
      archivo.setFechaCarga(LocalDate.now());
      archivo.setHoraCarga(LocalTime.now());
      TipoDocumento tipoDoc = new TipoDocumento();
      tipoDoc.setIdTipoDocumento(firmaVO.getArchivo().getTipoDocumento().getIdTipoDocumento());
      archivo.setTipoDocumento(tipoDoc);

      archivoRepository.persistAndFlush(archivo);

      return archivo;
    });

    firma.setUsuario(usuario);
    firma.setSolicitud(solicitud);
    firma.setArchivo(firmaUsuario);


    return firma;
  }

}
