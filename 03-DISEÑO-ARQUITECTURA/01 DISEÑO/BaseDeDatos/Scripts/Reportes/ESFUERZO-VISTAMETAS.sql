update met_cortoplazo_proyecto cpp, cat_master_catalogo mc
set cpp.id_Catalogo_unidad = mc.id_catalogo  
where cpp.cve_unidad = mc.cc_externa
 and cpp.cve_unidad in (select cc_externa from cat_master_catalogo where id_catalogo_padre=2059)  
 and mc.id_catalogo_padre = 2059;

select * from vt_metasBienestar;

select * from met_cortoplazo_proyecto cpp, cat_master_catalogo mc
where cpp.cve_unidad = mc.cc_externa 
and cpp.cve_unidad in (select cc_externa from cat_master_catalogo where id_catalogo_padre=2059) 
and mc.id_catalogo_padre = 2059;

update  mejoreduDB.met_cortoplazo_producto SET id_catalogo_categorizacion = 839 where id_catalogo_categorizacion is null;

 select * from mejoreduDB.met_cortoplazo_producto where id_catalogo_categorizacion is null;
 
 commit;