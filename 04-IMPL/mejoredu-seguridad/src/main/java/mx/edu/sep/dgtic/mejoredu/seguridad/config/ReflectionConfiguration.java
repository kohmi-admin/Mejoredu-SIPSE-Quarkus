package mx.edu.sep.dgtic.mejoredu.seguridad.config;

import io.quarkus.runtime.annotations.RegisterForReflection;
import mx.sep.dgtic.mejoredu.seguridad.PersonaVO;
import mx.sep.dgtic.mejoredu.seguridad.UsuarioVO;

@RegisterForReflection(targets = {UsuarioVO.class, PersonaVO.class})
public class ReflectionConfiguration {
}
