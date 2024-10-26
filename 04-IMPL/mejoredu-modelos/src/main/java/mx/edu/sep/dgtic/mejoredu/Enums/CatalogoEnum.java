package mx.edu.sep.dgtic.mejoredu.Enums;


public enum CatalogoEnum {
	ARTICULACION_ACTIVIDAD(1),
	TIPO_PRODUCTO(2);
	
	private int idCatalogo;

	private CatalogoEnum(int idCatalogo) {
		this.idCatalogo = idCatalogo;
	}

	public int getIdCatalogo() {
		return idCatalogo;
	}

	public void setIdCatalogo(int idCatalogo) {
		this.idCatalogo = idCatalogo;
	}
	
	

}
