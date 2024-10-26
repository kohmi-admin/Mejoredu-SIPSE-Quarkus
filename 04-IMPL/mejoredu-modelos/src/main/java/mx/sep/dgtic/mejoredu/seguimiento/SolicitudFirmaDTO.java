package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.ArchivoVO;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SolicitudFirmaDTO {

	private Integer idFirma;
	private String usuario;
	private Integer idSolicitud;
	private ArchivoVO archivo;

}
