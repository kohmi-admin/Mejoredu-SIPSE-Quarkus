package mx.mejoredu.dgtic.entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "vt_presupuesto_unidad")
@Setter @Getter
public class PresupuestoUnidad {
    
    @Column(name = "cve_unidad")
    private Integer cveUnidad;
    @Column(name = "id_anhio", nullable = false)
    private Integer idAnhio;
    
    @Id
    @Column(name = "id_catalogo_unidad")
    private Integer idUnidad;
    @Column(name = "totalAnualAsignado")
    private Double totalAnualAsignado;
    @Column(name = "totalCalendarizado")
    private Double totalCalendarizado;
    @Column(name = "cc_externaDos")
    private String ccExternaDos;

    
}
