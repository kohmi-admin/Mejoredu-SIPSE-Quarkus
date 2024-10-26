package mx.sep.dgtic.mejoredu.seguimiento.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import mx.sep.dgtic.mejoredu.seguimiento.ComentarioSolicitudDTO;
import mx.sep.dgtic.mejoredu.seguimiento.dao.SolicitudComentarioRepository;
import mx.sep.dgtic.mejoredu.seguimiento.dao.SolicitudRepository;
import mx.sep.dgtic.mejoredu.seguimiento.dao.UsuarioRepository;
import mx.sep.dgtic.mejoredu.seguimiento.entity.SolicitudComentario;
import mx.sep.dgtic.mejoredu.seguimiento.service.SolicitudComentarioService;

@Service
public class SolicitudComentarioServiceImpl implements SolicitudComentarioService {

	@Inject
	private SolicitudComentarioRepository comentarioRepository;
	@Inject
	private UsuarioRepository usuarioRepository;
	@Inject
	private SolicitudRepository solicitudRepository;

	@Override
	@Transactional
	public void registrar(ComentarioSolicitudDTO comentarioDTO) {
		SolicitudComentario nuevoComentario = convert(comentarioDTO);
		nuevoComentario.setDfSeguimiento(LocalDate.now());
		nuevoComentario.setDhSeguimiento(LocalTime.now());
		comentarioRepository.persistAndFlush(nuevoComentario);
	}

	@Override
	public List<ComentarioSolicitudDTO> consultaPorIdSolicitud(Integer idSolicitud) {
		var comentarios = comentarioRepository.findComentariosByIdSolicitud(idSolicitud);
		if (comentarios == null || comentarios.isEmpty()) {
			throw new NotFoundException("No existen comentarios con idSolicitud: " + idSolicitud);
		}
		return convertList(comentarios);
	}

	@Override
	public ComentarioSolicitudDTO consultaPorId(Integer id) {
		var comentario = comentarioRepository.findById(id);
		if (comentario == null) {
			throw new NotFoundException("No existe el comentario con id " + id);
		}
		return convert(comentario);
	}

	@Override
	@Transactional
	public void actualizaPorId(Integer id, ComentarioSolicitudDTO comentarioUpdate) {
		var comentario = comentarioRepository.findById(id);
		if (comentario == null) {
			throw new NotFoundException("No existe el comentario con id " + id);
		}

		SolicitudComentario update = convert(comentarioUpdate);

		comentario.setComentario(update.getComentario());
		comentario.setUsuario(update.getUsuario());
		comentario.setSolicitud(update.getSolicitud());
		comentario.setDfSeguimiento(LocalDate.now());
		comentario.setDhSeguimiento(LocalTime.now());

		comentarioRepository.persistAndFlush(comentario);
	}

	@Override
	@Transactional
	public void eliminar(Integer id) {
		if (comentarioRepository.findById(id) == null) {
			throw new NotFoundException("No existe el comentario con id: " + id);
		}
		comentarioRepository.deleteById(id);
	}

	private ModelMapper mapperDTO() {
		ModelMapper modelMapper = new ModelMapper();
		modelMapper.typeMap(SolicitudComentario.class, ComentarioSolicitudDTO.class).addMappings(mapper -> {
			mapper.map(src -> src.getUsuario().getCveUsuario(), ComentarioSolicitudDTO::setUsuario);
			mapper.map(src -> src.getSolicitud().getIdSolicitud(), ComentarioSolicitudDTO::setIdSolicitud);

		});

		return modelMapper;
	}

	private ComentarioSolicitudDTO convert(SolicitudComentario comentario) {
		return mapperDTO().map(comentario, ComentarioSolicitudDTO.class);
	}

	private SolicitudComentario convert(ComentarioSolicitudDTO comentarioVO) {
		ModelMapper modelMapper = new ModelMapper();
		SolicitudComentario comentario = modelMapper.map(comentarioVO, SolicitudComentario.class);

		comentario.setUsuario(usuarioRepository.findById(comentarioVO.getUsuario()));
		comentario.setSolicitud(solicitudRepository.findById(comentarioVO.getIdSolicitud()));

		return comentario;
	}

	private List<ComentarioSolicitudDTO> convertList(List<SolicitudComentario> comentarios) {
		return comentarios.stream().map(comentario -> mapperDTO().map(comentario, ComentarioSolicitudDTO.class))
				.collect(Collectors.toList());
	}

}
