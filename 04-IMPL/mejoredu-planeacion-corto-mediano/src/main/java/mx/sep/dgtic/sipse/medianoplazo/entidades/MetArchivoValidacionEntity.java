package mx.sep.dgtic.sipse.medianoplazo.entidades;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "met_archivo_validacion")
public class MetArchivoValidacionEntity implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_archivo_validacion", nullable = false)
    private Integer idArchivoValidacion;
    @Basic
    @Column(name = "id_validacion", nullable = false)
    private Integer idValidacion;
    @Basic
    @Column(name = "id_archivo", nullable = false)
    private Integer idArchivo;

    public Integer getIdArchivoValidacion() {
        return idArchivoValidacion;
    }

    public void setIdArchivoValidacion(Integer idArchivoValidacion) {
        this.idArchivoValidacion = idArchivoValidacion;
    }

    public Integer getIdValidacion() {
        return idValidacion;
    }

    public void setIdValidacion(Integer idValidacion) {
        this.idValidacion = idValidacion;
    }

    public Integer getIdArchivo() {
        return idArchivo;
    }

    public void setIdArchivo(Integer idArchivo) {
        this.idArchivo = idArchivo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MetArchivoValidacionEntity that = (MetArchivoValidacionEntity) o;
        return idArchivoValidacion == that.idArchivoValidacion && idValidacion == that.idValidacion && idArchivo == that.idArchivo;
    }

    @Override
    public int hashCode() {
        return Objects.hash(idArchivoValidacion, idValidacion, idArchivo);
    }
}
