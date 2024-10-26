package mx.mejoredu.dgtic.entity;


import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "meh_solicitud")
public class MehSolicitud {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_historico_solicitud", nullable = false)
    private int idHistoricoSolicitud;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_solicitud", referencedColumnName = "id_solicitud", nullable = false)
    private Solicitud solicitud;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_catalogo_estatus", referencedColumnName = "id_catalogo", nullable = false)
    private MasterCatalogo catalogoEstatus;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cve_usuario", referencedColumnName = "cve_usuario", nullable = false)
    private Usuario usuario;
    @Column(name = "df_solicitud", nullable = true)
    private LocalDate dfSolicitud;
    @Column(name = "dh_solicitud", nullable = true)
    private LocalTime dhSolicitud;
}
