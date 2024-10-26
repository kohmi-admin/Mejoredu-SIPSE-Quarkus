package mx.mejoredu.dgtic.entidades;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vt_producto_avance_trimestre")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ProductoAvanceTrimestre {
	/**
	 * Primary key.
	 * 
	 */
	protected static final String PK = "idProdcal";
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_prodcal", unique = true, nullable = false)
	private Integer idProdcal;
	
	@Column(name = "id_anhio", nullable = false)
	private Integer idAnhio;
	@Column(name = "id_catalogo_unidad", nullable = false)
	private Integer idCatalogoUnidad;
	@Column(name = "id_proyecto", nullable = false)
	private Integer idProyecto;
	@Column(name = "id_actividad", nullable = false)
	private Integer idActividad;
	@Column(name = "id_producto", nullable = false)
	private Integer idProducto;
	@Column(name = "ixtrimestre",nullable = false)
	private Integer ixTrimestre;

	@Column(name = "avanzadosTri", nullable = false)
	private String avanzadosTri;
	@Column(name = "entregablesTri", nullable = false)
	private Integer entregablesTri;

	@Column(name = "nocumplido", nullable = false)
	private Boolean nocumplido;
	@Column(name = "parcialcumplido", nullable = false)
	private Boolean parcialcumplido;
	@Column(name = "cumplido", nullable = false)
	private Boolean cumplido;
	@Column(name = "superado", nullable = false)
	private Boolean superado;
}
