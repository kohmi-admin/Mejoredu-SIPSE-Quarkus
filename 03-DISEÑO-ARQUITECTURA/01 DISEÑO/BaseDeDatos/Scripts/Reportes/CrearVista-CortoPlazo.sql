/* Proyectos registrados en corto plazo */
Select count(*) total, cve_unidad, cs_estatus from vt_cp_proyecto
where cs_estatus != 'B'
group by cve_unidad, cs_estatus;

/*Total de productos*/
Select count(*) total from vt_cp_proyecto
where cs_estatus != 'B'
;

/*Total de Actividades*/
Select count(mca.id_actividad) total from vt_cp_proyecto vcp, met_cortoplazo_actividad mca
where vcp.cs_estatus != 'B' 
and mca.id_proyecto = vcp.id_proyecto and mca.cs_estatus != 'B'
;
/*Total de Productos*/
Select count(mcp.id_producto) total 
from vt_cp_proyecto vcp, met_cortoplazo_actividad mca, met_cortoplazo_producto mcp
where vcp.cs_estatus != 'B' 
and mca.id_proyecto = vcp.id_proyecto and mca.cs_estatus != 'B'
and mca.id_actividad = mcp.id_actividad and mcp.cs_estatus != 'B'
;

/* Total de Entregables*/
select count(id_prodcal) from vt_entregable_producto;

/* Listado del proyecto por unidad - Categorización y Total de productos*/
select cve_unidad, id_catalogo_unidad, cve_proyecto, cx_nombre_proyecto, cmc.cd_opcion, (id_catalogo_unidad) total
from vt_entregable_producto vep 
	left outer join cat_master_catalogo cmc on vep.id_catalogo_unidad = cmc.id_catalogo
where id_anhio = 2023
group by cve_unidad, id_catalogo_unidad, cve_proyecto, cx_nombre_proyecto;

/* Total por categorización*/
select count(id_catalogo_categorizacion) total, id_catalogo_categorizacion 
from vt_entregable_producto
group by id_catalogo_categorizacion;

/* Total por tipo*/
select count(id_catalogo_tipo_producto) total, id_catalogo_tipo_producto 
from vt_entregable_producto
group by id_catalogo_tipo_producto;

/* Entregables del producto*/
drop view vt_entregable_producto;
create view vt_entregable_producto as
select vcp.id_anhio ,vcp.cve_proyecto, vcp.cve_unidad, vcp.id_catalogo_unidad, vcp.cve_usuario, vcp.cx_nombre_proyecto,
mca.id_actividad, 
mcp.id_producto, mcp.id_catalogo_categorizacion, mcp.id_catalogo_tipo_producto,
mpcal.id_prodcal, mpcal.ci_monto, mpcal.ci_mes
from  vt_cp_proyecto vcp, met_cortoplazo_actividad mca, met_cortoplazo_producto mcp, met_producto_calendario mpcal
where vcp.cs_estatus != 'B'
and vcp.id_proyecto = mca.id_proyecto and mca.cs_estatus != 'B'
and mca.id_actividad = mcp.id_actividad and mcp.cs_estatus != 'B'
and mcp.id_producto = mpcal.id_producto;

select * from vt_entregable_producto;

/* Proyectos registrados en corto plazo */
Select count(*) total, cs_estatus from met_cortoplazo_actividad
where cs_estatus != 'B' and id_proyecto in (select id_proyecto from met_cortoplazo_proyecto
where it_semantica = 1 and cs_estatus != 'B')
group by cs_estatus
;
/* Proyectos registrados en corto plazo */
drop view vt_cp_proyecto;
create view vt_cp_proyecto as
select * from met_cortoplazo_proyecto
where it_semantica = 1 and cs_estatus != 'B';

/* Solicitudes a proyectos en Seguimiento */
drop view vt_seguimiento_proyecto;
create view vt_seguimiento_proyecto as
select * from met_cortoplazo_proyecto
where it_semantica = 2 and cs_estatus != 'B';

