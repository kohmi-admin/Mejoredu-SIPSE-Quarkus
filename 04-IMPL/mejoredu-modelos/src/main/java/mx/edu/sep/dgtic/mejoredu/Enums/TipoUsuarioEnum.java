package mx.edu.sep.dgtic.mejoredu.Enums;

import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum TipoUsuarioEnum {
	SUPERUSUARIO(1, "Super usuario"), ADMINISTRADOR(2, "Administrador"), ENLACE(4, "Enlace"),
	SUPERVISOR(5, "Supervisor"), PLANEACION(6, "Planeacion"), PRESUPUESTO(7, "Presupuesto"), CONSULTOR(3, "Consultor");

  private static Map<Integer, TipoUsuarioEnum> idToEnum;

  static {
    TipoUsuarioEnum.idToEnum = Stream.of(values()).collect(Collectors.toMap(TipoUsuarioEnum::getIdTipoUsuario, Function.identity()));
  }

  public static TipoUsuarioEnum fromValue(int id) {
    return idToEnum.get(id);
  }

  private final int idTipoUsuario;
  private final String cdTipoUsuario;

  TipoUsuarioEnum(int pIdTipoUsuario, String pCdTipoUsuario) {
    this.idTipoUsuario = pIdTipoUsuario;
    this.cdTipoUsuario = pCdTipoUsuario;
  }

  public int getIdTipoUsuario() {
    return idTipoUsuario;
  }

  public String getCdTipoUsuario() {
    return cdTipoUsuario;
  }
}
