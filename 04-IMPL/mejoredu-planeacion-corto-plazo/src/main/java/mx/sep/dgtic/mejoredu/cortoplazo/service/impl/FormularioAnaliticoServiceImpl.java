package mx.sep.dgtic.mejoredu.cortoplazo.service.impl;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.ArchivoVO;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.RegistroArchivoVO;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.TipoDocumentoVO;
import mx.sep.dgtic.mejoredu.cortoplazo.FormularioAnaliticoVO;
import mx.sep.dgtic.mejoredu.cortoplazo.RegistroFormularioAnaliticoVO;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.AnhoPlaneacionRespository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.ArchivoRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.FormularioAnaliticoRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.UsuarioRepository;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.FormularioAnalitico;
import mx.sep.dgtic.mejoredu.cortoplazo.service.FormularioAnaliticoService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FormularioAnaliticoServiceImpl implements FormularioAnaliticoService {
  @Inject
  FormularioAnaliticoRepository formularioAnaliticoRepository;
  @Inject
  AnhoPlaneacionRespository anhoPlaneacionRespository;
  @Inject
  UsuarioRepository usuarioRepository;
  @Inject
  ArchivoRepository archivoRepository;

  @Override
  public List<FormularioAnaliticoVO> listarFormularios() {
    return formularioAnaliticoRepository.listAll().stream().map(it -> {
      var vo = new FormularioAnaliticoVO();
      vo.setIdFormulario(it.getIdFormulario());
      vo.setNombreUnidad(it.getCxNombreUnidad());
      vo.setClave(it.getCcClave());
      vo.setNombreProyecto(it.getCxNombreProyecto());
      vo.setObjetivo(it.getCxObjetivo());
      vo.setFundamentacion(it.getCxFundamentacion());
      vo.setAlcance(it.getCxAlcance());
      vo.setContribucionPI(it.getCxContribucionPI());
      vo.setContribucionPND(it.getCxContribucionPND());
      vo.setAnhio(it.getAnhoPlaneacion().getIdAnhio());
      vo.setCveUsuario(it.getUsuario().getCveUsuario());
      return vo;
    }).collect(Collectors.toList());
  }

  @Override
  @Transactional
  public FormularioAnaliticoVO registrarFormulario(RegistroFormularioAnaliticoVO registroFormularioAnaliticoVO) {
    var anhio = anhoPlaneacionRespository.findById(registroFormularioAnaliticoVO.getAnhio());
    var usuario = usuarioRepository.findById(registroFormularioAnaliticoVO.getCveUsuario());
    if (anhio == null) {
      throw new NotFoundException("No existe el año de planeación");
    }
    if (usuario == null) {
      throw new NotFoundException("No existe el usuario");
    }

    var formulario = new FormularioAnalitico();

    formulario.setAnhoPlaneacion(anhio);
    formulario.setUsuario(usuario);
    formulario.setCxNombreUnidad(registroFormularioAnaliticoVO.getNombreUnidad());
    formulario.setCcClave(registroFormularioAnaliticoVO.getClave());
    formulario.setCxNombreProyecto(registroFormularioAnaliticoVO.getNombreProyecto());
    formulario.setCxObjetivo(registroFormularioAnaliticoVO.getObjetivo());
    formulario.setCxFundamentacion(registroFormularioAnaliticoVO.getFundamentacion());
    formulario.setCxAlcance(registroFormularioAnaliticoVO.getAlcance());
    formulario.setCxContribucionPI(registroFormularioAnaliticoVO.getContribucionPI());
    formulario.setCxContribucionPND(registroFormularioAnaliticoVO.getContribucionPND());

    formularioAnaliticoRepository.persistAndFlush(formulario);

    var vo = new FormularioAnaliticoVO();
    vo.setIdFormulario(formulario.getIdFormulario());
    vo.setNombreUnidad(formulario.getCxNombreUnidad());
    vo.setClave(formulario.getCcClave());
    vo.setNombreProyecto(formulario.getCxNombreProyecto());
    vo.setObjetivo(formulario.getCxObjetivo());
    vo.setFundamentacion(formulario.getCxFundamentacion());
    vo.setAlcance(formulario.getCxAlcance());
    vo.setContribucionPI(formulario.getCxContribucionPI());
    vo.setContribucionPND(formulario.getCxContribucionPND());
    vo.setAnhio(formulario.getAnhoPlaneacion().getIdAnhio());
    vo.setCveUsuario(formulario.getUsuario().getCveUsuario());

    return vo;
  }

  @Override
  public FormularioAnaliticoVO obtenerFormulario(Long idFormulario) {
    var formulario = formularioAnaliticoRepository.findById(idFormulario);
    if (formulario == null) {
      throw new NotFoundException("No existe el formulario");
    }
    var vo = new FormularioAnaliticoVO();
    vo.setIdFormulario(formulario.getIdFormulario());
    vo.setNombreUnidad(formulario.getCxNombreUnidad());
    vo.setClave(formulario.getCcClave());
    vo.setNombreProyecto(formulario.getCxNombreProyecto());
    vo.setObjetivo(formulario.getCxObjetivo());
    vo.setFundamentacion(formulario.getCxFundamentacion());
    vo.setAlcance(formulario.getCxAlcance());
    vo.setContribucionPI(formulario.getCxContribucionPI());
    vo.setContribucionPND(formulario.getCxContribucionPND());
    vo.setAnhio(formulario.getAnhoPlaneacion().getIdAnhio());
    vo.setCveUsuario(formulario.getUsuario().getCveUsuario());

    return vo;
  }

  @Override
  @Transactional
  public FormularioAnaliticoVO actualizarFormulario(Long idFormulario, RegistroFormularioAnaliticoVO formularioAnaliticoVO) {
    var formulario = formularioAnaliticoRepository.findById(idFormulario);
    if (formulario == null) {
      throw new NotFoundException("No existe el formulario");
    }
    // DUDA: Los campos de anhio y usuario no se pueden actualizar?
    var anhio = anhoPlaneacionRespository.findById(formularioAnaliticoVO.getAnhio());
    var usuario = usuarioRepository.findById(formularioAnaliticoVO.getCveUsuario());
    if (anhio == null) {
      throw new NotFoundException("No existe el año de planeación");
    }
    if (usuario == null) {
      throw new NotFoundException("No existe el usuario");
    }

    // Update fields
    formulario.setAnhoPlaneacion(anhio);
    formulario.setUsuario(usuario);
    formulario.setCxNombreUnidad(formularioAnaliticoVO.getNombreUnidad());
    formulario.setCcClave(formularioAnaliticoVO.getClave());
    formulario.setCxNombreProyecto(formularioAnaliticoVO.getNombreProyecto());
    formulario.setCxObjetivo(formularioAnaliticoVO.getObjetivo());
    formulario.setCxFundamentacion(formularioAnaliticoVO.getFundamentacion());
    formulario.setCxAlcance(formularioAnaliticoVO.getAlcance());
    formulario.setCxContribucionPI(formularioAnaliticoVO.getContribucionPI());
    formulario.setCxContribucionPND(formularioAnaliticoVO.getContribucionPND());

    formularioAnaliticoRepository.persistAndFlush(formulario);

    var vo = new FormularioAnaliticoVO();
    vo.setIdFormulario(formulario.getIdFormulario());
    vo.setNombreUnidad(formulario.getCxNombreUnidad());
    vo.setClave(formulario.getCcClave());
    vo.setNombreProyecto(formulario.getCxNombreProyecto());
    vo.setObjetivo(formulario.getCxObjetivo());
    vo.setFundamentacion(formulario.getCxFundamentacion());
    vo.setAlcance(formulario.getCxAlcance());
    vo.setContribucionPI(formulario.getCxContribucionPI());
    vo.setContribucionPND(formulario.getCxContribucionPND());
    vo.setAnhio(formulario.getAnhoPlaneacion().getIdAnhio());
    vo.setCveUsuario(formulario.getUsuario().getCveUsuario());

    return vo;
  }

  @Override
  public Set<ArchivoVO> listarArchivos(Long idFormulario) {
    var formulario = formularioAnaliticoRepository.findById(idFormulario);
    if (formulario == null) {
      throw new NotFoundException("No existe el formulario");
    }

    return formularioAnaliticoRepository.listarArchivos(idFormulario).stream().map(it -> {
      var vo = new ArchivoVO();
      vo.setIdArchivo(it.getIdArchivo());
      vo.setCxNombre(it.getCxNombre());
      vo.setCxUuid(it.getCxUuid());

      var tipoDocumento = new TipoDocumentoVO();
      tipoDocumento.setIdTipoDocumento(it.getTipoDocumento().getIdTipoDocumento());
      tipoDocumento.setCdTipoDocumento(it.getTipoDocumento().getCdTipoDocumento());
      tipoDocumento.setCxExtension(it.getTipoDocumento().getCxExtension());
      tipoDocumento.setCxTipoContenido(it.getTipoDocumento().getCxTipoContenido());

      vo.setTipoDocumento(tipoDocumento);
      vo.setDfFechaCarga(it.getDfFechaCarga());
      vo.setDfHoraCarga(it.getDfHoraCarga());
      vo.setCsEstatus(it.getCsEstatus());
      vo.setCveUsuario(it.getUsuario().getCveUsuario());
      return vo;
    }).collect(Collectors.toSet());
  }

  @Override
  @Transactional
  public ArchivoVO agregarArchivo(Long idFormulario, RegistroArchivoVO registroArchivo) {
    var formulario = formularioAnaliticoRepository.findById(idFormulario);
    if (formulario == null) {
      throw new NotFoundException("No existe el formulario");
    }

    var archivo = archivoRepository.findById(registroArchivo.getIdArchivo());
    if (archivo == null) {
      throw new NotFoundException("No existe el archivo");
    }

    formulario.getArchivos().add(archivo);
    formularioAnaliticoRepository.persistAndFlush(formulario);

    var vo = new ArchivoVO();
    vo.setIdArchivo(archivo.getIdArchivo());
    vo.setCxNombre(archivo.getCxNombre());
    vo.setCxUuid(archivo.getCxUuid());

    var tipoDocumento = new TipoDocumentoVO();
    tipoDocumento.setIdTipoDocumento(archivo.getTipoDocumento().getIdTipoDocumento());
    tipoDocumento.setCdTipoDocumento(archivo.getTipoDocumento().getCdTipoDocumento());
    tipoDocumento.setCxExtension(archivo.getTipoDocumento().getCxExtension());
    tipoDocumento.setCxTipoContenido(archivo.getTipoDocumento().getCxTipoContenido());

    vo.setTipoDocumento(tipoDocumento);
    vo.setDfFechaCarga(archivo.getDfFechaCarga());
    vo.setDfHoraCarga(archivo.getDfHoraCarga());
    vo.setCsEstatus(archivo.getCsEstatus());
    vo.setCveUsuario(archivo.getUsuario().getCveUsuario());

    return vo;
  }
}
