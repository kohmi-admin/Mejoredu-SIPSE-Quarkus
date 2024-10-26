CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_presupuestal` (
  `id_presupuestal` INT NOT NULL AUTO_INCREMENT,
  `df_registro` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `df_actualizacion` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `df_aprobacion` TIMESTAMP NULL,
  `cs_estatus` CHAR(1) NULL,
  `cve_usuario` VARCHAR(45) NOT NULL COMMENT 'Clave asociada al usuario que registra en el año indicado, referencia con la tabla seg_usuario',
  `id_anhio` INT NOT NULL COMMENT 'Identificador del año de planeación de entrada se cargan los 5 ultimos años y el vigente, se relaciona con la tabla met_anho_planeacion',
  `id_tipo_programa` INT NOT NULL COMMENT 'Identificador del tipo del programa presupuestal registrado, el cuál podra ser P016, M001 y O001',
  PRIMARY KEY (`id_presupuestal`),
  INDEX `fk_met_presupuestal_seg_usuario2_idx` (`cve_usuario` ASC) VISIBLE,
  INDEX `fk_met_presupuestal_met_anho_planeacion2_idx` (`id_anhio` ASC) VISIBLE,
  INDEX `fk_met_presupuestal_cat_master_catalogo1_idx` (`id_tipo_programa` ASC) VISIBLE,
  CONSTRAINT `fk_met_presupuestal_seg_usuario2`
    FOREIGN KEY (`cve_usuario`)
    REFERENCES `mejoreduDB`.`seg_usuario` (`cve_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_presupuestal_met_anho_planeacion2`
    FOREIGN KEY (`id_anhio`)
    REFERENCES `mejoreduDB`.`met_anho_planeacion` (`id_anhio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_presupuestal_cat_master_catalogo1`
    FOREIGN KEY (`id_tipo_programa`)
    REFERENCES `mejoreduDB`.`cat_master_catalogo` (`id_catalogo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB