/* Presupuestal */
ALTER TABLE `mejoreduDB`.`met_presupuestal` 
ADD COLUMN `id_validacion` INT NULL DEFAULT NULL AFTER `id_tipo_programa`,
ADD COLUMN `id_validacion_planeacion` INT NULL DEFAULT NULL AFTER `id_validacion`,
ADD COLUMN `id_validacion_supervisor` INT NULL DEFAULT NULL AFTER `id_validacion_planeacion`;


/*Datos generales */

ALTER TABLE `mejoreduDB`.`met_datosgeneral` 
ADD COLUMN `id_validacion` INT NULL DEFAULT NULL AFTER `id_presupuestal`,
ADD COLUMN `id_validacion_planeacion` INT NULL DEFAULT NULL AFTER `id_validacion`,
ADD COLUMN `id_validacion_supervisor` INT NULL DEFAULT NULL AFTER `id_validacion_planeacion`;

/* Diagnostico */

ALTER TABLE `mejoreduDB`.`met_diagnostico` 
ADD COLUMN `id_validacion` INT NULL DEFAULT NULL AFTER `id_presupuestal`,
ADD COLUMN `id_validacion_planeacion` INT NULL DEFAULT NULL AFTER `id_validacion`,
ADD COLUMN `id_validacion_supervisor` INT NULL DEFAULT NULL AFTER `id_validacion_planeacion`;


/* Arbol del problema y objetivo */
ALTER TABLE `mejoreduDB`.`met_arbol` 
ADD COLUMN `id_validacion` INT NULL DEFAULT NULL AFTER `id_presupuestal`,
ADD COLUMN `id_validacion_planeacion` INT NULL DEFAULT NULL AFTER `id_validacion`,
ADD COLUMN `id_validacion_supervisor` INT NULL DEFAULT NULL AFTER `id_validacion_planeacion`;


/* Indicadores de resultados */
ALTER TABLE `mejoreduDB`.`met_indicador_resultado` 
ADD COLUMN `id_validacion` INT NULL AFTER `id_ficha_indicadores`,
ADD COLUMN `id_validacion_planeacion` INT NULL AFTER `id_validacion`,
ADD COLUMN `id_validacion_supervisor` INT NULL AFTER `id_validacion_planeacion`;

/* FichasIndicadores M001 y O001 */
ALTER TABLE `mejoreduDB`.`met_ficha_indicadores` 
ADD COLUMN `id_validacion` INT NULL AFTER `cx_descripcion_vinculacion`,
ADD COLUMN `id_validacion_planeacion` INT NULL AFTER `id_validacion`,
ADD COLUMN `id_validacion_supervisor` INT NULL AFTER `id_validacion_planeacion`;


/* Arbol */
ALTER TABLE `mejoreduDB`.`met_arbol` 
ADD COLUMN `id_validacion` INT NULL DEFAULT NULL AFTER `id_archivo`,
ADD COLUMN `id_validacion_planeacion` INT NULL DEFAULT NULL AFTER `id_validacion`,
ADD COLUMN `id_validacion_supervisor` INT NULL DEFAULT NULL AFTER `id_validacion_planeacion`;

