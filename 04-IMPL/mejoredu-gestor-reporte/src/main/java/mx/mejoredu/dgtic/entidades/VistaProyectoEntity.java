package mx.mejoredu.dgtic.entidades;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity(name = "vt_estructura")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@ToString
public class VistaProyectoEntity {
	@Id
	@Column(name = "id_estructura", unique = true, nullable = false)
	private Integer idEstructura;
	@Column(name = "df_registro", unique = false, nullable = true)
	private LocalDate dfRegistro;
	@Column(name = "dh_registro", unique = false, nullable = true)
	private LocalTime dhRegistro;
	@Column(name = "cve_usuario", unique = false, nullable = true)
	private String cveUsuario;
	@Column(name = "cd_nombre_programa", unique = false, nullable = true)
	private String cdNombrePrograma;
	@Column(name = "cd_analisis_estado", unique = false, nullable = true)
	private String cdAnalisisEstado;
	@Column(name = "cd_problemas_publicos", unique = false, nullable = true)
	private String cdProblemasPublicos;
	@Column(name = "cs_esatus", unique = false, nullable = true)
	private String csEstatus;
}
