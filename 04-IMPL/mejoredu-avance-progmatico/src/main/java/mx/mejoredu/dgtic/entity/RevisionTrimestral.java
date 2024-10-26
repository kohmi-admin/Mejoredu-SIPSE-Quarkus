package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "met_revision_trimestral")
@Getter @Setter
public class RevisionTrimestral {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_revision_trimestral")
    private Integer idRevisionTrimestral;
    @Column(name = "id_validacion_planeacion")
    private Integer idValidacionPlaneacion;
    @Column(name = "id_validacion_administracion")
    private Integer idValidacionAdministracion;
    @Column(name = "id_actividad")
    private Integer idActividad;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_actividad", referencedColumnName = "id_actividad", insertable = false, updatable = false)
    private CortoplazoActividad cortoplazoActividad;
    @Column(name = "trimestre")
    private Integer trimestre;
    @Column(name = "cs_estatus")
    private String csEstatus;
}
