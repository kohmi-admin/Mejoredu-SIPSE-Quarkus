
CREATE VIEW vt_paa_aprobado 
AS
SELECT cp.id_anhio, 'PAA_Aprobado' origen, cp.cve_unidad, CONCAT(RIGHT(cp.id_anhio,2) ,'1',cp.cve_proyecto) cve_proyecto, cp.cx_nombre_proyecto
, CONCAT(RIGHT(cp.id_anhio,2) ,'1',cp.cve_proyecto,'-',ca.cve_actividad) cve_actividad, ca.cx_nombre_actividad
, CONCAT(RIGHT(cp.id_anhio,2) ,'1',cp.cve_proyecto,'-',ca.cve_actividad,'-',cpro.cve_producto,'-','0',mcCatego.cc_externa,'-', mcTipo.cc_externa) cve_producto, cpro.cx_nombre
, mcCatego.cd_opcion categoria
, mcTipo.cd_opcion tipo
FROM mejoreduDB.met_cortoplazo_proyecto cp, mejoreduDB.met_validacion mv
, mejoreduDB.met_cortoplazo_actividad ca
, mejoreduDB.met_cortoplazo_producto cpro 
	left outer join cat_master_catalogo mcCatego on cpro.id_catalogo_categorizacion = mcCatego.id_catalogo
    left outer join cat_master_catalogo mcTipo on cpro.id_catalogo_tipo_producto = mcTipo.id_catalogo
where cp.it_semantica = 1 and cp.cs_estatus != 'B' and cp.id_validacion_supervisor = mv.id_validacion and mv.cs_estatus in ('O')
and cp.id_proyecto = ca.id_proyecto and ca.cs_estatus != 'B'
and ca.id_actividad = cpro.id_actividad  and cpro.cs_estatus != 'B'
;

select * from cat_master_catalogo where id_catalogo_padre = 2222;


select * from vt_paa_aprobado;