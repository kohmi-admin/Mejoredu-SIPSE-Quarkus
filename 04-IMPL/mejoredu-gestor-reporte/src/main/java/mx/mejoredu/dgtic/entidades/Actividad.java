package mx.mejoredu.dgtic.entidades;

import lombok.Data;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Date;
/**
* 
*/
@Data
@Entity
@Table(name = "met_cortoplazo_actividad")
public class Actividad {
    /**
    * indentificador de una actividad en la tabla met_cortoplazo_actividades
    */
    @Id
    @Column(name = "id_actividad")    
    private Integer idActividad;
    /**
    * campo que almacena la clave asociada a una actividad
    */
    @Column(name = "cve_actividad")    
    private Integer cveActividad;
    /**
    * campo que almacena el nombre de la actividad
    */
    @Column(name = "cx_nombre_actividad")    
    private String cxNombreActividad;
    /**
    * campo que almacena la descripcion de la actividad 
    */
    @Column(name = "cx_descripcion")    
    private String cxDescripcion;
    /**
    * campo que almacena articulaciones enfocada a la actividad
    */
    @Column(name = "cx_articulacion_actividad")    
    private String cxArticulacionActividad;
    /**
    * campo que almacena la accion transversal que se asocie a la actividad
    */
    @Column(name = "cb_actividad_interunidades")    
    private String cbActividadInterunidades;
    /**
    * clave que identifica a un usuario, se relaciona con la tabla seg_usuario
    */
    @Column(name = "cve_usuario")    
    private String cveUsuario;
    /**
    * campo que almacena la fecha de registro de la actividad
    */
    @Column(name = "df_actividad")    
    private Date dfActividad;
    /**
    * campo que almacena la hora de registro de la actividad
    */
    @Column(name = "dh_actividad")    
    private Date dhActividad;
    /**
    * Identidad del proyecto asociada a la actividad, relacionada con la tabla met_cortoplazo_proyecto
    */
    @Column(name = "id_proyecto")    
    private Integer idProyecto;
    /**
    * Bandera para saber si requiere actividad transversal, 0 = no requiere 1 = Si requiere / palomeado
    */
    @Column(name = "ic_actividad_transversal")    
    private Integer icActividadTransversal;
    /**
    * Bandera para saber si requiere reuniones, 0 = no requiere 1 = Si requiere / palomeado
    */
    @Column(name = "ix_requiere_reunion")    
    private Integer ixRequiereReunion;
    /**
    * Descripción del tema para la reunión
    */
    @Column(name = "cx_tema")    
    private String cxTema;
    /**
    * Identificador del catalogo asociado al alcance
    */
    @Column(name = "id_catalogo_alcance")    
    private Integer idCatalogoAlcance;
    /**
    * Descripción del lugar captura libre
    */
    @Column(name = "cx_lugar")    
    private String cxLugar;
    /**
    * Descripcion de actores convocados a la reunión
    */
    @Column(name = "cx_actores")    
    private String cxActores;
    /**
    * Bandera para conocer el estado del registro A = Activo, B = Dado de baja borrado logico
    */
    @Column(name = "cs_estatus")    
    private String csEstatus;
    /**
    * Identificador de la  revisión realizada en corto plazo actividades, relacionada con la tabla met_validacion
    */
    @Column(name = "id_validacion")    
    private Integer idValidacion;
    /**
    * Identificador de validación asociada al apartado, realizado por el rol de usuario Planificación, relacionada con la tabla met_validación
    */
    @Column(name = "id_validacion_planeacion")    
    private Integer idValidacionPlaneacion;
    /**
    * Identificador de validación asociada, realizado por el rol de usuario Supervisor, relacionada con la tabla met_validación
    */
    @Column(name = "id_validacion_supervisor")    
    private Integer idValidacionSupervisor;
    /**
    * Tipificador o semantica de la actividad es el sentido que daremos a la información 1 = Registro de actividades 2 = Solicitud en apartado actividadSeguimiento . Por defecto es valor igual a 1 será interpretado como un registro por el modulo de planeación
    */
    @Column(name = "it_semantica")    
    private Integer itSemantica;
    /**
    * 
    */
    @Column(name = "ix_accion")    
    private Integer ixAccion;
    /**
    * Identificador de la actividad que será asociado a la actividad clonada por una solicitud, es una relación recursiva a met_cortoplazo_actividad
    */
    @Column(name = "id_espejo")    
    private Integer idEspejo;
}