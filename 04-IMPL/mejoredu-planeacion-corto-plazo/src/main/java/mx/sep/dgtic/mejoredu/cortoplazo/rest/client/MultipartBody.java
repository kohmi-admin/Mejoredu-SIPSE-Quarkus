package mx.sep.dgtic.mejoredu.cortoplazo.rest.client;

import java.io.InputStream;

import org.jboss.resteasy.reactive.PartType;

import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.core.MediaType;

public class MultipartBody {

	@FormParam("filedata")
	@PartType(MediaType.APPLICATION_OCTET_STREAM)
	public InputStream filedata;
	@FormParam("name")
	@PartType(MediaType.TEXT_PLAIN)
	public String name;
	@FormParam("autoRename")
	@PartType(MediaType.TEXT_PLAIN)
	public boolean autoRename;
//	@FormParam("versioningEnabled")
//	@PartType(MediaType.TEXT_PLAIN)
//	public boolean versioningEnabled;
}
