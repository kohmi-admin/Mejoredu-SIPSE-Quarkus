package mx.mejoredu.dgtic.entity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "met_solicitud")
public class Solicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solicitud", unique = true, nullable = false)
    private Integer idSolicitud;
    @Column(name = "cve_folio_solicitud", nullable = true, length = 45)
    private String folioSolicitud;
    @Column(name = "cve_folio_SIF", nullable = true, length = 15)
    private String folioSIF;
    @Column(name = "df_solicitud", nullable = true)
    private LocalDate fechaSolicitud;
    @Column(name = "dh_solicitud", nullable = true)
    private LocalTime dhSolicitud;
    @Column(name = "df_autorizacion", nullable = true)
    private LocalDate fechaAutorizacion;
    @Column(name = "ix_monto_aplicacion", nullable = true, precision = 2)
    private Double montoAplicacion;
    @Column(name = "cx_justificacion", nullable = true, length = 1000)
    private String justificacion;
    @Column(name = "cx_objetivo", nullable = true, length = 1000)
    private String objetivo;
    @Column(name = "ix_folio_secuencia", nullable = true)
    private Integer ixFolioSecuencia;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_catalogo_direccion", referencedColumnName = "id_catalogo", nullable = true)
    private MasterCatalogo direccionCatalogo;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_catalogo_unidad", referencedColumnName = "id_catalogo", nullable = true)
    private MasterCatalogo unidadCatalogo;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_catalogo_anhio", referencedColumnName = "id_catalogo", nullable = true)
    private MasterCatalogo anhioCatalogo;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_catalogo_adecuacion", referencedColumnName = "id_catalogo", nullable = true)
    private MasterCatalogo adecuacionCatalogo;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_catalogo_modificacion", referencedColumnName = "id_catalogo", nullable = true)
    private MasterCatalogo modificacionCatalogo;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_catalogo_estatus", referencedColumnName = "id_catalogo", nullable = false)
    private MasterCatalogo estatusCatalogo;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cve_usuario", referencedColumnName = "cve_usuario", nullable = true)
    private Usuario usuario;

    @OneToMany(mappedBy = "solicitud")
    private List<MehSolicitud> hSolicitud = new ArrayList<>();
    @OneToMany(mappedBy = "solicitud")
    private List<AdecuacionSolicitud> adecuaciones = new ArrayList<>();

    @Column(name = "cx_uuid", nullable = true, length = 32)
    private String cxUUID;

}
