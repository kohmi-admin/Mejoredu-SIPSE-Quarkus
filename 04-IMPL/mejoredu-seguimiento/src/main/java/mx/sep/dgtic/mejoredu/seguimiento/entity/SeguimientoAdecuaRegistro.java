package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="vt_seguimiento_adecua_registro")
public class SeguimientoAdecuaRegistro {
	
	@Id
	private Integer id;
	@Column(name="tipo")
	private String tipo;
	@Column(name="id_solicitud")
	private Integer idSolicitud;
	@Column(name="id_catalogo_modificacion")
	private MasterCatalogo catalogoModificacion;
	@Column(name="id_catalogo_apartado")
	private MasterCatalogo catalogoApartado;
	@Column(name="id_modificacion")
	private Integer idRefModificacion;
	@Column(name="id_referencia")
	private Integer idReferecia;

}
