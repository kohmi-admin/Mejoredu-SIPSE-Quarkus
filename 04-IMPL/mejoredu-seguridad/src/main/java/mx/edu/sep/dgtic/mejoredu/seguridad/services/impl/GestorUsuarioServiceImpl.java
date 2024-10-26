package mx.edu.sep.dgtic.mejoredu.seguridad.services.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import mx.edu.sep.dgtic.mejoredu.seguridad.daos.ContrasenhiaRepository;
import mx.edu.sep.dgtic.mejoredu.seguridad.daos.PersonaRepository;
import mx.edu.sep.dgtic.mejoredu.seguridad.daos.TipoUsuarioRepository;
import mx.edu.sep.dgtic.mejoredu.seguridad.daos.UsuarioRepository;
import mx.edu.sep.dgtic.mejoredu.seguridad.daos.UsuarioPersonaRepository;
import mx.edu.sep.dgtic.mejoredu.seguridad.daos.PerfilLaboralRepository;
import mx.edu.sep.dgtic.mejoredu.seguridad.daos.MasterCatalogoRepository;
import mx.edu.sep.dgtic.mejoredu.seguridad.entidades.*;
import org.springframework.stereotype.Service;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import mx.edu.sep.dgtic.mejoredu.Enums.EstatusEnum;
import mx.edu.sep.dgtic.mejoredu.comun.MensajePersonalizado;
import mx.edu.sep.dgtic.mejoredu.comun.RespuestaGenerica;
import mx.edu.sep.dgtic.mejoredu.seguridad.services.IGestorUsuarioService;
import mx.sep.dgtic.mejoredu.seguridad.PeticionUsuario;

@Service
public class GestorUsuarioServiceImpl implements IGestorUsuarioService {

    @Inject
    UsuarioRepository usuarioRepository;
    @Inject
    TipoUsuarioRepository tipoUsuarioRepository;
    @Inject
    ContrasenhiaRepository contrasenhiaRepository;
    @Inject
    PersonaRepository personaRepository;
    @Inject
    UsuarioPersonaRepository usuarioPersonaRepository;
    @Inject
    PerfilLaboralRepository perfilLaboralRepository;
    @Inject
    MasterCatalogoRepository catMasterCatalogoRepository;

    @Override
    @Transactional
    public RespuestaGenerica registrar(PeticionUsuario peticion) {

        Persona persona = new Persona();

        Usuario usuario = new Usuario();
        UsuarioPersona usuarioPersona = new UsuarioPersona();
        PerfilLaboral perfilLaboral = new PerfilLaboral();
        TipoUsuario tipoUsuario = tipoUsuarioRepository.findById(peticion.getRol());



        if (peticion.getCveUsuario() == null) {
        	String strCorreo = "";
        	try{
        		strCorreo = peticion.getCorreo().substring(0, peticion.getCorreo().indexOf("@"));
        	}catch (Exception e) {
        		return new RespuestaGenerica("501", "No es un correo valido.");
			}
        	
            peticion.setCveUsuario(strCorreo);
            //USUARIOS
            usuario.setCveUsuario(peticion.getCveUsuario());

        } else {
            usuario.setCveUsuario(peticion.getCveUsuario());

        }
        usuario.setCsEstatus(peticion.getEstatus());
        usuario.setTipoUsuario(tipoUsuario);
        //PERSONA
        persona.setCxNombreCompleto(peticion.getNombreUsuario());
        persona.setCxSegundoApellido(peticion.getSegundoApellido());
        persona.setCxNombre(peticion.getNombre());
        persona.setCxPrimerApellido(peticion.getPrimerApellido());
        persona.setCxCorreo(peticion.getCorreo());
        persona.setDfFechaNacimiento(LocalDate.now());
        
        List<Contrasenhia> lstContrasenhia = new ArrayList<>();
        Contrasenhia contrasenhia = new Contrasenhia();
        contrasenhia.setCsEstatus("A");
        contrasenhia.setCxPalabraSecreta(peticion.getContrasenhia());
        contrasenhia.setDfFecha(LocalDate.now());
        contrasenhia.setLockFlag(0);
        contrasenhia.setUsuario(usuario);
        contrasenhia.setIxNumeroIntentos(0);
		lstContrasenhia.add(contrasenhia );
		//Contraseña
        usuario.setContrasenhia(lstContrasenhia );

        //USUARIO PERSONA
        usuarioPersona.setPersona(persona);
        usuarioPersona.setUsuario(usuario);
        usuarioPersona.setCsEstatus(peticion.getEstatus());


        //PERFIL LABORAL
        perfilLaboral.setCsStatus(peticion.getEstatus());
        if (peticion.getUnidad() != null && peticion.getDireccion() != null && peticion.getArea() != null){
            CatMasterCatalogo unidad = catMasterCatalogoRepository.findById(peticion.getUnidad());
            CatMasterCatalogo direccion = catMasterCatalogoRepository.findById(peticion.getDireccion());
            perfilLaboral.setCatalogoUnidad(unidad);
            perfilLaboral.setCatalogoDireccion(direccion);
            perfilLaboral.setIdArea(peticion.getArea());

        }else {

        }
        perfilLaboral.setUsuario(usuario);


        //CARGA A BASE DE DATOS
        usuarioRepository.persistAndFlush(usuario);
        personaRepository.persistAndFlush(persona);
        contrasenhiaRepository.persistAndFlush(contrasenhia);
        usuarioPersonaRepository.persistAndFlush(usuarioPersona);
        perfilLaboralRepository.persistAndFlush(perfilLaboral);


        return new RespuestaGenerica("200", "Se a registrado");
    }

