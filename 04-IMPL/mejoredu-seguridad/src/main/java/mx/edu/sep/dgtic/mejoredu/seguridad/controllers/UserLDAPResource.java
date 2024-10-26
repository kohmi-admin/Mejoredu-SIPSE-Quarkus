package mx.edu.sep.dgtic.mejoredu.seguridad.controllers;

import jakarta.inject.Inject;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import mx.edu.sep.dgtic.mejoredu.seguridad.services.GestorSeguridadService;
import mx.sep.dgtic.mejoredu.seguridad.PeticionAutenticar;
import mx.sep.dgtic.mejoredu.seguridad.RespuestaAutenticar;


import org.springframework.web.bind.annotation.RequestBody;

@Path("/api/seguridad/LDAP")
public class UserLDAPResource {
	
	@Inject
		GestorSeguridadService gestorSeguridad;
	/*@GET
    @RolesAllowed("standardRole")
    @Path("/me")
	
	 * public String me(@Context SecurityContext securityContext) { return
	 * securityContext.getUserPrincipal().getName(); }
	 */
	
	
	@POST
    @Path("/autenticarUsuarioLDAP")
    public RespuestaAutenticar autenticarUsuarioLDAP(@RequestBody PeticionAutenticar peticion) {
			return gestorSeguridad.autenticarUsuarioLDAP(peticion);
    }
}
