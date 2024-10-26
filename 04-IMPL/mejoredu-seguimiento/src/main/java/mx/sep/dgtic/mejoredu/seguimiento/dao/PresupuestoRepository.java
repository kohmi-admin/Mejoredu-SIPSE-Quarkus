package mx.sep.dgtic.mejoredu.seguimiento.dao;

import java.util.List;
import java.util.Optional;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.Presupuesto;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class PresupuestoRepository implements PanacheRepositoryBase<Presupuesto, Integer> {
	@ConfigProperty(name = "solicitud.estatus.aprobado")
	private Integer estatusAprobado;

	public List<Presupuesto> consultarActivosPorProducto(int idProducto) {
		return find("producto.idProducto = ?1 and csEstatus in ('C','I')", idProducto).list();
	}

	public Optional<Presupuesto> consultarPorIdAdecuacionSolicitudAlta(int idAdecuacionSolicitud) {
		return find("adecuacionAccion.idAdecuacionSolicitud = ?1 AND adecuacionAccion.idAccionReferencia IS NULL",
				idAdecuacionSolicitud).firstResultOptional();
	}

	public Optional<Presupuesto> consultarPorIdAdecuacionSolicitudModificacion(int idAdecuacionSolicitud) {
		return find("adecuacionAccion.idAdecuacionSolicitud = ?1 AND adecuacionAccion.idAccionReferencia IS NOT NULL",
				idAdecuacionSolicitud).firstResultOptional();
	}
	
	public Optional<Presupuesto> consultarPorIdAdecuacionSolicitud(int idAdecuacionSolicitud) {
		return find("adecuacionAccion.idAdecuacionSolicitud = ?1",
				idAdecuacionSolicitud).firstResultOptional();
	}

	public List<Presupuesto> consultarAccionPorIdProducto(int idProducto, boolean excluirCortoPlazo, int idSolicitud) {
		if (excluirCortoPlazo) return list("""
			SELECT p FROM Presupuesto p
			
			INNER JOIN p.adecuacionAccion modificacion
				ON modificacion.adecuacionSolicitud.solicitud.idSolicitud = ?2
			LEFT JOIN p.adecuacionAccionReferencia referencia
				ON referencia.adecuacionSolicitud.solicitud.idSolicitud = ?2
			
			LEFT JOIN p.adecuacionPresupuestoReferencia referenciaPresupuesto
				ON referenciaPresupuesto.adecuacionSolicitud.solicitud.idSolicitud = ?2

			WHERE
				p.producto.idProducto = ?1
				AND p.csEstatus IN ('C','I')
			
				AND referencia IS NULL
				AND referenciaPresupuesto IS NULL
			""", idProducto, idSolicitud);

		return list("""
			SELECT p FROM Presupuesto p
			
			LEFT JOIN p.adecuacionAccion modificacion
				ON (
					modificacion.adecuacionSolicitud.solicitud.idSolicitud != ?2
					AND modificacion.adecuacionSolicitud.solicitud.estatusCatalogo.id != ?3
				)
			LEFT JOIN p.adecuacionAccionReferencia referencia
				ON (
					referencia.adecuacionSolicitud.solicitud.idSolicitud = ?2
					OR referencia.adecuacionSolicitud.solicitud.estatusCatalogo.id = ?3
				)
			
			LEFT JOIN p.adecuacionPresupuesto modificacionPresupuesto
				ON (
					modificacionPresupuesto.adecuacionSolicitud.solicitud.idSolicitud != ?2
					AND modificacionPresupuesto.adecuacionSolicitud.solicitud.estatusCatalogo.id != ?3
				)
			LEFT JOIN p.adecuacionPresupuestoReferencia referenciaPresupuesto
				ON (
					referenciaPresupuesto.adecuacionSolicitud.solicitud.idSolicitud = ?2
					OR referenciaPresupuesto.adecuacionSolicitud.solicitud.estatusCatalogo.id = ?3
				)
			
			WHERE
				p.producto.idProducto = ?1
				AND p.csEstatus IN ('C','I')
			
				AND modificacion IS NULL
				AND referencia IS NULL
				AND modificacionPresupuesto IS NULL
				AND referenciaPresupuesto IS NULL
			""", idProducto, idSolicitud, estatusAprobado);
	}

	public List<Presupuesto> consultarPresupuestoPorIdProducto(int idProducto, boolean excluirCortoPlazo, int idSolicitud) {
		if (excluirCortoPlazo) return list("""
			SELECT p FROM Presupuesto p
			
			INNER JOIN p.adecuacionPresupuesto modificacion
				ON modificacion.adecuacionSolicitud.solicitud.idSolicitud = ?2
			LEFT JOIN p.adecuacionPresupuestoReferencia referencia
				ON referencia.adecuacionSolicitud.solicitud.idSolicitud = ?2
			
			LEFT JOIN p.adecuacionAccionReferencia referenciaAccion
				ON referenciaAccion.adecuacionSolicitud.solicitud.idSolicitud = ?2
			
			WHERE
				p.producto.idProducto = ?1
				AND p.csEstatus IN ('C','I')
			
				AND referencia IS NULL
				AND referenciaAccion IS NULL
			""", idProducto, idSolicitud);

		return list("""
			SELECT p FROM Presupuesto p
			
			LEFT JOIN p.adecuacionAccion modificacion
				ON (
					modificacion.adecuacionSolicitud.solicitud.idSolicitud != ?2
					AND modificacion.adecuacionSolicitud.solicitud.estatusCatalogo.id != ?3
				)
			LEFT JOIN p.adecuacionAccionReferencia referencia
				ON (
					referencia.adecuacionSolicitud.solicitud.idSolicitud = ?2
					OR referencia.adecuacionSolicitud.solicitud.estatusCatalogo.id = ?3
				)
			
			LEFT JOIN p.adecuacionPresupuesto modificacionPresupuesto
				ON (
					modificacionPresupuesto.adecuacionSolicitud.solicitud.idSolicitud != ?2
					AND modificacionPresupuesto.adecuacionSolicitud.solicitud.estatusCatalogo.id != ?3
				)
			LEFT JOIN p.adecuacionPresupuestoReferencia referenciaPresupuesto
				ON (
					referenciaPresupuesto.adecuacionSolicitud.solicitud.idSolicitud = ?2
					OR referenciaPresupuesto.adecuacionSolicitud.solicitud.estatusCatalogo.id = ?3
				)
			
			WHERE
				p.producto.idProducto = ?1
				AND p.csEstatus IN ('C','I')
			
				AND modificacion IS NULL
				AND referencia IS NULL
				AND modificacionPresupuesto IS NULL
				AND referenciaPresupuesto IS NULL
			""", idProducto, idSolicitud, estatusAprobado);
	}

	public List<Presupuesto> consultarAccionPorIdProducto(int idProducto) {
		return find("producto.idProducto = ?1 and csEstatus != 'B' order by dfPresupuesto, dhPresupuesto", idProducto)
				.list();
	}
}