package mx.sep.dgtic.sipse.presupuestal.service;

import mx.edu.sep.dgtic.mejoredu.entidad.catalogo.dtos.MasterCatalogoDTO2;
import mx.edu.sep.dgtic.mejoredu.entidad.planeacion.PeticionPorID;
import mx.edu.sep.dgtic.mejoredu.presupuestales.PeticionFichasIndicadoresVO;
import mx.edu.sep.dgtic.mejoredu.presupuestales.mir.PeticionMatrizIndicadoresResultados;
import mx.edu.sep.dgtic.mejoredu.presupuestales.mir.RespuestaMatrizIndicadoresResultados;

import java.util.List;

public interface MatrizIndicadoresResultadosService {
    List<MasterCatalogoDTO2> consultarCatalogoIndicadoresPI(Integer anhio);

    RespuestaMatrizIndicadoresResultados consultaPorId(int id);
    RespuestaMatrizIndicadoresResultados consultaPorAnhio(int anhio);
    void registrar(PeticionMatrizIndicadoresResultados peticion);

    PeticionFichasIndicadoresVO consultarFicha(int idIndicador);
    void registrarFicha(int idIndicador, PeticionFichasIndicadoresVO peticion);
    void finalizarRegistro(PeticionPorID peticionPorID);
    void enviarRevision(PeticionPorID peticionPorID);
    void enviarValidacionTecnica(PeticionPorID peticionPorID);

}
