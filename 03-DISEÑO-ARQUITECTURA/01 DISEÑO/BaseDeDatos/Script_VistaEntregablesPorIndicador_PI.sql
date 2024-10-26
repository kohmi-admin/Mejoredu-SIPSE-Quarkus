drop view vt_productoActivoEntregable;

create view vt_productoActivoEntregable as
SELECT ccp.id_producto, ccp.id_catalogo_indicador_pl id_indicador, (select sum(ci_monto) from met_producto_calendario cpCale where cpCale.id_producto = ccp.id_producto) entregables  
FROM mejoreduDB.met_cortoplazo_producto ccp where cs_estatus <> 'B' and id_catalogo_indicador_pl is not null;


select * from vt_actividadObjetivo;