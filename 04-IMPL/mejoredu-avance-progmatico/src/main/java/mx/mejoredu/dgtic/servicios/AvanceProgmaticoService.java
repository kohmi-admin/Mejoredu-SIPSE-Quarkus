package mx.mejoredu.dgtic.servicios;


import mx.edu.sep.dgtic.mejoredu.seguimiento.*;
import mx.mejoredu.dgtic.dao.MetasVencidasAdelantadas;

import java.util.List;

public interface AvanceProgmaticoService {
    List<RespuestaAvancesProgramaticosVO> consultarAvances(int anhio);
    void eliminarAvance(int idAvance);
    AvanceProgmatico registrarEntregables(AvanceProgmatico avanceProgmatico);
    RespuestaMetasVencidasAdelantadasVO registrarMetasVencidas(PeticionRegistroMetasExtraordinarias metasVencidas, String cveUsuario);
    RespuestaEvidenciaTrimestralVO registrarEvidenciaTrimestral(RegistroEvidenciaTrimestralVO evidenciaTrimestral, String cveUsuario);
    RespuestaEvidenciaMensualVO registrarEvidenciasMensual(RegistroEvidenciaMensualVO evidenciaMensualVO, String cveUsuario);
    EvidenciaTrimestralVO consultarEvidenciaTrimestral(int idProducto, int trimestre);
    EvidenciaTrimestralVO consultarEvidenciaTrimestral(int idAvance);
    EvidenciaMensualVO consultarEvidenciaMensual(int idProducto, int mes);
    EvidenciaMensualVO consultarEvidenciaMensual(int idAvance);
    AvanceProgmatico consultarEntregables(int idProducto);
}
