package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Getter;
import lombok.Setter;

@RegisterForReflection
@Getter @Setter
public class VtIndicadorMirV2Projection {
    private Integer idIndicador;
    private Integer idCatalogoIndicador;
    private String cdOpcion;
    private String ccExterna;
    private String ccExternaDos;
    private Integer idAnhio;
    private Integer idCatalogoUnidad;
    private Integer idProdcal;
    private Integer mes;
    private Integer entregables;

    public VtIndicadorMirV2Projection(Integer idIndicador, Integer idCatalogoIndicador, String cdOpcion, String ccExterna, String ccExternaDos, Integer idAnhio, Integer idCatalogoUnidad, Integer idProdcal, Integer mes, Integer entregables) {
        this.idIndicador = idIndicador;
        this.idCatalogoIndicador = idCatalogoIndicador;
        this.cdOpcion = cdOpcion;
        this.ccExterna = ccExterna;
        this.ccExternaDos = ccExternaDos;
        this.idAnhio = idAnhio;
        this.idCatalogoUnidad = idCatalogoUnidad;
        this.idProdcal = idProdcal;
        this.mes = mes;
        this.entregables = entregables;
    }
}
