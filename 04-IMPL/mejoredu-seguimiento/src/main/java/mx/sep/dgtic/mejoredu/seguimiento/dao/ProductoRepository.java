package mx.sep.dgtic.mejoredu.seguimiento.dao;

import java.util.List;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Producto;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class ProductoRepository implements PanacheRepositoryBase<Producto, Integer> {
	@ConfigProperty(name = "solicitud.estatus.aprobado")
	private Integer estatusAprobado;

	public List<Producto> consultarActivosPorIdActividad(int idActividad) {
		return find("actividad.idActividad = ?1 and csEstatus in ('C','I')", idActividad).list();
	}

	public List<Producto> consultarPorIdActividadSolicitud(int idActividad, boolean excluirCortoPlazo, int idSolicitud) {
		if (excluirCortoPlazo) return list("""
			SELECT p FROM Producto p
			INNER JOIN p.adecuacionProducto modificacion
				ON modificacion.adecuacionSolicitud.solicitud.idSolicitud = ?2
			LEFT JOIN p.adecuacionProductoReferencia referencia
				ON referencia.adecuacionSolicitud.solicitud.idSolicitud = ?2
			WHERE
				p.actividad.idActividad = ?1
				AND p.csEstatus IN ('C','I')
			
				AND referencia IS NULL
			""", idActividad, idSolicitud);

		return list("""
			SELECT p FROM Producto p
			
			LEFT JOIN p.adecuacionProducto modificacion
				ON (
					modificacion.adecuacionSolicitud.solicitud.idSolicitud != ?2
					AND modificacion.adecuacionSolicitud.solicitud.estatusCatalogo.id != ?3
				)
			
			LEFT JOIN p.adecuacionProductoReferencia referencia
				ON (
					referencia.adecuacionSolicitud.solicitud.idSolicitud = ?2
					OR referencia.adecuacionSolicitud.solicitud.estatusCatalogo.id = ?3
				)
			
			WHERE
				p.actividad.idActividad = ?1
				AND p.csEstatus IN ('C','I')
		
				AND modificacion IS NULL
				AND referencia IS NULL
			""", idActividad, idSolicitud, estatusAprobado);
	}

	public List<Producto> consultarProductosActivosPorIdActividad(int idActividad) {
		return find("actividad.idActividad = ?1 and csEstatus != 'B' order by dfProducto, dhProducto", idActividad)
				.list();
	}
}
