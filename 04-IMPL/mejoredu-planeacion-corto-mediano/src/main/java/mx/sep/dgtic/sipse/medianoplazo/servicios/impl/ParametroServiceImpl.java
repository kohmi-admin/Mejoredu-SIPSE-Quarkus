package mx.sep.dgtic.sipse.medianoplazo.servicios.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.EntityManager;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO2;
import mx.sep.dgtic.sipse.medianoplazo.daos.*;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.AplicacionMetodoDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ElementoDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.PeticionMetasBienestarDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.SerieHistorica;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ValorLineaBase;
import mx.sep.dgtic.sipse.medianoplazo.entidades.AplicacionMetodo;
import mx.sep.dgtic.sipse.medianoplazo.entidades.Elemento;
import mx.sep.dgtic.sipse.medianoplazo.entidades.Estructura;
import mx.sep.dgtic.sipse.medianoplazo.entidades.LineaBase;
import mx.sep.dgtic.sipse.medianoplazo.entidades.MasterCatalogo;
import mx.sep.dgtic.sipse.medianoplazo.entidades.Meta;
import mx.sep.dgtic.sipse.medianoplazo.entidades.SerieMeta;
import mx.sep.dgtic.sipse.medianoplazo.entidades.Usuario;
import mx.sep.dgtic.sipse.medianoplazo.servicios.ParametroService;

@Service
public class ParametroServiceImpl implements ParametroService {

	private static final Integer CERO = 0;
	private static final Integer ID_CAT_INDICADOR_PI = 606;
	@Inject
	private MetaRepository metaRepository;
	@Inject
	private ElementoRepository elementoRepository;
	@Inject
	private UsuarioRepository usuarioRepository;
	@Inject
	private AplicacionMetodoRepository aplicacionMetodoRepository;
	@Inject
	private ValorLineaBaseRepository valorLineaBaseRepository;
	@Inject
	private SerieMetaRepository serieMetaRepository;
	@Inject
	private EstructuraRepository estructuraRepository;
	@Inject
	private MasterCatalogoRepository catalogoRepo;
	@Inject
	private ProductoRepository productoRepository;

	@Override
	public List<MasterCatalogoDTO2> consultarCatalogoIndicadoresPI(Integer anhio) {
		return elementoRepository.list("meta.estructura.anhoPlaneacion.idAnhio = ?1 AND catalogoElemento.dfBaja IS NULL", anhio)
				.stream().map(elemento -> {
					var listaNueva = elemento.getCatalogoElemento();

					var masterCatalogoDto = new MasterCatalogoDTO2();
					masterCatalogoDto.setIdCatalogo(listaNueva.getIdCatalogo());
					masterCatalogoDto.setIdCatalgoPadre(listaNueva.getMasterCatalogo2().getIdCatalogo());
					masterCatalogoDto.setCdOpcion(listaNueva.getCdOpcion());
					masterCatalogoDto.setCcExterna(listaNueva.getCcExterna());
					masterCatalogoDto.setCcExternaDos(listaNueva.getCcExternaDos());
					masterCatalogoDto.setCdDescripcionDos(listaNueva.getCdDescripcionDos());
					return masterCatalogoDto;
				}).toList();
	}

