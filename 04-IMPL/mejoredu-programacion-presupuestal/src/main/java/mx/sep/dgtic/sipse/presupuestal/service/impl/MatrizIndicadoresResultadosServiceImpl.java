package mx.sep.dgtic.sipse.presupuestal.service.impl;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO2;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionPorID;
import mx.edu.sep.dgtic.mejoredu.presupuestales.*;
import mx.edu.sep.dgtic.mejoredu.presupuestales.mir.IndicadorResultadoVO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.mir.PeticionMatrizIndicadoresResultados;
import mx.edu.sep.dgtic.mejoredu.presupuestales.mir.RespuestaMatrizIndicadoresResultados;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO;
import mx.sep.dgtic.sipse.presupuestal.dao.FichaIndicadoresRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.IndicadorResultadoRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.MasterCatalogoRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.ProgramaPresupuestalRepository;
import mx.sep.dgtic.sipse.presupuestal.dao.UsuarioRepository;
import mx.sep.dgtic.sipse.presupuestal.entity.FichaIndicadores;
import mx.sep.dgtic.sipse.presupuestal.entity.IndicadorResultado;
import mx.sep.dgtic.sipse.presupuestal.entity.MasterCatalogo;
import mx.sep.dgtic.sipse.presupuestal.service.MatrizIndicadoresResultadosService;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class MatrizIndicadoresResultadosServiceImpl implements MatrizIndicadoresResultadosService {
  @ConfigProperty(name = "programa_presupuestal.p016")
  private Integer ID_P016;
  @ConfigProperty(name = "catalogo.indicadores_mir")
  private Integer ID_INDICADORES_MIR;
  @Inject
  private ProgramaPresupuestalRepository programaPresupuestalRepository;
  @Inject
  private IndicadorResultadoRepository indicadorResultadoRepository;
  @Inject
  private FichaIndicadoresRepository fichaIndicadoresRepository;
  @Inject
  private MasterCatalogoRepository masterCatalogoRepository;

  @Inject
  UsuarioRepository usuarioRepository;


  @Override
  public List<MasterCatalogoDTO2> consultarCatalogoIndicadoresPI(Integer anhio) {
    return indicadorResultadoRepository.list("programaPresupuestal.idAnhio = ?1 AND masterCatalogo.dfBaja IS NULL", anhio).stream().map(it -> {
      var listaNueva = it.getMasterCatalogo();

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
  public RespuestaMatrizIndicadoresResultados consultaPorId(int idPrograma) {
    var programa = programaPresupuestalRepository.findByIdOptional(idPrograma).orElseThrow(() ->
        new NotFoundException("No se encontró el programa presupuestal con el id: " + idPrograma)
    );
    var matriz = indicadorResultadoRepository.findByIdPresupuestal(idPrograma);

    var respuesta = new RespuestaMatrizIndicadoresResultados();

    respuesta.setIdMir(idPrograma);
    respuesta.setIdAnhio(programa.getIdAnhio());

    var matrizVO = matriz.stream().map(this::entitieToVO).toList();

    respuesta.setMatriz(matrizVO);
    respuesta.setFechaCreacion(programa.getDfRegistro().toLocalDateTime());

    return respuesta;
  }

  @Override
  public RespuestaMatrizIndicadoresResultados consultaPorAnhio(int anhio) {
    var programa = programaPresupuestalRepository.findByAnhoPlaneacionAndTipoPrograma(anhio, ID_P016).orElseThrow(() ->
        new NotFoundException("No se encontró el programa presupuestal del año: " + anhio)
    );
    var matriz = indicadorResultadoRepository.findByIdPresupuestal(programa.getIdPresupuestal());

    var respuesta = new RespuestaMatrizIndicadoresResultados();

    respuesta.setIdMir(programa.getIdPresupuestal());
    respuesta.setIdAnhio(anhio);

    var matrizVO = matriz.stream().map(this::entitieToVO).toList();

    respuesta.setMatriz(matrizVO);
    respuesta.setFechaCreacion(programa.getDfRegistro().toLocalDateTime());

    return respuesta;
  }

  @Override
  @Transactional
  public void registrar(PeticionMatrizIndicadoresResultados peticion) {
    try {
      /* Se crean los indicadores que no existan */
      var programa = programaPresupuestalRepository.findByAnhoPlaneacionAndTipoPrograma(peticion.getIdAnhio(), ID_P016).orElseThrow(() ->
          new NotFoundException("No se encontró el programa presupuestal del año: " + peticion.getIdAnhio())
      );
      var matriz = indicadorResultadoRepository.findByIdPresupuestal(programa.getIdPresupuestal());
      var usuario = usuarioRepository.findById("superusuario");

      // Debo consultar la matriz ya registrada
      // Debo comparar la matriz BD con la matriz enviada
      // Sí un indicador existe en la matriz BD y no en la matriz enviada, se elimina
      // Sí un indicador existe en la matriz enviada y no en la matriz BD, se crea
      // Sí un indicador existe en ambas matrices, se actualiza

      var mapMatriz = matriz.stream().collect(Collectors.toMap(IndicadorResultado::getIdIndicadorResultado, indicadorResultado -> indicadorResultado));

      /*
      ** Es nesario revisar que este flujo no esté alterando el request que se recibe. Pues la matriz se debe guardar tal cual se recibe.
      var llaves = (new ArrayList<>(mapMatriz.keySet()));
      Collections.sort(llaves);
      var peticionMatrizCopia = new ArrayList<>(peticion.getMatriz());

      for (int i = 0; i < peticionMatrizCopia.size(); i++) {
        peticionMatrizCopia.get(i).setIdIndicador(i < (llaves.size()) ? llaves.get(i) : null);
      }
       */

      Log.info("Size: " + peticion.getMatriz().size());
      Log.info("Matriz Request: " + peticion.getMatriz());

      for (var indicador : peticion.getMatriz()) {
        /*
         * La creación y actualización de la entidad MasterCatalogo la realiza un trigger en la base de datos
         * En este proceso sólo se crea o actualiza la entidad IndicadorResultado
         */
        if (indicador.getIdIndicador() != null && mapMatriz.containsKey(indicador.getIdIndicador())) {
          // Actualizar
          var indicadorBD = mapMatriz.get(indicador.getIdIndicador());
          updateIndicadorResultado(indicadorBD, indicador);
          indicadorResultadoRepository.persist(indicadorBD);

          mapMatriz.remove(indicador.getIdIndicador());
        } else {
          // Crear
          var indicadorBD = new IndicadorResultado();
          updateIndicadorResultado(indicadorBD, indicador);

          indicadorBD.setIdPresupuestal(programa.getIdPresupuestal());

          indicadorResultadoRepository.persist(indicadorBD);
        }
      }

      // Eliminar
      for (var indicador : mapMatriz.values()) {
        indicadorResultadoRepository.delete(indicador);
      }
    } catch (Exception e) {
      Log.error("Error al registrar la matriz de indicadores de resultados", e);
      throw e;
    }
  }

  @Override
  public PeticionFichasIndicadoresVO consultarFicha(int idIndicador) {
    // Recibo el id del indicador
    // Busco el indicador en la BD y obtener la ficha presupuestal
    // Si no existe, devolver una ficha vacía? o una excepción?
    var indicador = indicadorResultadoRepository.findByIdOptional(idIndicador).orElseThrow(() ->
        new NotFoundException("No se encontró el indicador con el id: " + idIndicador)
    );
    if (indicador.getIdFichaIndicadores() == null) {
      var datosGenerales = new DatosGeneralesIndicadorVO();
      var lineaBase = new LineaBaseVO();
      var metaAnual = new MetaAnualVO();
      var caracteristicasVariables = new CaracteristicasVariablesIndicadorVO();

      return new PeticionFichasIndicadoresVO(datosGenerales, lineaBase, metaAnual, caracteristicasVariables);
    }
    var fichaIndicador = fichaIndicadoresRepository.findByIdOptional(indicador.getIdFichaIndicadores()).orElseThrow(() ->
        new NotFoundException("No se encontró la ficha del indicador con el id: " + idIndicador)
    );

    return entitiesToVO(fichaIndicador);
  }

  @Override
  @Transactional
  public void registrarFicha(int idIndicador, PeticionFichasIndicadoresVO peticion) {
    var indicador = indicadorResultadoRepository.findByIdOptional(idIndicador).orElseThrow(() ->
        new NotFoundException("No se encontró el indicador con el id: " + idIndicador)
    );
    FichaIndicadores ficha;
    if (indicador.getIdFichaIndicadores() == null)
      ficha = new FichaIndicadores();
    else
      ficha = fichaIndicadoresRepository.findByIdOptional(indicador.getIdFichaIndicadores()).orElseGet(FichaIndicadores::new);

    updateFichaIndicador(ficha, peticion);
    fichaIndicadoresRepository.persistAndFlush(ficha);

    indicador.setIdFichaIndicadores(ficha.getIdFichaIndicadores());
    indicadorResultadoRepository.persist(indicador);
  }

  @Override
  @Transactional
  public void finalizarRegistro(PeticionPorID peticionPorID) {
    var programa = programaPresupuestalRepository.findByIdOptional(peticionPorID.getId()).orElseThrow(() ->
        new NotFoundException("No se encontró el programa presupuestal con el id: " + peticionPorID.getId())
    );

    programa.setCveUsuario(peticionPorID.getUsuario());
    programa.setCsEstatus(EstatusEnum.FINALIZADO.getEstatus());
    programaPresupuestalRepository.persist(programa);
  }

  @Override
  @Transactional
  public void enviarRevision(PeticionPorID peticionPorID) {
    var programa = programaPresupuestalRepository.findByIdOptional(peticionPorID.getId()).orElseThrow(() ->
        new NotFoundException("No se encontró el programa presupuestal con el id: " + peticionPorID.getId())
    );

    programa.setCveUsuario(peticionPorID.getUsuario());
    programa.setCsEstatus(EstatusEnum.PORREVISAR.getEstatus());
    programaPresupuestalRepository.persist(programa);
  }

  @Override
  @Transactional
  public void enviarValidacionTecnica(PeticionPorID peticionPorID) {
    var programa = programaPresupuestalRepository.findByIdOptional(peticionPorID.getId()).orElseThrow(() ->
        new NotFoundException("No se encontró el programa presupuestal con el id: " + peticionPorID.getId())
    );

    programa.setCveUsuario(peticionPorID.getUsuario());
    programa.setCsEstatus(EstatusEnum.VALIDACIONTECNICA.getEstatus());
    programaPresupuestalRepository.persist(programa);
  }

  private void updateIndicadorResultado(IndicadorResultado indicadorResultado, IndicadorResultadoVO indicadorResultadoVO) {
    indicadorResultado.setCxNivel(indicadorResultadoVO.getNivel());
    indicadorResultado.setCxClave(indicadorResultadoVO.getClave());
    indicadorResultado.setCxResumen(indicadorResultadoVO.getResumenNarrativo());
    indicadorResultado.setCxNombre(indicadorResultadoVO.getNombreIndicador());
    indicadorResultado.setCxMedios(indicadorResultadoVO.getMediosVerificacion());
    indicadorResultado.setCxSupuestos(indicadorResultadoVO.getSupuestos());
  }

  private IndicadorResultadoVO entitieToVO(IndicadorResultado indicadorResultado) {
    var indicadorResultadoVO = new IndicadorResultadoVO();

    indicadorResultadoVO.setIdIndicador(indicadorResultado.getIdIndicadorResultado());
    indicadorResultadoVO.setNivel(indicadorResultado.getCxNivel());
    indicadorResultadoVO.setClave(indicadorResultado.getCxClave());
    indicadorResultadoVO.setResumenNarrativo(indicadorResultado.getCxResumen());
    indicadorResultadoVO.setNombreIndicador(indicadorResultado.getCxNombre());
    indicadorResultadoVO.setMediosVerificacion(indicadorResultado.getCxMedios());
    indicadorResultadoVO.setSupuestos(indicadorResultado.getCxSupuestos());
    indicadorResultadoVO.setIdFichaIndicador(indicadorResultado.getIdFichaIndicadores());

    return indicadorResultadoVO;
  }

  private PeticionFichasIndicadoresVO entitiesToVO(FichaIndicadores fichaIndicadores) {
    var peticionFichasIndicadoresVO = new PeticionFichasIndicadoresVO();

    var datosGenerales = new DatosGeneralesIndicadorVO();
    datosGenerales.setNombreIndicador(fichaIndicadores.getCxNombreIndicador());
    datosGenerales.setIdDimensionMedicion(fichaIndicadores.getIdDimension());
    datosGenerales.setIdTipoIndicador(fichaIndicadores.getIdTipoIndicador());
    datosGenerales.setDefinicionIndicador(fichaIndicadores.getCxDefinicionIndicador());
    datosGenerales.setMetodoCalculo(fichaIndicadores.getCxMetodoCalculoIndicador());
    datosGenerales.setIdUnidadMedida(fichaIndicadores.getIdUnidadMedida());
    datosGenerales.setUnidadMedidaDescubrir(fichaIndicadores.getCxUnidadMedidaDescubrir());
    datosGenerales.setUnidadAbsoluta(fichaIndicadores.getCxUnidadAbsoluta());
    datosGenerales.setIdTipoMedicion(fichaIndicadores.getIdTipoMedicion());
    datosGenerales.setTipoMedicionDescubrir(fichaIndicadores.getCxDescubrirTipoMedicion());
    datosGenerales.setIdFrecuenciaMedicion(fichaIndicadores.getIdFrecuenciaMedicion());
    datosGenerales.setFrecuenciaMedicionDescubrir(fichaIndicadores.getCxDescubrirFrecuenciaMedicion());
    datosGenerales.setNumerador(fichaIndicadores.getCxNumerador());
    datosGenerales.setDenominador(fichaIndicadores.getCxDenominador());
    datosGenerales.setMeta(fichaIndicadores.getCxMeta());

    peticionFichasIndicadoresVO.setDatosGenerales(datosGenerales);

    var lineaBase = new LineaBaseVO();
    lineaBase.setValorBase(fichaIndicadores.getCxValorBase());
    lineaBase.setIdAnhio(fichaIndicadores.getIdAnhioBase());
    lineaBase.setPeriodo(fichaIndicadores.getCxPeriodoBase());

    peticionFichasIndicadoresVO.setLineaBase(lineaBase);

    var metaAnual = new MetaAnualVO();
    metaAnual.setValorAnual(fichaIndicadores.getCxValorMeta());
    metaAnual.setIdAnhio(fichaIndicadores.getIdAnhioMeta());
    metaAnual.setPeriodoCumplimiento(fichaIndicadores.getCxPeriodoMeta());
    metaAnual.setMedioVerificacion(fichaIndicadores.getCxMedioVerificacion());

    peticionFichasIndicadoresVO.setMetaAnual(metaAnual);

    var caracteristicasVariables = new CaracteristicasVariablesIndicadorVO();
    caracteristicasVariables.setNombreVariable(fichaIndicadores.getCxNombreVariable());
    caracteristicasVariables.setDescripcionVariable(fichaIndicadores.getCxDescripcionVariable());
    caracteristicasVariables.setFuenteInformacion(fichaIndicadores.getCxFuenteInformacion());
    caracteristicasVariables.setUnidadMedida(fichaIndicadores.getCxUnidadMedida());
    caracteristicasVariables.setFrecuenciaMedicion(fichaIndicadores.getCxFrecuenciaMedicion());
    caracteristicasVariables.setMetodoRecoleccion(fichaIndicadores.getCxMetodoRecoleccion());
    caracteristicasVariables.setIdComportamientoIndicador(fichaIndicadores.getIdComportamientoIndicador());
    caracteristicasVariables.setIdComportamientoMedicion(fichaIndicadores.getIdComportamientoMedicion());
    caracteristicasVariables.setIdTipoValor(fichaIndicadores.getIdTipoValor());
    caracteristicasVariables.setIdDesagregacion(fichaIndicadores.getIdDesagregacionGeografica());
    caracteristicasVariables.setDescripcionVinculacion(fichaIndicadores.getCxDescripcionVinculacion());

    peticionFichasIndicadoresVO.setCaracteristicasVariables(caracteristicasVariables);

    return peticionFichasIndicadoresVO;
  }

  private void updateFichaIndicador(FichaIndicadores fichaIndicadores, PeticionFichasIndicadoresVO peticionFicha) {
    // Datos generales
    var datosGenerales = peticionFicha.getDatosGenerales();
    fichaIndicadores.setCxNombreIndicador(datosGenerales.getNombreIndicador());
    fichaIndicadores.setIdDimension(datosGenerales.getIdDimensionMedicion());
    fichaIndicadores.setIdTipoIndicador(datosGenerales.getIdTipoIndicador());
    fichaIndicadores.setCxDefinicionIndicador(datosGenerales.getDefinicionIndicador());
    fichaIndicadores.setCxMetodoCalculoIndicador(datosGenerales.getMetodoCalculo());
    fichaIndicadores.setIdUnidadMedida(datosGenerales.getIdUnidadMedida());
    fichaIndicadores.setCxUnidadMedidaDescubrir(datosGenerales.getUnidadMedidaDescubrir());
    fichaIndicadores.setCxUnidadAbsoluta(datosGenerales.getUnidadAbsoluta());
    fichaIndicadores.setIdTipoMedicion(datosGenerales.getIdTipoMedicion());
    fichaIndicadores.setCxDescubrirTipoMedicion(datosGenerales.getTipoMedicionDescubrir());
    fichaIndicadores.setIdFrecuenciaMedicion(datosGenerales.getIdFrecuenciaMedicion());
    fichaIndicadores.setCxDescubrirFrecuenciaMedicion(datosGenerales.getFrecuenciaMedicionDescubrir());
    fichaIndicadores.setCxNumerador(datosGenerales.getNumerador());
    fichaIndicadores.setCxDenominador(datosGenerales.getDenominador());
    fichaIndicadores.setCxMeta(datosGenerales.getMeta());

    // Linea base
    var lineaBase = peticionFicha.getLineaBase();
    fichaIndicadores.setCxValorBase(lineaBase.getValorBase());
    fichaIndicadores.setIdAnhioBase(lineaBase.getIdAnhio());
    fichaIndicadores.setCxPeriodoBase(lineaBase.getPeriodo());

    // Meta anual
    var metaAnual = peticionFicha.getMetaAnual();
    fichaIndicadores.setCxValorMeta(metaAnual.getValorAnual());
    fichaIndicadores.setIdAnhioMeta(metaAnual.getIdAnhio());
    fichaIndicadores.setCxPeriodoMeta(metaAnual.getPeriodoCumplimiento());
    fichaIndicadores.setCxMedioVerificacion(metaAnual.getMedioVerificacion());

    // Características variables
    var caracteristicasVariables = peticionFicha.getCaracteristicasVariables();
    fichaIndicadores.setCxNombreVariable(caracteristicasVariables.getNombreVariable());
    fichaIndicadores.setCxDescripcionVariable(caracteristicasVariables.getDescripcionVariable());
    fichaIndicadores.setCxFuenteInformacion(caracteristicasVariables.getFuenteInformacion());
    fichaIndicadores.setCxUnidadMedida(caracteristicasVariables.getUnidadMedida());
    fichaIndicadores.setCxFrecuenciaMedicion(caracteristicasVariables.getFrecuenciaMedicion());
    fichaIndicadores.setCxMetodoRecoleccion(caracteristicasVariables.getMetodoRecoleccion());
    fichaIndicadores.setIdComportamientoIndicador(caracteristicasVariables.getIdComportamientoIndicador());
    fichaIndicadores.setIdComportamientoMedicion(caracteristicasVariables.getIdComportamientoMedicion());
    fichaIndicadores.setIdTipoValor(caracteristicasVariables.getIdTipoValor());
    fichaIndicadores.setIdDesagregacionGeografica(caracteristicasVariables.getIdDesagregacion());
    fichaIndicadores.setCxDescripcionVinculacion(caracteristicasVariables.getDescripcionVinculacion());
  }
}
