package mx.mejoredu.dgtic.entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Subselect;

@Subselect("select * from vt_productos_cancelados")
@Entity
@Table(name = "vt_productos_cancelados")
public class ProductoCancelado {
    @Id
    @Column(name = "id_adecuacion_producto")
    private Integer idAdecuacionProducto;
    @Column(name = "id_producto_modificacion")
    private  Integer idProductoModificacion;
    @Column(name = "id_producto_referencia")
    private Integer idProductoReferencia;
    @Column(name = "id_adecuacion_solicitud")
    private Integer idAdecuacionSolicitud;
    @Column(name = "id_catalogo_modificacion")
    private Integer idCatalogoModificacion;
    @Column(name =  "id_solicitud")
    private Integer idSolicitud;
    @Column(name = "id_catalogo_estatus")
    private Integer idCatalogoEstaatus;
    @Column(name = "id_catalogo_anhio")
    private Integer idCatalogoAnhio;

}
