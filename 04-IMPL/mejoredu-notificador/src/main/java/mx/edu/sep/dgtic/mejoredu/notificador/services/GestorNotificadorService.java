package mx.edu.sep.dgtic.mejoredu.notificador.services;


import java.util.List;

public interface GestorNotificadorService {

   void enviandoCuentasDeCorreo(List<String> correo, String asunto, String cuerpo);
}
