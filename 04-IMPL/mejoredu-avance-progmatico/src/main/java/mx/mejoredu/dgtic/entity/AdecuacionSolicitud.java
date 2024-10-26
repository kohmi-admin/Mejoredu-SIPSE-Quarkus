package mx.mejoredu.dgtic.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

@Data
@Entity
@Table(name = "met_adecuacion_solicitud")
public class AdecuacionSolicitud {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_adecuacion_solicitud", nullable = false)
    private int idAdecuacionSolicitud;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_catalogo_modificacion", referencedColumnName = "id_catalogo", nullable = false)
    private MasterCatalogo catalogoModificacion;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_solicitud", referencedColumnName = "id_solicitud", nullable = false)
    @NotFound(action = NotFoundAction.IGNORE)
    private Solicitud solicitud;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_catalogo_apartado", referencedColumnName = "id_catalogo", nullable = false)
    private MasterCatalogo catalogoApartado;

}
