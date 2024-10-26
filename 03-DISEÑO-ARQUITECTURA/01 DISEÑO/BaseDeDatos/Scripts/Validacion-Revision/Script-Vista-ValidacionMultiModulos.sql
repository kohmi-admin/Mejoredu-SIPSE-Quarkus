select mcp.id_proyecto from met_cortoplazo_proyecto mcp;
select 352 id_proyecto, id, apartado, id_validacion_supervisor, cs_estatus from (
select  '1 proyecto' apartado, 352 id, cp.id_validacion_supervisor, mv.cs_estatus from met_cortoplazo_proyecto cp, met_validacion mv where cp.id_proyecto = 352 and mv.id_validacion = cp.id_validacion_supervisor
union
select '2 actividades' apartado, ca.id_actividad id, ca.id_validacion_supervisor, mv.cs_estatus from met_cortoplazo_actividad ca, met_cortoplazo_proyecto cp, met_validacion mv 
where cp.id_proyecto = 352 and cp.id_proyecto = ca.id_proyecto and mv.id_validacion = cp.id_validacion_supervisor
union
select '3 productos' apartado, cpro.id_producto id, cpro.id_validacion_supervisor, mv.cs_estatus from met_cortoplazo_producto cpro,  met_cortoplazo_actividad ca, met_cortoplazo_proyecto cp , met_validacion mv
where cp.id_proyecto = 352 and cp.id_proyecto = ca.id_proyecto 
	and ca.id_actividad = cpro.id_actividad and mv.id_validacion = cp.id_validacion_supervisor
union
select '4 presupuesto' apartado, cpre.id_presupuesto id, cpre.id_validacion_supervisor, mv.cs_estatus from met_cortoplazo_presupuesto cpre, met_cortoplazo_producto cpro,  met_cortoplazo_actividad ca, met_cortoplazo_proyecto cp , met_validacion mv
where cp.id_proyecto = 352 and cp.id_proyecto = ca.id_proyecto and ca.id_actividad = cpro.id_actividad
 and cpre.id_producto = cpro.id_producto
  and mv.id_validacion = cp.id_validacion_supervisor
  ) tcpv;
  
  
  /** recuperar estatus por proyecto -Supervisor **/
  drop view vt_proyecto_apartado_estatus;
  create view vt_proyecto_apartado_estatus as
select 
row_number() OVER (ORDER BY `tcpv`.`id_proyecto` desc )  AS `id_secuencia`,
id_proyecto, id, apartado, id_validacion_supervisor, cs_estatus from (
select  cp.id_proyecto , '1 proyecto' apartado, cp.id_proyecto id, cp.id_validacion_supervisor, mv.cs_estatus 
from met_cortoplazo_proyecto cp left outer join met_validacion mv on mv.id_validacion = cp.id_validacion_supervisor
where cp.cs_estatus != 'B'
union
select cp.id_proyecto , '2 actividades' apartado, ca.id_actividad id, ca.id_validacion_supervisor, mv.cs_estatus 
from  met_cortoplazo_proyecto cp, met_cortoplazo_actividad ca left outer join met_validacion mv on mv.id_validacion = ca.id_validacion_supervisor
where cp.id_proyecto = ca.id_proyecto 
and cp.cs_estatus != 'B' and ca.cs_estatus != 'B' 
union
select cp.id_proyecto , '3 productos' apartado, cpro.id_producto id, cpro.id_validacion_supervisor, mv.cs_estatus 
from   met_cortoplazo_actividad ca, met_cortoplazo_proyecto cp , 
	met_cortoplazo_producto cpro left outer join met_validacion mv on mv.id_validacion = cpro.id_validacion_supervisor 
where cp.id_proyecto = ca.id_proyecto 
	and ca.id_actividad = cpro.id_actividad
    and cp.cs_estatus != 'B' and ca.cs_estatus != 'B' and cpro.cs_estatus != 'B'
union
select cp.id_proyecto , '4 presupuesto' apartado, cpre.id_presupuesto id, cpre.id_validacion_supervisor, mv.cs_estatus 
from met_cortoplazo_proyecto cp, met_cortoplazo_producto cpro,  met_cortoplazo_actividad ca, 
	met_cortoplazo_presupuesto cpre left outer join met_validacion mv on mv.id_validacion = cpre.id_validacion_supervisor 
where cp.id_proyecto = ca.id_proyecto and ca.id_actividad = cpro.id_actividad
 and cpre.id_producto = cpro.id_producto
   and cp.cs_estatus != 'B' and ca.cs_estatus != 'B' and cpro.cs_estatus != 'B' and cpre.cs_estatus != 'B'
  ) tcpv
  order by id_secuencia,id_proyecto
  ;
  select * from vt_proyecto_apartado_estatus where id_proyecto = 300;
    /** recuperar estatus por proyecto -Planeación **/
  drop view vt_proyecto_apartado_estatus_plan;
  create view vt_proyecto_apartado_estatus_plan as
select 
row_number() OVER (ORDER BY `tcpv`.`id_proyecto` desc )  AS `id_secuencia`,
id_proyecto, id, apartado, id_validacion_planeacion, cs_estatus from (
select  cp.id_proyecto , '1 proyecto' apartado, cp.id_proyecto id, cp.id_validacion_planeacion, mv.cs_estatus 
from met_cortoplazo_proyecto cp, met_validacion mv 
where  mv.id_validacion = cp.id_validacion_planeacion  and cp.cs_estatus != 'B'
union
select cp.id_proyecto , '2 actividades' apartado, ca.id_actividad id, ca.id_validacion_planeacion, mv.cs_estatus 
from  met_cortoplazo_proyecto cp, met_cortoplazo_actividad ca left outer join met_validacion mv on mv.id_validacion = ca.id_validacion_planeacion
where cp.id_proyecto = ca.id_proyecto 
 and cp.cs_estatus != 'B' and ca.cs_estatus != 'B' 
union
select cp.id_proyecto , '3 productos' apartado, cpro.id_producto id, cpro.id_validacion_planeacion, mv.cs_estatus 
from   met_cortoplazo_actividad ca, met_cortoplazo_proyecto cp , 
	met_cortoplazo_producto cpro left outer join met_validacion mv on mv.id_validacion = cpro.id_validacion_planeacion 
where cp.id_proyecto = ca.id_proyecto 
	and ca.id_actividad = cpro.id_actividad
     and cp.cs_estatus != 'B' and ca.cs_estatus != 'B' and cpro.cs_estatus != 'B' 
union
select cp.id_proyecto , '4 presupuesto' apartado, cpre.id_presupuesto id, cpre.id_validacion_planeacion, mv.cs_estatus 
from met_cortoplazo_proyecto cp, met_cortoplazo_producto cpro,  met_cortoplazo_actividad ca, 
	met_cortoplazo_presupuesto cpre left outer join met_validacion mv on mv.id_validacion = cpre.id_validacion_planeacion 
where cp.id_proyecto = ca.id_proyecto and ca.id_actividad = cpro.id_actividad
 and cp.cs_estatus != 'B' and ca.cs_estatus != 'B' and cpro.cs_estatus != 'B' and cpre.cs_estatus != 'B'
 and cpre.id_producto = cpro.id_producto
  
  ) tcpv
  order by id_secuencia,id_proyecto
  ;
  
    
    /** recuperar estatus por proyecto -Planeación **/
  drop view vt_proyecto_apartado_estatus_presu;
  create view vt_proyecto_apartado_estatus_presu as
select 
row_number() OVER (ORDER BY `tcpv`.`id_proyecto` desc )  AS `id_secuencia`,
id_proyecto, id, apartado, id_validacion, cs_estatus from (
select  cp.id_proyecto , '1 proyecto' apartado, cp.id_proyecto id, cp.id_validacion, mv.cs_estatus 
from met_cortoplazo_proyecto cp, met_validacion mv 
where  mv.id_validacion = cp.id_validacion and cp.cs_estatus != 'B'
union
select cp.id_proyecto , '2 actividades' apartado, ca.id_actividad id, ca.id_validacion, mv.cs_estatus 
from  met_cortoplazo_proyecto cp, met_cortoplazo_actividad ca left outer join met_validacion mv on mv.id_validacion = ca.id_validacion
where cp.id_proyecto = ca.id_proyecto and cp.cs_estatus != 'B' and ca.cs_estatus != 'B'
union
select cp.id_proyecto , '3 productos' apartado, cpro.id_producto id, cpro.id_validacion, mv.cs_estatus 
from   met_cortoplazo_actividad ca, met_cortoplazo_proyecto cp , 
	met_cortoplazo_producto cpro left outer join met_validacion mv on mv.id_validacion = cpro.id_validacion 
where cp.id_proyecto = ca.id_proyecto  
	and cp.cs_estatus != 'B' and ca.cs_estatus != 'B'  and cpro.cs_estatus != 'B'
	and ca.id_actividad = cpro.id_actividad
union
select cp.id_proyecto , '4 presupuesto' apartado, cpre.id_presupuesto id, cpre.id_validacion, mv.cs_estatus 
from met_cortoplazo_proyecto cp, met_cortoplazo_producto cpro,  met_cortoplazo_actividad ca, 
	met_cortoplazo_presupuesto cpre left outer join met_validacion mv on mv.id_validacion = cpre.id_validacion 
where cp.it_semantica=1 and cp.cs_estatus != 'B' and ca.cs_estatus != 'B' and cpro.cs_estatus != 'B' and cpre.cs_estatus != 'B' and cp.id_proyecto = ca.id_proyecto and ca.id_actividad = cpro.id_actividad
 and cpre.id_producto = cpro.id_producto
  
  ) tcpv
  order by id_secuencia,id_proyecto
  ;
  select * from vt_proyecto_apartado_estatus where id_proyecto = 352;
    select * from vt_proyecto_apartado_estatus_plan where id_proyecto = 352;
      select * from vt_proyecto_apartado_estatus_presu where id_proyecto = 352;
      
      
      
  select * from met_cortoplazo_presupuesto where id_validacion_supervisor = 161;
    select * from met_cortoplazo_producto where id_producto = 55;
    select count(*), cs_estatus from met_cortoplazo_producto where id_actividad=1 group by cs_estatus;
      select * from met_cortoplazo_actividad where id_actividad = 1;
          select * from met_cortoplazo_proyecto where id_proyecto = 352;
          
          
select cve_proyecto, count(*) from vt_entregable_producto group by cve_proyecto;


select * from vt_proyecto_apartado_estatus where id_proyecto = 300;