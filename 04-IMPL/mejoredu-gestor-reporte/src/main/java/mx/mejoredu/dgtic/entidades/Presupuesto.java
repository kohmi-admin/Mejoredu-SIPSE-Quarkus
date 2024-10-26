package mx.mejoredu.dgtic.entidades;

import jakarta.persistence.*;
import org.hibernate.Hibernate;

import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "met_cortoplazo_presupuesto")
public class Presupuesto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_presupuesto")
    private Integer idPresupuesto;

    @Column(name = "cve_accion")
    private Integer cveAccion;
    @Column(name = "cx_nombre_accion")
    private String cxNombreAccion;
    @Column(name = "cve_nivel_educativo")
    private String cveNivelEducativo;
    @Column(name = "cx_presupuesto_anual")
    private Integer cxPresupuestoAnual;
    @Column(name = "cb_productos_asociados")
    private String cbProductosAsociados;
    @Column(name = "df_presupuesto")
    private Date dfPresupuesto;
    @Column(name = "dh_presupuesto")
    private Time dhPresupuesto;
    @Column(name = "cve_usuario")
    private String usuario;
    @Column(name = "id_producto")
    private Integer producto;
    @Column(name = "id_catalogo_centro_costo", updatable = false, insertable = false)
    private Integer catalogoCentroCosto;
    @Column(name = "id_catalogo_centro_costo")
    private Integer idCatalogoCentroCosto;
    @Column(name = "id_catalogo_fuente", updatable = false, insertable = false)
    private Integer catalogoFuente;
    @Column(name = "id_catalogo_fuente")
    private Integer idCatalogoFuente;
    @Column(name = "cs_estatus")
    private String csEstatus;


    @Column(name = "id_validacion", nullable = true)
    private Integer idValidacion;

    @Column(name = "id_validacion_planeacion", nullable = true)
    private Integer idValidacionPlaneacion;

    @Column(name = "id_validacion_supervisor", nullable = true)
    private Integer idValidacionSupervisor;

    public Integer getIdValidacion() {
        return idValidacion;
    }
    public void setIdValidacion(Integer idValidacion) {
        this.idValidacion = idValidacion;
    }

    public Integer getIdValidacionPlaneacion() {
        return idValidacionPlaneacion;
    }

    public void setIdValidacionPlaneacion(Integer idValidacionPlaneacion) {
        this.idValidacionPlaneacion = idValidacionPlaneacion;
    }

    public Integer getIdValidacionSupervisor() {
        return idValidacionSupervisor;
    }

    public void setIdValidacionSupervisor(Integer idValidacionSupervisor) {
        this.idValidacionSupervisor = idValidacionSupervisor;
    }

    public Integer getIdPresupuesto() {
        return idPresupuesto;
    }

    public void setIdPresupuesto(Integer idPresupuesto) {
        this.idPresupuesto = idPresupuesto;
    }

    public Integer getCveAccion() {
        return cveAccion;
    }

    public void setCveAccion(Integer cveAccion) {
        this.cveAccion = cveAccion;
    }

    public String getCxNombreAccion() {
        return cxNombreAccion;
    }

    public void setCxNombreAccion(String cxNombreAccion) {
        this.cxNombreAccion = cxNombreAccion;
    }

    public String getCveNivelEducativo() {
        return cveNivelEducativo;
    }

    public void setCveNivelEducativo(String cveNivelEducativo) {
        this.cveNivelEducativo = cveNivelEducativo;
    }

    public Integer getCxPresupuestoAnual() {
        return cxPresupuestoAnual;
    }

    public void setCxPresupuestoAnual(Integer cxPresupuestoAnual) {
        this.cxPresupuestoAnual = cxPresupuestoAnual;
    }

    public String getCbProductosAsociados() {
        return cbProductosAsociados;
    }

    public void setCbProductosAsociados(String cbProductosAsociados) {
        this.cbProductosAsociados = cbProductosAsociados;
    }

    public Date getDfPresupuesto() {
        return dfPresupuesto;
    }

    public void setDfPresupuesto(Date dfPresupuesto) {
        this.dfPresupuesto = dfPresupuesto;
    }

    public Time getDhPresupuesto() {
        return dhPresupuesto;
    }

    public void setDhPresupuesto(Time dhPresupuesto) {
        this.dhPresupuesto = dhPresupuesto;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public Integer getProducto() {
        return producto;
    }

    public Integer getCatalogoCentroCosto() {
        return catalogoCentroCosto;
    }

    public void setCatalogoCentroCosto(Integer catalogoCentroCosto) {
        this.catalogoCentroCosto = catalogoCentroCosto;
    }

    public Integer getCatalogoFuente() {
        return catalogoFuente;
    }

    public void setCatalogoFuente(Integer catalogoFuente) {
        this.catalogoFuente = catalogoFuente;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Presupuesto that = (Presupuesto) o;
        return getIdPresupuesto() != null && Objects.equals(getIdPresupuesto(), that.getIdPresupuesto());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "idPresupuesto = " + idPresupuesto + ")";
    }

    public String getCsEstatus() {
        return csEstatus;
    }

    public void setCsEstatus(String csEstatus) {
        this.csEstatus = csEstatus;
    }

    public Integer getIdCatalogoCentroCosto() {
        return idCatalogoCentroCosto;
    }

    public void setIdCatalogoCentroCosto(Integer idCatalogoCentroCosto) {
        this.idCatalogoCentroCosto = idCatalogoCentroCosto;
    }

    public Integer getIdCatalogoFuente() {
        return idCatalogoFuente;
    }

    public void setIdCatalogoFuente(Integer idCatalogoFuente) {
        this.idCatalogoFuente = idCatalogoFuente;
    }
}
