package mx.edu.sep.dgtic.mejoredu.seguridad.entidades;


import jakarta.persistence.*;

import java.time.LocalDate;

/**
* 
*/

@Entity
@Table(name = "seg_periodo_habilitacion")
public class PeriodoHabilitacion {
    /**
    * 
    */
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name = "id_periodo_habilitacion")    
    private Integer idPeriodoHabilitacion;
    /**
    * 
    */
    @Column(name = "cx_modulo")    
    private String cxModulo;
    /**
    * 
    */
    @Column(name = "cx_submodulo")    
    private String cxSubmodulo;
    /**
    * 
    */
    @Column(name = "cx_opcion")    
    private String cxOpcion;
    /**
    * 
    */
    @Column(name = "df_inicio")    
    private LocalDate dfInicio;
    /**
    * 
    */
    @Column(name = "df_final")    
    private LocalDate dfFinal;
    /**
    * 
    */
    @Column(name = "cve_usuario")    
    private String cveUsuario;
    @Column(name = "cs_estatus")
    private String csEstatus;

    public Integer getIdPeriodoHabilitacion() {
        return idPeriodoHabilitacion;
    }

    public void setIdPeriodoHabilitacion(Integer idPeriodoHabilitacion) {
        this.idPeriodoHabilitacion = idPeriodoHabilitacion;
    }

    public String getCxModulo() {
        return cxModulo;
    }

    public void setCxModulo(String cxModulo) {
        this.cxModulo = cxModulo;
    }

    public String getCxSubmodulo() {
        return cxSubmodulo;
    }

    public void setCxSubmodulo(String cxSubmodulo) {
        this.cxSubmodulo = cxSubmodulo;
    }

    public String getCxOpcion() {
        return cxOpcion;
    }

    public void setCxOpcion(String cxOpcion) {
        this.cxOpcion = cxOpcion;
    }

    public LocalDate getDfInicio() {
        return dfInicio;
    }

    public void setDfInicio(LocalDate dfInicio) {
        this.dfInicio = dfInicio;
    }

    public LocalDate getDfFinal() {
        return dfFinal;
    }

    public void setDfFinal(LocalDate dfFinal) {
        this.dfFinal = dfFinal;
    }

    public String getCveUsuario() {
        return cveUsuario;
    }

    public void setCveUsuario(String cveUsuario) {
        this.cveUsuario = cveUsuario;
    }

    public String getCsEstatus() {
        return csEstatus;
    }

    public void setCsEstatus(String csEstatus) {
        this.csEstatus = csEstatus;
    }
}