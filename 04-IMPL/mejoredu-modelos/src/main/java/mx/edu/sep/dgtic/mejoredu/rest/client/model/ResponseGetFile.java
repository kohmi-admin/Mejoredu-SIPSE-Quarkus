package mx.edu.sep.dgtic.mejoredu.rest.client.model;

import java.io.InputStream;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseGetFile {

	private InputStream inputStream;
	private String fileName;
}
