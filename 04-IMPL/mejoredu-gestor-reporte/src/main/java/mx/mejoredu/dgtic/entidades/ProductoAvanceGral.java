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
@Table(name = "vt_avance_producto_anhio_unidad")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ProductoAvanceGral {
	/**
	 * Primary key.
	 * 
	 */
	protected static final String PK = "id_avance";
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_avance", unique = true, nullable = false)
	private Integer idAvance;
	@Column(name = "id_anhio", nullable = false)
	private Integer idAnhio;
	@Column(name = "id_catalogo_unidad", nullable = false)
	private Integer idCatalogoUnidad;

	@Column(name = "nocumplido", nullable = false)
	private Integer nocumplido;
	@Column(name = "parcialcumplido", nullable = false)
	private Integer parcialcumplido;
	@Column(name = "cumplido", nullable = false)
	private Integer cumplido;
	@Column(name = "superado", nullable = false)
	private Integer superado;
}
