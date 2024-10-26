package mx.mejoredu.dgtic.daos;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import mx.mejoredu.dgtic.entidades.PresupuestoUnidad;


import java.util.List;
@ApplicationScoped

public class PresupuestoUnidadRepository implements PanacheRepositoryBase <PresupuestoUnidad, Integer> {
    public List<PresupuestoUnidad> consultaPorAnhioUnidad(int anhio, Integer idUnidad) {
    	String query = "idAnhio = ?1 and idUnidad = ?2";
    	if (idUnidad == null)
    		query = "idAnhio = ?1 and ?2 = ?2";
        return find(query, anhio, idUnidad).list();
    }
    public List<PresupuestoUnidad> consultaPorAnhio(int anhio) {
    	
        return find("idAnhio = ?1", anhio).list();
    }
}
