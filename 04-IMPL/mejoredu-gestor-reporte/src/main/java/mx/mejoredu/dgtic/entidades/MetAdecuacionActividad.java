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
@Table(name = "met_adecuacion_actividad")
public class MetAdecuacionActividad {
    /**
    * 
    */
    @Id
    @Column(name = "id_adecuacion_actividad")    
    private Integer idAdecuacionActividad;
    /**
    * 
    */
    @Column(name = "id_adecuacion_solicitud")    
    private Integer idAdecuacionSolicitud;
    /**
    * 
    */
    @Column(name = "id_actividad_modificacion")    
    private Integer idActividadModificacion;
    /**
    * 
    */
    @Column(name = "id_actividad_referencia")    
    private Integer idActividadReferencia;
}