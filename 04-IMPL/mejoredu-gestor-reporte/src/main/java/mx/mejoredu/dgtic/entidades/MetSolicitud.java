package mx.mejoredu.dgtic.entidades;

import lombok.Data;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.util.Date;
/**
* 
*/
@Data
@Entity
@Table(name = "met_solicitud")
public class MetSolicitud {
    /**
    * Identificador de la solicitud automatico secuencial
    */
    @Id
    @Column(name = "id_solicitud")    
    private Integer idSolicitud;
    /**
    * Clave que representa el folio de la solicitud
    */
    @Column(name = "cve_folio_solicitud")    
    private String cveFolioSolicitud;
    /**
    * Clave que representa el folio SIF
    */
    @Column(name = "cve_folio_SIF")    
    private String cveFolioSif;
    /**
    * Fecha en la que se genera la solicitud
    */
    @Column(name = "df_solicitud")    
    private Date dfSolicitud;
    /**
    * Hora en la que se genera la solicitud
    */
    @Column(name = "dh_solicitud")    
    private Date dhSolicitud;
    /**
    * Fecha en la que se autoriza la solicitud
    */
    @Column(name = "df_autorizacion")    
    private Date dfAutorizacion;
    /**
    * Identificador que representa la dirección asociada a la solicitud, relacionada con la tabla cat_master_catalogo por id_catalogo_padre igual a
    */
    @Column(name = "id_catalogo_direccion")    
    private Integer idCatalogoDireccion;
    /**
    * Identificador que representa la unidad administrativa, relacionada con la tabla cat_master_catalogo por id_catalogo_padre igual a
    */
    @Column(name = "id_catalogo_unidad")    
    private Integer idCatalogoUnidad;
    /**
    * Identificador que representa el año del ejercicio, relacionada con la tabla cat_master_catalogo por id_catalogo_padre igual a
    */
    @Column(name = "id_catalogo_anhio")    
    private Integer idCatalogoAnhio;
    /**
    * Identificador que representa el tipo de adecuación relacionada con la tabla cat_master_catalogo por id_catalogo_padre igual a
    */
    @Column(name = "id_catalogo_adecuacion")    
    private Integer idCatalogoAdecuacion;
    /**
    * Identificador que representa el tipo de adecuación, relacionada con la tabla cat_master_catalogo por id_catalogo_padre igual a
    */
    @Column(name = "id_catalogo_modificacion")    
    private Integer idCatalogoModificacion;
    /**
    * Identificador que representa el último estatus de la solicitud, relacionada con la tabla cat_master_catalogo por id_catalogo_padre igual a\n\nEstatus de la solicitud donde 1=Preregistro, 2=Registrada, 3=En revisión,4=Rechazada, 5=Revisada, 6=Formalizada,7=Rublica, 8=Aprobada, 9=Aprobación cambio de MIR, (11,12,13= 1,2,3 Ciclo de revisión), HACER UN CATALOGO Llamado Catálogo de Estatus de la solicitud
    */
    @Column(name = "id_catalogo_estatus")    
    private Integer idCatalogoEstatus;
    /**
    * Clave del usuario que realiza el registro de la solicitud
    */
    @Column(name = "cve_usuario")    
    private String cveUsuario;
    /**
    * 
    */
    @Column(name = "ix_monto_aplicacion")    
    private BigDecimal ixMontoAplicacion;
    /**
    * Descripción abierta alfanumerica con la justificación de la adecuación
    */
    @Column(name = "cx_justificacion")    
    private String cxJustificacion;
    /**
    * Descripción abierta alfanumerica con el objetivo de la adecuación
    */
    @Column(name = "cx_objetivo")    
    private String cxObjetivo;
}