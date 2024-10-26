package mx.sep.dgtic.sipse.presupuestal.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "met_revision_validacion")
public class MetRevisionValidacionEntity implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_revision", nullable = false)
    private Integer idRevision;
    @Basic
    @Column(name = "id_elemento_validar", nullable = false)
    private Integer idElementoValidar;
    @Basic
    @Column(name = "id_validacion", nullable = false)
    private Integer idValidacion;
    @Basic
    @Column(name = "cx_comentario", nullable = true, length = 500)
    private String cxComentario;
    @Basic
    @Column(name = "ix_check", nullable = true)
    private Integer ixCheck;

    public Integer getIdRevision() {
        return idRevision;
    }

    public void setIdRevision(Integer idRevision) {
        this.idRevision = idRevision;
    }

    public int getIdElementoValidar() {
        return idElementoValidar;
    }

    public void setIdElementoValidar(Integer idElementoValidar) {
        this.idElementoValidar = idElementoValidar;
    }

    public Integer getIdValidacion() {
        return idValidacion;
    }

    public void setIdValidacion(Integer idValidacion) {
        this.idValidacion = idValidacion;
    }

    public String getCxComentario() {
        return cxComentario;
    }

    public void setCxComentario(String cxComentario) {
        this.cxComentario = cxComentario;
    }

    public Integer getIxCheck() {
        return ixCheck;
    }

    public void setIxCheck(Integer ixCheck) {
        this.ixCheck = ixCheck;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MetRevisionValidacionEntity that = (MetRevisionValidacionEntity) o;
        return idRevision == that.idRevision && idElementoValidar == that.idElementoValidar && idValidacion == that.idValidacion && Objects.equals(cxComentario, that.cxComentario) && Objects.equals(ixCheck, that.ixCheck);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idRevision, idElementoValidar, idValidacion, cxComentario, ixCheck);
    }
}
