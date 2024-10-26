package mx.edu.sep.dgtic.mejoredu.seguimiento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class calendarioProductosEntregados {
    private Integer mes;
    private Integer productosEntregados;
}
