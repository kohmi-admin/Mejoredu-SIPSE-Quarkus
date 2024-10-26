package mx.sep.dgtic.sipse.presupuestal.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Objects;

@Entity
@Table(name = "met_validacion")
public class MetValidacionEntity implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_validacion", nullable = false)
    private int idValidacion;
    @Basic
    @Column(name = "df_validacion", nullable = true)
    private LocalDate dfValidacion;
    @Basic
    @Column(name = "dh_validacion", nullable = true)
    private LocalTime dhValidacion;
    @Basic
    @Column(name = "cve_usuario_registra", nullable = false, length = 45)
    private String cveUsuarioRegistra;
    @Basic
    @Column(name = "ix_ciclo", nullable = true)
    private Integer ixCiclo;
    @Basic
    @Column(name = "cs_estatus", nullable = true, length = 1)
    private String csEstatus;
    @Basic
    @Column(name = "cve_usuario_actualiza", nullable = false, length = 45)
    private String cveUsuarioActualiza;

    public int getIdValidacion() {
        return idValidacion;
    }

    public void setIdValidacion(int idValidacion) {
        this.idValidacion = idValidacion;
    }

    public LocalDate getDfValidacion() {
        return dfValidacion;
    }

    public void setDfValidacion(LocalDate dfValidacion) {
        this.dfValidacion = dfValidacion;
    }

    public LocalTime getDhValidacion() {
        return dhValidacion;
    }

    public void setDhValidacion(LocalTime dhValidacion) {
        this.dhValidacion = dhValidacion;
    }

    public String getCveUsuarioRegistra() {
        return cveUsuarioRegistra;
    }

    public void setCveUsuarioRegistra(String cveUsuarioRegistra) {
        this.cveUsuarioRegistra = cveUsuarioRegistra;
    }

    public Integer getIxCiclo() {
        return ixCiclo;
    }

    public void setIxCiclo(Integer ixCiclo) {
        this.ixCiclo = ixCiclo;
    }

    public String getCsEstatus() {
        return csEstatus;
    }

    public void setCsEstatus(String csEstatus) {
        this.csEstatus = csEstatus;
    }

    public String getCveUsuarioActualiza() {
        return cveUsuarioActualiza;
    }

    public void setCveUsuarioActualiza(String cveUsuarioActualiza) {
        this.cveUsuarioActualiza = cveUsuarioActualiza;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MetValidacionEntity that = (MetValidacionEntity) o;
        return idValidacion == that.idValidacion && Objects.equals(dfValidacion, that.dfValidacion) && Objects.equals(dhValidacion, that.dhValidacion) && Objects.equals(cveUsuarioRegistra, that.cveUsuarioRegistra) && Objects.equals(ixCiclo, that.ixCiclo) && Objects.equals(csEstatus, that.csEstatus) && Objects.equals(cveUsuarioActualiza, that.cveUsuarioActualiza);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idValidacion, dfValidacion, dhValidacion, cveUsuarioRegistra, ixCiclo, csEstatus, cveUsuarioActualiza);
    }
}
