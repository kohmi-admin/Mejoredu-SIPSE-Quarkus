select row_number() OVER (ORDER BY `proy`.`id_proyecto` desc )  AS `id_secuencia`,
`proy`.`id_catalogo_unidad` AS `id_unidad_admiva`,`proy`.`id_proyecto` AS `id_proyecto`,
(max(`act`.`cve_actividad`) + 1) AS `ix_secuencia`,count(`act`.`id_actividad`) AS `LOCK_FLAG`
 from (`met_cortoplazo_proyecto` `proy` join `met_cortoplazo_actividad` `act` on((`proy`.`id_proyecto` = `act`.`id_proyecto`))) 
 where ((`proy`.`id_catalogo_unidad` is not null) and (`proy`.`cs_estatus` <> 'B')) 
group by `proy`.`id_proyecto`;

select * from met_cortoplazo_actividad where id_proyecto = 548;