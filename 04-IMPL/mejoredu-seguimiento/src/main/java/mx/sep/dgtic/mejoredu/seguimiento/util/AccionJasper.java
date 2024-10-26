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
public class AccionJasper {

	private List<AccionOldJasper> accionOldJaspers;
	private List<AccionNewJasper> accionNewJaspers;
}

