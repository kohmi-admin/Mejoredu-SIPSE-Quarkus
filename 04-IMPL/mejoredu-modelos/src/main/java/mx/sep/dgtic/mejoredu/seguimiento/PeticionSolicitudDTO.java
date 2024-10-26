package mx.sep.dgtic.mejoredu.seguimiento;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@RegisterForReflection
public class PeticionSolicitudDTO {

    private LocalDate fechaSolicitud;
    private LocalDate fechaAutorizacion;
    private Integer idCatalogoUnidad;
    private Integer idCatalogoAnhio;
    private Integer idCatalogoAdecuacion;
    private List<Integer> idCatalogoModificacion = new ArrayList<>();
    private Integer idCatalogoEstatus;
    private Boolean cambiaIndicadores;
}