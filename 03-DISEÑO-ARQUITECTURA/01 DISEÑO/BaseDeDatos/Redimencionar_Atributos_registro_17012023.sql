/*Redimencionamiento de atributos de registro*/
/* Proyectos*/
ALTER TABLE `mejoreduDB`.`met_cortoplazo_proyecto` 
CHANGE COLUMN `cx_alcance` `cx_alcance` VARCHAR(2000) NULL DEFAULT NULL ,
CHANGE COLUMN `cx_fundamentacion` `cx_fundamentacion` VARCHAR(2000) NULL DEFAULT NULL ;

/*Actividades*/
ALTER TABLE `mejoreduDB`.`met_cortoplazo_actividad` 
CHANGE COLUMN `cx_nombre_actividad` `cx_nombre_actividad` VARCHAR(200) NOT NULL COMMENT 'campo que almacena el nombre de la actividad' ,
CHANGE COLUMN `cx_descripcion` `cx_descripcion` VARCHAR(600) NULL DEFAULT NULL COMMENT 'campo que almacena la descripcion de la actividad ' ,
CHANGE COLUMN `cx_articulacion_actividad` `cx_articulacion_actividad` VARCHAR(2000) NULL DEFAULT NULL COMMENT 'campo que almacena articulaciones enfocada a la actividad' ;

/*Productos*/
ALTER TABLE `mejoreduDB`.`met_cortoplazo_producto` 
CHANGE COLUMN `cx_nombre` `cx_nombre` VARCHAR(250) NULL DEFAULT NULL COMMENT 'Nombre de producto' ,
CHANGE COLUMN `cx_descripcion` `cx_descripcion` VARCHAR(600) NULL DEFAULT NULL COMMENT 'campo que almacena la descripcion del producto' ,
CHANGE COLUMN `cx_vinculacion_producto` `cx_vinculacion_producto` VARCHAR(600) NULL DEFAULT NULL COMMENT 'Vinculacion con diferentes productos asociados' ;


/*Presupuestos*/
ALTER TABLE `mejoreduDB`.`met_cortoplazo_presupuesto` 
CHANGE COLUMN `cx_nombre_accion` `cx_nombre_accion` VARCHAR(250) NULL DEFAULT NULL COMMENT 'campo que almacena nombre de la accion que se asocia con el presupuesto' ;

/*Mediano Plazo*/
/*Estructura*/
ALTER TABLE `mejoreduDB`.`met_mp_estructura` 
CHANGE COLUMN `cd_analisis_estado` `cd_analisis_estado` VARCHAR(4000) NULL DEFAULT NULL COMMENT 'Descripción del análisis del estado actual' ,
CHANGE COLUMN `cd_problemas_publicos` `cd_problemas_publicos` VARCHAR(4000) NULL DEFAULT NULL COMMENT 'Descripción de los Problemas publicos' ;


/*Objetivo*/ /*Sobre Master Catalogos*/
ALTER TABLE `mejoreduDB`.`cat_master_catalogo` 
CHANGE COLUMN `cd_opcion` `cd_opcion` VARCHAR(2000) NOT NULL COMMENT 'Descripción de la opción del catálogo por ejemplo un catalago de pais la descripción será México\\n' ,
CHANGE COLUMN `cd_descripcionDos` `cd_descripcionDos` VARCHAR(4000) NULL DEFAULT NULL COMMENT 'Descripción Dos de la opción del catalogo' ;

/* Metas para el bienestar - Elementos */
ALTER TABLE `mejoreduDB`.`met_mp_elemento` 
CHANGE COLUMN `cx_nombre` `cx_nombre` VARCHAR(500) NULL DEFAULT NULL COMMENT 'Nombre del elemento ' ,
CHANGE COLUMN `cx_definicion` `cx_definicion` VARCHAR(1300) NULL DEFAULT NULL ,
CHANGE COLUMN `cx_metodo_calculo` `cx_metodo_calculo` VARCHAR(500) NULL DEFAULT NULL COMMENT 'Especificar el metodo de cálculo' ,
CHANGE COLUMN `cx_observacion` `cx_observacion` VARCHAR(500) NULL DEFAULT NULL ;

/* Meta - Parametro */
ALTER TABLE `mejoreduDB`.`met_mp_meta_parametro` 
CHANGE COLUMN `cx_nombre` `cx_nombre` VARCHAR(500) NULL DEFAULT NULL COMMENT 'Se obtiene del nombre de la meta o parámetro que fue registrado en el submódulo de planeación a mediano plazo' ,
CHANGE COLUMN `cx_meta` `cx_meta` VARCHAR(1300) NULL DEFAULT NULL COMMENT 'Campo editable numérico de 4 dígitos de longitud para indicar el año, (se subdivide en dos columnas, en la primera muestra el número que representa esa meta o parámetro y en la segunda el porcentaje que representa dicha meta o parámetro)' ;


/* Seguimiento - Solicitud */
ALTER TABLE `mejoreduDB`.`met_solicitud` 
CHANGE COLUMN `cx_objetivo` `cx_objetivo` VARCHAR(2000) NULL DEFAULT NULL COMMENT 'Descripción abierta alfanumerica con el objetivo de la adecuación' ;






