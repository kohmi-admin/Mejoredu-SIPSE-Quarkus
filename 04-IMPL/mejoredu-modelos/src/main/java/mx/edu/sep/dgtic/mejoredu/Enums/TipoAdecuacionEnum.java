package mx.edu.sep.dgtic.mejoredu.Enums;

import java.util.Map;

public enum TipoAdecuacionEnum {

	PROGRAMATICA(2217, "Programatica"), 
	PROGRAMATICA_PRESUPUESTAL(2218, "Programatica Presupuestal"), 
	PRESUPUESTAL(2219, "Presupuestal");

	private final int idTipoAdecuacion;
	private final String tipoAdecuacion;

	private static Map<Integer, TipoApartadoEnum> idToEnum;

	public static TipoApartadoEnum fromValue(int id) {
		return idToEnum.get(id);
	}

	TipoAdecuacionEnum(int idTipoAdecuacion, String Adecuacion) {
		this.idTipoAdecuacion = idTipoAdecuacion;
		this.tipoAdecuacion = Adecuacion;
	}

	public int getIdTipoAdecuacion() {
		return idTipoAdecuacion;
	}

	public String getTipoAdecuacion() {
		return tipoAdecuacion;
	}
	
}
