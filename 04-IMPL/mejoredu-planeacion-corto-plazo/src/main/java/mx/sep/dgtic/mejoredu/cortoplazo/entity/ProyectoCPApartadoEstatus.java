package mx.sep.dgtic.mejoredu.cortoplazo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table (name="\"VT_CP_PROYECTO_APARTADO_ESTATUS\"")

public class ProyectoCPApartadoEstatus {
		
	@Id
	@Column(name="id_secuencia")
	private Integer id;
	
	@Column(name="id_proyecto")
	private Integer idProyecto;
	
	@Column(name="idLlave")
	private Integer idLlave;
	
	@Column(name="apartado")
	private String apartada;
	
	@Column(name="cs_estatus")
	private String csEstatus;
	
}
