package mx.sep.dgtic.mejoredu.medianoplazo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevisionValidacionDTO {
	private Integer idRevision;
	private Integer idElementoValidar;
	private Integer idValidacion;
	private String cxComentario;
	private Integer ixCheck;
}
