package mx.mejoredu.dgtic.entity;


import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "cat_master_catalogo")
public class MasterCatalogo implements Serializable {

    /** Primary key. */
    protected static final String PK = "idCatalogo";
    /**
     *
     */
    private static final long serialVersionUID = 1L;
    /**
     * The optimistic lock. Available via standard bean get/set operations.
     */
    @Version
    @Column(name = "LOCK_FLAG", nullable = true)
    private Integer lockFlag;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_catalogo", unique = true, nullable = false, precision = 10)
    private Integer id;
    @Column(name = "cd_opcion", nullable = false, length = 500)
    private String cdOpcion;
    @Column(name = "cc_externa", length = 45, nullable = true)
    private String ccExterna;
    @Column(name = "df_baja", nullable = true)
    private LocalDate dfBaja;
    @Column(name = "cd_descripcionDos", length = 500, nullable = true)
    private String cdDescripcionDos;
    @Column(name = "cc_externaDos", length = 45, nullable = true)
    private String ccExternaDos;
    @Column(name = "ix_dependencia", nullable = true, precision = 10)
    private Integer ixDependencia;
    @Column(name = "cve_usuario", nullable = false, length = 45)
    private String cveUsuario;
    @Column(name = "id_validar", nullable = true)
    private Integer idValidar;
    //	@Column(name = "id_validacion_planeacion", nullable = true)
//	private Integer idValidacionPlaneacion;
//	@Column(name = "id_validacion_supervisor", nullable = true)
//	private Integer idValidacionSupervisor;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_catalogo_padre", referencedColumnName = "id_catalogo", nullable = true)
    private MasterCatalogo catalogoPadre;

}
