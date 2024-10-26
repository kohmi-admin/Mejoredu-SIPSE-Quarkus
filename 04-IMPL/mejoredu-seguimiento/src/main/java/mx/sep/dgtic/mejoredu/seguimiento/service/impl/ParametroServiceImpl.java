package mx.sep.dgtic.mejoredu.seguimiento.service.impl;

import jakarta.inject.Inject;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ElementoDTO;
import mx.sep.dgtic.mejoredu.seguimiento.dao.ElementoRepository;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Elemento;
import mx.sep.dgtic.mejoredu.seguimiento.service.ParametroService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParametroServiceImpl implements ParametroService {
  @Inject
  private ElementoRepository elementoRepository;

  @Override
  public List<ElementoDTO> consultarPorIdProyecto(Integer idProyecto) {
    var elementos = elementoRepository.findByIdProyecto(idProyecto);
    return elementos.stream().map(this::entitieToVo).toList();
  }

  private ElementoDTO entitieToVo(Elemento el) {
    ElementoDTO elemento = new ElementoDTO();
    elemento.setIdElemento(el.getIdElemento());
    elemento.setNombre(el.getCxNombre());
    elemento.setIdObjetivo(el.getObjetivo().getId());
    elemento.setDescripcion(el.getCxDefinicion());
    if (el.getNivelDesagregacion() != null) {
      elemento.setNivelDesagregacion(el.getNivelDesagregacion().getId());
    }
    if (el.getMasterCatalogo2() != null)
      elemento.setPeriodicidad(el.getMasterCatalogo2().getId());
    elemento.setEspecificarPeriodicidad(el.getCxPeriodo());
    if (el.getMasterCatalogo3() != null)
      elemento.setTipo(el.getMasterCatalogo3().getId());
    if (el.getMasterCatalogo4() != null)
      elemento.setUnidadMedida(el.getMasterCatalogo4().getId());
    elemento.setEspecificarUnidadMedida(el.getCxUnidadMedida());
    if (el.getMasterCatalogo5() != null)
      elemento.setAcumulado(el.getMasterCatalogo5().getId());
    if (el.getMasterCatalogo6() != null)
      elemento.setPeriodoRecoleccion(el.getMasterCatalogo6().getId());
    elemento.setEspecificarPeriodo(el.getCxPeriodoRecoleccion());
    if (el.getMasterCatalogo7() != null)
      elemento.setDimensiones(el.getMasterCatalogo7().getId());
    if (el.getMasterCatalogo8() != null)
      elemento.setDisponibilidad(el.getMasterCatalogo8().getId());
    if (el.getMasterCatalogo9() != null)
      elemento.setTendencia(el.getMasterCatalogo9().getId());
    if (el.getUnidadResponsable() != null)
      elemento.setUnidadResponsable(el.getUnidadResponsable().getId());
    elemento.setMetodoCalculo(el.getCxMetodoCalculo());
    elemento.setObservaciones(el.getCxObservacion());
    return elemento;
  }
}
