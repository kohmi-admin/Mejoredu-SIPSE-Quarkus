package mx.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.sep.dgtic.mejoredu.cortoplazo.RubricaDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.ArchivoDTO;
import mx.sep.dgtic.mejoredu.medianoplazo.dtos.Revision;

import java.util.ArrayList;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ValidacionDTO {
  private String apartado;
  private Integer id;
  private Integer trimestre;
  private String estatus;
  ArrayList<Revision> revision = new ArrayList<Revision>();
  private String cveUsuario;
  ArrayList<ArchivoDTO> archivos = new ArrayList<ArchivoDTO>();
  ArrayList<mx.sep.dgtic.mejoredu.cortoplazo.RubricaDTO> rubrica = new ArrayList<RubricaDTO>();
}