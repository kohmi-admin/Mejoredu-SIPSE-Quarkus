package mx.sep.dgtic.sipse.presupuestal.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "met_apartado")
public class MetApartadoEntity implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_apartado", nullable = false)
    private int idApartado;
    @Basic
    @Column(name = "cx_nombre", nullable = true, length = 100)
    private String cxNombre;

    public int getIdApartado() {
        return idApartado;
    }

    public void setIdApartado(int idApartado) {
        this.idApartado = idApartado;
    }

    public String getCxNombre() {
        return cxNombre;
    }

    public void setCxNombre(String cxNombre) {
        this.cxNombre = cxNombre;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MetApartadoEntity that = (MetApartadoEntity) o;
        return idApartado == that.idApartado && Objects.equals(cxNombre, that.cxNombre);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idApartado, cxNombre);
    }
}
