Create view vt_objetivoEstraAccion as
select 
ap.id_anhio, 
objPri.id_catalogo, objPri.cd_opcion, objPri.cc_externa, 
estra.id_catalogo idCatEstra, estra.cd_opcion cd_opcionEstra, estra.cc_externa cc_externaEstra ,
acc.id_catalogo idCatAcc, acc.cd_opcion cd_opcionAcc, acc.cc_externa cc_externaAcc
from met_anho_planeacion ap , cat_master_catalogo objPri, cat_master_catalogo estra, cat_master_catalogo acc 
where 
ap.df_baja is null and
objPri.id_catalogo_padre = 592 and objPri.df_baja is null
and  estra.id_catalogo_padre = 771 and estra.df_baja is null
and objPri.cc_externa = estra.cc_externa
and acc.id_catalogo_padre = 640 and acc.df_baja is null
and estra.cc_externaDos = acc.cd_descripcionDos/**/
;
select * from vt_objetivoEstraAccion where id_anhio = 2024;