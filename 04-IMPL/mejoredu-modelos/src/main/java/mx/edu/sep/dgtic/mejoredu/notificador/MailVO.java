package mx.edu.sep.dgtic.mejoredu.notificador;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MailVO {

	private String asunto;
	private String cuerpo;
	private List<String> correos;
	
}
