package mx.mejoredu.dgtic.entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name ="vt_paa_aprobado")
public class PAAAprobado {
	@Id
	@Column(name="id")
	private Integer id;
	@Column(name="id_anhio")
	private Integer idAnhio;
	@Column(name="origen")
	private String cxOrigen;
	@Column(name="cve_unidad")
	private String cveUnidad;
	@Column(name="cve_proyecto")
	private String cveProyecto;
	@Column(name="cx_nombre_proyecto")
	private String nombreProyecto;
	@Column(name="cve_actividad")
	private String cveActividad;
	@Column(name="cx_nombre_actividad")
	private String nombreActividad;
	@Column(name="cve_producto")
	private String cveProducto;
	@Column(name="cx_nombre")
	private String nombreProducto;
	@Column(name="categoria")
	private String nombreCategoria;
	@Column(name="tipo")
	private String nombreTipo;
	@Column(name="mes")
	private String mes;
	@Column(name="entregable")
	private String entregable;
	
}
