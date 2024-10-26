create view vt_secuencia_negocio as
select row_number() OVER(ORDER BY cve_unidad DESC) as id_secuencia,
cve_unidad as id_unidad_admiva,
max(id_proyecto)+1 ix_secuencia,
count(id_proyecto) LOCK_FLAG 
from met_cortoplazo_proyecto 
where cve_unidad is not null and cs_estatus in ('C', 'I')
group by cve_unidad;