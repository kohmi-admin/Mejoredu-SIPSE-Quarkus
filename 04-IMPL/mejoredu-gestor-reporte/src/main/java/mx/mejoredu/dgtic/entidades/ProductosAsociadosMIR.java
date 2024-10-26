package mx.mejoredu.dgtic.entidades;


import jakarta.persistence.*;
import org.hibernate.Hibernate;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Entity
@Table(name = "vt_productos_asociados_mir")
public class ProductosAsociadosMIR {
	/**
	 * Primary key.
	 */

	@Id
	@Column(name = "id_producto", unique = true, nullable = false)
	private Integer idProducto;
	@Column(name = "id_catalogo_indicador", nullable = false)
	private Integer idCatalgoIndicador;
	@Column(name = "cc_externa", nullable = false)
	private String ccExterna;
	@Column(name = "id_anhio", nullable = false)
	private Integer idAnhio;
	@Column(name = "id_unidad", nullable = false)
	private Integer idCatalogoUnidad;
	@Column(name = "cs_estatus", nullable = false)
	private String csEstatus;

	public Integer getIdProducto() {
		return idProducto;
	}

	public void setIdProducto(Integer idProducto) {
		this.idProducto = idProducto;
	}

	public Integer getIdCatalgoIndicador() {
		return idCatalgoIndicador;
	}
	public void setIdAnhio(Integer idAnhio) {
		this.idAnhio = idAnhio;
	}

	public Integer getIdAnhio() {
		return idAnhio;
	}
	public void setIdCatalogoUnidad(Integer idCatalogoUnidad) {
		this.idCatalogoUnidad = idCatalogoUnidad;
	}

	public Integer getIdCatalogoUnidad() {
		return idCatalogoUnidad;
	}

	public void setIdCatalgoIndicador(Integer idCatalgoIndicador) {
		this.idCatalgoIndicador = idCatalgoIndicador;
	}

	public String getCcExterna() {
		return ccExterna;
	}

	public void setCcExterna(String ccExterna) {
		this.ccExterna = ccExterna;
	}
	public String getCsEstatus() {
		return csEstatus;
	}

	public void setCsEstatus(String csEstatus) {
		this.csEstatus = csEstatus;
	}
}
