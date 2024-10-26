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
@Table(name = "met_adecuacion_presupuesto")
public class MetAdecuacionPresupuesto {
    /**
    * 
    */
    @Id
    @Column(name = "id_adecuacion_presupuesto")    
    private Integer idAdecuacionPresupuesto;
    /**
    * 
    */
    @Column(name = "id_adecuacion_solicitud")    
    private Integer idAdecuacionSolicitud;
    /**
    * 
    */
    @Column(name = "id_presupuesto_modificacion")    
    private Integer idPresupuestoModificacion;
    /**
    * 
    */
    @Column(name = "id_presupuesto_referencia")    
    private Integer idPresupuestoReferencia;
    /**
    * 
    */
    @Column(name = "id_presupuesto_referencia_b")    
    private Integer idPresupuestoReferenciaB;
}