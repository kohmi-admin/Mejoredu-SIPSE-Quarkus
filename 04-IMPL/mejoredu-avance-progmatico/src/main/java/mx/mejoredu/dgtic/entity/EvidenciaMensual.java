package mx.mejoredu.dgtic.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "met_evidencia_mensual")
public class EvidenciaMensual {

	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	@Column(name = "id_evidencia_mensual", nullable = false)
	private int idEvidenciaMensual;
	@Column(name = "cs_estatus", nullable = true, length = 1)
	private String estatus;
	@Column(name = "cx_justificacion", nullable = true, length = 90)
	private String justificacion;
	@Column(name = "cx_descripcion_tareas", nullable = true, length = 90)
	private String descripcionTareas;
	@Column(name = "cx_descripcion_producto", nullable = true, length = 90)
	private String descripcionProducto;

	@OneToOne(mappedBy = "evidenciaMensual")
	private Avance avance;

	@OneToMany(mappedBy = "evidenciaMensual")
	private List<EvidenciaDocumento> evidenciaDocumentos = new ArrayList<>();

}
