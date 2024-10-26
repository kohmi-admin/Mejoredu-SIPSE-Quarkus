package mx.sep.dgtic.mejoredu.seguridad;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
//DTO Data Transfer Object
public class PeticionUsuario {
	private String cveUsuario;
	private String contrasenhia;
	private String nombreUsuario;
	private String nombre;
	private String primerApellido;
	private String segundoApellido;
	private String correo;
	private Integer unidad;
	private Integer direccion;
	private Integer area;
	private Integer rol;
	private String estatus;
}
