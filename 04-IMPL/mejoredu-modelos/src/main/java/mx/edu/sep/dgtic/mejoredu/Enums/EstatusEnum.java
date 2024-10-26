package mx.edu.sep.dgtic.mejoredu.Enums;

import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum EstatusEnum {
	ACTIVO("A"),
	INACTIVO("I"), //FMON, SMTO
	COMPLETO("C"), //FMON, SMTO
	BLOQUEADO("B"),//FMON
	FINALIZADO("T"),//FMON, SMTO
	PORREVISAR("P"),//FMON, SMTO
	VALIDACIONTECNICA("V"),//FMON
	ENVALIDACION("E"), //En Revisión presupuesto/planeacion. En validación Supervisor (FMON, SMTO)
	PRIMERAREVISION("1"),//FMON , SMTO
	SEGUNDAREVISION("2"),//FMON, SMTO
	TERCERAREVISION("3"),//FMON, SMTO
	REVISADO("D"),//FMON, SMTO
	RECHAZADO("R"),//FMON, SMTO
	APROBADO("O"),//FMON, SMTO
	FORMALIZADO("L"),//SMTO
	RUBLICA("U"),//SMTO
	CANCELADO("X"),//SMTO
	PARCIALMENTECUMPLIDO("Y"),//SMTO
	SUPERADO("S"),//SMTO
	CUMPLIDO("Z");//SMTO
	private static Map<String, EstatusEnum> nameToValue;
	static {
		EstatusEnum.nameToValue = Stream.of(values()).collect(Collectors.toMap(EstatusEnum::getEstatus, Function.identity()));
	}
	public static EstatusEnum fromValue(String estatus) {
		return nameToValue.get(estatus);
	}
	private String estatus;
	private EstatusEnum (String pStatus){
		this.estatus = pStatus;
	}

	public String getEstatus() {
		return estatus;
	}
}
