package mx.mejoredu.dgtic.entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Subselect;

@Subselect("select * from vt_presupuesto_proyecto_unidad")
@Entity
@Table(name = "vt_presupuesto_proyecto_unidad")
public class PresupuestoProyecto {
    @Column(name = "cve_unidad")
    private Integer cveUnidad;
    @Column(name = "id_anhio", nullable = false)
    private Integer idAnhio;
    @Column(name = "id_catalogo_unidad")
    private Integer idUnidad;
    @Id
    @Column(name = "cx_nombre_proyecto")
    private String cxNombreProyecto;
    @Column(name = "totalAnualAsignado")
    private Double totalAnualAsignado;
    @Column(name = "totalCalendarizado")
    private Double totalCalendarizado;

    public Integer getIdAnhio() {
        return idAnhio;
    }

    public void setIdAnhio(Integer idAnhio) {
        this.idAnhio = idAnhio;
    }

    public Integer getIdUnidad() {
        return idUnidad;
    }

    public void setIdUnidad(Integer idUnidad) {
        this.idUnidad = idUnidad;
    }

    public Integer getCveUnidad() {
        return cveUnidad;
    }

    public void setCveUnidad(Integer cveUnidad) {
        this.cveUnidad = cveUnidad;
    }

    public String getCxNombreProyecto() {
        return cxNombreProyecto;
    }

    public void setCxNombreProyecto(String cxNombreProyecto) {
        this.cxNombreProyecto = cxNombreProyecto;
    }

    public Double getTotalAnualAsignado() {
        return totalAnualAsignado;
    }

    public void setTotalAnualAsignado(Double totalAnualAsignado) {
        this.totalAnualAsignado = totalAnualAsignado;
    }

    public Double getTotalCalendarizado() {
        return totalCalendarizado;
    }

    public void setTotalCalendarizado(Double totalCalendarizado) {
        this.totalCalendarizado = totalCalendarizado;
    }
}


