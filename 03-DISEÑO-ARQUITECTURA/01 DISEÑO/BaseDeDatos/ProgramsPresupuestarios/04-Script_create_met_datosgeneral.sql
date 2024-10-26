CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_datosgeneral` (
  `id_datosgenerales` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador del resgistro de datos generales de la tabla met_presupuestal_datosgenerales',
  `cx_nombre_programa` VARCHAR(50) NULL COMMENT 'Campo que almacena nombre del programa presupuestal',
  `id_ramo_sector` INT NULL COMMENT 'Campo que enlista el nombre del ramo o el sector del plan presupuestal',
  `id_unidad_responsable` INT NULL COMMENT 'Campo que enlista la unidad responsable del programa presupuestal',
  `cx_finalidad` VARCHAR(200) NULL COMMENT 'Campo que almacena la fina lidad del plan ',
  `cx_funcion` VARCHAR(50) NULL COMMENT 'Campo que almacena la funcion del plan',
  `cx_subfuncion` VARCHAR(50) NULL COMMENT 'Campo que almacena la subfuncion del plan presupuestal',
  `cx_actividad_institucional` VARCHAR(50) NULL COMMENT 'Campo que almacena la actividad institucional',
  `df_fecha_registro` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Campo que almacena el año de registro',
  `id_vinculacion_ODS` INT NULL COMMENT 'Campo que enlista la vinculación de la programación presupuestal con los ODS',
  `id_presupuestal` INT NOT NULL,
  PRIMARY KEY (`id_datosgenerales`),
  INDEX `fk_met_datosgeneral_met_presupuestal1_idx` (`id_presupuestal` ASC) VISIBLE,
  INDEX `fk_met_datosgeneral_cat_master_catalogo1_idx` (`id_ramo_sector` ASC) VISIBLE,
  INDEX `fk_met_datosgeneral_cat_master_catalogo2_idx` (`id_unidad_responsable` ASC) VISIBLE,
  INDEX `fk_met_datosgeneral_cat_master_catalogo3_idx` (`id_vinculacion_ODS` ASC) VISIBLE,
  CONSTRAINT `fk_met_datosgeneral_met_presupuestal1`
    FOREIGN KEY (`id_presupuestal`)
    REFERENCES `mejoreduDB`.`met_presupuestal` (`id_presupuestal`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_datosgeneral_cat_master_catalogo1`
    FOREIGN KEY (`id_ramo_sector`)
    REFERENCES `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_datosgeneral_cat_master_catalogo2`
    FOREIGN KEY (`id_unidad_responsable`)
    REFERENCES `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_datosgeneral_cat_master_catalogo3`
    FOREIGN KEY (`id_vinculacion_ODS`)
    REFERENCES `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3