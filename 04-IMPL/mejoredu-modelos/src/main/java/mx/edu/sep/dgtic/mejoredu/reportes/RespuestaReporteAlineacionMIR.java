package mx.edu.sep.dgtic.mejoredu.reportes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode

public class RespuestaReporteAlineacionMIR {
	private Integer productosAlineadosMIR;
	private Integer totalProductos;
    private Integer porcentajeAlineadosMIR;
    private List<ProductosAlineadosNivelMIRDTO> productosAlineadosNivelMIR;
    private List<ProductosAlineadosEstatusMIRDTO> ProductosAlineadosEstatusMIRDTOS;
    private List<ProductosAlineadosPorIndicadorMIRDTO> productosAlineadosPorIndicadorMIRDTOS;
}
