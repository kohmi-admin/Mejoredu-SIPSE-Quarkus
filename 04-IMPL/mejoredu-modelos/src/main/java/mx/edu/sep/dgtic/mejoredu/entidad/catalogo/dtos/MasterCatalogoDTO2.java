package mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@RegisterForReflection
public class MasterCatalogoDTO2 {
  public Integer idCatalogo;
  public String cdOpcion;
  public String ccExterna;
  public String ccExternaDos;
  public String cdDescripcionDos;
  public Integer idCatalgoPadre;
  public LocalDate dfBaja;
  public List<MasterCatalogoDTO2> registros;

}