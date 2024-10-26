package mx.edu.sep.dgtic.mejoredu.catalogos.dtos;

import java.time.LocalDate;
import java.util.List;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@RegisterForReflection
public class MasterCatalogoDto {
    public int idCatalogo;
    public String cdOpcion;
    public String ccExterna;
    public String ccExternaDos;
    public String cdDescripcionDos;
    public int idCatalgoPadre;
    public LocalDate dfBaja;
    public List<MasterCatalogoDto> registros;
    
}