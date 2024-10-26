package mx.sep.dgtic.mejoredu.seguridad;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RolVO {
  private String cveFacultad;

  public String getCveFacultad() {
    return cveFacultad;
  }

  public void setCveFacultad(String cveFacultad) {
    this.cveFacultad = cveFacultad;
  }

}
