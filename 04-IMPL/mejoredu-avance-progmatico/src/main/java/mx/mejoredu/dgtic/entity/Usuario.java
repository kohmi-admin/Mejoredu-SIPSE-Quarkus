package mx.mejoredu.dgtic.entity;

import java.sql.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import mx.edu.sep.dgtic.mejoredu.Enums.TipoUsuarioEnum;

@Data
@Entity
@Table(name = "seg_usuario")
public class Usuario {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "cve_usuario", unique = true, nullable = false, length = 45)
    private String cveUsuario;
    @Column(name = "cs_estatus", nullable = false, length = 1)
    private String csEstatus;
    @Column(name = "df_baja", nullable = true)
    private Date dfBaja;
    @Column(name = "LOCK_FLAG", nullable = true)
    private Integer lockFlag;
    @ManyToOne(optional = false)
    @JoinColumn(name = "id_tipo_usuario", nullable = false)
    private TipoUsuario tipoUsuario;

    public boolean hasReadPermission() {
        var enabledRoles = List.of(TipoUsuarioEnum.CONSULTOR.getCdTipoUsuario(), TipoUsuarioEnum.ADMINISTRADOR.getCdTipoUsuario(), TipoUsuarioEnum.SUPERVISOR.getCdTipoUsuario());

        return this.tipoUsuario.getCdTipoUsuario() != null && enabledRoles.contains(this.tipoUsuario.getCdTipoUsuario());
    }
}
