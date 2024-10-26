package mx.mejoredu.dgtic.daos;


import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.MetAdecuacionProyecto;

import java.util.List;

/**
 * 
 */@ApplicationScoped
public class MetAdecuacionProyectoRepository implements PanacheRepositoryBase<MetAdecuacionProyecto, Integer> {
     public List<MetAdecuacionProyecto> findProyectosDiff() {
         return find("SELECT DISTINCT m.idAdecuacionSolicitud, m.idProyecto FROM MetAdecuacionProyecto m").list();
     }


}    
