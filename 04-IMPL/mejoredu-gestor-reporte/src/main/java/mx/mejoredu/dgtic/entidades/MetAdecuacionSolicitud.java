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
@Table(name = "met_adecuacion_solicitud")
public class MetAdecuacionSolicitud {
    /**
    * Identificador de la adecuación de la solicitud, auto secuencial
    */
    @Id
    @Column(name = "id_adecuacion_solicitud")    
    private Integer idAdecuacionSolicitud;
    /**
    * Identificador de tipo de modificación asociada a la adecuación
    */
    @Column(name = "id_catalogo_modificacion")    
    private Integer idCatalogoModificacion;
    /**
    * Identificador de la socitud que se registrará la adecuación, relación con la tabla met_solicitud
    */
    @Column(name = "id_solicitud")    
    private Integer idSolicitud;
    /**
    * Identificador del apartado a considerar en la adecuación, relacionado con la tabla cat_master_catalogo
    */
    @Column(name = "id_catalogo_apartado")    
    private Integer idCatalogoApartado;
}