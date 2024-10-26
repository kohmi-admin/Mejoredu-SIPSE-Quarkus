package mx.edu.sep.dgtic.mejoredu.Enums;

public enum RespuestaGralEnum {
	
	NOHAYINFORMACION ("No hay información."),
	EXITOSA("Exitosa"),
	ERROR ("Error");
	
	private RespuestaGralEnum (String pMensaje) {
		this.mensaje = pMensaje;
	}
	private String mensaje;
	
	public String getMensaje() {
		return mensaje;
	}

}
