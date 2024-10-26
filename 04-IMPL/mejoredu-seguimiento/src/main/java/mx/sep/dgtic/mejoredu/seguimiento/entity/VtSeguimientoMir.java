package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "vt_seguimiento_mir")
public class VtSeguimientoMir {

	@EmbeddedId
	private VtSeguimientoMirPK id;
	@Column(name = "id_anhio", nullable = true)
	private Integer idAnhio;
	@Column(name = "\"nivel_MIR\"", nullable = true, length = 45)
	private String nivelMir;
	@Column(name = "indicador", nullable = false, length = 2000)
	private String indicador;
	@Column(name = "id_catalogo_unidad", nullable = false)
	private Long idCatalogoUnidad;
	@Column(name = "unidad_corta", nullable = true, length = 45)
	private String unidadCorta;
	@Column(name = "unidad_larga", nullable = false, length = 2000)
	private String unidadLarga;
	@Column(name = "programado", nullable = true, precision = 0)
	private Integer programado;
	@Column(name = "entregado", nullable = true, precision = 0)
	private Integer entregado;
	@Column(name = "cx_clave")
	private String clave;
}
