package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.*;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "\"vt_metasBienestar\"")
public class VtMetasBienestarEntity {
    @Id
    @Basic
    @Column(name = "idMeta", nullable = false)
    private Integer idMeta;
    @Basic
    @Column(name = "cveObjetivo", nullable = false, length = 1)
    private String cveObjetivo;
    @Basic
    @Column(name = "cveMetaPara", nullable = false, length = 3)
    private String cveMetaPara;
    @Basic
    @Column(name = "nomIndicador", nullable = false, length = 40)
    private String nomIndicador;
    @Basic
    @Column(name = "periodicidad", nullable = false, length = 6)
    private String periodicidad;
    @Basic
    @Column(name = "periodicidadOtro", nullable = true)
    private String periodicidadOtro;
    @Basic
    @Column(name = "unidadMedida", nullable = false, length = 10)
    private String unidadMedida;
    @Basic
    @Column(name = "unidadMedidaOtro", nullable = true)
    private String unidadMedidaOtro;
    @Basic
    @Column(name = "tendencia", nullable = false, length = 10)
    private String tendencia;
    @Basic
    @Column(name = "tendenciaOtro", nullable = true)
    private String tendenciaOtro;
    @Basic
    @Column(name = "fuente", nullable = false, length = 8)
    private String fuente;
    @Basic
    @Column(name = "fuenteOtro", nullable = true, length = 45)
    private String fuenteOtro;
    @Basic
    @Column(name = "entregables", nullable = false)
    private long entregables;
    @Basic
    @Column(name = "anhio", nullable = false)
    private int anhio;
    @Basic
    @Column(name = "cveUsuario", nullable = false, length = 45)
    private String cveUsuario;


    public Integer getIdMeta() {
        return idMeta;
    }

    public void setIdMeta(Integer idMeta) {
        this.idMeta = idMeta;
    }

    public String getCveObjetivo() {
        return cveObjetivo;
    }

    public void setCveObjetivo(String cveObjetivo) {
        this.cveObjetivo = cveObjetivo;
    }

    public String getCveMetaPara() {
        return cveMetaPara;
    }

    public void setCveMetaPara(String cveMetaPara) {
        this.cveMetaPara = cveMetaPara;
    }

    public String getNomIndicador() {
        return nomIndicador;
    }

    public void setNomIndicador(String nomIndicador) {
        this.nomIndicador = nomIndicador;
    }

    public String getPeriodicidad() {
        return periodicidad;
    }

    public void setPeriodicidad(String periodicidad) {
        this.periodicidad = periodicidad;
    }

    public String getPeriodicidadOtro() {
        return periodicidadOtro;
    }

    public void setPeriodicidadOtro(String periodicidadOtro) {
        this.periodicidadOtro = periodicidadOtro;
    }

    public String getUnidadMedida() {
        return unidadMedida;
    }

    public void setUnidadMedida(String unidadMedida) {
        this.unidadMedida = unidadMedida;
    }

    public String getUnidadMedidaOtro() {
        return unidadMedidaOtro;
    }

    public void setUnidadMedidaOtro(String unidadMedidaOtro) {
        this.unidadMedidaOtro = unidadMedidaOtro;
    }

    public String getTendencia() {
        return tendencia;
    }

    public void setTendencia(String tendencia) {
        this.tendencia = tendencia;
    }

    public String getTendenciaOtro() {
        return tendenciaOtro;
    }

    public void setTendenciaOtro(String tendenciaOtro) {
        this.tendenciaOtro = tendenciaOtro;
    }

    public String getFuente() {
        return fuente;
    }

    public void setFuente(String fuente) {
        this.fuente = fuente;
    }

    public String getFuenteOtro() {
        return fuenteOtro;
    }

    public void setFuenteOtro(String fuenteOtro) {
        this.fuenteOtro = fuenteOtro;
    }

    public long getEntregables() {
        return entregables;
    }

    public void setEntregables(long entregables) {
        this.entregables = entregables;
    }

    public int getAnhio() {
        return anhio;
    }

    public void setAnhio(int anhio) {
        this.anhio = anhio;
    }

    public String getCveUsuario() {
        return cveUsuario;
    }

    public void setCveUsuario(String cveUsuario) {
        this.cveUsuario = cveUsuario;
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        VtMetasBienestarEntity that = (VtMetasBienestarEntity) o;
        return getIdMeta() != null && Objects.equals(getIdMeta(), that.getIdMeta());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "idMeta = " + idMeta + ")";
    }
}
