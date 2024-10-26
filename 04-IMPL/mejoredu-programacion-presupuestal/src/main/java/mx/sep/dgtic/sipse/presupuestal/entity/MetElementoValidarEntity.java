package mx.sep.dgtic.sipse.presupuestal.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "met_elemento_validar")
public class MetElementoValidarEntity implements Serializable {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_elemento", nullable = false)
    private int idElemento;
    @Basic
    @Column(name = "cx_nombre", nullable = true, length = 200)
    private String cxNombre;
    @Basic
    @Column(name = "id_apartado", nullable = false)
    private int idApartado;

    public int getIdElemento() {
        return idElemento;
    }

    public void setIdElemento(int idElemento) {
        this.idElemento = idElemento;
    }

    public String getCxNombre() {
        return cxNombre;
    }

    public void setCxNombre(String cxNombre) {
        this.cxNombre = cxNombre;
    }

    public int getIdApartado() {
        return idApartado;
    }

    public void setIdApartado(int idApartado) {
        this.idApartado = idApartado;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MetElementoValidarEntity that = (MetElementoValidarEntity) o;
        return idElemento == that.idElemento && idApartado == that.idApartado && Objects.equals(cxNombre, that.cxNombre);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idElemento, cxNombre, idApartado);
    }
}