	@Override
	public List<PeticionMetasBienestarDTO> consultarPorIdEstrucura(Integer idEstructura) {
		var parametro = new ArrayList<PeticionMetasBienestarDTO>();

		List<Meta> parametros = metaRepository.find("estructura.idEstructura=?1 and ixTipo=?2", idEstructura, 2).list();
		parametros.stream().map(meta -> {
			PeticionMetasBienestarDTO dto = new PeticionMetasBienestarDTO();
			var variosElementos = new ArrayList<ElementoDTO>();
			var variosAplicacionMetodo = new ArrayList<AplicacionMetodoDTO>();
			var valores = new ArrayList<ValorLineaBase>();
			var series = new ArrayList<SerieHistorica>();
			var intermedias = new ArrayList<SerieHistorica>();
			dto.setIdMetas(meta.getIdMetasBienestar());
			dto.setEstatus(meta.getCsEstatus());
			dto.setIdEstructura(meta.getEstructura().getIdEstructura());
			dto.setCveUsuario(meta.getSegUsuario().getCveUsuario());
			dto.setIxTipo(meta.getIxTipo());
			List<Elemento> elementos = elementoRepository.find("meta.idMetasBienestar", meta.getIdMetasBienestar())
					.list();
			elementos.stream().map(el -> {
				ElementoDTO elemento = new ElementoDTO();
				elemento.setIdElemento(el.getIdElemento());
				elemento.setNombre(el.getCxNombre());
				elemento.setIdObjetivo(el.getIdCatalogoObjetivo().getIdCatalogo());
				elemento.setDescripcion(el.getCxDefinicion());
				if (el.getNivelDesagregacion() != null) {
					elemento.setNivelDesagregacion(el.getNivelDesagregacion().getIdCatalogo());
				}
				if (el.getMasterCatalogo2() != null)
					elemento.setPeriodicidad(el.getMasterCatalogo2().getIdCatalogo());
				elemento.setEspecificarPeriodicidad(el.getCxPeriodo());
				if (el.getMasterCatalogo3() != null)
					elemento.setTipo(el.getMasterCatalogo3().getIdCatalogo());
				if (el.getMasterCatalogo4() != null)
					elemento.setUnidadMedida(el.getMasterCatalogo4().getIdCatalogo());
				elemento.setEspecificarUnidadMedida(el.getCxUnidadMedida());
				if (el.getMasterCatalogo5() != null)
					elemento.setAcumulado(el.getMasterCatalogo5().getIdCatalogo());
				if (el.getMasterCatalogo6() != null)
					elemento.setPeriodoRecoleccion(el.getMasterCatalogo6().getIdCatalogo());
				elemento.setEspecificarPeriodo(el.getCxPeriodoRecoleccion());
				if (el.getMasterCatalogo7() != null)
					elemento.setDimensiones(el.getMasterCatalogo7().getIdCatalogo());
				if (el.getMasterCatalogo8() != null)
					elemento.setDisponibilidad(el.getMasterCatalogo8().getIdCatalogo());
				if (el.getMasterCatalogo9() != null)
					elemento.setTendencia(el.getMasterCatalogo9().getIdCatalogo());
				if (el.getUnidadResponsable() != null)
					elemento.setUnidadResponsable(el.getUnidadResponsable().getIdCatalogo());
				elemento.setMetodoCalculo(el.getCxMetodoCalculo());
				elemento.setObservaciones(el.getCxObservacion());
				return elemento;
			}).forEach(variosElementos::add);

			dto.setElemento(variosElementos);

			List<AplicacionMetodo> aplicacionMetodos = aplicacionMetodoRepository
					.find("meta.idMetasBienestar", meta.getIdMetasBienestar()).list();
			aplicacionMetodos.stream().map(app -> {
				AplicacionMetodoDTO apl = new AplicacionMetodoDTO();
				apl.setIdAplicacion(app.getIdAplicacion());
				apl.setNombreVariable(app.getCxNombreVariable());
				apl.setFuenteInformacion(app.getCxFuente());
				apl.setSustitucion(app.getCxSustitucion());
				apl.setNombreVariableDos(app.getCxVariableDos());
				apl.setFuenteInformacionDos(app.getCxFuenteDos());
				apl.setValorVariableUno(app.getCxValorVariable());
				apl.setValorVariableDos(app.getCxValorVarableDos());

				return apl;

			}).forEach(variosAplicacionMetodo::add);

			dto.setAplicacionMetodo(variosAplicacionMetodo);

			List<LineaBase> valor = valorLineaBaseRepository.find("meta.idMetasBienestar", meta.getIdMetasBienestar())
					.list();
			valor.stream().map(valorLineaBase -> {
				ValorLineaBase val = new ValorLineaBase();
				val.setMeta(valorLineaBase.getCxMeta());
				val.setAnhio(valorLineaBase.getIxAnhio());
				val.setIdMeta(valorLineaBase.getMeta().getIdMetasBienestar());
				val.setNotas(valorLineaBase.getCxNotas());
				val.setIdLinea(valorLineaBase.getIdLinea());
				val.setValor(valorLineaBase.getCxValor());
				val.setNotaSobreMeta(valorLineaBase.getCxNotasMeta());
				return val;

			}).forEach(valores::add);
			dto.setValorLineaBase(valores);

			List<SerieMeta> serie = serieMetaRepository.find("meta.idMetasBienestar", meta.getIdMetasBienestar())
					.list();
			for (SerieMeta serieMeta : serie) {
				if (serieMeta.getIxTipo() != null) {
					if (serieMeta.getIxTipo().equals("1")) {
						SerieHistorica se = new SerieHistorica();
						if (!ObjectUtils.isEmpty(serieMeta.getIxAnhio())) {
							se.setAnhio(serieMeta.getIxAnhio());
						}
						se.setDescripcion(serieMeta.getCxDescripcion());
						if (!ObjectUtils.isEmpty(serieMeta.getIdSerie())) {
							se.setIdSerie(serieMeta.getIdSerie());
						}
						if (serieMeta.getIxTipo() != null) {
							se.setTipo(serieMeta.getIxTipo());
						}
						se.setIdMeta(serieMeta.getMeta().getIdMetasBienestar());
						series.add(se);
					}
				}
			}
			dto.setSerieHistorica(series);

			List<SerieMeta> metasIntermedias = serieMetaRepository
					.find("meta.idMetasBienestar", meta.getIdMetasBienestar()).list();
			for (SerieMeta serieMeta : metasIntermedias) {
				if (serieMeta.getIxTipo() != null) {
					if (serieMeta.getIxTipo().equals("2")) {
						SerieHistorica se = new SerieHistorica();
						if (!ObjectUtils.isEmpty(serieMeta.getIxAnhio())) {
							se.setAnhio(serieMeta.getIxAnhio());
						}
						se.setDescripcion(serieMeta.getCxDescripcion());
						if (!ObjectUtils.isEmpty(serieMeta.getIdSerie())) {
							se.setIdSerie(serieMeta.getIdSerie());
						}
						if (serieMeta.getIxTipo() != null) {
							se.setTipo(serieMeta.getIxTipo());
						}
						se.setIdMeta(serieMeta.getMeta().getIdMetasBienestar());
						intermedias.add(se);
					}
				}
			}
			dto.setMetasIntermedias(intermedias);

			return dto;
		}).forEach(parametro::add);

		return parametro;
	}

