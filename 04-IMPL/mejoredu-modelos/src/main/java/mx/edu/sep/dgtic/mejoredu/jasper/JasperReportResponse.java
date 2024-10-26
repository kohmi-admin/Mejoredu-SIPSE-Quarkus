package mx.edu.sep.dgtic.mejoredu.jasper;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JasperReportResponse {

	private String nombreArchivo;
	private byte[] streamByte;
}
