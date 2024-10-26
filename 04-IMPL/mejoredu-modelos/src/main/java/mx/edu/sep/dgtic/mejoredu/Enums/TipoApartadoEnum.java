package mx.edu.sep.dgtic.mejoredu.Enums;

import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum TipoApartadoEnum {
	PROYECTO(2217, "Proyecto"), ACTIVIDAD(2218, "Actividades"), 
	PRODUCTO(2219, "Productos"), ACCION(2220, "Acciones"),
	PRESUPUESTO(2221, "Presupuesto");

	private final int idTipoApartado;
	private final String tipoApartado;

	private static Map<Integer, TipoApartadoEnum> idToEnum;

	static {
		TipoApartadoEnum.idToEnum = Stream.of(values())
				.collect(Collectors.toMap(TipoApartadoEnum::getIdTipoApartado, Function.identity()));
	}

	public static TipoApartadoEnum fromValue(int id) {
		return idToEnum.get(id);
	}

	TipoApartadoEnum(int idTipoApartado, String tipoApartado) {
		this.idTipoApartado = idTipoApartado;
		this.tipoApartado = tipoApartado;
	}

	public int getIdTipoApartado() {
		return idTipoApartado;
	}

	public String getTipoApartado() {
		return tipoApartado;
	}

}