    @Override
    public List<PeticionUsuario> consultarTodos() {

        List<Usuario> usuarioList = usuarioRepository.find("csEstatus = ?1",EstatusEnum.ACTIVO.getEstatus()).list();

        List<PeticionUsuario> peticionUsuarioList = new ArrayList<>();

        for (Usuario usuario : usuarioList) {
            UsuarioPersona usuarioPersona = usuarioPersonaRepository.find("usuario.cveUsuario = ?1", usuario.getCveUsuario()).firstResult();
            Persona persona = personaRepository.findById(usuarioPersona.getPersona().getIdPersona());
            PerfilLaboral perfilLaboral = perfilLaboralRepository.find("usuario.cveUsuario = ?1", usuario.getCveUsuario()).firstResult();
            if (perfilLaboral != null) {
                peticionUsuarioList.add(new PeticionUsuario(Optional.ofNullable(usuario.getCveUsuario()).orElse(""), Optional.ofNullable(usuario.getContrasenhia().get(0).getCxPalabraSecreta()).orElse(""),Optional.ofNullable(usuario.getCveUsuario()).orElse(""),
                        Optional.ofNullable(persona.getCxNombre()).orElse(""),Optional.ofNullable(persona.getCxPrimerApellido()).orElse(""),Optional.ofNullable(persona.getCxSegundoApellido()).orElse(""),
                        Optional.ofNullable(persona.getCxCorreo()).orElse(""), Optional.ofNullable(perfilLaboral.getCatalogoUnidad().getIdCatalogo()).orElse(1),
                        Optional.ofNullable(perfilLaboral.getCatalogoDireccion().getIdCatalogo()).orElse(0), Optional.ofNullable(perfilLaboral.getIdArea()).orElse(0),
                        Optional.ofNullable(usuario.getTipoUsuario().getIdTipoUsuario()).orElse(0), Optional.ofNullable(usuario.getCsEstatus()).orElse("") ));
            }else{
                Log.info("No tiene perfil laboral");
            }
        }
        return peticionUsuarioList;
    }
    
