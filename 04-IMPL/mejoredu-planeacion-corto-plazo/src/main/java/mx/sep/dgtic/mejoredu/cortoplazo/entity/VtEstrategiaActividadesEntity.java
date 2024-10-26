package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "vt_estrategia_actividades")
public class VtEstrategiaActividadesEntity {
    @Id
    @Column(name = "id_estaci")
    private Integer idEstaci;
    @Column(name = "ix_tipo")
    private Integer ixTipo;
    @Column(name = "id_actividad")
    private Integer idActividad;
    @Column(name = "cve_actividad")
    private Integer cveActividad;
    @Column(name = "id_catalogo")
    private String idCatalogo;
    @Column(name = "cx_nombre_actividad")
    private String cxNombreActividad;
    @Column(name = "id_proyecto")
    private Integer idProyecto;
    @Column(name = "cve_usuario")
    private String cveUsuario;
    @Column(name = "id_catalogo_unidad")
    private int idCatalogoUnidad;
    @Column(name = "cd_opcion")
    private String cdOpcion;
    @Column(name = "cc_externa")
    private String ccExterna;
    @Column(name = "id_catalogo_padre")
    private String idCatalogoPadre;


}
