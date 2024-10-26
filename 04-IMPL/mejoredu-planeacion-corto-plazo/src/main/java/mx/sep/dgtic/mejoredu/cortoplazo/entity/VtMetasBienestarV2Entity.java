package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "\"vt_metasBienestarV2\"")
@Immutable
@Getter @Setter
public class VtMetasBienestarV2Entity {
  @Id @Column(name = "id_elemento")
  private Integer idElemento;
  @Column(name = "id_indicador_pi")
  private Integer idIndicadorPi;
  @Column(name = "id_anhio")
  private Integer idAnhio;
  @Column(name = "cve_usuario")
  private String cveUsuario;
  @Column(name = "id_unidad")
  private Integer idUnidad;
  @Column(name = "cve_objetivo")
  private String cveObjetivo;
  @Column(name = "periodicidad")
  private String periodicidad;
  @Column(name = "periodicidad_otro")
  private String periodicidadOtro;
  @Column(name = "unidad_medida")
  private String unidadMedida;
  @Column(name = "unidad_medida_otro")
  private String unidadMedidaOtro;
  @Column(name = "tendencia")
  private String tendencia;
  @Column(name = "indicador")
  private String indicador;
  @Column(name = "entregables")
  private Integer entregables;

  @Override
  public final boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
    Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
    if (thisEffectiveClass != oEffectiveClass) return false;
    VtMetasBienestarV2Entity that = (VtMetasBienestarV2Entity) o;
    return getIdElemento() != null && Objects.equals(getIdElemento(), that.getIdElemento());
  }

  @Override
  public final int hashCode() {
    return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
  }

  @Override
  public String toString() {
    return getClass().getSimpleName() + "(" +
            "idElemento = " + idElemento + ", " +
            "idIndicadorPi = " + idIndicadorPi + ")";
  }
}
