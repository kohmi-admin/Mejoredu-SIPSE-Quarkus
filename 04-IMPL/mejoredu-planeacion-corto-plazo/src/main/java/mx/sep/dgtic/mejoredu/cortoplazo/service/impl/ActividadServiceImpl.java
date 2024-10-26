package mx.sep.dgtic.mejoredu.cortoplazo.service.impl;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionActividad;
import mx.sep.dgtic.mejoredu.cortoplazo.ActividadVO;
import mx.sep.dgtic.mejoredu.cortoplazo.EstrategiaAcciones;
import mx.sep.dgtic.mejoredu.cortoplazo.FechaTentativaVO;
import mx.sep.dgtic.mejoredu.cortoplazo.dao.*;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.Actividad;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.EstrategiaAccion;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.FechaTentativa;
import mx.sep.dgtic.mejoredu.cortoplazo.entity.MasterCatalogo;
import mx.sep.dgtic.mejoredu.cortoplazo.service.ActividadService;
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

	@Override
	public List<ActividadVO> consultarPorIdProyecto(int idProyecto, String csStatus) {
		var proyecto = proyectoAnualRepository.find(
				"idProyecto = ?1 and csEstatus in (".concat(csStatus.isEmpty() ? "'C','I'" : csStatus).concat(")"),
				idProyecto);
		if (proyecto == null) {
			throw new NotFoundException("No existe el proyecto con id " + idProyecto);
		}
		var actividades = actividadRepository.consultarActivasPorProyecto(idProyecto);

		return actividades.stream().map(it -> {
			var vo = new ActividadVO();
			vo.setIdActividad(it.getIdActividad());
			vo.setCveActividad(it.getCveActividad());
			vo.setCxNombreActividad(it.getCxNombreActividad());
			vo.setCxDescripcion(it.getCxDescripcion());
			vo.setCxArticulacionActividad(it.getCxArticulacionActividad());
			vo.setCveUsuario(it.getUsuario().getCveUsuario());
			if (it.getDfActividad() != null)
				vo.setDfActividad(it.getDfActividad().toString());
			if (it.getDhActividad() != null)
				vo.setDhActividad(it.getDhActividad().toString());
			vo.setIdProyecto(it.getProyectoAnual().getIdProyecto());

			vo.setIcActividadTransversal(it.getIcActividadTransversal());
			vo.setIxReunion(it.getIxRequireReunion());
			vo.setCxTema(it.getCxTema());
			if (it.getCatalogoAlcance() != null)
				vo.setIdAlcance(it.getCatalogoAlcance().getIdCatalogo());
			vo.setCxLugar(it.getCxLugar());
			vo.setCxActores(it.getCxActores());
			var fechasTentativas = it.getFechaTentativa().stream().map(at -> {
				var vo2 = new FechaTentativaVO();
				vo2.setIdActividad(it.getIdActividad());
				vo2.setIdFechaTentativa(at.getIdFechaTentativa());
				vo2.setIdMes(at.getCidCatalogoMes());
				return vo2;
			}).toList();

			var estrategiasDto = it.getMetEstrategiaAccion().stream()
					.filter(estrategias -> estrategias.getIxTipo() == 1).map(ea -> {
						EstrategiaAcciones estrategiaAccionDto = new EstrategiaAcciones();
						estrategiaAccionDto.setIdEstaci(ea.getIdEstaci());
						estrategiaAccionDto.setIxTipo(1);
						MasterCatalogoDTO catalogoAccion = new MasterCatalogoDTO();
						catalogoAccion.setIdCatalogo(ea.getMasterCatalogo().getIdCatalogo());
						estrategiaAccionDto.setMasterCatalogo(catalogoAccion);
						return estrategiaAccionDto;
					}).toList();
			vo.setEstrategia(estrategiasDto);

			var accionesDto = it.getMetEstrategiaAccion().stream().filter(estrategias -> estrategias.getIxTipo() == 2)
					.map(ea -> {
						EstrategiaAcciones estrategiaAccionDto = new EstrategiaAcciones();
						estrategiaAccionDto.setIdEstaci(ea.getIdEstaci());
						estrategiaAccionDto.setIxTipo(2);

						MasterCatalogoDTO catalogoAccion = new MasterCatalogoDTO();
						catalogoAccion.setIdCatalogo(ea.getMasterCatalogo().getIdCatalogo());
						estrategiaAccionDto.setMasterCatalogo(catalogoAccion);
						return estrategiaAccionDto;
					}).toList();
			vo.setAccion(accionesDto);

			var objetivoDto = it.getMetEstrategiaAccion().stream().filter(estrategias -> estrategias.getIxTipo() == 3)
					.map(ea -> {
						EstrategiaAcciones estrategiaAccionDto = new EstrategiaAcciones();
						estrategiaAccionDto.setIdEstaci(ea.getIdEstaci());
						estrategiaAccionDto.setIxTipo(3);

						MasterCatalogoDTO catalogoAccion = new MasterCatalogoDTO();
						catalogoAccion.setIdCatalogo(ea.getMasterCatalogo().getIdCatalogo());
						estrategiaAccionDto.setMasterCatalogo(catalogoAccion);
						return estrategiaAccionDto;
					}).toList();
			vo.setObjetivo(objetivoDto);

			vo.setFechaTentativa(fechasTentativas);
			vo.setCsEstatus(it.getCsEstatus());

			return vo;
		}).toList();
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
		if (actividad.getCatalogoAlcance() != null)
			vo.setIdAlcance(actividad.getCatalogoAlcance().getIdCatalogo());
		vo.setCxLugar(actividad.getCxLugar());
		vo.setCxActores(actividad.getCxActores());
		var fechasTentativas = actividad.getFechaTentativa().stream().map(it -> {
			var vo2 = new FechaTentativaVO();
			vo2.setIdActividad(actividad.getIdActividad());
			vo2.setIdFechaTentativa(it.getIdFechaTentativa());
			vo2.setIdMes(it.getCidCatalogoMes());
			return vo2;
		}).toList();
		var estrategiasDto = actividad.getMetEstrategiaAccion().stream()
				.filter(estrategias -> estrategias.getIxTipo() == 1).map(ea -> {
					EstrategiaAcciones estrategiaAccionDto = new EstrategiaAcciones();
					estrategiaAccionDto.setIdEstaci(ea.getIdEstaci());
					estrategiaAccionDto.setIxTipo(1);
					MasterCatalogoDTO catalogoAccion = new MasterCatalogoDTO();
					catalogoAccion.setIdCatalogo(ea.getMasterCatalogo().getIdCatalogo());
					estrategiaAccionDto.setMasterCatalogo(catalogoAccion);
					return estrategiaAccionDto;
				}).toList();
		vo.setEstrategia(estrategiasDto);

		var accionesDto = actividad.getMetEstrategiaAccion().stream()
				.filter(estrategias -> estrategias.getIxTipo() == 2).map(ea -> {
					EstrategiaAcciones estrategiaAccionDto = new EstrategiaAcciones();
					estrategiaAccionDto.setIdEstaci(ea.getIdEstaci());
					estrategiaAccionDto.setIxTipo(2);

					MasterCatalogoDTO catalogoAccion = new MasterCatalogoDTO();
					catalogoAccion.setIdCatalogo(ea.getMasterCatalogo().getIdCatalogo());
					estrategiaAccionDto.setMasterCatalogo(catalogoAccion);
					return estrategiaAccionDto;
				}).toList();

		vo.setAccion(accionesDto);
		var objetivoDto = actividad.getMetEstrategiaAccion().stream()
				.filter(estrategias -> estrategias.getIxTipo() == 3).map(ea -> {
					EstrategiaAcciones estrategiaAccionDto = new EstrategiaAcciones();
					estrategiaAccionDto.setIdEstaci(ea.getIdEstaci());
					estrategiaAccionDto.setIxTipo(3);

					MasterCatalogoDTO catalogoAccion = new MasterCatalogoDTO();
					catalogoAccion.setIdCatalogo(ea.getMasterCatalogo().getIdCatalogo());
					estrategiaAccionDto.setMasterCatalogo(catalogoAccion);
					return estrategiaAccionDto;
				}).toList();

		vo.setObjetivo(objetivoDto);

		vo.setFechaTentativa(fechasTentativas);
		vo.setCsEstatus(actividad.getCsEstatus());
		return vo;
	}

	@Override
	@Transactional
	public void modificar(int idActividad, PeticionActividad registroActividad) {
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
		if (registroActividad.getObjetivo() != null)
			registroActividad.getObjetivo().stream().map(it -> {
				EstrategiaAccion estrategiaAccionEnt = new EstrategiaAccion();
				estrategiaAccionEnt.setActividad(actividad);
				MasterCatalogo catalogo = new MasterCatalogo();
				catalogo.setIdCatalogo(it.getMasterCatalogo().getIdCatalogo());
				catalogo.setLockFlag(0);
				estrategiaAccionEnt.setMasterCatalogo(catalogo);
				estrategiaAccionEnt.setIxTipo(3);
				return estrategiaAccionEnt;
			}).forEach(actividad::addEstrategiaAccion);
		// Estrategias
		if (registroActividad.getEstrategia() != null)
			registroActividad.getEstrategia().stream().map(it -> {
				EstrategiaAccion estrategiaAccionEnt = new EstrategiaAccion();
				estrategiaAccionEnt.setActividad(actividad);
				MasterCatalogo catalogo = new MasterCatalogo();
				catalogo.setIdCatalogo(it.getMasterCatalogo().getIdCatalogo());
				catalogo.setLockFlag(0);
				estrategiaAccionEnt.setMasterCatalogo(catalogo);
				estrategiaAccionEnt.setIxTipo(1);
				return estrategiaAccionEnt;
			}).forEach(actividad::addEstrategiaAccion);
//  acciones
		if (registroActividad.getAction() != null)
			registroActividad.getAction().stream().map(it -> {
				EstrategiaAccion estrategiaAccionEnt = new EstrategiaAccion();
				estrategiaAccionEnt.setActividad(actividad);
				MasterCatalogo catalogo = new MasterCatalogo();
				catalogo.setLockFlag(0);
				catalogo.setIdCatalogo(it.getMasterCatalogo().getIdCatalogo());
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
	}

	@Override
	@Transactional
	public void registrar(PeticionActividad registroActividad) {
		var proyecto = proyectoAnualRepository.findById(registroActividad.getIdProyecto());
		if (proyecto == null) {
			throw new NotFoundException("No existe el proyecto con id " + registroActividad.getIdProyecto());
		}
		var usuario = usuarioRepository.findById(registroActividad.getCveUsuario());
		if (usuario == null) {
			throw new NotFoundException("No existe el usuario con id " + registroActividad.getCveUsuario());
		}

		var alcance = masterCatalogoRepository.findById(registroActividad.getAlcance());

		var entidad = new Actividad();
		// transform 0301 string to 1 int
		entidad.setCveActividad(registroActividad.getCveActividad());
		entidad.setCxNombreActividad(registroActividad.getNombreActividad());
		entidad.setCxDescripcion(registroActividad.getDescripcion());
		entidad.setCxArticulacionActividad(registroActividad.getArticulacionActividad());
		entidad.setUsuario(usuario);
		entidad.setDfActividad(Date.valueOf(LocalDate.now()));
		entidad.setDhActividad(Time.valueOf(LocalTime.now()));
		entidad.setProyectoAnual(proyecto);

		entidad.setIcActividadTransversal(registroActividad.getActividadTransversal());
		entidad.setIxRequireReunion(registroActividad.getReuniones());
		entidad.setCxTema(registroActividad.getTema());
		entidad.setCatalogoAlcance(alcance);
		entidad.setCxLugar(registroActividad.getLugar());
		entidad.setCxActores(registroActividad.getActores());
		if (registroActividad.getFechaTentativa() != null)
			registroActividad.getFechaTentativa().stream().map(it -> {
				var entidad2 = new FechaTentativa();
				entidad2.setCidCatalogoMes(it.getIdCatalogoFecha());
				entidad2.setActividad(entidad);
				return entidad2;
			}).forEach(entidad::addFechaTentativa);
		entidad.setCsEstatus(registroActividad.getEstatus());

		// Estrategias acciones
		entidad.setMetEstrategiaAccion(new ArrayList<EstrategiaAccion>());
		if (registroActividad.getObjetivo() != null)
			registroActividad.getObjetivo().stream().map(it -> {
				EstrategiaAccion estrategiaAccionEnt = new EstrategiaAccion();
				estrategiaAccionEnt.setIxTipo(3); // Objetivos prioritarios

				MasterCatalogo estrategiaCat = masterCatalogoRepository
						.findById(it.getMasterCatalogo().getIdCatalogo());
				estrategiaAccionEnt.setActividad(entidad);
				estrategiaAccionEnt.setMasterCatalogo(estrategiaCat);
				return estrategiaAccionEnt;
			}).forEach(entidad::addEstrategiaAccion);

		// Estrategias acciones
		if (registroActividad.getEstrategia() != null)
			registroActividad.getEstrategia().stream().map(it -> {
				EstrategiaAccion estrategiaAccionEnt = new EstrategiaAccion();
				estrategiaAccionEnt.setIxTipo(1);

				MasterCatalogo estrategiaCat = masterCatalogoRepository
						.findById(it.getMasterCatalogo().getIdCatalogo());
				estrategiaAccionEnt.setActividad(entidad);
				estrategiaAccionEnt.setMasterCatalogo(estrategiaCat);
				return estrategiaAccionEnt;
			}).forEach(entidad::addEstrategiaAccion);

		if (registroActividad.getAction() != null)
			registroActividad.getAction().stream().map(it -> {
				EstrategiaAccion estrategiaAccionEnt = new EstrategiaAccion();
				estrategiaAccionEnt.setIxTipo(2);
				estrategiaAccionEnt.setActividad(entidad);
				MasterCatalogo accionCat = masterCatalogoRepository.findById(it.getMasterCatalogo().getIdCatalogo());
				estrategiaAccionEnt.setMasterCatalogo(accionCat);
				return estrategiaAccionEnt;
			}).forEach(entidad::addEstrategiaAccion);

		actividadRepository.persistAndFlush(entidad);
	}
}
