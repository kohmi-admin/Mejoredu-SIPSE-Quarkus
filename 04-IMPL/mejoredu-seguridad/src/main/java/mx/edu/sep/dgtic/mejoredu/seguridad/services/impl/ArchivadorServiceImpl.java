package mx.edu.sep.dgtic.mejoredu.seguridad.services.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import mx.edu.sep.dgtic.mejoredu.seguridad.services.ArchivadorService;
import mx.sep.dgtic.mejoredu.seguridad.archivador.ResponseAccesoAlfresco;

@Service
public class ArchivadorServiceImpl implements ArchivadorService{
	
	@Value("${gestor.archivos.alfresco.idToken}")
	private String idToken;

	@Value("${gestor.archivos.alfresco.uuidPlaneacion}")
	private String uuidPlaneacion;
	@Value("${gestor.archivos.alfresco.uuidSeguimiento}")
	private String uuidSeguimiento;
	@Value("${gestor.archivos.alfresco.uuidEvaluacion}")
	private String uuidEvaluacion;
	@Value("${gestor.archivos.alfresco.uuidReportes}")
	private String uuidReportes;
	@Value("${gestor.archivos.alfresco.uuidConfiguracion}")
	private String uuidConfiguracion;
	@Value("${gestor.archivos.alfresco.urlAlfresco}")
	private String urlAlfresco;
	

	@Value("${gestor.archivos.alfresco.uuidDocApoyo}")
	private String uuidDocApoyo;
	@Value("${gestor.archivos.alfresco.uuidAyuda}")
	private String uuidAyuda;
	@Value("${gestor.archivos.alfresco.uuidNormatividad}")
	private String uuidNormatividad;

	
	public ResponseAccesoAlfresco geneAccesoAlfresco() {
		ResponseAccesoAlfresco respuesta = new ResponseAccesoAlfresco();
		respuesta.setCodigo("200");
		respuesta.setMensaje("Exitoso");
		respuesta.setAccessToken(idToken);
		respuesta.setUuidPlaneacion(uuidPlaneacion);
		respuesta.setUuidSeguimiento(uuidSeguimiento);
		respuesta.setUuidEvaluacion(uuidEvaluacion);
		respuesta.setUuidReporte(uuidReportes);
		respuesta.setUuidConfiguracion(uuidConfiguracion);
		
		//Seteando nuevos contenedores de alfresco para links de apoyo
		respuesta.setUuidDocApoyo(uuidDocApoyo);
		respuesta.setUuidAyuda(uuidAyuda);
		respuesta.setUuidNormatividad(uuidNormatividad);
		
		respuesta.setUrlAlfresco(urlAlfresco);
		return respuesta;
	}
}
