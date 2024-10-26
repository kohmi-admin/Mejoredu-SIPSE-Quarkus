package mx.mejoredu.dgtic.servicios.Impl;

import io.quarkus.hibernate.orm.panache.Panache;
import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import lombok.Data;
import mx.edu.sep.dgtic.mejoredu.seguimiento.RespuestaSeguimientoMirVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.SeguimientoIndicadorVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.SeguimientoTrimestreVO;
import mx.mejoredu.dgtic.dao.VtEntregablesMirRepository;
import mx.mejoredu.dgtic.servicios.AvanceMirService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;

@Service
public class AvanceMirServiceImpl implements AvanceMirService {
  @Inject
  private VtEntregablesMirRepository vtEntregablesMirRepository;

  @Override
  public RespuestaSeguimientoMirVO consultarAvanceMir(int idAnhio) {
    HashMap<String, SeguimientoIndicadorVO> indicadores = new HashMap<>();


    vtEntregablesMirRepository
        .list("idAnhio = ?1", idAnhio)
        .forEach(entregable -> {
          var key = entregable.getId().getIdIndicadorResultado() + "-" + entregable.getId().getIdCatalogo();

          var indicador = indicadores.get(key);
          if (indicador == null) {
            var indicadorVO = new SeguimientoIndicadorVO();
            indicadorVO.setIdIndicador(entregable.getId().getIdIndicadorResultado());
            indicadorVO.setIdUnidad(entregable.getId().getIdCatalogo());
            indicadorVO.setNivelIndicador(entregable.getCxNivel());
            indicadorVO.setIndicador(entregable.getCxNombre());
            indicadorVO.setUnidad(entregable.getCdOpcion());

            indicadorVO.setTrimestres(new ArrayList<>() {
              {
                add(crearTrimestre(1, 0, 0));
                add(crearTrimestre(2, 0, 0));
                add(crearTrimestre(3, 0, 0));
                add(crearTrimestre(4, 0, 0));
              }
            });

            var mes = entregable.getId().getCiMes();
            var trimestre = Math.ceil(mes / 3.0);
            var trimestreInt = (int) trimestre;
            var trimestreVO = indicadorVO.getTrimestres().get(trimestreInt - 1);

            if (entregable.getCiEntregado() != null) {
              trimestreVO.setReportado(trimestreVO.getReportado() + entregable.getCiEntregado());
            }
            trimestreVO.setProgramado(trimestreVO.getProgramado() + entregable.getCiProgramado());

            indicadores.put(key, indicadorVO);
          } else {
            var mes = entregable.getId().getCiMes();
            var trimestre = Math.ceil(mes / 3.0);
            var trimestreInt = (int) trimestre;
            var trimestreVO = indicador.getTrimestres().get(trimestreInt - 1);

            if (entregable.getCiEntregado() != null) {
              trimestreVO.setReportado(trimestreVO.getReportado() + entregable.getCiEntregado());
            }
            trimestreVO.setProgramado(trimestreVO.getProgramado() + entregable.getCiProgramado());
          }

        });
    var lista = indicadores.values().stream().toList();
    Log.info("lista: " + lista.size());
    var respuesta = new RespuestaSeguimientoMirVO();
    respuesta.setIndicadores(indicadores.values().stream().toList());
    return respuesta;
  }

  private SeguimientoTrimestreVO crearTrimestre(int trimestre, int programado, int reportado) {
    var respuesta = new SeguimientoTrimestreVO();
    respuesta.setTrimestre(trimestre);
    respuesta.setProgramado(programado);
    respuesta.setReportado(reportado);
    return respuesta;
  }
}
