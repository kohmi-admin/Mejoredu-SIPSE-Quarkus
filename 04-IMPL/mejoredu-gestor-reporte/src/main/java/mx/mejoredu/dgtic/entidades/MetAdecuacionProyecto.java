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
@Table(name = "met_adecuacion_proyecto")
public class MetAdecuacionProyecto {
    /**
    * Identificador de la relación unica entre la adecuación y los proyectos que serán incluidos en la solicitud
    */
    @Id
    @Column(name = "id_adecuacion_proyecto")    
    private Integer idAdecuacionProyecto;
    /**
    * Identificador de la adecuación de la solicitud, relacionada con la tabla met_adecuacion_proyecto
    */
    @Column(name = "id_adecuacion_solicitud")    
    private Integer idAdecuacionSolicitud;
    /**
    * identificador de un proyecto de la tabla met_cortoplazo_proyecto, relacionada con la tabla met_cortoplazo_proyecto
    */
    @Column(name = "id_proyecto_modificacion")
    private Integer idProyecto;
    @Column(name = "id_proyecto_referencia")
    private Integer idProyectoReferencia;
}