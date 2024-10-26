package mx.mejoredu.dgtic.entidades;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Getter @Setter
@Table(name = "vt_producto_sumatiroa")
public class vt_producto_sumatiroa {
    @EmbeddedId
    private VtProductoSumatiroaId id;

    @Column(name = "id_actividad", nullable = true)
    private Integer idActividad;

    @Column(name = "cs_estatus", nullable = true)
    private String csEstatus;

    @Column(name = "productosentregados", nullable = true)
    private Integer productosEntregados;

    @Column(name = "entregablesprogramados")
    private Integer entregablesProgramados;

    @Column(name = "entregablesfinalizados")
    private String entregablesFinalizados;

    @Column(name = "presupuesto")
    private String presupuesto;

    @Column(name = "presupuestoutilizado")
    private String presupuestoUtilizado;

    @Column(name = "adecuaciones_acciones")
    private String adecuacionesAcciones;

    @Column(name = "adecuaciones_presupuesto")
    private String adecuacionesPresupuesto;

    @Embeddable
    @Getter @Setter
    public static class VtProductoSumatiroaId implements Serializable {

        @Column(name = "id_producto", nullable = false)
        private Integer idProducto;

        @Column(name = "ix_trimestre", nullable = false)
        private Integer ixTrimestre;

        // Default constructor
        public VtProductoSumatiroaId() {}

        // Constructor with fields
        public VtProductoSumatiroaId(Integer idProducto, Integer ixTrimestre) {
            this.idProducto = idProducto;
            this.ixTrimestre = ixTrimestre;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            VtProductoSumatiroaId that = (VtProductoSumatiroaId) o;
            return Objects.equals(idProducto, that.idProducto) &&
                    Objects.equals(ixTrimestre, that.ixTrimestre);
        }

        @Override
        public int hashCode() {
            return Objects.hash(idProducto, ixTrimestre);
        }
    }
}