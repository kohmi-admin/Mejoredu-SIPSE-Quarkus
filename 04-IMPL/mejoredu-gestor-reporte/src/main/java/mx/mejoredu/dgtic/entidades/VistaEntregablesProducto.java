package mx.mejoredu.dgtic.entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

import java.io.Serializable;


@Data
@Entity(name = "vt_entregable_producto")
public class VistaEntregablesProducto implements Serializable {
	@Column(name = "id_anhio")
	private Integer idAnhio;
	@Column(name = "id_proyecto")
	private Integer idProyecto;
	@Column(name = "cve_proyecto")
	private String cveProyecto;
	@Column(name = "cve_unidad")
	private String cveUnidad;
	@Column(name = "id_catalogo_unidad")
	private Integer idCatalogoUnidad;
	@Column(name = "cve_usuario")
	private String cveUsuario;
	@Column(name = "cx_nombre_proyecto")
	private String cxNombreProyecto;
	@Column(name = "id_actividad")
	private Integer idActividad;
	@Column(name = "id_producto")
	private Integer idProducto;
	@Column(name = "id_catalogo_categorizacion")
	private Integer idCatalogoCategorizacion;
	@Column(name = "id_catalogo_tipo_producto")
	private Integer idCatalgoTipoProducto;
	@Id
	@Column(name = "id_prodcal")
	private Integer idProdcal;
	@Column(name = "ci_monto")
	private Integer ciMonto;
	@Column(name = "ci_mes")
	private Integer ciMes;

}
