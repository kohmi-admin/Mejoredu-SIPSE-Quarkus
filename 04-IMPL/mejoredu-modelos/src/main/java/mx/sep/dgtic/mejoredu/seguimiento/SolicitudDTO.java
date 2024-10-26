package mx.sep.dgtic.mejoredu.seguimiento;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SolicitudDTO {

	private Integer idSolicitud;
	private Integer anhioId;
	private String anhio;
	private String folioSolicitud;
	private String folioSIF;
	private LocalDate fechaSolicitud;
	private Integer unidadId;
	private String unidad;
	private Integer direccionId;
	private Integer adecuacionId;
	private String tipoAdecuacion;
	private Integer modificacionId;
	private String tipoModificacion;
	private String justificacion;
	private String objetivo;
	private Integer estatusId;
	private String estatus;	
	private Integer estatusIdPlaneacion;
	private String estatusPlaneacion;
	private LocalDate fechaAutorizacion;
	private Double montoAplicacion;
	private String usuario;
	private String cxUUID;
	private Integer ixFolioSecuencia;
	private Integer ibExisteInfo;
	private List<HistoricoSolicitud> historicoSolicitud;

	private List<AdecuacionDTO> adecuaciones = new ArrayList<>();
	private Boolean cambiaIndicadores;

	@Data
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class IdSolicitud {
		private Integer idSolicitud;
	}
}
