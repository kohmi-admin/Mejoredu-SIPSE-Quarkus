CREATE VIEW `vt_anhio_vigente` AS
select id_anhio, current_date() fecha, current_time() hora from met_anho_planeacion where cs_estatus = 'A';