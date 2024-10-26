package mx.edu.sep.dgtic.mejoredu.catalogos.servicios.impl;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import mx.edu.sep.dgtic.mejoredu.catalogos.daos.MasterCatalogoRepositorio;
import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.MasterCatalogoDto;
import mx.edu.sep.dgtic.mejoredu.catalogos.dtos.PeticionCatalogoDireccion;
import mx.edu.sep.dgtic.mejoredu.catalogos.entidades.MasterCatalogo;
import mx.edu.sep.dgtic.mejoredu.catalogos.servicios.GestorDireccionesService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class GestorDireccionesServiceImpl implements GestorDireccionesService {

	private static final int DIRECCION = 2226;
	@Inject
	MasterCatalogoRepositorio masterCatalogoRepositorio;
	@Override
	@Transactional
	public MasterCatalogo agregarDireccion(PeticionCatalogoDireccion peticion) {
		MasterCatalogo direccionNueva = new MasterCatalogo();
		direccionNueva.setCdOpcion(peticion.getCdOpcion());
		direccionNueva.setCveUsuario(peticion.getCveUsuario());
		direccionNueva.setCcExterna(peticion.getCcExterna());
		direccionNueva.setCcExternados(peticion.getCcExternaDos());
		direccionNueva.setIdCatalogoPadre(masterCatalogoRepositorio.findById((long) DIRECCION));
		masterCatalogoRepositorio.persistAndFlush(direccionNueva);
		return direccionNueva;
	}

	@Override
	public List<MasterCatalogo> listarDirecciones() {
		List<MasterCatalogo> direcciones = masterCatalogoRepositorio.find("idCatalogoPadre.idCatalogo = ?1 and dfBaja is null", DIRECCION).list();
		return direcciones;
	}

	@Override
	public MasterCatalogo listarDireccionesPorId(Integer id) {
		MasterCatalogo direccion = masterCatalogoRepositorio.findById((long) id);
		return direccion;
	}

	@Override
	@Transactional
	public MasterCatalogo actualizarDirecciones(Integer id, PeticionCatalogoDireccion peticion) {
		Optional<MasterCatalogo> direccion = Optional.ofNullable(masterCatalogoRepositorio.findById((long) id));
		if (direccion.isPresent()) {
			MasterCatalogo direccionNueva = direccion.get();
			direccionNueva.setCdOpcion(Optional.ofNullable(peticion.getCdOpcion()).orElse(direccion.get().getCdOpcion()));
			direccionNueva.setCveUsuario(Optional.ofNullable(peticion.getCveUsuario()).orElse(direccion.get().getCveUsuario()));
			direccionNueva.setCcExterna(Optional.ofNullable(peticion.getCcExterna()).orElse(direccion.get().getCcExterna()));
			direccionNueva.setCcExternados(Optional.ofNullable(peticion.getCcExternaDos()).orElse(direccion.get().getCcExternados()));
			masterCatalogoRepositorio.persistAndFlush(direccionNueva);
			return direccionNueva;
		}else {
			return null;
		}
	}

	@Override
	@Transactional
	public MasterCatalogo eliminarDirecciones(Integer id) {
		MasterCatalogo direccion = masterCatalogoRepositorio.findById((long) id);
		direccion.setDfBaja(LocalDate.now());
		masterCatalogoRepositorio.persistAndFlush(direccion);
		return direccion;
	}
}
