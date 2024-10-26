package mx.sep.dgtic.sipse.medianoplazo.util;

import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.jasper.JasperReportResponse;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.InicioDTO;
import mx.sep.dgtic.sipse.medianoplazo.daos.EpilogoRepository;
import mx.sep.dgtic.sipse.medianoplazo.servicios.IEstructuraService;
import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.util.JRLoader;

@Component
public class JasperReportManager {

	private static final String REPORT_FOLDER = "classpath:reports/";
	private static final String JASPER = ".jasper";

	@Inject
	private IEstructuraService estructuraService;
	@Inject
	private EpilogoRepository epilogoRepository;

	public JasperReportResponse getItemReport(String fileJasperName, Integer anio) {
		try {
			return JasperReportResponse.builder()
					.streamByte(JasperExportManager.exportReportToPdf(JasperFillManager.fillReport(
							(JasperReport) JRLoader
									.loadObject(ResourceUtils.getFile(REPORT_FOLDER + fileJasperName + JASPER)),
							getParams(anio), new JREmptyDataSource())))
					.nombreArchivo(fileJasperName + "_" + anio).build();
		} catch (FileNotFoundException | JRException e) {
			e.printStackTrace();
		}
		return null;
	}

	private Map<String, Object> getParams(Integer anio) {

		MensajePersonalizado<InicioDTO> response = estructuraService.consultarEstructuraPorAnhio(anio);
		if (!response.getCodigo().equals("200")) {
			throw new NotFoundException("No se encontró estructura para el año: " + anio);
		}
		Log.info("Estructuras :" + response.getRespuesta());

		Map<String, Object> params = new HashMap<>();

		seccionInicio(params, response.getRespuesta());
//		seccionObjetivosEstrategiasAcciones(params, anio);
//		seccionMetasBienestar(params, anio);
//		seccionParametro(params, anio);
		seccionEpilogo(params, response.getRespuesta().getIdPrograma());

		return params;
	}

	private void seccionInicio(Map<String, Object> params, InicioDTO inicio) {
		params.put("nombrePrograma", inicio.getNombrePrograma());
		params.put("analisis", inicio.getAnalisis());
		params.put("programasPublicos", inicio.getProgramasPublicos());
	}

	private void seccionEpilogo(Map<String, Object> params, Integer idPrograma) {
		var epilogo = epilogoRepository.findFirstByEstructura(idPrograma).orElseThrow(() -> {
			throw new NotFoundException("No se encontró el epilogo de la estructura " + idPrograma);
		});
		params.put("epilogo", epilogo.getCxDescripcion());
	}

//	private String getValorCatalogo(MasterCatalogo catalogo) {
//		return catalogo != null ? catalogo.getCdOpcion() : "";
//	}
//
//	private String getValorString(String variable) {
//		return variable != null ? variable : "";
//	}

}
