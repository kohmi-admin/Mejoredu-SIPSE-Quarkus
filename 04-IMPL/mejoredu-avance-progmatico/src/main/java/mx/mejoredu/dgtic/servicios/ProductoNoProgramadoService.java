package mx.mejoredu.dgtic.servicios;

import mx.edu.sep.dgtic.mejoredu.seguimiento.PeticionProductosNoProgramadosVO;
import mx.edu.sep.dgtic.mejoredu.seguimiento.RespuestaProductosNoProgramadosVO;

public interface ProductoNoProgramadoService {

	RespuestaProductosNoProgramadosVO registrar(PeticionProductosNoProgramadosVO noProgramado, String cveUsuario);
}
