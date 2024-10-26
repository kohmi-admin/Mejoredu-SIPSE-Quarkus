package mx.sep.dgtic.mejoredu.seguridad;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.sep.dgtic.mejoredu.comun.Archivo;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PerfilLaboralVO {
	
	private Integer idPerfilLaboral;
	private String ciNumeroEmpledo;
	private String cxPuesto;
	private String cxTelefonoOficina;
	private String cxExtension;
	private String cxDgAdministracion;
	private String cveUsuario;
	private Integer idCatalogoArea;
	private String csEstatus;
	private String cdNombreUnidad;
	private String cveUnidad;
	private Integer idCatalogoUnidad;
	private Integer ixNivel;
	private Archivo archivoFirma;
}
