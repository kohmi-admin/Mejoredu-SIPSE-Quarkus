package mx.mejoredu.dgtic.entity;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "met_producto_calendario")
public class ProductoCalendario {

	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	@Column(name = "id_prodcal", nullable = false)
	private Integer idProdcal;
	@Column(name = "ci_mes", nullable = true)
	private Integer ciMes;
	@Column(name = "ci_monto", nullable = true)
	private Integer ciMonto;
	@Column(name = "ci_entregados", nullable = true)
	private Integer ciEntregados;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_producto", referencedColumnName ="id_producto", updatable = false, insertable = false)
	private Producto producto;
	@Column(name = "id_producto", nullable = false)
	private Integer idProducto;
	@Column(name = "LOCK_FLAG", nullable = true)
	private Integer lockFlag;

	@OneToMany(mappedBy = "productoCalendario")
	private Set<Avance> avances = new HashSet<>();

}
