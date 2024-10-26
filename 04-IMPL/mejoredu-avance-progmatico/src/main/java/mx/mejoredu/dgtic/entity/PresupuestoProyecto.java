package mx.mejoredu.dgtic.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Subselect;

/**
 * @author Emmanuel Estrada Gonzalez (emmanuel.estrada)
 * @version 1.0
 */
@Subselect("select * from vt_presupuesto_proyecto_unidad")
@Getter
@Setter
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
    private Integer totalAnualAsignado;
    @Column(name = "totalCalendarizado")
    private Integer totalCalendarizado;
}
