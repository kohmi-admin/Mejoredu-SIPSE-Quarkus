package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "\"vt_indicadores_mirV2\"")
@Immutable
@Getter @Setter
public class VtIndicadorMirV2 {
    @Id @Column(name = "id_indicador")
    private Integer idIndicador;
    @Column(name = "id_producto")
    private Integer idProducto;
    @Column(name = "cs_estatus")
    private String csEstatus;
    @Column(name = "id_catalogo_indicador")
    private Integer idCatalogoIndicador;
    @Column(name = "cd_opcion")
    private String cdOpcion;
    @Column(name = "cc_externa")
    private String ccExterna;
    @Column(name = "cc_externaDos")
    private String ccExternaDos;
    @Column(name = "id_anhio")
    private Integer idAnhio;
    @Column(name = "id_catalogo_unidad")
    private Integer idCatalogoUnidad;
    @Column(name = "id_prodcal")
    private Integer idProdcal;
    @Column(name = "mes")
    private Integer mes;
    @Column(name = "entregables")
    private Integer entregables;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        VtIndicadorMirV2 that = (VtIndicadorMirV2) o;
        return getIdIndicador() != null && Objects.equals(getIdIndicador(), that.getIdIndicador());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "idIndicador = " + idIndicador + ", " +
                "idProducto = " + idProducto + ", " +
                "csEstatus = " + csEstatus + ", " +
                "idCatalogoIndicador = " + idCatalogoIndicador + ", " +
                "cdOpcion = " + cdOpcion + ", " +
                "ccExterna = " + ccExterna + ", " +
                "ccExternaDos = " + ccExternaDos + ", " +
                "idAnhio = " + idAnhio + ", " +
                "idCatalogoUnidad = " + idCatalogoUnidad + ", " +
                "entregables = " + entregables + ")";
    }
}
