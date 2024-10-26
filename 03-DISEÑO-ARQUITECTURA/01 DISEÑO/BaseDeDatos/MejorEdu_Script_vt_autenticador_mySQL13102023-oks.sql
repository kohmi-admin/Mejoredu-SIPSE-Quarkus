CREATE VIEW vt_autenticador AS
select sc.id_contra, su.cve_usuario, sc.cx_palabra_secreta, su.cs_estatus, sp.cx_nombre, sp.cx_primer_apellido, sp.cx_segundo_apellido, sp.cx_correo
from seg_usuario su, seg_contrasenhia sc, seg_usuario_persona sup, seg_persona sp
where su.cve_usuario = sc.cve_usuario 
and su.cs_estatus = 'A'
and su.cve_usuario = sup.cve_usuario and sup.id_persona =sp.id_persona;