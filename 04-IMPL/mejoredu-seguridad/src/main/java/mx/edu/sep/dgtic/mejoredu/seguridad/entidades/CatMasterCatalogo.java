package mx.edu.sep.dgtic.mejoredu.seguridad.entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Date;
/**
* 
*/
@Entity
@Table(name = "cat_master_catalogo")
public class CatMasterCatalogo {
    /**
    * Identificador de la opción del catalogo
    */
    @Id
    @Column(name = "id_catalogo")    
    private Integer idCatalogo;
    /**
    * Descripción de la opción del catálogo por ejemplo un catalago de pais la descripción será México

    */
    @Column(name = "cd_opcion")    
    private String cdOpcion;
    /**
    * Clave del catalogo como lo conoce negocio, por ejemplo pais opción mexico, la clave externa es MX
    */
    @Column(name = "cc_externa")    
    private String ccExterna;
    /**
    * Fecha de baja del registro, si existe info significa que no está activo el registro, si es nulo el registro está activo
    */
    @Column(name = "df_baja")    
    private Date dfBaja;
    /**
    * Clave del usuario que afecta el registro se relaciona con la tabla seg_usuario
    */
    @Column(name = "cve_usuario")    
    private String cveUsuario;
    /**
    * Identificador del catalogo que permite conocer el catálogo padre
    */
    @Column(name = "id_catalogo_padre")    
    private Integer idCatalogoPadre;
    /**
    * Descripción Dos de la opción del catalogo
    */
    @Column(name = "cd_descripcionDos")    
    private String cdDescripciondos;
    /**
    * Clave de la descripción dos del catalogo
    */
    @Column(name = "cc_externaDos")    
    private String ccExternados;
    /**
    * Identificador de control en transacciones concurrentes en contenedores
    */
    @Column(name = "LOCK_FLAG")    
    private Integer lockFlag;
    /**
    * Identificador del catalogo al que guarda dependencia,
    */
    @Column(name = "ix_dependencia")    
    private Integer ixDependencia;

    public Integer getIdCatalogo() {
        return idCatalogo;
    }

    public void setIdCatalogo(Integer idCatalogo) {
        this.idCatalogo = idCatalogo;
    }

    public String getCdOpcion() {
        return cdOpcion;
    }

    public void setCdOpcion(String cdOpcion) {
        this.cdOpcion = cdOpcion;
    }

    public String getCcExterna() {
        return ccExterna;
    }

    public void setCcExterna(String ccExterna) {
        this.ccExterna = ccExterna;
    }

    public Date getDfBaja() {
        return dfBaja;
    }

    public void setDfBaja(Date dfBaja) {
        this.dfBaja = dfBaja;
    }

    public String getCveUsuario() {
        return cveUsuario;
    }

    public void setCveUsuario(String cveUsuario) {
        this.cveUsuario = cveUsuario;
    }

    public Integer getIdCatalogoPadre() {
        return idCatalogoPadre;
    }

    public void setIdCatalogoPadre(Integer idCatalogoPadre) {
        this.idCatalogoPadre = idCatalogoPadre;
    }

    public String getCdDescripciondos() {
        return cdDescripciondos;
    }

    public void setCdDescripciondos(String cdDescripciondos) {
        this.cdDescripciondos = cdDescripciondos;
    }

    public String getCcExternados() {
        return ccExternados;
    }

    public void setCcExternados(String ccExternados) {
        this.ccExternados = ccExternados;
    }

    public Integer getLockFlag() {
        return lockFlag;
    }

    public void setLockFlag(Integer lockFlag) {
        this.lockFlag = lockFlag;
    }

    public Integer getIxDependencia() {
        return ixDependencia;
    }

    public void setIxDependencia(Integer ixDependencia) {
        this.ixDependencia = ixDependencia;
    }
}