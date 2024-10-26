package mx.sep.dgtic.mejoredu.seguimiento.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActividadJasper {

	private List<ActividadOldJasper> actividadOldJaspers;
	private List<ActividadOldJasper> actividadAltaJaspers;
	private List<ActividadNewJasper> actividadNewJaspers;
}
