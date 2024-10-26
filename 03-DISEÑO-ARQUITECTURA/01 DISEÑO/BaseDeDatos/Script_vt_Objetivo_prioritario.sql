DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `PROC_BAJA_ESTRATEGIAS_POR_CVEOBJETIVO`(IN cveObjetivo VARCHAR(32), OUT respuesta VARCHAR(8))
    COMMENT 'Da de baja las estrategias y acciones asociadas a un objertivo'
BEGIN
	update cat_master_catalogo set df_baja = current_date() where id_catalogo_padre = 771 and cc_externa = cveObjetivo;
	UPDATE cat_master_catalogo 
SET 
    df_baja = CURRENT_DATE()
WHERE
    id_catalogo_padre = 640
        AND cd_descripcionDos LIKE CONCAT(cveObjetivo, '%');
	SET respuesta='EXITOSO';
SELECT @respuesta;
END;
DELIMITER;
DELIMITER$$
CREATE DEFINER=`root`@`%` PROCEDURE `PROC_BAJA_ACCIONES_POR_CVEOBJETIVO`(IN cveEstrategia VARCHAR(32), OUT respuesta VARCHAR(8))
    COMMENT 'Da de baja las acciones asociadas a una estrategia'
BEGIN
	update cat_master_catalogo set df_baja = current_date() where id_catalogo_padre=640 and cd_descripcionDos like CONCAT(cveEstrategia,'%');
	SET respuesta='EXITOSO';
    select @respuesta;
END;
DELIMITER;