	@Override
	public PeticionMetasBienestarDTO consultarPorId(Integer idMetaBienestar) {
		var peticion = new PeticionMetasBienestarDTO();
		var variosElementos = new ArrayList<ElementoDTO>();
		var variosAplicacionMetodo = new ArrayList<AplicacionMetodoDTO>();
		var valores = new ArrayList<ValorLineaBase>();
		var series = new ArrayList<SerieHistorica>();
		var intermedias = new ArrayList<SerieHistorica>();

		Meta meta = metaRepository.findById(idMetaBienestar);
		peticion.setIdMetas(meta.getIdMetasBienestar());
		peticion.setEstatus(meta.getCsEstatus());
		peticion.setIdEstructura(meta.getEstructura().getIdEstructura());
		peticion.setCveUsuario(meta.getSegUsuario().getCveUsuario());
		peticion.setIxTipo(meta.getIxTipo());

		List<Elemento> elementos = elementoRepository.find("meta.idMetasBienestar", meta.getIdMetasBienestar()).list();
		elementos.stream().map(el -> {
			ElementoDTO elemento = new ElementoDTO();
			elemento.setIdElemento(el.getIdElemento());
			elemento.setNombre(el.getCxNombre());
			elemento.setIdObjetivo(el.getIdCatalogoObjetivo().getIdCatalogo());
			elemento.setDescripcion(el.getCxDefinicion());
			if (el.getNivelDesagregacion() != null) {
				elemento.setNivelDesagregacion(el.getNivelDesagregacion().getIdCatalogo());
			}
			if (el.getMasterCatalogo2() != null)
				elemento.setPeriodicidad(el.getMasterCatalogo2().getIdCatalogo());
			elemento.setEspecificarPeriodicidad(el.getCxPeriodo());
			if (el.getMasterCatalogo3() != null)
				elemento.setTipo(el.getMasterCatalogo3().getIdCatalogo());
			if (el.getMasterCatalogo4() != null)
				elemento.setUnidadMedida(el.getMasterCatalogo4().getIdCatalogo());
			elemento.setEspecificarUnidadMedida(el.getCxUnidadMedida());
			if (el.getMasterCatalogo5() != null)
				elemento.setAcumulado(el.getMasterCatalogo5().getIdCatalogo());
			if (el.getMasterCatalogo6() != null)
				elemento.setPeriodoRecoleccion(el.getMasterCatalogo6().getIdCatalogo());
			elemento.setEspecificarPeriodo(el.getCxPeriodoRecoleccion());
			if (el.getMasterCatalogo7() != null)
				elemento.setDimensiones(el.getMasterCatalogo7().getIdCatalogo());
			if (el.getMasterCatalogo8() != null)
				elemento.setDisponibilidad(el.getMasterCatalogo8().getIdCatalogo());
			if (el.getMasterCatalogo9() != null)
				elemento.setTendencia(el.getMasterCatalogo9().getIdCatalogo());
			if (el.getUnidadResponsable() != null)
				elemento.setUnidadResponsable(el.getUnidadResponsable().getIdCatalogo());
			elemento.setMetodoCalculo(el.getCxMetodoCalculo());
			elemento.setObservaciones(el.getCxObservacion());
			return elemento;
		}).forEach(variosElementos::add);

		peticion.setElemento(variosElementos);

		List<AplicacionMetodo> aplicacionMetodos = aplicacionMetodoRepository
				.find("meta.idMetasBienestar", meta.getIdMetasBienestar()).list();
		aplicacionMetodos.stream().map(app -> {
			AplicacionMetodoDTO apl = new AplicacionMetodoDTO();
			apl.setIdAplicacion(app.getIdAplicacion());
			apl.setNombreVariable(app.getCxNombreVariable());
			apl.setFuenteInformacion(app.getCxFuente());
			apl.setSustitucion(app.getCxSustitucion());
			apl.setNombreVariableDos(app.getCxVariableDos());
			apl.setFuenteInformacionDos(app.getCxFuenteDos());
			apl.setValorVariableUno(app.getCxValorVariable());
			apl.setValorVariableDos(app.getCxValorVarableDos());

			return apl;

		}).forEach(variosAplicacionMetodo::add);

		peticion.setAplicacionMetodo(variosAplicacionMetodo);

		List<LineaBase> valor = valorLineaBaseRepository.find("meta.idMetasBienestar", meta.getIdMetasBienestar())
				.list();
		valor.stream().map(valorLineaBase -> {
			ValorLineaBase val = new ValorLineaBase();
			val.setMeta(valorLineaBase.getCxMeta());
			val.setAnhio(valorLineaBase.getIxAnhio());
			val.setIdMeta(valorLineaBase.getMeta().getIdMetasBienestar());
			val.setNotas(valorLineaBase.getCxNotas());
			val.setIdLinea(valorLineaBase.getIdLinea());
			val.setValor(valorLineaBase.getCxValor());
			val.setNotaSobreMeta(valorLineaBase.getCxNotasMeta());
			return val;

		}).forEach(valores::add);
		peticion.setValorLineaBase(valores);

		List<SerieMeta> serie = serieMetaRepository.find("meta.idMetasBienestar", meta.getIdMetasBienestar()).list();
		for (SerieMeta serieMeta : serie) {
			if (serieMeta.getIxTipo().equals("1")) {
				SerieHistorica se = new SerieHistorica();
				if (!ObjectUtils.isEmpty(serieMeta.getIxAnhio())) {
					se.setAnhio(serieMeta.getIxAnhio());
				}
				se.setDescripcion(serieMeta.getCxDescripcion());
				if (!ObjectUtils.isEmpty(serieMeta.getIdSerie())) {
					se.setIdSerie(serieMeta.getIdSerie());
				}
				if (serieMeta.getIxTipo() != null) {
					se.setTipo(serieMeta.getIxTipo());
				}
				se.setIdMeta(serieMeta.getMeta().getIdMetasBienestar());
				series.add(se);
			}
		}
		peticion.setSerieHistorica(series);

		List<SerieMeta> metasIntermedias = serieMetaRepository.find("meta.idMetasBienestar", meta.getIdMetasBienestar())
				.list();
		for (SerieMeta serieMeta : metasIntermedias) {
			if (serieMeta.getIxTipo().equals("2")) {
				SerieHistorica se = new SerieHistorica();
				if (!ObjectUtils.isEmpty(serieMeta.getIxAnhio())) {
					se.setAnhio(serieMeta.getIxAnhio());
				}
				se.setDescripcion(serieMeta.getCxDescripcion());
				if (!ObjectUtils.isEmpty(serieMeta.getIdSerie())) {
					se.setIdSerie(serieMeta.getIdSerie());
				}
				if (serieMeta.getIxTipo() != null) {
					se.setTipo(serieMeta.getIxTipo());
				}
				se.setIdMeta(serieMeta.getMeta().getIdMetasBienestar());
				intermedias.add(se);
			}
		}
		peticion.setMetasIntermedias(intermedias);

		return peticion;
	}

	@Override
	@Transactional
	public RespuestaGenerica registrar(PeticionMetasBienestarDTO peticion) {

		Usuario usuario = usuarioRepository.findById(peticion.getCveUsuario());
		if (usuario == null)
			return new RespuestaGenerica("500", "El usuario no existe, validar.");
		Estructura estructura = estructuraRepository.findById(peticion.getIdEstructura());
		if (estructura == null)
			return new RespuestaGenerica("500", "El registro base de estructura no existe, validar.");

		Meta meta = new Meta();
		meta.setEstructura(estructura);
		meta.setSegUsuario(usuario);
		meta.setCsEstatus(peticion.getEstatus());
		meta.setIxTipo(2);
		meta.setLockFlag(CERO);

		List<Elemento> elementos = new ArrayList<>();
		peticion.getElemento().stream().map(elementoDTO -> {
			var opcion = new MasterCatalogo();
			var padre = new MasterCatalogo();
			padre.setIdCatalogo(ID_CAT_INDICADOR_PI);
			padre.setLockFlag(CERO);

			opcion.setCdOpcion(elementoDTO.getNombre());
			// opcion.setCcExterna(elementoDTO.getIdElemento());
			opcion.setUsuario(usuario);
			opcion.setMasterCatalogo2(padre);

			catalogoRepo.persistAndFlush(opcion);

			Elemento elemento = new Elemento();
			elemento.setIdCatalogoElemento(opcion.getIdCatalogo());
			elemento.setCxNombre(elementoDTO.getNombre());
			MasterCatalogo objetivo = catalogoRepo.findById(elementoDTO.getIdObjetivo());
			if (objetivo == null) {
				elemento.setCxDefinicion("Error al registrar el elemento, validar datos de envío [Objetivo = "
						+ elementoDTO.getIdObjetivo() + "]");
				return elemento;
			}
			elemento.setIdCatalogoObjetivo(objetivo);
			elemento.setCxDefinicion(elementoDTO.getDescripcion());
			if (elementoDTO.getNivelDesagregacion() != null) {
				MasterCatalogo nivel = catalogoRepo.findById(elementoDTO.getNivelDesagregacion());
				elemento.setNivelDesagregacion(nivel);
			}
			if (elementoDTO.getPeriodicidad() != null) {
				MasterCatalogo periodicidad = catalogoRepo.findById(elementoDTO.getPeriodicidad());
				elemento.setMasterCatalogo2(periodicidad);
			}
			elemento.setCxPeriodo(peticion.getElemento().get(0).getEspecificarPeriodicidad());
			if (elementoDTO.getTipo() != null) {
				MasterCatalogo tipo = catalogoRepo.findById(elementoDTO.getTipo());
				elemento.setMasterCatalogo3(tipo);
			}
			Log.info("elementoDTO.getUnidadMedida()  " + elementoDTO.getUnidadMedida());
			if (elementoDTO.getUnidadMedida() != null) {
				MasterCatalogo unidad = catalogoRepo.findById(elementoDTO.getUnidadMedida());
				elemento.setMasterCatalogo4(unidad);
			}
			elemento.setCxUnidadMedida(elementoDTO.getEspecificarUnidadMedida());
			if (elementoDTO.getAcumulado() != null) {
				MasterCatalogo acumulado = catalogoRepo.findById(elementoDTO.getAcumulado());
				elemento.setMasterCatalogo5(acumulado);
			}
			if (elementoDTO.getPeriodoRecoleccion() != null) {
				MasterCatalogo recoleccion = catalogoRepo.findById(elementoDTO.getPeriodoRecoleccion());
				elemento.setMasterCatalogo6(recoleccion);
			}
			elemento.setCxPeriodoRecoleccion(elementoDTO.getEspecificarPeriodo());
			if (elementoDTO.getDimensiones() != null) {
				MasterCatalogo dimension = catalogoRepo.findById(elementoDTO.getDimensiones());
				elemento.setMasterCatalogo7(dimension);
			}
			if (elementoDTO.getDisponibilidad() != null) {
				MasterCatalogo disponibilidad = catalogoRepo.findById(elementoDTO.getDisponibilidad());
				elemento.setMasterCatalogo8(disponibilidad);
			}
			if (elementoDTO.getTendencia() != null) {
				MasterCatalogo tendencia = catalogoRepo.findById(elementoDTO.getTendencia());
				elemento.setMasterCatalogo9(tendencia);
			}
			if (elementoDTO.getUnidadResponsable() != null) {
				MasterCatalogo unidadResponsable = catalogoRepo.findById(elementoDTO.getUnidadResponsable());
				elemento.setUnidadResponsable(unidadResponsable);
			}

			elemento.setCxMetodoCalculo(elementoDTO.getMetodoCalculo());
			elemento.setCxObservacion(elementoDTO.getObservaciones());

			elemento.setMeta(meta);

			return elemento;
		}).forEach(elementos::add);
		meta.setElemento(elementos);/**/

		List<AplicacionMetodo> aplicaciones = new ArrayList<>();

		peticion.getAplicacionMetodo().stream().map(aplicacion -> {
			AplicacionMetodo aplicacionMetodo = new AplicacionMetodo();
			aplicacionMetodo.setCxNombreVariable(aplicacion.getNombreVariable());
			aplicacionMetodo.setCxValorVariable(aplicacion.getValorVariableUno());
			aplicacionMetodo.setCxFuente(aplicacion.getFuenteInformacion());
			aplicacionMetodo.setCxVariableDos(aplicacion.getNombreVariableDos());
			aplicacionMetodo.setCxValorVarableDos(aplicacion.getValorVariableDos());
			aplicacionMetodo.setCxFuenteDos(aplicacion.getFuenteInformacionDos());
			aplicacionMetodo.setCxSustitucion(aplicacion.getSustitucion());
			aplicacionMetodo.setMeta(meta);

			return aplicacionMetodo;

		}).forEach(aplicaciones::add);
		meta.setAplicacionMetodo(aplicaciones);

		List<LineaBase> lineas = new ArrayList<>();

		peticion.getValorLineaBase().stream().map(linea -> {

			LineaBase lineaBase = new LineaBase();
			lineaBase.setCxValor(linea.getValor());
			lineaBase.setIxAnhio(linea.getAnhio());
			lineaBase.setCxNotas(linea.getNotas());
			lineaBase.setCxNotasMeta(linea.getNotaSobreMeta());
			lineaBase.setCxMeta(linea.getMeta());
			lineaBase.setMeta(meta);

			return lineaBase;

		}).forEach(lineas::add);
		meta.setLineaBase(lineas);

		List<SerieMeta> series = new ArrayList<>();

		peticion.getSerieHistorica().stream().map(metasIntDTO -> {
			SerieMeta metaIntermedia = new SerieMeta();
			metaIntermedia.setIxTipo(metasIntDTO.getTipo());
			metaIntermedia.setIxAnhio(metasIntDTO.getAnhio());
			metaIntermedia.setMeta(meta);
			metaIntermedia.setCxDescripcion(metasIntDTO.getDescripcion());
			return metaIntermedia;
		}).forEach(series::add);

		peticion.getMetasIntermedias().stream().map(metasIntDTO -> {
			SerieMeta metaIntermedia = new SerieMeta();
			metaIntermedia.setIxTipo(metasIntDTO.getTipo());
			metaIntermedia.setIxAnhio(metasIntDTO.getAnhio());
			metaIntermedia.setMeta(meta);
			metaIntermedia.setCxDescripcion(metasIntDTO.getDescripcion());
			return metaIntermedia;
		}).forEach(series::add);
		meta.setSerieMeta(series);

		// Actualiza meta
		metaRepository.persistAndFlush(meta);

		return new RespuestaGenerica("200", "Exitosa");
	}

	@Override
	@Transactional
	public RespuestaGenerica modificar(PeticionMetasBienestarDTO peticion) {
		Log.info("IdBienestar " + peticion.getIdMetas());
		Meta meta = metaRepository.findById(peticion.getIdMetas());
		if (meta == null) {
			return new RespuestaGenerica("500", "El ID de la metaBienestar no existe, validar.");
		}

		Usuario usuario = usuarioRepository.findById(peticion.getCveUsuario());
		if (usuario == null)
			return new RespuestaGenerica("500", "El usuario no existe, validar.");

		Estructura estructura = estructuraRepository.findById(peticion.getIdEstructura());
		if (estructura == null) {
			return new RespuestaGenerica("500", "El idEstructura no existe, validar.");
		}

		meta.setIxTipo(2);
		meta.setEstructura(estructura);
		meta.setSegUsuario(usuario);
		meta.setCsEstatus(peticion.getEstatus());

		List<Elemento> elementos = new ArrayList<>();
		peticion.getElemento().stream().map(elementoDTO -> {
			Elemento elemento = elementoRepository.findById(elementoDTO.getIdElemento());
			if (elemento.getCatalogoElemento() != null) {
				elemento.getCatalogoElemento().setCdOpcion(elementoDTO.getNombre());
				catalogoRepo.persistAndFlush(elemento.getCatalogoElemento());
			} else {
				var opcion = new MasterCatalogo();
				var padre = new MasterCatalogo();
				padre.setIdCatalogo(ID_CAT_INDICADOR_PI);

				opcion.setCdOpcion(elementoDTO.getNombre());
				opcion.setUsuario(usuario);
				opcion.setMasterCatalogo2(padre);

				catalogoRepo.persistAndFlush(opcion);
			}
			elemento.setCxNombre(elementoDTO.getNombre());
			MasterCatalogo objetivo = catalogoRepo.findById(elementoDTO.getIdObjetivo());
			if (objetivo == null) {
				elemento.setCxDefinicion("Error al registrar el elemento, validar datos de envío [Objetivo = "
						+ elementoDTO.getIdObjetivo() + "]");
				return elemento;
			}
			elemento.setIdCatalogoObjetivo(objetivo);
			elemento.setCxDefinicion(elementoDTO.getDescripcion());
			if (elementoDTO.getNivelDesagregacion() != null) {
				MasterCatalogo nivel = catalogoRepo.findById(elementoDTO.getNivelDesagregacion());
				elemento.setNivelDesagregacion(nivel);
			}
			if (elementoDTO.getPeriodicidad() != null) {
				MasterCatalogo periodicidad = catalogoRepo.findById(elementoDTO.getPeriodicidad());
				elemento.setMasterCatalogo2(periodicidad);
			}
			elemento.setCxPeriodo(peticion.getElemento().get(0).getEspecificarPeriodicidad());
			if (elementoDTO.getTipo() != null) {
				MasterCatalogo tipo = catalogoRepo.findById(elementoDTO.getTipo());
				elemento.setMasterCatalogo3(tipo);
			}
			Log.info("elementoDTO.getUnidadMedida()  " + elementoDTO.getUnidadMedida());
			if (elementoDTO.getUnidadMedida() != null) {
				MasterCatalogo unidad = catalogoRepo.findById(elementoDTO.getUnidadMedida());
				elemento.setMasterCatalogo4(unidad);
			}
			elemento.setCxUnidadMedida(elementoDTO.getEspecificarUnidadMedida());
			if (elementoDTO.getAcumulado() != null) {
				MasterCatalogo acumulado = catalogoRepo.findById(elementoDTO.getAcumulado());
				elemento.setMasterCatalogo5(acumulado);
			}
			if (elementoDTO.getPeriodoRecoleccion() != null) {
				MasterCatalogo recoleccion = catalogoRepo.findById(elementoDTO.getPeriodoRecoleccion());
				elemento.setMasterCatalogo6(recoleccion);
			}
			elemento.setCxPeriodoRecoleccion(elementoDTO.getEspecificarPeriodo());
			if (elementoDTO.getDimensiones() != null) {
				MasterCatalogo dimension = catalogoRepo.findById(elementoDTO.getDimensiones());
				elemento.setMasterCatalogo7(dimension);
			}
			if (elementoDTO.getDisponibilidad() != null) {
				MasterCatalogo disponibilidad = catalogoRepo.findById(elementoDTO.getDisponibilidad());
				elemento.setMasterCatalogo8(disponibilidad);
			}
			if (elementoDTO.getTendencia() != null) {
				MasterCatalogo tendencia = catalogoRepo.findById(elementoDTO.getTendencia());
				elemento.setMasterCatalogo9(tendencia);
			}
			if (elementoDTO.getUnidadResponsable() != null) {
				MasterCatalogo unidadResponsable = catalogoRepo.findById(elementoDTO.getUnidadResponsable());
				elemento.setUnidadResponsable(unidadResponsable);
			}

			elemento.setCxMetodoCalculo(elementoDTO.getMetodoCalculo());
			elemento.setCxObservacion(elementoDTO.getObservaciones());

			elemento.setMeta(meta);

			return elemento;
		}).forEach(elementos::add);
		meta.setElemento(elementos);

		if (!ObjectUtils.isEmpty(peticion.getAplicacionMetodo().get(0).getIdAplicacion())) {
			Log.info("peticion.getAplicacionMetodo().get(0).getIdAplicacion() "
					+ peticion.getAplicacionMetodo().get(0).getIdAplicacion());
			AplicacionMetodo aplicacionMetodo = aplicacionMetodoRepository
					.findById(peticion.getAplicacionMetodo().get(0).getIdAplicacion());
			if (aplicacionMetodo == null) {
				return new RespuestaGenerica("500", "El idAplicacionMetodo existe, validar.");
			}

			aplicacionMetodo.setCxNombreVariable(peticion.getAplicacionMetodo().get(0).getNombreVariable());
			aplicacionMetodo.setCxValorVariable(peticion.getAplicacionMetodo().get(0).getValorVariableUno());
			aplicacionMetodo.setCxFuente(peticion.getAplicacionMetodo().get(0).getFuenteInformacion());
			aplicacionMetodo.setCxVariableDos(peticion.getAplicacionMetodo().get(0).getNombreVariableDos());
			aplicacionMetodo.setCxValorVarableDos(peticion.getAplicacionMetodo().get(0).getValorVariableDos());
			aplicacionMetodo.setCxFuenteDos(peticion.getAplicacionMetodo().get(0).getFuenteInformacionDos());
			aplicacionMetodo.setCxSustitucion(peticion.getAplicacionMetodo().get(0).getSustitucion());

			aplicacionMetodoRepository.persistAndFlush(aplicacionMetodo);

		}

		if (!ObjectUtils.isEmpty(peticion.getValorLineaBase().get(0).getIdLinea())) {
			Log.info("peticion.getValorLineaBase().get(0).getIdLinea() "
					+ peticion.getValorLineaBase().get(0).getIdLinea());
			LineaBase lineaBase = valorLineaBaseRepository.findById(peticion.getValorLineaBase().get(0).getIdLinea());
			if (lineaBase == null) {
				return new RespuestaGenerica("500", "El IdlineaBase no existe, validar.");
			}

			lineaBase.setCxValor(peticion.getValorLineaBase().get(0).getValor());
			lineaBase.setIxAnhio(peticion.getValorLineaBase().get(0).getAnhio());
			lineaBase.setCxNotas(peticion.getValorLineaBase().get(0).getNotas());
			lineaBase.setCxMeta(peticion.getValorLineaBase().get(0).getMeta());
			lineaBase.setCxNotasMeta(peticion.getValorLineaBase().get(0).getNotaSobreMeta());

			valorLineaBaseRepository.persistAndFlush(lineaBase);

		}

		List<SerieMeta> series = new ArrayList<>();
		Log.info("peticion.getSerieHistorica().size() " + peticion.getSerieHistorica().size());
		if (!ObjectUtils.isEmpty(peticion.getSerieHistorica().size())) {
			Log.info("peticion.getSerieHistorica().get(0).getIdSerie() "
					+ peticion.getSerieHistorica().get(0).getIdSerie());
			peticion.getSerieHistorica().stream().map(serieDTO -> {
				SerieMeta serie = new SerieMeta();
				serie.setMeta(meta);
				if (serieDTO.getIdSerie() != null) {
					serie = serieMetaRepository.findById(serieDTO.getIdSerie());
					serie.setMeta(meta);
					serie.setIxAnhio(serieDTO.getAnhio());
					serie.setIxTipo(serieDTO.getTipo());
					serie.setCxDescripcion(serieDTO.getDescripcion());
				}
				serie.setIxAnhio(serieDTO.getAnhio());
				serie.setIxTipo(serieDTO.getTipo());
				serie.setCxDescripcion(serieDTO.getDescripcion());
				return serie;
			}).forEach(series::add);

		}

		if (!ObjectUtils.isEmpty(peticion.getMetasIntermedias().size())) {
			Log.info("peticion.getMetasIntermedias().size() " + peticion.getMetasIntermedias().size());
			peticion.getMetasIntermedias().stream().map(serieDTO -> {
				SerieMeta serie = new SerieMeta();
				serie.setMeta(meta);
				if (serieDTO.getIdSerie() != null) {
					serie = serieMetaRepository.findById(serieDTO.getIdSerie());
					serie.setMeta(meta);
					serie.setIxAnhio(serieDTO.getAnhio());
					serie.setIxTipo(serieDTO.getTipo());
					serie.setCxDescripcion(serieDTO.getDescripcion());
				}
				return serie;
			}).forEach(series::add);
		}
		meta.setSerieMeta(series);

		metaRepository.persistAndFlush(meta);
		return new RespuestaGenerica("200", "Exitosa");
	}

	@Override
	@Transactional
	public RespuestaGenerica eliminar(Integer idParametro, String cveUsuario) {

		Log.info("Iniciando Transacción de eliminar");
		Log.info("idParametro  " + idParametro);
		Log.info("cveUsuario  " + cveUsuario);

		Meta meta = metaRepository.findById(idParametro);

		if (meta == null) {
			return new RespuestaGenerica("500", "El ID de MetaBienestar no existe, validar.");
		}
		Usuario usuario = usuarioRepository.findById(cveUsuario);
		if (usuario == null)
			return new RespuestaGenerica("500", "El usuario no existe, validar.");
		meta.setCsEstatus(EstatusEnum.BLOQUEADO.getEstatus());
		meta.setSegUsuario(usuario);

		meta.getElemento().forEach(elemento -> {
			var catalogo = elemento.getCatalogoElemento();

			catalogo.setDfBaja(LocalDate.now());
			catalogoRepo.persist(catalogo);

			productoRepository.update("idIndicadorPI = NULL WHERE idIndicadorPI = ?1", elemento.getIdElemento());
		});

		Log.info("meta " + meta.getCsEstatus());
		metaRepository.persistAndFlush(meta);
		return new RespuestaGenerica("200", "Exitosa");

	}

	@Override
	public List<ElementoDTO> consultarPorIdProyecto(Integer idProyecto) {
		var elementos = elementoRepository.findByIdProyecto(idProyecto);
		return elementos.stream().map(this::entitieToVo).toList();
	}

