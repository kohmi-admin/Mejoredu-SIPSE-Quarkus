package mx.edu.sep.dgtic.mejoredu.seguridad.services.impl;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.seguridad.daos.PeriodosHabilitacionRepository;
import mx.edu.sep.dgtic.mejoredu.seguridad.daos.TipoUsuarioRepository;
import mx.edu.sep.dgtic.mejoredu.seguridad.daos.UsuarioRepository;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.PeriodoHabilitacion;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.TipoUsuario;
import mx.edu.sep.dgtic.mejoredu.seguridad.services.GestorPeriodoHabilitacionService;
import mx.sep.dgtic.mejoredu.seguridad.PeriodosHabilitacionVO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class GestorPeriodoHabilitacionServiceImpl implements GestorPeriodoHabilitacionService {

    @Inject
    UsuarioRepository usuarioRepository;

    @Inject
    PeriodosHabilitacionRepository periodosHabilitacionRepository;

    @Override
    @Transactional
    public List<PeriodosHabilitacionVO> consultarTodo() {

        PeriodosHabilitacionVO periodosHabilitacionVO = new PeriodosHabilitacionVO();
        List<PeriodosHabilitacionVO> listatipo = new ArrayList<>();
        List<PeriodoHabilitacion> lista = periodosHabilitacionRepository.findByEstatus("A");

        for (PeriodoHabilitacion periodoHabilitacion : lista) {
            if (periodoHabilitacion.getIdPeriodoHabilitacion() != null) {
                PeriodosHabilitacionVO periodosHabilitacionVO1 = new PeriodosHabilitacionVO();
                periodosHabilitacionVO1.setIdPeriodoHabilitacion(periodoHabilitacion.getIdPeriodoHabilitacion());
                periodosHabilitacionVO1.setModulo(periodoHabilitacion.getCxModulo());
                periodosHabilitacionVO1.setSubModulo(periodoHabilitacion.getCxSubmodulo());
                periodosHabilitacionVO1.setOpcion(periodoHabilitacion.getCxOpcion());
                periodosHabilitacionVO1.setFechaInicio(periodoHabilitacion.getDfInicio());
                periodosHabilitacionVO1.setFechaFin(periodoHabilitacion.getDfFinal());
                periodosHabilitacionVO1.setEstatus(periodoHabilitacion.getCsEstatus());
                periodosHabilitacionVO1.setCveUsuario(periodoHabilitacion.getCveUsuario());
                listatipo.add(periodosHabilitacionVO1);
            }
        }
        return listatipo;
    }

    @Override
    public PeriodosHabilitacionVO consultarPorId(int id) {
        PeriodosHabilitacionVO periodosHabilitacionVO = new PeriodosHabilitacionVO();
        PeriodoHabilitacion lista = periodosHabilitacionRepository.findById(id);
        periodosHabilitacionVO.setIdPeriodoHabilitacion(lista.getIdPeriodoHabilitacion());
        periodosHabilitacionVO.setModulo(lista.getCxModulo());
        periodosHabilitacionVO.setSubModulo(lista.getCxSubmodulo());
        periodosHabilitacionVO.setOpcion(lista.getCxOpcion());
        periodosHabilitacionVO.setFechaInicio(lista.getDfInicio());
        periodosHabilitacionVO.setFechaFin(lista.getDfFinal());
        periodosHabilitacionVO.setEstatus(lista.getCsEstatus());
        periodosHabilitacionVO.setCveUsuario(lista.getCveUsuario());
        return periodosHabilitacionVO;
    }


    @Transactional
    public RespuestaGenerica modificar(int id, PeriodosHabilitacionVO peticion) {

        PeriodoHabilitacion entidadExistente = periodosHabilitacionRepository.findById(id);
        if (entidadExistente != null) {
            entidadExistente.setCxModulo(peticion.getModulo());
            entidadExistente.setCxSubmodulo(peticion.getSubModulo());
            entidadExistente.setCxOpcion(peticion.getOpcion());
            entidadExistente.setDfInicio(peticion.getFechaInicio());
            entidadExistente.setDfFinal(peticion.getFechaFin());
            entidadExistente.setCsEstatus(peticion.getEstatus());
            entidadExistente.setCveUsuario(peticion.getCveUsuario());

            periodosHabilitacionRepository.persistAndFlush(entidadExistente);


            return new RespuestaGenerica("200", "El registro se modifico con exito");
        } else {
            throw new NotFoundException("Periodo de habilitacion no encontrado con ID: " + id);
        }
    }

    @Override
    @Transactional
    public RespuestaGenerica eliminar(int id) {
        PeriodoHabilitacion periodoHabilitacion = periodosHabilitacionRepository.findById(id);
        if (periodoHabilitacion != null) {
            String estatus = "B";
            periodosHabilitacionRepository.update("csEstatus = ?1 WHERE idPeriodoHabilitacion = ?2" , estatus,periodoHabilitacion.getIdPeriodoHabilitacion());
            return new RespuestaGenerica("200", "Se a eliminado");
        } else {
            throw new NoSuchElementException("Periodo de habilitacion no encontrado con ID: " + id);
        }

    }

    @Transactional
    public RespuestaGenerica registrar(PeriodosHabilitacionVO peticion) {

        PeriodoHabilitacion periodoHabilitacion = new PeriodoHabilitacion();
        periodoHabilitacion.setCxModulo(peticion.getModulo());
        periodoHabilitacion.setCxSubmodulo(peticion.getSubModulo());
        periodoHabilitacion.setCxOpcion(peticion.getOpcion());
        periodoHabilitacion.setDfInicio(peticion.getFechaInicio());
        periodoHabilitacion.setDfFinal(peticion.getFechaFin());
        periodoHabilitacion.setCsEstatus(peticion.getEstatus());
        periodoHabilitacion.setCveUsuario(peticion.getCveUsuario());

        periodosHabilitacionRepository.persistAndFlush(periodoHabilitacion);

        return new RespuestaGenerica("200", "Exitoso");
    }

}
