package mx.sep.dgtic.mejoredu.seguimiento.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Entity
@Table(name = "met_ficha_indicadores")
public class FichaIndicadores {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_ficha_indicadores", nullable = false)
	private Integer idFichaIndicadores;
	@Column(name = "cx_nombre_indicador")
	private String cxNombreIndicador;
	@Column(name = "id_dimension")
	private Integer idDimension;
	@Column(name = "id_tipo_indicador")
	private Integer idTipoIndicador;
	@Column(name = "cx_definicion_indicador")
	private String cxDefinicionIndicador;
	@Column(name = "cx_metodo_calculo_indicador")
	private String cxMetodoCalculoIndicador;
	@Column(name = "id_unidad_medida")
	private Integer idUnidadMedida;
	@Column(name = "cx_describir_unidad_medida")
	private String cxUnidadMedidaDescubrir;
	@Column(name = "cx_unidad_absoluta")
	private String cxUnidadAbsoluta;
	@Column(name = "id_tipo_medicion")
	private Integer idTipoMedicion;
	@Column(name = "cx_describir_tipo_medicion")
	private String cxDescubrirTipoMedicion;
	@Column(name = "id_frecuencia_medicion")
	private Integer idFrecuenciaMedicion;
	@Column(name = "cx_describir_frecuencia_medicion")
	private String cxDescubrirFrecuenciaMedicion;
	@Column(name = "cx_numerador")
	private String cxNumerador;
	@Column(name = "cx_denominador")
	private String cxDenominador;
	@Column(name = "cx_meta")
	private String cxMeta;
	@Column(name = "cx_valor_base")
	private String cxValorBase;
	@Column(name = "id_anhio_base")
	private Integer idAnhioBase;
	@Column(name = "cx_periodo_base")
	private String cxPeriodoBase;
	@Column(name = "cx_valor_meta")
	private String cxValorMeta;
	@Column(name = "id_anhio_meta")
	private Integer idAnhioMeta;
	@Column(name = "cx_periodo_meta")
	private String cxPeriodoMeta;
	@Column(name = "cx_medio_verificacion")
	private String cxMedioVerificacion;
	@Column(name = "cx_nombre_variable")
	private String cxNombreVariable;
	@Column(name = "cx_descripcion_variable")
	private String cxDescripcionVariable;
	@Column(name = "cx_fuente_informacion")
	private String cxFuenteInformacion;
	@Column(name = "cx_unidad_medida")
	private String cxUnidadMedida;
	@Column(name = "cx_frecuencia_medicion")
	private String cxFrecuenciaMedicion;
	@Column(name = "cx_metodo_recoleccion")
	private String cxMetodoRecoleccion;
	@Column(name = "id_comportamiento_indicador")
	private Integer idComportamientoIndicador;
	@Column(name = "id_comportamiento_medicion")
	private Integer idComportamientoMedicion;
	@Column(name = "id_tipo_valor")
	private Integer idTipoValor;
	@Column(name = "id_desagregacion_geografica")
	private Integer idDesagregacionGeografica;
	@Column(name = "cx_descripcion_vinculacion")
	private String cxDescripcionVinculacion;

	@Column(name = "id_validacion")
	private Integer idValidacion;
	@Column(name = "id_validacion_planeacion")
	private Integer idValidacionPlaneacion;
	@Column(name = "id_validacion_supervisor")
	private Integer idValidacionSupervisor;
	@OneToMany(mappedBy = "fichaIndicadores")
    private List<PresupuestalJustificacion> presupuestalJustificacion;
}