    @Override
    public MensajePersonalizado<PeticionUsuario> consultarPorId(String cveUsuario) {
        MensajePersonalizado<PeticionUsuario> respuesta = new MensajePersonalizado<PeticionUsuario>("404", "No existe el usuario "+cveUsuario , null);
    	PeticionUsuario peticionUsuario = new PeticionUsuario();
    	
    	Usuario usuario = usuarioRepository.findById(cveUsuario);
		if (usuario == null || usuario.getCsEstatus().equals("B")) {
			return respuesta;
		}
		
		
        
        usuario.getUsuarioPersona().stream().map(usuarioPersona ->{
        	
        	peticionUsuario.setCveUsuario(usuarioPersona.getUsuario().getCveUsuario());
        	peticionUsuario.setContrasenhia(usuario.getContrasenhia().get(0).getCxPalabraSecreta());
            String nombreCompleto = usuarioPersona.getUsuario().getUsuarioPersona().get(0).getPersona().getCxNombreCompleto();


            String nombreUsuario = Optional.ofNullable(usuarioPersona.getUsuario().getUsuarioPersona().get(0).getPersona().getCxNombre())
                    .orElse(nombreCompleto);
        	peticionUsuario.setNombreUsuario(nombreUsuario);
        	peticionUsuario.setNombre(usuarioPersona.getUsuario().getUsuarioPersona().get(0).getPersona().getCxNombre());
            peticionUsuario.setPrimerApellido(usuarioPersona.getUsuario().getUsuarioPersona().get(0).getPersona().getCxPrimerApellido());
            peticionUsuario.setSegundoApellido(usuarioPersona.getUsuario().getUsuarioPersona().get(0).getPersona().getCxSegundoApellido());
        	
            peticionUsuario.setCorreo(usuarioPersona.getUsuario().getUsuarioPersona().get(0).getPersona().getCxCorreo());
            peticionUsuario.setArea(usuario.getPerfilLaboral().get(0).getIdArea());
            peticionUsuario.setUnidad(usuario.getPerfilLaboral().get(0).getCatalogoUnidad().getIdCatalogo());
            peticionUsuario.setDireccion(usuario.getPerfilLaboral().get(0).getCatalogoDireccion().getIdCatalogo());
            peticionUsuario.setRol(usuario.getTipoUsuario().getIdTipoUsuario());
            peticionUsuario.setEstatus(usuario.getCsEstatus());

        	return peticionUsuario;
        }).forEach(respuesta::setRespuesta);

        respuesta.setCodigo("200");
        respuesta.setMensaje("Exitoso");
		return   respuesta;     
        
    }

    @Override
    @Transactional
    public RespuestaGenerica eliminar(String cveusuario) {
        Usuario usuario = usuarioRepository.findById(cveusuario);
        if (usuario != null) {
            usuarioRepository.update("csEstatus = ?1, dfBaja = ?2 where cveUsuario = ?3",
                    EstatusEnum.BLOQUEADO.getEstatus(),LocalDate.now(), cveusuario);

            //	usuarioRepository.delete(usuario);


            return new RespuestaGenerica("200", "Se elimino el usuario con clave de usuario: " + cveusuario);
        }
        return new RespuestaGenerica("404", "No se pudo eliminar el usuario con cveUsuario:  " + cveusuario + " Puede ser que no exista el registro");
    }

    @Override
    @Transactional
    public RespuestaGenerica modificar(String cveUsuario, PeticionUsuario peticion) {
        UsuarioPersona usuarioPersona = usuarioPersonaRepository.find("usuario.cveUsuario = ?1",cveUsuario).firstResult();
        Persona persona = personaRepository.findById(usuarioPersona.getPersona().getIdPersona());

        TipoUsuario tipoUsuario = tipoUsuarioRepository.findById(peticion.getRol());

        usuarioRepository.update("tipoUsuario = ?1,csEstatus = ?2 where cveUsuario = ?3"
                ,tipoUsuario,peticion.getEstatus(),cveUsuario);
        personaRepository.update("cxNombreCompleto = ?1,cxCorreo = ?2, cxNombre=?3, cxPrimerApellido=?4, cxSegundoApellido=?5 where idPersona = ?6",
                peticion.getNombreUsuario(),peticion.getCorreo(),peticion.getNombre(),peticion.getPrimerApellido(),peticion.getSegundoApellido(),persona.getIdPersona());
        perfilLaboralRepository.update("idArea = ?1,catalogoUnidad.idCatalogo = ?2,catalogoDireccion.idCatalogo = ?3 where usuario.cveUsuario = ?4",
                peticion.getArea(),peticion.getUnidad(),peticion.getDireccion(),cveUsuario);
        contrasenhiaRepository.update("cxPalabraSecreta = ?1 where usuario.cveUsuario = ?2",peticion.getContrasenhia(),cveUsuario);

        return new RespuestaGenerica("200", "Se modifico el registro");

    }


}