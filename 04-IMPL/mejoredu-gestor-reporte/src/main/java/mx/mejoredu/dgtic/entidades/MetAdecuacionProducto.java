package mx.mejoredu.dgtic.entidades;

import lombok.Data;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
* 
*/
@Data
@Entity
@Table(name = "met_adecuacion_producto")
public class MetAdecuacionProducto {
    /**
    * 
    */
    @Id
    @Column(name = "id_adecuacion_producto")    
    private Integer idAdecuacionProducto;
    /**
    * 
    */
    @Column(name = "id_adecuacion_solicitud")    
    private Integer idAdecuacionSolicitud;
    /**
    * 
    */
    @Column(name = "id_producto_modificacion")    
    private Integer idProductoModificacion;
    /**
    * 
    */
    @Column(name = "id_producto_referencia")    
    private Integer idProductoReferencia;
}