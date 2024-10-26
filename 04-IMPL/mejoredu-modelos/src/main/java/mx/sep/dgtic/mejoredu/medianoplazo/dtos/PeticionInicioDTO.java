package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeticionInicioDTO {
	private String nombre;
	private Integer alineacion;
	private String analisis;
	private String problemas;
	private String usuario;
	private String estatus;

	private Integer anhioPlaneacion;
}
