CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_archivos_programa` (
  `id_archivo` INT NOT NULL,
  `id_presupuestal` INT NOT NULL,
  PRIMARY KEY (`id_archivo`, `id_presupuestal`),
  INDEX `fk_met_archivo_has_met_presupuestal_met_presupuestal1_idx` (`id_presupuestal` ASC) VISIBLE,
  INDEX `fk_met_archivo_has_met_presupuestal_met_archivo1_idx` (`id_archivo` ASC) VISIBLE,
  CONSTRAINT `fk_met_archivo_has_met_presupuestal_met_archivo1`
    FOREIGN KEY (`id_archivo`)
    REFERENCES `mejoreduDB`.`met_archivo` (`id_archivo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_met_archivo_has_met_presupuestal_met_presupuestal1`
    FOREIGN KEY (`id_presupuestal`)
    REFERENCES `mejoreduDB`.`met_presupuestal` (`id_presupuestal`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB