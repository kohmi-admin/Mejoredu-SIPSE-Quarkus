package mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MasterCatalogoDTO {
	private Integer idCatalogo;
	private String cdOpcion;
	private String cxExterna;
	private String csEstatus;
	private String cveUsuario;
	private String idCatalogoPadre;
	private String cxDescripcionDos;
	private String cxExternaDos;
	private Integer ixDependencia;


	public MasterCatalogoDTO(int pIdCatalogo, String ccExterna, String cdDescripcion, String csStatus, String cveUsuario, String cxDescripcionDos) {
		this.idCatalogo = pIdCatalogo;
		this.cxExterna = ccExterna;
		this.cdOpcion = cdDescripcion;
		this.cxDescripcionDos = cxDescripcionDos;

		this.csEstatus = csStatus;
		this.cveUsuario = cveUsuario;
		
	}
	
}
