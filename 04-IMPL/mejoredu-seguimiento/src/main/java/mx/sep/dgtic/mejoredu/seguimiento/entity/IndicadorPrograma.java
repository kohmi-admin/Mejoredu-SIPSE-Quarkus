package mx.sep.dgtic.mejoredu.seguimiento.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "met_indicador_programa")
public class IndicadorPrograma {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_indicador_programa", nullable = false)
	private Integer idIndicadorPrograma;
	@OneToOne
	@JoinColumn(name = "id_ficha_indicadores", updatable = false, insertable = false)
	private FichaIndicadores fichaIndicadores;
	@Column(name = "id_ficha_indicadores")
	private Integer idFichaIndicadores;
	@OneToOne
	@JoinColumn(name = "id_presupuestal", updatable = false, insertable = false)
	private ProgramaPresupuestal presupuestal;
	@Column(name = "id_presupuestal")
	private Integer idPresupuestal;
	@Column(name = "cx_nombre_programa")
	private String cxNombrePrograma;
	@Column(name = "id_vinculacion_ods")
	private Integer idVinculacionOds;
	@Column(name = "id_ramo_sector")
	private Integer idRamoSector;
	@Column(name = "id_unidad_responsable")
	private Integer idUnidadResponsable;

}
