CREATE TABLE IF NOT EXISTS `mejoreduDB`.`met_diagnostico` (
  `id_diagnostico` INT NOT NULL AUTO_INCREMENT COMMENT 'Identificador del registro de diagnostico de la tabla met_diagnostico',
  `cx_antecedentes` LONGTEXT NULL COMMENT 'Campo que almacena los antecedentes',
  `cx_definicion_problema` VARCHAR(300) NULL COMMENT 'Campo que almacena la definicion del problema',
  `cx_estado_problema` LONGTEXT NULL COMMENT 'Campo que almacena el estado del problema',
  `cx_evolucion_problema` LONGTEXT NULL COMMENT 'Campo que almacena la evolucion del problema',
  `cx_cobertura` LONGTEXT NULL COMMENT 'Campo que almacena la cobertura que tiene el problema',
  `cx_identificacion_poblacion_potencial` LONGTEXT NULL COMMENT 'Campo que almacena la identificacion de poblacion potencial del problema',
  `cx_identificacion_poblacion_objetivo` LONGTEXT NULL COMMENT 'Campo que almacena la identificacion de poblacion objetivo',
  `cx_cuantificacion_poblacion_objetivo` LONGTEXT NULL COMMENT 'Campo que almacena la cuantificacion de problema de poblacion objetivo',
  `cx_frecuencia_actualizacion_potencialobjetivo` VARCHAR(80) NULL COMMENT 'Campo que almacena la frecuencia de actualizacion potencial u objetivo',
  `cx_analisis_alternativas` LONGTEXT NULL COMMENT 'Campo que almacena un analisis de alternativas del diagnostico del problema',
  `df_fecha_registro` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `id_presupuestal` INT NOT NULL,
  PRIMARY KEY (`id_diagnostico`),
  INDEX `fk_met_diagnostico_met_presupuestal1_idx` (`id_presupuestal` ASC) VISIBLE,
  CONSTRAINT `fk_met_diagnostico_met_presupuestal1`
    FOREIGN KEY (`id_presupuestal`)
    REFERENCES `mejoreduDB`.`met_presupuestal` (`id_presupuestal`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3