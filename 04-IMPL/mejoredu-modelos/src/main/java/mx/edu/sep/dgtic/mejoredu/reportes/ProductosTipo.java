package mx.edu.sep.dgtic.mejoredu.reportes;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class ProductosTipo implements Serializable {/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String tipo;
	private Integer cantidad;
}
