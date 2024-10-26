package mx.sep.dgtic.mejoredu.seguimiento;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JustificadorDTO {

	private Integer idJustificador;
	private List<Integer> idProducto;
	private String cxJustificador;
	private String cxCausa;
	private String cxEfecto;
	private String cxOtrosMotivos;
	private String cveUsuario;
	
}
