package mx.mejoredu.dgtic.entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Entity
@Table(name = "vt_producto_categoria")

public class ProyectoPorcategoria {
	@Id
	@Column(name = "id")
	private Integer id;
	@Column(name = "id_anhio")
	private Integer idAnhio;
	@Column(name = "cve_proyecto")	
	private String cveProyecto;
	@Column(name = "id_catalogo_unidad")
	private Integer idCatalogoUnidad;
	@Column(name = "id_catalogo_categorizacion")
	private Integer idCatalogoCategorizacion;
	@Column(name = "cx_totalProducto")
	private Integer cxTotalProducto;
		

}
