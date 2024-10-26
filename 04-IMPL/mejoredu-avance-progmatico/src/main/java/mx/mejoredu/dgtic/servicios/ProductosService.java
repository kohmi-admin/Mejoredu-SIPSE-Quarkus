package mx.mejoredu.dgtic.servicios;

import mx.edu.sep.dgtic.mejoredu.seguimiento.ProductoEvidenciaVO;

import java.util.List;

public interface ProductosService {
  List<ProductoEvidenciaVO> consultaProductos(int idActividad, Integer trimestre);
  // List<ProductoBaseVO> consultaProductos(int idActividad, int mes);
}