	@Override
	public List<ElementoDTO> consultarPorIdActividad(Integer idActividad) {
		var elementos = elementoRepository.findByIdActividad(idActividad);
		return elementos.stream().map(this::entitieToVo).toList();
	}

	private ElementoDTO entitieToVo(Elemento el) {
		ElementoDTO elemento = new ElementoDTO();
		elemento.setIdElemento(el.getIdElemento());
		elemento.setNombre(el.getCxNombre());
		elemento.setIdObjetivo(el.getIdCatalogoObjetivo().getIdCatalogo());
		elemento.setDescripcion(el.getCxDefinicion());
		if (el.getNivelDesagregacion() != null) {
			elemento.setNivelDesagregacion(el.getNivelDesagregacion().getIdCatalogo());
		}
		if (el.getMasterCatalogo2() != null)
			elemento.setPeriodicidad(el.getMasterCatalogo2().getIdCatalogo());
		elemento.setEspecificarPeriodicidad(el.getCxPeriodo());
		if (el.getMasterCatalogo3() != null)
			elemento.setTipo(el.getMasterCatalogo3().getIdCatalogo());
		if (el.getMasterCatalogo4() != null)
			elemento.setUnidadMedida(el.getMasterCatalogo4().getIdCatalogo());
		elemento.setEspecificarUnidadMedida(el.getCxUnidadMedida());
		if (el.getMasterCatalogo5() != null)
			elemento.setAcumulado(el.getMasterCatalogo5().getIdCatalogo());
		if (el.getMasterCatalogo6() != null)
			elemento.setPeriodoRecoleccion(el.getMasterCatalogo6().getIdCatalogo());
		elemento.setEspecificarPeriodo(el.getCxPeriodoRecoleccion());
		if (el.getMasterCatalogo7() != null)
			elemento.setDimensiones(el.getMasterCatalogo7().getIdCatalogo());
		if (el.getMasterCatalogo8() != null)
			elemento.setDisponibilidad(el.getMasterCatalogo8().getIdCatalogo());
		if (el.getMasterCatalogo9() != null)
			elemento.setTendencia(el.getMasterCatalogo9().getIdCatalogo());
		if (el.getUnidadResponsable() != null)
			elemento.setUnidadResponsable(el.getUnidadResponsable().getIdCatalogo());
		elemento.setMetodoCalculo(el.getCxMetodoCalculo());
		elemento.setObservaciones(el.getCxObservacion());
		return elemento;
	}
}
