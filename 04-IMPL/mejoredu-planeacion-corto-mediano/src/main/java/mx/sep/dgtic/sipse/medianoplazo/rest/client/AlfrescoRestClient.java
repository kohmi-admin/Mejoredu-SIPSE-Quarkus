package mx.sep.dgtic.sipse.medianoplazo.rest.client;

import org.eclipse.microprofile.config.Config;
import org.eclipse.microprofile.config.ConfigProvider;
import org.eclipse.microprofile.rest.client.annotation.ClientHeaderParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.jboss.resteasy.reactive.MultipartForm;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@RegisterRestClient
@ClientHeaderParam(name = "authorization", value = "{getAuthorization}")
public interface AlfrescoRestClient {

	default String getAuthorization() {
		final Config config = ConfigProvider.getConfig();
		return "Basic " + config.getValue("sipse.alf.authorization", String.class);
	}

	@GET
	@Path("/nodes/{uuid}/content")
	Response getFile(@PathParam("uuid") String uuid);

	@POST
	@Path("/nodes/{nodeId}/children")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	Response createFile(@PathParam("nodeId") String nodeId, @MultipartForm MultipartBody multiBody);

}
