// Generated with g9.

package mx.edu.sep.dgtic.mejoredu.seguridad.entidades;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.proxy.HibernateProxy;

@Entity(name="seg_usuario_facultad")
@Setter @Getter
public class UsuarioFacultad implements Serializable {
    /** Primary key. */
    protected static final String PK = "UsuarioFacultadPrimary";

    @Version
    @Column(name="LOCK_FLAG")
    private Integer lockFlag;

    @Id
    @Column(name="id_usu_fac", unique=true, nullable=false, precision=10)
    private Integer idUsuFac;
    @Column(name="id_registro", nullable=false, precision=10)
    private int idRegistro;
    @ManyToOne(optional=false)
    @JoinColumn(name="id_facultad", nullable=false)
    private Facultad facultad;
    @ManyToOne(optional=false)
    @JoinColumn(name="id_tipo_usuario", nullable=false)
    private TipoUsuario tipoUsuario;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        UsuarioFacultad that = (UsuarioFacultad) o;
        return getIdUsuFac() != null && Objects.equals(getIdUsuFac(), that.getIdUsuFac());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "idUsuFac = " + idUsuFac + ")";
    }
}

