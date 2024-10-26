package mx.sep.dgtic.mejoredu.cortoplazo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.inject.Inject;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.sep.dgtic.mejoredu.cortoplazo.service.ProyectoAnualService;

@RestController
@RequestMapping("/api/alfresco")
public class AlfrescoController {

	@Inject
	private ProyectoAnualService proyectoAnualService;

	@GetMapping("pdf/{uuid}")
	public MensajePersonalizado<String> gerPDF(@PathVariable String uuid) {
		return new MensajePersonalizado<>("200", "Archivo convertido con éxito, se deja en alfresco con UUID:",
				proyectoAnualService.getUiidPdfAlfresco(uuid));
	}

}
