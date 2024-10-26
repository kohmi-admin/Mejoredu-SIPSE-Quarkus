package mx.sep.dgtic.mejoredu.cortoplazo.service;

import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.*;

import java.util.List;

public interface ProductoService {


	List<ProductoVO> consultaPorActividad(int idActividad);
	ProductoVO consultarPorId(int idProducto);
	void registrar(PeticionProducto peticion);
	void modificar(int idProducto, PeticionProducto peticion);
	void eliminar(int idProducto);
}
