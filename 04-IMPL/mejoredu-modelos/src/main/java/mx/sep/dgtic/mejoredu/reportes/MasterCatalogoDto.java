package mx.sep.dgtic.mejoredu.reportes;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@RegisterForReflection
public class MasterCatalogoDto {
    public int idCatalogo;
    public String cdOpcion;
    public String ccExterna;
    public String ccExternaDos;
    public String cdDescripcionDos;
    public LocalDate dfBaja;
    
}