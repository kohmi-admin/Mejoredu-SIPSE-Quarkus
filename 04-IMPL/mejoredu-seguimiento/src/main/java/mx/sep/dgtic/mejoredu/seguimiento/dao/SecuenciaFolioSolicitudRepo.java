package mx.sep.dgtic.mejoredu.seguimiento.dao;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.sep.dgtic.mejoredu.seguimiento.entity.SecuenciaFolioSolicitud;

@ApplicationScoped
public class SecuenciaFolioSolicitudRepo implements PanacheRepositoryBase<SecuenciaFolioSolicitud, Integer> {

}