SELECT a.cve_usuario, a.cx_palabra_secreta, a.cx_nombre, a.cx_primer_apellido, a.cx_segundo_apellido, cat.cd_tipo_usuario 
, catMaster.id_catalogo, catMaster.cd_opcion, catMaster.cc_externa
 FROM mejoreduDB.vt_autenticador a left outer join seg_tipo_usuario cat on cat.id_tipo_usuario = a.id_tipo_usuario,
seg_perfil_laboral pl left outer join cat_master_catalogo catMaster on catMaster.id_catalogo = pl.id_catalogo_unidad
where pl.cve_usuario = a.cve_usuario
order by 3,4,5;