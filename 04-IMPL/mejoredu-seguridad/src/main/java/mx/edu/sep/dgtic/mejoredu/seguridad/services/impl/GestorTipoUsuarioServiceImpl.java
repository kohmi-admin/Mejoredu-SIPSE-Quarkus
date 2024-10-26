package mx.edu.sep.dgtic.mejoredu.seguridad.services.impl;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.seguridad.daos.TipoUsuarioRepository;
import mx.edu.sep.dgtic.mejoredu.seguridad.daos.UsuarioRepository;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.TipoUsuario;
import mx.edu.sep.dgtic.mejoredu.seguridad.services.GestorTipoUsuarioService;
import mx.sep.dgtic.mejoredu.seguridad.PeticionUsuario;
import mx.sep.dgtic.mejoredu.seguridad.TipoUsuarioVO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class GestorTipoUsuarioServiceImpl implements GestorTipoUsuarioService {

    @Inject
    UsuarioRepository usuarioRepository;

    @Inject
    TipoUsuarioRepository tipoUsuarioRepository;

    @Override
    @Transactional
    public List<TipoUsuarioVO> consultarTodo() {

        TipoUsuarioVO tipoUsuarioVO = new TipoUsuarioVO();
        List<TipoUsuarioVO> listatipo = new ArrayList<>();
        List<TipoUsuario> lista = tipoUsuarioRepository.findByEstatus("A");

        for (TipoUsuario tipoUsuario : lista) {
            if (tipoUsuario.getCdTipoUsuario() != null) {
                TipoUsuarioVO tipoUsuarioVO1 = new TipoUsuarioVO();
                tipoUsuarioVO1.setIdTipoUsuario(tipoUsuario.getIdTipoUsuario());
                tipoUsuarioVO1.setCdtipoUsuario(tipoUsuario.getCdTipoUsuario());
                tipoUsuarioVO1.setCsEstatus(tipoUsuario.getCsEstatus());
                tipoUsuarioVO1.setIdBitacora(tipoUsuario.getIdBitacora());
                listatipo.add(tipoUsuarioVO1);
            }

        }
        return listatipo;
    }

    @Override
    public MensajePersonalizado<TipoUsuarioVO> consultarPorId(int id) {
        MensajePersonalizado<TipoUsuarioVO> respuesta = new MensajePersonalizado<TipoUsuarioVO>("404", "No existe el tipo de usuario con id "+id , null);
        TipoUsuarioVO tipoUsuarioVO = new TipoUsuarioVO();
        TipoUsuario lista = tipoUsuarioRepository.find("csEstatus = 'A' and idTipoUsuario = ?1", id).firstResult();
        if (lista == null) {
            return respuesta;
        }else {

            tipoUsuarioVO.setIdTipoUsuario(lista.getIdTipoUsuario());
            tipoUsuarioVO.setCdtipoUsuario(lista.getCdTipoUsuario());
            tipoUsuarioVO.setCsEstatus(lista.getCsEstatus());
            tipoUsuarioVO.setIdBitacora(lista.getIdBitacora());
            respuesta.setCodigo("200");
            respuesta.setMensaje("Exitoso");
            respuesta.setRespuesta(tipoUsuarioVO);
            return respuesta;
        }
    }


    @Transactional
    public RespuestaGenerica modificar(int id, TipoUsuarioVO peticion) {
        TipoUsuarioVO tipoUsuarioVO = new TipoUsuarioVO();
        TipoUsuario entidadExistente = tipoUsuarioRepository.findById(id);
        if (entidadExistente != null) {
            entidadExistente.setCdTipoUsuario(peticion.getCdtipoUsuario());
            entidadExistente.setCsEstatus(peticion.getCsEstatus());
            entidadExistente.setIdBitacora(peticion.getIdBitacora());

            tipoUsuarioRepository.persist(entidadExistente);

            tipoUsuarioVO.setIdTipoUsuario(entidadExistente.getIdTipoUsuario());
            tipoUsuarioVO.setCdtipoUsuario(entidadExistente.getCdTipoUsuario());
            tipoUsuarioVO.setCsEstatus(entidadExistente.getCsEstatus());
            tipoUsuarioVO.setIdBitacora(entidadExistente.getIdBitacora());
            return new RespuestaGenerica("200", "El registro se modifico con exito");
        } else {
            throw new NotFoundException("Tipo de usuario no encontrado con ID: " + id);
        }
    }

    @Override
    @Transactional
    public RespuestaGenerica eliminar(int id) {
        TipoUsuario tipoUsuario = tipoUsuarioRepository.findById(id);
        if (tipoUsuario != null) {
            String estatus = "B";
            tipoUsuarioRepository.update("csEstatus = ?1 WHERE idTipoUsuario = ?2" , estatus,tipoUsuario.getIdTipoUsuario());
            return new RespuestaGenerica("200", "Se a eliminado");
        } else {
            throw new NoSuchElementException("Tipo de usuario no encontrado con ID: " + id);
        }

    }

    @Transactional
    public RespuestaGenerica registrar(TipoUsuarioVO peticion) {

        TipoUsuario tipoUsuario = new TipoUsuario();
        tipoUsuario.setCdTipoUsuario(peticion.getCdtipoUsuario());
        tipoUsuario.setCsEstatus(peticion.getCsEstatus());
        tipoUsuario.setIdBitacora(peticion.getIdBitacora());
        tipoUsuario.setLockFlag(null);

        tipoUsuarioRepository.persistAndFlush(tipoUsuario);

        return new RespuestaGenerica("200", "Exitoso");
    }

}
